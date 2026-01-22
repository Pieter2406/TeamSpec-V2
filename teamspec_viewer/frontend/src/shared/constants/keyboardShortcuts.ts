/**
 * Keyboard shortcuts configuration
 * 
 * Central definition of all keyboard shortcuts for discoverability.
 * 
 * Story: s-e011-005 (Shortcut discoverability and help)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

export interface Shortcut {
    keys: string[];
    description: string;
    category: 'navigation' | 'actions' | 'help';
}

export const KEYBOARD_SHORTCUTS: Shortcut[] = [
    // Navigation
    { keys: ['↑', '↓'], description: 'Navigate between items', category: 'navigation' },
    { keys: ['Tab'], description: 'Move to next element', category: 'navigation' },
    { keys: ['Shift', '+', 'Tab'], description: 'Move to previous element', category: 'navigation' },
    { keys: ['Home'], description: 'Go to first item', category: 'navigation' },
    { keys: ['End'], description: 'Go to last item', category: 'navigation' },

    // Actions
    { keys: ['Enter'], description: 'Open or expand selected item', category: 'actions' },
    { keys: ['Space'], description: 'Toggle selection', category: 'actions' },
    { keys: ['Esc'], description: 'Close drawer or modal', category: 'actions' },

    // Help
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'help' },
];

export const SHORTCUT_CATEGORIES = {
    navigation: 'Navigation',
    actions: 'Actions',
    help: 'Help',
} as const;

/**
 * Get shortcuts grouped by category
 */
export function getShortcutsByCategory(): Record<string, Shortcut[]> {
    const grouped: Record<string, Shortcut[]> = {
        navigation: [],
        actions: [],
        help: [],
    };

    for (const shortcut of KEYBOARD_SHORTCUTS) {
        grouped[shortcut.category].push(shortcut);
    }

    return grouped;
}
