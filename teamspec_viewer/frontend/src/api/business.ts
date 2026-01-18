/**
 * Business Analysis API
 * Handles BA documents and increments
 */
import { API_BASE, ArtifactsResponse } from './common';

// BA Relationships types
export interface BAInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;
}

export interface BAIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    hasTBD?: boolean;
}

export interface BARelationshipsResponse {
    ba: BAInfo;
    baIncrements: BAIInfo[];
}

export interface BAICountsResponse {
    counts: Record<string, number>;
}

/**
 * Get business analysis documents for a product
 */
export async function getBusinessAnalysis(productId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/business-analysis`);
    if (!response.ok) throw new Error('Failed to fetch business analysis');
    return response.json();
}

/**
 * Get BA increments for a project
 */
export async function getBusinessAnalysisIncrements(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/business-analysis-increments`);
    if (!response.ok) throw new Error('Failed to fetch BA increments');
    return response.json();
}

/**
 * Get full relationship tree for a BA document (BA → BAIs)
 */
export async function getBARelationships(baId: string): Promise<BARelationshipsResponse> {
    const response = await fetch(`${API_BASE}/ba/${baId}/relationships`);
    if (!response.ok) throw new Error('Failed to fetch BA relationships');
    return response.json();
}

/**
 * Get BAI counts for multiple BA documents at once (for dashboard optimization)
 */
export async function getBABAICounts(baIds: string[]): Promise<BAICountsResponse> {
    const response = await fetch(`${API_BASE}/ba/bai-counts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baIds }),
    });
    if (!response.ok) throw new Error('Failed to fetch BAI counts');
    return response.json();
}
