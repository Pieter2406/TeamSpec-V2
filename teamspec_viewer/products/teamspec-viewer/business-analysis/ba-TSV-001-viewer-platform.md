---
# === LLM Retrieval Metadata ===
artifact_kind: ba
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: BA
artifact_type: Product Canon
canonicity: canon
lifecycle: permanent

# === Naming ===
id_pattern: "ba-TSV-001"
filename_pattern: "ba-TSV-001-viewer-platform.md"

# === Required Relationships ===
links_required:
  - type: product
    pattern: "product.yml"
    optional: false

# === Search Optimization ===
keywords:
  - documentation viewer
  - teamspec framework
  - artifact navigation
  - role-based interface
  - markdown documentation
aliases:
  - TSV documentation platform
  - teamspec artifact viewer
  - team documentation portal
anti_keywords:
  - technical implementation
  - code generation
  - API design
  - database schema

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Executive Summary
    - Business Context
---

# Business Analysis: `ba-TSV-001-viewer-platform`

> **Template Version**: 4.0
> **Last Updated**: 2026-01-14

---

**Document Owner:** Business Analyst
**Artifact Type:** Business Analysis (Product Canon)
**Lifecycle:** Permanent, updated via bai-* increments

| Metadata | Details |
| :--- | :--- |
| **Status** | Approved |
| **Owner:** | BA (Business Analyst) |
| **Stakeholders** | Product Owner, Scrum Master, All TeamSpec Roles (BA, FA, SA, DEV, QA, SM, DES) |
| **Created** | 2026-01-14 |

---

## 1. Executive Summary

> **Contract:** Problem, solution, and value proposition in brief.

**Problem Statement:** 
TeamSpec framework documentation is stored as interconnected markdown files with structured prefixes (e.g., `f-TSV-001`, `fi-TSV-001`, `s-e001-042`) that are perfect for automated agent processing but difficult for humans to navigate and understand. Users working in specific roles (BA, FA, DEV, QA, SA, SM, DES) struggle to find and view the artifacts relevant to their work because:
- Navigation requires understanding complex file naming conventions
- Relationship between artifacts (features → feature-increments → stories → test cases) is implicit in filenames, not explicitly shown
- Reading artifacts requires jumping between dozens of markdown files
- No visual overview of products, projects, epics, and backlogs
- No support for embedded diagrams or markdown visualizations

**Proposed Solution:**
TeamSpec Viewer is a web-based document portal that provides role-aware navigation and visualization of TeamSpec artifacts. It parses the TeamSpec file structure and presents a human-friendly interface that:
- Maps physical files to semantic relationships (feature ↔ feature-increment, epic ↔ stories, etc.)
- Provides role-specific dashboards showing only relevant artifacts
- Renders markdown with diagram support (Mermaid, PlantUML, etc.)
- Visualizes product/project hierarchies and artifact dependencies
- Offers backlog browsing with drag-capable ordering
- Maintains markdown-as-source-of-truth while providing a better UX

**Value Proposition:**
- **For POs:** Transparent view of product portfolios and active projects
- **For Roles:** Quick access to owned artifacts without file system navigation
- **For Teams:** Shared documentation experience that scales with TeamSpec adoption
- **For Adoption:** Reduces onboarding friction and tool learning curve

---

## 2. Business Context

TeamSpec is a specification-driven development framework built on the "Product-Canon" operating model:

### Current State (As-Is)

**File-Based Workflow:**
- All artifacts stored as markdown files in strict directory structure
- Naming conventions encode metadata (PRX prefix, artifact type, sequential ID)
- Artifacts are interconnected via filename patterns and markdown links
- Users navigate via file explorer or search tools (grep, Obsidian, etc.)
- No standardized tool for visualization or role-specific filtering

**Users:**
- **Product Owners:** Manage products and projects, sync increments to canon
- **Business Analysts:** Create business analysis documents
- **Functional Analysts:** Define features, feature-increments, epics, stories
- **Solution Architects:** Create solution designs and technical architecture
- **Developers:** Create dev plans and implement features
- **QA Engineers:** Create test cases and regression tests
- **Scrum Masters:** Manage sprints and deployment gates
- **Designers:** Create UX/UI artifacts

