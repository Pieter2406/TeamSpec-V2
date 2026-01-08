# 04 — Linter Changes

> **Document:** TeamSpec 4.0 Linting Rules  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. Linter Rule Categories

### 1.1 Rule Category Overview

| Category | Prefix | 2.0 Rules | 4.0 Rules | Change |
|----------|--------|-----------|-----------|--------|
| **Product** | `TS-PROD` | — | 5 | NEW |
| **Feature-Increment** | `TS-FI` | — | 4 | NEW |
| **Project** | `TS-PROJ` | 2 | 4 | EXPANDED |
| **Epic** | `TS-EPIC` | — | 3 | NEW |
| **Feature** | `TS-FEAT` | 3 | 3 | MODIFIED |
| **Story** | `TS-STORY` | 5 | 6 | EXPANDED |
| **ADR** | `TS-ADR` | 3 | 3 | MODIFIED |
| **Dev Plan** | `TS-DEVPLAN` | 2 | 2 | UNCHANGED |
| **DoD** | `TS-DOD` | 2 | 3 | EXPANDED |
| **Naming** | `TS-NAMING` | 6 | 8 | EXPANDED |

---

## 2. New Rule Category: TS-PROD (Products)

### TS-PROD-001: Product folder must be registered

**Severity:** ERROR  
**Owner:** PO

**Description:**  
Every product folder must be registered in `products-index.md`.

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  const indexPath = path.join(ctx.workspaceDir, 'products', 'products-index.md');
  
  if (!fs.existsSync(indexPath)) {
    // If no products folder, skip (may be 2.0 workspace)
    return results;
  }
  
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  for (const productId of ctx.products) {
    if (!indexContent.includes(productId)) {
      results.push({
        ruleId: 'TS-PROD-001',
        severity: SEVERITY.ERROR,
        file: path.join(ctx.workspaceDir, 'products', productId),
        message: `Product '${productId}' is not registered in products-index.md`,
        owner: 'PO',
      });
    }
  }
  
  return results;
}
```

---

### TS-PROD-002: product.yml required with minimum metadata

**Severity:** ERROR  
**Owner:** PO

**Required Fields:**
- `product.id`
- `product.prefix` (PRX - 3-4 uppercase characters)
- `product.name`
- `product.status`
- `product.owner`

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  const requiredFields = ['id', 'prefix', 'name', 'status', 'owner'];
  
  for (const productId of ctx.products) {
    const ymlPath = path.join(ctx.workspaceDir, 'products', productId, 'product.yml');
    
    if (!fs.existsSync(ymlPath)) {
      results.push({
        ruleId: 'TS-PROD-002',
        severity: SEVERITY.ERROR,
        file: ymlPath,
        message: `product.yml is missing for product '${productId}'`,
        owner: 'PO',
      });
      continue;
    }
    
    const yaml = parseProductYaml(ymlPath);
    
    for (const field of requiredFields) {
      if (!yaml.product || !yaml.product[field]) {
        results.push({
          ruleId: 'TS-PROD-002',
          severity: SEVERITY.ERROR,
          file: ymlPath,
          message: `product.yml is missing required field: 'product.${field}'`,
          owner: 'PO',
        });
      }
    }
    
    // Validate prefix format (3-4 uppercase chars)
    if (yaml.product?.prefix && !/^[A-Z]{3,4}$/.test(yaml.product.prefix)) {
      results.push({
        ruleId: 'TS-PROD-002',
        severity: SEVERITY.ERROR,
        file: ymlPath,
        message: `product.prefix must be 3-4 uppercase characters, got: '${yaml.product.prefix}'`,
        owner: 'PO',
      });
    }
  }
  
  return results;
}
```

---

### TS-PROD-003: Product-Project bidirectional consistency

**Severity:** WARNING  
**Owner:** PO/BA

