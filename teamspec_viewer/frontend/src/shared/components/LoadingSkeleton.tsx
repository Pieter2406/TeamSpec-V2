/**
 * LoadingSkeleton Component
 *
 * Consistent loading state component using MUI Skeleton.
 * Provides standardized loading indicators for cards, lists, and trees.
 *
 * Story: s-e011-003 (Visual indicator consistency)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { Box, Skeleton, SxProps, Theme } from '@mui/material';

// ============================================================================
// Types
// ============================================================================

export interface LoadingSkeletonProps {
    /** Type of skeleton layout */
    variant?: 'card' | 'list' | 'tree' | 'text';
    /** Number of items to show */
    count?: number;
    /** Custom sx props */
    sx?: SxProps<Theme>;
}

// ============================================================================
// Component
// ============================================================================

export function LoadingSkeleton({
    variant = 'card',
    count = 3,
    sx,
}: LoadingSkeletonProps) {
    const renderCardSkeleton = () => (
        <Box sx={{ mb: 1 }}>
            <Skeleton
                variant="rounded"
                height={80}
                sx={{
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                }}
            />
        </Box>
    );

    const renderListSkeleton = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}>
            <Skeleton
                variant="circular"
                width={32}
                height={32}
                sx={{ bgcolor: 'action.hover', flexShrink: 0 }}
            />
            <Box sx={{ flex: 1 }}>
                <Skeleton
                    variant="text"
                    width="70%"
                    height={24}
                    sx={{ bgcolor: 'action.hover' }}
                />
                <Skeleton
                    variant="text"
                    width="40%"
                    height={18}
                    sx={{ bgcolor: 'action.hover' }}
                />
            </Box>
            <Skeleton
                variant="rounded"
                width={60}
                height={24}
                sx={{ borderRadius: 1, bgcolor: 'action.hover' }}
            />
        </Box>
    );

    const renderTreeSkeleton = () => (
        <Box sx={{ py: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    sx={{ bgcolor: 'action.hover' }}
                />
                <Skeleton
                    variant="text"
                    width={`${60 + Math.random() * 30}%`}
                    height={24}
                    sx={{ bgcolor: 'action.hover' }}
                />
            </Box>
            {/* Nested children with indent */}
            <Box sx={{ ml: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                    <Skeleton
                        variant="circular"
                        width={16}
                        height={16}
                        sx={{ bgcolor: 'action.hover' }}
                    />
                    <Skeleton
                        variant="text"
                        width={`${40 + Math.random() * 40}%`}
                        height={20}
                        sx={{ bgcolor: 'action.hover' }}
                    />
                </Box>
            </Box>
        </Box>
    );

    const renderTextSkeleton = () => (
        <Box sx={{ py: 0.5 }}>
            <Skeleton
                variant="text"
                width="100%"
                height={20}
                sx={{ bgcolor: 'action.hover' }}
            />
        </Box>
    );

    const renderSkeleton = () => {
        switch (variant) {
            case 'card':
                return renderCardSkeleton();
            case 'list':
                return renderListSkeleton();
            case 'tree':
                return renderTreeSkeleton();
            case 'text':
                return renderTextSkeleton();
            default:
                return renderCardSkeleton();
        }
    };

    return (
        <Box sx={{ ...sx }}>
            {Array.from({ length: count }).map((_, index) => (
                <Box key={index}>{renderSkeleton()}</Box>
            ))}
        </Box>
    );
}