**Pain Points:**
1. New users struggle to understand artifact relationships
2. Finding artifacts requires knowledge of naming conventions
3. Navigating between related artifacts (feature → FI → epic → story) requires manual file lookup
4. Product overviews require scanning directory structures
5. Backlog visibility requires reading multiple markdown files
6. Diagrams in markdown must be manually maintained
7. No role-specific filtering of artifacts

### Future State (To-Be)

**Portal-Based Workflow:**
- Same markdown files as source-of-truth
- TeamSpec Viewer parses files and builds semantic index
- Web interface provides role-aware navigation and visualization
- Diagrams are automatically rendered
- Product/project hierarchies are interactive
- Backlog is visually browsable with optional drag-based ordering
- Each role sees artifacts relevant to their work
- Links between artifacts are automatically computed and displayed

---

## 3. Scope

### In Scope

**For MVP (TeamSpec Viewer MVP Project):**

1. **Product Portfolio View**
   - List all products with basic metadata
   - Show which projects have impact on each product
   - Display product PRX prefix and status

2. **Role-Specific Dashboards**
   - One dashboard per role (BA, FA, DEV, QA, SA, SM, DES)
   - Show artifacts owned by that role
   - Quick access to owned/relevant files

3. **Feature-Increment Navigation**
   - Browse features and their corresponding feature-increments
   - Show AS-IS/TO-BE sections side-by-side
   - Display linked stories for each FI

4. **Epic & Story Navigation**
   - Browse epics in a project
   - Show all stories linked to each epic
   - Display story status (backlog, in-progress, done)

5. **Backlog Visualization**
   - Browsable list of backlog stories
   - Visual indication of story order
   - (Optional MVP+: Drag-to-reorder functionality)

6. **Markdown Diagram Rendering**
   - Support Mermaid diagrams
   - Support PlantUML diagrams
   - Render markdown with proper formatting

7. **Artifact Search**
   - Full-text search across artifacts
   - Filter by artifact type
   - Filter by role/owner

### Out of Scope (Non-Goals)

- Real-time file synchronization (refresh required)
- Artifact creation/editing UI (use TeamSpec CLI/Copilot commands)
- Code repository integration
- Timeline/Gantt views
- Resource allocation management
- Burndown charts or sprint metrics
- Integration with external project management tools
- Mobile application
- Team permission management (assumes read access to all files)

---

## 4. Related Feature Canon

> Link to Feature Canon files created from this analysis.
> Once features are created, the Feature Canon is authoritative.

| Feature ID | Feature Name | Status | Link |
|------------|--------------|--------|------|
| [f-TSV-001](../features/f-TSV-001-product-portfolio-view.md) | Product Portfolio View | Planned | |
| [f-TSV-002](../features/f-TSV-002-role-specific-dashboards.md) | Role-Specific Dashboards | Planned | |
| [f-TSV-003](../features/f-TSV-003-feature-increment-navigation.md) | Feature-Increment Navigation | Planned | |
| [f-TSV-004](../features/f-TSV-004-epic-and-story-navigation.md) | Epic & Story Navigation | Planned | |
| [f-TSV-005](../features/f-TSV-005-backlog-visualization.md) | Backlog Visualization | Planned | |
| [f-TSV-006](../features/f-TSV-006-markdown-diagram-rendering.md) | Markdown Diagram Rendering | Planned | |
| [f-TSV-007](../features/f-TSV-007-artifact-search.md) | Artifact Search | Planned | |

---

## 5. User Journeys / Personas

| Persona | Journey | Goal |
|---------|---------|------|
| **Product Owner** | Login → View Products → Select Product → See Active Projects → Understand Impact | Understand portfolio state and project relationships |
| **Functional Analyst** | Login → Filter by Role (FA) → Browse Features → View Feature-Increments → See Related Stories | Quickly navigate features and planned changes |
| **Developer** | Login → Filter by Role (DEV) → Find Dev Plans → Link to Story/FI → Understand Acceptance Criteria | Find work items and understand scope |
| **QA Engineer** | Login → Filter by Role (QA) → Browse Test Cases & Regression Tests → Link to FI/Feature | Understand test coverage and requirements |
| **Scrum Master** | Login → View Project → Browse Backlog → See Story Status → Understand Progress | Manage sprint planning and status |
| **New Team Member** | Login → Explore Product Portal → See Artifact Relationships → Read Role Guide | Understand TeamSpec structure and artifact types |