**Description:**  
If a project lists a product in `target_products`, the product should list the project in `active_projects` (and vice versa).

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  
  // Build project -> products map
  const projectToProducts = new Map();
  for (const projectId of ctx.projects) {
    const projectYml = loadProjectYaml(projectId);
    const targets = projectYml.target_products || [];
    projectToProducts.set(projectId, targets.map(t => t.product_id));
  }
  
  // Build product -> projects map
  const productToProjects = new Map();
  for (const productId of ctx.products) {
    const productYml = loadProductYaml(productId);
    const active = productYml.active_projects || [];
    productToProjects.set(productId, active.map(a => a.project_id));
  }
  
  // Check consistency
  for (const [projectId, products] of projectToProducts) {
    for (const productId of products) {
      const projectsInProduct = productToProjects.get(productId) || [];
      if (!projectsInProduct.includes(projectId)) {
        results.push({
          ruleId: 'TS-PROD-003',
          severity: SEVERITY.WARNING,
          file: path.join(ctx.workspaceDir, 'products', productId, 'product.yml'),
          message: `Project '${projectId}' targets product '${productId}' but product doesn't list it in active_projects`,
          owner: 'PO/BA',
        });
      }
    }
  }
  
  return results;
}
```

---

### TS-PROD-004: Product features-index.md required

**Severity:** ERROR  
**Owner:** PO

**Description:**  
Every product must have a `features/features-index.md` file.

---

### TS-PROD-005: Product story-ledger.md required

**Severity:** ERROR  
**Owner:** PO

**Description:**  
Every product must have a `features/story-ledger.md` file to track change history.

---

## 3. New Rule Category: TS-FI (Feature-Increments)

### TS-FI-001: Feature-Increment must reference product and feature

**Severity:** ERROR  
**Owner:** BA

**Description:**  
Every Feature-Increment must specify:
- Target product ID (and PRX in filename)
- Target feature ID (f-PRX-XXX)

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  
  for (const projectId of ctx.projects) {
    const fiDir = path.join(ctx.workspaceDir, 'projects', projectId, 'feature-increments');
    if (!fs.existsSync(fiDir)) continue;
    
    // Pattern: fi-PRX-XXX-*.md
    const fiFiles = findFiles(fiDir, /^fi-[A-Z]{3,4}-\d{3,}-.*\.md$/);
    
    for (const fiFile of fiFiles) {
      const content = fs.readFileSync(fiFile, 'utf-8');
      
      // Extract PRX from filename
      const prxMatch = path.basename(fiFile).match(/^fi-([A-Z]{3,4})-/);
      const prx = prxMatch ? prxMatch[1] : null;
      
      // Check for product reference
      const hasProduct = /\*\*Target Product\*\*:|product_id:/i.test(content);
      const hasFeature = /\*\*Target Feature\*\*:|f-[A-Z]{3,4}-\d{3,}/i.test(content);
      
      if (!hasProduct) {
        results.push({
          ruleId: 'TS-FI-001',
          severity: SEVERITY.ERROR,
          file: fiFile,
          message: 'Feature-Increment must specify Target Product',
          owner: 'BA',
        });
      }
      
      if (!hasFeature) {
        results.push({
          ruleId: 'TS-FI-001',
          severity: SEVERITY.ERROR,
          file: fiFile,
          message: `Feature-Increment must specify Target Feature (f-${prx}-XXX)`,
          owner: 'BA',
        });
      }
    }
  }
  
  return results;
}
```

---

### TS-FI-002: Feature-Increment must have AS-IS and TO-BE sections

**Severity:** ERROR  
**Owner:** BA/FA

**Description:**  
Every Feature-Increment must have both AS-IS and TO-BE sections describing the change.

---

### TS-FI-003: Feature-Increment target feature must exist in product

**Severity:** ERROR  
**Owner:** BA

**Description:**  
The f-PRX-XXX referenced in a Feature-Increment must exist in the target product's features folder.

---

### TS-FI-004: Feature-Increment IDs must be unique within project

**Severity:** ERROR  
**Owner:** BA

---

## 4. New Rule Category: TS-EPIC (Epics)

### TS-EPIC-001: Epic must link to Feature-Increments

**Severity:** ERROR  
**Owner:** BA

