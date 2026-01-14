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
id_pattern: "dp-e001-s004"
filename_pattern: "dp-e001-s004-fa-dashboard-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e001-004"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - FA dashboard
  - navigation
  - features
  - feature increments
  - epics
  - stories
aliases:
  - FA navigation plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e001-s004-fa-dashboard-navigation`

> **Template Version**: 4.0  
> **Last Updated**: 2026-01-14

---

**Document Owner:** DEV (Developer)  
**Artifact Type:** Execution (Implementation Plan)  
**Lifecycle:** Sprint-bound, archived after story completion

---

## Metadata

| Field | Value |
|-------|-------|
| **Dev Plan ID** | dp-e001-s004 |
| **Story** | [s-e001-004](../stories/backlog/s-e001-004-fa-dashboard-navigation.md) |
| **Epic** | epic-TSV-001 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-14 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e001-004](../stories/backlog/s-e001-004-fa-dashboard-navigation.md) | FA Dashboard Navigation | [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

1. **Backend**: Add API endpoints to list FA artifacts:
   - `GET /api/products/:productId/features` → list product Feature Canon
   - `GET /api/projects/:projectId/feature-increments` → list project FIs
   - `GET /api/projects/:projectId/epics` → list project epics
   - `GET /api/projects/:projectId/stories` → list project stories (all workflow folders)
2. **Frontend**: Create `<FADashboard />` that fetches and displays these lists, grouped by artifact type.
3. Reuse `ArtifactList` and `ArtifactReader` from BA dashboard story.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| Backend routes | New | `/api/products/:id/features`, `/api/projects/:id/feature-increments`, etc. |
| `FADashboard` | New | Fetches FA artifacts; renders grouped list |
| `ArtifactList` | Reused | Shared list component |
| `ArtifactReader` | Reused | Shared artifact viewer |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/products.ts` | Modify | Add `/features` endpoint |
| `backend/src/routes/projects.ts` | Modify | Add `/feature-increments`, `/epics`, `/stories` endpoints |
| `frontend/src/pages/FADashboard.tsx` | Create | FA dashboard page |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Hono router | Existing | — |
| fs/promises (Node) | Existing | — |
| ArtifactList, ArtifactReader | Existing (from s-e001-003) | — |

### 2.3 API Changes

| Endpoint | Method | Change |
|----------|--------|--------|
| `/api/products/:productId/features` | GET | New — returns list of feature docs |
| `/api/projects/:projectId/feature-increments` | GET | New — returns list of FI docs |
| `/api/projects/:projectId/epics` | GET | New — returns list of epic docs |
| `/api/projects/:projectId/stories` | GET | New — returns list of story docs (all states) |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Backend returns correct feature list for a product
- [ ] Backend returns correct FI list for a project
- [ ] Backend returns correct epic and story lists

### 3.2 Integration Tests

- [ ] FADashboard fetches and displays FA artifacts
- [ ] Clicking an artifact opens reader

### 3.3 Manual Testing

- [ ] Select FA role; dashboard shows features, FIs, epics, stories
- [ ] Click artifact; content is displayed

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Story folder structure varies (backlog/in-progress/done) | Low | Medium | Glob all subfolders of `/stories/` |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | FA dashboard lists FA artifacts | Fetch from backend; display in ArtifactList (grouped) |
| 2 | Epics/stories shown when present | Conditionally render sections if non-empty |

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
- [ ] Documentation updated
- [ ] Ready for QA verification

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-14 | AI-Generated | Initial plan |

---

## Sources Consulted

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.1 "Role Dashboard Content (MVP)" (FA)
- teamspec_viewer/products/teamspec-viewer/technical-architecture/ta-TSV-002-hono-backend-server.md → Backend provides artifact listing API