---

## 6. Business Rules & Logic

| Rule ID | Description | Context |
|---------|-------------|---------|
| BR-TSV-001 | Products are the root of all documentation | Every feature, project, and work item belongs to a product |
| BR-TSV-002 | Projects propose changes to one or more products | Feature-Increments in projects link to Features in products |
| BR-TSV-003 | Features have corresponding Feature-Increments when projects are active | One-to-many relationship (one feature, multiple FIs across projects) |
| BR-TSV-004 | Stories are always linked to Epics via filename | Story filename encodes epic ID (s-e001-042-*.md) |
| BR-TSV-005 | Each role owns specific artifact types | BA owns BA artifacts, FA owns features/FIs/epics/stories, etc. |
| BR-TSV-006 | Artifact relationships are computed from filenames and markdown links | No external database; files are source-of-truth |
| BR-TSV-007 | Diagrams in markdown should be rendered automatically | Support Mermaid and PlantUML syntax |
| BR-TSV-008 | Backlog order reflects file system order or explicit metadata | Stories in stories/backlog/ folder can be ordered |

---

## 7. Data & Reporting Requirements

### Data Captured

**From Product Files:**
- Product metadata (id, name, prefix, status, active_projects)
- Feature details (filename patterns, section headers)
- Feature-Increment details (AS-IS/TO-BE sections)
- Business Analysis artifacts
- Solution Designs and Technical Architecture
- Decision logs

**From Project Files:**
- Project metadata (id, name, target_products)
- Epic definitions
- Story definitions (including epic ID from filename)
- Dev plans
- Test cases and bug reports
- Sprint information

**From Artifact Content:**
- Markdown headings and structure
- Diagram blocks (Mermaid, PlantUML)
- Links between artifacts
- Metadata sections (YAML front matter)
- Status indicators

### Reporting Needs

- **Product Dashboard:** List products, active projects, artifact counts
- **Role Dashboard:** Count of artifacts owned by role, recent activity
- **Project Status:** Epic status, story progression, test coverage
- **Backlog Report:** Story order, dependencies, estimated effort
- **Navigation Index:** Cross-referenced artifact relationships
- **Search Results:** Full-text search with faceted filtering

---

## 8. Risks & Constraints

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **File Structure Changes** | Medium | High | Version TeamSpec spec, add migration tooling, version parser |
| **Large Workspaces** | Low | Medium | Implement incremental indexing, cache strategy, pagination |
| **Stale Data** | Medium | Low | Auto-refresh on file watch, add "last updated" timestamp |
| **Markdown Parsing Errors** | Medium | Low | Graceful error handling, show raw markdown fallback |
| **Adoption Friction** | Medium | Medium | Include onboarding tour, role-specific guides, quick-start docs |
| **Diagram Rendering Issues** | Low | Low | Fallback to source code view, external diagram viewer link |

### Constraints

- **Technical:** Must run on Node.js/Electron/Web stack (not Python/Java)
- **Source Control:** All data in git-tracked markdown (no new database systems)
- **Naming:** Cannot change TeamSpec naming conventions (immutable contracts)
- **Markdown:** Must support standard markdown + Mermaid + PlantUML
- **Timeline:** MVP delivery targets Q1 2026 (estimated)
- **Team:** Requires 1-2 full-time developers + design/BA support

---

## 9. Success Metrics (KPIs)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Time to Find Artifact** | < 30 seconds | User testing, analytics |
| **User Adoption Rate** | 80%+ team usage within 3 months | Login analytics |
| **Role Dashboard Efficiency** | Reduces role task time by 20% | User feedback survey |
| **Search Relevance** | Top result matches intent 90% of the time | Interaction analytics |
| **Diagram Rendering Success** | 99% of embedded diagrams render correctly | Error logging |
| **System Uptime** | 99.5% availability | Infrastructure monitoring |
| **Page Load Time** | < 2 seconds for dashboard views | Performance monitoring |

