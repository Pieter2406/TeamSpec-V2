# F-006: Custom Definition of Done

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
| **Feature ID** | F-006 |
| **Status** | Planned |
| **Owner** | BA: Business Analyst |
| **Created** | 2026-01-08 |
| **Last Updated** | 2026-01-08 |
| **Epic** | [EPIC-001](../epics/EPIC-001-team-specific-configuration.md) |

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
| Business Rules | [x] | BR-006 format |
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

Enable teams to customize their Definition of Done (DoD)—the criteria a story must meet to be considered complete—so that the linter validates story completion against the team's actual standards and ensures Feature Canon is updated when behavior changes.

---

## Business Value

> **Owner:** BA (Business Analyst)

- **User Impact**: Clear completion criteria; Feature Canon stays current; consistent quality
- **Business Impact**: Reduces incomplete work; ensures documentation stays in sync with implementation
- **Success Metrics**: 
  - Feature Canon sync compliance > 98%
  - Stories meeting DoD before closure > 100%
  - Documentation drift eliminated

---

## In Scope

> **Owner:** BA (Business Analyst)

- [x] Custom DoD item definition
- [x] DoD item categorization (required vs. recommended)
- [x] Predefined DoD templates (startup, enterprise, regulated)
- [x] Custom DoD from scratch
- [x] Linter validation of story completion against DoD
- [x] Feature Canon sync requirement (TS-DOD-001)
- [x] DoD checklist in story templates
- [x] DoD compliance reporting

---

## Out of Scope

> **Owner:** BA (Business Analyst)

- [ ] Automatic DoD satisfaction detection
- [ ] DoD item auto-completion
- [ ] CI/CD integration for DoD enforcement
- [ ] Per-story DoD customization
- [ ] DoD versioning/history

---

## Actors / Personas

> **Owner:** BA (Business Analyst)

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Scrum Master | Facilitates team process | Define and enforce completion standards |
| Developer | Completes stories | Know exactly what "done" means |
| Functional Analyst | Maintains Feature Canon | Ensure Canon is updated when behavior changes |
| TeamSpec Linter | Validation engine | Validate completion against custom DoD |

---

## Current Behavior

> **Owner:** FA (Functional Analyst)
> 
> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### DoD Configuration

_To be defined by FA when implementation begins._

### Linter Validation

_To be defined by FA when implementation begins._

### Feature Canon Sync

_To be defined by FA when implementation begins._

---

## Business Rules

> **Owner:** FA (Functional Analyst)

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-006-001 | At least 3 DoD items must be defined | Configuration |
| BR-006-002 | Required items must be satisfied for story to be "done" | Validation |
| BR-006-003 | Feature Canon update is always required if behavior changed | Completion |
| BR-006-004 | Recommended items generate warnings, not errors | Linting |
| BR-006-005 | DoD items must be actionable and verifiable | Configuration |
| BR-006-006 | Story marked done must pass DoD validation | Workflow |

---

## Edge Cases

> **Owner:** FA (Functional Analyst)

| Scenario | Expected Behavior |
|----------|------------------|
| Fewer than 3 DoD items | Lint error; block configuration |
| Empty DoD item text | Lint error; item must have content |
| Story marked done without DoD | Block closure; require DoD completion |
| Feature Canon not updated after behavior change | Lint blocker (TS-DOD-001) |
| Legacy story without DoD section | Skip validation; recommend update |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| Any team member | View DoD |
| Scrum Master | Edit DoD |
| Engineering Manager | Edit DoD |

---

## Non-Functional Notes

- **Performance**: DoD validation < 100ms per story
- **Security**: No sensitive data in DoD config
- **Accessibility**: CLI DoD management accessible
- **Availability**: Offline-capable (local file)

---

## Non-Goals

> **Owner:** BA (Business Analyst)

- **Blocking enforcement**: DoD validation warns, does not block story closure
- **Automatic satisfaction**: No automatic checking of external systems (CI, PR status)
- **Story modification**: DoD validation is read-only, does not modify stories

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | Should DoD be different for different story types (feature, bug, spike)? | BA | Open | — |
| Q-002 | Should Feature Canon sync be detectable automatically? | FA | Open | — |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| F-003 | DoD may include branch merge requirements |
| F-004 | DoD includes testing completion from testing strategy |
| F-005 | DoR and DoD are complementary quality gates |

---

## Change Log

| Date | Story ID | Change Summary | Author |
|------|----------|----------------|--------|
| 2026-01-08 | — | Initial feature creation from EPIC-001 | BA |

---

## Story Ledger Reference

See [story-ledger.md](./story-ledger.md) for the complete history.

**Last Story:** —  
**Last Update:** 2026-01-08

---

## Implementation References

_Links to code, APIs, or technical documentation. Maintained by DEV._

- **Primary Service**: TBD
- **API Documentation**: TBD
- **Database Schema**: N/A (file-based configuration)
