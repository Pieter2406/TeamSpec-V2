# TeamSpec 4.0 — Product-Canon Operating Model

> **Version:** 4.0 (Planning)  
> **Status:** Planning Phase  
> **Created:** 2026-01-09  
> **Author:** TeamSpec Core Team

---

## Overview

TeamSpec 4.0 introduces the **Product-Canon** operating model, which separates:

- **Products** — Long-lived, production-truth documentation (AS-IS state)
- **Projects** — Time-bound change initiatives that propose modifications to products (TO-BE state)

This solves the "time-pollution problem" where project artifacts contaminate the canonical documentation of production systems.

---

## Key Design Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Product-Project Relationship | **Many-to-Many**: A project can modify multiple products; a product can receive changes from multiple projects |
| 2 | Product Creation Owner | **New Product Owner (PO) role** owns product creation and lifecycle |
| 3 | Increment Artifacts | **No explicit increment files** — increment content embedded in other documents (Epics, Stories) |
| 4 | Feature Canon Location | **Reference only** — projects reference product features directly, no duplication |
| 5 | Backward Compatibility | **Auto-migrate** with explicit migration command to fix issues |
| 6 | Story Linking | **Stories link to Epics** (mandatory); feature links are optional metadata |
| 7 | Product Sync Timing | **After deployment** — triggered by explicit `ts:deploy` command |
| 8 | Templates | **Feature-increments** — distinguish between product features and project feature-increments |

---

## Document Index

| Document | Purpose |
|----------|---------|
| [01-FOLDER-STRUCTURE.md](./01-FOLDER-STRUCTURE.md) | New folder structure, CLI and prompt implications |
| [02-AGENT-CHANGES.md](./02-AGENT-CHANGES.md) | Changes to all agents including new PO role |
| [03-COMMAND-REFERENCE.md](./03-COMMAND-REFERENCE.md) | Complete command inventory with changes |
| [04-LINTER-CHANGES.md](./04-LINTER-CHANGES.md) | New and modified linting rules |
| [05-NAMING-STRATEGY.md](./05-NAMING-STRATEGY.md) | Document naming conventions |
| [06-CLI-CHANGES.md](./06-CLI-CHANGES.md) | CLI initialization and migration |
| [07-MIGRATION-GUIDE.md](./07-MIGRATION-GUIDE.md) | Step-by-step migration from 2.0 to 4.0 |
| [08-IMPLEMENTATION-PHASES.md](./08-IMPLEMENTATION-PHASES.md) | Phased implementation plan |

---

## Core Conceptual Model

**PRX** = Product Prefix (e.g., `DIT` for "DnD Initiative Tracker")

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTS (AS-IS)                            │
│  Long-lived production truth. Updated only after deployment.        │
│                                                                     │
│  products/                                                          │
│  ├── products-index.md                                              │
│  └── {product-id}/                  # e.g., dnd-initiative-tracker  │
│      ├── product.yml                # Product definition (PO)       │
│      ├── README.md                                                  │
│      ├── business-analysis/         # Business analysis documents   │
│      │   └── ba-PRX-XXX-*.md        # e.g., ba-DIT-001-overview.md  │
│      ├── features/                  # CANONICAL Feature Canon       │
│      │   ├── features-index.md                                      │
│      │   ├── story-ledger.md                                        │
│      │   └── f-PRX-XXX-*.md         # e.g., f-DIT-001-combat.md     │
│      ├── solution-designs/          # Solution design documents     │
│      │   └── sd-PRX-XXX-*.md        # e.g., sd-DIT-001-api.md       │
│      ├── technical-architecture/    # Production ADRs               │
│      │   └── ta-PRX-XXX-*.md        # e.g., ta-DIT-001-database.md  │
│      └── decisions/                 # Production business decisions │
│          └── dec-PRX-XXX-*.md       # e.g., dec-DIT-001-pricing.md  │
└─────────────────────────────────────────────────────────────────────┘
                                   ▲
                                   │ ts:deploy (sync after release)
                                   │
