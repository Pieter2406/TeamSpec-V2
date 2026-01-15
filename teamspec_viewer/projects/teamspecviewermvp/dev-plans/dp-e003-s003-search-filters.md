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
id_pattern: "dp-e003-s003"
filename_pattern: "dp-e003-s003-search-filters.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e003-003"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - search
  - filters
  - artifact type
  - role
aliases:
  - search filters plan
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e003-s003-search-filters`

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
| **Dev Plan ID** | dp-e003-s003 |
| **Story** | [s-e003-003](../stories/backlog/s-e003-003-search-filters.md) |
| **Epic** | epic-TSV-003 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-15 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e003-003](../stories/backlog/s-e003-003-search-filters.md) | Search Filters | [fi-TSV-003](../feature-increments/fi-TSV-003-ba-fa-artifact-search.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Add filter controls to search:
1. Backend: Accept filter query params (`type`, `role`)
2. Backend: Filter results based on artifact front matter
3. Frontend: Filter chips/dropdowns next to search results
4. Frontend: Clear filters button

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `search.ts` (route) | Modified | Add filter params support |
| `searchService.ts` | Modified | Filter by artifact_kind and role_owner |
| `SearchFilters.tsx` | New | Filter UI component |
| `SearchResults.tsx` | Modified | Include filters above results |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/search.ts` | Modify | Accept type and role params |
| `backend/src/services/searchService.ts` | Modify | Apply filters to results |
| `frontend/src/components/SearchFilters.tsx` | Create | Filter selector UI |
| `frontend/src/components/SearchResults.tsx` | Modify | Add SearchFilters |
| `frontend/src/api/search.ts` | Modify | Pass filter params |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @mui/material (Chip, Select, MenuItem) | Existing | Approved |

### 2.3 API Changes

```typescript
// GET /api/search?q=<query>&type=<type>&role=<role>
// type: feature | feature-increment | epic | story | business-analysis | all
// role: BA | FA | all

// Example:
// GET /api/search?q=dashboard&type=feature&role=FA
```

### 2.4 Filter Logic

```typescript
// In searchService.ts
function applyFilters(results, filters) {
  return results.filter(result => {
    // Type filter: match artifact_kind from front matter
    if (filters.type && filters.type !== 'all') {
      if (result.type !== filters.type) return false;
    }
    // Role filter: match role_owner from front matter
    if (filters.role && filters.role !== 'all') {
      if (result.role !== filters.role) return false;
    }
    return true;
  });
}
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Filter by type returns only matching types
- [ ] Filter by role returns only matching roles
- [ ] Combined filters work correctly
- [ ] 'all' filter returns unfiltered results

### 3.2 Integration Tests

- [ ] `/api/search?q=X&type=feature` returns only features
- [ ] `/api/search?q=X&role=BA` returns only BA-owned artifacts

### 3.3 Manual Testing

- [ ] Apply type filter, verify results filtered
- [ ] Apply role filter, verify results filtered
- [ ] Apply both filters, verify combined effect
- [ ] Clear filters, verify all results return

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Missing front matter metadata | Medium | Low | Default to 'unknown' type/role |
| Too many filter options | Low | Low | Start with core types only |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | Filter by artifact type (FI, Story, etc.) | type query param + SearchFilters |
| 2 | Filter by role (BA) | role=BA filter |
| 3 | Filter by role (FA) | role=FA filter |
| 4 | Combined filters work | Both filters applied together |
| 5 | Clear filters removes all | Reset filter state |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] Backend filter params added
- [ ] Search service filter logic implemented
- [ ] SearchFilters component created
- [ ] Frontend filter state management
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] AC verified
- [ ] Documentation updated
- [ ] Ready for QA
