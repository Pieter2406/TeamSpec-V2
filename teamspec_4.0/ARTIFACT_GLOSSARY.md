# TeamSpec 4.0 Artifact Glossary

> **Version:** 4.0  
> **Last Updated:** 2026-01-09  
> **Purpose:** Comprehensive reference for all TeamSpec artifacts, their naming patterns, locations, and owners

---

## Quick Reference

| Artifact | Owner | Location |
|----------|-------|----------|
| Product | PO | `/products/{product-id}/` |
| Project | PO | `/projects/{project-id}/` |
| Feature (Canon) | FA | `/products/*/features/` |
| Feature-Increment | FA | `/projects/*/feature-increments/` |
| Business Analysis | BA | `/products/*/business-analysis/` |
| Business Analysis Increment | BA | `/projects/*/business-analysis-increments/` |
| Solution Design | SA | `/products/*/solution-designs/` |
| Solution Design Increment | SA | `/projects/*/solution-design-increments/` |
| Technical Architecture | SA | `/products/*/technical-architecture/` |
| Technical Architecture Increment | SA | `/projects/*/technical-architecture-increments/` |
| Decision (Product) | PO | `/products/*/decisions/` |
| Decision (Project) | PO | `/projects/*/decisions/` |
| Epic | FA | `/projects/*/epics/` |
| Story | FA | `/projects/*/stories/` |
| Dev Plan | DEV | `/projects/*/dev-plans/` |
| Test Cases | QA | `/projects/*/qa/test-cases/` |
| Regression Set | QA | `/products/*/qa/regression/` |
| UAT Pack | QA | `/projects/*/qa/uat/` |
| Bug Report | QA | `/projects/*/qa/bugs/` |
| Sprint | SM | `/projects/*/sprints/` |

---

## Product-Level Artifacts

### Product (`product.yml`)

| Attribute | Value |
|-----------|-------|
| **Owner** | PO (Product Owner) |
| **Location** | `/products/{product-id}/product.yml` |
| **Pattern** | N/A (configuration file) |
| **Description** | Defines the product identity, including the product ID and PRX (product prefix). Every product artifact derives its PRX from this file. |
| **Lifecycle** | Permanent |

---

### Feature (Canon) (`f-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | FA (Functional Analyst) |
| **Location** | `/products/{product-id}/features/` |
| **Pattern** | `f-PRX-NNN-description.md` |
| **Example** | `f-DIT-001-user-authentication.md` |
| **Description** | The canonical source of truth for system behavior. Describes the AS-IS state of a feature in production. Defines business rules, user flows, personas, edge cases, and acceptance criteria. All other artifacts reference the Feature Canon. |
| **Lifecycle** | Permanent, canonical |

**Related Artifacts:**
- `features-index.md` — Index of all features in the product
- `story-ledger.md` — Tracks all stories that have modified this product

---

### Business Analysis (`ba-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | BA (Business Analyst) |
| **Location** | `/products/{product-id}/business-analysis/` |
| **Pattern** | `ba-PRX-NNN-description.md` |
| **Example** | `ba-DIT-001-market-overview.md` |
| **Description** | Product-level business analysis documents capturing market research, competitive analysis, user personas, business goals, and strategic context. These are canonical business documents that explain the WHY behind product decisions. |
| **Lifecycle** | Permanent, canonical |

---

### Solution Design (`sd-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | SA (Solution Architect) |
| **Location** | `/products/{product-id}/solution-designs/` |
| **Pattern** | `sd-PRX-NNN-description.md` |
| **Example** | `sd-DIT-001-api-design.md` |
| **Description** | Product-level solution architecture documents. Describes HOW the system is built — API contracts, service boundaries, integration patterns, and component design. The canonical technical design for production. |
| **Lifecycle** | Permanent, canonical |

---

### Technical Architecture (`ta-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | SA (Solution Architect) |
| **Location** | `/products/{product-id}/technical-architecture/` |
| **Pattern** | `ta-PRX-NNN-description.md` |
| **Example** | `ta-DIT-001-database-schema.md` |
| **Description** | Product-level technical architecture documents. Captures architectural decisions, technology stack choices, infrastructure design, security architecture, and performance considerations. Documents the context, decision, and consequences of technical choices. |
| **Lifecycle** | Permanent, canonical |

---

### Product Decision (`dec-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | PO (Product Owner) |
| **Location** | `/products/{product-id}/decisions/` |
| **Pattern** | `dec-PRX-NNN-description.md` |
| **Example** | `dec-DIT-001-pricing-strategy.md` |
| **Description** | Product-level business decisions. Documents significant decisions about the product's direction, scope, pricing, positioning, or strategy. Includes context, options considered, decision made, and rationale. |
| **Lifecycle** | Permanent |

