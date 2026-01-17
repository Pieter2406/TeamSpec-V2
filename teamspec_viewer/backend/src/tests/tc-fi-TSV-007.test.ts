/**
 * Unit Tests for tc-fi-TSV-007: Dashboard Filtering and Ordering
 * 
 * Test Case: tc-fi-TSV-007-dashboard-filtering-ordering.md
 * Feature-Increment: fi-TSV-007-dashboard-filtering-ordering
 * 
 * Note: Filtering is implemented on the frontend using filterAndSortArtifacts utility.
 * These tests validate the backend returns the data needed for filtering.
 */

import { describe, it, expect } from 'vitest';
import app from '../index';

describe('TC-fi-TSV-007: Dashboard Filtering and Ordering', () => {
    const PRODUCT_ID = 'teamspec-viewer';

    describe('TC-001: Backend Returns Artifacts with Status', () => {
        it('should return features with status field', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.artifacts).toBeDefined();
            expect(Array.isArray(json.artifacts)).toBe(true);

            // All artifacts should have status field
            json.artifacts.forEach((artifact: any) => {
                expect(artifact).toHaveProperty('status');
            });
        });

        it('should return BA artifacts with status field', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/business-analysis`);
            expect(res.status).toBe(200);

            const json = await res.json();
            json.artifacts.forEach((artifact: any) => {
                expect(artifact).toHaveProperty('status');
            });
        });
    });

    describe('TC-002: Relationships Include Status', () => {
        it('should include status in feature relationships', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );
                const relationships = await relationshipsRes.json();

                // Feature-Increments should have status
                if (relationships.featureIncrements?.length > 0) {
                    relationships.featureIncrements.forEach((fi: any) => {
                        expect(fi).toHaveProperty('status');
                    });
                }

                // Epics should have status
                if (relationships.epics?.length > 0) {
                    relationships.epics.forEach((epic: any) => {
                        expect(epic).toHaveProperty('status');
                    });
                }

                // Stories should have status
                if (relationships.stories?.length > 0) {
                    relationships.stories.forEach((story: any) => {
                        expect(story).toHaveProperty('status');
                    });
                }
            }
        });
    });

    describe('TC-003: Terminal State Recognition', () => {
        it('should return valid status values for features', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const json = await res.json();

            const validFeatureStatuses = ['Planned', 'Active', 'Deprecated', 'Retired'];

            json.artifacts.forEach((artifact: any) => {
                if (artifact.status) {
                    expect(validFeatureStatuses).toContain(artifact.status);
                }
            });
        });
    });

    describe('TC-004: Data Completeness for Filtering', () => {
        it('should return all required fields for filtering', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const json = await res.json();

            json.artifacts.forEach((artifact: any) => {
                // Required for filtering
                expect(artifact).toHaveProperty('id');
                expect(artifact).toHaveProperty('title');
                expect(artifact).toHaveProperty('status');
                expect(artifact).toHaveProperty('type');
            });
        });

        it('should return title for alphabetical sorting', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const json = await res.json();

            json.artifacts.forEach((artifact: any) => {
                expect(artifact.title).toBeDefined();
                expect(typeof artifact.title).toBe('string');
                expect(artifact.title.length).toBeGreaterThan(0);
            });
        });
    });

    describe('TC-005: Multiple Products Support', () => {
        it('should return empty array for non-existent product', async () => {
            const res = await app.request('/api/products/nonexistent-product/features');
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.artifacts).toEqual([]);
        });
    });
});