---

## 10. Stakeholder Analysis

### Primary Stakeholders

| Stakeholder | Need | Influence | Impact |
|-------------|------|-----------|--------|
| **Product Owner** | Portfolio visibility | High | High |
| **Scrum Masters** | Project/sprint status | High | High |
| **Functional Analysts** | Feature navigation | Medium | High |
| **All Technical Roles** | Quick artifact access | Medium | High |

### Secondary Stakeholders

| Stakeholder | Need | Influence | Impact |
|-------------|------|-----------|--------|
| **New Team Members** | Onboarding/learning | Low | Medium |
| **DevOps/Admin** | System maintenance | Medium | Low |

---

## 11. Business Rules & Constraints

### Naming Convention Constraints

The viewer **MUST** respect TeamSpec naming conventions and cannot change them:

- Products use 3-4 char prefix (PRX)
- Features: `f-{PRX}-{NNN}-*.md`
- Feature-Increments: `fi-{PRX}-{NNN}-*.md`
- Epics: `epic-{PRX}-{NNN}-*.md`
- Stories: `s-e{EEE}-{SSS}-*.md` (epic ID in filename)
- Dev Plans: `dp-e{EEE}-s{SSS}-*.md`
- Test Cases: `tc-fi-{PRX}-{NNN}-*.md`
- Regression Tests: `rt-f-{PRX}-{NNN}-*.md`

### File Structure Constraints

The viewer must parse without modifying:
- `products/{product-id}/` structure
- `projects/{project-id}/` structure
- All artifact file locations and naming patterns
- Markdown content (read-only)

### Artifact Relationships

The viewer must support computing:
- **Feature ↔ Feature-Increment:** Matched by PRX-NNN pattern
- **Epic ↔ Story:** Story filename encodes epic ID (s-e{EEE}-*)
- **Story ↔ Dev Plan:** DP filename encodes story ID (dp-e{EEE}-s{SSS}-*)
- **Feature-Increment ↔ Test Cases:** Matched by FI ID
- **Feature ↔ Regression Tests:** Matched by feature ID

---

## 12. Decisions Made

> Business decisions from this analysis should be logged in /decisions/

| Decision ID | Summary | Link |
|-------------|---------|------|
| dec-TSV-001 | Viewer is read-only; no artifact editing in UI | Implicit in BA scope |
| dec-TSV-002 | Markdown is source-of-truth; viewer is caching/index layer | Implicit in BA scope |
| dec-TSV-003 | Role-based filtering is UI feature, not permission control | Implicit in BA scope |
| dec-TSV-004 | MVP targets web-based deployment, not desktop app | Implicit in BA scope |

---

## Document Lifecycle

> ⚠️ **IMPORTANT**: This document is a **planning artifact**.
> 
> After Feature Canon is established and updated through story implementation:
> - This document becomes **historical reference** only
> - The **Feature Canon** (f-TSV-*.md files) is the source of truth for current behavior
> - Do NOT use this document to understand how the system works today
> 
> If you need to know what the system does now, read `/features/f-TSV-*.md`

### Status Transitions

| Status | Meaning |
|--------|---------|
| Draft | Analysis in progress |
| In Review | Stakeholder review |
| **Approved** | Ready for Feature Canon creation |
| Superseded | Feature Canon is now authoritative |

**Current Status:** Approved
**Superseded By:** Feature Canon files (f-TSV-*.md) (when applicable)
**Superseded Date:** ________________

---

## Sources Consulted

- [copilot-instructions.md](../../../.github/copilot-instructions.md) → TeamSpec 4.0 operating model
- User requirements (greenfield product analysis)

## Unresolved Items

- Feature numbering and boundaries (f-TSV-001 through f-TSV-007) → Resolved: 7 features created in Feature Canon
- Exact tech stack and deployment model → Resolved: React+Vite frontend (TA-001), Hono backend (TA-002)
- Backlog ordering mechanism (metadata vs. filename order) → Filename alphabetical order for MVP
- Search algorithm specifics → Full-text grep for MVP; indexing deferred

