---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "FA epics missing titles"

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

# Bug Report: `bug-teamspecviewermvp-011-fa-epic-title-missing`

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
| **Bug ID** | bug-teamspecviewermvp-011 |
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

FA dashboard epic cards do not render epic titles; cards omit the primary title text, so epics cannot be identified by name.

---

## Steps to Reproduce

1. Open the application (Dev environment).
2. Select FA role and load the FA dashboard.
3. Observe epic cards/list entries.

---

## Expected Result

Epic cards should prominently display each epic's title as the main label.

**Feature Canon Reference:** {TBD}

---

## Actual Result

Epic cards render without showing the epic title; primary identifier is missing.

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

- **Evidence:** Epic titles expected as primary identifiers are not displayed on FA cards.
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
| Implementation Defect | DEV | Render epic titles on FA cards |
| Feature Canon Wrong | FA | Update Canon, then DEV aligns |
| Undocumented Behavior | FA/BA → DEV | Clarify intent, update Canon, implement |

---

### Sources Consulted
- products/teamspec-viewer/product.yml → product metadata
- projects/teamspecviewermvp/project.yml → project metadata
- templates/bug-report-template.md → bug format

### Unresolved Items
- Feature Canon section defining epic title display → {TBD}
- Build/version identifier → {TBD}
