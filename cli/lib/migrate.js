/**
 * TeamSpec Migration Module
 * Handles migration from TeamSpec 2.0 to 4.0
 */

const fs = require('fs');
const path = require('path');

// =============================================================================
// ANSI Color Helpers (reuse from cli.js)
// =============================================================================

const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    red: '\x1b[91m',
    green: '\x1b[92m',
    yellow: '\x1b[93m',
    blue: '\x1b[94m',
    cyan: '\x1b[96m',
};

function colored(text, color) {
    if (process.stdout.isTTY) {
        return `${color}${text}${colors.reset}`;
    }
    return text;
}

// =============================================================================
// Migration Analysis
// =============================================================================

/**
 * Analyze a 2.0 workspace to plan migration
 * @param {string} targetDir - Workspace root path
 * @returns {Object} Migration plan
 */
function analyzeMigration(targetDir) {
    const plan = {
        version: '2.0',
        canMigrate: true,
        errors: [],
        warnings: [],
        actions: [],
        projects: [],
        suggestedProducts: [],
    };

    const projectsDir = path.join(targetDir, 'projects');

    if (!fs.existsSync(projectsDir)) {
        plan.canMigrate = false;
        plan.errors.push('No projects/ directory found');
        return plan;
    }

    // Scan projects
    const projectEntries = fs.readdirSync(projectsDir, { withFileTypes: true });

    for (const entry of projectEntries) {
        if (!entry.isDirectory()) continue;

        const projectPath = path.join(projectsDir, entry.name);
        const projectYmlPath = path.join(projectPath, 'project.yml');

        if (!fs.existsSync(projectYmlPath)) {
            plan.warnings.push(`Project "${entry.name}" has no project.yml`);
            continue;
        }

        const projectInfo = {
            id: entry.name,
            path: projectPath,
            hasFeatures: fs.existsSync(path.join(projectPath, 'features')),
            hasStories: fs.existsSync(path.join(projectPath, 'stories')),
            hasAdr: fs.existsSync(path.join(projectPath, 'adr')),
            featureCount: 0,
            storyCount: 0,
        };

        // Count features
        const featuresPath = path.join(projectPath, 'features');
        if (projectInfo.hasFeatures) {
            const featureFiles = fs.readdirSync(featuresPath)
                .filter(f => f.match(/^F-\d{3}/i) && f.endsWith('.md'));
            projectInfo.featureCount = featureFiles.length;
        }

        // Count stories
        const storiesPath = path.join(projectPath, 'stories');
        if (projectInfo.hasStories) {
            for (const subdir of ['backlog', 'ready-to-refine', 'ready-for-development']) {
                const subdirPath = path.join(storiesPath, subdir);
                if (fs.existsSync(subdirPath)) {
                    const storyFiles = fs.readdirSync(subdirPath)
                        .filter(f => f.match(/^S-\d{3}/i) && f.endsWith('.md'));
                    projectInfo.storyCount += storyFiles.length;
                }
            }
        }

        plan.projects.push(projectInfo);

        // Suggest product creation from project with features
        if (projectInfo.hasFeatures && projectInfo.featureCount > 0) {
            const suggestedPrefix = entry.name
                .split('-')
                .filter(w => !['the', 'a', 'an'].includes(w.toLowerCase()))
                .slice(0, 3)
                .map(w => w[0])
                .join('')
                .toUpperCase() || 'PRD';

            plan.suggestedProducts.push({
                sourceProject: entry.name,
                suggestedId: entry.name,
                suggestedPrefix: suggestedPrefix.length >= 3 ? suggestedPrefix : suggestedPrefix + 'X',
                suggestedName: entry.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                featureCount: projectInfo.featureCount,
            });
        }
    }

    // Generate migration actions
    for (const product of plan.suggestedProducts) {
        plan.actions.push({
            type: 'create_product',
            description: `Create product "${product.suggestedName}" (${product.suggestedPrefix}) from project "${product.sourceProject}"`,
            product: product,
        });

        plan.actions.push({
            type: 'migrate_features',
            description: `Migrate ${product.featureCount} features to product "${product.suggestedId}"`,
            source: `projects/${product.sourceProject}/features/`,
            dest: `products/${product.suggestedId}/features/`,
        });
    }

    // Rename actions for folder structure
    for (const project of plan.projects) {
        if (project.hasAdr) {
            plan.actions.push({
                type: 'rename_folder',
                description: `Rename adr/ to technical-architecture-increments/ in project "${project.id}"`,
                source: `projects/${project.id}/adr/`,
                dest: `projects/${project.id}/technical-architecture-increments/`,
            });
        }

        if (project.hasStories) {
            plan.actions.push({
                type: 'create_folder',
                description: `Create feature-increments/ in project "${project.id}"`,
                path: `projects/${project.id}/feature-increments/`,
            });

            plan.actions.push({
                type: 'rename_folder',
                description: `Rename ready-for-development/ to ready-to-develop/`,
                source: `projects/${project.id}/stories/ready-for-development/`,
                dest: `projects/${project.id}/stories/ready-to-develop/`,
            });
        }
    }

    return plan;
}

