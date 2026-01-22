---
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Sidebar not using proper width"
---

# Bug Report: `bug-teamspecviewermvp-017-sidebar-width`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | bug-teamspecviewermvp-017 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Dev |
| **Version** | Post s-e011-001 implementation |
| **Reporter** | QA |
| **Date Reported** | 2026-01-18 |
| **Status** | Open |

---

## Description

The left sidebar (artifact list panel) does not use a proper fixed-width sidebar layout. The entire width of the screen is not being utilized effectively. Expected a proper sidebar component with fixed width on the left and flexible main content area.

---

## Steps to Reproduce

1. Open the TeamSpec Viewer application
2. Select any role (BA, FA, DEV, SA, or QA)
3. View the dashboard layout
4. Observe the left panel and overall layout structure

---

## Expected Result

**Feature-Increment Reference:** fi-TSV-010, AC-1 (Full viewport responsive layout)

The dashboard should use the full viewport width with:
- A fixed-width sidebar (300-320px) for the artifact list
- A flexible main content area that uses remaining width
- No wasted horizontal space

---

## Actual Result

The sidebar/artifact list does not appear as a proper fixed sidebar. The full screen width is not being utilized effectively. Layout appears constrained rather than full-width.

---

## Evidence

- [x] Screenshot attached (user provided - shows narrow layout with unused space)

---

## Bug Classification (MANDATORY)

- [x] **Implementation Defect** — Code doesn't match the Feature-Increment specification
- [ ] **Feature Canon Wrong** — Canon doesn't match business intent
- [ ] **Undocumented Behavior** — Neither Canon nor FI covers this case

### Justification

The dev plan dp-e011-s001 specified CSS Grid with columns like `gridTemplateColumns: { md: '300px 1fr' }` for proper sidebar layout. The current implementation doesn't achieve this.

---

## Technical Analysis

The dashboards still use Container with maxWidth constraints rather than the full-viewport grid layout specified in dp-e011-s001. Need to:
1. Remove Container maxWidth constraints
2. Implement proper CSS Grid layout with fixed sidebar column
3. Apply DashboardLayout wrapper component as planned

---

## Resolution

| Field | Value |
| :--- | :--- |
| **Assigned To** | DEV |
| **Fix Version** | — |
| **Resolution Date** | — |
| **Root Cause** | DashboardLayout component not implemented/applied |
