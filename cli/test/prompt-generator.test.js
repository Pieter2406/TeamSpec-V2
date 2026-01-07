/**
 * TeamSpec Prompt Generator Tests
 * Test-driven implementation of prompt generation functionality
 * 
 * Tests:
 * - PROMPT-001: All BA commands are generated (including ba-analysis)
 * - PROMPT-002: All FA commands are generated
 * - PROMPT-003: All role commands have correct frontmatter format
 * - PROMPT-004: README index is generated with all commands
 * - PROMPT-005: Prompt files use correct naming convention
 * - PROMPT-006: Generated prompts contain required sections
 */

const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Import prompt generator module
const { generateAllPrompts, COMMANDS } = require('../lib/prompt-generator');

// =============================================================================
// Test Fixtures & Helpers
// =============================================================================

/**
 * Create a temporary test directory
 */
function createTempDir() {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teamspec-prompt-test-'));
    return tempDir;
}

/**
 * Clean up temporary directory
 */
function cleanupTempDir(tempDir) {
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

/**
 * Read generated prompt file and parse frontmatter
 */
function parsePromptFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
        return { frontmatter: null, body: content };
    }

    const frontmatterLines = frontmatterMatch[1].split('\n');
    const frontmatter = {};

    for (const line of frontmatterLines) {
        const match = line.match(/^(\w+):\s*"?([^"]*)"?$/);
        if (match) {
            frontmatter[match[1]] = match[2];
        }
    }

    const body = content.slice(frontmatterMatch[0].length).trim();

    return { frontmatter, body };
}

// =============================================================================
// PROMPT-001: All BA commands are generated
// =============================================================================

describe('PROMPT-001: BA Commands Generation', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('ba-project prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-project.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-project.prompt.md should exist');
    });

    test('ba-epic prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-epic.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-epic.prompt.md should exist');
    });

    test('ba-feature prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-feature.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-feature.prompt.md should exist');
    });

    test('ba-decision prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-decision.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-decision.prompt.md should exist');
    });

    test('ba-analysis prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'ba-analysis.prompt.md should exist');
    });

    test('COMMANDS object includes analysis command for BA', () => {
        const baCommands = COMMANDS.ba.commands;
        const analysisCommand = baCommands.find(cmd => cmd.name === 'analysis');

        assert.ok(analysisCommand, 'BA commands should include analysis');
        assert.strictEqual(analysisCommand.description, 'Create business analysis document');
        assert.ok(analysisCommand.prompt.includes('business analysis document'),
            'Analysis prompt should mention business analysis document');
    });

    test('BA has exactly 5 commands', () => {
        const baCommands = COMMANDS.ba.commands;
        assert.strictEqual(baCommands.length, 5,
            'BA should have 5 commands: project, epic, feature, decision, analysis');
    });
});

// =============================================================================
// PROMPT-002: All FA commands are generated
// =============================================================================

describe('PROMPT-002: FA Commands Generation', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('fa-story prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-story.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-story.prompt.md should exist');
    });

    test('fa-slice prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-slice.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-slice.prompt.md should exist');
    });

    test('fa-refine prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-refine.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-refine.prompt.md should exist');
    });

    test('fa-sync prompt is generated', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fa-sync.prompt.md');
        assert.ok(fs.existsSync(promptPath), 'fa-sync.prompt.md should exist');
    });
});

// =============================================================================
// PROMPT-003: Correct frontmatter format
// =============================================================================

describe('PROMPT-003: Frontmatter Format', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('ba-analysis has correct frontmatter name', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        const { frontmatter } = parsePromptFile(promptPath);

        assert.ok(frontmatter, 'Frontmatter should exist');
        assert.strictEqual(frontmatter.name, 'ts:ba-analysis',
            'Name should be ts:ba-analysis');
    });

    test('ba-analysis has correct description', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        const { frontmatter } = parsePromptFile(promptPath);

        assert.ok(frontmatter.description.includes('Business Analyst'),
            'Description should mention Business Analyst');
        assert.ok(frontmatter.description.includes('business analysis'),
            'Description should mention business analysis');
    });

    test('ba-analysis has agent field', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        const { frontmatter } = parsePromptFile(promptPath);

        assert.strictEqual(frontmatter.agent, 'agent',
            'Agent should be set to "agent"');
    });

    test('all generated prompts have required frontmatter fields', () => {
        const promptsDir = path.join(tempDir, '.github', 'prompts');
        const files = fs.readdirSync(promptsDir)
            .filter(f => f.endsWith('.prompt.md'));

        for (const file of files) {
            const { frontmatter } = parsePromptFile(path.join(promptsDir, file));

            assert.ok(frontmatter, `${file} should have frontmatter`);
            assert.ok(frontmatter.name, `${file} should have name`);
            assert.ok(frontmatter.name.startsWith('ts:'),
                `${file} name should start with ts:`);
            assert.ok(frontmatter.description, `${file} should have description`);
            assert.ok(frontmatter.agent, `${file} should have agent field`);
        }
    });
});

