# 01 — Folder Structure Changes

> **Document:** TeamSpec 4.0 Folder Structure  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. New Top-Level Structure

### 1.1 Overview

TeamSpec 4.0 introduces `products/` as a first-class citizen alongside `projects/`.

**PRX** = Product Prefix (e.g., `DIT` for "DnD Initiative Tracker")

```
{workspace}/
├── .teamspec/                    # Core framework (unchanged location)
│   ├── agents/                   # Agent prompts (+ AGENT_PO.md)
│   ├── definitions/              # DoR/DoD checklists
│   ├── profiles/                 # Profile overlays
│   ├── templates/                # Document templates (updated)
│   ├── context/                  # Team configuration
│   │   ├── team.yml              # Team metadata
│   │   └── _schema.yml           # Context schema
│   └── teamspec.yml              # Core configuration
│
├── products/                     # NEW: Production truth
│   ├── products-index.md         # Master product registry
│   └── {product-id}/             # e.g., dnd-initiative-tracker
│       ├── product.yml           # Product metadata (PO owns)
│       ├── README.md             # Product overview
│       ├── business-analysis/    # Business analysis documents
│       │   └── ba-PRX-XXX-*.md   # e.g., ba-DIT-001-overview.md
│       ├── features/             # CANONICAL Feature Canon
│       │   ├── features-index.md # Feature registry
│       │   ├── story-ledger.md   # Change history
│       │   └── f-PRX-XXX-*.md    # e.g., f-DIT-001-combat.md
│       ├── solution-designs/     # Solution design documents
│       │   └── sd-PRX-XXX-*.md   # e.g., sd-DIT-001-api.md
│       ├── technical-architecture/  # Production ADRs
│       │   └── ta-PRX-XXX-*.md   # e.g., ta-DIT-001-database.md
│       └── decisions/            # Production business decisions
│           └── dec-PRX-XXX-*.md  # e.g., dec-DIT-001-pricing.md
│
├── projects/                     # Change initiatives
│   ├── projects-index.md         # Master project registry
│   └── {project-id}/             # Individual project
│       ├── project.yml           # Project metadata (BA owns)
│       ├── README.md             # Project overview
│       ├── business-analysis-increments/  # BA increment proposals
│       │   ├── increments-index.md
│       │   └── bai-PRX-XXX-*.md  # e.g., bai-DIT-001-new-feat.md
│       ├── feature-increments/   # PROPOSED changes to product Canon
│       │   ├── increments-index.md
│       │   └── fi-PRX-XXX-*.md   # e.g., fi-DIT-001-combat-v2.md
│       ├── solution-design-increments/  # SD increment proposals
│       │   ├── increments-index.md
│       │   └── sdi-PRX-XXX-*.md  # e.g., sdi-DIT-001-api-v2.md
│       ├── epics/                # Epic definitions (ELEVATED importance)
│       │   ├── epics-index.md
│       │   └── epic-PRX-XXX-*.md # e.g., epic-DIT-001-combat.md
│       ├── stories/              # Stories (MUST link to Epic)
│       │   ├── backlog/
│       │   ├── ready-to-refine/
│       │   ├── ready-to-develop/
│       │   └── s-eXXX-YYY-*.md   # e.g., s-e001-001-add-button.md
│       ├── technical-architecture-increments/  # Project ADRs
│       │   ├── increments-index.md
│       │   └── tai-PRX-XXX-*.md  # e.g., tai-DIT-001-cache.md
│       ├── decisions/            # Project-specific decisions
│       │   └── dec-XXX-*.md
│       ├── dev-plans/            # Development plans
│       │   └── dp-eXXX-sYYY-*.md  # e.g., dp-e001-s001-tasks.md
│       ├── qa/                   # QA artifacts
│       │   ├── test-cases/
│       │   ├── bugs/
│       │   └── uat/
│       └── sprints/              # Sprint tracking
│           ├── sprints-index.md
│           └── sprint-N/
│
└── .github/
    └── copilot-instructions.md   # Updated for 4.0
```

---

## 2. Product Structure Details

### 2.1 `products/` Root

```
products/
├── products-index.md             # Master registry of all products
└── {product-id}/                 # One folder per product
```

**products-index.md** — Registry file containing:
- List of all products with status
- Product ownership information
- Cross-references to projects modifying each product

### 2.2 Individual Product Folder

