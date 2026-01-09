# TeamSpec 4.0 Folder Structure

> **Version:** 4.0  
> **Last Updated:** 2026-01-09  
> **Purpose:** Complete folder structure reference for TeamSpec workspaces

---

## Overview

TeamSpec uses a **Product/Project** model:
- **Products** = Production truth (AS-IS state)
- **Projects** = Change proposals (TO-BE state)

---

## Complete Structure

```
workspace/
│
├── products/                              # PRODUCTION TRUTH
│   │
│   └── {product-id}/                      # e.g., digital-invoicing/
│       │
│       ├── product.yml                    # Product identity (id, PRX prefix)
│       ├── README.md                      # Product overview
│       │
│       ├── business-analysis/             # BA owns - Business context
│       │   └── ba-PRX-NNN-*.md            # e.g., ba-DIT-001-market-overview.md
│       │
│       ├── features/                      # FA owns - CANONICAL Feature Canon
│       │   ├── features-index.md          # Index of all features
│       │   ├── story-ledger.md            # History of changes
│       │   └── f-PRX-NNN-*.md             # e.g., f-DIT-001-user-auth.md
│       │
│       ├── solution-designs/              # SA owns - Technical design
│       │   └── sd-PRX-NNN-*.md            # e.g., sd-DIT-001-api-design.md
│       │
│       ├── technical-architecture/        # SA owns - Architecture decisions
│       │   └── ta-PRX-NNN-*.md            # e.g., ta-DIT-001-database.md
│       │
│       ├── qa/                            # QA owns - Product-level QA
│       │   └── regression/                # Regression test suites
│       │       └── reg-PRX-set.md         # e.g., reg-DIT-set.md
│       │
│       └── decisions/                     # PO owns - Product decisions
│           └── dec-PRX-NNN-*.md           # e.g., dec-DIT-001-pricing.md
│
│
├── projects/                              # CHANGE PROPOSALS
│   │
│   └── {project-id}/                      # e.g., q1-2026-oauth-integration/
│       │
│       ├── project.yml                    # Project identity (target_products, PRX)
│       ├── README.md                      # Project overview
│       │
│       ├── business-analysis-increments/  # BA owns - Business analysis for changes
│       │   └── bai-PRX-NNN-*.md           # e.g., bai-DIT-001-oauth-business-case.md
│       │
│       ├── feature-increments/            # FA owns - Proposed feature changes
│       │   ├── increments-index.md        # Index of all increments
│       │   └── fi-PRX-NNN-*.md            # e.g., fi-DIT-001-oauth-login.md
│       │
│       ├── solution-design-increments/    # SA owns - Proposed design changes
│       │   └── sdi-PRX-NNN-*.md           # e.g., sdi-DIT-001-oauth-api.md
│       │
│       ├── technical-architecture-increments/  # SA owns - Proposed arch changes
│       │   └── tai-PRX-NNN-*.md           # e.g., tai-DIT-001-redis-cache.md
│       │
│       ├── epics/                         # FA owns - Story containers
│       │   ├── epics-index.md             # Index of all epics
│       │   └── epic-PRX-NNN-*.md          # e.g., epic-DIT-001-authentication.md
│       │
│       ├── stories/                       # FA owns - Execution deltas
│       │   │
│       │   ├── backlog/                   # New stories, not yet refined
│       │   │   └── s-eNNN-YYY-*.md        # e.g., s-e001-001-add-button.md
│       │   │
│       │   ├── ready-to-refine/           # Ready for team refinement
│       │   │   └── s-eNNN-YYY-*.md
│       │   │
│       │   ├── ready-to-develop/          # DoR complete, ready for sprint
│       │   │   └── s-eNNN-YYY-*.md
│       │   │
│       │   ├── deferred/                  # Deferred to future
│       │   │   └── s-eNNN-YYY-*.md
│       │   │
│       │   └── out-of-scope/              # Removed from scope
│       │       └── s-eNNN-YYY-*.md
│       │
│       ├── decisions/                     # PO owns - Project decisions
│       │   └── dec-NNN-*.md               # e.g., dec-001-scope-reduction.md
│       │
│       ├── dev-plans/                     # DEV owns - Implementation plans
│       │   └── dp-eNNN-sYYY-*.md           # e.g., dp-e001-s003-tasks.md
│       │
│       ├── qa/                            # QA owns - Project QA artifacts
│       │   │
│       │   ├── test-cases/                # Feature test cases
│       │   │   └── tc-f-PRX-NNN-test-cases.md  # e.g., tc-f-DIT-001-test-cases.md
│       │   │
│       │   ├── bugs/                      # Bug reports
│       │   │   └── bug-eNNN-sYYY-ZZZ.md    # e.g., bug-e001-s003-001.md
│       │   │
│       │   └── uat/                       # UAT packs
│       │       └── uat-f-PRX-NNN.md       # e.g., uat-f-DIT-001.md
│       │
│       └── sprints/                       # SM owns - Sprint tracking
│           │
│           ├── active-sprint.md           # Pointer to current sprint
│           │
│           └── sprint-N/                  # e.g., sprint-3/
│               ├── sprint-goal.md         # Sprint objective
│               ├── committed-stories.md   # Stories in sprint
│               └── retrospective.md       # Sprint retro notes
│
│
└── .teamspec/                             # FRAMEWORK CONFIGURATION
    │
    ├── teamspec.yml                       # TeamSpec settings
    ├── copilot-instructions.md            # Copilot integration
    │
    ├── agents/                            # Role-specific agents
    │   ├── AGENT_BOOTSTRAP.md             # Core rules (inherited by all)
    │   ├── AGENT_PO.md                    # Product Owner
    │   ├── AGENT_BA.md                    # Business Analyst
    │   ├── AGENT_FA.md                    # Functional Analyst
    │   ├── AGENT_SA.md                    # Solution Architect
    │   ├── AGENT_DEV.md                   # Developer
    │   ├── AGENT_QA.md                    # QA Engineer
    │   ├── AGENT_SM.md                    # Scrum Master
    │   ├── AGENT_DES.md                   # Designer
    │   └── AGENT_FIX.md                   # Auto-fix agent
    │
    ├── templates/                         # Document templates
    │   ├── feature-template.md
    │   ├── feature-increment-template.md
    │   ├── story-template.md
    │   ├── epic-template.md
    │   ├── adr-template.md
    │   ├── decision-log-template.md
    │   ├── testcases-template.md
    │   ├── regression-template.md
    │   ├── uat-pack-template.md
    │   ├── bug-report-template.md
    │   ├── sprint-goal-template.md
    │   └── ...
    │
    ├── definitions/                       # Quality gates
    │   ├── definition-of-ready.md
    │   └── definition-of-done.md
    │
    ├── profiles/                          # Team profile overlays
    │   ├── startup.yml
    │   ├── enterprise.yml
    │   ├── regulated.yml
    │   └── platform-team.yml
    │
    └── context/                           # Team configuration
        ├── team.yml                       # Team metadata
        └── _schema.yml                    # Context schema
```

