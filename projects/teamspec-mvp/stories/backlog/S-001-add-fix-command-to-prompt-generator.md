# S-001: Add Fix Command to Prompt Generator

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
| **Story ID** | S-001 |
| **Status** | Backlog |
| **Estimate** | 2 |
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

---

## User Story

**As a** Developer using TeamSpec,  
**I want** a `ts:fix` command available in Copilot Chat,  
**So that** I can automatically fix linter errors without manual intervention.

---

## Before (Current State):

Reference: [F-007](../../features/F-007-auto-fix-agent-command.md)

- `AGENT_FIX.md` exists in `.teamspec/agents/` after init
- No prompt file generates for the fix command
- Users cannot invoke `/ts:fix` in Copilot Chat
- Fix agent is not accessible through the standard command interface

---

## After (Delta):

- **New:** `fix` command added to COMMANDS object in `prompt-generator.js`
- **New:** `fix.prompt.md` generated in `.github/prompts/` during init/update
- **New:** Prompt links to `../../.teamspec/agents/AGENT_FIX.md`
- **New:** Command name: `ts:fix`
- **New:** Description: "Auto-fix linter errors"

---

## Acceptance Criteria

- [x] **AC1:** Running `teamspec init` generates `fix.prompt.md` in `.github/prompts/`
- [x] **AC2:** Running `teamspec update` regenerates `fix.prompt.md`
- [x] **AC3:** `fix.prompt.md` has correct frontmatter (name: "ts:fix", description, agent: "agent")
- [x] **AC4:** Prompt file links to `../../.teamspec/agents/AGENT_FIX.md`
- [x] **AC5:** Unit tests pass for fix command generation

---

## Technical Notes

_For DEV reference only—not part of functional spec._

- Add to `COMMANDS` object under new `utility` role or standalone
- Follow existing prompt pattern (minimal prompt linking to agent)
- Agent file: `AGENT_FIX.md`

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
