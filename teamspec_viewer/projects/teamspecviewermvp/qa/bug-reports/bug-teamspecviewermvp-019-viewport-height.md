---
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Full viewport height not used"
---

# Bug Report: `bug-teamspecviewermvp-019-viewport-height`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | bug-teamspecviewermvp-019 |
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

The dashboard content does not fill the entire viewport height. There is visible unused space at the bottom of the screen, with the page background showing through.

---

## Steps to Reproduce

1. Open the TeamSpec Viewer application
2. Select any role (BA, FA, DEV, SA, or QA)
3. View the dashboard with minimal content
4. Observe the bottom of the viewport

---

## Expected Result

**Feature-Increment Reference:** fi-TSV-010, AC-1 Scenario 3

"Given a user viewing a dashboard, When content is shorter than viewport height, Then the dashboard container fills the remaining viewport height (no visible page background)"

The dashboard should expand to fill 100% of the viewport height.

---

## Actual Result

The dashboard content ends before the bottom of the viewport. The page background is visible below the dashboard content area.

---

## Evidence

- [x] Screenshot attached (user provided - shows content not filling height)

---

## Bug Classification (MANDATORY)

- [x] **Implementation Defect** — Code doesn't match the Feature-Increment specification
- [ ] **Feature Canon Wrong** — Canon doesn't match business intent
- [ ] **Undocumented Behavior** — Neither Canon nor FI covers this case

### Justification

The FI specifies full viewport height usage. The dev plan specified using `minHeight: 100vh` and `flex: 1` but this isn't being applied correctly to dashboard content areas.

---

## Technical Analysis

The App.tsx has `minHeight: 100vh` on the root container, but:
1. Dashboard components may have fixed heights
2. The main content area may not be using `flex: 1` properly
3. Individual dashboard content areas may not expand to fill available space
4. The footer added may be affecting height calculation

Fix requires:
1. Ensure dashboard content areas use `flex: 1` or `minHeight` to fill available space
2. Check that Grid containers inside dashboards expand properly

---

## Resolution

| Field | Value |
| :--- | :--- |
| **Assigned To** | DEV |
| **Fix Version** | — |
| **Resolution Date** | — |
| **Root Cause** | Dashboard components not expanding to fill available height |
