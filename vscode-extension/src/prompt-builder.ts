/**
 * Prompt Builder
 * 
 * Assembles final prompts from:
 * 1. Bootstrap prompt (TeamSpec operating model)
 * 2. Role prompt (BA/FA/etc.)
 * 3. Command macro (specific task instructions)
 * 4. Context pack (workspace-derived context)
 */

import * as vscode from 'vscode';
import { CommandDefinition, SubCommand, RoleCode, findSubCommand, getRoleDisplayName } from './commands';
import { loadAgentPrompt } from './agent-loader';
import { WorkspaceContext, formatContextForPrompt, readFileContent } from './context-pack';

export interface AssembledPrompt {
    /** The system prompt to use */
    systemPrompt: string;
    /** The user prompt enhancement */
    userPromptPrefix: string;
    /** Extracted IDs from user input */
    extractedIds: ExtractedIds;
    /** Role being used */
    role: RoleCode;
    /** Role display name */
    roleDisplayName: string;
}

export interface ExtractedIds {
    featureIds: string[];
    storyIds: string[];
    adrIds: string[];
    decisionIds: string[];
}

/**
 * Extract IDs from user prompt (F-XXX, S-XXX, ADR-XXX, DEC-XXX)
 */
export function extractIds(text: string): ExtractedIds {
    return {
        featureIds: [...text.matchAll(/F-(\d+)/gi)].map(m => `F-${m[1]}`),
        storyIds: [...text.matchAll(/S-(\d+)/gi)].map(m => `S-${m[1]}`),
        adrIds: [...text.matchAll(/ADR-(\d+)/gi)].map(m => `ADR-${m[1]}`),
        decisionIds: [...text.matchAll(/DEC-(\d+)/gi)].map(m => `DEC-${m[1]}`),
    };
}

/**
 * Parse subcommand from user prompt
 */
export function parseSubCommand(command: CommandDefinition, userPrompt: string): SubCommand | undefined {
    if (!command.subcommands) {
        return undefined;
    }

    // Check if user prompt starts with a subcommand pattern
    const firstWord = userPrompt.trim().split(/\s+/)[0]?.toLowerCase();
    
    for (const sub of command.subcommands) {
        if (firstWord === sub.pattern || userPrompt.toLowerCase().startsWith(sub.pattern)) {
            return sub;
        }
    }

    return undefined;
}

/**
 * Load relevant file content for context
 */
async function loadRelevantFiles(
    context: WorkspaceContext,
    extractedIds: ExtractedIds
): Promise<string> {
    const parts: string[] = [];

    // Load feature files for extracted feature IDs
    for (const featureId of extractedIds.featureIds) {
        const feature = context.features.find(f => f.id === featureId);
        if (feature) {
            const content = await readFileContent(feature.path, 150);
            if (content) {
                parts.push(`\n### Feature Canon: ${feature.id}`);
                parts.push('```markdown');
                parts.push(content);
                parts.push('```');
            }
        }
    }

    // Load story files for extracted story IDs
    for (const storyId of extractedIds.storyIds) {
        const story = context.stories.find(s => s.id === storyId);
        if (story) {
            const content = await readFileContent(story.path, 100);
            if (content) {
                parts.push(`\n### Story: ${story.id}`);
                parts.push('```markdown');
                parts.push(content);
                parts.push('```');
            }
        }
    }

    // Load ADR files for extracted ADR IDs
    for (const adrId of extractedIds.adrIds) {
        const adr = context.adrs.find(a => a.id === adrId);
        if (adr) {
            const content = await readFileContent(adr.path, 100);
            if (content) {
                parts.push(`\n### ADR: ${adr.id}`);
                parts.push('```markdown');
                parts.push(content);
                parts.push('```');
            }
        }
    }

    return parts.join('\n');
}

/**
 * Build gate check warnings
 */
function buildGateWarnings(
    command: CommandDefinition,
    context: WorkspaceContext,
    extractedIds: ExtractedIds
): string[] {
    const warnings: string[] = [];

    if (!command.gateChecks) {
        return warnings;
    }

    for (const gate of command.gateChecks) {
        // Feature link check
        if (gate.name === 'Feature Link' && extractedIds.featureIds.length === 0) {
            warnings.push(`⚠️ **Gate Warning:** ${gate.failMessage}`);
        }

        // Dev plan check
        if (gate.name === 'Dev Plan' && extractedIds.storyIds.length > 0) {
            const storyId = extractedIds.storyIds[0];
            const hasDevPlan = context.projectFolder && 
                require('fs').existsSync(
                    require('path').join(context.projectFolder, 'dev-plans', `story-${storyId.replace('S-', '')}-tasks.md`)
                );
            if (!hasDevPlan) {
                warnings.push(`⚠️ **Gate Warning:** ${gate.failMessage}`);
            }
        }

        // Personas check for design
        if (gate.name === 'Personas' && extractedIds.featureIds.length > 0) {
            // Would need to parse feature file to check for personas section
            // For now, just add a reminder
            warnings.push(`ℹ️ **Reminder:** Ensure feature has defined personas before designing.`);
        }
    }

    return warnings;
}