---

### Regression Test Set (`reg-PRX-set.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | QA (Quality Assurance) |
| **Location** | `/products/{product-id}/qa/regression/` |
| **Pattern** | `reg-PRX-set.md` |
| **Example** | `reg-DIT-set.md` |
| **Description** | Product-level regression test suite. Contains critical path tests that must pass before any deployment. References test cases from feature test files. Tracks automation status and execution history. |
| **Lifecycle** | Permanent, canonical |

**Individual Regression Test IDs:** `reg-PRX-NNN` (e.g., `reg-DIT-001`)

---

## Project-Level Artifacts

### Project (`project.yml`)

| Attribute | Value |
|-----------|-------|
| **Owner** | PO (Product Owner) |
| **Location** | `/projects/{project-id}/project.yml` |
| **Pattern** | N/A (configuration file) |
| **Description** | Defines the project identity and target products. Contains the list of products this project will modify, each with their PRX. Projects are temporary containers for change work. |
| **Lifecycle** | Project duration |

---

### Feature-Increment (`fi-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | FA (Functional Analyst) |
| **Location** | `/projects/{project-id}/feature-increments/` |
| **Pattern** | `fi-PRX-NNN-description.md` |
| **Example** | `fi-DIT-001-oauth-login.md` |
| **Description** | Proposed changes to a Feature Canon. Describes the TO-BE state — what the feature will look like after the project completes. Uses delta format (Before/After/Impact). When the project completes, FA syncs approved changes into the Feature Canon. |
| **Lifecycle** | Project duration → syncs to Canon |

**Related Artifacts:**
- `increments-index.md` — Index of all feature-increments in the project

---

### Business Analysis Increment (`bai-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | BA (Business Analyst) |
| **Location** | `/projects/{project-id}/business-analysis-increments/` |
| **Pattern** | `bai-PRX-NNN-description.md` |
| **Example** | `bai-DIT-001-new-market-segment.md` |
| **Description** | Project-level business analysis for proposed changes. Documents the business case, requirements elicitation, and value proposition for the project's scope. When approved, relevant portions sync to product-level BA documents. |
| **Lifecycle** | Project duration → syncs to Canon |

---

### Solution Design Increment (`sdi-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | SA (Solution Architect) |
| **Location** | `/projects/{project-id}/solution-design-increments/` |
| **Pattern** | `sdi-PRX-NNN-description.md` |
| **Example** | `sdi-DIT-001-oauth-integration.md` |
| **Description** | Proposed changes to Solution Design. Documents new API endpoints, service modifications, or component changes required for the project. When the project completes, SA syncs approved changes into the Solution Design. |
| **Lifecycle** | Project duration → syncs to Canon |

---

### Technical Architecture Increment (`tai-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | SA (Solution Architect) |
| **Location** | `/projects/{project-id}/technical-architecture-increments/` |
| **Pattern** | `tai-PRX-NNN-description.md` |
| **Example** | `tai-DIT-001-redis-caching.md` |
| **Description** | Proposed technical architecture decisions for the project. Documents new technology choices, infrastructure changes, or architectural modifications. When approved, SA syncs to product-level Technical Architecture. |
| **Lifecycle** | Project duration → syncs to Canon |

---

### Project Decision (`dec-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | PO (Product Owner) |
| **Location** | `/projects/{project-id}/decisions/` |
| **Pattern** | `dec-NNN-description.md` |
| **Example** | `dec-001-scope-reduction.md` |
| **Description** | Project-level decisions. Documents significant decisions about scope, timeline, priorities, or approach within the project. Not product-scoped (no PRX). |
| **Lifecycle** | Project duration |

---

### Epic (`epic-PRX-NNN-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | FA (Functional Analyst) |
| **Location** | `/projects/{project-id}/epics/` |
| **Pattern** | `epic-PRX-NNN-description.md` |
| **Example** | `epic-DIT-001-authentication-overhaul.md` |
| **Description** | Container for related stories implementing a Feature-Increment. Links stories to the business value and acceptance criteria. Provides the "big picture" for a set of changes. Stories reference their parent Epic in their filename. |
| **Lifecycle** | Project duration |

**Related Artifacts:**
- `epics-index.md` — Index of all epics in the project

---

### Story (`s-eNNN-YYY-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | FA (Functional Analyst) |
| **Location** | `/projects/{project-id}/stories/{workflow-folder}/` |
| **Pattern** | `s-eNNN-YYY-description.md` |
| **Example** | `s-e001-003-add-google-login-button.md` |
| **Description** | Executable delta describing a single change. Uses Before/After/Impact format. Links to parent Epic (eNNN) and Feature-Increment. Contains testable Acceptance Criteria. Stories are the unit of work for development. |
| **Lifecycle** | Project duration → archived or terminal state |

