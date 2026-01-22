---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Shortcut discoverability and help"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e011-s005"
filename_pattern: "dp-e011-s005-shortcut-discoverability.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e011-005"
    optional: false
---

# Dev Plan: `dp-e011-s005-shortcut-discoverability`

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
| **Dev Plan ID** | dp-e011-s005 |
| **Story** | [s-e011-005](../stories/backlog/s-e011-005-shortcut-discoverability.md) |
| **Epic** | epic-TSV-011 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e011-005](../stories/backlog/s-e011-005-shortcut-discoverability.md) | Shortcut discoverability and help | [fi-TSV-010](../feature-increments/fi-TSV-010-role-dashboard-ux-enhancements.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Create a keyboard shortcuts help modal triggered by `?` key. Add a subtle hint in the dashboard footer. Define shortcuts in a central config for consistency. Ensure the modal is accessible and doesn't interfere with text input.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `KeyboardShortcutsModal.tsx` | New | Modal displaying all shortcuts |
| `ShortcutHint.tsx` | New | Footer hint component |
| `keyboardShortcuts.ts` | New | Central shortcut definitions |
| `useGlobalKeyHandler.ts` | New | Hook for global `?` key listener |
| `DashboardLayout.tsx` | Modified | Add hint and modal |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/constants/keyboardShortcuts.ts` | Create | Shortcut definitions |
| `frontend/src/hooks/useGlobalKeyHandler.ts` | Create | Global key listener hook |
| `frontend/src/components/common/KeyboardShortcutsModal.tsx` | Create | Help modal |
| `frontend/src/components/common/ShortcutHint.tsx` | Create | Footer hint |
| `frontend/src/components/layout/DashboardLayout.tsx` | Modify | Integrate hint + modal |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| MUI Dialog | Existing | Approved |
| MUI Typography | Existing | Approved |

### 2.3 Shortcut Definitions

```typescript
// keyboardShortcuts.ts
export interface Shortcut {
  keys: string[];
  description: string;
  category: 'navigation' | 'actions' | 'help';
}

export const KEYBOARD_SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ['↑', '↓'], description: 'Navigate between items', category: 'navigation' },
  { keys: ['Tab'], description: 'Move to next element', category: 'navigation' },
  { keys: ['Shift', 'Tab'], description: 'Move to previous element', category: 'navigation' },
  { keys: ['Home'], description: 'Go to first item', category: 'navigation' },
  { keys: ['End'], description: 'Go to last item', category: 'navigation' },
  
  // Actions
  { keys: ['Enter'], description: 'Open or expand selected item', category: 'actions' },
  { keys: ['Space'], description: 'Toggle selection', category: 'actions' },
  { keys: ['Esc'], description: 'Close drawer or modal', category: 'actions' },
  
  // Help
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'help' },
];
```

### 2.4 Global Key Handler

```typescript
// useGlobalKeyHandler.ts
export function useGlobalKeyHandler(key: string, handler: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger in input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      if (e.key === key) {
        e.preventDefault();
        handler();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, handler]);
}
```

### 2.5 Modal Layout

```
┌─────────────────────────────────────┐
│  Keyboard Shortcuts            [×]  │
├─────────────────────────────────────┤
│                                     │
│  NAVIGATION                         │
│  ↑ / ↓     Navigate between items   │
│  Tab       Move to next element     │
│  Shift+Tab Move to previous element │
│  Home      Go to first item         │
│  End       Go to last item          │
│                                     │
│  ACTIONS                            │
│  Enter     Open or expand item      │
│  Space     Toggle selection         │
│  Esc       Close drawer or modal    │
│                                     │
│  HELP                               │
│  ?         Show this help           │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] KEYBOARD_SHORTCUTS contains all expected shortcuts
- [ ] useGlobalKeyHandler triggers handler on key press
- [ ] useGlobalKeyHandler ignores input/textarea
- [ ] KeyboardShortcutsModal renders all shortcuts by category

### 3.2 Integration Tests

- [ ] Pressing `?` opens modal from any dashboard
- [ ] Modal closes on Escape
- [ ] Modal closes on click outside
- [ ] Focus returns to previous element after close
- [ ] Hint visible in dashboard footer

### 3.3 Manual Testing

- [ ] Press `?` on each dashboard - modal opens
- [ ] Press `?` while in search input - nothing happens
- [ ] Press Escape - modal closes
- [ ] Click outside modal - closes
- [ ] Verify all shortcuts listed are accurate

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `?` conflicts with text input | Medium | Medium | Check target element before triggering |
| Shortcuts list becomes stale | Low | Low | Single source of truth in constants file |
| Modal not accessible | Low | High | Use MUI Dialog with proper aria labels |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Inline hint visible | ShortcutHint in DashboardLayout footer |
| 2 | Help modal opens with ? | useGlobalKeyHandler + KeyboardShortcutsModal |
| 3 | Help modal content | KEYBOARD_SHORTCUTS rendered by category |
| 4 | Modal closes with Escape/click | MUI Dialog onClose + Escape handler |
| 5 | Focus indicator always visible | Covered by s-e011-003 |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] keyboardShortcuts.ts created
- [ ] useGlobalKeyHandler hook created
- [ ] KeyboardShortcutsModal created
- [ ] ShortcutHint created
- [ ] DashboardLayout updated
- [ ] Unit tests written

### Post-Implementation

- [ ] Modal opens on all dashboards
- [ ] All shortcuts documented accurately
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
