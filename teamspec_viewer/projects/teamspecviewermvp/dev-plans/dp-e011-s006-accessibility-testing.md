---
# === LLM Retrieval Metadata ===
artifact_kind: devplan
spec_version: "4.0"
template_version: "4.0.1"
title: "Accessibility testing and WCAG compliance"

# === Ownership ===
role_owner: DEV
artifact_type: Project Execution
canonicity: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "dp-e011-s006"
filename_pattern: "dp-e011-s006-accessibility-testing.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e011-006"
    optional: false
---

# Dev Plan: `dp-e011-s006-accessibility-testing`

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
| **Dev Plan ID** | dp-e011-s006 |
| **Story** | [s-e011-006](../stories/backlog/s-e011-006-accessibility-testing.md) |
| **Epic** | epic-TSV-011 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | DEV |
| **Created** | 2026-01-18 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e011-006](../stories/backlog/s-e011-006-accessibility-testing.md) | Accessibility testing and WCAG compliance | [fi-TSV-010](../feature-increments/fi-TSV-010-role-dashboard-ux-enhancements.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Integrate axe-core into the test suite for automated accessibility audits. Conduct manual screen reader testing with NVDA. Fix any issues found. Document compliance status.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `axe.test.ts` | New | Automated a11y tests for each dashboard |
| Various components | Modified | Fix any a11y violations found |
| `A11Y_COMPLIANCE.md` | New | Document compliance status |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/__tests__/a11y/axe.test.ts` | Create | Axe-core integration tests |
| `frontend/src/__tests__/a11y/setup.ts` | Create | Axe-core test setup |
| `frontend/package.json` | Modify | Add @axe-core/react or axe-playwright |
| Various components | Modify | Fix violations as found |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @axe-core/playwright | New | Pending approval |
| axe-core | New | Pending approval |

### 2.3 Axe Integration

```typescript
// a11y/setup.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function checkA11y(page: Page, name: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
}
```

```typescript
// a11y/axe.test.ts
import { test } from '@playwright/test';
import { checkA11y } from './setup';

const dashboards = [
  { name: 'BA Dashboard', path: '/ba' },
  { name: 'FA Dashboard', path: '/fa' },
  { name: 'DEV Dashboard', path: '/dev' },
  { name: 'SA Dashboard', path: '/sa' },
  { name: 'QA Dashboard', path: '/qa' },
];

for (const { name, path } of dashboards) {
  test(`${name} passes axe audit`, async ({ page }) => {
    await page.goto(path);
    await checkA11y(page, name);
  });
  
  test(`${name} passes axe audit in dark mode`, async ({ page }) => {
    await page.goto(path);
    await page.click('[data-testid="theme-toggle"]');
    await checkA11y(page, `${name} (dark)`);
  });
}
```

### 2.4 Common Violations to Check

| Violation | Description | Fix |
|-----------|-------------|-----|
| color-contrast | Insufficient contrast | Adjust colors in theme |
| button-name | Button without accessible name | Add aria-label |
| image-alt | Image without alt text | Add alt attribute |
| link-name | Link without accessible name | Add aria-label or text |
| aria-valid-attr | Invalid ARIA attribute | Remove or fix attribute |
| region | Content not in landmark | Wrap in main/nav/aside |

### 2.5 Manual Testing Checklist

| Test | Tool | Pass/Fail |
|------|------|-----------|
| Screen reader navigation | NVDA | [ ] |
| Landmarks announced | NVDA | [ ] |
| Buttons/links announced | NVDA | [ ] |
| Form labels announced | NVDA | [ ] |
| Live regions working | NVDA | [ ] |
| Focus order logical | Keyboard | [ ] |
| Skip link works | Keyboard | [ ] |

---

## 3. Testing Strategy

### 3.1 Automated Tests

- [ ] Axe audit passes for BA Dashboard (light)
- [ ] Axe audit passes for BA Dashboard (dark)
- [ ] Axe audit passes for FA Dashboard (light)
- [ ] Axe audit passes for FA Dashboard (dark)
- [ ] Axe audit passes for DEV Dashboard (light)
- [ ] Axe audit passes for DEV Dashboard (dark)
- [ ] Axe audit passes for SA Dashboard (light)
- [ ] Axe audit passes for SA Dashboard (dark)
- [ ] Axe audit passes for QA Dashboard (light)
- [ ] Axe audit passes for QA Dashboard (dark)

### 3.2 Manual Testing

- [ ] NVDA reads all dashboard content
- [ ] VoiceOver reads all dashboard content (if macOS available)
- [ ] Tab navigation covers all interactive elements
- [ ] Focus never gets trapped

### 3.3 Contrast Testing

| Surface | Light Mode | Dark Mode |
|---------|------------|-----------|
| Body text | [ ] ≥4.5:1 | [ ] ≥4.5:1 |
| Secondary text | [ ] ≥4.5:1 | [ ] ≥4.5:1 |
| Large headings | [ ] ≥3:1 | [ ] ≥3:1 |
| Links | [ ] ≥4.5:1 | [ ] ≥4.5:1 |
| Buttons | [ ] ≥3:1 | [ ] ≥3:1 |

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Many violations found | Medium | High | Prioritize critical/serious, defer minor |
| Third-party component violations | Low | Medium | Check MUI versions, apply aria fixes |
| Screen reader inconsistencies | Low | Low | Test with multiple readers |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Axe-core audit passes | axe.test.ts with zero critical/serious |
| 2 | Color contrast meets AA | Theme colors verified (see s-e011-002) |
| 3 | Screen reader compatibility | Manual NVDA testing |
| 4 | Focus order is logical | Tab order test |
| 5 | Icons have accessible names | aria-label or aria-hidden audit |
| 6 | No ARIA errors | Axe validates ARIA |

---

## 6. Checklist

### Pre-Implementation

- [x] Story requirements understood
- [x] Feature-Increment AS-IS/TO-BE reviewed
- [x] Technical approach approved
- [x] Dependencies identified

### Implementation

- [ ] @axe-core/playwright installed
- [ ] axe.test.ts created
- [ ] Initial audit run
- [ ] Violations documented
- [ ] Critical/serious violations fixed
- [ ] Re-run audit - zero violations

### Post-Implementation

- [ ] All 10 automated tests pass (5 dashboards × 2 themes)
- [ ] Manual NVDA testing complete
- [ ] A11Y_COMPLIANCE.md created
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-18 | DEV | Initial plan |
