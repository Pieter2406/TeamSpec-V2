/**
 * Solution Architecture API
 * Handles TA, SD documents and increments
 */
import { API_BASE, ScopedArtifactsResponse } from './common';

/**
 * Get technical architecture documents for a product
 */
export async function getTechnicalArchitecture(productId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/technical-architecture`);
    if (!response.ok) throw new Error('Failed to fetch technical architecture');
    return response.json();
}

/**
 * Get TA increments for a project
 */
export async function getTAIncrements(projectId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/tai`);
    if (!response.ok) throw new Error('Failed to fetch TA increments');
    return response.json();
}

/**
 * Get solution designs for a product
 */
export async function getSolutionDesigns(productId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/solution-designs`);
    if (!response.ok) throw new Error('Failed to fetch solution designs');
    return response.json();
}

/**
 * Get SD increments for a project
 */
export async function getSDIncrements(projectId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/sdi`);
    if (!response.ok) throw new Error('Failed to fetch SD increments');
    return response.json();
}