**Description:**  
Every Epic must reference at least one Feature-Increment (fi-PRX-XXX).

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  
  for (const projectId of ctx.projects) {
    const epicsDir = path.join(ctx.workspaceDir, 'projects', projectId, 'epics');
    if (!fs.existsSync(epicsDir)) continue;
    
    // Pattern: epic-PRX-XXX-*.md
    const epicFiles = findFiles(epicsDir, /^epic-[A-Z]{3,4}-\d{3,}-.*\.md$/);
    
    for (const epicFile of epicFiles) {
      const content = fs.readFileSync(epicFile, 'utf-8');
      
      const hasFI = /fi-[A-Z]{3,4}-\d{3,}/.test(content);
      
      if (!hasFI) {
        results.push({
          ruleId: 'TS-EPIC-001',
          severity: SEVERITY.ERROR,
          file: epicFile,
          message: 'Epic must link to at least one Feature-Increment (fi-PRX-XXX)',
          owner: 'BA',
        });
      }
    }
  }
  
  return results;
}
```

---

### TS-EPIC-002: Epic must define TO-BE state

**Severity:** ERROR  
**Owner:** BA/FA

**Description:**  
Every Epic must have a TO-BE section describing the target state.

---

### TS-EPIC-003: Epic IDs must be unique within project

**Severity:** ERROR  
**Owner:** BA

---

## 5. Modified Rule Category: TS-PROJ (Projects)

### TS-PROJ-001: Project folder must be registered (UNCHANGED)

**Severity:** ERROR  
**Owner:** BA

---

### TS-PROJ-002: project.yml required with minimum metadata (MODIFIED)

**Severity:** ERROR  
**Owner:** BA

**New Required Fields (4.0):**
- `project.id`
- `project.name`
- `project.status`
- `project.owner`
- `target_products` (at least one entry)

---

### TS-PROJ-003: Project must target at least one product (NEW)

**Severity:** ERROR  
**Owner:** BA

**Description:**  
Every project must have at least one product in `target_products`.

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  
  for (const projectId of ctx.projects) {
    const ymlPath = path.join(ctx.workspaceDir, 'projects', projectId, 'project.yml');
    
    if (!fs.existsSync(ymlPath)) continue;
    
    const yaml = parseProjectYaml(ymlPath);
    const targets = yaml.target_products || [];
    
    if (targets.length === 0) {
      results.push({
        ruleId: 'TS-PROJ-003',
        severity: SEVERITY.ERROR,
        file: ymlPath,
        message: 'Project must target at least one product in target_products',
        owner: 'BA',
      });
    }
  }
  
  return results;
}
```

---

### TS-PROJ-004: Target products must exist (NEW)

**Severity:** ERROR  
**Owner:** BA

**Description:**  
Products listed in `target_products` must exist in the `products/` folder.

---

## 6. Modified Rule Category: TS-STORY (Stories)

### TS-STORY-001: Story must link to feature (MODIFIED → DEPRECATED)

**Severity:** WARNING (was ERROR)  
**Owner:** FA

**Change:**  
In 4.0, stories link to Epics via filename (`s-eXXX-YYY`), not directly to features. Feature links are optional metadata.

**New Behavior:**  
Warn if no feature reference (for traceability), but don't error.

---

### TS-STORY-006: Story must link to Epic (NEW)

**Severity:** ERROR  
**Owner:** FA

**Description:**  
Every story filename must include the Epic ID using the pattern `s-eXXX-YYY-description.md`.

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  
  for (const projectId of ctx.projects) {
    const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
    
    // Check all story folders
    const storyFolders = ['backlog', 'ready-to-refine', 'ready-to-develop'];
    
    for (const folder of storyFolders) {
      const folderPath = path.join(storiesDir, folder);
      if (!fs.existsSync(folderPath)) continue;
      
      // Pattern: s-eXXX-YYY-*.md
      const storyFiles = findFiles(folderPath, /^s-e\d{3,}-\d{3,}-.*\.md$/);
      
      for (const storyFile of storyFiles) {
        const filename = path.basename(storyFile);
        
        // Extract epic ID from filename
        const match = filename.match(/^s-e(\d{3,})-/);
        if (!match) {
          results.push({
            ruleId: 'TS-STORY-006',
            severity: SEVERITY.ERROR,
            file: storyFile,
            message: 'Story filename must include Epic ID (s-eXXX-YYY-description.md)',
            owner: 'FA',
          });
        }
      }
    }
  }
  
  return results;
}
```

---

### TS-STORY-007: Linked Epic must exist (NEW)

**Severity:** ERROR  
**Owner:** FA

**Description:**  
The Epic ID embedded in the story filename must correspond to an existing epic file.

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  
  for (const projectId of ctx.projects) {
    const storiesDir = path.join(ctx.workspaceDir, 'projects', projectId, 'stories');
    const epicsDir = path.join(ctx.workspaceDir, 'projects', projectId, 'epics');
    
    // Get all epic numbers
    const epicFiles = fs.existsSync(epicsDir) ? fs.readdirSync(epicsDir) : [];
    const epicNumbers = new Set(
      epicFiles
        .map(f => f.match(/^epic-[A-Z]{3,4}-(\d{3,})/))
        .filter(Boolean)
        .map(m => m[1])
    );
    
    // Check all story folders
    const storyFolders = ['backlog', 'ready-to-refine', 'ready-to-develop'];
    
    for (const folder of storyFolders) {
      const folderPath = path.join(storiesDir, folder);
      if (!fs.existsSync(folderPath)) continue;
      
      const storyFiles = findFiles(folderPath, /^s-e\d{3,}-\d{3,}-.*\.md$/);
      
      for (const storyFile of storyFiles) {
        const match = path.basename(storyFile).match(/^s-e(\d{3,})-/);
        if (match && !epicNumbers.has(match[1])) {
          results.push({
            ruleId: 'TS-STORY-007',
            severity: SEVERITY.ERROR,
            file: storyFile,
            message: `Referenced Epic e${match[1]} does not exist in epics folder`,
            owner: 'FA',
          });
        }
      }
    }
  }
  
  return results;
}
```

