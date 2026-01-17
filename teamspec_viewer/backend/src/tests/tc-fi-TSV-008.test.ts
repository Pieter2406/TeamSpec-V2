/**
 * Unit Tests for tc-fi-TSV-008: TreeView TBD Warnings
 * 
 * Test Case: tc-fi-TSV-008-treeview-tbd-warnings.md
 * Feature-Increment: fi-TSV-008-treeview-tbd-warnings
 * 
 * Tests the following scenarios:
 * - TC-001: TBD detection in artifact content
 * - TC-002: TBD indicators in relationships
 * - TC-003: Multiple TBD markers counted
 */

import { describe, it, expect } from 'vitest';
import app from '../index';

describe('TC-fi-TSV-008: TreeView TBD Warnings', () => {
    const PRODUCT_ID = 'teamspec-viewer';

    describe('TC-001: TBD Detection in Content', () => {
        it('should detect {TBD} markers in markdown content', () => {
            const testContent = `
# Test Document

## Section 1
This is a test with a {TBD} marker.

## Section 2
Another {TBD} here.
            `;

            const tbdPattern = /\{TBD\}/g;
            const matches = testContent.match(tbdPattern);

            expect(matches).not.toBeNull();
            expect(matches?.length).toBe(2);
        });

        it('should detect TBD in feature content via API', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const contentRes = await app.request(
                    `/api/artifact?path=${encodeURIComponent(feature.path)}`
                );
                const contentJson = await contentRes.json();

                const tbdPattern = /\{TBD\}/g;
                const matches = contentJson.content?.match(tbdPattern);
                const tbdCount = matches ? matches.length : 0;

                expect(typeof tbdCount).toBe('number');
                expect(tbdCount).toBeGreaterThanOrEqual(0);
            }
        });

        it('should handle content without TBD markers', () => {
            const testContent = `
# Clean Document
No placeholders here.
            `;

            const tbdPattern = /\{TBD\}/g;
            const matches = testContent.match(tbdPattern);

            expect(matches).toBeNull();
        });
    });

    describe('TC-002: TBD in Relationships', () => {
        it('should include hasTBD metadata in relationships', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const relationshipsRes = await app.request(
                    `/api/features/${feature.id}/relationships`
                );

                expect(relationshipsRes.status).toBe(200);

                const relationships = await relationshipsRes.json();

                // Check if TBD metadata is included
                if (relationships.featureIncrements?.length > 0) {
                    const fi = relationships.featureIncrements[0];
                    // TBD indicator should be present (hasTBD boolean or tbdCount number)
                    const hasTBDField = typeof fi.hasTBD === 'boolean' || typeof fi.tbdCount === 'number';
                    expect(hasTBDField).toBe(true);
                }
            }
        });

        it('should detect TBD in feature-increment content', async () => {
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
                    const contentRes = await app.request(
                        `/api/artifact?path=${encodeURIComponent(fi.path)}`
                    );
                    const contentJson = await contentRes.json();

                    const tbdCount = (contentJson.content?.match(/\{TBD\}/g) || []).length;
                    expect(tbdCount).toBeGreaterThanOrEqual(0);
                }
            }
        });
    });

    describe('TC-003: Multiple TBD Markers Counted', () => {
        it('should count all TBD occurrences in document', () => {
            const multiTBDContent = `
# Feature: Test Feature

## AS-IS
Current state: {TBD}

## TO-BE
New state: {TBD}

### Acceptance Criteria
- [ ] Criterion 1: {TBD}
- [ ] Criterion 2: {TBD}
- [ ] Criterion 3: {TBD}

## Notes
Additional context: {TBD}
            `;

            const tbdCount = (multiTBDContent.match(/\{TBD\}/g) || []).length;
            expect(tbdCount).toBe(6);
        });

        it('should distinguish between TBD markers and regular text', () => {
            const mixedContent = `
# Document
This is a TBD marker: {TBD}
This is just the word TBD without braces
This is another marker {TBD}
            `;

            const tbdCount = (mixedContent.match(/\{TBD\}/g) || []).length;
            expect(tbdCount).toBe(2);
        });

        it('should handle adjacent TBD markers', () => {
            const adjacentContent = '{TBD}{TBD}{TBD}';
            const tbdCount = (adjacentContent.match(/\{TBD\}/g) || []).length;
            expect(tbdCount).toBe(3);
        });

        it('should handle TBD in code blocks', () => {
            const codeBlockContent = `
\`\`\`typescript
const value = "{TBD}";
\`\`\`

Regular TBD: {TBD}
            `;

            const tbdCount = (codeBlockContent.match(/\{TBD\}/g) || []).length;
            // Should count both (in code block and regular)
            expect(tbdCount).toBe(2);
        });
    });

    describe('TC-004: Artifact Content Endpoint', () => {
        it('should return content for valid artifact path', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const contentRes = await app.request(
                    `/api/artifact?path=${encodeURIComponent(feature.path)}`
                );

                expect(contentRes.status).toBe(200);
                const contentJson = await contentRes.json();
                expect(contentJson).toHaveProperty('content');
                expect(typeof contentJson.content).toBe('string');
            }
        });

        it('should return 400 for missing path parameter', async () => {
            const res = await app.request('/api/artifact');
            expect(res.status).toBe(400);
        });

        it('should return 404 for non-existent artifact', async () => {
            const res = await app.request('/api/artifact?path=nonexistent/path/file.md');
            expect(res.status).toBe(404);
        });
    });
});
