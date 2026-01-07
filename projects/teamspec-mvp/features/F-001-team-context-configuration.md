# F-001: Team Context Configuration

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
| **Feature ID** | F-001 |
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
| Business Rules | [x] | BR-001 format |
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

Enable teams to define their organizational context—team name, size, structure, roles, and workflow preferences—so that TeamSpec adapts to match how the team actually operates rather than requiring the team to adapt to TeamSpec.

---

## Business Value

> **Owner:** BA (Business Analyst)

- **User Impact**: Teams see their own terminology and structure reflected in all TeamSpec artifacts, reducing cognitive friction and improving adoption
- **Business Impact**: Unlocks enterprise adoption where teams have established structures; reduces training costs by 50%+
- **Success Metrics**: 
  - Onboarding time < 30 minutes (from 2+ hours)
  - Team recognition rate > 90% ("this feels like our team")
  - Adoption rate increase from 0% to 80%+ in pilot organizations

---

## In Scope

> **Owner:** BA (Business Analyst)

- [x] Team name and description configuration
- [x] Team size and structure definition
- [x] Role mapping (map team titles to TeamSpec roles)
- [x] Location/timezone configuration
- [x] Workflow preference selection (sprint-based, Kanban, hybrid)
- [x] Configuration persistence in `.teamspec/config.yml`
- [x] Interactive configuration wizard during `teamspec init`
- [x] Agent prompts use team context

---

## Out of Scope

> **Owner:** BA (Business Analyst)

- [ ] User authentication/authorization (no login required)
- [ ] Multi-team management (one config per workspace)
- [ ] Real-time team presence/status
- [ ] Integration with HR systems
- [ ] Automatic role detection from Git history

---

## Actors / Personas

> **Owner:** BA (Business Analyst)

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| Team Lead | Person responsible for team structure and process | Configure TeamSpec to match team reality |
| Engineering Manager | Oversees multiple teams or team standards | Ensure consistent configuration across teams |
| New Team Member | Just joined the team, learning TeamSpec | See familiar terminology and structure |
| TeamSpec Agent | AI assistant using team context | Generate contextually appropriate suggestions |

---

## Current Behavior

> **Owner:** FA (Functional Analyst)
> 
> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### Configuration Storage

_To be defined by FA when implementation begins._

### Interactive Setup

_To be defined by FA when implementation begins._

### Agent Context Integration

_To be defined by FA when implementation begins._

---

## Business Rules

> **Owner:** FA (Functional Analyst)

| Rule ID | Rule Description | Applies When |
|---------|------------------|--------------|
| BR-001-001 | Team name must be non-empty string | Always |
| BR-001-002 | Team size must be positive integer | Always |
| BR-001-003 | Role mapping must include at least BA, FA, DEV, QA | Configuration |
| BR-001-004 | Unmapped roles fall back to default TeamSpec roles | Runtime |
| BR-001-005 | Configuration changes require explicit save action | Editing |
| BR-001-006 | Agent prompts must include team context when available | Agent invocation |

---

## Edge Cases

> **Owner:** FA (Functional Analyst)

| Scenario | Expected Behavior |
|----------|------------------|
| Empty team.yml file | Use defaults; warn user during lint |
| Invalid YAML syntax | Fail fast with clear parse error message |
| Missing required fields | Lint error with specific field identification |
| Team name with special characters | Sanitize for display; preserve in config |
| Role not in mapping | Fall back to default TeamSpec role |

---

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| Any team member | View configuration |
| Team Lead | Edit configuration |
| Admin | Reset configuration |

---

## Non-Functional Notes

- **Performance**: Configuration load < 100ms
- **Security**: No sensitive data in config (no credentials, tokens)
- **Accessibility**: CLI must support screen readers
- **Availability**: Offline-capable (local file)

---

## Non-Goals

> **Owner:** BA (Business Analyst)

- **User management**: This feature does not manage individual team members, only team-level configuration
- **Enforcement**: Configuration is informational; enforcement is handled by other features (F-005, F-006)
- **Migration**: No automatic migration from other tools; clean start only

---

## Open Questions

| ID | Question | Owner | Status | Resolution |
|----|----------|-------|--------|------------|
| Q-001 | Should we support multiple team configs per workspace? | BA | Resolved | No, one team per workspace |
| Q-002 | Should role mapping be strict or allow custom roles? | FA | Open | — |

---

## Related Features

| Feature ID | Relationship |
|------------|--------------|
| F-002 | Tech Stack uses team context for defaults |
| F-005 | Custom DoR uses team workflow preference |
| F-006 | Custom DoD uses team workflow preference |

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
