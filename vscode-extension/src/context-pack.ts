/**
 * Context Pack
 * 
 * Gathers workspace context for TeamSpec commands.
 * Provides relevant files, project state, and metadata.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface WorkspaceContext {
    /** Workspace root path */
    workspaceRoot?: string;
    /** Detected TeamSpec project folder */
    projectFolder?: string;
    /** Project metadata from project.yml */
    projectMeta?: ProjectMeta;
    /** Current file path */
    currentFile?: string;
    /** Current selection text */
    currentSelection?: string;
    /** Active sprint info */
    activeSprint?: SprintInfo;
    /** Recent/relevant features */
    features: FeatureRef[];
    /** Recent/relevant stories */
    stories: StoryRef[];
    /** Recent/relevant ADRs */
    adrs: AdrRef[];
}

export interface ProjectMeta {
    id: string;
    name: string;
    description?: string;
}

export interface SprintInfo {
    number: number;
    goal?: string;
    folder: string;
}

export interface FeatureRef {
    id: string;
    title: string;
    path: string;
}

export interface StoryRef {
    id: string;
    title: string;
    path: string;
    state: 'backlog' | 'ready-to-refine' | 'ready-for-development' | 'sprint' | 'done';
    featureId?: string;
}

export interface AdrRef {
    id: string;
    title: string;
    path: string;
}

/**
 * Find TeamSpec project folder in workspace
 */
function findProjectFolder(workspaceFolder: vscode.WorkspaceFolder): string | undefined {
    const root = workspaceFolder.uri.fsPath;
    
    // Check for projects/ folder structure
    const projectsFolder = path.join(root, 'projects');
    if (fs.existsSync(projectsFolder)) {
        // Find first project with project.yml
        const projects = fs.readdirSync(projectsFolder);
        for (const proj of projects) {
            const projPath = path.join(projectsFolder, proj);
            if (fs.existsSync(path.join(projPath, 'project.yml'))) {
                return projPath;
            }
        }
    }

    // Check root for project.yml
    if (fs.existsSync(path.join(root, 'project.yml'))) {
        return root;
    }

    // Check for features/ folder as indicator
    if (fs.existsSync(path.join(root, 'features'))) {
        return root;
    }

    return undefined;
}

/**
 * Parse project.yml for metadata
 */
function parseProjectMeta(projectFolder: string): ProjectMeta | undefined {
    const ymlPath = path.join(projectFolder, 'project.yml');
    if (!fs.existsSync(ymlPath)) {
        return undefined;
    }

    try {
        const content = fs.readFileSync(ymlPath, 'utf-8');
        // Simple YAML parsing for id and name
        const idMatch = content.match(/^id:\s*(.+)$/m);
        const nameMatch = content.match(/^name:\s*(.+)$/m);
        const descMatch = content.match(/^description:\s*(.+)$/m);

        if (idMatch || nameMatch) {
            return {
                id: idMatch?.[1]?.trim() || 'unknown',
                name: nameMatch?.[1]?.trim() || 'Unknown Project',
                description: descMatch?.[1]?.trim()
            };
        }
    } catch (error) {
        console.warn('Failed to parse project.yml', error);
    }

    return undefined;
}

/**
 * Find features in project folder
 */
