/**
 * Visual Indicator Consistency Tests
 *
 * TDD tests for s-e011-003 - Visual indicator consistency
 * Tests that state tokens provide consistent styling across themes.
 */
import { describe, it, expect } from 'vitest';
import { createTheme } from '@mui/material/styles';
import {
    getStateTokens,
    getInteractiveSx,
    getCardSx,
    getThemedStatusColors,
    getThemedStatusColor,
} from '../src/shared/styles/stateTokens';

// Create test themes
const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

describe('s-e011-003: Visual Indicator Consistency', () => {
    describe('getStateTokens', () => {
        it('should return correct tokens for light theme', () => {
            const tokens = getStateTokens(lightTheme);

            expect(tokens).toHaveProperty('selected');
            expect(tokens).toHaveProperty('hover');
            expect(tokens).toHaveProperty('focusVisible');
            expect(tokens).toHaveProperty('loading');
            expect(tokens).toHaveProperty('error');
        });

        it('should return correct tokens for dark theme', () => {
            const tokens = getStateTokens(darkTheme);

            expect(tokens).toHaveProperty('selected');
            expect(tokens).toHaveProperty('hover');
            expect(tokens).toHaveProperty('focusVisible');
            expect(tokens).toHaveProperty('loading');
            expect(tokens).toHaveProperty('error');
        });

        it('should have different background colors for light vs dark theme', () => {
            const lightTokens = getStateTokens(lightTheme);
            const darkTokens = getStateTokens(darkTheme);

            expect(lightTokens.selected.backgroundColor).not.toEqual(
                darkTokens.selected.backgroundColor
            );
            expect(lightTokens.error.backgroundColor).not.toEqual(
                darkTokens.error.backgroundColor
            );
        });

        it('selection state should have borderLeft', () => {
            const tokens = getStateTokens(lightTheme);
            expect(tokens.selected.borderLeft).toContain('3px solid');
        });

        it('focus state should have outline for keyboard users', () => {
            const tokens = getStateTokens(lightTheme);
            expect(tokens.focusVisible.outline).toContain('2px solid');
            expect(tokens.focusVisible.outlineOffset).toBe('2px');
        });

        it('hover state should have cursor pointer', () => {
            const tokens = getStateTokens(lightTheme);
            expect(tokens.hover.cursor).toBe('pointer');
        });
    });

    describe('getInteractiveSx', () => {
        it('should return base styles without selection', () => {
            const sx = getInteractiveSx(lightTheme);

            expect(sx).toHaveProperty('transition');
            expect(sx).toHaveProperty('&:hover');
            expect(sx).toHaveProperty('&:focus-visible');
        });

        it('should apply selection styles when isSelected=true', () => {
            const sx = getInteractiveSx(lightTheme, { isSelected: true });

            // Should have selection background from tokens
            expect(sx).toHaveProperty('backgroundColor');
            expect(sx).toHaveProperty('borderLeft');
        });

        it('should apply error styles when isError=true', () => {
            const sx = getInteractiveSx(lightTheme, { isError: true });

            expect(sx).toHaveProperty('backgroundColor');
            expect(sx).toHaveProperty('borderLeft');
        });

        it('should work for both light and dark themes', () => {
            const lightSx = getInteractiveSx(lightTheme, { isSelected: true });
            const darkSx = getInteractiveSx(darkTheme, { isSelected: true });

            // Both should have selection styles
            expect(lightSx).toHaveProperty('backgroundColor');
            expect(darkSx).toHaveProperty('backgroundColor');

            // But colors should be different (theme-aware)
            expect(lightSx.backgroundColor).not.toEqual(darkSx.backgroundColor);
        });
    });

    describe('getCardSx', () => {
        it('should return base card styles', () => {
            const sx = getCardSx(lightTheme);

            expect(sx).toHaveProperty('transition');
            expect(sx).toHaveProperty('border');
            expect(sx).toHaveProperty('boxShadow');
            expect(sx).toHaveProperty('bgcolor');
            expect(sx).toHaveProperty('&:hover');
            expect(sx).toHaveProperty('&:focus-visible');
        });

        it('should apply selection styles when isSelected=true', () => {
            const baseSx = getCardSx(lightTheme);
            const selectedSx = getCardSx(lightTheme, { isSelected: true });

            // Selected should have different border/shadow
            expect(selectedSx.boxShadow).not.toEqual(baseSx.boxShadow);
        });

        it('should apply expanded styles when isExpanded=true', () => {
            const baseSx = getCardSx(lightTheme);
            const expandedSx = getCardSx(lightTheme, { isExpanded: true });

            // Expanded should have different bgcolor
            expect(expandedSx.bgcolor).not.toEqual(baseSx.bgcolor);
        });

        it('should have focus-visible outline for keyboard navigation', () => {
            const sx = getCardSx(lightTheme);

            expect(sx['&:focus-visible']).toHaveProperty('outline');
            expect(sx['&:focus-visible'].outline).toContain('2px solid');
        });

        it('should work for both themes', () => {
            const lightSx = getCardSx(lightTheme, { isSelected: true });
            const darkSx = getCardSx(darkTheme, { isSelected: true });

            // Both should have selection styles
            expect(lightSx.boxShadow).toBeDefined();
            expect(darkSx.boxShadow).toBeDefined();
        });
    });

    describe('getThemedStatusColors', () => {
        it('should return all status colors for light theme', () => {
            const colors = getThemedStatusColors(lightTheme);

            expect(colors).toHaveProperty('active');
            expect(colors).toHaveProperty('draft');
            expect(colors).toHaveProperty('planned');
            expect(colors).toHaveProperty('deprecated');
            expect(colors).toHaveProperty('done');
            expect(colors).toHaveProperty('in progress');
            expect(colors).toHaveProperty('approved');
            expect(colors).toHaveProperty('default');
        });

        it('should return all status colors for dark theme', () => {
            const colors = getThemedStatusColors(darkTheme);

            expect(colors).toHaveProperty('active');
            expect(colors).toHaveProperty('draft');
            expect(colors).toHaveProperty('default');
        });

        it('should have different colors for light vs dark theme', () => {
            const lightColors = getThemedStatusColors(lightTheme);
            const darkColors = getThemedStatusColors(darkTheme);

            expect(lightColors.active.bg).not.toEqual(darkColors.active.bg);
            expect(lightColors.active.text).not.toEqual(darkColors.active.text);
        });

        it('each status should have bg and text properties', () => {
            const colors = getThemedStatusColors(lightTheme);

            Object.values(colors).forEach((color) => {
                expect(color).toHaveProperty('bg');
                expect(color).toHaveProperty('text');
            });
        });
    });

    describe('getThemedStatusColor', () => {
        it('should return correct color for known status', () => {
            const active = getThemedStatusColor(lightTheme, 'Active');

            expect(active).toHaveProperty('bg');
            expect(active).toHaveProperty('text');
        });

        it('should be case-insensitive', () => {
            const lower = getThemedStatusColor(lightTheme, 'active');
            const upper = getThemedStatusColor(lightTheme, 'ACTIVE');
            const mixed = getThemedStatusColor(lightTheme, 'Active');

            expect(lower.bg).toEqual(upper.bg);
            expect(lower.bg).toEqual(mixed.bg);
        });

        it('should return default color for unknown status', () => {
            const unknown = getThemedStatusColor(lightTheme, 'unknown-status');
            const defaultColor = getThemedStatusColor(lightTheme, undefined);

            expect(unknown.bg).toEqual(defaultColor.bg);
        });

        it('should return default when status is undefined', () => {
            const color = getThemedStatusColor(lightTheme, undefined);

            expect(color).toHaveProperty('bg');
            expect(color).toHaveProperty('text');
        });
    });

    describe('Consistency across dashboards (AC mapping)', () => {
        // AC-1: Selection state consistency
        it('AC-1: selection state is consistent via getCardSx', () => {
            const sx = getCardSx(lightTheme, { isSelected: true });

            // Same function used across all dashboards = same styling
            expect(sx.bgcolor).toContain('rgba');
            expect(sx.border).toBeDefined();
        });

        // AC-2: Hover state consistency
        it('AC-2: hover state is consistent via state tokens', () => {
            const tokens = getStateTokens(lightTheme);

            expect(tokens.hover).toHaveProperty('backgroundColor');
            expect(tokens.hover).toHaveProperty('cursor');
        });

        // AC-3: Focus state visibility
        it('AC-3: focus state has visible 2px outline', () => {
            const tokens = getStateTokens(lightTheme);

            expect(tokens.focusVisible.outline).toContain('2px solid');
            expect(tokens.focusVisible.outlineOffset).toBe('2px');
        });

        // AC-5: States work in both themes
        it('AC-5: all state tokens work in dark theme', () => {
            const tokens = getStateTokens(darkTheme);

            expect(tokens.selected.backgroundColor).toBeDefined();
            expect(tokens.hover.backgroundColor).toBeDefined();
            expect(tokens.focusVisible.outline).toBeDefined();
            expect(tokens.error.backgroundColor).toBeDefined();
        });
    });
});
