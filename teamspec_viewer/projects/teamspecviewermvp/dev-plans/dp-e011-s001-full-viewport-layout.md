---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Full-viewport responsive layout implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e011-s001"
filename_pattern: "dp-e011-s001-full-viewport-layout.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e011-001"
    optional: false
---

# Dev Plan: `dp-e011-s001-full-viewport-layout`

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
| **Dev Plan ID** | dp-e011-s001 |
| **Story** | [s-e011-001](../stories/backlog/s-e011-001-full-viewport-layout.md) |
| **Epic** | epic-TSV-011 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e011-001](../stories/backlog/s-e011-001-full-viewport-layout.md) | Full-viewport responsive layout | [fi-TSV-010](../feature-increments/fi-TSV-010-role-dashboard-ux-enhancements.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Refactor dashboard layout components to use CSS Flexbox for full viewport height and CSS Grid for responsive width adaptation. Update the root App layout and each dashboard component to eliminate fixed max-width constraints and ensure content fills available space.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `App.tsx` | Modified | Update root layout to use flex column with min-height: 100vh |
| `DashboardLayout.tsx` | New | Create shared layout wrapper for all dashboards |
| `BADashboard.tsx` | Modified | Apply responsive grid layout |
| `FADashboard.tsx` | Modified | Apply responsive grid layout |
| `DEVDashboard.tsx` | Modified | Apply responsive grid layout |
| `SADashboard.tsx` | Modified | Apply responsive grid layout |
| `QADashboard.tsx` | Modified | Apply responsive grid layout |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/App.tsx` | Modify | Add flex layout with min-height: 100vh |
| `frontend/src/components/layout/DashboardLayout.tsx` | Create | Shared responsive layout wrapper |
| `frontend/src/components/dashboards/BADashboard.tsx` | Modify | Use DashboardLayout, remove max-width |
| `frontend/src/components/dashboards/FADashboard.tsx` | Modify | Use DashboardLayout, remove max-width |
| `frontend/src/components/dashboards/DEVDashboard.tsx` | Modify | Use DashboardLayout, remove max-width |
| `frontend/src/components/dashboards/SADashboard.tsx` | Modify | Use DashboardLayout, remove max-width |
| `frontend/src/components/dashboards/QADashboard.tsx` | Modify | Use DashboardLayout, remove max-width |
| `frontend/src/styles/layout.ts` | Create | Responsive breakpoint constants and sx props |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| MUI System (sx prop) | Existing | Approved |
| MUI Grid2 | Existing | Approved |

### 2.3 CSS Strategy

```typescript
// layout.ts - Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// DashboardLayout sx
export const dashboardLayoutSx = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  px: { xs: 1, sm: 2, md: 3 }, // 8px, 16px, 24px
};

// Content area sx
export const contentAreaSx = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',              // Mobile: stacked
    md: '300px 1fr',        // Desktop: sidebar + main
    lg: '320px 1fr 320px',  // Wide: sidebar + main + reader
  },
  gap: 2,
};
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] DashboardLayout renders without horizontal overflow
- [ ] DashboardLayout fills viewport height
- [ ] Grid columns adapt at breakpoints

### 3.2 Integration Tests

- [ ] Each dashboard renders full-width on 1920px viewport
- [ ] No horizontal scroll on 320px viewport
- [ ] Layout transitions smoothly between breakpoints

### 3.3 Manual Testing

| Viewport | Test |
|----------|------|
| 320px | No horizontal scroll, content stacked |
| 768px | Sidebar visible, content adapts |
| 1024px | Full desktop layout |
| 1440px | Wide layout with reader panel |
| 1920px | Max 24px margins |

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Existing components depend on fixed width | Medium | Medium | Audit all dashboard children for width assumptions |
| Tree components overflow | Low | Medium | Test TreeView with long content |
| Mobile layout breaks reader | Medium | High | Ensure reader is drawer/modal on mobile |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Full-width on 1920px desktop | DashboardLayout with max px: 24px |
| 2 | No horizontal scroll on 320px mobile | Use responsive grid with xs: '1fr' |
| 3 | Height fills viewport | flex: 1 on content area, min-height: 100vh on root |
| 4 | Responsive breakpoints adapt | Grid template columns with xs/md/lg breakpoints |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] Code implemented
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] Integration tests passing
- [ ] All 5 dashboards verified
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
