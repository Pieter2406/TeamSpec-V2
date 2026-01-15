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
id_pattern: "dp-e001-s005"
filename_pattern: "dp-e001-s005-tbd-marker-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e001-005"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - TBD
  - highlight
  - marker
  - navigation
aliases:
  - TBD navigator plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e001-s005-tbd-marker-navigation`

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
| **Dev Plan ID** | dp-e001-s005 |
| **Story** | [s-e001-005](../stories/backlog/s-e001-005-tbd-marker-navigation.md) |
| **Epic** | epic-TSV-001 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-14 |
| **Status** | Implemented |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e001-005](../stories/backlog/s-e001-005-tbd-marker-navigation.md) | TBD Marker Navigation | [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Extend `ArtifactReader` (markdown viewer) to:
1. **Highlight** all `{TBD}` occurrences with a distinct style (e.g., background color).
2. **Index** each occurrence and provide next/previous navigation controls.

Implementation:
- Parse rendered markdown for `{TBD}` strings.
- Wrap each occurrence in a `<span class="tbd-marker" data-index="N">` during render.
- Provide a small floating toolbar or keyboard shortcuts (Ctrl+↓ / Ctrl+↑) to jump between markers.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `ArtifactReader` | Modified | Add TBD highlighting logic |
| `TbdNavigator` | New | Toolbar with count, next/prev buttons |
| CSS / Tailwind class | New | `.tbd-marker` styling |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `frontend/src/components/ArtifactReader.tsx` | Modify | Inject TBD highlighting during markdown render |
| `frontend/src/components/TbdNavigator.tsx` | Create | UI for TBD count + next/prev |
| `frontend/src/styles/tbd.css` (or Tailwind) | Create | Highlight styling |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| react-markdown or similar | Existing (from ArtifactReader) | — |
| scrollIntoView | Browser API | — |

### 2.3 API Changes

None — all logic is frontend-only.

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [x] Regex correctly matches `{TBD}` (case-sensitive)
- [x] Multiple occurrences produce correct index count

### 3.2 Integration Tests

- [x] Opening artifact with 3 TBDs shows "3 TBDs" in navigator
- [x] Next/prev buttons cycle through occurrences

### 3.3 Manual Testing

- [x] Open artifact with `{TBD}` markers
- [x] Verify markers are highlighted
- [x] Click "Next"; viewport scrolls to next marker

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `{TBD}` inside code blocks shouldn't highlight | Medium | Low | Optionally exclude `<code>` contents |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | `{TBD}` occurrences are highlighted | Wrap in styled span during render |
| 2 | User can navigate between occurrences | TbdNavigator with next/prev + scrollIntoView |

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
| 2026-01-15 | AI-Generated | Implementation complete — TbdHighlighter component with highlighting, navigation, and frontmatter stripping |

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.2 (AC-4)
- teamspec_viewer/projects/teamspecviewermvp/stories/backlog/s-e001-005-tbd-marker-navigation.md → Story ACs
