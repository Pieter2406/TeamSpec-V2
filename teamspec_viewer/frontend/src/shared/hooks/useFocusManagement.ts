/**
 * Focus Management Hook
 * 
 * Saves and restores focus for modal/drawer interactions.
 * 
 * Story: s-e011-004 (Keyboard navigation implementation)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { useCallback, useRef } from 'react';

export interface UseFocusManagementReturn {
    /** Save the currently focused element */
    saveFocus: () => void;
    /** Restore focus to the previously saved element */
    restoreFocus: () => void;
    /** Check if there's a saved focus target */
    hasSavedFocus: () => boolean;
}

export function useFocusManagement(): UseFocusManagementReturn {
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const saveFocus = useCallback(() => {
        previousFocusRef.current = document.activeElement as HTMLElement;
    }, []);

    const restoreFocus = useCallback(() => {
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
            // Use setTimeout to ensure focus happens after any transitions
            setTimeout(() => {
                previousFocusRef.current?.focus();
                previousFocusRef.current = null;
            }, 0);
        }
    }, []);

    const hasSavedFocus = useCallback(() => {
        return previousFocusRef.current !== null;
    }, []);

    return { saveFocus, restoreFocus, hasSavedFocus };
}
