---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e001-s002"
filename_pattern: "dp-e001-s002-role-selection.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e001-002"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - role selection
  - BA
  - FA
  - context
aliases:
  - role selector plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e001-s002-role-selection`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-15

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e001-s002 |
| **Story** | [s-e001-002](../stories/backlog/s-e001-002-role-selection.md) |
| **Epic** | epic-TSV-001 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-14 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e001-002](../stories/backlog/s-e001-002-role-selection.md) | Role Selection (BA/FA) | [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a **RoleContext** (React Context) that stores the currently selected role (`BA` | `FA` | null`). Components consume this context to:
1. Show the role selection UI when no role is selected.
2. Show the correct dashboard once a role is selected.
3. Display the current role in a header/badge.
4. Allow switching roles at any time.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `RoleContext` | New | React context + provider for role state |
| `RoleSelector` | New | UI component for selecting BA or FA |
| `RoleBadge` | New | Displays current role in header |
| `App.tsx` | Modified | Wraps app in RoleProvider; conditional render based on role |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/contexts/RoleContext.tsx` | Create | Context + provider + hook |
| `frontend/src/components/RoleSelector.tsx` | Create | Role selection buttons (BA / FA) |
| `frontend/src/components/RoleBadge.tsx` | Create | Shows selected role in header |
| `frontend/src/App.tsx` | Modify | Add RoleProvider, conditional dashboard render |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| React Context API | Existing | — |
| MUI Button / Chip | Existing | — |

### 2.3 API Changes

None — role selection is frontend-only state for MVP.

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [x] `RoleContext` defaults to no role selected
- [x] `setRole('BA')` updates context value
- [x] `setRole('FA')` updates context value

### 3.2 Integration Tests

- [x] Selecting BA shows BA dashboard placeholder
- [x] Selecting FA shows FA dashboard placeholder
- [x] Switching role updates displayed dashboard

### 3.3 Manual Testing

- [x] Open app; role selector is shown
- [x] Click BA; BA dashboard appears and RoleBadge shows "BA"
- [x] Click switch to FA; FA dashboard appears

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Context not wrapping full tree | Low | High | Wrap at App root |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Select BA role → BA dashboard shown | `RoleSelector` sets context; App renders `<BADashboard />` |
| 2 | Select FA role → FA dashboard shown | Same pattern for FA |
| 3 | Switch roles within session | `setRole` callable from anywhere via context |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [x] Code implemented
- [x] Unit tests written
- [x] Code reviewed
- [x] Tests passing

### Post-Implementation

- [x] Integration tests passing
- [x] Documentation updated
- [x] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-14 | AI-Generated | Initial plan |
| 2026-01-15 | AI-Generated | Implementation complete — RoleContext, RoleSelector, RoleBadge, Header components |

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.1 "Role Selection (MVP)"
- teamspec_viewer/projects/teamspecviewermvp/stories/backlog/s-e001-002-role-selection.md → Story ACs