---

## Folder Ownership Summary

| Folder | Owner | Purpose |
|--------|-------|---------|
| `products/` | PO | Production truth container |
| `products/*/business-analysis/` | BA | Business context and analysis |
| `products/*/features/` | FA | Canonical Feature Canon |
| `products/*/solution-designs/` | SA | Technical design documents |
| `products/*/technical-architecture/` | SA | Architecture decisions |
| `products/*/qa/regression/` | QA | Product regression suites |
| `products/*/decisions/` | PO | Product-level decisions |
| `projects/` | PO | Change proposal container |
| `projects/*/business-analysis-increments/` | BA | Proposed business analysis |
| `projects/*/feature-increments/` | FA | Proposed feature changes |
| `projects/*/solution-design-increments/` | SA | Proposed design changes |
| `projects/*/technical-architecture-increments/` | SA | Proposed architecture changes |
| `projects/*/epics/` | FA | Story containers |
| `projects/*/stories/` | FA | Executable deltas |
| `projects/*/decisions/` | PO | Project-level decisions |
| `projects/*/dev-plans/` | DEV | Implementation plans |
| `projects/*/qa/` | QA | Test artifacts |
| `projects/*/sprints/` | SM | Sprint tracking |
| `.teamspec/` | — | Framework configuration |

---

