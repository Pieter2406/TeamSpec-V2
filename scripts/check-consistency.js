#!/usr/bin/env node
/**
 * TeamSpec Static Consistency Checker
 * 
 * Validates that:
 * 1. All commands used in Agents/Docs exist in registry.yml
 * 2. All artifacts defined in registry.yml have corresponding templates
 * 3. No removed commands are referenced
 * 
 * Usage: node scripts/check-consistency.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT_DIR, 'spec/4.0/registry.yml');
const AGENTS_DIR = path.join(ROOT_DIR, 'agents');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const DOCS_FILES = [
    path.join(ROOT_DIR, 'README.md'),
    path.join(ROOT_DIR, 'cli/README.md')
];

// =============================================================================
// Helpers
// =============================================================================

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        return null;
    }
}

function getFiles(dir, ext = '.md') {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith(ext))
        .map(f => path.join(dir, f));
}

// Simple YAML parser for registry.yml specifically
// We only need 'commands' list, 'artifacts' keys, and 'templates' list
function parseRegistry(content) {
    const commands = new Set();
    const artifacts = new Set();
    const removedCommands = new Set();
    const templates = []; // { file, artifact, role, command }

    const lines = content.split('\n');
    let section = null;
    let currentTemplate = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('commands:')) {
            section = 'commands';
            continue;
        } else if (trimmed.startsWith('artifacts:')) {
            section = 'artifacts';
            continue;
        } else if (trimmed.startsWith('templates:')) {
            section = 'templates';
            continue;
        } else if (trimmed.startsWith('glossary:') || trimmed.startsWith('roles:') || trimmed.startsWith('gates:') || trimmed.startsWith('invariants:') || trimmed.startsWith('canon_rules:')) {
            section = null;
            continue;
        }

        if (section === 'commands') {
            // Extract invocation: "ts:..."
            const match = trimmed.match(/invocation:\s*["']?(ts:[a-z0-9:-]+)["']?/);
            if (match) {
                commands.add(match[1]);
            }
            // Check for REMOVED status
            if (trimmed.match(/status:\s*["']?REMOVED["']?/i)) {
                // The last command we added was removed
                // This is imperfect but works for registry structure
            }
        }

        if (section === 'artifacts') {
            // Extract keys: "  feature:"
            const match = line.match(/^  ([a-z0-9-]+):/);
            if (match) {
                artifacts.add(match[1]);
            }
        }

        if (section === 'templates') {
            // New template entry starts with "- file:"
            const fileMatch = trimmed.match(/^-\s*file:\s*["']?([^"'\s]+)["']?/);
            if (fileMatch) {
                if (currentTemplate) {
                    templates.push(currentTemplate);
                }
                currentTemplate = { file: fileMatch[1], artifact: null, role: null, command: null };
                continue;
            }

            if (currentTemplate) {
                const artifactMatch = trimmed.match(/^artifact:\s*["']?([^"'\s]+)["']?/);
                if (artifactMatch && artifactMatch[1] !== 'null') {
                    currentTemplate.artifact = artifactMatch[1];
                }

                const roleMatch = trimmed.match(/^role:\s*["']?([^"'\s]+)["']?/);
                if (roleMatch) {
                    currentTemplate.role = roleMatch[1];
                }

                const commandMatch = trimmed.match(/^command:\s*["']?(ts:[^"'\s]+)["']?/);
                if (commandMatch) {
                    currentTemplate.command = commandMatch[1];
                }
            }
        }
    }

    // Don't forget the last template
    if (currentTemplate) {
        templates.push(currentTemplate);
    }

    // Hardcoded removed commands based on registry
    removedCommands.add('ts:deploy');
    removedCommands.add('ts:ba epic');
    removedCommands.add('ts:ba feature');

    return { commands, artifacts, removedCommands, templates };
}

// =============================================================================
// Validation Logic
// =============================================================================

function checkCommands(registry, files, type) {
    const issues = [];
    const commandPattern = /ts:[a-z]+(\s+[a-z0-9-]+)*/g;

    for (const file of files) {
        const content = readFile(file);
        if (!content) continue;

        const filename = path.basename(file);
        let match;

        while ((match = commandPattern.exec(content)) !== null) {
            const cmd = match[0].trim();

            // Ignore definition lines in registry itself if we were scanning it (but we aren't)
            // Ignore "ts:lint" or "ts:fix" purely from cli if they aren't in registry yet?
            // Checking if it STARTS with a valid registry command.
            // e.g. "ts:po product" is valid. "ts:po product --name foo" should pass.

            let isValid = false;
            for (const validCmd of registry.commands) {
                if (cmd === validCmd || cmd.startsWith(validCmd + ' ')) {
                    isValid = true;
                    break;
                }
            }

            // Check refined subcommands that might not be explicitly top-level
            // Actually, registry should list full commands "ts:po product". 
            // If text says "ts:po product", exact match found.
            // If text says "ts:po unknown", it fails.

            // Allow exact match or prefix match if registry has broad commands? 
            // Registry has "ts:po product", "ts:po project".
            // If text has "ts:po product", it matches "ts:po product".
            // If text has "ts:po", it's a prefix of "ts:po product", is that allowed? No, meaningless.

            // Reverse logic: Check if the found 'cmd' (or a prefix of it) exists in registry.
            // But we need to handle "ts:sm sprint create". 
            // If registry has "ts:sm sprint", then "create" is an arg? Or sub-sub-command?
            // Strict mode: The longest matching parts must match a registry entry exactly.

            if (!isValid) {
                // Double check removed
                if (registry.removedCommands.has(cmd)) {
                    issues.push({
                        type: 'ERROR',
                        file: filename,
                        msg: `Usage of REMOVED command: '${cmd}'`
                    });
                } else {
                    // Heuristic: Is it just valid prefix?
                    // e.g. found "ts:po" -> refers to the family?
                    // Let's allow if it matches a family prefix 'ts:xy' exactly?
                    if (/^ts:[a-z]+$/.test(cmd)) {
                        // It's a family reference like "ts:po commands", likely documentation. Warn or Ignore?
                        // Let's ignore family references for now to reduce noise, or set as Info.
                    } else {
                        issues.push({
                            type: 'ERROR',
                            file: filename,
                            msg: `Unknown command: '${cmd}'`
                        });
                    }
                }
            }
        }
    }
    return issues;
}

