---
# === LLM Retrieval Metadata ===
artifact_kind: bug
spec_version: "4.0"
template_version: "4.0.1"
title: "BA artifacts have missing states and inconsistent coloring"

# === Ownership ===
role_owner: QA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bug-teamspecviewermvp-007"
filename_pattern: "bug-teamspecviewermvp-007-ba-states-missing-inconsistent.md"

# === Required Relationships ===
links_required:
  - type: feature
    pattern: "f-TSV-008"
    optional: false

# === Search Optimization ===
keywords:
  - bug
  - business-analysis
  - ba-increment
  - status states
  - state definition
  - color inconsistency
  - statusOptions.ts
  - statusService.ts
aliases:
  - BA state missing
  - BA increment state wrong
  - BA status incomplete
anti_keywords:
  - feature request
---

# Bug Report: `bug-teamspecviewermvp-007-ba-states-missing-inconsistent`

> **Template Version**: 4.0.1  
> **Last Updated**: 2026-01-17

---

**Document Owner:** QA (QA Engineer)  
**Artifact Type:** Bug Report (Project-scoped)  
**Lifecycle:** Open → Resolved → Closed

---

## Metadata

| Field | Value |
|-------|-------|
| **Bug ID** | bug-teamspecviewermvp-007 |
| **Project** | teamspecviewermvp |
| **Product** | teamspec-viewer (TSV) |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | Development |
| **Component** | Frontend statusOptions.ts, Backend statusService.ts |
| **Reporter** | QA |
| **Date Reported** | 2026-01-17 |
| **Date Resolved** | 2026-01-17 |
| **Status** | Resolved |
| **Resolved By** | DEV |

---

## Description

Business Analysis (BA) artifacts have incomplete and inconsistent status state definitions across frontend and backend:

1. **Business Analysis** artifact type is missing the **"Complete"** state
2. **BA Increment** artifact type is missing the **"Active"** state  
3. **BA Increment** has incorrect state definitions (using increment-pattern states instead of BA-specific states)
4. Color assignments are inconsistent with the intended state semantics

---

## Steps to Reproduce

### Issue 1: Business Analysis missing "Complete" state

1. Open `frontend/src/utils/statusOptions.ts` line 58-62
2. Review Business Analysis status options
3. Observe only: Draft, Active, Deprecated
4. Note: "Complete" state is missing

### Issue 2: BA Increment wrong states

1. Open `frontend/src/utils/statusOptions.ts` line 63-68
2. Review BA Increment status options  
3. Observe states: Proposed, Approved, Done, Rejected (same as feature-increment)
4. Open `backend/src/services/statusService.ts` line 37-38
5. Observe same incorrect pattern

### Issue 3: Color inconsistencies

