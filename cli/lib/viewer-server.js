/**
 * TeamSpec Viewer - Standalone Server
 * 
 * A lightweight HTTP server that serves the TeamSpec Viewer frontend
 * and provides API endpoints for browsing TeamSpec artifacts.
 * 
 * This is a pure Node.js implementation with no external dependencies
 * (except for 'yaml' which is already a CLI dependency).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// MIME types for serving static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
};

// =============================================================================
// File System Utilities
// =============================================================================

/**
 * Recursively find all markdown files in a directory
 */
async function findMarkdownFiles(dir) {
    const files = [];

    try {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip common non-relevant directories
                if (!['node_modules', '.git', 'dist', 'build', '.teamspec'].includes(entry.name)) {
                    const subFiles = await findMarkdownFiles(fullPath);
                    files.push(...subFiles);
                }
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        // Directory doesn't exist or can't be read
    }

    return files;
}

/**
 * Extract title from markdown content
 */
function extractTitle(content, filePath) {
    const lines = content.split(/\r?\n/);

    // Check for YAML frontmatter title first
    let startIndex = 0;
    if (lines[0]?.trim() === '---') {
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                startIndex = i + 1;
                break;
            }
            const titleMatch = lines[i].match(/^title:\s*["']?([^"'\n]+)["']?\s*$/);
            if (titleMatch) {
                return titleMatch[1].trim();
            }
        }
    }

    // Fallback: Find first heading after frontmatter
    for (let i = startIndex; i < lines.length; i++) {
        const match = lines[i].match(/^#\s+(.+)$/);
        if (match) {
            const title = match[1].trim();
            if (!title.startsWith('===') && !title.includes('LLM Retrieval')) {
                let cleanTitle = title.replace(/`/g, '').trim();

                // Handle artifact heading patterns
                const artifactMatch = cleanTitle.match(
                    /^(?:Business Analysis|Feature|Epic|Solution Design|Technical Architecture|Feature Increment|Story|Test Case|Regression Test|Bug Report):\s*(?:ba|f|epic|sd|ta|fi|s|tc|rt|bug)-[\w-]+-(\d+)-(.+)$/i
                );
                if (artifactMatch) {
                    return artifactMatch[2]
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }

                const storyMatch = cleanTitle.match(/^Story:\s*s-e\d+-\d+-(.+)$/i);
                if (storyMatch) {
                    return storyMatch[1]
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }

                return cleanTitle;
            }
        }
    }

    return path.basename(filePath, '.md');
}

/**
 * Extract metadata from markdown frontmatter
 */
function extractMetadata(content) {
    const typeMatch = content.match(/artifact_kind:\s*(\w+)/);
    const roleMatch = content.match(/role_owner:\s*(\w+)/);
    const statusMatch = content.match(/\|\s*\*\*Status\*\*\s*\|\s*([^|]+)\|/);

    let type = typeMatch?.[1] || 'unknown';

    // Normalize artifact types
    const typeMap = {
        'fi': 'feature-increment',
        'feature': 'feature',
        'epic': 'epic',
        'story': 'story',
        'ba': 'business-analysis',
        'bai': 'business-analysis-increment',
        'devplan': 'dev-plan',
        'sd': 'solution-design',
        'ta': 'technical-architecture',
        'tc': 'test-case',
        'rt': 'regression-test',
        'sdi': 'solution-design-increment',
        'tai': 'technical-architecture-increment',
    };

    type = typeMap[type] || type;

    return {
        type,
        role: roleMatch?.[1] || 'unknown',
        status: statusMatch?.[1]?.trim() || undefined,
    };
}

/**
 * Check if content has TBD markers
 */
function hasTBDMarkers(content) {
    return /\{TBD[^}]*\}/.test(content);
}

/**
 * Extract snippet around query match
 */
function extractSnippet(content, query) {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) return '';

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 100);

    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet.replace(/\r?\n/g, ' ').trim();
}

// =============================================================================
// API Handlers
// =============================================================================

class ViewerAPI {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }

    /**
     * Get list of products
     */
    async getProducts() {
        const productsDir = path.join(this.workspaceRoot, 'products');
        const products = [];

        try {
            const entries = await fs.promises.readdir(productsDir, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const productYmlPath = path.join(productsDir, entry.name, 'product.yml');
                    let metadata = { id: entry.name, name: entry.name };

                    try {
                        const ymlContent = await fs.promises.readFile(productYmlPath, 'utf-8');
                        const yaml = require('yaml');
                        const parsed = yaml.parse(ymlContent);
                        metadata = {
                            id: entry.name,
                            name: parsed.name || entry.name,
                            prefix: parsed.prefix,
                            description: parsed.description,
                        };
                    } catch (e) {
                        // No product.yml or invalid
                    }

                    products.push(metadata);
                }
            }
        } catch (error) {
            // products directory doesn't exist
        }

        return { products };
    }

    /**
     * Get list of projects
     */
    async getProjects() {
        const projectsDir = path.join(this.workspaceRoot, 'projects');
        const projects = [];

        try {
            const entries = await fs.promises.readdir(projectsDir, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const projectYmlPath = path.join(projectsDir, entry.name, 'project.yml');
                    let metadata = { id: entry.name, name: entry.name };

                    try {
                        const ymlContent = await fs.promises.readFile(projectYmlPath, 'utf-8');
                        const yaml = require('yaml');
                        const parsed = yaml.parse(ymlContent);
                        metadata = {
                            id: entry.name,
                            name: parsed.name || entry.name,
                            targetProducts: parsed.target_products || [],
                            status: parsed.status,
                        };
                    } catch (e) {
                        // No project.yml or invalid
                    }

                    projects.push(metadata);
                }
            }
        } catch (error) {
            // projects directory doesn't exist
        }

        return { projects };
    }

    /**
     * Get artifacts by type and scope
     */
    async getArtifacts(type, scope, scopeId) {
        const artifacts = [];
        let dir;

        // Determine directory based on type and scope
        const typeToDir = {
            'feature': 'features',
            'business-analysis': 'business-analysis',
            'solution-design': 'solution-designs',
            'technical-architecture': 'technical-architecture',
            'feature-increment': 'feature-increments',
            'epic': 'epics',
            'story': 'stories',
            'test-case': 'qa/test-cases',
            'regression-test': 'qa/regression-tests',
            'dev-plan': 'dev-plans',
            'ba-increment': 'business-analysis-increments',
            'sdi': 'solution-design-increments',
            'tai': 'technical-architecture-increments',
        };

        const subDir = typeToDir[type];
        if (!subDir) {
            return { artifacts: [] };
        }

        if (scope === 'product') {
            dir = path.join(this.workspaceRoot, 'products', scopeId, subDir);
        } else {
            dir = path.join(this.workspaceRoot, 'projects', scopeId, subDir);
        }

        try {
            const files = await this.findArtifactsInDir(dir);

            for (const filePath of files) {
                const content = await fs.promises.readFile(filePath, 'utf-8');
                const title = extractTitle(content, filePath);
                const metadata = extractMetadata(content);
                const relativePath = path.relative(this.workspaceRoot, filePath).replace(/\\/g, '/');

                artifacts.push({
                    id: path.basename(filePath, '.md'),
                    path: relativePath,
                    title,
                    type: metadata.type,
                    status: metadata.status,
                    hasTBD: hasTBDMarkers(content),
                });
            }
        } catch (error) {
            // Directory doesn't exist
        }

        return { artifacts };
    }

    /**
     * Find artifacts in a directory (handles stories subdirectories)
     */
    async findArtifactsInDir(dir) {
        const files = [];

        try {
            const entries = await fs.promises.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // For stories, check subdirectories
                    const subFiles = await this.findArtifactsInDir(fullPath);
                    files.push(...subFiles);
                } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Directory doesn't exist
        }

        return files;
    }

    /**
     * Get artifact content by path
     */
    async getArtifactContent(artifactPath) {
        const fullPath = path.join(this.workspaceRoot, artifactPath);

        // Security: ensure path is within workspace
        if (!fullPath.startsWith(this.workspaceRoot)) {
            throw new Error('Invalid path');
        }

        const content = await fs.promises.readFile(fullPath, 'utf-8');
        return { content, path: artifactPath };
    }

    /**
     * Search artifacts
     */
    async search(query, filters = {}) {
        if (!query || query.trim().length === 0) {
            return { query, results: [], count: 0 };
        }

        const productsDir = path.join(this.workspaceRoot, 'products');
        const projectsDir = path.join(this.workspaceRoot, 'projects');

        const [productFiles, projectFiles] = await Promise.all([
            findMarkdownFiles(productsDir),
            findMarkdownFiles(projectsDir),
        ]);

        const allFiles = [...productFiles, ...projectFiles];
        const results = [];
        const lowerQuery = query.toLowerCase();

        for (const filePath of allFiles) {
            try {
                const content = await fs.promises.readFile(filePath, 'utf-8');

                if (!content.toLowerCase().includes(lowerQuery)) {
                    continue;
                }

                const metadata = extractMetadata(content);

                // Apply filters
                if (filters.type && filters.type !== 'all' && metadata.type !== filters.type) {
                    continue;
                }
                if (filters.role && filters.role !== 'all' && metadata.role !== filters.role) {
                    continue;
                }

                const title = extractTitle(content, filePath);
                const snippet = extractSnippet(content, query);
                const id = path.basename(filePath, '.md');

                results.push({
                    id,
                    title,
                    type: metadata.type,
                    path: path.relative(this.workspaceRoot, filePath).replace(/\\/g, '/'),
                    snippet,
                    role: metadata.role,
                });
            } catch (error) {
                // Skip files that can't be read
            }
        }

        // Sort by title match relevance
        results.sort((a, b) => {
            const aMatch = a.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
            const bMatch = b.title.toLowerCase().includes(lowerQuery) ? 1 : 0;
            return bMatch - aMatch;
        });

        return {
            query,
            results: results.slice(0, 50),
            count: results.length,
        };
    }

    /**
     * Update artifact status
     */
    async updateStatus(artifactPath, newStatus) {
        const fullPath = path.join(this.workspaceRoot, artifactPath);

        // Security check
        if (!fullPath.startsWith(this.workspaceRoot)) {
            throw new Error('Invalid path');
        }

        let content = await fs.promises.readFile(fullPath, 'utf-8');

        // Update status in the metadata table
        const statusPattern = /(\|\s*\*\*Status\*\*\s*\|\s*)([^|]+)(\|)/;
        if (statusPattern.test(content)) {
            content = content.replace(statusPattern, `$1${newStatus} $3`);
            await fs.promises.writeFile(fullPath, content, 'utf-8');
            return { success: true };
        }

        return { success: false, error: 'Status field not found' };
    }
}

// =============================================================================
// HTTP Server
// =============================================================================

function createViewerServer(options = {}) {
    const {
        workspaceRoot = process.cwd(),
        port = 3456,
        staticDir = null, // Path to built frontend files
        openBrowser = true,
    } = options;

    const api = new ViewerAPI(workspaceRoot);

    // Determine static files directory
    const frontendDir = staticDir || path.join(__dirname, '..', 'viewer-dist');
    const hasFrontend = fs.existsSync(path.join(frontendDir, 'index.html'));

    const server = http.createServer(async (req, res) => {
        const parsedUrl = new URL(req.url, `http://localhost:${port}`);
        const pathname = parsedUrl.pathname;
        const query = Object.fromEntries(parsedUrl.searchParams);

        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // API routes
        if (pathname.startsWith('/api/')) {
            res.setHeader('Content-Type', 'application/json');

            try {
                let result;

                // Health check
                if (pathname === '/api/health') {
                    result = { status: 'ok' };
                }
                // Products
                else if (pathname === '/api/products') {
                    result = await api.getProducts();
                }
                // Projects
                else if (pathname === '/api/projects') {
                    result = await api.getProjects();
                }
                // Artifacts by type
                else if (pathname.match(/^\/api\/(products|projects)\/([^/]+)\/(features|business-analysis|solution-designs|technical-architecture|feature-increments|epics|stories|dev-plans|qa\/test-cases|qa\/regression-tests)/)) {
                    const match = pathname.match(/^\/api\/(products|projects)\/([^/]+)\/(.+)$/);
                    const scope = match[1] === 'products' ? 'product' : 'project';
                    const scopeId = match[2];
                    const typeMap = {
                        'features': 'feature',
                        'business-analysis': 'business-analysis',
                        'solution-designs': 'solution-design',
                        'technical-architecture': 'technical-architecture',
                        'feature-increments': 'feature-increment',
                        'epics': 'epic',
                        'stories': 'story',
                        'dev-plans': 'dev-plan',
                        'qa/test-cases': 'test-case',
                        'qa/regression-tests': 'regression-test',
                    };
                    const type = typeMap[match[3]] || match[3];
                    result = await api.getArtifacts(type, scope, scopeId);
                }
                // Artifact content
                else if (pathname === '/api/artifacts/content') {
                    const artifactPath = query.path;
                    if (!artifactPath) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ error: 'Missing path parameter' }));
                        return;
                    }
                    result = await api.getArtifactContent(artifactPath);
                }
                // Search
                else if (pathname === '/api/search') {
                    const searchQuery = query.q || '';
                    const filters = {
                        type: query.type,
                        role: query.role,
                    };
                    result = await api.search(searchQuery, filters);
                }
                // Status update
                else if (pathname === '/api/artifacts/status' && req.method === 'PATCH') {
                    let body = '';
                    req.on('data', chunk => body += chunk);
                    await new Promise(resolve => req.on('end', resolve));
                    const { path: artifactPath, status } = JSON.parse(body);
                    result = await api.updateStatus(artifactPath, status);
                }
                else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: 'Not found' }));
                    return;
                }

                res.writeHead(200);
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: error.message }));
            }
            return;
        }

        // Serve static files
        if (hasFrontend) {
            let filePath = path.join(frontendDir, pathname === '/' ? 'index.html' : pathname);

            // SPA fallback: serve index.html for non-file routes
            if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                filePath = path.join(frontendDir, 'index.html');
            }

            try {
                const content = await fs.promises.readFile(filePath);
                const ext = path.extname(filePath).toLowerCase();
                const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

                res.setHeader('Content-Type', mimeType);
                res.writeHead(200);
                res.end(content);
            } catch (error) {
                res.writeHead(404);
                res.end('Not found');
            }
        } else {
            // No frontend available, show info page
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>TeamSpec Viewer API</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #667eea; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
        pre { background: #f0f0f0; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .endpoint { margin: 15px 0; padding: 10px; border-left: 3px solid #667eea; background: #f8f9fa; }
    </style>
</head>
<body>
    <h1>🚀 TeamSpec Viewer API</h1>
    <p>The API server is running. Available endpoints:</p>
    
    <div class="endpoint">
        <code>GET /api/health</code> - Health check
    </div>
    <div class="endpoint">
        <code>GET /api/products</code> - List all products
    </div>
    <div class="endpoint">
        <code>GET /api/projects</code> - List all projects
    </div>
    <div class="endpoint">
        <code>GET /api/products/:id/features</code> - Get features for a product
    </div>
    <div class="endpoint">
        <code>GET /api/projects/:id/feature-increments</code> - Get feature increments
    </div>
    <div class="endpoint">
        <code>GET /api/search?q=query</code> - Search artifacts
    </div>
    <div class="endpoint">
        <code>GET /api/artifacts/content?path=...</code> - Get artifact content
    </div>
    
    <h2>Workspace Root</h2>
    <pre>${workspaceRoot}</pre>
    
    <p><em>Note: The frontend UI is not bundled. Run with the full viewer for the UI.</em></p>
</body>
</html>
            `);
        }
    });

    return {
        start: () => {
            return new Promise((resolve) => {
                server.listen(port, () => {
                    console.log(`\n🚀 TeamSpec Viewer running at http://localhost:${port}`);
                    console.log(`📁 Workspace: ${workspaceRoot}\n`);

                    if (openBrowser) {
                        // Open browser
                        const openCmd = process.platform === 'win32' ? 'start' :
                            process.platform === 'darwin' ? 'open' : 'xdg-open';
                        require('child_process').exec(`${openCmd} http://localhost:${port}`);
                    }

                    resolve(server);
                });
            });
        },
        stop: () => {
            return new Promise((resolve) => {
                server.close(resolve);
            });
        },
    };
}

module.exports = {
    createViewerServer,
    ViewerAPI,
};
