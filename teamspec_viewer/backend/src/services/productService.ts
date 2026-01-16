import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKSPACE_ROOT = join(__dirname, '..', '..', '..', '..');

export interface Product {
    id: string;
    name: string;
    prefix: string;
    status: string;
    description: string;
    projectCount: number;
}

export interface ProductsResponse {
    products: Product[];
    count: number;
}

export interface Project {
    id: string;
    name: string;
    status: string;
    featureIncrementCount: number;
}

export interface ProjectsForProductResponse {
    productId: string;
    projects: Project[];
    count: number;
}

interface ProductYaml {
    id?: string;
    name?: string;
    prefix?: string;
    status?: string;
    description?: string;
}

interface ProjectYaml {
    id?: string;
    name?: string;
    status?: string;
    target_products?: string[];
}

async function countFeatureIncrements(projectId: string): Promise<number> {
    const fiDir = join(WORKSPACE_ROOT, 'projects', projectId, 'feature-increments');

    try {
        const entries = await readdir(fiDir, { withFileTypes: true });
        return entries.filter(e => e.isFile() && e.name.startsWith('fi-') && e.name.endsWith('.md')).length;
    } catch {
        return 0;
    }
}

async function getProjectTargets(projectId: string): Promise<string[]> {
    const projectYmlPath = join(WORKSPACE_ROOT, 'projects', projectId, 'project.yml');

    try {
        const content = await readFile(projectYmlPath, 'utf-8');
        const yaml = load(content) as ProjectYaml;
        return yaml.target_products || [];
    } catch {
        return [];
    }
}

export async function getAllProducts(): Promise<ProductsResponse> {
    const productsDir = join(WORKSPACE_ROOT, 'products');
    const products: Product[] = [];

    try {
        const productFolders = await readdir(productsDir, { withFileTypes: true });

        for (const folder of productFolders) {
            if (!folder.isDirectory()) continue;

            const productYmlPath = join(productsDir, folder.name, 'product.yml');

            try {
                const content = await readFile(productYmlPath, 'utf-8');
                const yaml = load(content) as ProductYaml;

                // Count projects targeting this product
                const projectsDir = join(WORKSPACE_ROOT, 'projects');
                let projectCount = 0;

                try {
                    const projectFolders = await readdir(projectsDir, { withFileTypes: true });

                    for (const projFolder of projectFolders) {
                        if (!projFolder.isDirectory()) continue;

                        const targets = await getProjectTargets(projFolder.name);
                        if (targets.includes(folder.name) || targets.includes(yaml.id || folder.name)) {
                            projectCount++;
                        }
                    }
                } catch {
                    // No projects directory
                }

                products.push({
                    id: yaml.id || folder.name,
                    name: yaml.name || folder.name,
                    prefix: yaml.prefix || folder.name.substring(0, 3).toUpperCase(),
                    status: yaml.status || 'active',
                    description: yaml.description || '',
                    projectCount,
                });
            } catch {
                // Skip products without valid product.yml
            }
        }
    } catch {
        // Products directory doesn't exist
    }

    // Sort alphabetically by name
    products.sort((a, b) => a.name.localeCompare(b.name));

    return {
        products,
        count: products.length,
    };
}

export async function getProductById(productId: string): Promise<Product | null> {
    const productYmlPath = join(WORKSPACE_ROOT, 'products', productId, 'product.yml');

    try {
        const content = await readFile(productYmlPath, 'utf-8');
        const yaml = load(content) as ProductYaml;

        // Count projects
        const projectsDir = join(WORKSPACE_ROOT, 'projects');
        let projectCount = 0;

        try {
            const projectFolders = await readdir(projectsDir, { withFileTypes: true });

            for (const folder of projectFolders) {
                if (!folder.isDirectory()) continue;

                const targets = await getProjectTargets(folder.name);
                if (targets.includes(productId) || targets.includes(yaml.id || productId)) {
                    projectCount++;
                }
            }
        } catch {
            // No projects
        }

        return {
            id: yaml.id || productId,
            name: yaml.name || productId,
            prefix: yaml.prefix || productId.substring(0, 3).toUpperCase(),
            status: yaml.status || 'active',
            description: yaml.description || '',
            projectCount,
        };
    } catch {
        return null;
    }
}

export async function getProjectsForProduct(productId: string): Promise<ProjectsForProductResponse> {
    const projectsDir = join(WORKSPACE_ROOT, 'projects');
    const projects: Project[] = [];

    try {
        const projectFolders = await readdir(projectsDir, { withFileTypes: true });

        for (const folder of projectFolders) {
            if (!folder.isDirectory()) continue;

            const targets = await getProjectTargets(folder.name);

            if (!targets.includes(productId)) continue;

            const projectYmlPath = join(projectsDir, folder.name, 'project.yml');

            try {
                const content = await readFile(projectYmlPath, 'utf-8');
                const yaml = load(content) as ProjectYaml;

                const fiCount = await countFeatureIncrements(folder.name);

                projects.push({
                    id: yaml.id || folder.name,
                    name: yaml.name || folder.name,
                    status: yaml.status || 'active',
                    featureIncrementCount: fiCount,
                });
            } catch {
                // Skip projects without valid project.yml
                const fiCount = await countFeatureIncrements(folder.name);

                projects.push({
                    id: folder.name,
                    name: folder.name,
                    status: 'unknown',
                    featureIncrementCount: fiCount,
                });
            }
        }
    } catch {
        // Projects directory doesn't exist
    }

    return {
        productId,
        projects,
        count: projects.length,
    };
}
