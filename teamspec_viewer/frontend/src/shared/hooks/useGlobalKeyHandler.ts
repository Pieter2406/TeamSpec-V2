/**
 * Global Key Handler Hook
 * 
 * Listens for a specific key press at the document level.
 * Ignores key presses in input/textarea/contenteditable elements.
 * 
 * Story: s-e011-005 (Shortcut discoverability and help)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { useEffect, useCallback } from 'react';

export interface UseGlobalKeyHandlerOptions {
    /** The key to listen for (e.g., '?', 'Escape') */
    key: string;
    /** Handler function called when key is pressed */
    handler: () => void;
    /** Whether the handler is currently enabled */
    enabled?: boolean;
}

/**
 * Check if the event target is an input-like element
 */
function isInputElement(element: EventTarget | null): boolean {
    if (!element || !(element instanceof HTMLElement)) {
        return false;
    }

    const tagName = element.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return true;
    }

    if (element.isContentEditable) {
        return true;
    }

    return false;
}

export function useGlobalKeyHandler({
    key,
    handler,
    enabled = true,
}: UseGlobalKeyHandlerOptions): void {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Don't trigger in input elements
        if (isInputElement(e.target)) {
            return;
        }

        // Check if the key matches
        if (e.key === key) {
            e.preventDefault();
            handler();
        }
    }, [key, handler]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, handleKeyDown]);
}
