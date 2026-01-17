/**
 * Unit Tests for tc-fi-TSV-002: BA/FA Feature-Increment Navigation
 * 
 * Test Case: tc-fi-TSV-002-ba-fa-feature-increment-navigation.md
 * Feature-Increment: fi-TSV-002-ba-fa-feature-increment-navigation
 * 
 * Tests the following scenarios:
 * - TC-001: FI reader displays AS-IS and TO-BE sections
 * - TC-002: FI navigation from feature works
 * - TC-003: FI metadata is complete
 * - TC-004: Multiple FIs for single feature work
 */

import { describe, it, expect } from 'vitest';
import app from '../index';

describe('TC-fi-TSV-002: BA/FA Feature-Increment Navigation', () => {
    const PRODUCT_ID = 'teamspec-viewer';

    describe('TC-001: FI Reader AS-IS/TO-BE Display', () => {
        it('should return FI content with markdown structure', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];

                // Get FI relationships
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );
                const relationships = await relationshipsRes.json();

                if (relationships.featureIncrements?.length > 0) {
                    const fi = relationships.featureIncrements[0];
                    const contentRes = await app.request(
                        `/api/artifact?path=${encodeURIComponent(fi.path)}`
                    );
                    const contentJson = await contentRes.json();

                    // Check for AS-IS section (numbered like "## 2. AS-IS")
                    expect(contentJson.content).toMatch(/##\s*\d*\.?\s*AS-IS/i);
                    // Check for TO-BE section
                    expect(contentJson.content).toMatch(/##\s*\d*\.?\s*TO-BE/i);
                }
            }
        });

        it('should parse FI frontmatter correctly', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );
                const relationships = await relationshipsRes.json();

                if (relationships.featureIncrements?.length > 0) {
                    const fi = relationships.featureIncrements[0];
                    expect(fi).toHaveProperty('id');
                    expect(fi).toHaveProperty('title');
                    expect(fi).toHaveProperty('path');
                }
            }
        });
    });

    describe('TC-002: FI Navigation from Feature', () => {
        it('should return feature relationships including FIs', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );

                expect(relationshipsRes.status).toBe(200);

                const relationships = await relationshipsRes.json();
                expect(relationships).toHaveProperty('feature');
                expect(relationships).toHaveProperty('featureIncrements');
                expect(Array.isArray(relationships.featureIncrements)).toBe(true);
            }
        });

        it('should handle features with no FIs gracefully', async () => {
            const res = await app.request('/api/features/f-NONEXISTENT-999/relationships');
            // Should return 404 or empty result
            expect([200, 404]).toContain(res.status);

            if (res.status === 200) {
                const json = await res.json();
                expect(json.featureIncrements || []).toEqual([]);
            }
        });
    });

    describe('TC-003: FI Metadata Completeness', () => {
        it('should include status in FI metadata', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );
                const relationships = await relationshipsRes.json();

                if (relationships.featureIncrements?.length > 0) {
                    const fi = relationships.featureIncrements[0];
                    expect(fi).toHaveProperty('status');
                }
            }
        });

        it('should include project context in FI metadata', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );
                const relationships = await relationshipsRes.json();

                if (relationships.featureIncrements?.length > 0) {
                    const fi = relationships.featureIncrements[0];
                    expect(fi).toHaveProperty('project');
                }
            }
        });
    });

    describe('TC-004: Multiple FIs per Feature', () => {
        it('should return all FIs for a feature', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            for (const feature of featuresJson.artifacts) {
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );
                const relationships = await relationshipsRes.json();

                // Each feature should have featureIncrements array (may be empty)
                expect(Array.isArray(relationships.featureIncrements)).toBe(true);

                // If multiple FIs exist, they should have unique IDs
                if (relationships.featureIncrements.length > 1) {
                    const ids = relationships.featureIncrements.map((fi: any) => fi.id);
                    const uniqueIds = new Set(ids);
                    expect(uniqueIds.size).toBe(ids.length);
                }
            }
        });
    });
});
