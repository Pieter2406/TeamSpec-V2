/**
 * Search API
 * Handles artifact search functionality
 */
import { API_BASE } from './common';

export interface SearchResult {
    id: string;
    title: string;
    type: string;
    path: string;
    snippet: string;
    role?: string;
}

export interface SearchResponse {
    query: string;
    results: SearchResult[];
    count: number;
}

/**
 * Search artifacts by query with optional filters
 */
export async function searchArtifacts(
    query: string,
    filters?: { type?: string; role?: string }
): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: query });
    if (filters?.type) params.set('type', filters.type);
    if (filters?.role) params.set('role', filters.role);

    const response = await fetch(`${API_BASE}/search?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to search artifacts');
    return response.json();
}
