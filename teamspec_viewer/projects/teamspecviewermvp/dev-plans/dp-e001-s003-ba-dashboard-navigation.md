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
id_pattern: "dp-e001-s003"
filename_pattern: "dp-e001-s003-ba-dashboard-navigation.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e001-003"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - BA dashboard
  - navigation
  - business analysis
aliases:
  - BA navigation plan
anti_keywords:
  - story
  - feature
---

# Dev Plan: `dp-e001-s003-ba-dashboard-navigation`

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
| **Dev Plan ID** | dp-e001-s003 |
| **Story** | [s-e001-003](../stories/backlog/s-e001-003-ba-dashboard-navigation.md) |
| **Epic** | epic-TSV-001 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-14 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e001-003](../stories/backlog/s-e001-003-ba-dashboard-navigation.md) | BA Dashboard Navigation | [fi-TSV-001](../feature-increments/fi-TSV-001-ba-fa-role-dashboards.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

1. **Backend**: Add API endpoints to list BA artifacts:
   - `GET /api/products/:productId/business-analysis` → list BA docs
   - `GET /api/projects/:projectId/business-analysis-increments` → list BAI docs
2. **Frontend**: Create `<BADashboard />` that fetches and displays these lists, grouped by artifact type.
3. Clicking an artifact opens it in an artifact reader view.

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| Backend routes | New | `/api/products/:id/business-analysis`, `/api/projects/:id/business-analysis-increments` |
| `BADashboard` | New | Fetches BA artifacts; renders grouped list |
| `ArtifactList` | New | Reusable list component for artifacts |
| `ArtifactReader` | New (stub) | Displays artifact markdown (shared across dashboards) |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/products.ts` | Create | Product-level API routes |
| `backend/src/routes/projects.ts` | Create | Project-level API routes |
| `backend/src/index.ts` | Modify | Register new routes |
| `frontend/src/pages/BADashboard.tsx` | Create | BA dashboard page |
| `frontend/src/components/ArtifactList.tsx` | Create | Artifact list component |
| `frontend/src/components/ArtifactReader.tsx` | Create | Artifact viewer (stub) |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Hono router | Existing | — |
| fs/promises (Node) | Existing | — |
| React Router (or state-based nav) | New | Approved |

### 2.3 API Changes

| Endpoint | Method | Change |
|----------|--------|--------|
| `/api/products/:productId/business-analysis` | GET | New — returns list of BA docs |
| `/api/projects/:projectId/business-analysis-increments` | GET | New — returns list of BAI docs |
| `/api/artifacts/:path` | GET | New — returns artifact content (markdown) |

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Backend returns correct BA artifact list for a product
- [ ] Backend returns correct BAI list for a project

### 3.2 Integration Tests

- [ ] BADashboard fetches and displays BA artifacts
- [ ] Clicking an artifact opens reader

### 3.3 Manual Testing

- [ ] Select BA role; dashboard shows BA docs and BA increments
- [ ] Click artifact; content is displayed

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Workspace path not configured | Medium | High | Add clear error message if path missing |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | BA dashboard lists BA artifacts | Fetch from backend; display in ArtifactList |
| 2 | Open a BA artifact | Navigate to ArtifactReader with selected path |

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

- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Section 3.1 "Role Dashboard Content (MVP)" (BA)
- teamspec_viewer/products/teamspec-viewer/technical-architecture/ta-TSV-002-hono-backend-server.md → Backend provides artifact listing API