**Workflow Folders:**
| Folder | State |
|--------|-------|
| `stories/backlog/` | New, not yet refined |
| `stories/ready-to-refine/` | Ready for team refinement |
| `stories/ready-to-develop/` | DoR complete, ready for sprint |
| `stories/deferred/` | Deferred to future |
| `stories/out-of-scope/` | Removed from scope |

---

### Dev Plan (`dp-eNNN-sYYY-*.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | DEV (Developer) |
| **Location** | `/projects/{project-id}/dev-plans/` |
| **Pattern** | `dp-eNNN-sYYY-tasks.md` |
| **Example** | `dp-e001-s003-tasks.md` |
| **Description** | Technical implementation plan for a story. Breaks down the story into development tasks, identifies affected files/components, estimates effort, and documents technical approach. Created by DEV before implementation begins. |
| **Lifecycle** | Story duration |

---

### Test Cases (`tc-f-PRX-NNN-test-cases.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | QA (Quality Assurance) |
| **Location** | `/projects/{project-id}/qa/test-cases/` |
| **Pattern** | `tc-f-PRX-NNN-test-cases.md` |
| **Example** | `tc-f-DIT-001-test-cases.md` |
| **Description** | Canonical test cases for a feature. Tests are feature-level (not story-specific). Covers happy paths, edge cases, and error scenarios. Maps test cases to business rules. Tracks automation status. |
| **Lifecycle** | Permanent, canonical |

**Individual Test Case IDs:** `tc-f-PRX-NNN-YYY` (e.g., `tc-f-DIT-001-003`)
**Edge Case IDs:** `ec-f-PRX-NNN-YYY` (e.g., `ec-f-DIT-001-001`)

---

### UAT Pack (`uat-f-PRX-NNN.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | QA (Quality Assurance) |
| **Location** | `/projects/{project-id}/qa/uat/` |
| **Pattern** | `uat-f-PRX-NNN.md` |
| **Example** | `uat-f-DIT-001.md` |
| **Description** | User Acceptance Testing materials for stakeholder validation. Persona-based scenarios written in user-friendly language. Enables business stakeholders to validate that the feature meets their needs. |
| **Lifecycle** | Release-bound |

**UAT Scenario IDs:** `uat-f-PRX-NNN-YYY` (e.g., `uat-f-DIT-001-002`)

---

### Bug Report (`bug-eNNN-sYYY-ZZZ.md`)

| Attribute | Value |
|-----------|-------|
| **Owner** | QA (Quality Assurance) |
| **Location** | `/projects/{project-id}/qa/bugs/` |
| **Pattern** | `bug-eNNN-sYYY-ZZZ.md` |
| **Example** | `bug-e001-s003-001.md` |
| **Description** | Defect report linked to a specific story. Pattern uses eNNN (epic) and sYYY (story sequence) with ZZZ (bug sequence). Must include bug classification: Implementation Defect (code doesn't match Canon), Canon Wrong (Canon doesn't match intent), or Undocumented Behavior (not specified). Classification determines fix owner. |
| **Lifecycle** | Issue lifecycle (Open → Fixed → Closed) |

**Bug Classifications:**
| Type | Fix Owner | Canon Impact |
|------|-----------|--------------|
| Implementation Defect | DEV | None |
| Canon Wrong | FA → BA | FA updates Canon |
| Undocumented Behavior | FA + BA | BA decides, FA updates |

---

### Sprint (`sprint-N/`)

| Attribute | Value |
|-----------|-------|
| **Owner** | SM (Scrum Master) |
| **Location** | `/projects/{project-id}/sprints/sprint-N/` |
| **Pattern** | `sprint-N/` directory |
| **Example** | `sprint-3/` |
| **Description** | Sprint container with goal, committed stories, and retrospective notes. Tracks sprint execution and metrics. |
| **Lifecycle** | Sprint duration |

**Related Artifacts:**
- `active-sprint.md` — Pointer to current sprint
- `sprint-goal.md` — Sprint objective and commitment
- `retrospective.md` — Sprint retrospective notes

---

## Index Files

| File | Location | Owner | Description |
|------|----------|-------|-------------|
| `features-index.md` | `/products/*/features/` | FA | Index of all features in the product |
| `story-ledger.md` | `/products/*/features/` | FA | History of all stories that modified this product |
| `increments-index.md` | `/projects/*/feature-increments/` | FA | Index of all feature-increments in the project |
| `epics-index.md` | `/projects/*/epics/` | FA | Index of all epics in the project |
| `active-sprint.md` | `/projects/*/sprints/` | SM | Pointer to the current active sprint |

