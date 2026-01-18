/**
 * Common API types and utilities
 * Shared across all API domain modules
 */

export const API_BASE = 'http://localhost:3000/api';

export interface Artifact {
    id: string;
    path: string;
    title: string;
    type: string;
    status?: string;
    hasTBD?: boolean;
}

export interface ArtifactsResponse {
    artifacts: Artifact[];
}

export interface ArtifactContentResponse {
    content: string;
    path: string;
}

export interface ScopedArtifactsResponse {
    artifacts: Artifact[];
    count: number;
    scope: 'product' | 'project';
}

export interface StatusUpdateResponse {
    success: boolean;
    previousStatus?: string;
    newStatus?: string;
    error?: string;
}

/**
 * Get artifact content by path
 */
export async function getArtifactContent(path: string): Promise<ArtifactContentResponse> {
    const response = await fetch(`${API_BASE}/artifact?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new Error('Failed to fetch artifact content');
    return response.json();
}

/**
 * Update the status of an artifact
 */
export async function updateArtifactStatus(
    path: string,
    status: string
): Promise<StatusUpdateResponse> {
    const response = await fetch(`${API_BASE}/artifacts/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, status }),
    });
    return response.json();
}
