# F-005: Custom Definition of Ready

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
| **Feature ID** | F-005 |
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
| Business Rules | [x] | BR-005 format |
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

Enable teams to customize their Definition of Ready (DoR)—the criteria a story must meet before development can begin—so that the linter validates stories against the team's actual readiness standards rather than generic defaults.

---

## Business Value

> **Owner:** BA (Business Analyst)

- **User Impact**: Stories are validated against team's real readiness criteria; clearer handoff from FA to DEV
- **Business Impact**: Reduces development rework from incomplete stories; improves sprint predictability
- **Success Metrics**: 
  - Stories meeting DoR before sprint > 95%
  - Development rework from incomplete stories reduced by 70%
  - Sprint commitment accuracy improved by 30%

---

## In Scope

> **Owner:** BA (Business Analyst)

- [x] Custom DoR item definition
- [x] DoR item categorization (required vs. recommended)
- [x] Predefined DoR templates (startup, enterprise, regulated)
- [x] Custom DoR from scratch
- [x] Linter validation of stories against DoR
- [x] DoR checklist in story templates
- [x] DoR compliance reporting

---

## Out of Scope

> **Owner:** BA (Business Analyst)

- [ ] Automatic DoR satisfaction detection
- [ ] DoR item auto-completion
- [ ] DoR enforcement blocking story creation
- [ ] Per-story DoR customization
- [ ] DoR versioning/history

---

## Actors / Personas

> **Owner:** BA (Business Analyst)

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Scrum Master | Facilitates team process | Define and enforce readiness standards |
| Functional Analyst | Prepares stories for development | Know exactly what makes a story "ready" |
| Developer | Receives stories for implementation | Confidence that stories are complete |
| TeamSpec Linter | Validation engine | Validate stories against custom DoR |

---

## Current Behavior

> **Owner:** FA (Functional Analyst)
> 
> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### DoR Configuration

_To be defined by FA when implementation begins._

### Linter Validation

_To be defined by FA when implementation begins._

### Story Template Integration

_To be defined by FA when implementation begins._

---

## Business Rules

> **Owner:** FA (Functional Analyst)

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-005-001 | At least 3 DoR items must be defined | Configuration |
| BR-005-002 | Required items must be satisfied for story to be "ready" | Validation |
| BR-005-003 | Recommended items generate warnings, not errors | Linting |
| BR-005-004 | Story in `ready-for-development/` must pass DoR validation | Workflow |
| BR-005-005 | DoR items must be actionable and verifiable | Configuration |

---

## Edge Cases

> **Owner:** FA (Functional Analyst)

| Scenario | Expected Behavior |
|----------|------------------|
| Fewer than 3 DoR items | Lint error; block configuration |
| Empty DoR item text | Lint error; item must have content |
| Story missing DoR checklist | Add default checklist during lint fix |
| DoR item marked both required and recommended | Treat as required; log warning |
| Legacy story without DoR section | Skip validation; recommend update |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| Any team member | View DoR |
| Scrum Master | Edit DoR |
| Functional Analyst | Edit DoR |

---

## Non-Functional Notes

- **Performance**: DoR validation < 100ms per story
- **Security**: No sensitive data in DoR config
- **Accessibility**: CLI DoR management accessible
- **Availability**: Offline-capable (local file)

---

## Non-Goals

> **Owner:** BA (Business Analyst)

- **Blocking enforcement**: DoR validation warns, does not block file creation
- **Automatic satisfaction**: No automatic checking of external systems
- **Story modification**: DoR validation is read-only, does not modify stories

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | Should DoR be different for different story types (feature, bug, spike)? | BA | Open | — |
| Q-002 | Should linter error or warn on DoR failures? | FA | Open | — |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| F-001 | DoR may reference team workflow preferences |
| F-006 | DoR and DoD are complementary quality gates |

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