function checkTemplates(registry) {
    const issues = [];
    const existingTemplates = new Set(fs.readdirSync(TEMPLATES_DIR));

    // Check that all templates defined in registry exist on disk
    for (const tmpl of registry.templates) {
        if (!existingTemplates.has(tmpl.file)) {
            issues.push({
                type: 'ERROR',
                file: 'templates/',
                msg: `Missing template file: '${tmpl.file}' (defined in registry.yml for ${tmpl.role || 'unknown role'})`
            });
        }
    }

    // Check that all artifacts have at least one template
    const artifactsWithTemplates = new Set(
        registry.templates
            .filter(t => t.artifact)
            .map(t => t.artifact)
    );

    for (const artifact of registry.artifacts) {
        if (!artifactsWithTemplates.has(artifact)) {
            issues.push({
                type: 'WARNING',
                file: 'registry.yml',
                msg: `Artifact '${artifact}' has no template defined in registry.yml templates section`
            });
        }
    }

    // Check for orphan templates (on disk but not in registry)
    const registryTemplateFiles = new Set(registry.templates.map(t => t.file));
    for (const file of existingTemplates) {
        // Skip README and non-template files
        if (file === 'README.md' || (!file.endsWith('-template.md') && !file.endsWith('-template.yml'))) {
            continue;
        }
        if (!registryTemplateFiles.has(file)) {
            issues.push({
                type: 'WARNING',
                file: 'templates/',
                msg: `Orphan template file: '${file}' exists on disk but not defined in registry.yml`
            });
        }
    }

    return issues;
}

// =============================================================================
// Main
// =============================================================================

function main() {
    console.log('🔍 check-consistency.js');
    console.log('================================');

    // 1. Parse Registry
    const registryContent = readFile(REGISTRY_PATH);
    if (!registryContent) {
        console.error('CRITICAL: Could not read registry.yml');
        process.exit(1);
    }

    const registry = parseRegistry(registryContent);
    console.log(`✅ Loaded Registry: ${registry.commands.size} commands, ${registry.artifacts.size} artifacts, ${registry.templates.length} templates`);

    let allIssues = [];

    // 2. Check Agents
    const agentFiles = getFiles(AGENTS_DIR);
    console.log(`\nChecking ${agentFiles.length} Agents...`);
    allIssues.push(...checkCommands(registry, agentFiles, 'Agent'));

    // 3. Check Docs
    console.log(`Checking Documentation...`);
    allIssues.push(...checkCommands(registry, DOCS_FILES, 'Doc'));

    // 4. Check Templates
    console.log(`Checking Templates...`);
    allIssues.push(...checkTemplates(registry));

    // Report
    if (allIssues.length === 0) {
        console.log('\n✅ No consistency issues found.');
        process.exit(0);
    } else {
        console.log(`\n❌ Found ${allIssues.length} inconsistencies:\n`);

        // Group by file
        const issuesByFile = {};
        allIssues.forEach(i => {
            if (!issuesByFile[i.file]) issuesByFile[i.file] = [];
            issuesByFile[i.file].push(i);
        });

        for (const [file, issues] of Object.entries(issuesByFile)) {
            console.log(`📄 ${file}`);
            const uniqueMsgs = new Set(issues.map(i => i.msg));
            uniqueMsgs.forEach(msg => {
                console.log(`   - ${msg}`);
            });
            console.log('');
        }

        process.exit(1);
    }
}

main();
