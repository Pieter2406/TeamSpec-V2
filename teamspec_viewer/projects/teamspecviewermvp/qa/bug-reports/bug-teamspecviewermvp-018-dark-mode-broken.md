---
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Dark mode toggle not working"
---

# Bug Report: `bug-teamspecviewermvp-018-dark-mode-broken`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | bug-teamspecviewermvp-018 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Dev |
| **Version** | Post s-e011-002 implementation |
| **Reporter** | QA |
| **Date Reported** | 2026-01-18 |
| **Status** | Open |

---

## Description

The dark mode toggle button in the header does not function. Clicking it does not switch the theme from light to dark mode.

---

## Steps to Reproduce

1. Open the TeamSpec Viewer application
2. Select any role to enter the dashboard
3. Locate the theme toggle button in the header (moon icon)
4. Click the toggle button
5. Observe the dashboard appearance

---

## Expected Result

**Feature-Increment Reference:** fi-TSV-010, AC-2 (Dark mode theme toggle)

Clicking the toggle should:
1. Switch the entire UI from light to dark theme
2. Change the icon from moon to sun
3. Persist the preference in session storage

---

## Actual Result

Clicking the dark mode toggle button has no visible effect. The theme remains in light mode.

---

## Evidence

- [x] Screenshot attached (user provided - showing light theme persists)

---

## Bug Classification (MANDATORY)

- [x] **Implementation Defect** — Code doesn't match the Feature-Increment specification
- [ ] **Feature Canon Wrong** — Canon doesn't match business intent
- [ ] **Undocumented Behavior** — Neither Canon nor FI covers this case

### Justification

The ThemeContext and ThemeToggle components were implemented, but the toggle is not functioning as expected.

---

## Technical Analysis

Possible causes:
1. ThemeContext not properly wrapping the app
2. ThemeProvider from shared/contexts conflicting with MUI ThemeProvider
3. State update in toggleMode not triggering re-render
4. Theme not being applied to components (using hardcoded colors)

Debug steps:
1. Check browser console for errors
2. Verify sessionStorage is being updated on click
3. Check if theme.palette.mode changes in React DevTools
4. Verify components are using theme tokens vs hardcoded colors

---

## Resolution

| Field | Value |
| :--- | :--- |
| **Assigned To** | DEV |
| **Fix Version** | — |
| **Resolution Date** | — |
| **Root Cause** | — |
