# Copilot Instructions for TeamSpec 2.0

> **Version:** 2.0  
> **Last Updated:** 2026-01-07  
> **Status:** Active (Primary Repository)

You are an expert Agile assistant working in the **TeamSpec 2.0** repository — the authoritative source for the TeamSpec Feature Canon operating model.

---

## Repository Structure

This is the **primary TeamSpec repository** containing:

```
Teamspec/
├── agents/              # Role-specific agent prompts (BA, FA, DEV, QA, SM, SA, FIX)
├── cli/                 # TeamSpec CLI tool (teamspec init, lint, update)
├── roles/               # Role definitions and responsibilities
├── templates/           # Document templates for all artifact types
├── teamspec_test/       # Test workspace for validating TeamSpec
└── PROJECT_STRUCTURE.yml # Canonical folder structure definition
```

### Related Repositories

| Repository | Status | Purpose |
|------------|--------|---------|
| **Teamspec/** | ✅ Active | Primary TeamSpec 2.0 development |
| **DelenSpec/** | ⚠️ Deprecated | Reference only — original implementation |

> **IMPORTANT:** DelenSpec is deprecated. Use it only as a reference for understanding the original design. All new development happens in Teamspec/.

---

## Core Operating Model

### The Feature Canon Principle

```
The Feature Canon is the SINGLE SOURCE OF TRUTH for all system behavior.
Everything else derives from or references it.
```

### Document Hierarchy

| Level | Artifacts | Owner | Purpose |
|-------|-----------|-------|---------|
| **Source of Truth** | Feature Canon, Decision Log, ADR | BA/FA/SA | Defines WHAT exists |
| **Execution** | Stories, Dev Plans, Test Cases | FA/DEV/QA | Defines WHAT to change |
| **Operational** | Sprints, Status Reports | SM | Tracks progress |

### Story-as-Delta Philosophy

Stories describe **CHANGES** to the Feature Canon:
- **Before:** Reference current Canon behavior
- **After:** Describe the delta (new/changed behavior)
- **Impact:** Which Canon sections are affected

---

## Role Boundaries (STRICT)

| Role | Owns | Does NOT Own |
|------|------|--------------|
| **BA** | Purpose, Value, Scope, Business Decisions | Technical design, Implementation |
| **FA** | Behavior, Flows, Business Rules, Stories | Architecture, Code |
| **SA** | Architecture, ADRs, Technical Decisions | Business requirements |
| **DEV** | Implementation, Dev Plans | Functional requirements |
| **QA** | Test Cases, Bug Reports | Feature definitions |
| **SM** | Sprint Management, Process | Content of deliverables |

---

## Agent System

This repository uses **role-specific agents** located in `/agents/`:

| Agent | File | Purpose |
|-------|------|---------|
| Bootstrap | `AGENT_BOOTSTRAP.md` | Core rules inherited by all agents |
| BA | `AGENT_BA.md` | Business Analysis tasks |
| FA | `AGENT_FA.md` | Functional Analysis tasks |
| SA | `AGENT_SA.md` | Solution Architecture tasks |
| DEV | `AGENT_DEV.md` | Development tasks |
| QA | `AGENT_QA.md` | Quality Assurance tasks |
| SM | `AGENT_SM.md` | Scrum Master tasks |
| DES | `AGENT_DES.md` | Design tasks |
| FIX | `AGENT_FIX.md` | Auto-fix linting errors |

### Using Agents

To invoke an agent's capabilities:
```
ts:agent <role>           # Load role-specific agent
ts:agent fix              # Run linter fix agent
```

---

## Command Reference

### CLI Commands (Terminal)

```bash
teamspec init             # Initialize TeamSpec in a repository
teamspec lint             # Lint all projects against TeamSpec rules
teamspec lint --project X # Lint specific project
teamspec update           # Update TeamSpec core files
```

### Copilot Commands (Chat)

#### Agent Commands
- `ts:agent ba` → Load BA agent from `/agents/AGENT_BA.md`
- `ts:agent fa` → Load FA agent from `/agents/AGENT_FA.md`
- `ts:agent dev` → Load DEV agent from `/agents/AGENT_DEV.md`
- `ts:agent qa` → Load QA agent from `/agents/AGENT_QA.md`
- `ts:agent sm` → Load SM agent from `/agents/AGENT_SM.md`
- `ts:agent sa` → Load SA agent from `/agents/AGENT_SA.md`
- `ts:agent fix` → Load FIX agent, auto-fix lint errors

#### BA Commands (Business Analysis)
- `ts:ba project` → Create/manage project structure
- `ts:ba epic` → Propose epic structure
- `ts:ba feature` → Extract feature from requirements
- `ts:ba decision` → Log business decision
- `ts:ba analysis` → Create business analysis document (process documentation)

#### FA Commands (Functional Analysis)
- `ts:fa story` → Create story in backlog
- `ts:fa slice` → Slice requirements into stories
- `ts:fa refine` → Move story to ready-to-refine
- `ts:fa sync` → Update Feature Canon after story completion

#### DEV Commands (Development)
- `ts:dev plan` → Create dev plan for story
- `ts:dev implement` → Execute implementation
- `ts:dev ready` → Move story to ready-for-development

#### QA Commands (Quality Assurance)
- `ts:qa test` → Design test cases
- `ts:qa dor-check` → Validate Definition of Ready
- `ts:qa dod-check` → Validate Definition of Done

#### SM Commands (Scrum Master)
- `ts:sm sprint create` → Create new sprint
- `ts:sm sprint plan` → Plan sprint backlog
- `ts:sm sprint close` → Close sprint with metrics

#### Universal Commands
- `ts:status` → Project status overview
- `ts:lint` → Run linter (equivalent to `teamspec lint`)
- `ts:fix` → Auto-fix lint errors (invokes AGENT_FIX)

---

## Linting Rules

The TeamSpec linter enforces these rule categories:

| Category | Rules | Severity |
|----------|-------|----------|
| **TS-PROJ** | Project registration, project.yml metadata | ERROR |
| **TS-FEAT** | Feature file existence, required sections, unique IDs | ERROR |
| **TS-STORY** | Feature links, delta format, AC, DoR | ERROR |
| **TS-ADR** | ADR requirements, feature linking | ERROR |
| **TS-DEVPLAN** | Dev plan existence for sprint stories | ERROR |
| **TS-DOD** | Canon sync when behavior changes | BLOCKER |
| **TS-NAMING** | File naming conventions | WARNING |

### Running the Linter

```bash
# From any TeamSpec-enabled workspace:
teamspec lint

# For specific project:
teamspec lint --project acme-webshop
```

### Auto-Fixing Lint Errors

Use the FIX agent to automatically resolve lint errors:
```
ts:agent fix
```

Or manually follow the rules in `/agents/AGENT_FIX.md`.

---

## Project Structure (Canonical)

All TeamSpec projects follow this structure:

```
projects/<project-id>/
├── project.yml              # Project metadata (REQUIRED)
├── README.md                # Project overview
├── features/                # Feature Canon (source of truth)
│   ├── F-001-feature.md
│   ├── features-index.md
│   └── story-ledger.md
├── stories/                 # Workflow folders
│   ├── backlog/             # FA creates here
│   ├── ready-to-refine/     # FA moves here for refinement
│   └── ready-for-development/ # DEV moves here when ready
├── adr/                     # Architecture Decision Records
├── decisions/               # Business decisions
├── dev-plans/               # Development task breakdowns
├── qa/test-cases/           # Test documentation
├── epics/                   # Epic definitions
└── sprints/                 # Sprint folders
    └── sprint-N/sprint-goal.md
```

### Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Feature | `F-NNN-description.md` | `F-001-user-auth.md` |
| Story | `S-NNN-description.md` | `S-042-password-reset.md` |
| ADR | `ADR-NNN-description.md` | `ADR-003-jwt-tokens.md` |
| Decision | `DECISION-NNN-description.md` | `DECISION-015-pricing.md` |
| Dev Plan | `story-NNN-tasks.md` | `story-042-tasks.md` |
| Epic | `EPIC-NNN-description.md` | `EPIC-002-checkout.md` |

---

## Quality Gates

### Definition of Ready (DoR)

Before a story enters `ready-for-development/`:
- [ ] Linked to Feature Canon
- [ ] Before/After delta clearly described
- [ ] Acceptance Criteria are testable
- [ ] No TBD/placeholder content
- [ ] Estimate assigned

### Definition of Done (DoD)

Before a story is marked Done:
- [ ] All AC verified
- [ ] Code reviewed and merged
- [ ] Tests passing
- [ ] **Feature Canon updated** (if behavior changed)
- [ ] Documentation updated

---

## Development Workflow

### When Working on TeamSpec CLI

```bash
cd cli/
npm test                    # Run all tests
node --test test/linter.test.js  # Run linter tests
npm link                    # Link for local testing
```

### When Testing TeamSpec

Use `teamspec_test/` as a sandbox workspace:
```bash
cd teamspec_test/
teamspec lint               # Test linter against sample projects
```

---

## Reference Materials

### In This Repository
- `PROJECT_STRUCTURE.yml` — Canonical folder structure definition
- `PROJECT_STRUCTURE_REFERENCE.md` — Human-readable guide
- `agents/README.md` — Agent system documentation
- `templates/` — All document templates

### Deprecated Reference (DelenSpec)
The `DelenSpec/` workspace contains the original TeamSpec implementation. Use for:
- Understanding original design decisions
- Reviewing proven templates
- **NOT for active development**

---

## Output Guidelines

1. **Template First**: Use templates from `/templates/` or reference DelenSpec templates
2. **No Placeholders**: Never leave TBD/TODO unless explicitly asked
3. **Markdown Strict**: Output properly formatted Markdown
4. **Feature Canon Reference**: Always link behavior to Feature Canon
5. **Role Awareness**: Ask which role the user is acting as if unclear
