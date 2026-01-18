---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "SA Dashboard Navigation"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e009-003"
filename_pattern: "s-e009-003-sa-dashboard-navigation.md"

# === Required Relationships ===
links_required:
  - type: epic
    pattern: "epic-TSV-009"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-009"
    optional: true

# === Search Optimization ===
keywords:
  - SA dashboard
  - solution architect dashboard
  - solution designs
  - technical architecture
  - SDI
  - TAI
aliases:
  - architect view
anti_keywords:
  - implementation detail
status: Backlog
---

# Story: `s-e009-003-sa-dashboard-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e009-003 |
| **Epic** | epic-TSV-009 |
| **Status** | Backlog |
| **Estimate** | 5 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** Solution Architect,  
**I want** a dashboard that shows solution designs, technical architectures, and their increments,  
**So that** I can quickly navigate to architecture artifacts without browsing folder structures.

---

## Linked Epic

| Epic ID | Epic Name | Product |
|---------|-----------|---------|
| [epic-TSV-009](../../epics/epic-TSV-009-dev-sa-qa-dashboards.md) | DEV/SA/QA Role Dashboards | TeamSpec Viewer (TSV) |

---

## Linked Feature-Increment

| FI ID | Description |
|-------|-------------|
| [fi-TSV-009](../../feature-increments/fi-TSV-009-dev-sa-qa-role-dashboards.md) | DEV/SA/QA role selection + dashboard navigation |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature
- [ ] **Changes Behavior**
- [ ] **Fixes Defect**
- [ ] **Technical Only**

### AS-IS (current behavior)

**Reference:** f-TSV-002, Section: Role Dashboard Content

- Only BA and FA dashboards exist
- Solution Architects must use folder navigation or search to find SD/TA documents
- No curated view of architecture-relevant artifacts

### TO-BE (new behavior)

- New SADashboard component provides curated navigation for solution architects
- Dashboard displays artifacts grouped by type:
  - **Solution Designs** (`sd-PRX-*.md`) from selected product
  - **Technical Architectures** (`ta-PRX-*.md`) from selected product
  - **Solution Design Increments** (`sdi-PRX-*.md`) from selected project
  - **Technical Architecture Increments** (`tai-PRX-*.md`) from selected project
- Each artifact entry shows:
  - Artifact ID and title
  - Status (e.g., Draft, Active, Deprecated)
  - Scope indicator (Product or Project)
- Tree navigation allows drilling into related artifacts:
  - SD → related features when linked
  - TA → related SDI/TAI increments
- Empty state message when no artifacts exist for a category

---

## Acceptance Criteria (AC)

### Scenario 1: Display Solution Designs (Product)

- **Given** the user is on the SA dashboard
- **And** solution design documents exist in the selected product
- **When** viewing the "Solution Designs" section
- **Then** all SD documents are listed with ID, title, and status
- **And** each entry is marked as "Product" scope

### Scenario 2: Display Technical Architectures (Product)

- **Given** the user is on the SA dashboard
- **And** TA documents exist in the selected product
- **When** viewing the "Technical Architectures" section
- **Then** all TA documents are listed with ID, title, and status
- **And** each entry is marked as "Product" scope

### Scenario 3: Display SDI (Project)

- **Given** the user is on the SA dashboard
- **And** SDI documents exist in the selected project
- **When** viewing the "Solution Design Increments" section
- **Then** all SDI documents are listed with ID, title, and status
- **And** each entry is marked as "Project" scope

### Scenario 4: Display TAI (Project)

- **Given** the user is on the SA dashboard
- **And** TAI documents exist in the selected project
- **When** viewing the "Technical Architecture Increments" section
- **Then** all TAI documents are listed with ID, title, and status
- **And** each entry is marked as "Project" scope

### Scenario 5: Navigate to Artifact

- **Given** the user is on the SA dashboard
- **When** the user clicks on a TA document entry
- **Then** the artifact content is displayed in the reader panel

### Scenario 6: Empty State

- **Given** the user is on the SA dashboard
- **And** no solution designs exist in the selected product
- **When** viewing the "Solution Designs" section
- **Then** message "No solution designs found" is displayed

### Scenario 7: Navigate from TA to Related TAI

- **Given** a TA document has project increments (TAI)
- **When** the user views the TA tree node
- **Then** related TAI documents are shown as children/related items
- **And** the user can navigate to any TAI

---

## Technical Notes

- **File**: `frontend/src/components/SADashboard.tsx`
- **Components**: Reuse `ArtifactTree` pattern from FADashboard
- **API Calls**:
  - `GET /api/products/:productId/solution-designs`
  - `GET /api/products/:productId/technical-architecture`
  - `GET /api/projects/:projectId/sdi`
  - `GET /api/projects/:projectId/tai`
- **State**: Use existing product/project context from `ProductContext`

---

## UX & Copy

| Section | Empty State Message |
|---------|---------------------|
| Solution Designs | No solution designs found for this product |
| Technical Architectures | No TA documents found for this product |
| SDI | No SDI documents found for this project |
| TAI | No TAI documents found for this project |

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e009-003)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required") — Empty state copy provided
- [x] Dependencies Clear — Depends on s-e009-001 (RoleSelector), s-e009-005 (API)
- [x] Estimated — 5 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete
- [ ] Tests Passed
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