/**
 * Print migration plan
 * @param {Object} plan - Migration plan from analyzeMigration
 */
function printMigrationPlan(plan) {
    console.log(`\n${colored('═══════════════════════════════════════════════════════════════', colors.cyan)}`);
    console.log(`${colored('                 TeamSpec Migration Plan (2.0 → 4.0)', colors.cyan)}`);
    console.log(`${colored('═══════════════════════════════════════════════════════════════', colors.cyan)}\n`);

    if (!plan.canMigrate) {
        console.log(`${colored('❌ Cannot migrate:', colors.red)}`);
        for (const error of plan.errors) {
            console.log(`   • ${error}`);
        }
        return;
    }

    // Summary
    console.log(`${colored('Summary:', colors.bold)}`);
    console.log(`  Projects found:     ${plan.projects.length}`);
    console.log(`  Products to create: ${plan.suggestedProducts.length}`);
    console.log(`  Actions planned:    ${plan.actions.length}`);

    // Warnings
    if (plan.warnings.length > 0) {
        console.log(`\n${colored('⚠️  Warnings:', colors.yellow)}`);
        for (const warning of plan.warnings) {
            console.log(`   • ${warning}`);
        }
    }

    // Products to create
    if (plan.suggestedProducts.length > 0) {
        console.log(`\n${colored('Products to Create:', colors.bold)}`);
        console.log('  ┌────────┬────────────────────────┬──────────┐');
        console.log('  │ Prefix │ Name                   │ Features │');
        console.log('  ├────────┼────────────────────────┼──────────┤');
        for (const product of plan.suggestedProducts) {
            const name = product.suggestedName.substring(0, 22).padEnd(22);
            console.log(`  │ ${product.suggestedPrefix.padEnd(6)} │ ${name} │ ${String(product.featureCount).padStart(8)} │`);
        }
        console.log('  └────────┴────────────────────────┴──────────┘');
    }

    // Actions
    console.log(`\n${colored('Migration Actions:', colors.bold)}`);
    let actionNum = 1;
    for (const action of plan.actions) {
        const typeIcon = {
            'create_product': '📦',
            'migrate_features': '📄',
            'rename_folder': '📁',
            'create_folder': '📁',
        }[action.type] || '▸';
        console.log(`  ${actionNum}. ${typeIcon} ${action.description}`);
        actionNum++;
    }
}

/**
 * Execute migration
 * @param {string} targetDir - Workspace root path
 * @param {Object} plan - Migration plan
 * @param {Object} options - Migration options
 * @param {boolean} options.dryRun - Only print what would happen
 * @returns {Object} Migration result
 */
function executeMigration(targetDir, plan, options = {}) {
    const result = {
        success: true,
        actionsCompleted: 0,
        actionsFailed: 0,
        errors: [],
    };

    if (options.dryRun) {
        console.log(`\n${colored('🔍 Dry run mode - no changes will be made', colors.yellow)}\n`);
    }

    for (const action of plan.actions) {
        try {
            console.log(`  ${options.dryRun ? '[DRY RUN] ' : ''}${action.description}...`);

            if (!options.dryRun) {
                executeAction(targetDir, action);
            }

            result.actionsCompleted++;
            console.log(`    ${colored('✓', colors.green)} Done`);
        } catch (error) {
            result.actionsFailed++;
            result.errors.push(`${action.description}: ${error.message}`);
            console.log(`    ${colored('✗', colors.red)} Failed: ${error.message}`);
        }
    }

    // Create products-index.md
    if (!options.dryRun) {
        const productsIndexPath = path.join(targetDir, 'products', 'products-index.md');
        if (!fs.existsSync(productsIndexPath)) {
            fs.mkdirSync(path.join(targetDir, 'products'), { recursive: true });
            const indexContent = generateProductsIndex(plan.suggestedProducts);
            fs.writeFileSync(productsIndexPath, indexContent, 'utf-8');
            console.log(`  ${colored('✓', colors.green)} Created products/products-index.md`);
        }
    }

    return result;
}

