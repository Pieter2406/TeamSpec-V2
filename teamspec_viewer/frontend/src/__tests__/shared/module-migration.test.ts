/**
 * Shared Module Migration Tests
 * TDD tests for s-e010-002: Verify shared module structure and exports
 */
import { describe, it, expect } from 'vitest';
import path from 'path';
import { existsSync } from 'fs';

describe('Shared Module Migration', () => {
    const srcPath = path.resolve(__dirname, '../../');
    
    describe('Files Exist in shared/', () => {
        const sharedFiles = [
            'shared/contexts/RoleContext.tsx',
            'shared/contexts/ToastContext.tsx',
            'shared/contexts/index.ts',
            'shared/hooks/useArtifactFilter.ts',
            'shared/hooks/index.ts',
            'shared/utils/artifactIcons.ts',
            'shared/utils/artifactSorting.ts',
            'shared/utils/statusOptions.ts',
            'shared/utils/index.ts',
            'shared/constants/stateOrdering.ts',
            'shared/constants/index.ts',
            'shared/index.ts',
        ];

        it.each(sharedFiles)('should have %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });

    describe('Barrel Exports', () => {
        it('should export contexts from @/shared/contexts', async () => {
            const contexts = await import('@/shared/contexts');
            expect(contexts.RoleProvider).toBeDefined();
            expect(contexts.useRole).toBeDefined();
            expect(contexts.ToastProvider).toBeDefined();
            expect(contexts.useToast).toBeDefined();
        });

        it('should export hooks from @/shared/hooks', async () => {
            const hooks = await import('@/shared/hooks');
            expect(hooks.useArtifactFilter).toBeDefined();
        });

        it('should export utils from @/shared/utils', async () => {
            const utils = await import('@/shared/utils');
            expect(utils.getArtifactIcon).toBeDefined();
            expect(utils.filterAndSortArtifacts).toBeDefined();
            expect(utils.getStatusOptions).toBeDefined();
        });

        it('should export constants from @/shared/constants', async () => {
            const constants = await import('@/shared/constants');
            expect(constants.STATE_PRIORITY).toBeDefined();
            expect(constants.isTerminalState).toBeDefined();
            expect(constants.getStatePriority).toBeDefined();
        });
    });

    describe('Deprecation Re-exports', () => {
        const deprecatedPaths = [
            'contexts/index.ts',
            'contexts/RoleContext.ts',
            'contexts/ToastContext.ts',
            'hooks/index.ts',
            'hooks/useArtifactFilter.ts',
            'utils/index.ts',
            'utils/artifactIcons.ts',
            'utils/artifactSorting.ts',
            'utils/statusOptions.ts',
            'constants/index.ts',
            'constants/stateOrdering.ts',
        ];

        it.each(deprecatedPaths)('should have deprecation re-export at %s', (file) => {
            const filePath = path.join(srcPath, file);
            expect(existsSync(filePath)).toBe(true);
        });
    });
});