---

## 7. Modified Rule Category: TS-DOD (Definition of Done)

### TS-DOD-001: Canon sync before Done (MODIFIED)

**Severity:** BLOCKER  
**Owner:** FA

**Change:**  
In 4.0, this checks Feature-Increment completion, not direct Canon update.

**New Logic:**  
Story cannot be Done if:
- It affects behavior
- AND linked Feature-Increment TO-BE is incomplete

---

### TS-DOD-003: Product sync after deployment (NEW)

**Severity:** BLOCKER  
**Owner:** PO

**Description:**  
Project cannot be closed if deployment has occurred but `ts:po sync` has not been executed.

**Check Logic:**
```javascript
async check(ctx) {
  const results = [];
  
  for (const projectId of ctx.projects) {
    const projectYml = loadProjectYaml(projectId);
    
    // Check if project is marked as deployed
    if (projectYml.deployment && projectYml.deployment.deployed_date) {
      // Check if sync has been executed
      if (!projectYml.deployment.canon_synced) {
        results.push({
          ruleId: 'TS-DOD-003',
          severity: SEVERITY.BLOCKER,
          file: path.join(ctx.workspaceDir, 'projects', projectId, 'project.yml'),
          message: 'Project deployed but Product Canon not synced. Run ts:po sync',
          owner: 'PO',
        });
      }
    }
  }
  
  return results;
}
```

---

## 8. Modified Rule Category: TS-NAMING

### New Naming Patterns (4.0)

```javascript
const NAMING_PATTERNS = {
  // Products
  product: /^[a-z][a-z0-9-]*$/,           // folder name
  productPrefix: /^[A-Z]{3,4}$/,          // PRX (3-4 uppercase chars)
  
  // Business Analysis (in products)
  businessAnalysis: /^ba-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Features (in products)
  feature: /^f-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Solution Designs (in products)
  solutionDesign: /^sd-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Technical Architecture (in products)
  techArch: /^ta-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Decisions (product level)
  decisionProduct: /^dec-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // BA Increments (in projects)
  baIncrement: /^bai-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Feature-Increments (in projects)
  featureIncrement: /^fi-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Solution Design Increments (in projects)
  sdIncrement: /^sdi-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Tech Architecture Increments (in projects)
  taIncrement: /^tai-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Epics
  epic: /^epic-[A-Z]{3,4}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Stories (with epic reference)
  story: /^s-e\d{3,}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Decisions (project level)
  decisionProject: /^dec-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Dev Plans
  devPlan: /^dp-s\d{3,}-\d{3,}-[a-z][a-z0-9-]*\.md$/,
  
  // Sprints
  sprint: /^sprint-\d+$/,
};
```

### TS-NAMING-007: Feature-Increment naming (NEW)

**Pattern:** `fi-PRX-XXX-description.md`

**Examples:**
- ✅ `fi-DIT-001-combat-v2.md`
- ✅ `fi-CRM-042-contacts-update.md`
- ❌ `FI-DIT-001-something.md` (prefix must be lowercase)
- ❌ `fi-001-something.md` (missing PRX)

---

### TS-NAMING-008: Product folder naming (NEW)

**Pattern:** `lowercase-with-dashes`

**Examples:**
- ✅ `dnd-initiative-tracker`
- ✅ `user-management`
- ❌ `CheckoutSystem` (no uppercase)
- ❌ `checkout_system` (no underscores)

---

## 9. Linter Implementation Changes

### 9.1 New Context Properties