┌─────────────────────────────────────────────────────────────────────┐
│                        PROJECTS (TO-BE)                             │
│  Time-bound change initiatives. Propose changes to products.        │
│                                                                     │
│  projects/                                                          │
│  ├── projects-index.md                                              │
│  └── {project-id}/                                                  │
│      ├── project.yml                # Project definition (BA)       │
│      ├── README.md                                                  │
│      ├── business-analysis-increments/                              │
│      │   ├── increments-index.md                                    │
│      │   └── bai-PRX-XXX-*.md       # e.g., bai-DIT-001-new-feat.md │
│      ├── feature-increments/        # PROPOSED changes to Canon     │
│      │   ├── increments-index.md                                    │
│      │   └── fi-PRX-XXX-*.md        # e.g., fi-DIT-001-combat-v2.md │
│      ├── solution-design-increments/                                │
│      │   ├── increments-index.md                                    │
│      │   └── sdi-PRX-XXX-*.md       # e.g., sdi-DIT-001-api-v2.md   │
│      ├── epics/                     # Epics group stories           │
│      │   ├── epics-index.md                                         │
│      │   └── epic-PRX-XXX-*.md      # e.g., epic-DIT-001-combat.md  │
│      ├── stories/                   # Execution artifacts           │
│      │   ├── backlog/                                               │
│      │   ├── ready-to-refine/                                       │
│      │   ├── ready-to-develop/                                      │
│      │   └── s-eXXX-YYY-*.md        # e.g., s-e001-001-add-btn.md   │
│      ├── technical-architecture-increments/                         │
│      │   ├── increments-index.md                                    │
│      │   └── tai-PRX-XXX-*.md       # e.g., tai-DIT-001-cache.md    │
│      ├── decisions/                 # Project-specific decisions    │
│      │   └── dec-XXX-*.md                                           │
│      ├── dev-plans/                 # Development plans             │
│      │   └── dp-sXXX-*.md           # e.g., dp-s001-001-tasks.md    │
│      ├── qa/                        # Test cases, bugs, UAT         │
│      │   ├── test-cases/                                            │
│      │   ├── bugs/                                                  │
│      │   └── uat/                                                   │
│      └── sprints/                   # Sprint tracking               │
│          ├── sprints-index.md                                       │
│          └── sprint-N/                                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Naming Convention Key

| Prefix | Scope | Meaning | Example |
|--------|-------|---------|--------|
| `PRX` | Product | Product prefix (3-4 chars) | `DIT`, `CRM`, `ERP` |
| `ba-` | Product | Business Analysis | `ba-DIT-001-overview.md` |
| `f-` | Product | Feature | `f-DIT-001-combat-tracker.md` |
| `sd-` | Product | Solution Design | `sd-DIT-001-api-design.md` |
| `ta-` | Product | Technical Architecture | `ta-DIT-001-database.md` |
| `dec-` | Both | Decision | `dec-DIT-001-pricing.md` |
| `bai-` | Project | Business Analysis Increment | `bai-DIT-001-new-feature.md` |
| `fi-` | Project | Feature Increment | `fi-DIT-001-combat-v2.md` |
| `sdi-` | Project | Solution Design Increment | `sdi-DIT-001-api-v2.md` |
| `tai-` | Project | Technical Architecture Increment | `tai-DIT-001-cache.md` |
| `epic-` | Project | Epic | `epic-DIT-001-combat-redesign.md` |
| `s-eXXX-YYY` | Project | Story (eXXX=Epic, YYY=sequence) | `s-e001-001-add-button.md` |
| `dp-` | Project | Dev Plan | `dp-s001-001-tasks.md` |

---

## New Canon Rules (4.0)

| Rule | Description |
|------|-------------|
| **CANON-001** | Product Feature Canon is the single source of truth for AS-IS behavior |
| **CANON-002** | Projects propose changes via Feature-Increments, business analysis increments, solution design increments, never modify Product Canon directly |
| **CANON-003** | Product Canon is updated ONLY after successful deployment |
| **CANON-004** | All stories must link to an Epic |
| **CANON-005** | Epics define the TO-BE state for a coherent change and describe the business value that the change brings|
| **CANON-006** | Feature-Increments describe deltas against Product Features |
| **CANON-007** | A project can modify multiple products (many-to-many) |
| **CANON-008** | Business decisions affecting products are logged at product level after deployment |

---

## Role Changes Summary

| Role | 2.0 Responsibilities | 4.0 Changes |
|------|---------------------|-------------|
| **PO (NEW)** | — | Owns Products, product.yml, product lifecycle, deployment approval |
| **BA** | Projects, Features, Decisions | Projects, Feature-Increments (purpose/scope), Project Decisions |
| **FA** | Stories, Canon Sync | Stories, Epic behavior, Feature-Increment behavior, Canon sync proposals |
| **SA** | technical architecture increments | ADRs | Product technical architecture (after deploy), Project ADRs (during project) |
| **DEV** | Dev Plans | Unchanged |
| **QA** | Test Cases | Tests against TO-BE (Feature-Increments), validates AS-IS sync |
| **SM** | Sprints | Adds deployment gate to sprint/project close |

---

## Implementation Timeline

| Phase | Focus | Estimated Effort |
|-------|-------|------------------|
| **Phase 1** | Folder structure, CLI migration | 2-3 days |
| **Phase 2** | Agent updates (PO, BA, FA) | 2-3 days |
| **Phase 3** | Command changes | 2 days |
| **Phase 4** | Linter updates | 2-3 days |
| **Phase 5** | Templates and naming | 1-2 days |
| **Phase 6** | Testing and documentation | 2 days |

**Total Estimated Effort:** 11-15 days

---

## Next Steps

1. Review and approve this plan
2. Begin Phase 1 implementation
3. Create test workspace for validation
4. Iterate based on feedback
