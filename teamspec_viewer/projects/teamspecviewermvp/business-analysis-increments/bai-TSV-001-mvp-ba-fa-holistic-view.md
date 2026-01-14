---
# === LLM Retrieval Metadata ===
artifact_kind: bai
spec_version: "4.0"
template_version: "4.0.1"

# === Ownership ===
role_owner: BA
artifact_type: Project Execution
canonicity: project-execution
lifecycle: project-bound

# === Naming ===
id_pattern: "bai-TSV-001"
filename_pattern: "bai-TSV-001-mvp-ba-fa-holistic-view.md"

# === Required Relationships ===
links_required:
  - type: business-analysis
    pattern: "ba-TSV-001"
    optional: false
  - type: feature-increment
    pattern: "fi-TSV-*"
    optional: true

# === Search Optimization ===
keywords:
  - business analysis increment
  - BAI
  - MVP
  - role dashboard
  - BA view
  - FA view
  - artifact navigation
aliases:
  - BA/FA MVP increment
anti_keywords:
  - technical design
  - implementation
  - story

# === Generation Contract ===
completion_rules:
  placeholders: "Fill {braces} only"
  required_sections:
    - Overview
    - Business Context
---

# Business Analysis Increment: `bai-TSV-001-mvp-ba-fa-holistic-view`

> **ID:** bai-TSV-001  
> **Product:** teamspec-viewer (TSV)  
> **Project:** teamspecviewermvp  
> **Target BA:** ba-TSV-001-viewer-platform  
> **Target Feature:** {TBD}  
> **Status:** proposed

---

**Document Owner:** BA (Business Analyst)  
**Artifact Type:** Business Analysis Increment (Project)  
**Lifecycle:** Project-scoped, merged to Product BA after approval

---

## Metadata

| Field | Value |
| :--- | :--- |
| **BAI ID** | bai-TSV-001 |
| **Status** | Proposed |
| **Date** | 2026-01-14 |
| **Author** | {TBD} |
| **Target BA** | [ba-TSV-001-viewer-platform](../../products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md) |
| **Feature Increment** | {TBD} |

---

## 1. Overview

> **Contract:** Brief description of the business analysis increment.

This BAI refines the MVP delivery focus for TeamSpec Viewer to prioritize **two roles first: BA and FA**, with the goal of creating a **holistic, human-friendly documentation view** that proves the value of TeamSpec-structure-aware navigation.

This increment does not change the product intent of TeamSpec Viewer; it clarifies MVP scope slicing so that early delivery maximizes documentation comprehension and artifact relationship visibility for analysis-centric roles.

---

## 2. Business Context

> **Contract:** Business problem, stakeholders, and goals for this increment.

### 2.1 Business Problem

The product BA defines broad MVP capabilities across roles. For MVP delivery sequencing, an analysis-first slice is needed so stakeholders can validate the core business value quickly:
- Humans can navigate TeamSpec documentation without mastering file naming conventions
- Relationships between BA and FA artifacts become visible and explorable
- The portal experience becomes a reliable entry point for documentation understanding

### 2.2 Stakeholders

- Business Analyst (BA)
- Functional Analyst (FA)
- Product Owner (PO)
- Scrum Master (SM)

### 2.3 Business Goals

- Deliver an MVP that materially improves the ability of BA and FA users to understand documentation state and change proposals
- Validate that TeamSpec-structure-aware navigation produces better comprehension than generic markdown readers
- Establish a baseline “portfolio → product → project → artifact relationships” navigation model that can be extended to other roles later

---

## 3. AS-IS (Current Product BA)

> _Auto-populated from Product Business Analysis. DO NOT EDIT unless correcting errors._

### 1. Executive Summary

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

### 3. Scope

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

## 4. TO-BE (Project Business Analysis)

### 4.1 New/Changed Business Capabilities

This MVP increment proposes a **delivery focus** (not a change in final product scope):

1. **Role-first MVP: BA + FA only (initial release slice)**
   - BA users can view: business analysis documents and BA increments, and see how they relate to projects and change proposals
   - FA users can view: features, feature-increments, epics, and stories, and see how they relate to products and projects

2. **Holistic documentation view across BA ↔ FA artifacts**
   - Users can traverse relationships between:
     - Product BA → Feature Canon references
     - Feature → Feature-Increment (TO-BE changes)
     - Project → Epics → Stories
   - The viewer presents an integrated “documentation graph” experience oriented around understanding and analysis

3. **Portfolio-to-artifact navigation baseline**
   - Product list and product selection
   - Product → impacted projects
   - Project → epics and stories

4. **Markdown readability baseline for analysis**
   - Render markdown in a consistent reading experience for BA and FA artifacts
   - Diagram rendering remains in scope for BA/FA readability (diagram syntax support is validated via the BA/FA slice)

### 4.2 Success Metrics

| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| Time to Find Artifact | {TBD} | < 30 seconds | MVP release |
| Search Relevance | {TBD} | Top result matches intent 90% of the time | MVP release |

### 4.3 Out of Scope

- Role dashboards for DEV, QA, SA, SM, DES in the initial MVP slice (deferred to later increments)
- Any change to TeamSpec naming conventions (the viewer remains read-only and structure-respecting)

---

## 5. Impact Analysis

### 5.1 Affected Stakeholders

| Stakeholder | Impact | Notes |
|-------------|--------|-------|
| BA | High | Primary user of BA artifacts and relationship navigation |
| FA | High | Primary user of feature/FI/epic/story navigation |
| PO | Medium | Portfolio visibility is impacted by MVP sequencing decisions |
| SM | Medium | Project execution visibility benefits from epic/story overview |

### 5.2 Organizational Impact

This increment changes how documentation is consumed (not authored): it provides a single, consistent entry point for BA/FA roles to read, understand, and traverse TeamSpec documentation.

### 5.3 Dependencies

- PO approval for MVP slicing and sequencing
- FA agreement on initial artifact relationship pathways to prioritize

---

## 6. Integration Notes

### 6.1 Product BA Alignment

This BAI aligns with the product BA by keeping the same MVP capability set, but proposes focusing delivery on BA and FA first to validate:
- navigation value
- artifact relationship value
- documentation comprehension outcomes

### 6.2 Merge Strategy

After project completion (or after MVP release), the product BA should be updated via a BA increment sync decision to reflect:
- MVP sequencing (BA/FA first)
- confirmed success metric baselines and measured outcomes

---

## 7. Review & Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| BA (Author) | {TBD} | ✅ | 2026-01-14 |
| PO | {TBD} | ⏳ | {TBD} |
| FA | {TBD} | ⏳ | {TBD} |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-01-14 | {TBD} | Initial proposed increment |

---

## Sources Consulted

- templates/bai-template.md → Entire document (structure and required sections)
- teamspec_viewer/projects/teamspecviewermvp/project.yml → `project.id`, `target_products`
- teamspec_viewer/products/teamspec-viewer/business-analysis/ba-TSV-001-viewer-platform.md → Sections 1 (Executive Summary), 3 (Scope)

## Unresolved Items

- Author/approver names → {TBD} (not provided)
- Target feature and related `fi-TSV-*` reference → {TBD} (FA artifacts not created yet)
- Measured baselines for success metrics → {TBD} (requires measurement plan/analytics)
