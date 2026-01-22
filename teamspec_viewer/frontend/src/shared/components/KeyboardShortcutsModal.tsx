/**
 * Keyboard Shortcuts Modal
 * 
 * Displays all available keyboard shortcuts grouped by category.
 * Triggered by pressing '?' key.
 * 
 * Story: s-e011-005 (Shortcut discoverability and help)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Divider,
    Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { getShortcutsByCategory, SHORTCUT_CATEGORIES, Shortcut } from '@/shared/constants';

interface KeyboardShortcutsModalProps {
    open: boolean;
    onClose: () => void;
}

function ShortcutKey({ children }: { children: string }) {
    return (
        <Chip
            label={children}
            size="small"
            sx={{
                fontFamily: 'monospace',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
                minWidth: 24,
                bgcolor: 'action.selected',
                color: 'text.primary',
                borderRadius: 1,
            }}
        />
    );
}

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1,
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {shortcut.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {shortcut.keys.map((key, idx) => (
                    <ShortcutKey key={idx}>{key}</ShortcutKey>
                ))}
            </Box>
        </Box>
    );
}

function ShortcutCategory({ title, shortcuts }: { title: string; shortcuts: Shortcut[] }) {
    if (shortcuts.length === 0) return null;

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="overline"
                sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    letterSpacing: 1,
                }}
            >
                {title}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {shortcuts.map((shortcut, idx) => (
                <ShortcutRow key={idx} shortcut={shortcut} />
            ))}
        </Box>
    );
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
    const shortcutsByCategory = getShortcutsByCategory();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            aria-labelledby="keyboard-shortcuts-title"
        >
            <DialogTitle
                id="keyboard-shortcuts-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pr: 6,
                }}
            >
                <KeyboardIcon color="primary" />
                <Typography variant="h6" component="span" fontWeight={700}>
                    Keyboard Shortcuts
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'text.secondary',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <ShortcutCategory
                    title={SHORTCUT_CATEGORIES.navigation}
                    shortcuts={shortcutsByCategory.navigation}
                />
                <ShortcutCategory
                    title={SHORTCUT_CATEGORIES.actions}
                    shortcuts={shortcutsByCategory.actions}
                />
                <ShortcutCategory
                    title={SHORTCUT_CATEGORIES.help}
                    shortcuts={shortcutsByCategory.help}
                />
            </DialogContent>
        </Dialog>
    );
}
