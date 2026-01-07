# F-007: Auto-Fix Agent Command

<!-- 
  ⚠️ FEATURE CANON RULES
  
  This Feature file is the SOURCE OF TRUTH for system behavior.
  
  RULES:
  1. Implementation-agnostic (describe WHAT, not HOW)
  2. No technical implementation details
  3. Business rules use BR-XXX format
  4. Change Log is append-only
-->

> **Template Version**: 2.0  
> **Last Updated**: 2026-01-08

---

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | F-007 |
| **Status** | Planned |
| **Owner** | BA: Business Analyst |
| **Created** | 2026-01-08 |
| **Last Updated** | 2026-01-08 |
| **Epic** | — (Standalone feature) |

**Document Ownership:**
- **BA owns:** Purpose, Business Value, Scope (In/Out)
- **FA owns:** Current Behavior, Business Rules, Edge Cases

---

## Section Checklist

| Section | Status | Notes |
|---------|--------|-------|
| Purpose | [x] | Why this feature exists |
| Business Value | [x] | Impact and success metrics |
| Scope (In) | [x] | What's included |
| Scope (Out) | [x] | What's excluded |
| Actors/Personas | [x] | Who uses it |
| Current Behavior | [ ] | FA to complete |
| Business Rules | [x] | BR-007 format |
| Edge Cases | [ ] | FA to complete |
| Non-Goals | [x] | Explicitly excluded capabilities |
| Change Log | [x] | Story references |

---

## Governing Decisions

| Decision ID | Summary | Impact on This Feature |
|-------------|---------|------------------------|
| — | No decisions logged yet | — |

---

## Purpose

> **Owner:** BA (Business Analyst)

Ship the AGENT_FIX agent as a prompt command (`ts:fix`) when teams initialize or update TeamSpec, enabling automatic resolution of linter errors through Copilot Chat without manual intervention.

---

## Business Value

> **Owner:** BA (Business Analyst)

- **User Impact**: Teams can fix linter errors with a single command; reduces cognitive load of understanding error messages
- **Business Impact**: Faster compliance with TeamSpec standards; reduced friction in adoption
- **Success Metrics**: 
  - Linter error resolution time < 1 minute (from 5+ minutes manual)
  - Fix success rate > 90%
  - User satisfaction with auto-fix > 8/10

---

## In Scope

> **Owner:** BA (Business Analyst)

- [x] Generate `fix.prompt.md` during `teamspec init`
- [x] Generate `fix.prompt.md` during `teamspec update`
- [x] Prompt links to `AGENT_FIX.md` for detailed instructions
- [x] Include fix command in README.md command index
- [x] Works with existing linter output
- [x] Supports all linter rule categories (TS-PROJ, TS-FEAT, TS-STORY, TS-ADR, TS-DEVPLAN, TS-DOD, TS-NAMING)

---

## Out of Scope

> **Owner:** BA (Business Analyst)

- [ ] Automatic fix without user invocation
- [ ] CI/CD integration for auto-fix
- [ ] Fix suggestions in IDE inline (underlines, quick fixes)
- [ ] Batch fixing across multiple projects
- [ ] Undo/rollback of applied fixes

---

## Actors / Personas

> **Owner:** BA (Business Analyst)

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Developer | Team member encountering linter errors | Fix errors quickly without reading documentation |
| Team Lead | Responsible for team compliance | Ensure standards are met with minimal friction |
| Functional Analyst | Creates stories and features | Fix structural issues in artifacts |
| AGENT_FIX | AI agent executing fixes | Apply correct fixes based on linter output |

---

## Current Behavior

> **Owner:** FA (Functional Analyst)
> 
> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### Prompt Generation

_To be defined by FA when implementation begins._

### Fix Execution Flow

_To be defined by FA when implementation begins._

### Linter Integration

_To be defined by FA when implementation begins._

---

## Business Rules

> **Owner:** FA (Functional Analyst)

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-007-001 | Fix prompt must be generated during init for supported IDEs | teamspec init |
| BR-007-002 | Fix prompt must be updated during update for supported IDEs | teamspec update |
| BR-007-003 | Fix prompt must link to AGENT_FIX.md | Always |
| BR-007-004 | User must run linter before fix can be applied | Fix invocation |
| BR-007-005 | Fix must not modify files without user confirmation in chat | Safety |
| BR-007-006 | Fix command must appear in README.md index | Documentation |

---

## Edge Cases

> **Owner:** FA (Functional Analyst)

| Scenario | Expected Behavior |
|----------|------------------|
| No linter errors exist | Agent reports "No issues to fix" |
| Linter not run before fix | Agent instructs user to run linter first |
| Multiple errors in same file | Fix in priority order per AGENT_FIX rules |
| Fix requires business judgment | Escalate to human; do not auto-fix |
| Fix would delete content | Stop and ask for confirmation |
| Cross-reference update needed | Update all references when renaming files |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| Any team member | Invoke fix command |
| Any team member | View fix results |
| File system | Write access for fixes |

---

## Non-Functional Notes

- **Performance**: Fix prompt generation < 100ms
- **Security**: No remote execution; all fixes are local
- **Accessibility**: CLI fix command accessible
- **Availability**: Offline-capable (local files only)

---

## Non-Goals

> **Owner:** BA (Business Analyst)

- **Automatic execution**: Fix requires explicit user invocation
- **Perfect accuracy**: Some fixes may require manual adjustment
- **Cross-project fixes**: One project at a time

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | Should fix command require linter to be run first? | FA | Resolved | Yes, linter output needed |
| Q-002 | Should fix show preview before applying? | FA | Open | — |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| F-005 | Fix can resolve DoR validation errors |
| F-006 | Fix can resolve DoD validation errors |

---

## Change Log

| Date | Story ID | Change Summary | Author |
|------|----------|----------------|--------|
| 2026-01-08 | — | Initial feature creation | BA |

---

## Story Ledger Reference

See [story-ledger.md](./story-ledger.md) for the complete history.

**Last Story:** —  
**Last Update:** 2026-01-08

---

## Implementation References

_Links to code, APIs, or technical documentation. Maintained by DEV._

- **Agent File**: `.teamspec/agents/AGENT_FIX.md`
- **Prompt File**: `.github/prompts/fix.prompt.md`
- **Linter**: `cli/lib/linter.js`
