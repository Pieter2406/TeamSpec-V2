---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Dark mode theme toggle"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e011-002"
filename_pattern: "s-e011-002-dark-mode-toggle.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-011"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-010"
    optional: false

# === Search Optimization ===
keywords:
  - user story
  - dark mode
  - theme toggle
  - light dark theme
aliases:
  - night mode
  - theme switcher
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e011-002-dark-mode-toggle`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e011-002 |
| **Epic** | epic-TSV-011 |
| **Status** | Backlog |
| **Estimate** | 5 |
| **Author** | FA |
| **Sprint** | — |

---

## User Story

**As a** dashboard user,  
**I want** a toggle to switch between light and dark themes,  
**So that** I can reduce eye strain in low-light environments and work in my preferred visual mode.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-011](../epics/epic-TSV-011-role-dashboard-ux-polish.md) | Role Dashboard UX Polish | teamspec-viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-010](../feature-increments/fi-TSV-010-role-dashboard-ux-enhancements.md) | Role Dashboard UX Enhancements |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature

### AS-IS (current behavior)

**Reference:** f-TSV-002-role-specific-dashboards, Dashboard Content

Dashboards render in a fixed light theme. No theme switching capability exists.

### TO-BE (new behavior)

A theme toggle in the dashboard header allows switching between light and dark modes. Theme preference persists in session storage. Both themes maintain WCAG 2.1 AA contrast ratios. All dashboard surfaces (cards, lists, headers, indicators) update on toggle.

---

## Acceptance Criteria (AC)

### Scenario 1: Toggle visible and functional
- **Given** a user on any role dashboard
- **When** viewing the dashboard header
- **Then** a theme toggle (icon button) is visible and clicking it switches between light/dark modes

### Scenario 2: Dark mode applies to all surfaces
- **Given** a user activates dark mode
- **When** viewing the dashboard
- **Then** all surfaces (background, cards, text, icons, status badges) use dark theme colors

### Scenario 3: Theme persists in session
- **Given** a user selects dark mode
- **When** navigating to another dashboard or refreshing the page
- **Then** the dark mode preference is retained for the session

### Scenario 4: WCAG 2.1 AA contrast maintained
- **Given** light or dark theme is active
- **When** measuring text/background contrast
- **Then** all text meets WCAG 2.1 AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text)

### Scenario 5: System preference detection (optional)
- **Given** a user with system preference set to dark mode
- **When** loading the dashboard for the first time (no stored preference)
- **Then** the dashboard defaults to dark mode

---

## Technical Notes

- Use MUI ThemeProvider with createTheme for light/dark variants
- Store preference in sessionStorage under key `theme-mode`
- Define color tokens for both themes in a shared constants file
- Test contrast with browser dev tools or axe-core

---

## UX & Copy

- Toggle icon: Sun (☀️) for light mode active, Moon (🌙) for dark mode active
- Tooltip: "Switch to dark mode" / "Switch to light mode"

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e011-002)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules
