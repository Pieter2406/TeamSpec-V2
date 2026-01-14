---
# === LLM Retrieval Metadata ===
artifact_kind: fi
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: FA
artifact_type: Project Execution
canonicality: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "fi-TSV-001"
filename_pattern: "fi-TSV-001-ba-fa-role-dashboards.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-002"
    optional: false
    note: "Target feature that this FI modifies"
  - type: epic
    pattern: "epic-TSV-*"
    optional: true
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - feature increment
  - role dashboard
  - BA
  - FA
  - MVP
aliases:
  - BA/FA dashboards increment
anti_keywords:
  - production truth
  - implementation details
---

# Feature Increment: `fi-TSV-001-ba-fa-role-dashboards`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-14

---

> **ID:** fi-TSV-001  
> **Product:** `teamspec-viewer` (TSV)  
> **Target Feature:** `f-TSV-002-role-specific-dashboards`  
> **Epic:** {TBD}  
> **Status:** proposed

---

## 1. Overview

This increment defines the initial MVP behavior for **role-specific dashboards** by focusing the first delivery slice on **BA and FA** role views.

---

## 2. AS-IS (Current State)

> ⚠️ _Auto-populated from Product Feature. DO NOT EDIT unless correcting errors._

### 2.1 Current Behavior

(Exact copy from `f-TSV-002-role-specific-dashboards` → “Current Behavior”)

### Role Selection

{TBD}

### Role Dashboard Content

{TBD}

### User Flows

1. {TBD}

### Edge Cases & Error Handling

| Condition | System Response |
|-----------|-----------------|
| {TBD} | {TBD} |

### 2.2 Current Limitations

- Current feature canon does not define role dashboard behavior in testable terms yet (`{TBD}`).

---

## 3. TO-BE (Proposed State)

### 3.1 New/Changed Behavior

After this increment is implemented and synced:

- The system provides a role dashboard experience specifically for:
  - **BA**: business analysis documents and BA increments for the selected product/project context.
  - **FA**: features, feature-increments, epics, and stories for the selected product/project context.
- The role dashboard provides navigation entry points into the relevant artifacts.
- The role dashboard does not enforce access control; it is a navigation/reading aid.

### 3.2 Acceptance Criteria

- [ ] AC-1: A user can select the **BA** role and is presented with navigation to BA artifacts (BA documents, BA increments) for `teamspec-viewer` and `teamspecviewermvp`.
- [ ] AC-2: A user can select the **FA** role and is presented with navigation to FA artifacts (features, feature-increments, epics, stories) for `teamspec-viewer` and `teamspecviewermvp`.
- [ ] AC-3: The dashboard does not provide edit capabilities for any artifact (read-only navigation).

### 3.3 Out of Scope

- Dashboards for DEV, QA, SA, SM, DES in this increment.
- Any permissions/authentication behavior.

---

## 4. Impact Analysis

### 4.1 Affected Features

| Feature | Impact Type | Description |
|---------|-------------|-------------|
| f-TSV-002 | Modified | Defines MVP behavior focus for BA/FA dashboards |
| f-TSV-001 | Referenced | Portfolio/product context used for navigation |
| f-TSV-003 | Referenced | FI navigation linked from FA dashboard |
| f-TSV-004 | Referenced | Epic/story navigation linked from FA dashboard |
| f-TSV-007 | Referenced | Search may be used from dashboards |

### 4.2 Dependencies

- BA artifacts exist for `teamspec-viewer` (e.g., `ba-TSV-001`, `bai-TSV-001`).
- FA artifacts exist for `teamspec-viewer` (e.g., `f-TSV-001..007`).

### 4.3 Risks

- Risk: Role-to-artifact mapping is not yet finalized across all roles → Mitigation: scope this increment strictly to BA and FA.

---

## 5. Implementation Notes

### 5.1 Technical Considerations

{TBD}

### 5.2 Testing Strategy

{TBD}

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-14 | {TBD} | Initial draft |

---

## Sources Consulted

- teamspec_viewer/products/teamspec-viewer/features/f-TSV-002-role-specific-dashboards.md → “Current Behavior” (AS-IS source)
- teamspec_viewer/projects/teamspecviewermvp/business-analysis-increments/bai-TSV-001-mvp-ba-fa-holistic-view.md → Section 4.1 (BA+FA MVP focus)

## Unresolved Items

- Epic assignment for this FI → {TBD} (no epic created yet)
- Technical and testing notes → {TBD} (awaiting SA/DEV/QA input)