## Story Workflow Folders

Stories move through workflow folders as they progress:

```
stories/backlog/           → FA creates here
       ↓
stories/ready-to-refine/   → FA moves when ready for refinement
       ↓
stories/ready-to-develop/  → DEV moves when DoR complete
       ↓
sprints/sprint-N/          → SM moves into sprint

Terminal States:
stories/deferred/          → FA moves if deferred to future
stories/out-of-scope/      → FA moves if removed from scope
```

| Folder | State | Entry | Exit |
|--------|-------|-------|------|
| `backlog/` | New | FA creates | FA moves to ready-to-refine |
| `ready-to-refine/` | Refinement ready | FA moves here | DEV moves to ready-to-develop |
| `ready-to-develop/` | DoR complete | DEV moves here | SM moves to sprint |
| `deferred/` | Deferred | FA moves here | FA reactivates |
| `out-of-scope/` | Removed | FA moves here | — |

---

## Naming Pattern Quick Reference

### Product Artifacts
| Artifact | Pattern | Example |
|----------|---------|---------|
| Product config | `product.yml` | `product.yml` |
| Feature Canon | `f-PRX-NNN-*.md` | `f-DIT-001-user-auth.md` |
| Business Analysis | `ba-PRX-NNN-*.md` | `ba-DIT-001-overview.md` |
| Solution Design | `sd-PRX-NNN-*.md` | `sd-DIT-001-api.md` |
| Tech Architecture | `ta-PRX-NNN-*.md` | `ta-DIT-001-database.md` |
| Product Decision | `dec-PRX-NNN-*.md` | `dec-DIT-001-pricing.md` |
| Regression Set | `reg-PRX-set.md` | `reg-DIT-set.md` |

### Project Artifacts
| Artifact | Pattern | Example |
|----------|---------|---------|
| Project config | `project.yml` | `project.yml` |
| Feature-Increment | `fi-PRX-NNN-*.md` | `fi-DIT-001-oauth.md` |
| BA Increment | `bai-PRX-NNN-*.md` | `bai-DIT-001-case.md` |
| SD Increment | `sdi-PRX-NNN-*.md` | `sdi-DIT-001-api.md` |
| TA Increment | `tai-PRX-NNN-*.md` | `tai-DIT-001-cache.md` |
| Epic | `epic-PRX-NNN-*.md` | `epic-DIT-001-auth.md` |
| Story | `s-eNNN-YYY-*.md` | `s-e001-003-button.md` |
| Project Decision | `dec-NNN-*.md` | `dec-001-scope.md` |
| Dev Plan | `dp-eNNN-sYYY-*.md` | `dp-e001-s003-tasks.md` |
| Test Cases | `tc-f-PRX-NNN-test-cases.md` | `tc-f-DIT-001-test-cases.md` |
| UAT Pack | `uat-f-PRX-NNN.md` | `uat-f-DIT-001.md` |
| Bug Report | `bug-eNNN-sYYY-ZZZ.md` | `bug-e001-s003-001.md` |

---

## See Also

- [ARTIFACT_GLOSSARY.md](ARTIFACT_GLOSSARY.md) — Detailed artifact descriptions
- [AGENT_BOOTSTRAP.md](agents/AGENT_BOOTSTRAP.md) — Core TeamSpec rules
