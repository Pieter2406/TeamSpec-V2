---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Shortcut discoverability and help"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e011-005"
filename_pattern: "s-e011-005-shortcut-discoverability.md"

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
  - keyboard shortcuts
  - help modal
  - discoverability
aliases:
  - shortcut help
  - keyboard hints
anti_keywords:
  - full behavior
  - production truth
---

# Story: `s-e011-005-shortcut-discoverability`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e011-005 |
| **Epic** | epic-TSV-011 |
| **Status** | Backlog |
| **Estimate** | 2 |
| **Author** | FA |
| **Sprint** | — |

---

## User Story

**As a** dashboard user,  
**I want** to discover available keyboard shortcuts through visible cues and a help modal,  
**So that** I can learn efficient navigation methods and use the dashboard productively.

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

No keyboard shortcut documentation or discoverability hints exist. Users must discover navigation through trial and error.

### TO-BE (new behavior)

- An inline hint appears in the dashboard footer or header: "Press ? for keyboard shortcuts"
- Pressing `?` opens a help modal listing all available shortcuts
- Visible focus outlines always indicate current keyboard position
- Tooltips on interactive elements mention keyboard alternatives where applicable

---

## Acceptance Criteria (AC)

### Scenario 1: Inline hint visible
- **Given** a user views any role dashboard
- **When** the dashboard loads
- **Then** a subtle hint "Press ? for shortcuts" is visible (footer or header area)

### Scenario 2: Help modal opens with ?
- **Given** a user is on any dashboard
- **When** pressing the `?` key
- **Then** a modal opens displaying all available keyboard shortcuts

### Scenario 3: Help modal content
- **Given** the help modal is open
- **When** viewing its content
- **Then** shortcuts are listed with key + description: ↑↓ Navigate items, Enter Open/expand, Esc Close, Tab Next element, ? Help

### Scenario 4: Modal closes with Escape or click
- **Given** the help modal is open
- **When** pressing Escape or clicking outside
- **Then** the modal closes and focus returns to previous element

### Scenario 5: Focus indicator always visible
- **Given** a keyboard user navigating
- **When** any element has focus
- **Then** a visible focus outline (2px) is displayed

---

## Technical Notes

- Use MUI Dialog for help modal
- Add global keydown listener for `?` key (check not in input field)
- Help modal content can be a simple list or grid of shortcuts
- Consider using `aria-label` or tooltips that mention keyboard shortcuts

---

## UX & Copy

**Hint text:** "Press ? for keyboard shortcuts"

**Help modal content:**
| Shortcut | Action |
|----------|--------|
| ↑ / ↓ | Navigate between items |
| Enter | Open or expand selected item |
| Space | Toggle selection |
| Esc | Close drawer/modal |
| Tab | Move to next element |
| Shift+Tab | Move to previous element |
| ? | Show this help |

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e011-005)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules
