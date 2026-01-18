---
artifact_kind: fi
spec_version: '4.0'
template_version: 4.0.1
title: DEV, SA, and QA Role Dashboards
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound
id_pattern: fi-TSV-009
filename_pattern: fi-TSV-009-dev-sa-qa-role-dashboards.md
links_required:
  - type: feature
    pattern: f-TSV-002
    optional: false
    note: Target feature that this FI modifies
  - type: epic
    pattern: epic-TSV-009
    optional: false
  - type: product
    pattern: product.yml
    optional: false
keywords:
  - feature increment
  - role dashboard
  - DEV
  - SA
  - QA
  - developer
  - architect
  - tester
aliases:
  - DEV/SA/QA dashboards increment
anti_keywords:
  - production truth
  - implementation details
status: Proposed
---

# Feature Increment: `fi-TSV-009-dev-sa-qa-role-dashboards`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

> **ID:** fi-TSV-009  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-002-role-specific-dashboards`  
> **Epic:** [epic-TSV-009](../epics/epic-TSV-009-dev-sa-qa-dashboards.md)  
> **Status:** Proposed

---

## 1. Overview

This increment extends the role-specific dashboards feature (f-TSV-002) by adding dashboard views for **Developer (DEV)**, **Solution Architect (SA)**, and **Quality Assurance (QA)** roles. This follows the BA/FA dashboards delivered in fi-TSV-001 and completes the technical team's dashboard coverage.

---

## 2. AS-IS (Current State)

> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

(Exact copy from `f-TSV-002-role-specific-dashboards` → "Current Behavior")

### Role Selection

User selects BA or FA role via RoleSelector component. Selection is stored in RoleContext and persists for the session. User can switch roles at any time via header role badge.

### Role Dashboard Content

- **BA Dashboard**: Lists business-analysis documents and BA increments for the active product/project
- **FA Dashboard**: Lists features, feature-increments, epics, and stories for the active product/project

### User Flows

1. User opens viewer → sees role selection screen
2. User selects BA or FA → sees role-specific dashboard
3. User clicks artifact → artifact content is displayed in reader
4. User can switch roles via header badge

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| No artifacts for role | Display "No artifacts found" message |
| Artifact file missing | Show error toast and remain on dashboard |
| Role not selected | Show RoleSelector component |

### 2.2 Current Limitations

- Only BA and FA roles are supported for dashboard navigation
- DEV, SA, QA, SM, PO, DES roles do not have dedicated dashboard views
- Technical team members must navigate using folder structure or search

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

After this increment is implemented and synced:

- The system provides role dashboard experiences for:
  - **DEV (Developer)**: dev-plans, stories assigned to sprints, technical documentation
  - **SA (Solution Architect)**: solution designs, technical architectures, and their increments
  - **QA (Quality Assurance)**: test cases, regression tests, bug reports
- The role dashboard provides navigation entry points into the relevant artifacts.
- The role dashboard does not enforce access control; it is a navigation/reading aid.

#### Role Selection (Extended)

- The RoleSelector component is extended to include **DEV**, **SA**, and **QA** options.
- The selected role is clearly visible in the UI while browsing artifacts.
- Role switching within a session is supported (existing behavior).

#### Role Dashboard Content

The role dashboard is a curated navigation view providing entry points that support each role's primary workflow.

**DEV dashboard provides entry points to:**

- Dev Plans for the selected project (`dp-eXXX-sYYY-*.md`)
- Stories in current sprint (when sprint context is available)
- Technical Architecture documents for the selected product
- Technical Architecture Increments for the selected project

**SA dashboard provides entry points to:**

- Solution Designs for the selected product (`sd-PRX-*.md`)
- Technical Architectures for the selected product (`ta-PRX-*.md`)
- Solution Design Increments for the selected project (`sdi-PRX-*.md`)
- Technical Architecture Increments for the selected project (`tai-PRX-*.md`)

**QA dashboard provides entry points to:**

- Test Cases for the selected project (`tc-fi-PRX-*.md`)
- Regression Tests for the selected product (`rt-f-PRX-*.md`)
- Bug Reports for the selected project (`bug-*.md`)
- Feature-Increments (for test coverage context)

**Within each dashboard view:**

- Artifacts are grouped by artifact type (e.g., "Dev Plans", "Technical Architecture", "Test Cases") rather than by folder path.
- Each artifact entry shows:
  - Artifact ID and title
  - Artifact status when available (e.g., Draft, In-Progress, Complete)
  - The owning scope (Product vs Project)
- The dashboard prioritizes role-specific navigation:
  - From DEV items, users can navigate to the associated story/epic when the link exists.
  - From SA items, users can navigate to referenced features when the link exists.
  - From QA items, users can navigate to the associated feature-increment or feature.

### 3.2 Acceptance Criteria

- [ ] AC-1: A user can select the **DEV** role and is presented with navigation to DEV artifacts (dev-plans, stories, TA docs) for `teamspec-viewer` and `teamspecviewermvp`.
- [ ] AC-2: A user can select the **SA** role and is presented with navigation to SA artifacts (solution designs, technical architectures, their increments) for `teamspec-viewer` and `teamspecviewermvp`.
- [ ] AC-3: A user can select the **QA** role and is presented with navigation to QA artifacts (test cases, regression tests, bug reports) for `teamspec-viewer` and `teamspecviewermvp`.
- [ ] AC-4: The dashboard does not provide edit capabilities for any artifact (read-only navigation).
- [ ] AC-5: When viewing an artifact from the dashboard, `{TBD}` markers are highlighted and the user can navigate between `{TBD}` occurrences.
- [ ] AC-6: Role switching between all supported roles (BA, FA, DEV, SA, QA) works correctly.

### 3.3 Out of Scope

- Dashboards for SM, PO, DES roles in this increment.
- Sprint context selection for DEV dashboard (uses all stories).
- Any permissions/authentication behavior.
- Editing artifacts from the dashboard.

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-002 | Modified | Extends dashboard behavior for DEV/SA/QA roles |
| f-TSV-001 | Referenced | Portfolio/product context used for navigation |
| f-TSV-003 | Referenced | FI navigation linked from QA dashboard |
| f-TSV-004 | Referenced | Epic/story navigation linked from DEV dashboard |
| f-TSV-007 | Referenced | Search may be used from dashboards |

### 4.2 Dependencies

- Existing BA/FA dashboards (fi-TSV-001) provide the foundation pattern
- Dev Plans exist in project structure (`projects/*/dev-plans/`)
- SA artifacts exist (solution designs, technical architectures)
- QA artifacts exist (test cases, regression tests, bug reports)

### 4.3 Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Inconsistent artifact structure across projects | Medium | Medium | Define clear API contract for artifact listing |
| Performance with many artifacts | Low | Medium | Implement pagination/lazy loading if needed |

---

## 5. Implementation Notes

### 5.1 Technical Considerations

Refer to [TA-001](../../products/teamspec-viewer/technical-architecture/ta-TSV-001-react-browser-frontend.md) for frontend component structure and [TA-002](../../products/teamspec-viewer/technical-architecture/ta-TSV-002-hono-backend-server.md) for backend API design.

**Frontend:**
- Extend RoleSelector component to include DEV, SA, QA options
- Create DEVDashboard, SADashboard, QADashboard components following the pattern of FADashboard/BADashboard
- Reuse existing ArtifactTree and card components

**Backend:**
- Add API endpoints for listing DEV, SA, QA artifacts:
  - `GET /api/products/:productId/technical-architecture`
  - `GET /api/products/:productId/solution-designs`
  - `GET /api/projects/:projectId/dev-plans`
  - `GET /api/projects/:projectId/test-cases`
  - `GET /api/products/:productId/regression-tests`
  - `GET /api/projects/:projectId/bug-reports`

### 5.2 Testing Strategy

- Unit tests for new dashboard components
- Unit tests for new API endpoints
- Integration tests for artifact listing
- E2E tests for role selection → dashboard navigation → artifact viewing flow

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | AI-Generated | Initial draft |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md → "Current Behavior" (AS-IS source)
- teamspec_viewer/projects/teamspecviewermvp/feature-increments/fi-TSV-001-ba-fa-role-dashboards.md → Pattern reference
- spec/4.0/roles.md → Role definitions and artifact ownership

## Unresolved Items

- None
