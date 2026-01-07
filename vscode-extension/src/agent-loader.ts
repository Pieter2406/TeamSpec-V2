/**
 * Agent Loader
 * 
 * Loads agent markdown files from the workspace or bundled resources.
 * Provides the bootstrap + role prompts for each agent.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { RoleCode } from './commands';

// Embedded agent prompts (fallback when files not found)
const EMBEDDED_PROMPTS: Partial<Record<RoleCode | 'BOOTSTRAP', string>> = {
    BOOTSTRAP: `# TeamSpec Bootstrap

You are a **TeamSpec Agent** operating within a Feature-Canon-driven software delivery system.

**Core Principle:** The Feature Canon (/features/) is the AUTHORITATIVE SOURCE OF TRUTH for all system behavior.

## Canon Rules
- CANON-001: Feature Canon is the single source of truth for behavior
- CANON-002: Stories are DELTAS against the Canon, never full documentation
- CANON-003: Canon must be updated before any story is marked Done
- CANON-004: All behavior must trace to a Feature Canon entry
- CANON-005: Business decisions must be logged in /decisions/
- CANON-006: Technical decisions must be logged in /adr/

## Story-as-Delta Philosophy
Stories describe CHANGES to the Feature Canon:
- What behavior exists BEFORE (reference Canon)
- What behavior exists AFTER (the delta)
- Which Canon rules are affected

## Role Boundaries
Each role has explicit ownership:
- BA: Business intent, Features, Decisions
- FA: Behavior specs, Stories, Canon sync
- SA: Technical design, ADRs
- DEV: Implementation, Dev plans
- QA: Verification, Test design
- SM: Sprint operations, Metrics
- DES: UX design, Design artifacts`,
};

/**
 * Cache for loaded agent files
 */
const agentCache: Map<string, string> = new Map();

/**
 * Get the agent files path from workspace or config
 */
function getAgentsPath(workspaceFolder?: vscode.WorkspaceFolder): string | undefined {
    // Check configuration first
    const configPath = vscode.workspace.getConfiguration('teamspec').get<string>('agentsPath');
    if (configPath && fs.existsSync(configPath)) {
        return configPath;
    }

    // Try to find agents folder in workspace
    if (workspaceFolder) {
        // Check for .teamspec/agents or agents/ in project
        const candidates = [
            path.join(workspaceFolder.uri.fsPath, '.teamspec', 'agents'),
            path.join(workspaceFolder.uri.fsPath, 'agents'),
            path.join(workspaceFolder.uri.fsPath, 'teamspec', 'agents'),
        ];

        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }
    }

    // Try extension resources
    const extensionPath = vscode.extensions.getExtension('teamspec.teamspec')?.extensionPath;
    if (extensionPath) {
        const resourcePath = path.join(extensionPath, 'resources', 'agents');
        if (fs.existsSync(resourcePath)) {
            return resourcePath;
        }
    }

    return undefined;
}

/**
 * Load an agent file by role code
 */
export async function loadAgentPrompt(role: RoleCode | 'BOOTSTRAP', workspaceFolder?: vscode.WorkspaceFolder): Promise<string> {
    const cacheKey = `${role}-${workspaceFolder?.uri.fsPath || 'default'}`;
    
    // Check cache
    if (agentCache.has(cacheKey)) {
        return agentCache.get(cacheKey)!;
    }

    const agentsPath = getAgentsPath(workspaceFolder);
    
    if (agentsPath) {
        // Map role code to filename
        const filename = role === 'BOOTSTRAP' ? 'AGENT_BOOTSTRAP.md' : `AGENT_${role}.md`;
        const filePath = path.join(agentsPath, filename);
        
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                agentCache.set(cacheKey, content);
                return content;
            } catch (error) {
                console.warn(`Failed to read agent file: ${filePath}`, error);
            }
        }
    }

    // Fall back to embedded prompt
    const embedded = EMBEDDED_PROMPTS[role] || EMBEDDED_PROMPTS.BOOTSTRAP!;
    agentCache.set(cacheKey, embedded);
    return embedded;
}

/**
 * Clear the agent cache (for development/reload)
 */
export function clearAgentCache(): void {
    agentCache.clear();
}

/**
 * Preload all agent prompts
 */
export async function preloadAgents(workspaceFolder?: vscode.WorkspaceFolder): Promise<void> {
    const roles: (RoleCode | 'BOOTSTRAP')[] = ['BOOTSTRAP', 'BA', 'FA', 'SA', 'DEV', 'QA', 'SM', 'DES'];
    await Promise.all(roles.map(role => loadAgentPrompt(role, workspaceFolder)));
}
