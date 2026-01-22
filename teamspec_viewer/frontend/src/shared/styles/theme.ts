/**
 * Theme definitions for TeamSpec Viewer
 * 
 * Light and dark theme configurations with WCAG 2.1 AA compliant contrast ratios.
 * 
 * Story: s-e011-002 (Dark mode theme toggle)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';

// ============================================================================
// Color Tokens
// ============================================================================

const lightPalette = {
    primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#ffffff',
    },
    background: {
        default: '#f8fafc',
        paper: '#ffffff',
    },
    text: {
        primary: '#1e293b',      // Contrast: 12.6:1 on #f8fafc
        secondary: '#64748b',    // Contrast: 4.54:1 on #f8fafc
    },
    divider: '#e2e8f0',
    action: {
        hover: 'rgba(0, 0, 0, 0.04)',
        selected: 'rgba(25, 118, 210, 0.08)',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
    },
    warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
    },
    error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
    },
    info: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
    },
};

const darkPalette = {
    primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
        contrastText: '#000000',
    },
    secondary: {
        main: '#ce93d8',
        light: '#f3e5f5',
        dark: '#ab47bc',
        contrastText: '#000000',
    },
    background: {
        default: '#0f172a',
        paper: '#1e293b',
    },
    text: {
        primary: '#f1f5f9',      // Contrast: 15.8:1 on #0f172a
        secondary: '#94a3b8',    // Contrast: 7.1:1 on #0f172a
    },
    divider: '#334155',
    action: {
        hover: 'rgba(255, 255, 255, 0.08)',
        selected: 'rgba(144, 202, 249, 0.16)',
        disabled: 'rgba(255, 255, 255, 0.3)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    success: {
        main: '#34d399',
        light: '#6ee7b7',
        dark: '#10b981',
    },
    warning: {
        main: '#fbbf24',
        light: '#fcd34d',
        dark: '#f59e0b',
    },
    error: {
        main: '#f87171',
        light: '#fca5a5',
        dark: '#ef4444',
    },
    info: {
        main: '#60a5fa',
        light: '#93c5fd',
        dark: '#3b82f6',
    },
};

// ============================================================================
// Shared Theme Options
// ============================================================================

const sharedOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
};

// ============================================================================
// Theme Creation
// ============================================================================

export const lightTheme = createTheme({
    ...sharedOptions,
    palette: {
        mode: 'light',
        ...lightPalette,
    },
});

export const darkTheme = createTheme({
    ...sharedOptions,
    palette: {
        mode: 'dark',
        ...darkPalette,
    },
});

export type ThemeMode = 'light' | 'dark';
