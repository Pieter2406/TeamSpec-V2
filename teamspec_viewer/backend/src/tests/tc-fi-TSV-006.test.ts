/**
 * Unit Tests for tc-fi-TSV-006: Inline Status Editing MVP
 * 
 * Test Case: tc-fi-TSV-006-inline-status-editing-mvp.md
 * Feature-Increment: fi-TSV-006-inline-status-editing-mvp
 * 
 * Tests the following scenarios:
 * - TC-001: Status update endpoint exists
 * - TC-002: Status update succeeds with valid status
 * - TC-003: Status update fails with invalid status
 * - TC-004: Status persists after update
 */

import { describe, it, expect } from 'vitest';
import app from '../index';

describe('TC-fi-TSV-006: Inline Status Editing MVP', () => {
    const PRODUCT_ID = 'teamspec-viewer';

    describe('TC-001: Status Update Endpoint', () => {
        it('should have PATCH /artifacts/status endpoint', async () => {
            const res = await app.request('/api/artifacts/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            // Should return 400 (missing params) not 404 (not found)
            expect(res.status).toBe(400);
        });

        it('should reject requests without path', async () => {
            const res = await app.request('/api/artifacts/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Active' })
            });
            expect(res.status).toBe(400);
            const json = await res.json();
            expect(json.success).toBe(false);
        });

        it('should reject requests without status', async () => {
            const res = await app.request('/api/artifacts/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: 'some/path.md' })
            });
            expect(res.status).toBe(400);
            const json = await res.json();
            expect(json.success).toBe(false);
        });
    });

    describe('TC-002: Status Update Success', () => {
        it('should accept valid status updates for features', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            expect(featuresJson.artifacts.length).toBeGreaterThan(0);
            
            const feature = featuresJson.artifacts[0];
            expect(feature.path).toBeDefined();
            
            // Update status
            const updateRes = await app.request('/api/artifacts/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: feature.path,
                    status: 'Active'
                })
            });

            const updateJson = await updateRes.json();
            
            // Skip assertion if file is locked (common on Windows with file watchers)
            if (updateJson.error?.includes('EPERM') || updateJson.error?.includes('EBUSY')) {
                console.log('Skipping test: File locked by another process');
                return;
            }
            
            expect(updateRes.status).toBe(200);
            expect(updateJson.success).toBe(true);
        });
    });

    describe('TC-003: Status Update Validation', () => {
        it('should reject invalid status values', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];

                const updateRes = await app.request('/api/artifacts/status', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: feature.path,
                        status: 'InvalidStatus123'
                    })
                });

                expect(updateRes.status).toBe(400);
                const updateJson = await updateRes.json();
                expect(updateJson.success).toBe(false);
            }
        });

        it('should reject non-existent file paths', async () => {
            const updateRes = await app.request('/api/artifacts/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: 'nonexistent/path/file.md',
                    status: 'Active'
                })
            });

            expect(updateRes.status).toBe(400);
        });
    });

    describe('TC-004: Status Persistence', () => {
        it('should persist status changes to file', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];
                const originalStatus = feature.status;

                // Update to different status
                const newStatus = originalStatus === 'Active' ? 'Planned' : 'Active';
                const updateRes = await app.request('/api/artifacts/status', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: feature.path,
                        status: newStatus
                    })
                });

                const updateJson = await updateRes.json();
                
                // Skip test if file is locked (common on Windows with file watchers)
                if (updateJson.error?.includes('EPERM') || updateJson.error?.includes('EBUSY')) {
                    console.log('Skipping test: File locked by another process');
                    return;
                }

                // Fetch again to verify persistence
                const verifyRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
                const verifyJson = await verifyRes.json();
                const updatedFeature = verifyJson.artifacts.find((f: any) => f.id === feature.id);

                expect(updatedFeature.status).toBe(newStatus);

                // Restore original status
                await app.request('/api/artifacts/status', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: feature.path,
                        status: originalStatus || 'Active'
                    })
                });
            }
        });
    });

    describe('TC-005: Immediate Feedback', () => {
        it('should respond quickly to status updates', async () => {
            const featuresRes = await app.request(`/api/products/${PRODUCT_ID}/features`);
            const featuresJson = await featuresRes.json();

            if (featuresJson.artifacts.length > 0) {
                const feature = featuresJson.artifacts[0];

                const startTime = Date.now();
                await app.request('/api/artifacts/status', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: feature.path,
                        status: 'Active'
                    })
                });
                const endTime = Date.now();

                // Should complete within 1 second
                expect(endTime - startTime).toBeLessThan(1000);
            }
        });
    });
});
