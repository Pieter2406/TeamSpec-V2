/**
 * Shortcut Hint Component
 * 
 * Displays a subtle hint about keyboard shortcuts in the dashboard footer.
 * 
 * Story: s-e011-005 (Shortcut discoverability and help)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { Typography, Box } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface ShortcutHintProps {
    onClick?: () => void;
}

export function ShortcutHint({ onClick }: ShortcutHintProps) {
    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                    bgcolor: 'action.selected',
                    borderColor: 'primary.main',
                },
                '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                },
            }}
        >
            <KeyboardIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
                Press <strong>?</strong> for shortcuts
            </Typography>
        </Box>
    );
}
