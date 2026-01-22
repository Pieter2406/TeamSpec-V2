---
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "Unnecessary horizontal scrollbar"
---

# Bug Report: `bug-teamspecviewermvp-016-horizontal-scrollbar`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-18

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | bug-teamspecviewermvp-016 |
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

An unnecessary horizontal scrollbar appears on the dashboard view. This indicates content is overflowing the viewport width, which contradicts the full-viewport layout requirements.

---

## Steps to Reproduce

1. Open the TeamSpec Viewer application
2. Select any role (BA, FA, DEV, SA, or QA)
3. View the dashboard
4. Observe the bottom of the browser window

---

## Expected Result

**Feature-Increment Reference:** fi-TSV-010, AC-1 (Full viewport layout)

No horizontal scrollbar should appear. The layout should use CSS that prevents horizontal overflow at all viewport widths.

---

## Actual Result

A horizontal scrollbar appears at the bottom of the viewport, indicating content is wider than the viewport.

---

## Evidence

- [x] Screenshot attached (user provided)

---

## Bug Classification (MANDATORY)

- [x] **Implementation Defect** — Code doesn't match the Feature-Increment specification
- [ ] **Feature Canon Wrong** — Canon doesn't match business intent
- [ ] **Undocumented Behavior** — Neither Canon nor FI covers this case

### Justification

The FI-TSV-010 AC-1 states "No horizontal scrollbar appears and all content is accessible via vertical scroll". The implementation has a layout issue causing overflow.

---

## Technical Analysis

Likely causes:
1. A child element has explicit width exceeding viewport
2. Missing `overflow-x: hidden` on container
3. Padding/margin causing content to exceed 100vw
4. Footer or other element not constrained to viewport width

---

## Resolution

| Field | Value |
| :--- | :--- |
| **Assigned To** | DEV |
| **Fix Version** | — |
| **Resolution Date** | — |
| **Root Cause** | — |
