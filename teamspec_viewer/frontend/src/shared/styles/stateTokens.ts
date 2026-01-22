/**
 * State tokens for consistent visual indicators
 * 
 * Provides standardized styling for selection, hover, focus, loading, and error states
 * across all dashboard components.
 * 
 * Story: s-e011-003 (Visual indicator consistency)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { Theme } from '@mui/material';

// ============================================================================
// State Token Factory
// ============================================================================

export interface StateTokens {
    selected: Record<string, unknown>;
    hover: Record<string, unknown>;
    focusVisible: Record<string, unknown>;
    loading: Record<string, unknown>;
    error: Record<string, unknown>;
}

export const getStateTokens = (theme: Theme): StateTokens => ({
    // Selection state - primary color border with subtle background
    selected: {
        backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(25, 118, 210, 0.08)'
            : 'rgba(144, 202, 249, 0.16)',
        borderLeft: `3px solid ${theme.palette.primary.main}`,
    },

    // Hover state - subtle background change
    hover: {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer',
    },

    // Focus state for keyboard users - visible outline
    focusVisible: {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
    },

    // Loading state - pulse animation
    loading: {
        opacity: 0.7,
        '@keyframes pulse': {
            '0%, 100%': { opacity: 0.7 },
            '50%': { opacity: 0.4 },
        },
        animation: 'pulse 1.5s ease-in-out infinite',
    },

    // Error state - red indicator with background
    error: {
        backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(239, 68, 68, 0.08)'
            : 'rgba(248, 113, 113, 0.16)',
        borderLeft: `3px solid ${theme.palette.error.main}`,
    },
});

// ============================================================================
// Interactive Element Styles
// ============================================================================

/**
 * Returns sx props for interactive list items with consistent states
 */
export const getInteractiveSx = (
    theme: Theme,
    options: {
        isSelected?: boolean;
        isError?: boolean;
    } = {}
) => {
    const tokens = getStateTokens(theme);
    const { isSelected = false, isError = false } = options;

    return {
        transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        borderLeft: '3px solid transparent',
        '&:hover': tokens.hover,
        '&:focus-visible': tokens.focusVisible,
        ...(isSelected ? tokens.selected : {}),
        ...(isError ? tokens.error : {}),
    };
};

/**
 * Returns sx props for card components with selection state
 */
export const getCardSx = (
    theme: Theme,
    options: {
        isSelected?: boolean;
        isExpanded?: boolean;
    } = {}
) => {
    const { isSelected = false, isExpanded = false } = options;

    return {
        transition: 'all 0.2s ease',
        border: isExpanded
            ? `2px solid ${theme.palette.success.main}`
            : isSelected
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${theme.palette.divider}`,
        boxShadow: isSelected
            ? `0 4px 12px ${theme.palette.mode === 'light'
                ? 'rgba(59, 130, 246, 0.25)'
                : 'rgba(144, 202, 249, 0.25)'}`
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
        bgcolor: isExpanded
            ? theme.palette.mode === 'light'
                ? 'rgba(16, 185, 129, 0.04)'
                : 'rgba(52, 211, 153, 0.08)'
            : isSelected
                ? theme.palette.mode === 'light'
                    ? 'rgba(59, 130, 246, 0.04)'
                    : 'rgba(144, 202, 249, 0.08)'
                : theme.palette.background.paper,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderColor: theme.palette.success.main,
        },
        '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
        },
    };
};

// ============================================================================
// Theme-aware Status Colors
// ============================================================================

export interface ThemedStatusColor {
    bg: string;
    text: string;
}

export const getThemedStatusColors = (theme: Theme): Record<string, ThemedStatusColor> => {
    const isLight = theme.palette.mode === 'light';

    return {
        active: {
            bg: isLight ? '#dcfce7' : '#064e3b',
            text: isLight ? '#166534' : '#6ee7b7',
        },
        draft: {
            bg: isLight ? '#fef9c3' : '#713f12',
            text: isLight ? '#854d0e' : '#fde047',
        },
        planned: {
            bg: isLight ? '#e0e7ff' : '#312e81',
            text: isLight ? '#3730a3' : '#a5b4fc',
        },
        deprecated: {
            bg: isLight ? '#fee2e2' : '#7f1d1d',
            text: isLight ? '#991b1b' : '#fca5a5',
        },
        done: {
            bg: isLight ? '#d1fae5' : '#064e3b',
            text: isLight ? '#065f46' : '#6ee7b7',
        },
        'in progress': {
            bg: isLight ? '#dbeafe' : '#1e3a8a',
            text: isLight ? '#1e40af' : '#93c5fd',
        },
        approved: {
            bg: isLight ? '#dcfce7' : '#064e3b',
            text: isLight ? '#166534' : '#6ee7b7',
        },
        default: {
            bg: isLight ? '#f1f5f9' : '#334155',
            text: isLight ? '#475569' : '#94a3b8',
        },
    };
};

export const getThemedStatusColor = (theme: Theme, status?: string): ThemedStatusColor => {
    const colors = getThemedStatusColors(theme);
    const normalizedStatus = status?.toLowerCase() || 'default';
    return colors[normalizedStatus] || colors.default;
};
