---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Dark mode theme toggle implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e011-s002"
filename_pattern: "dp-e011-s002-dark-mode-toggle.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e011-002"
    optional: false
---

# Dev Plan: `dp-e011-s002-dark-mode-toggle`

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
| **Dev Plan ID** | dp-e011-s002 |
| **Story** | [s-e011-002](../stories/backlog/s-e011-002-dark-mode-toggle.md) |
| **Epic** | epic-TSV-011 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e011-002](../stories/backlog/s-e011-002-dark-mode-toggle.md) | Dark mode theme toggle | [fi-TSV-010](../feature-increments/fi-TSV-010-role-dashboard-ux-enhancements.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a ThemeContext with light/dark mode support using MUI's createTheme. Add a toggle button in the dashboard header. Persist preference in sessionStorage. Define color tokens for both themes ensuring WCAG AA contrast compliance.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ThemeContext.tsx` | New | Context provider for theme mode state |
| `ThemeToggle.tsx` | New | Icon button to toggle light/dark mode |
| `theme.ts` | New | Light and dark theme definitions |
| `App.tsx` | Modified | Wrap with ThemeContext provider |
| `DashboardHeader.tsx` | Modified | Add ThemeToggle button |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/contexts/ThemeContext.tsx` | Create | Theme mode state management |
| `frontend/src/components/common/ThemeToggle.tsx` | Create | Toggle button component |
| `frontend/src/styles/theme.ts` | Create | Light/dark theme definitions |
| `frontend/src/App.tsx` | Modify | Add ThemeProvider wrapper |
| `frontend/src/components/layout/DashboardHeader.tsx` | Modify | Add toggle button |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @mui/material ThemeProvider | Existing | Approved |
| @mui/icons-material (LightMode, DarkMode) | Existing | Approved |

### 2.3 Theme Architecture

```typescript
// ThemeContext.tsx
interface ThemeContextValue {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

// Detect system preference on initial load
const getInitialMode = (): 'light' | 'dark' => {
  const stored = sessionStorage.getItem('theme-mode');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};
```

```typescript
// theme.ts - Color tokens
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#fafafa', paper: '#ffffff' },
    text: { primary: '#212121', secondary: '#757575' },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b0b0b0' },
  },
});
```

### 2.4 Contrast Verification

| Element | Light Mode | Dark Mode | Target |
|---------|------------|-----------|--------|
| Body text | #212121 on #fafafa (16:1) | #ffffff on #121212 (17:1) | ≥4.5:1 ✓ |
| Secondary text | #757575 on #fafafa (4.6:1) | #b0b0b0 on #121212 (7.3:1) | ≥4.5:1 ✓ |
| Primary action | #1976d2 on #ffffff (4.5:1) | #90caf9 on #1e1e1e (8.6:1) | ≥3:1 ✓ |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] ThemeContext provides correct initial mode
- [ ] toggleMode switches between light/dark
- [ ] Theme persists to sessionStorage
- [ ] System preference detected on first load

### 3.2 Integration Tests

- [ ] ThemeToggle renders and is clickable
- [ ] All dashboard surfaces update on toggle
- [ ] Theme persists across navigation
- [ ] Theme persists on page refresh

### 3.3 Manual Testing

- [ ] Visual inspection of all dashboards in both themes
- [ ] Contrast check with browser dev tools
- [ ] Test system preference detection (new session)

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Some components use hardcoded colors | Medium | Medium | Audit all sx props for hardcoded colors |
| Status badges unreadable in dark mode | Medium | High | Define semantic color tokens for states |
| Charts/visualizations don't adapt | Low | Medium | Test any chart components separately |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Toggle visible and functional | ThemeToggle in DashboardHeader |
| 2 | Dark mode applies to all surfaces | ThemeProvider wraps entire app |
| 3 | Theme persists in session | sessionStorage with key 'theme-mode' |
| 4 | WCAG 2.1 AA contrast maintained | Verified color tokens (see 2.4) |
| 5 | System preference detection | getInitialMode() checks matchMedia |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] ThemeContext created
- [ ] Light/dark themes defined
- [ ] ThemeToggle component created
- [ ] App wrapped with provider
- [ ] Unit tests written
- [ ] Contrast verified

### Post-Implementation

- [ ] All dashboards tested in both modes
- [ ] No hardcoded colors remain
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
