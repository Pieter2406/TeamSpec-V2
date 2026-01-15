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
id_pattern: "dp-e003-s001"
filename_pattern: "dp-e003-s001-search-backend.md"

# === Required Relationships ===
links_required:
  - type: story
    pattern: "s-e003-001"
    optional: false

# === Search Optimization ===
keywords:
  - dev plan
  - search
  - backend
  - API
  - full-text
aliases:
  - search backend plan
anti_keywords:
  - story
  - requirements
---

# Dev Plan: `dp-e003-s001-search-backend`

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
| **Dev Plan ID** | dp-e003-s001 |
| **Story** | [s-e003-001](../stories/backlog/s-e003-001-search-backend.md) |
| **Epic** | epic-TSV-003 |
| **Product** | teamspec-viewer (TSV) |
| **Author** | AI-Generated |
| **Created** | 2026-01-15 |
| **Status** | Draft |

---

## Linked Story

| Story ID | Title | Feature-Increment |
|----------|-------|-------------------|
| [s-e003-001](../stories/backlog/s-e003-001-search-backend.md) | Search Backend API | [fi-TSV-003](../feature-increments/fi-TSV-003-ba-fa-artifact-search.md) |

---

## 1. Implementation Approach

### 1.1 Strategy

Implement a server-side search endpoint that:
1. Scans all markdown files in products/ and projects/ directories
2. Performs simple text matching against file content
3. Returns results with artifact metadata and content snippets
4. No external search engine required for MVP

### 1.2 Key Components

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `search.ts` (route) | New | Search API endpoint handler |
| `searchService.ts` | New | Search logic and file scanning |
| `index.ts` | Modified | Register search routes |

---

## 2. Technical Design

### 2.1 Files to Create/Modify

| File Path | Action | Purpose |
|-----------|--------|---------|
| `backend/src/routes/search.ts` | Create | Search endpoint handler |
| `backend/src/services/searchService.ts` | Create | Search logic, file scanning, snippet extraction |
| `backend/src/index.ts` | Modify | Register search route |

### 2.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| gray-matter | Existing | Approved |
| glob | Existing | Approved |

### 2.3 API Design

```typescript
// GET /api/search?q=<query>
// Response:
{
  "query": "dashboard",
  "results": [
    {
      "id": "f-TSV-002",
      "title": "Role-Specific Dashboards",
      "type": "feature",
      "path": "products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md",
      "snippet": "...BA and FA dashboard views..."
    }
  ],
  "count": 1
}
```

### 2.4 Search Algorithm (MVP)

```typescript
// 1. Glob all .md files in products/ and projects/
// 2. For each file:
//    a. Read content
//    b. Check if query appears in content (case-insensitive)
//    c. If match, extract snippet around first occurrence
//    d. Parse front matter for artifact metadata
// 3. Return sorted by relevance (match count or position)
```

---

## 3. Testing Strategy

### 3.1 Unit Tests

- [ ] Search finds exact matches
- [ ] Search is case-insensitive
- [ ] Snippet extraction shows context around match
- [ ] Empty query returns empty results
- [ ] Non-matching query returns empty array

### 3.2 Integration Tests

- [ ] `/api/search?q=dashboard` returns feature results
- [ ] `/api/search?q=TBD` returns artifacts with TBD markers

### 3.3 Manual Testing

- [ ] Search for "dashboard" returns f-TSV-002
- [ ] Search for non-existent term returns empty
- [ ] Response time < 2 seconds for workspace

---

## 4. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Large workspace slows search | Medium | Medium | Limit file count, add pagination |
| Memory issues with many files | Low | High | Stream file reading instead of loading all |
| Binary files cause issues | Low | Low | Filter to .md and .yml only |

---

## 5. Acceptance Criteria Mapping

| AC # | Acceptance Criteria | Implementation Notes |
|------|---------------------|---------------------|
| 1 | GET `/api/search?q=X` returns matching artifacts | searchService.search() method |
| 2 | Result includes id, title, type, path, snippet | Parse front matter + extract snippet |
| 3 | Artifacts with {TBD} markers found | Text search includes literal {TBD} |
| 4 | Empty results return `results: []` | Handle no matches gracefully |

---

## 6. Checklist

### Pre-Implementation

- [ ] Story requirements understood
- [ ] Feature-Increment AS-IS/TO-BE reviewed
- [ ] Technical approach approved
- [ ] Dependencies identified

### Implementation

- [ ] Search service implemented
- [ ] Search endpoint created
- [ ] Unit tests written
- [ ] Code reviewed
- [ ] Tests passing

### Post-Implementation

- [ ] AC verified
- [ ] Documentation updated
- [ ] Ready for QA
