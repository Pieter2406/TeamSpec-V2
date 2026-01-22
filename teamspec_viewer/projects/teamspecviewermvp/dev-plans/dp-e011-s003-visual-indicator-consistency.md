---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Visual indicator consistency implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e011-s003"
filename_pattern: "dp-e011-s003-visual-indicator-consistency.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e011-003"
    optional: false
---

# Dev Plan: `dp-e011-s003-visual-indicator-consistency`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e011-s003 |
| **Story** | [s-e011-003](../stories/backlog/s-e011-003-visual-indicator-consistency.md) |
| **Epic** | epic-TSV-011 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e011-003](../stories/backlog/s-e011-003-visual-indicator-consistency.md) | Visual indicator consistency | [fi-TSV-010](../feature-increments/fi-TSV-010-role-dashboard-ux-enhancements.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Define a shared set of state tokens (selection, hover, focus, loading, error) in theme extensions. Create reusable sx prop factories for each state. Audit all interactive components and replace ad-hoc styling with standardized tokens.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `stateTokens.ts` | New | Shared state styling tokens |
| `ArtifactCard.tsx` | Modified | Apply standardized states |
| `TreeNode (all trees)` | Modified | Apply standardized states |
| `LoadingSkeleton.tsx` | New | Consistent loading component |
| All dashboard components | Modified | Use shared state tokens |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/styles/stateTokens.ts` | Create | State styling definitions |
| `frontend/src/components/common/LoadingSkeleton.tsx` | Create | Consistent skeleton loader |
| `frontend/src/components/common/ArtifactCard.tsx` | Modify | Apply state tokens |
| `frontend/src/components/trees/BATree.tsx` | Modify | Apply state tokens to NodeLabel |
| `frontend/src/components/trees/FATree.tsx` | Modify | Apply state tokens to NodeLabel |
| `frontend/src/components/trees/DEVTree.tsx` | Modify | Apply state tokens to NodeLabel |
| `frontend/src/components/trees/SATree.tsx` | Modify | Apply state tokens to NodeLabel |
| `frontend/src/components/trees/QATree.tsx` | Modify | Apply state tokens to NodeLabel |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| MUI Skeleton | Existing | Approved |
| MUI useTheme hook | Existing | Approved |

### 2.3 State Token Definitions

```typescript
// stateTokens.ts
import { Theme } from '@mui/material';

export const getStateTokens = (theme: Theme) => ({
  // Selection state
  selected: {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(25, 118, 210, 0.08)' 
      : 'rgba(144, 202, 249, 0.16)',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
  
  // Hover state
  hover: {
    backgroundColor: theme.palette.action.hover, // 0.04 opacity
    cursor: 'pointer',
  },
  
  // Focus state (keyboard)
  focusVisible: {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  
  // Loading state
  loading: {
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  
  // Error state
  error: {
    backgroundColor: theme.palette.mode === 'light'
      ? 'rgba(211, 47, 47, 0.08)'
      : 'rgba(244, 67, 54, 0.16)',
    borderLeft: `3px solid ${theme.palette.error.main}`,
  },
});

// Reusable sx factory for interactive items
export const getInteractiveSx = (theme: Theme, isSelected: boolean) => ({
  transition: 'background-color 0.15s ease',
  '&:hover': getStateTokens(theme).hover,
  '&:focus-visible': getStateTokens(theme).focusVisible,
  ...(isSelected && getStateTokens(theme).selected),
});
```

### 2.4 Component Audit

| Component | Current State Handling | Action Needed |
|-----------|----------------------|---------------|
| ArtifactCard | Mixed inline styles | Replace with tokens |
| BATree NodeLabel | backgroundColor inline | Use getInteractiveSx |
| FATree NodeLabel | backgroundColor inline | Use getInteractiveSx |
| DEVTree NodeLabel | backgroundColor inline | Use getInteractiveSx |
| SATree NodeLabel | backgroundColor inline | Use getInteractiveSx |
| QATree NodeLabel | backgroundColor inline | Use getInteractiveSx |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] getStateTokens returns correct values for light theme
- [ ] getStateTokens returns correct values for dark theme
- [ ] getInteractiveSx applies selection when isSelected=true
- [ ] LoadingSkeleton renders with correct animation

### 3.2 Integration Tests

- [ ] Selection styling consistent across all dashboards
- [ ] Hover styling consistent across all dashboards
- [ ] Focus outline visible on keyboard navigation
- [ ] States work in both light and dark themes

### 3.3 Visual Testing

| Dashboard | Selection | Hover | Focus | Loading |
|-----------|-----------|-------|-------|---------|
| BA | [ ] | [ ] | [ ] | [ ] |
| FA | [ ] | [ ] | [ ] | [ ] |
| DEV | [ ] | [ ] | [ ] | [ ] |
| SA | [ ] | [ ] | [ ] | [ ] |
| QA | [ ] | [ ] | [ ] | [ ] |

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Missed components with inline styles | Medium | Low | Grep for backgroundColor, border in components |
| Focus outline clipped by overflow | Low | Medium | Use outlineOffset: 2px |
| Transition causes jank | Low | Low | Keep transitions under 200ms |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Selection state consistency | getStateTokens.selected applied to all cards/nodes |
| 2 | Hover state consistency | getStateTokens.hover via getInteractiveSx |
| 3 | Focus state visibility | focusVisible with 2px outline, outlineOffset |
| 4 | Loading state consistency | LoadingSkeleton component with MUI Skeleton |
| 5 | States work in both themes | Tokens use theme.palette for colors |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Component audit completed

### Implementation

- [x] stateTokens.ts created
- [x] LoadingSkeleton created
- [x] ArtifactCard updated
- [x] All tree NodeLabels updated
- [x] Unit tests written
- [x] Visual inspection completed

### Post-Implementation

- [x] All dashboards verified in both themes
- [x] No inline state styles remain
- [x] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
| 2026-01-19 | DEV | Implementation complete - all tests passing |
