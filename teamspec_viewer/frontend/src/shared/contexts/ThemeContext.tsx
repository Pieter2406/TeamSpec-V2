/**
 * Theme Context for light/dark mode switching
 * 
 * Provides theme mode state and toggle functionality with session persistence.
 * Detects system preference on initial load.
 * 
 * Story: s-e011-002 (Dark mode theme toggle)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme, ThemeMode } from '@/shared/styles';

// ============================================================================
// Types
// ============================================================================

interface ThemeContextValue {
    mode: ThemeMode;
    toggleMode: () => void;
    setMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// Storage Key
// ============================================================================

const THEME_STORAGE_KEY = 'teamspec-theme-mode';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Gets the initial theme mode from:
 * 1. Session storage (if previously set)
 * 2. System preference (prefers-color-scheme)
 * 3. Default to light
 */
function getInitialMode(): ThemeMode {
    // Check session storage first
    try {
        const stored = sessionStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
    } catch {
        // Session storage not available
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }

    return 'light';
}

// ============================================================================
// Provider Component
// ============================================================================

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

    // Persist mode to session storage and update document class
    useEffect(() => {
        try {
            sessionStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch {
            // Session storage not available
        }
        // Add/remove dark class for CSS targeting
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [mode]);

    const toggleMode = useCallback(() => {
        setModeState(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
    }, []);

    const value = useMemo<ThemeContextValue>(() => ({
        mode,
        toggleMode,
        setMode,
        isDark: mode === 'dark',
    }), [mode, toggleMode, setMode]);

    const theme = mode === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useThemeMode(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within a ThemeProvider');
    }
    return context;
}
