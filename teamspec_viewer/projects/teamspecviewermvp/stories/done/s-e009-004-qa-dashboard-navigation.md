---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "QA Dashboard Navigation"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e009-004"
filename_pattern: "s-e009-004-qa-dashboard-navigation.md"

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
  - QA dashboard
  - tester dashboard
  - test cases
  - regression tests
  - bug reports
aliases:
  - tester view
  - quality assurance view
anti_keywords:
  - implementation detail
status: Backlog
---

# Story: `s-e009-004-qa-dashboard-navigation`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e009-004 |
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

**As a** QA Engineer,  
**I want** a dashboard that shows test cases, regression tests, and bug reports,  
**So that** I can quickly navigate to QA artifacts without browsing folder structures.

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
- QA Engineers must use folder navigation or search to find test cases and bug reports
- No curated view of QA-relevant artifacts

### TO-BE (new behavior)

- New QADashboard component provides curated navigation for QA engineers
- Dashboard displays artifacts grouped by type:
  - **Test Cases** (`tc-fi-PRX-*.md`) from selected project
  - **Regression Tests** (`rt-f-PRX-*.md`) from selected product
  - **Bug Reports** (`bug-*.md`) from selected project
  - **Feature-Increments** (for test coverage context) from selected project
- Each artifact entry shows:
  - Artifact ID and title
  - Status (e.g., Draft, Active, Passed, Failed, Open, Resolved)
  - Scope indicator (Product or Project)
- Tree navigation allows drilling into related artifacts:
  - Test case → linked feature-increment
  - Regression test → linked feature
  - Bug report → linked FI or story
- Empty state message when no artifacts exist for a category

---

## Acceptance Criteria (AC)

### Scenario 1: Display Test Cases (Project)

- **Given** the user is on the QA dashboard
- **And** test case documents exist in the selected project
- **When** viewing the "Test Cases" section
- **Then** all test cases are listed with ID, title, and status
- **And** each entry is marked as "Project" scope

### Scenario 2: Display Regression Tests (Product)

- **Given** the user is on the QA dashboard
- **And** regression test documents exist in the selected product
- **When** viewing the "Regression Tests" section
- **Then** all regression test documents are listed with ID, title, and status
- **And** each entry is marked as "Product" scope

### Scenario 3: Display Bug Reports (Project)

- **Given** the user is on the QA dashboard
- **And** bug reports exist in the selected project
- **When** viewing the "Bug Reports" section
- **Then** all bug reports are listed with ID, title, and status
- **And** status shows Open, In-Progress, Resolved, or Closed

### Scenario 4: Display Feature-Increments for Context

- **Given** the user is on the QA dashboard
- **And** feature-increments exist in the selected project
- **When** viewing the "Feature-Increments" section
- **Then** all FIs are listed for test coverage reference
- **And** test cases linked to each FI are visible

### Scenario 5: Navigate to Artifact

- **Given** the user is on the QA dashboard
- **When** the user clicks on a test case entry
- **Then** the artifact content is displayed in the reader panel

### Scenario 6: Empty State

- **Given** the user is on the QA dashboard
- **And** no bug reports exist in the selected project
- **When** viewing the "Bug Reports" section
- **Then** message "No bug reports found" is displayed

### Scenario 7: Navigate from Test Case to FI

- **Given** a test case links to fi-TSV-001
- **When** the user views the test case tree node
- **Then** the linked feature-increment is shown as a related item
- **And** the user can navigate to the FI

### Scenario 8: Bug Reports Grouped by Status

- **Given** multiple bug reports exist with different statuses
- **When** viewing the "Bug Reports" section
- **Then** bugs can be filtered/grouped by status (Open, Resolved)

---

## Technical Notes

- **File**: `frontend/src/components/QADashboard.tsx`
- **Components**: Reuse `ArtifactTree` pattern from FADashboard
- **API Calls**:
  - `GET /api/projects/:projectId/test-cases`
  - `GET /api/products/:productId/regression-tests`
  - `GET /api/projects/:projectId/bug-reports`
  - `GET /api/projects/:projectId/feature-increments` (reuse existing)
- **State**: Use existing product/project context from `ProductContext`

---

## UX & Copy

| Section | Empty State Message |
|---------|---------------------|
| Test Cases | No test cases found for this project |
| Regression Tests | No regression tests found for this product |
| Bug Reports | No bug reports found for this project |
| Feature-Increments | No feature-increments found for this project |

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e009-004)
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