// =============================================================================
// PROMPT-004: README index generation
// =============================================================================

describe('PROMPT-004: README Index', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('README.md is generated', () => {
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        assert.ok(fs.existsSync(readmePath), 'README.md should exist');
    });

    test('README contains ba-analysis command', () => {
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        assert.ok(content.includes('ts:ba-analysis'),
            'README should list ba-analysis command');
        assert.ok(content.includes('business analysis'),
            'README should describe business analysis');
    });

    test('README contains all BA commands', () => {
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        const expectedCommands = ['ba-project', 'ba-epic', 'ba-feature', 'ba-decision', 'ba-analysis'];

        for (const cmd of expectedCommands) {
            assert.ok(content.includes(`ts:${cmd}`),
                `README should contain ts:${cmd}`);
        }
    });

    test('README contains all role sections', () => {
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        const expectedRoles = ['Business Analyst', 'Functional Analyst', 'Solution Architect',
            'Developer', 'QA Engineer', 'Scrum Master'];

        for (const role of expectedRoles) {
            assert.ok(content.includes(role),
                `README should contain ${role} section`);
        }
    });
});

// =============================================================================
// PROMPT-005: Naming convention
// =============================================================================

describe('PROMPT-005: Naming Convention', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('all prompts follow role-command.prompt.md pattern', () => {
        const promptsDir = path.join(tempDir, '.github', 'prompts');
        const files = fs.readdirSync(promptsDir)
            .filter(f => f.endsWith('.prompt.md'));

        const validRoles = ['ba', 'fa', 'arch', 'dev', 'qa', 'sm'];
        const rolePattern = /^([a-z]+)-([a-z-]+)\.prompt\.md$/;
        // Utility commands use just command name (e.g., fix.prompt.md)
        const utilityCommands = ['fix'];

        for (const file of files) {
            const isUtilityCmd = utilityCommands.some(cmd => file === `${cmd}.prompt.md`);
            if (isUtilityCmd) {
                // Utility commands don't need role prefix
                continue;
            }
            const match = file.match(rolePattern);
            assert.ok(match, `${file} should match pattern role-command.prompt.md`);
            assert.ok(validRoles.includes(match[1]),
                `${file} should have valid role prefix`);
        }
    });

    test('ba-analysis follows naming convention', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        assert.ok(fs.existsSync(promptPath),
            'ba-analysis.prompt.md should use correct naming');
    });
});

// =============================================================================
// PROMPT-006: Prompts link to agent files
// =============================================================================

describe('PROMPT-006: Agent File Links', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
        generateAllPrompts(tempDir);
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('ba-analysis links to AGENT_BA.md', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        const content = fs.readFileSync(promptPath, 'utf-8');

        assert.ok(content.includes('AGENT_BA.md'),
            'Prompt should link to AGENT_BA.md');
        assert.ok(content.includes('.teamspec/agents/AGENT_BA.md'),
            'Prompt should have correct path to agent file in .teamspec');
    });

    test('ba-analysis contains Quick Reference section', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        const content = fs.readFileSync(promptPath, 'utf-8');

        assert.ok(content.includes('## Quick Reference'),
            'Prompt should have Quick Reference section');
    });

    test('ba-analysis references business analysis', () => {
        const promptPath = path.join(tempDir, '.github', 'prompts', 'ba-analysis.prompt.md');
        const content = fs.readFileSync(promptPath, 'utf-8');

        assert.ok(content.includes('business analysis') ||
            content.includes('Business Analyst'),
            'Prompt should reference business analysis');
    });

    test('all prompts link to their agent files', () => {
        const promptsDir = path.join(tempDir, '.github', 'prompts');
        const files = fs.readdirSync(promptsDir)
            .filter(f => f.endsWith('.prompt.md'));

        const roleToAgent = {
            'ba': 'AGENT_BA',
            'fa': 'AGENT_FA',
            'arch': 'AGENT_SA',
            'dev': 'AGENT_DEV',
            'qa': 'AGENT_QA',
            'sm': 'AGENT_SM'
        };

        // Utility commands map directly to agent files
        const utilityToAgent = {
            'fix': 'AGENT_FIX'
        };

        for (const file of files) {
            const content = fs.readFileSync(path.join(promptsDir, file), 'utf-8');

            // Check if it's a utility command (no role prefix)
            const isUtility = !file.includes('-');
            let agentFile;

            if (isUtility) {
                const cmdName = file.replace('.prompt.md', '');
                agentFile = utilityToAgent[cmdName];
            } else {
                const role = file.split('-')[0];
                agentFile = roleToAgent[role];
            }

            assert.ok(content.includes(`.teamspec/agents/${agentFile}.md`),
                `${file} should link to .teamspec/agents/${agentFile}.md`);
        }
    });

    test('prompts are minimal (under 50 lines)', () => {
        const promptsDir = path.join(tempDir, '.github', 'prompts');
        const files = fs.readdirSync(promptsDir)
            .filter(f => f.endsWith('.prompt.md'));

        for (const file of files) {
            const content = fs.readFileSync(path.join(promptsDir, file), 'utf-8');
            const lineCount = content.split('\n').length;

            assert.ok(lineCount < 50,
                `${file} should be minimal (${lineCount} lines, expected < 50)`);
        }
    });
});

