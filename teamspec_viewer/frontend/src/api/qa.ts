/**
 * QA API
 * Handles test cases, regression tests, and bug reports
 */
import { API_BASE, ScopedArtifactsResponse } from './common';

/**
 * Get test cases for a project
 */
export async function getTestCases(projectId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/test-cases`);
    if (!response.ok) throw new Error('Failed to fetch test cases');
    return response.json();
}

/**
 * Get regression tests for a product
 */
export async function getRegressionTests(productId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/products/${productId}/regression-tests`);
    if (!response.ok) throw new Error('Failed to fetch regression tests');
    return response.json();
}

/**
 * Get bug reports for a project
 */
export async function getBugReports(projectId: string): Promise<ScopedArtifactsResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/bug-reports`);
    if (!response.ok) throw new Error('Failed to fetch bug reports');
    return response.json();
}