```
products/{product-id}/            # e.g., dnd-initiative-tracker (PRX: DIT)
├── product.yml                   # Product definition
├── README.md                     # Product overview
├── business-analysis/            # Business analysis documents
│   ├── README.md
│   └── ba-PRX-XXX-*.md           # e.g., ba-DIT-001-overview.md
├── features/                     # CANONICAL Feature Canon
│   ├── features-index.md         # Feature registry
│   ├── story-ledger.md           # History of all changes
│   └── f-PRX-XXX-*.md            # e.g., f-DIT-001-combat-tracker.md
├── solution-designs/             # Solution design documents
│   ├── README.md
│   └── sd-PRX-XXX-*.md           # e.g., sd-DIT-001-api-design.md
├── technical-architecture/       # Production architectural decisions
│   ├── README.md
│   └── ta-PRX-XXX-*.md           # e.g., ta-DIT-001-database.md
└── decisions/                    # Production business decisions
    ├── README.md
    └── dec-PRX-XXX-*.md          # e.g., dec-DIT-001-pricing.md
```

### 2.3 product.yml Schema

```yaml
# Product Configuration
product:
  id: "product-id"
  name: "Product Display Name"
  description: |
    Multi-line description of the product.
  
  # Lifecycle status
  status: active  # active | deprecated | retired | planning
  
  # Product Owner
  owner:
    role: PO
    name: "Product Owner Name"
    contact: "email@example.com"
  
  # Business context
  business:
    domain: "e-commerce"           # Business domain
    value_stream: "checkout"       # Value stream
    criticality: high              # high | medium | low
  
  # Technical context
  technical:
    repositories: []               # Git repos
    environments:
      production: "prod-url"
      staging: "staging-url"
  
  # Governance
  governance:
    change_control: true           # Requires formal change control
    audit_required: true           # Requires audit trail
    approval_chain:                # Who approves changes
      - role: PO
      - role: BA

# Projects currently modifying this product
active_projects:
  - project_id: "project-alpha"
    started: 2026-01-01
    target_release: 2026-Q2
```

---

## 3. Project Structure Changes

### 3.1 Key Changes from 2.0

| Folder | 2.0 | 4.0 | Change Type |
|--------|-----|-----|-------------|
| `features/` | Feature Canon | `feature-increments/` | **RENAMED** |
| — | — | `business-analysis-increments/` | **NEW** |
| — | — | `solution-design-increments/` | **NEW** |
| `adr/` | ADRs | `technical-architecture-increments/` | **RENAMED** |
| `epics/` | Optional grouping | Required increment container | **ELEVATED** |
| `stories/` | Links to features | Links to epics (`s-eXXX-YYY`) | **MODIFIED** |
| `ready-for-development/` | Folder name | `ready-to-develop/` | **RENAMED** |
| Others | — | — | Unchanged |

### 3.2 project.yml Schema (Updated)

```yaml
# Project Configuration
project:
  id: "project-id"
  name: "Project Display Name"
  description: |
    Multi-line description of the project.
  
  # Lifecycle status
  status: active  # planning | active | paused | completed | archived
  
  # Project ownership
  owner:
    role: BA
    name: "Business Analyst Name"
  
  # Timeline
  timeline:
    started: 2026-01-01
    target_completion: 2026-06-30
    actual_completion: null
  
  # Business justification
  business_case:
    objective: "Brief objective"
    success_metrics:
      - metric: "KPI name"
        target: "Target value"

# NEW: Products this project modifies (many-to-many)
target_products:
  - product_id: "checkout-system"
    impact: major              # major | minor | patch
    features_affected:
      - F-001
      - F-003
  - product_id: "user-management"
    impact: minor
    features_affected:
      - F-012

# Stakeholders and roles (unchanged from 2.0)
stakeholders:
  - name: "Stakeholder Name"
    role: "Business Sponsor"
    
roles:
  - BA
  - FA
  - SA
  - DEV
  - QA
  - SM
```

### 3.3 Increment Folders

Projects contain multiple increment types:

```
projects/{project-id}/
├── business-analysis-increments/
│   ├── increments-index.md
│   └── bai-PRX-XXX-*.md          # e.g., bai-DIT-001-new-feature.md
├── feature-increments/
│   ├── increments-index.md
│   └── fi-PRX-XXX-*.md           # e.g., fi-DIT-001-combat-v2.md
├── solution-design-increments/
│   ├── increments-index.md
│   └── sdi-PRX-XXX-*.md          # e.g., sdi-DIT-001-api-v2.md
└── technical-architecture-increments/
    ├── increments-index.md
    └── tai-PRX-XXX-*.md          # e.g., tai-DIT-001-cache.md
```

**Increment Documents** describe:
- Which product artifact they modify (reference to product document)
- AS-IS state (current production state)
- TO-BE state (proposed changes)
- Business rules / technical decisions affected
- Impact classification

### 3.4 Story Naming Convention