/**
 * Execute a single migration action
 */
function executeAction(targetDir, action) {
    switch (action.type) {
        case 'create_product':
            createProductFromMigration(targetDir, action.product);
            break;

        case 'migrate_features':
            migrateFeatures(targetDir, action.source, action.dest, action.product);
            break;

        case 'rename_folder':
            renameFolder(targetDir, action.source, action.dest);
            break;

        case 'create_folder':
            createFolder(targetDir, action.path);
            break;

        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

/**
 * Create product structure from migration
 */
function createProductFromMigration(targetDir, productInfo) {
    const productDir = path.join(targetDir, 'products', productInfo.suggestedId);

    if (fs.existsSync(productDir)) {
        throw new Error(`Product directory already exists: ${productDir}`);
    }

    fs.mkdirSync(productDir, { recursive: true });

    // product.yml
    const productYml = `# Product Configuration: ${productInfo.suggestedName}
# Migrated from TeamSpec 2.0 project: ${productInfo.sourceProject}
product:
  id: "${productInfo.suggestedId}"
  name: "${productInfo.suggestedName}"
  prefix: "${productInfo.suggestedPrefix}"
  description: |
    # TODO: Update product description (AS-IS state)
    # Migrated from project: ${productInfo.sourceProject}
  status: active
  active_projects: []
`;
    fs.writeFileSync(path.join(productDir, 'product.yml'), productYml, 'utf-8');

    // Create subdirectories
    for (const subdir of ['business-analysis', 'features', 'solution-designs', 'technical-architecture', 'decisions']) {
        fs.mkdirSync(path.join(productDir, subdir), { recursive: true });
    }
}

/**
 * Migrate features from project to product
 */
function migrateFeatures(targetDir, source, dest, productInfo) {
    const sourcePath = path.join(targetDir, source);
    const destPath = path.join(targetDir, dest);

    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source path does not exist: ${sourcePath}`);
    }

    fs.mkdirSync(destPath, { recursive: true });

    const files = fs.readdirSync(sourcePath);
    for (const file of files) {
        const sourceFile = path.join(sourcePath, file);

        // Rename files from F-XXX to f-PRX-XXX
        let destFile;
        const featureMatch = file.match(/^F-(\d{3})-(.+)$/i);
        if (featureMatch) {
            destFile = path.join(destPath, `f-${productInfo.suggestedPrefix}-${featureMatch[1]}-${featureMatch[2]}`);
        } else {
            destFile = path.join(destPath, file);
        }

        if (fs.statSync(sourceFile).isDirectory()) {
            // Skip directories for now
            continue;
        }

        // Copy file (don't delete original yet)
        fs.copyFileSync(sourceFile, destFile);
    }
}

/**
 * Rename a folder
 */
function renameFolder(targetDir, source, dest) {
    const sourcePath = path.join(targetDir, source);
    const destPath = path.join(targetDir, dest);

    if (!fs.existsSync(sourcePath)) {
        // If source doesn't exist, just create dest
        fs.mkdirSync(destPath, { recursive: true });
        return;
    }

    if (fs.existsSync(destPath)) {
        throw new Error(`Destination already exists: ${destPath}`);
    }

    fs.renameSync(sourcePath, destPath);
}

/**
 * Create a folder
 */
function createFolder(targetDir, folderPath) {
    const fullPath = path.join(targetDir, folderPath);
    fs.mkdirSync(fullPath, { recursive: true });
}

/**
 * Generate products-index.md content
 */
function generateProductsIndex(products) {
    let content = `# Products Index

Master index of all products in this workspace.

## Product Registry

| Prefix | ID | Name | Status | Active Projects |
|--------|-----|------|--------|-----------------|
`;

    for (const product of products) {
        content += `| ${product.suggestedPrefix} | ${product.suggestedId} | ${product.suggestedName} | active | - |\n`;
    }

    if (products.length === 0) {
        content += `| _(none yet)_ | | | | |\n`;
    }

    content += `
---

> **To add products:** Run \`ts:po product\` or use \`teamspec init --product\`
`;

    return content;
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
    analyzeMigration,
    printMigrationPlan,
    executeMigration,
};
