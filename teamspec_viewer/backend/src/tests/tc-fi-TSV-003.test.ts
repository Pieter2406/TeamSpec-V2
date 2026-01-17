/**
 * Unit Tests for tc-fi-TSV-003: BA/FA Artifact Search
 * 
 * Test Case: tc-fi-TSV-003-ba-fa-artifact-search.md
 * Feature-Increment: fi-TSV-003-ba-fa-artifact-search
 * 
 * Tests the following scenarios:
 * - TC-001: Search returns matching artifacts
 * - TC-002: Role-specific filtering works
 * - TC-003: Search handles empty results
 * - TC-004: Search by artifact type works
 */

import { describe, it, expect } from 'vitest';
import app from '../index';

describe('TC-fi-TSV-003: BA/FA Artifact Search', () => {
    const PRODUCT_ID = 'teamspec-viewer';

    describe('TC-001: Search Returns Matching Artifacts', () => {
        it('should search artifacts by query', async () => {
            const res = await app.request(`/api/search?query=dashboard`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json).toHaveProperty('results');
            expect(Array.isArray(json.results)).toBe(true);
        });

        it('should return artifacts with search-relevant fields', async () => {
            const res = await app.request(`/api/search?query=feature`);
            const json = await res.json();

            if (json.results && json.results.length > 0) {
                const result = json.results[0];
                expect(result).toHaveProperty('id');
                expect(result).toHaveProperty('title');
                expect(result).toHaveProperty('type');
                expect(result).toHaveProperty('path');
            }
        });

        it('should match case-insensitively', async () => {
            const upperRes = await app.request(`/api/search?query=DASHBOARD`);
            const lowerRes = await app.request(`/api/search?query=dashboard`);

            const upperJson = await upperRes.json();
            const lowerJson = await lowerRes.json();

            // Should return same number of results regardless of case
            expect(upperJson.results?.length).toBe(lowerJson.results?.length);
        });
    });

    describe('TC-002: Role-Specific Filtering', () => {
        it('should filter by BA artifact types', async () => {
            const res = await app.request(
                `/api/search?query=analysis&types=business-analysis,ba-increment`
            );
            const json = await res.json();

            if (json.results && json.results.length > 0) {
                json.results.forEach((artifact: any) => {
                    expect(['business-analysis', 'ba-increment']).toContain(artifact.type);
                });
            }
        });

        it('should filter by FA artifact types', async () => {
            const res = await app.request(
                `/api/search?query=feature&types=feature,feature-increment`
            );
            const json = await res.json();

            if (json.results && json.results.length > 0) {
                json.results.forEach((artifact: any) => {
                    expect(['feature', 'feature-increment']).toContain(artifact.type);
                });
            }
        });

        it('should return all types when no filter specified', async () => {
            const res = await app.request(`/api/search?query=test`);
            const json = await res.json();

            expect(res.status).toBe(200);
            expect(Array.isArray(json.results)).toBe(true);
        });
    });

    describe('TC-003: Empty Search Results', () => {
        it('should handle non-matching queries gracefully', async () => {
            const res = await app.request(
                `/api/search?query=xyznonexistentqueryxyz123`
            );
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.results).toEqual([]);
        });

        it('should handle empty query string', async () => {
            const res = await app.request(`/api/search?query=`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(Array.isArray(json.results)).toBe(true);
        });

        it('should handle missing query parameter', async () => {
            const res = await app.request(`/api/search`);
            // Should either return 400 or all artifacts
            expect([200, 400]).toContain(res.status);
        });
    });

    describe('TC-004: Search by Artifact Type', () => {
        it('should return only features when type filter is feature', async () => {
            const res = await app.request(
                `/api/search?types=feature`
            );
            const json = await res.json();

            if (json.results && json.results.length > 0) {
                json.results.forEach((artifact: any) => {
                    expect(artifact.type).toBe('feature');
                });
            }
        });

        it('should support multiple type filters', async () => {
            const res = await app.request(
                `/api/search?types=feature,epic,story`
            );
            const json = await res.json();

            if (json.results && json.results.length > 0) {
                json.results.forEach((artifact: any) => {
                    expect(['feature', 'epic', 'story']).toContain(artifact.type);
                });
            }
        });

        it('should handle invalid type filters gracefully', async () => {
            const res = await app.request(
                `/api/search?types=invalid-type`
            );
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.results).toEqual([]);
        });
    });
});