// =============================================================================
// PROMPT-007: Output directory creation
// =============================================================================

describe('PROMPT-007: Directory Creation', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('creates .github/prompts directory if not exists', () => {
        const promptsDir = path.join(tempDir, '.github', 'prompts');
        assert.ok(!fs.existsSync(promptsDir), 'Directory should not exist initially');

        generateAllPrompts(tempDir);

        assert.ok(fs.existsSync(promptsDir), 'Directory should be created');
    });

    test('works with existing .github directory', () => {
        const githubDir = path.join(tempDir, '.github');
        fs.mkdirSync(githubDir, { recursive: true });
        fs.writeFileSync(path.join(githubDir, 'existing-file.md'), '# Existing');

        generateAllPrompts(tempDir);

        const promptsDir = path.join(githubDir, 'prompts');
        assert.ok(fs.existsSync(promptsDir), 'prompts directory should be created');
        assert.ok(fs.existsSync(path.join(githubDir, 'existing-file.md')),
            'Existing files should not be removed');
    });
});

// =============================================================================
// PROMPT-008: Return value
// =============================================================================

describe('PROMPT-008: Return Value', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('returns array of generated files', () => {
        const result = generateAllPrompts(tempDir);

        assert.ok(Array.isArray(result), 'Should return array');
        assert.ok(result.length > 0, 'Array should not be empty');
    });

    test('includes ba-analysis.prompt.md in return value', () => {
        const result = generateAllPrompts(tempDir);

        assert.ok(result.includes('ba-analysis.prompt.md'),
            'Should include ba-analysis.prompt.md');
    });

    test('includes README.md in return value', () => {
        const result = generateAllPrompts(tempDir);

        assert.ok(result.includes('README.md'),
            'Should include README.md');
    });

    test('returns correct number of files', () => {
        const result = generateAllPrompts(tempDir);

        // Count expected files: all commands + README
        let expectedCount = 1; // README
        for (const config of Object.values(COMMANDS)) {
            expectedCount += config.commands.length;
        }

        assert.strictEqual(result.length, expectedCount,
            `Should return ${expectedCount} files`);
    });
});
// =============================================================================
// PROMPT-009: CLI Integration
// =============================================================================

describe('PROMPT-009: CLI Integration', () => {
    test('COMMANDS includes ba analysis command', () => {
        const baCommands = COMMANDS.ba.commands;
        const commandNames = baCommands.map(cmd => cmd.name);

        assert.ok(commandNames.includes('project'), 'Should include project');
        assert.ok(commandNames.includes('epic'), 'Should include epic');
        assert.ok(commandNames.includes('feature'), 'Should include feature');
        assert.ok(commandNames.includes('decision'), 'Should include decision');
        assert.ok(commandNames.includes('analysis'), 'Should include analysis');
    });

    test('ba-analysis command has correct structure', () => {
        const baCommands = COMMANDS.ba.commands;
        const analysisCmd = baCommands.find(cmd => cmd.name === 'analysis');

        assert.ok(analysisCmd, 'analysis command should exist');
        assert.ok(analysisCmd.name, 'Should have name');
        assert.ok(analysisCmd.description, 'Should have description');
        assert.ok(analysisCmd.prompt, 'Should have prompt');
        assert.ok(analysisCmd.prompt.length > 100, 'Prompt should be detailed');
    });

    test('ba-analysis prompt mentions business process', () => {
        const baCommands = COMMANDS.ba.commands;
        const analysisCmd = baCommands.find(cmd => cmd.name === 'analysis');

        assert.ok(analysisCmd.prompt.includes('business'),
            'Prompt should mention business');
        assert.ok(analysisCmd.prompt.includes('process') || analysisCmd.prompt.includes('Process'),
            'Prompt should mention process');
    });

    test('ba-analysis prompt includes As-Is and To-Be states', () => {
        const baCommands = COMMANDS.ba.commands;
        const analysisCmd = baCommands.find(cmd => cmd.name === 'analysis');

        assert.ok(analysisCmd.prompt.includes('As-Is') || analysisCmd.prompt.includes('Current State'),
            'Prompt should reference As-Is/Current State');
        assert.ok(analysisCmd.prompt.includes('To-Be') || analysisCmd.prompt.includes('Future State'),
            'Prompt should reference To-Be/Future State');
    });

    test('all roles have commands defined', () => {
        const expectedRoles = ['ba', 'fa', 'arch', 'dev', 'qa', 'sm'];

        for (const role of expectedRoles) {
            assert.ok(COMMANDS[role], `${role} should be defined`);
            assert.ok(COMMANDS[role].name, `${role} should have name`);
            assert.ok(Array.isArray(COMMANDS[role].commands), `${role} should have commands array`);
            assert.ok(COMMANDS[role].commands.length > 0, `${role} should have at least one command`);
        }
    });
});

