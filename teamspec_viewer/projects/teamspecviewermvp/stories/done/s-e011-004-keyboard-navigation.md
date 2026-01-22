---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Keyboard navigation implementation"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e011-004"
filename_pattern: "s-e011-004-keyboard-navigation.md"

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
  - keyboard navigation
  - arrow keys
  - tab navigation
  - accessibility
aliases:
  - keyboard support
  - a11y navigation
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e011-004-keyboard-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e011-004 |
| **Epic** | epic-TSV-011 |
| **Status** | Done |
| **Estimate** | 5 |
| **Author** | FA |
| **Sprint** | — |

---

## User Story

**As a** keyboard-only user,  
**I want** to navigate dashboards using arrow keys, Tab/Shift+Tab, and Enter/Space,  
**So that** I can access all dashboard functionality without a mouse.

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

**Reference:** f-TSV-002-role-specific-dashboards, User Flows

Basic Tab navigation works for focusable elements. Arrow key navigation within lists/trees is not consistently implemented. Some interactive elements may be skipped in tab order.

### TO-BE (new behavior)

Keyboard navigation is first-class:
- **Arrow keys** (↑↓) move between dashboard items (cards, tree nodes)
- **Tab/Shift+Tab** follow logical reading order through all interactive elements
- **Enter/Space** activates the focused item (opens reader, expands tree)
- Focus is never lost after activation; it moves to a logical next element
- Navigation remains read-only (no edit shortcuts)

---

## Acceptance Criteria (AC)

### Scenario 1: Arrow key navigation in lists
- **Given** a user focuses a card/list in any dashboard
- **When** pressing ↑ or ↓ arrow keys
- **Then** focus moves to the previous/next item in the list

### Scenario 2: Tab order follows logical flow
- **Given** a user starts at the top of a dashboard
- **When** pressing Tab repeatedly
- **Then** focus moves through: header → sidebar → main content → cards/tree → reader (if open)

### Scenario 3: Enter/Space activates focused item
- **Given** a user focuses an artifact card or tree node
- **When** pressing Enter or Space
- **Then** the item is activated (reader opens or tree expands) without opening edit mode

### Scenario 4: Focus maintained after activation
- **Given** a user activates an item with keyboard
- **When** the reader opens or tree expands
- **Then** focus moves to a logical target (first item in reader, or expanded content)

### Scenario 5: Escape closes modals/drawers
- **Given** a reader drawer or modal is open
- **When** pressing Escape
- **Then** the drawer/modal closes and focus returns to the triggering element

### Scenario 6: No keyboard traps
- **Given** a user navigating with keyboard only
- **When** moving through any dashboard section
- **Then** the user can always Tab out of the section (no focus traps)

---

## Technical Notes

- Use `onKeyDown` handlers with arrow key detection
- Use `tabIndex` appropriately (0 for focusable, -1 for programmatic focus)
- Implement roving tabindex pattern for card lists
- Use MUI TreeView's built-in keyboard support for trees

---

## UX & Copy

- No copy changes required
- Focus indicator must be visible (see s-e011-003)

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e011-004)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules
