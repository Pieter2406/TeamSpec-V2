---
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "BA Increment title not shown"
---

# Bug Report: `bug-teamspecviewermvp-020-bai-title-missing`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | bug-teamspecviewermvp-020 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Dev |
| **Version** | Current |
| **Reporter** | QA |
| **Date Reported** | 2026-01-18 |
| **Status** | Open |

---

## Description

In the BA Dashboard, Business Analysis Increment (BAI) artifacts do not display their human-readable title. The reader header shows the artifact ID pattern but not the descriptive title.

Screenshot shows: "Business Analysis Increment: bai-TSV-001-mvp-ba-fa-holistic-view" with status badge, but no human-readable title like "MVP BA FA Holistic View".

---

## Steps to Reproduce

1. Open the TeamSpec Viewer application
2. Select BA role
3. Expand a Business Analysis document in the tree
4. Click on a Business Analysis Increment (BAI) node
5. Observe the reader panel header

---

## Expected Result

**Feature Reference:** f-TSV-002-role-specific-dashboards

The BAI artifact should display a human-readable title extracted from:
1. Frontmatter `title` field, OR
2. Document heading pattern (e.g., "Business Analysis Increment: bai-TSV-001-mvp-ba-fa-holistic-view" → "MVP BA FA Holistic View")

---

## Actual Result

The BAI title shows only the artifact type and ID pattern. No human-readable description is displayed. The title extraction for BAI artifacts is not working.

---

## Evidence

- [x] Screenshot attached (user provided - shows "Business Analysis Increment: bai-TSV-001-mvp-ba-fa-holistic-view" without readable title)

---

## Bug Classification (MANDATORY)

- [x] **Implementation Defect** — Code doesn't match the Feature-Increment specification
- [ ] **Feature Canon Wrong** — Canon doesn't match business intent
- [ ] **Undocumented Behavior** — Neither Canon nor FI covers this case

### Justification

Title extraction was previously fixed for BA, Feature, Epic, etc. but the "Business Analysis Increment" pattern was not added to the extractTitle regex.

---

## Technical Analysis

The `extractTitle()` function in backend services (artifacts.ts, relationshipService.ts, searchService.ts) has a regex for artifact heading patterns. The pattern needs to include "Business Analysis Increment" as a valid type.

Current pattern likely missing:
- `Business Analysis Increment` → `bai-{PRX}-{NNN}-{description}`

Fix: Add "Business Analysis Increment" to the artifact type alternation in the regex pattern.

---

## Related Bugs

- bug-teamspecviewermvp-010-ba-card-title-missing (similar issue, previously fixed for BA)

---

## Resolution

| Field | Value |
| :--- | :--- |
| **Assigned To** | DEV |
| **Fix Version** | — |
| **Resolution Date** | — |
| **Root Cause** | Missing "Business Analysis Increment" in extractTitle regex |