function findFeatures(projectFolder: string): FeatureRef[] {
    const featuresFolder = path.join(projectFolder, 'features');
    if (!fs.existsSync(featuresFolder)) {
        return [];
    }

    const features: FeatureRef[] = [];
    const files = fs.readdirSync(featuresFolder);
    
    for (const file of files) {
        if (file.match(/^F-\d+.*\.md$/)) {
            const filePath = path.join(featuresFolder, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            // Extract ID and title
            const idMatch = file.match(/^(F-\d+)/);
            const titleMatch = content.match(/^#\s*(.+)$/m);
            
            if (idMatch) {
                features.push({
                    id: idMatch[1],
                    title: titleMatch?.[1]?.replace(/^F-\d+[-:]?\s*/, '') || file,
                    path: filePath
                });
            }
        }
    }

    return features;
}

/**
 * Find stories in project folder
 */
function findStories(projectFolder: string): StoryRef[] {
    const storiesFolder = path.join(projectFolder, 'stories');
    if (!fs.existsSync(storiesFolder)) {
        return [];
    }

    const stories: StoryRef[] = [];
    const states: Array<{ folder: string; state: StoryRef['state'] }> = [
        { folder: 'backlog', state: 'backlog' },
        { folder: 'ready-to-refine', state: 'ready-to-refine' },
        { folder: 'ready-for-development', state: 'ready-for-development' },
    ];

    for (const { folder, state } of states) {
        const stateFolder = path.join(storiesFolder, folder);
        if (!fs.existsSync(stateFolder)) {
            continue;
        }

        const files = fs.readdirSync(stateFolder);
        for (const file of files) {
            if (file.match(/^S-\d+.*\.md$/)) {
                const filePath = path.join(stateFolder, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                
                const idMatch = file.match(/^(S-\d+)/);
                const titleMatch = content.match(/^#\s*(.+)$/m);
                const featureMatch = content.match(/Linked Feature[s]?:?\s*(F-\d+)/i) ||
                                   content.match(/Feature:?\s*(F-\d+)/i);
                
                if (idMatch) {
                    stories.push({
                        id: idMatch[1],
                        title: titleMatch?.[1]?.replace(/^S-\d+[-:]?\s*/, '') || file,
                        path: filePath,
                        state,
                        featureId: featureMatch?.[1]
                    });
                }
            }
        }
    }

    return stories;
}

/**
 * Find ADRs in project folder
 */
function findAdrs(projectFolder: string): AdrRef[] {
    const adrFolder = path.join(projectFolder, 'adr');
    if (!fs.existsSync(adrFolder)) {
        return [];
    }

    const adrs: AdrRef[] = [];
    const files = fs.readdirSync(adrFolder);
    
    for (const file of files) {
        if (file.match(/^ADR-\d+.*\.md$/)) {
            const filePath = path.join(adrFolder, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            const idMatch = file.match(/^(ADR-\d+)/);
            const titleMatch = content.match(/^#\s*(.+)$/m);
            
            if (idMatch) {
                adrs.push({
                    id: idMatch[1],
                    title: titleMatch?.[1]?.replace(/^ADR-\d+[-:]?\s*/, '') || file,
                    path: filePath
                });
            }
        }
    }

    return adrs;
}

/**
 * Find active sprint
 */
function findActiveSprint(projectFolder: string): SprintInfo | undefined {
    const sprintsFolder = path.join(projectFolder, 'sprints');
    if (!fs.existsSync(sprintsFolder)) {
        return undefined;
    }

    // Look for active-sprint.md
    const activeSprintPath = path.join(sprintsFolder, 'active-sprint.md');
    if (fs.existsSync(activeSprintPath)) {
        const content = fs.readFileSync(activeSprintPath, 'utf-8');
        const numberMatch = content.match(/Sprint[:\s]+(\d+)/i);
        const goalMatch = content.match(/Goal:?\s*(.+)$/m);
        
        if (numberMatch) {
            return {
                number: parseInt(numberMatch[1], 10),
                goal: goalMatch?.[1]?.trim(),
                folder: path.join(sprintsFolder, `sprint-${numberMatch[1]}`)
            };
        }
    }

    // Find highest numbered sprint folder
    const folders = fs.readdirSync(sprintsFolder);
    let maxSprint = 0;
    for (const folder of folders) {
        const match = folder.match(/^sprint-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxSprint) {
                maxSprint = num;
            }
        }
    }

    if (maxSprint > 0) {
        const sprintFolder = path.join(sprintsFolder, `sprint-${maxSprint}`);
        const goalPath = path.join(sprintFolder, 'sprint-goal.md');
        let goal: string | undefined;
        
        if (fs.existsSync(goalPath)) {
            const content = fs.readFileSync(goalPath, 'utf-8');
            const goalMatch = content.match(/Goal:?\s*(.+)$/m);
            goal = goalMatch?.[1]?.trim();
        }

        return {
            number: maxSprint,
            goal,
            folder: sprintFolder
        };
    }

    return undefined;
}

/**
 * Gather workspace context for TeamSpec commands
 */
export async function gatherContext(): Promise<WorkspaceContext> {
    const context: WorkspaceContext = {
        features: [],
        stories: [],
        adrs: []
    };

    // Get workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return context;
    }

    const workspaceFolder = workspaceFolders[0];
    context.workspaceRoot = workspaceFolder.uri.fsPath;

    // Find project folder
    context.projectFolder = findProjectFolder(workspaceFolder);
    
    if (context.projectFolder) {
        // Get project metadata
        context.projectMeta = parseProjectMeta(context.projectFolder);
        
        // Find features, stories, ADRs
        context.features = findFeatures(context.projectFolder);
        context.stories = findStories(context.projectFolder);
        context.adrs = findAdrs(context.projectFolder);
        
        // Find active sprint
        context.activeSprint = findActiveSprint(context.projectFolder);
    }

    // Get current file and selection
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        context.currentFile = editor.document.uri.fsPath;
        
        const selection = editor.selection;
        if (!selection.isEmpty) {
            context.currentSelection = editor.document.getText(selection);
        }
    }

    return context;
}

/**
 * Read a specific file's content for context
 */
export async function readFileContent(filePath: string, maxLines: number = 200): Promise<string | undefined> {
    try {
        if (!fs.existsSync(filePath)) {
            return undefined;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        if (lines.length > maxLines) {
            return lines.slice(0, maxLines).join('\n') + `\n\n... (truncated, ${lines.length - maxLines} more lines)`;
        }
        
        return content;
    } catch (error) {
        console.warn(`Failed to read file: ${filePath}`, error);
        return undefined;
    }
}

/**
 * Format context for prompt injection
 */
export function formatContextForPrompt(context: WorkspaceContext): string {
    const parts: string[] = [];

    parts.push('## Current Workspace Context');
    parts.push('');

    if (context.projectMeta) {
        parts.push(`**Project:** ${context.projectMeta.name} (${context.projectMeta.id})`);
        if (context.projectMeta.description) {
            parts.push(`**Description:** ${context.projectMeta.description}`);
        }
    }

    if (context.currentFile) {
        parts.push(`**Current File:** ${context.currentFile}`);
    }

    if (context.activeSprint) {
        parts.push(`**Active Sprint:** Sprint ${context.activeSprint.number}`);
        if (context.activeSprint.goal) {
            parts.push(`**Sprint Goal:** ${context.activeSprint.goal}`);
        }
    }

    if (context.features.length > 0) {
        parts.push('');
        parts.push('### Features');
        for (const f of context.features.slice(0, 10)) {
            parts.push(`- ${f.id}: ${f.title}`);
        }
    }

    if (context.stories.length > 0) {
        parts.push('');
        parts.push('### Stories');
        for (const s of context.stories.slice(0, 10)) {
            parts.push(`- ${s.id}: ${s.title} [${s.state}]`);
        }
    }

    if (context.adrs.length > 0) {
        parts.push('');
        parts.push('### ADRs');
        for (const a of context.adrs.slice(0, 10)) {
            parts.push(`- ${a.id}: ${a.title}`);
        }
    }

    return parts.join('\n');
}
