/**
 * Theme Toggle Button Component
 * 
 * Icon button that switches between light and dark modes.
 * Shows sun icon in light mode, moon icon in dark mode.
 * 
 * Story: s-e011-002 (Dark mode theme toggle)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '@/shared/contexts/ThemeContext';

interface ThemeToggleProps {
    size?: 'small' | 'medium' | 'large';
    /** Use light colors for dark backgrounds (like headers) */
    invertColors?: boolean;
}

export function ThemeToggle({ size = 'medium', invertColors = true }: ThemeToggleProps) {
    const { mode, toggleMode } = useThemeMode();
    const isDark = mode === 'dark';

    const tooltipText = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <Tooltip title={tooltipText}>
            <IconButton
                onClick={toggleMode}
                size={size}
                aria-label={tooltipText}
                data-testid="theme-toggle"
                sx={invertColors ? {
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                    },
                } : {
                    color: 'text.secondary',
                    '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'action.hover',
                    },
                }}
            >
                {isDark ? (
                    <LightModeIcon fontSize={size} />
                ) : (
                    <DarkModeIcon fontSize={size} />
                )}
            </IconButton>
        </Tooltip>
    );
}
