# S-002: Add Fix Command to README Index

<!-- TEAMSPEC RULE: TS-STORY-002 -->
<!-- 
  ⚠️ STORIES ARE DELTAS, NOT DOCUMENTATION
  
  This story describes a CHANGE to the Feature Canon.
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-08

---

## Metadata

| Field | Value |
|-------|-------|
| **Story ID** | S-002 |
| **Status** | Backlog |
| **Estimate** | 1 |
| **Author** | FA |
| **Sprint** | — |

**Document Owner:** FA (Functional Analyst)  
**Artifact Type:** Execution (Delta to Feature Canon)

---

## Feature Link

| Field | Value |
|-------|-------|
| **Feature** | [F-007: Auto-Fix Agent Command](../../features/F-007-auto-fix-agent-command.md) |
| **Impact Type** | Adds Behavior |
| **Depends On** | [S-001](./S-001-add-fix-command-to-prompt-generator.md) |

---

## User Story

**As a** Developer using TeamSpec,  
**I want** the fix command listed in the README.md index,  
**So that** I can discover the command when browsing available prompts.

---

## Before (Current State):

Reference: [F-007](../../features/F-007-auto-fix-agent-command.md)

- README.md generated with sections: Business Analyst, Functional Analyst, Solution Architect, Developer, QA Engineer, Scrum Master
- No "Utility" or "Fix" section exists
- Fix command not discoverable through README

---

## After (Delta):

- **New:** README.md includes "Utility Commands" section
- **New:** Fix command listed with description: "Auto-fix linter errors"
- **New:** Command reference: `/ts:fix`

---

## Acceptance Criteria

- [x] **AC1:** Generated README.md includes "Utility" section
- [x] **AC2:** Fix command appears in Utility section with correct name (`ts:fix`)
- [x] **AC3:** Fix command has description "Auto-fix linter errors"
- [x] **AC4:** Unit tests verify README includes fix command

---

## Technical Notes

_For DEV reference only—not part of functional spec._

- Update `generateReadme()` function in `prompt-generator.js`
- Add new section after Scrum Master commands
- Follow existing section formatting pattern

---

## Definition of Ready Checklist

- [x] Linked to Feature Canon (F-007)
- [x] Before/After delta clearly described
- [x] Acceptance Criteria are testable
- [x] All content complete (no gaps)
- [x] Estimate assigned

---

## Definition of Done Checklist

- [ ] All AC verified
- [ ] Code reviewed and merged
- [ ] Tests passing
- [ ] Feature Canon updated (if behavior changed)
- [ ] Documentation updated
