---
# === LLM Retrieval Metadata ===
artifact_kind: story
spec_version: "4.0"
template_version: "4.0.1"
title: "Integration Testing for Role Dashboards"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: sprint-bound

# === Naming ===
id_pattern: "s-e009-006"
filename_pattern: "s-e009-006-integration-testing.md"

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
  - integration testing
  - E2E testing
  - dashboard testing
  - role switching tests
aliases:
  - testing story
anti_keywords:
  - implementation detail
status: Backlog
---

# Story: `s-e009-006-integration-testing`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | s-e009-006 |
| **Epic** | epic-TSV-009 |
| **Status** | Backlog |
| **Estimate** | 3 SP |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)  
**Lifecycle:** Sprint-bound, archived after completion

---

## User Story

**As a** QA Engineer,  
**I want** comprehensive integration tests for the new role dashboards,  
**So that** we can verify the full user journey from role selection to artifact viewing.

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

**Reference:** fi-TSV-001, Section: Testing Strategy

- Integration tests exist for BA and FA dashboards
- No tests exist for DEV, SA, QA role selection or dashboards

### TO-BE (new behavior)

- Integration tests cover:
  - Role selection for all five roles (BA, FA, DEV, SA, QA)
  - Role switching between all roles
  - DEV dashboard artifact listing and navigation
  - SA dashboard artifact listing and navigation
  - QA dashboard artifact listing and navigation
  - Empty state handling for each dashboard
  - Error handling when artifacts fail to load
- Test files added:
  - `tc-fi-TSV-009-role-dashboards.test.ts`
- All tests pass in CI/CD pipeline

---

## Acceptance Criteria (AC)

### Scenario 1: Role Selection Tests

- **Given** the test suite runs
- **When** testing RoleSelector component
- **Then** tests verify all five roles (BA, FA, DEV, SA, QA) are selectable
- **And** tests verify role context is updated correctly

### Scenario 2: Role Switching Tests

- **Given** the user has selected DEV role
- **When** testing role switching
- **Then** tests verify user can switch to any other role
- **And** tests verify dashboard changes to match new role

### Scenario 3: DEV Dashboard API Tests

- **Given** the test suite runs
- **When** testing DEV dashboard API integration
- **Then** tests verify `/api/projects/:id/dev-plans` returns expected data
- **And** tests verify `/api/products/:id/technical-architecture` returns expected data

### Scenario 4: SA Dashboard API Tests

- **Given** the test suite runs
- **When** testing SA dashboard API integration
- **Then** tests verify `/api/products/:id/solution-designs` returns expected data
- **And** tests verify `/api/projects/:id/sdi` and `/tai` return expected data

### Scenario 5: QA Dashboard API Tests

- **Given** the test suite runs
- **When** testing QA dashboard API integration
- **Then** tests verify `/api/projects/:id/test-cases` returns expected data
- **And** tests verify `/api/products/:id/regression-tests` returns expected data
- **And** tests verify `/api/projects/:id/bug-reports` returns expected data

### Scenario 6: E2E Flow Tests

- **Given** the test suite runs
- **When** testing full user journey
- **Then** tests verify: Open app → Select DEV → See dev-plans → Click artifact → View content
- **And** similar flows for SA and QA roles

### Scenario 7: Empty State Tests

- **Given** no artifacts exist for a dashboard section
- **When** testing empty states
- **Then** tests verify appropriate empty state messages are displayed

### Scenario 8: Error Handling Tests

- **Given** API returns error (500, 404)
- **When** testing error scenarios
- **Then** tests verify error toast/message is displayed
- **And** tests verify dashboard remains usable

---

## Technical Notes

- **Test File**: `backend/src/tests/tc-fi-TSV-009.test.ts`
- **Framework**: Vitest (existing test framework)
- **Patterns**: Follow existing test patterns from `tc-fi-TSV-001.test.ts`
- **Mocking**: Use MSW or similar for API mocking in frontend tests

---

## Test Coverage Requirements

| Category | Coverage Target |
|----------|-----------------|
| Role Selection | 100% of roles |
| Role Switching | All combinations |
| API Endpoints | All 8 new endpoints |
| Dashboard Components | DEV, SA, QA |
| Empty States | All sections |
| Error Handling | 404, 500 scenarios |

---

## DoR Checklist (Feature Alignment)

- [x] Linked to Epic (via filename s-e009-006)
- [x] Linked Epic exists in epics folder
- [x] Linked Feature-Increment exists
- [x] Story describes DELTA only, not full behavior
- [x] Feature impact type is marked
- [x] ACs map to feature behavior / business rules

## DoR Checklist (Standard)

- [x] AC Defined (Gherkin or checklist)
- [x] UX Attached (or "No UI required") — No UI required
- [x] Dependencies Clear — Depends on s-e009-001 through s-e009-005 (all features implemented)
- [x] Estimated — 3 SP
- [x] Small enough for one sprint

## DoD Checklist

- [ ] Code Complete (tests written)
- [ ] Tests Passed (all new tests pass)
- [ ] Feature-Increment TO-BE complete (if behavior changed)
- [ ] FA Accepted
- [ ] Story marked Done in backlog
