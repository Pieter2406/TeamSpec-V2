---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "TA increments not shown"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-{project-id}-{NNN}"
filename_pattern: "bug-{project-id}-{NNN}-{description}.md"

# === Required Relationships ===
links_required:
  - type: project
    pattern: "project.yml"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - defect
  - issue
  - error
  - problem
  - regression
aliases:
  - defect report
  - issue report
anti_keywords:
  - feature request
  - enhancement
  - story

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  classification_required: true
  required_sections:
    - Description
    - Steps to Reproduce
    - Bug Classification
  optional_sections:
    - Screenshots
    - Logs
---

# Bug Report: `bug-teamspecviewermvp-012-dev-missing-ta-increments`

> **Template Version**: 4.0
> **Last Updated**: 2026-01-11

---

**Document Owner:** QA (QA Engineer)
**Artifact Type:** Bug Report (Project-scoped)
**Lifecycle:** Open → Resolved → Closed

---

## Metadata

| Field | Value |
| :--- | :--- |
| **Bug ID** | bug-teamspecviewermvp-012 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Dev |
| **Version** | {TBD} |
| **Reporter** | QA |
| **Date Reported** | 2026-01-18 |
| **Status** | Open |

---

## Description

Developer dashboard does not show or link Technical Architecture increments (TAI); increments are absent from lists and tree views.

---

## Steps to Reproduce

1. Open the application (Dev environment).
2. Select DEV role and load the Developer dashboard.
3. Look for Technical Architecture increments (TAI) in lists/treeviews.

---

## Expected Result

Technical Architecture increments should be listed and linked in the Developer dashboard for navigation.

**Feature Canon Reference:** {TBD}

---

## Actual Result

TA increments are not shown or linked anywhere in the Developer dashboard.

---

## Evidence

- [ ] Screenshot attached
- [ ] Console logs attached
- [ ] Network trace attached

---

## Bug Classification (MANDATORY)

> ⚠️ Select **exactly ONE** classification. This determines who fixes what.

### [x] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

- **Evidence:** TAI artifacts exist but are not surfaced in the Developer dashboard.
- **Fix:** DEV fixes code to match Canon
- **Canon Update:** Not required

### [ ] Feature Canon Wrong

### [ ] Undocumented Behavior

---

## Classification Decision Tree

```
Is the behavior documented in Feature Canon?
├── YES → Does code match Canon?
│   ├── YES → Not a bug (or Canon is wrong → "Feature Canon Wrong")
│   └── NO → "Implementation Defect"
└── NO → "Undocumented Behavior"
```

---

## Resolution Actions by Classification

| Classification | Who Fixes | Action |
|----------------|-----------|--------|
| Implementation Defect | DEV | Surface TAI artifacts in Developer dashboard |
| Feature Canon Wrong | FA | Update Canon, then DEV aligns |
| Undocumented Behavior | FA/BA → DEV | Clarify intent, update Canon, implement |

---

### Sources Consulted
- products/teamspec-viewer/product.yml → product metadata
- projects/teamspecviewermvp/project.yml → project metadata
- templates/bug-report-template.md → bug format

### Unresolved Items
- Feature Canon section defining TAI display in Developer dashboard → {TBD}
- Build/version identifier → {TBD}
