---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Keyboard navigation implementation"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e011-s004"
filename_pattern: "dp-e011-s004-keyboard-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e011-004"
    optional: false
---

# Dev Plan: `dp-e011-s004-keyboard-navigation`

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
| **Dev Plan ID** | dp-e011-s004 |
| **Story** | [s-e011-004](../stories/backlog/s-e011-004-keyboard-navigation.md) |
| **Epic** | epic-TSV-011 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e011-004](../stories/backlog/s-e011-004-keyboard-navigation.md) | Keyboard navigation implementation | [fi-TSV-010](../feature-increments/fi-TSV-010-role-dashboard-ux-enhancements.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement keyboard navigation using a combination of:
1. **Roving tabindex** pattern for card lists (arrow keys move focus)
2. **MUI TreeView** built-in keyboard support for trees
3. **Focus management** hooks for reader drawer interactions
4. **Escape key** handling for closing drawers/modals

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `useRovingTabindex.ts` | New | Hook for arrow key navigation in lists |
| `useFocusManagement.ts` | New | Hook for focus restoration |
| `ArtifactCardList.tsx` | Modified | Add roving tabindex support |
| `ReaderDrawer.tsx` | Modified | Add Escape handling, focus management |
| All Tree components | Modified | Ensure keyboard support enabled |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/hooks/useRovingTabindex.ts` | Create | Arrow key navigation hook |
| `frontend/src/hooks/useFocusManagement.ts` | Create | Focus save/restore hook |
| `frontend/src/components/common/ArtifactCardList.tsx` | Modify | Apply roving tabindex |
| `frontend/src/components/reader/ReaderDrawer.tsx` | Modify | Escape + focus management |
| `frontend/src/components/trees/*.tsx` | Modify | Verify keyboard props |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| React useRef, useState | Existing | Approved |
| MUI TreeView keyboard support | Existing | Approved |

### 2.3 Roving Tabindex Implementation

```typescript
// useRovingTabindex.ts
interface UseRovingTabindexOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
}

export function useRovingTabindex({ itemCount, onSelect }: UseRovingTabindexOptions) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, itemCount - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(focusedIndex);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(itemCount - 1);
        break;
    }
  }, [itemCount, focusedIndex, onSelect]);

  // Return tabIndex for each item: 0 for focused, -1 for others
  const getTabIndex = (index: number) => index === focusedIndex ? 0 : -1;

  return { focusedIndex, handleKeyDown, getTabIndex, containerRef };
}
```

### 2.4 Focus Management Implementation

```typescript
// useFocusManagement.ts
export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
  }, []);

  return { saveFocus, restoreFocus };
}
```

### 2.5 Tab Order Design

```
Header (logo, nav, theme toggle)
  ↓ Tab
Sidebar / Tree (roving tabindex within)
  ↓ Tab
Main Content / Card List (roving tabindex within)
  ↓ Tab
Reader Drawer (when open, traps focus until Escape)
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] useRovingTabindex moves focus on ArrowDown/ArrowUp
- [ ] useRovingTabindex handles Home/End keys
- [ ] useRovingTabindex calls onSelect on Enter/Space
- [ ] useFocusManagement saves and restores focus correctly

### 3.2 Integration Tests

- [ ] Tab order follows logical flow through dashboard
- [ ] Arrow keys navigate within card list
- [ ] Enter opens reader drawer
- [ ] Escape closes drawer and restores focus
- [ ] No focus traps (can always Tab out)

### 3.3 Manual Testing

| Test | Steps | Expected |
|------|-------|----------|
| Arrow nav in list | Focus card, press ↓↑ | Focus moves between cards |
| Enter activates | Focus card, press Enter | Reader opens |
| Tab order | Press Tab repeatedly | Header → Sidebar → Content → Reader |
| Escape closes | Open reader, press Esc | Drawer closes, focus returns |
| No trap | Navigate to any section | Can Tab out |

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Focus lost after async operations | Medium | Medium | Always track previous focus before async |
| Tree keyboard conflicts with custom keys | Low | Medium | Use MUI TreeView's built-in handlers |
| Focus trap in reader | Medium | High | Ensure Escape always works |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Arrow key navigation in lists | useRovingTabindex hook |
| 2 | Tab order follows logical flow | tabIndex management, DOM order |
| 3 | Enter/Space activates focused item | onSelect callback in roving tabindex |
| 4 | Focus maintained after activation | useFocusManagement hook |
| 5 | Escape closes modals/drawers | onKeyDown handler in ReaderDrawer |
| 6 | No keyboard traps | Test Tab can exit all sections |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] useRovingTabindex hook created
- [ ] useFocusManagement hook created
- [ ] ArtifactCardList updated
- [ ] ReaderDrawer updated
- [ ] Tree components verified
- [ ] Unit tests written
- [ ] Tab order verified

### Post-Implementation

- [ ] All dashboards keyboard-navigable
- [ ] No focus traps
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