```javascript
function createLintContext(workspaceDir, targetProject = null) {
  const ctx = {
    workspaceDir,
    
    // 2.0 properties (unchanged)
    projects: findProjects(workspaceDir),
    
    // 4.0 properties (new)
    products: findProducts(workspaceDir),
    workspaceVersion: detectWorkspaceVersion(workspaceDir),
  };
  
  if (targetProject) {
    ctx.projects = ctx.projects.filter(p => p === targetProject);
  }
  
  return ctx;
}

function findProducts(workspaceDir) {
  const productsDir = path.join(workspaceDir, 'products');
  if (!fs.existsSync(productsDir)) return [];
  
  const entries = fs.readdirSync(productsDir, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && e.name !== '.git')
    .map(e => e.name);
}
```

### 9.2 Rule Registration

```javascript
// Add new rule categories
const rules = {
  // Existing rules...
  
  // NEW: Product rules
  'TS-PROD-001': { /* ... */ },
  'TS-PROD-002': { /* ... */ },
  'TS-PROD-003': { /* ... */ },
  'TS-PROD-004': { /* ... */ },
  'TS-PROD-005': { /* ... */ },
  
  // NEW: Feature-Increment rules
  'TS-FI-001': { /* ... */ },
  'TS-FI-002': { /* ... */ },
  'TS-FI-003': { /* ... */ },
  'TS-FI-004': { /* ... */ },
  
  // NEW: Epic rules
  'TS-EPIC-001': { /* ... */ },
  'TS-EPIC-002': { /* ... */ },
  'TS-EPIC-003': { /* ... */ },
  
  // Updated rules...
};
```

### 9.3 Version-Aware Linting

```javascript
async function lint(workspaceDir, options = {}) {
  const ctx = createLintContext(workspaceDir, options.project);
  
  // Determine which rules to run based on version
  const activeRules = Object.entries(rules).filter(([ruleId, rule]) => {
    if (ctx.workspaceVersion === '2.0') {
      // Skip 4.0-only rules in 2.0 workspace
      const v4Rules = ['TS-PROD', 'TS-FI', 'TS-EPIC', 'TS-PROJ-003', 'TS-STORY-006'];
      return !v4Rules.some(prefix => ruleId.startsWith(prefix));
    }
    return true;
  });
  
  // Run rules
  const results = [];
  for (const [ruleId, rule] of activeRules) {
    const ruleResults = await rule.check(ctx);
    results.push(...ruleResults);
  }
  
  return results;
}
```

---

## 10. Rule Summary Table

| Rule ID | Name | Severity | Owner | 2.0 | 4.0 |
|---------|------|----------|-------|-----|-----|
| TS-PROD-001 | Product registration | ERROR | PO | — | ✓ |
| TS-PROD-002 | product.yml metadata | ERROR | PO | — | ✓ |
| TS-PROD-003 | Bidirectional consistency | WARNING | PO/BA | — | ✓ |
| TS-PROD-004 | features-index.md required | ERROR | PO | — | ✓ |
| TS-PROD-005 | story-ledger.md required | ERROR | PO | — | ✓ |
| TS-FI-001 | FI product/feature reference | ERROR | BA | — | ✓ |
| TS-FI-002 | FI AS-IS/TO-BE sections | ERROR | BA/FA | — | ✓ |
| TS-FI-003 | FI target exists | ERROR | BA | — | ✓ |
| TS-FI-004 | FI ID uniqueness | ERROR | BA | — | ✓ |
| TS-EPIC-001 | Epic links to FI | ERROR | BA | — | ✓ |
| TS-EPIC-002 | Epic TO-BE section | ERROR | BA/FA | — | ✓ |
| TS-EPIC-003 | Epic ID uniqueness | ERROR | BA | — | ✓ |
| TS-PROJ-001 | Project registration | ERROR | BA | ✓ | ✓ |
| TS-PROJ-002 | project.yml metadata | ERROR | BA | ✓ | Modified |
| TS-PROJ-003 | Project targets product | ERROR | BA | — | ✓ |
| TS-PROJ-004 | Target products exist | ERROR | BA | — | ✓ |
| TS-STORY-001 | Story feature link | WARNING | FA | ERROR | Demoted |
| TS-STORY-006 | Story Epic link | ERROR | FA | — | ✓ |
| TS-STORY-007 | Linked Epic exists | ERROR | FA | — | ✓ |
| TS-DOD-001 | Canon sync before Done | BLOCKER | FA | ✓ | Modified |
| TS-DOD-003 | Product sync after deploy | BLOCKER | PO | — | ✓ |
| TS-NAMING-007 | FI naming | WARNING | BA | — | ✓ |
| TS-NAMING-008 | Product folder naming | WARNING | PO | — | ✓ |