---

## Naming Convention Summary

### PRX (Product Prefix)
A 2-4 character uppercase identifier for a product (e.g., `DIT`, `CPRT`, `BILL`).
- Defined in `product.yml`
- Used in ALL artifact IDs that relate to that product
- Ensures traceability across products and projects

### Artifact ID Patterns

| Pattern | Structure | Example |
|---------|-----------|---------|
| Feature | `f-{PRX}-{NNN}` | `f-DIT-001` |
| Feature-Increment | `fi-{PRX}-{NNN}` | `fi-DIT-001` |
| Business Analysis | `ba-{PRX}-{NNN}` | `ba-DIT-001` |
| BA Increment | `bai-{PRX}-{NNN}` | `bai-DIT-001` |
| Solution Design | `sd-{PRX}-{NNN}` | `sd-DIT-001` |
| SD Increment | `sdi-{PRX}-{NNN}` | `sdi-DIT-001` |
| Tech Architecture | `ta-{PRX}-{NNN}` | `ta-DIT-001` |
| TA Increment | `tai-{PRX}-{NNN}` | `tai-DIT-001` |
| Product Decision | `dec-{PRX}-{NNN}` | `dec-DIT-001` |
| Project Decision | `dec-{NNN}` | `dec-001` |
| Epic | `epic-{PRX}-{NNN}` | `epic-DIT-001` |
| Story | `s-e{NNN}-{YYY}` | `s-e001-003` |
| Dev Plan | `dp-e{NNN}-s{YYY}` | `dp-e001-s003` |
| Test Case File | `tc-f-{PRX}-{NNN}` | `tc-f-DIT-001` |
| Test Case ID | `tc-f-{PRX}-{NNN}-{YYY}` | `tc-f-DIT-001-003` |
| Regression Set | `reg-{PRX}` | `reg-DIT` |
| Regression ID | `reg-{PRX}-{NNN}` | `reg-DIT-001` |
| UAT Pack | `uat-f-{PRX}-{NNN}` | `uat-f-DIT-001` |
| UAT Scenario | `uat-f-{PRX}-{NNN}-{YYY}` | `uat-f-DIT-001-002` |
| Bug Report | `bug-e{NNN}-s{YYY}-{ZZZ}` | `bug-e001-s003-001` |

---

## Ownership Matrix

| Role | Creates | Maintains | Syncs to Canon |
|------|---------|-----------|----------------|
| **PO** | Products, Projects, Product/Project Decisions | Product strategy | — |
| **BA** | Business Analysis, BA Increments | Business requirements | BA → BA Canon |
| **FA** | Features, Feature-Increments, Epics, Stories | Functional specs | FI → Feature Canon |
| **SA** | Solution Designs, SD Increments, TA, TA Increments | Technical architecture | SDI → SD, TAI → TA |
| **DEV** | Dev Plans | Implementation tasks | — |
| **QA** | Test Cases, Regression Sets, UAT Packs, Bug Reports | Quality artifacts | — |
| **SM** | Sprints | Sprint execution | — |

---

## Artifact Lifecycle States

### Permanent Artifacts
These are canonical and persist indefinitely:
- Feature Canon
- Business Analysis
- Solution Design
- Technical Architecture
- Test Cases
- Regression Sets

### Project-Bound Artifacts
These exist during project execution and may sync to Canon:
- Feature-Increments
- BA Increments
- SD Increments
- TA Increments
- Epics
- Stories
- Dev Plans
- UAT Packs

### Issue-Lifecycle Artifacts
These follow an issue workflow:
- Bug Reports (Open → In Progress → Fixed → Closed)

### Sprint-Bound Artifacts
These exist within a sprint:
- Sprint folders and goals
- Active sprint pointer

---

## See Also

- [AGENT_BOOTSTRAP.md](agents/AGENT_BOOTSTRAP.md) — Core rules and folder structure
- [AGENT_PO.md](agents/AGENT_PO.md) — Product Owner responsibilities
- [AGENT_BA.md](agents/AGENT_BA.md) — Business Analyst responsibilities
- [AGENT_FA.md](agents/AGENT_FA.md) — Functional Analyst responsibilities
- [AGENT_SA.md](agents/AGENT_SA.md) — Solution Architect responsibilities
- [AGENT_DEV.md](agents/AGENT_DEV.md) — Developer responsibilities
- [AGENT_QA.md](agents/AGENT_QA.md) — QA Engineer responsibilities
- [AGENT_SM.md](agents/AGENT_SM.md) — Scrum Master responsibilities
