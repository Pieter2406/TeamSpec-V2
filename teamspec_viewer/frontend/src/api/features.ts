/**
 * Features API
 * Handles features and feature increments
 */
import { API_BASE, ArtifactsResponse, Artifact } from './common';

// Feature Increment types
export interface FISectionsResponse {
    fiId: string;
    asIs: string;
    toBe: string;
}

export interface LinkedStoriesResponse {
    fiId: string;
    stories: Artifact[];
    count: number;
}

export interface FeatureIncrementsResponse {
    featureId: string;
    increments: Artifact[];
    count: number;
}

// Feature Relationships types
export interface StoryInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;
}

export interface EpicInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    stories: StoryInfo[];
    hasTBD?: boolean;
}

export interface FIInfo {
    id: string;
    title: string;
    status?: string;
    project: string;
    path: string;
    epic?: EpicInfo;
    hasTBD?: boolean;
}

export interface FeatureInfo {
    id: string;
    title: string;
    status?: string;
    path: string;
    hasTBD?: boolean;
}

export interface FeatureRelationshipsResponse {
    feature: FeatureInfo;
    featureIncrements: FIInfo[];
}

export interface FICountsResponse {
    counts: Record<string, number>;
}

/**
 * Get features for a product
 */
export async function getFeatures(productId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/features`);
    if (!response.ok) throw new Error('Failed to fetch features');
    return response.json();
}

/**
 * Get feature increments for a project
 */
export async function getFeatureIncrements(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/feature-increments`);
    if (!response.ok) throw new Error('Failed to fetch feature increments');
    return response.json();
}

/**
 * Get FI sections (AS-IS/TO-BE)
 */
export async function getFISections(fiId: string, projectId: string = 'teamspecviewermvp'): Promise<FISectionsResponse> {
    const response = await fetch(`${API_BASE}/feature-increments/${fiId}/sections?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch FI sections');
    return response.json();
}

/**
 * Get stories linked to a feature increment
 */
export async function getLinkedStories(fiId: string, projectId: string = 'teamspecviewermvp'): Promise<LinkedStoriesResponse> {
    const response = await fetch(`${API_BASE}/feature-increments/${fiId}/stories?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch linked stories');
    return response.json();
}

/**
 * Get feature increments for a specific feature
 */
export async function getFeatureIncrementsForFeature(featureId: string, projectId: string = 'teamspecviewermvp'): Promise<FeatureIncrementsResponse> {
    const response = await fetch(`${API_BASE}/features/${featureId}/increments?projectId=${projectId}`);
    if (!response.ok) throw new Error('Failed to fetch feature increments');
    return response.json();
}

/**
 * Get full relationship tree for a feature (Feature → FIs → Epics → Stories)
 */
export async function getFeatureRelationships(featureId: string): Promise<FeatureRelationshipsResponse> {
    const response = await fetch(`${API_BASE}/features/${featureId}/relationships`);
    if (!response.ok) throw new Error('Failed to fetch feature relationships');
    return response.json();
}

/**
 * Get FI counts for multiple features at once (for dashboard optimization)
 */
export async function getFeatureFICounts(featureIds: string[]): Promise<FICountsResponse> {
    const response = await fetch(`${API_BASE}/features/fi-counts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureIds }),
    });
    if (!response.ok) throw new Error('Failed to fetch FI counts');
    return response.json();
}
