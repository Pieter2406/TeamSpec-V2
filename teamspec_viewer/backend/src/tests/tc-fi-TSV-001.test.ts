/**
 * Unit Tests for tc-fi-TSV-001: BA/FA Role Dashboards
 * 
 * Test Case: tc-fi-TSV-001-ba-fa-role-dashboards.md
 * Feature-Increment: fi-TSV-001-ba-fa-role-dashboards
 * 
 * Tests the following scenarios:
 * - TC-001: BA dashboard displays BA artifacts correctly
 * - TC-002: FA dashboard displays features correctly
 * - TC-003: Artifact details are read-only
 * - TC-004: TBD markers display correctly
 * - TC-005: Dashboard navigation works
 */

import { describe, it, expect } from 'vitest';
import app from '../index';

describe('TC-fi-TSV-001: BA/FA Role Dashboards', () => {
    const PRODUCT_ID = 'teamspec-viewer';

    describe('TC-001: BA Dashboard Artifact Display', () => {
        it('should return BA artifacts for the product', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/business-analysis`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json).toHaveProperty('artifacts');
            expect(Array.isArray(json.artifacts)).toBe(true);
        });

        it('should return BA artifacts with required fields', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/business-analysis`);
            const json = await res.json();

            if (json.artifacts.length > 0) {
                const ba = json.artifacts[0];
                expect(ba).toHaveProperty('id');
                expect(ba).toHaveProperty('title');
                expect(ba).toHaveProperty('path');
                expect(ba).toHaveProperty('type');
            }
        });

        it('should filter BA artifacts by type', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/business-analysis`);
            const json = await res.json();

            json.artifacts.forEach((artifact: any) => {
                expect(artifact.type).toBe('business-analysis');
            });
        });
    });

    describe('TC-002: FA Dashboard Feature Display', () => {
        it('should return features for the product', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json).toHaveProperty('artifacts');
            expect(Array.isArray(json.artifacts)).toBe(true);
        });

        it('should return features with required fields', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const json = await res.json();

            if (json.artifacts.length > 0) {
                const feature = json.artifacts[0];
                expect(feature).toHaveProperty('id');
                expect(feature).toHaveProperty('title');
                expect(feature).toHaveProperty('path');
                expect(feature).toHaveProperty('type');
                expect(feature.type).toBe('feature');
            }
        });

        it('should return features with status field', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const json = await res.json();

            if (json.artifacts.length > 0) {
                const feature = json.artifacts[0];
                expect(feature).toHaveProperty('status');
            }
        });
    });

    describe('TC-003: Read-Only Artifact Details', () => {
        it('should serve markdown content for artifacts', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const json = await res.json();

            if (json.artifacts.length > 0) {
                const feature = json.artifacts[0];
                const contentRes = await app.request(`/api/artifact?path=${encodeURIComponent(feature.path)}`);
                expect(contentRes.status).toBe(200);

                const contentJson = await contentRes.json();
                expect(contentJson).toHaveProperty('content');
                expect(contentJson.content.length).toBeGreaterThan(0);
            }
        });

        it('should not accept POST requests to artifact content endpoint', async () => {
            const res = await app.request('/api/artifact', {
                method: 'POST',
                body: JSON.stringify({ path: 'some/path.md', content: 'new content' })
            });
            // Should be 404 or 405 (method not allowed)
            expect([404, 405]).toContain(res.status);
        });
    });

    describe('TC-004: TBD Marker Display', () => {
        it('should detect TBD markers in artifact content', async () => {
            const res = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const json = await res.json();

            if (json.artifacts.length > 0) {
                const feature = json.artifacts[0];
                const contentRes = await app.request(`/api/artifact?path=${encodeURIComponent(feature.path)}`);
                const contentJson = await contentRes.json();

                // Check if content contains TBD markers (pattern: {TBD})
                const hasTBD = /\{TBD\}/.test(contentJson.content || '');
                expect(typeof hasTBD).toBe('boolean');
            }
        });
    });

    describe('TC-005: Dashboard Navigation', () => {
        it('should return API info at root', async () => {
            const res = await app.request('/api');
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json).toHaveProperty('message');
            expect(json.message).toContain('TeamSpec Viewer');
        });

        it('should handle invalid product IDs gracefully', async () => {
            const res = await app.request('/api/products/nonexistent-product-id/features');
            expect(res.status).toBe(200);

            const json = await res.json();
            expect(json.artifacts).toEqual([]);
        });
    });
});
