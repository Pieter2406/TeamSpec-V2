/**
 * Stories API
 * Handles epics, stories, and dev plans
 */
import { API_BASE, ArtifactsResponse, ScopedArtifactsResponse } from './common';

/**
 * Get epics for a project
 */
export async function getEpics(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/epics`);
    if (!response.ok) throw new Error('Failed to fetch epics');
    return response.json();
}

/**
 * Get stories for a project
 */
export async function getStories(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/stories`);
    if (!response.ok) throw new Error('Failed to fetch stories');
    return response.json();
}

/**
 * Get dev-plans for a project
 */
export async function getDevPlans(projectId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/dev-plans`);
    if (!response.ok) throw new Error('Failed to fetch dev-plans');
    return response.json();
}