Stories now include the Epic ID in their filename:

```
stories/
├── backlog/
│   └── s-e001-001-add-initiative-button.md
├── ready-to-refine/
│   └── s-e001-002-sort-by-initiative.md
└── ready-to-develop/
    └── s-e001-003-combat-round-tracker.md
```

**Pattern:** `s-eXXX-YYY-description.md`
- `s-` = Story prefix
- `eXXX` = Epic number (e.g., `e001`)
- `YYY` = Story sequence within epic (e.g., `001`)
- `description` = Kebab-case description

---

## 4. CLI Implications

### 4.1 New CLI Commands Required

| Command | Purpose |
|---------|---------|
| `teamspec init` | Updated to handle products vs projects |
| `teamspec migrate` | NEW: Migrate 2.0 workspace to 4.0 |
| `teamspec lint` | Updated to validate new structure |

### 4.2 CLI Detection Logic

The CLI must detect workspace version:

```javascript
function detectWorkspaceVersion(targetDir) {
  const productsDir = path.join(targetDir, 'products');
  const teamspecYml = path.join(targetDir, '.teamspec', 'teamspec.yml');
  
  if (fs.existsSync(productsDir)) {
    return '4.0';  // Has products folder
  }
  
  if (fs.existsSync(teamspecYml)) {
    const content = fs.readFileSync(teamspecYml, 'utf-8');
    if (content.includes('version: "4.0"')) return '4.0';
    if (content.includes('version: "2.0"')) return '2.0';
  }
  
  // Check for projects folder (2.0 style)
  const projectsDir = path.join(targetDir, 'projects');
  if (fs.existsSync(projectsDir)) {
    return '2.0';  // Legacy workspace
  }
  
  return 'none';  // Fresh workspace
}
```

### 4.3 CLI Initialization Flow (4.0)

```
teamspec init
  │
  ├─→ Detect existing workspace version
  │     ├─→ None: Fresh install flow
  │     ├─→ 2.0: Prompt for migration
  │     └─→ 4.0: Update flow
  │
  ├─→ Fresh Install Flow
  │     ├─→ Ask: Create product or project first?
  │     │     ├─→ Product: ts:po product → ts:ba project
  │     │     └─→ Project: Create implicit product, link it
  │     ├─→ Deploy .teamspec/ (4.0 version)
  │     └─→ Create initial structure
  │
  └─→ Migration Flow (see 07-MIGRATION-GUIDE.md)
```

---

## 5. Prompt/Agent Implications

### 5.1 Bootstrap Agent Changes

**AGENT_BOOTSTRAP.md** must be updated:

1. **New Canon Rules** — Add CANON-007, CANON-008
2. **Document Hierarchy** — Update diagram to show products → projects → stories
3. **Folder References** — Update all path references
4. **Quality Gates** — Add deployment gate

### 5.2 Path Resolution Changes

All agents need updated path resolution:

```markdown
# 2.0 Path Resolution
Feature Canon: projects/{project-id}/features/F-XXX.md

# 4.0 Path Resolution
Product Canon: products/{product-id}/features/F-XXX.md
Feature-Increment: projects/{project-id}/feature-increments/FI-XXX.md
```

### 5.3 Cross-Reference Logic

Agents must understand:
- **Product Features** are read-only during project execution
- **Feature-Increments** are the writable project artifacts
- **After deployment**, Feature-Increments merge into Product Features

---

## 6. Many-to-Many Relationship Tracking

### 6.1 Product Side

In `products/{product-id}/product.yml`:

```yaml
active_projects:
  - project_id: "project-alpha"
    started: 2026-01-01
  - project_id: "project-beta"
    started: 2026-02-15
```

### 6.2 Project Side

In `projects/{project-id}/project.yml`:

```yaml
target_products:
  - product_id: "checkout-system"
    features_affected: [F-001, F-003]
  - product_id: "user-management"
    features_affected: [F-012]
```

### 6.3 Consistency Validation

The linter must validate bidirectional consistency:
- If project X lists product Y in `target_products`, product Y should list project X in `active_projects`
- Warning if mismatch detected

---

## 7. Impact Summary

| Component | Impact Level | Changes Required |
|-----------|--------------|------------------|
| Folder structure | **HIGH** | New `products/` tree, renamed `feature-increments/` |
| CLI init | **HIGH** | New initialization flow, migration support |
| CLI lint | **HIGH** | New rules for products, updated paths |
| Agents | **MEDIUM** | Path updates, new product-awareness |
| Templates | **MEDIUM** | New product templates, renamed feature-increment |
| Copilot instructions | **MEDIUM** | Updated for 4.0 concepts |