// =============================================================================
// PROMPT-010: Utility Fix Command (S-001, S-002, F-007)
// =============================================================================

describe('PROMPT-010: Utility Fix Command', () => {
    let tempDir;

    beforeEach(() => {
        tempDir = createTempDir();
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
    });

    test('utility role exists in COMMANDS', () => {
        assert.ok(COMMANDS.utility, 'utility role should be defined');
        assert.strictEqual(COMMANDS.utility.name, 'Utility', 'utility should have name "Utility"');
        assert.ok(Array.isArray(COMMANDS.utility.commands), 'utility should have commands array');
    });

    test('fix command exists under utility', () => {
        const fixCmd = COMMANDS.utility.commands.find(cmd => cmd.name === 'fix');
        assert.ok(fixCmd, 'fix command should exist');
        assert.strictEqual(fixCmd.description, 'Auto-fix linter errors');
        assert.ok(fixCmd.prompt.includes('linter'), 'Prompt should mention linter');
    });

    test('fix.prompt.md is generated (not utility-fix.prompt.md)', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fix.prompt.md');
        const wrongPath = path.join(tempDir, '.github', 'prompts', 'utility-fix.prompt.md');

        assert.ok(fs.existsSync(promptPath), 'fix.prompt.md should exist');
        assert.ok(!fs.existsSync(wrongPath), 'utility-fix.prompt.md should NOT exist');
    });

    test('fix prompt has correct frontmatter with ts:fix name', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fix.prompt.md');
        const { frontmatter } = parsePromptFile(promptPath);

        assert.strictEqual(frontmatter.name, 'ts:fix', 'Name should be ts:fix (not ts:utility-fix)');
        assert.ok(frontmatter.description.includes('Auto-fix'), 'Description should mention Auto-fix');
        assert.strictEqual(frontmatter.agent, 'agent', 'Agent should be "agent"');
    });

    test('fix prompt links to AGENT_FIX.md', () => {
        generateAllPrompts(tempDir);
        const promptPath = path.join(tempDir, '.github', 'prompts', 'fix.prompt.md');
        const content = fs.readFileSync(promptPath, 'utf-8');

        assert.ok(content.includes('AGENT_FIX.md'), 'Should link to AGENT_FIX.md');
        assert.ok(content.includes('.teamspec/agents/AGENT_FIX.md'), 'Should have correct path');
    });

    test('README includes Utility section', () => {
        generateAllPrompts(tempDir);
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        assert.ok(content.includes('### Utility'), 'README should have Utility section');
    });

    test('README includes fix command', () => {
        generateAllPrompts(tempDir);
        const readmePath = path.join(tempDir, '.github', 'prompts', 'README.md');
        const content = fs.readFileSync(readmePath, 'utf-8');

        assert.ok(content.includes('ts:fix'), 'README should include ts:fix command');
        assert.ok(content.includes('Auto-fix linter errors'), 'README should include fix description');
    });

    test('fix prompt mentions supported rule categories', () => {
        const fixCmd = COMMANDS.utility.commands.find(cmd => cmd.name === 'fix');

        assert.ok(fixCmd.prompt.includes('TS-PROJ'), 'Should mention TS-PROJ rules');
        assert.ok(fixCmd.prompt.includes('TS-FEAT'), 'Should mention TS-FEAT rules');
        assert.ok(fixCmd.prompt.includes('TS-STORY'), 'Should mention TS-STORY rules');
    });
});