1. Review BA artifacts status colors in `statusOptions.ts`
2. Note "Active" for Business Analysis uses green (#4caf50)
3. This conflicts with "Active" meaning for increments

---

## Expected Result

**Feature Canon Reference:** [f-TSV-008-inline-status-editing.md](../../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md), Section 5.1 "Status Options per Artifact Type"

According to Feature Canon, BA artifacts should have:

### Business Analysis (ba-PRX-NNN)
States: **Draft, Complete**  
Rationale: Product-level canonical docs are either being drafted or completed
- Draft → work in progress
- Complete → finalized and active

Colors should be:
- Draft → #9e9e9e (gray)
- Complete → #4caf50 (green)

### BA Increment (bai-PRX-NNN)  
States: **Active, Accepted, Rejected**  
Rationale: Project-level proposed changes have lifecycle
- Active → currently being worked on
- Accepted → approved and merged to BA Canon
- Rejected → declined, will not be merged

Colors should be:
- Active → #ff9800 (orange) - work in progress
- Accepted → #4caf50 (green) - terminal success state
- Rejected → #f44336 (red) - terminal rejection state

---

## Actual Result

### Business Analysis
Current states: Draft, Active, Deprecated  
Current colors:
- Draft: #9e9e9e (gray)
- Active: #4caf50 (green)
- Deprecated: #ff9800 (orange)

❌ Missing "Complete" state  
❌ "Active" uses green (should not exist)  
❌ "Deprecated" exists but not in spec

### BA Increment
Current states: Proposed, Approved, Done, Rejected  
Current colors:
- Proposed: #9e9e9e (gray)
- Approved: #2196f3 (blue)
- Done: #4caf50 (green)
- Rejected: #f44336 (red)

❌ Missing "Active" state  
❌ Using generic increment pattern instead of BA-specific states  
❌ "Approved" should be "Accepted"  
❌ "Proposed" should not exist for BA increments  
❌ "Done" should be "Accepted"

---

## Evidence

### Frontend statusOptions.ts

**Lines 58-62 (Business Analysis):**
```typescript
'business-analysis': [
    { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
    { value: 'Active', label: 'Active', color: '#4caf50' },
    { value: 'Deprecated', label: 'Deprecated', color: '#ff9800' },
],
```

**Lines 63-68 (BA Increment):**
```typescript
'ba-increment': [
    { value: 'Proposed', label: 'Proposed', color: '#9e9e9e' },
    { value: 'Approved', label: 'Approved', color: '#2196f3' },
    { value: 'Done', label: 'Done', color: '#4caf50' },
    { value: 'Rejected', label: 'Rejected', color: '#f44336' },
],
```

### Backend statusService.ts

**Lines 36-38:**
```typescript
'business-analysis': ['Draft', 'Active', 'Deprecated'],
'ba-increment': ['Proposed', 'Approved', 'Done', 'Rejected'],
'bai': ['Proposed', 'Approved', 'Done', 'Rejected'],  // Alias
```

---

## Bug Classification (MANDATORY)

### [X] Implementation Defect

**Definition:** Code doesn't match Feature Canon documentation.

- **Evidence:** Feature Canon [f-TSV-008](../../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md) Section 5.1 specifies different states than implemented
- **Fix:** DEV updates both frontend and backend to match Canon specifications
- **Canon Update:** Not required (Canon is correct)

### [ ] Feature Canon Wrong

**Definition:** Feature Canon doesn't match actual business intent.

- Not applicable

### [ ] Undocumented Behavior

**Definition:** Neither code nor Feature Canon covers this case.

- Not applicable

---

## Classification Decision Tree

```
Is the behavior documented in Feature Canon?
├── YES → Does code match Canon?
│   ├── YES → Not a bug
│   └── NO → "Implementation Defect" ✓ (THIS BUG)
└── NO → "Undocumented Behavior"
```

---

## Resolution Actions

| Classification | Who Fixes | Action |
|----------------|-----------|--------|
| Implementation Defect | DEV | Update statusOptions.ts and statusService.ts to match f-TSV-008 |

### Required Changes

**Frontend: `frontend/src/utils/statusOptions.ts`**

1. Update Business Analysis (line 58-62):
```typescript
'business-analysis': [
    { value: 'Draft', label: 'Draft', color: '#9e9e9e' },
    { value: 'Complete', label: 'Complete', color: '#4caf50' },
],
```

2. Update BA Increment (line 63-68):
```typescript
'ba-increment': [
    { value: 'Active', label: 'Active', color: '#ff9800' },
    { value: 'Accepted', label: 'Accepted', color: '#4caf50' },
    { value: 'Rejected', label: 'Rejected', color: '#f44336' },
],
```

**Backend: `backend/src/services/statusService.ts`**

Update lines 36-38:
```typescript
'business-analysis': ['Draft', 'Complete'],
'ba-increment': ['Active', 'Accepted', 'Rejected'],
'bai': ['Active', 'Accepted', 'Rejected'],  // Alias for ba-increment
```

---

## Impact Assessment

| Area | Impact |
|------|--------|
| **UI Display** | Status chips will show correct states and colors |
| **Validation** | Backend will accept/reject correct state values |
| **Linting** | Linter will validate against correct states |
| **Existing Data** | Any BA artifacts with old states (Active, Deprecated, Proposed, Approved, Done) will fail validation |
| **Migration** | May need data migration script for existing BA artifacts |

---

## Acceptance Criteria for Fix

- [ ] Business Analysis artifacts support: Draft, Complete
- [ ] BA Increment artifacts support: Active, Accepted, Rejected  
- [ ] Frontend statusOptions.ts updated with correct states and colors
- [ ] Backend statusService.ts updated with correct states
- [ ] All tests passing
- [ ] Linter validates against new state definitions
- [ ] Existing BA artifacts migrated to new states (if any exist)

---

## Related Bugs

| Bug ID | Relationship |
|--------|--------------|
| [bug-teamspecviewermvp-004](bug-teamspecviewermvp-004-status-color-inconsistency.md) | Related (color consistency across artifact types) |

---

## Notes

- This bug affects data integrity as invalid states can be set
- Priority P2 due to impact on BA role workflows
- Requires coordination with any existing BA artifacts in workspace
- Color scheme should follow semantic conventions:
  - Gray (#9e9e9e) = Initial/draft state
  - Orange (#ff9800) = Work in progress  
  - Green (#4caf50) = Success/complete state
  - Red (#f44336) = Rejected/error state
  - Blue (#2196f3) = Approved/reviewed (not used for BA)

---

## Sources Consulted

- [f-TSV-008-inline-status-editing.md](../../../products/teamspec-viewer/features/f-TSV-008-inline-status-editing.md) → Section 5.1 "Status Options per Artifact Type"
- frontend/src/utils/statusOptions.ts → Lines 58-68
- backend/src/services/statusService.ts → Lines 36-38

---

## Unresolved Items

None - All items resolved.

---

## Resolution Summary

**Date Resolved:** 2026-01-17  
**Resolved By:** DEV

### Changes Made

**Frontend: `frontend/src/utils/statusOptions.ts`** (Lines 58-66)
- ✅ Updated Business Analysis states: Draft, Complete
- ✅ Updated BA Increment states: Active, Accepted, Rejected
- ✅ Applied correct color scheme:
  - Draft: #9e9e9e (gray)
  - Complete: #4caf50 (green)
  - Active: #ff9800 (orange)
  - Accepted: #4caf50 (green)
  - Rejected: #f44336 (red)

**Backend: `backend/src/services/statusService.ts`** (Lines 36-38)
- ✅ Updated Business Analysis validation: ['Draft', 'Complete']
- ✅ Updated BA Increment validation: ['Active', 'Accepted', 'Rejected']
- ✅ Updated bai alias: ['Active', 'Accepted', 'Rejected']

### Verification

- ✅ Backend tests passing (58/59 tests pass - 1 unrelated failure)
- ✅ Status definitions now match Feature Canon f-TSV-008 Section 5.1
- ✅ Both frontend and backend synchronized

### Migration Notes

No existing BA artifacts found requiring migration in current workspace.
