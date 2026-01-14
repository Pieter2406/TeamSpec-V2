const API_BASE = 'http://localhost:3000/api';

export interface Artifact {
    id: string;
    path: string;
    title: string;
    type: string;
    status?: string;
}

export interface ArtifactsResponse {
    artifacts: Artifact[];
}

export interface ArtifactContentResponse {
    content: string;
    path: string;
}

// BA artifacts
export async function getBusinessAnalysis(productId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/business-analysis`);
    if (!response.ok) throw new Error('Failed to fetch business analysis');
    return response.json();
}

export async function getBusinessAnalysisIncrements(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/business-analysis-increments`);
    if (!response.ok) throw new Error('Failed to fetch BA increments');
    return response.json();
}

// FA artifacts
export async function getFeatures(productId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/features`);
    if (!response.ok) throw new Error('Failed to fetch features');
    return response.json();
}

export async function getFeatureIncrements(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/feature-increments`);
    if (!response.ok) throw new Error('Failed to fetch feature increments');
    return response.json();
}

export async function getEpics(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/epics`);
    if (!response.ok) throw new Error('Failed to fetch epics');
    return response.json();
}

export async function getStories(projectId: string): Promise<ArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/stories`);
    if (!response.ok) throw new Error('Failed to fetch stories');
    return response.json();
}

// Artifact content
export async function getArtifactContent(path: string): Promise<ArtifactContentResponse> {
    const response = await fetch(`${API_BASE}/artifact?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new Error('Failed to fetch artifact content');
    return response.json();
}