/**
 * Assemble a complete prompt for a command
 */
export async function assemblePrompt(
    command: CommandDefinition,
    userPrompt: string,
    context: WorkspaceContext,
    workspaceFolder?: vscode.WorkspaceFolder
): Promise<AssembledPrompt> {
    // Extract IDs from user input
    const extractedIds = extractIds(userPrompt);

    // Check for subcommand
    const subCommand = parseSubCommand(command, userPrompt);

    // Load agent prompts
    const bootstrapPrompt = await loadAgentPrompt('BOOTSTRAP', workspaceFolder);
    const rolePrompt = command.role !== 'DISPATCHER' 
        ? await loadAgentPrompt(command.role, workspaceFolder)
        : '';

    // Get the macro to use (subcommand overrides command)
    const macro = subCommand?.macro || command.macro;

    // Build system prompt
    const systemParts: string[] = [
        bootstrapPrompt,
        '',
        '---',
        '',
    ];

    if (rolePrompt) {
        systemParts.push(rolePrompt);
        systemParts.push('');
        systemParts.push('---');
        systemParts.push('');
    }

    systemParts.push('## Current Task');
    systemParts.push('');
    systemParts.push(macro);

    const systemPrompt = systemParts.join('\n');

    // Build user prompt prefix with context
    const userPrefixParts: string[] = [];

    // Add context summary
    userPrefixParts.push(formatContextForPrompt(context));

    // Add relevant file contents
    const fileContents = await loadRelevantFiles(context, extractedIds);
    if (fileContents) {
        userPrefixParts.push('\n## Relevant Files');
        userPrefixParts.push(fileContents);
    }

    // Add gate warnings
    const warnings = buildGateWarnings(command, context, extractedIds);
    if (warnings.length > 0) {
        userPrefixParts.push('\n## Gate Checks');
        userPrefixParts.push(warnings.join('\n'));
    }

    // Add separator before user input
    userPrefixParts.push('\n---\n');
    userPrefixParts.push('## User Request');
    userPrefixParts.push('');

    return {
        systemPrompt,
        userPromptPrefix: userPrefixParts.join('\n'),
        extractedIds,
        role: command.role,
        roleDisplayName: getRoleDisplayName(command.role)
    };
}

/**
 * Build a dispatcher prompt for when no command is specified
 */
export async function buildDispatcherPrompt(
    userPrompt: string,
    context: WorkspaceContext,
    workspaceFolder?: vscode.WorkspaceFolder
): Promise<AssembledPrompt> {
    const bootstrapPrompt = await loadAgentPrompt('BOOTSTRAP', workspaceFolder);
    const extractedIds = extractIds(userPrompt);

    const systemParts: string[] = [
        bootstrapPrompt,
        '',
        '---',
        '',
        '## Dispatcher Mode',
        '',
        'The user has not specified a role command. Your job is to:',
        '',
        '1. **Understand** what the user is trying to accomplish',
        '2. **Identify** the appropriate role (BA, FA, SA, DEV, QA, SM, DES)',
        '3. **Suggest** the correct command to use',
        '',
        '### Role Guide',
        '- **BA** (`/ba`): Business intent, features, decisions - "Why are we building this?"',
        '- **FA** (`/fa`): Stories, behavior specs, Canon sync - "What should the system do?"',
        '- **SA** (`/arch`): ADRs, technical design - "How should we build this?"',
        '- **DEV** (`/dev`): Dev plans, implementation - "How do I implement this?"',
        '- **QA** (`/qa`): Testing, bug reports - "Does this work correctly?"',
        '- **SM** (`/sm`): Sprints, ceremonies - "What\'s in this sprint?"',
        '- **DES** (`/des`): UX design, flows - "What should this look like?"',
        '',
        'If you can infer the role clearly, proceed with the task.',
        'If unclear, ask the user which role they are acting as.',
    ];

    const systemPrompt = systemParts.join('\n');

    const userPrefixParts: string[] = [
        formatContextForPrompt(context),
        '\n---\n',
        '## User Request',
        ''
    ];

    return {
        systemPrompt,
        userPromptPrefix: userPrefixParts.join('\n'),
        extractedIds,
        role: 'DISPATCHER',
        roleDisplayName: 'TeamSpec Assistant'
    };
}
