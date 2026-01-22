/**
 * Roving Tabindex Hook
 * 
 * Implements the roving tabindex pattern for keyboard navigation within lists.
 * Arrow keys move focus between items, only one item is tabbable at a time.
 * 
 * Story: s-e011-004 (Keyboard navigation implementation)
 * Feature-Increment: fi-TSV-010 (Role Dashboard UX Enhancements)
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseRovingTabindexOptions {
    /** Total number of items in the list */
    itemCount: number;
    /** Callback when Enter/Space is pressed on focused item */
    onSelect?: (index: number) => void;
    /** Initial focused index */
    initialIndex?: number;
    /** Orientation: vertical (up/down) or horizontal (left/right) */
    orientation?: 'vertical' | 'horizontal';
    /** Whether navigation should wrap around */
    wrap?: boolean;
}

export interface UseRovingTabindexReturn {
    /** Currently focused item index */
    focusedIndex: number;
    /** Set focused index programmatically */
    setFocusedIndex: (index: number) => void;
    /** Keyboard event handler for the container */
    handleKeyDown: (e: React.KeyboardEvent) => void;
    /** Get tabIndex for an item (-1 or 0) */
    getTabIndex: (index: number) => number;
    /** Get props to spread on each item */
    getItemProps: (index: number) => {
        tabIndex: number;
        'data-index': number;
        ref: (el: HTMLElement | null) => void;
    };
    /** Ref for the container element */
    containerRef: React.RefObject<HTMLDivElement>;
}

export function useRovingTabindex({
    itemCount,
    onSelect: _onSelect, // Kept for API compatibility, but not used - MUI buttons handle Enter/Space via onClick
    initialIndex = 0,
    orientation = 'vertical',
    wrap = false,
}: UseRovingTabindexOptions): UseRovingTabindexReturn {
    const [focusedIndex, setFocusedIndex] = useState(initialIndex);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

    // Clamp index to valid range
    const clampIndex = useCallback((index: number): number => {
        if (itemCount === 0) return 0;
        if (wrap) {
            return ((index % itemCount) + itemCount) % itemCount;
        }
        return Math.max(0, Math.min(index, itemCount - 1));
    }, [itemCount, wrap]);

    // Focus the element at the given index
    const focusItem = useCallback((index: number) => {
        const element = itemRefs.current.get(index);
        if (element) {
            element.focus();
        }
    }, []);

    // Update focused index and focus the element
    const moveFocus = useCallback((newIndex: number) => {
        const clampedIndex = clampIndex(newIndex);
        setFocusedIndex(clampedIndex);
        focusItem(clampedIndex);
    }, [clampIndex, focusItem]);

    // Keyboard handler - only handles navigation, not activation
    // Enter/Space activation should be handled by the element's native onClick
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

        switch (e.key) {
            case nextKey:
                e.preventDefault();
                moveFocus(focusedIndex + 1);
                break;

            case prevKey:
                e.preventDefault();
                moveFocus(focusedIndex - 1);
                break;

            case 'Home':
                e.preventDefault();
                moveFocus(0);
                break;

            case 'End':
                e.preventDefault();
                moveFocus(itemCount - 1);
                break;

            // Note: Enter/Space are NOT handled here intentionally
            // MUI buttons and native buttons handle these via onClick
        }
    }, [focusedIndex, itemCount, orientation, moveFocus]);

    // Get tabIndex for an item
    const getTabIndex = useCallback((index: number): number => {
        return index === focusedIndex ? 0 : -1;
    }, [focusedIndex]);

    // Get props for each item
    const getItemProps = useCallback((index: number) => ({
        tabIndex: getTabIndex(index),
        'data-index': index,
        ref: (el: HTMLElement | null) => {
            if (el) {
                itemRefs.current.set(index, el);
            } else {
                itemRefs.current.delete(index);
            }
        },
    }), [getTabIndex]);

    // Reset focused index when item count changes
    useEffect(() => {
        if (focusedIndex >= itemCount && itemCount > 0) {
            setFocusedIndex(itemCount - 1);
        }
    }, [itemCount, focusedIndex]);

    return {
        focusedIndex,
        setFocusedIndex,
        handleKeyDown,
        getTabIndex,
        getItemProps,
        containerRef,
    };
}
