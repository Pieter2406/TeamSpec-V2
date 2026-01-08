# 05 — Naming Strategy

> **Document:** TeamSpec 4.0 Naming Conventions  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. Naming Philosophy

### 1.1 Core Principles

1. **Product Prefix (PRX)** — Every product has a unique 3-4 character prefix (e.g., `DIT` for "DnD Initiative Tracker")
2. **Prefixed IDs** — Every artifact type has a unique prefix for instant recognition
3. **Sequential Numbers** — IDs are sequential within their scope (product or project)
4. **Kebab-Case Slugs** — Human-readable portions use lowercase with hyphens
5. **Scope Clarity** — ID scope is clear (product-level vs project-level)

### 1.2 Product Prefix (PRX)

**Definition:** A 3-4 character unique identifier for each product.

| Product Name | PRX | Usage |
|--------------|-----|-------|
| DnD Initiative Tracker | `DIT` | `f-DIT-001-combat.md` |
| Customer Relationship Manager | `CRM` | `f-CRM-001-contacts.md` |
| Enterprise Resource Planning | `ERP` | `f-ERP-001-inventory.md` |

**PRX Rules:**
- 3-4 uppercase characters
- Unique across all products
- Defined in `product.yml`
- Used in ALL artifact filenames

### 1.3 ID Prefix Registry

| Prefix | Artifact | Scope | Example |
|--------|----------|-------|---------|
| `ba-` | Business Analysis | Product | `ba-DIT-001-overview.md` |
| `f-` | Feature | Product | `f-DIT-001-combat-tracker.md` |
| `sd-` | Solution Design | Product | `sd-DIT-001-api-design.md` |
| `ta-` | Technical Architecture | Product | `ta-DIT-001-database.md` |
| `dec-` | Business Decision | Product or Project | `dec-DIT-001-pricing.md` |
| `bai-` | Business Analysis Increment | Project | `bai-DIT-001-new-feature.md` |
| `fi-` | Feature-Increment | Project | `fi-DIT-001-combat-v2.md` |
| `sdi-` | Solution Design Increment | Project | `sdi-DIT-001-api-v2.md` |
| `tai-` | Technical Architecture Increment | Project | `tai-DIT-001-cache.md` |
| `epic-` | Epic | Project | `epic-DIT-001-combat-redesign.md` |
| `s-eXXX-YYY` | Story | Project | `s-e001-001-add-button.md` |
| `dp-` | Dev Plan | Project | `dp-s001-001-tasks.md` |

---

## 2. Product Naming

### 2.1 Product Folder

**Pattern:** `lowercase-with-dashes`

**Rules:**
- Lowercase only
- Hyphens for word separation (no underscores, no spaces)
- 3-50 characters
- Must start with a letter
- Must be unique across all products

**Examples:**
| ✅ Valid | ❌ Invalid | Reason |
|----------|------------|--------|
| `dnd-initiative-tracker` | `DnDInitiativeTracker` | No uppercase |
| `user-management` | `user_management` | No underscores |
| `api-gateway` | `api gateway` | No spaces |
| `crm` | `1-crm` | Must start with letter |
| `order-service-v2` | `order--service` | No double hyphens |

### 2.2 Product Prefix (PRX)

Every product has a unique 3-4 character prefix:

**Pattern:** `3-4 UPPERCASE characters`

**Rules:**
- Must be unique across all products
- Defined in `product.yml`
- Used in ALL artifact filenames

**Examples:**
| Product | PRX | Why |
|---------|-----|-----|
| DnD Initiative Tracker | `DIT` | **D**nD **I**nitiative **T**racker |
| Customer Relationship Manager | `CRM` | Standard acronym |
| Checkout System | `CHK` | **Ch**ec**k**out |
| User Management | `USR` | **Us**e**r** |

### 2.3 product.yml

The `product.yml` must contain both the folder ID and the PRX:

```yaml
# products/dnd-initiative-tracker/product.yml
product:
  id: "dnd-initiative-tracker"  # Must match folder name
  prefix: "DIT"                  # Product prefix (PRX)
  name: "DnD Initiative Tracker"
  description: "Combat initiative and turn tracker for D&D 5e"
```

---

## 3. Feature Naming (Product Level)

### 3.1 Feature Files

**Pattern:** `f-PRX-XXX-description.md`

**Components:**
- `f-` — Fixed prefix (lowercase)
- `PRX` — Product prefix (e.g., `DIT`)
- `-XXX` — Sequential number (3+ digits, zero-padded)
- `-description` — Kebab-case description
- `.md` — Markdown extension

**Examples:**
| ✅ Valid | ❌ Invalid | Reason |
|----------|------------|--------|
| `f-DIT-001-combat.md` | `f-DIT-1-combat.md` | Needs 3+ digits |
| `f-CRM-042-contacts.md` | `f-crm-042-contacts.md` | PRX must be uppercase |
| `f-ERP-100-inventory.md` | `F-ERP-100-inventory.md` | Prefix must be lowercase |
| `f-USR-001-auth.md` | `feature-USR-001-auth.md` | Wrong prefix |

### 3.2 Feature ID Scope

Features are scoped to their **product** via PRX. The combination of PRX + number must be unique:

```
products/
├── dnd-initiative-tracker/
│   └── features/
│       ├── f-DIT-001-combat-tracker.md    # Unique: DIT-001
│       └── f-DIT-002-round-tracking.md    # Unique: DIT-002
├── user-management/
│   └── features/
│       ├── f-USR-001-authentication.md    # Unique: USR-001
│       └── f-USR-002-profile-settings.md  # Unique: USR-002
```

---

## 4. Feature-Increment Naming (Project Level)

### 4.1 Feature-Increment Files

**Pattern:** `fi-PRX-XXX-description.md`

**Components:**
- `fi-` — Fixed prefix (Feature-Increment, lowercase)
- `PRX` — Product prefix (e.g., `DIT`)
- `-XXX` — Sequential number (3+ digits, zero-padded)
- `-description` — Kebab-case description
- `.md` — Markdown extension

**Examples:**
| ✅ Valid | ❌ Invalid | Reason |
|----------|------------|--------|
| `fi-DIT-001-combat-v2.md` | `fi-DIT-1-combat-v2.md` | Needs 3+ digits |
| `fi-CRM-015-contacts-update.md` | `FI-CRM-015-contacts.md` | Prefix must be lowercase |
| `fi-ERP-100-inventory-sync.md` | `f-ERP-100-inventory.md` | Wrong prefix (f vs fi) |

### 4.2 Feature-Increment ID Scope

Feature-Increments are scoped to their **project** but include the product PRX for traceability:

```
projects/
├── project-alpha/
│   └── feature-increments/
│       ├── fi-DIT-001-combat-v2.md       # Modifies DIT product
│       └── fi-DIT-002-round-tracker.md   # Modifies DIT product
├── project-beta/
│   └── feature-increments/
│       ├── fi-CRM-001-contacts-v2.md     # Modifies CRM product
│       └── fi-CRM-002-sync-update.md     # Modifies CRM product
```

### 4.3 Feature-Increment → Feature Traceability

Each FI must reference the product feature it modifies:

```markdown
# fi-DIT-001-combat-v2

## Target

| Field | Value |
|-------|-------|
| **Product** | dnd-initiative-tracker (DIT) |
| **Feature** | f-DIT-001-combat-tracker |

## AS-IS
Reference: [f-DIT-001-combat-tracker](../../products/dnd-initiative-tracker/features/f-DIT-001-combat-tracker.md)

## TO-BE
[Changes proposed...]
```

---

## 5. Epic Naming

### 5.1 Epic Files

**Pattern:** `epic-PRX-XXX-description.md`

**Components:**
- `epic-` — Fixed prefix (lowercase)
- `PRX` — Product prefix (e.g., `DIT`)
- `-XXX` — Sequential number (3+ digits, zero-padded)
- `-description` — Kebab-case description
- `.md` — Markdown extension

**Examples:**
| ✅ Valid | ❌ Invalid | Reason |
|----------|------------|--------|
| `epic-DIT-001-combat-redesign.md` | `epic-DIT-1-combat.md` | Needs 3+ digits |
| `epic-CRM-042-onboarding.md` | `EPIC-CRM-042-onboarding.md` | Prefix must be lowercase |
| `epic-ERP-100-inventory.md` | `e-ERP-100-inventory.md` | Wrong prefix |

### 5.2 Epic ID Scope

Epics are scoped to their **project** but include the product PRX for traceability.

---

## 6. Story Naming

### 6.1 Story Files

**Pattern:** `s-eXXX-YYY-description.md`

**Components:**
- `s-` — Fixed prefix (Story, lowercase)
- `eXXX` — Epic number (e.g., `e001`)
- `-YYY` — Story sequence within epic (e.g., `001`)
- `-description` — Kebab-case description
- `.md` — Markdown extension

**Key Change:** Stories now embed their Epic ID in the filename!

**Examples:**
| ✅ Valid | ❌ Invalid | Reason |
|----------|------------|--------|
| `s-e001-001-add-button.md` | `s-001-add-button.md` | Missing epic reference |
| `s-e042-003-update-total.md` | `s-e42-003-update-total.md` | Epic needs 3 digits |
| `s-e001-142-new-feature.md` | `S-e001-142-new-feature.md` | Prefix must be lowercase |

### 6.2 Story ID Scope

Stories are scoped to their **project** and **epic**:

```
projects/project-alpha/stories/
├── backlog/
│   ├── s-e001-001-add-initiative-btn.md    # Epic 001, Story 001
│   └── s-e001-002-sort-combatants.md       # Epic 001, Story 002
├── ready-to-refine/
│   └── s-e002-001-round-counter.md         # Epic 002, Story 001
└── ready-to-develop/
    └── s-e001-003-turn-indicator.md        # Epic 001, Story 003
```

### 6.3 Story → Epic Traceability

The Epic ID is embedded in the filename, providing instant traceability:
- `s-e001-*` → Links to `epic-PRX-001-*.md`
- `s-e042-*` → Links to `epic-PRX-042-*.md`

---

## 7. Other Artifact Naming

### 7.1 Business Analysis (Product Level)

**Pattern:** `ba-PRX-XXX-description.md`

**Example:** `ba-DIT-001-overview.md`

### 7.2 Business Analysis Increment (Project Level)

**Pattern:** `bai-PRX-XXX-description.md`

**Example:** `bai-DIT-001-new-feature.md`

### 7.3 Solution Design (Product Level)

**Pattern:** `sd-PRX-XXX-description.md`

**Example:** `sd-DIT-001-api-design.md`

### 7.4 Solution Design Increment (Project Level)

**Pattern:** `sdi-PRX-XXX-description.md`

**Example:** `sdi-DIT-001-api-v2.md`

### 7.5 Technical Architecture (Product Level)

**Pattern:** `ta-PRX-XXX-description.md`

**Example:** `ta-DIT-001-database.md`

### 7.6 Technical Architecture Increment (Project Level)

**Pattern:** `tai-PRX-XXX-description.md`

**Example:** `tai-DIT-001-cache.md`

### 7.7 Decision Naming

**Product Level:** `dec-PRX-XXX-description.md`
- Example: `dec-DIT-001-pricing.md`

**Project Level:** `dec-XXX-description.md` (no PRX needed)
- Example: `dec-001-sprint-scope.md`

### 7.8 Dev Plan Naming

**Pattern:** `dp-sXXX-YYY-description.md` (mirrors story ID)

**Example:** `dp-s001-001-implementation.md` (dev plan for `s-e001-001-*.md`)

---

## 8. Index Files

### 8.1 Product Index Files

| File | Purpose | Location |
|------|---------|----------|
| `products-index.md` | Master product registry | `products/` |
| `features-index.md` | Product features | `products/{id}/features/` |
| `story-ledger.md` | Change history | `products/{id}/features/` |

### 8.2 Project Index Files

| File | Purpose | Location |
|------|---------|----------|
| `projects-index.md` | Master project registry | `projects/` |
| `increments-index.md` | Increment registries | `projects/{id}/*-increments/` |
| `epics-index.md` | Epic registry | `projects/{id}/epics/` |
| `sprints-index.md` | Sprint history | `projects/{id}/sprints/` |

---

## 9. ID Generation Strategy

### 9.1 Sequential ID Generation

When creating new artifacts, the next ID is determined by:

1. Scan existing files in the folder
2. Extract all IDs matching the pattern
3. Find the highest number
4. Add 1
5. Zero-pad to 3 digits (or match existing digit count)

**Example Implementation:**
```javascript
function getNextId(folder, prefix, prx) {
  const files = fs.readdirSync(folder);
  let maxId = 0;
  
  // Pattern: prefix-PRX-XXX or s-eXXX-YYY
  const pattern = prefix === 's-' 
    ? /^s-e\d{3}-(\d{3})/  // Story pattern
    : new RegExp(`^${prefix}${prx}-(\\d{3,})`);
  
  for (const file of files) {
    const match = file.match(pattern);
    if (match) {
      const id = parseInt(match[1], 10);
      if (id > maxId) maxId = id;
    }
  }
  
  const nextId = maxId + 1;
  const digits = Math.max(3, String(maxId).length);
  return String(nextId).padStart(digits, '0');
}

// Usage
const nextFeatureId = getNextId(featuresDir, 'f-', 'DIT');
// Returns "004" if highest is f-DIT-003
```

### 9.2 Story ID Generation

Stories require both Epic number and sequence:

```javascript
function getNextStoryId(folder, epicNum) {
  const epicPattern = `e${String(epicNum).padStart(3, '0')}`;
  const files = fs.readdirSync(folder);
  let maxId = 0;
  
  const pattern = new RegExp(`^s-${epicPattern}-(\\d{3,})`);
  
  for (const file of files) {
    const match = file.match(pattern);
    if (match) {
      const id = parseInt(match[1], 10);
      if (id > maxId) maxId = id;
    }
  }
  
  return String(maxId + 1).padStart(3, '0');
}

// Usage: getNextStoryId(storiesDir, 1) 
// Returns "004" if highest for e001 is s-e001-003
```

### 9.3 ID Gaps

ID gaps are allowed and expected:
- If `f-DIT-001`, `f-DIT-002`, `f-DIT-004` exist, next ID is `f-DIT-005`
- Gaps indicate deleted/removed artifacts
- Never reuse IDs

---

## 10. Cross-Reference Patterns

### 10.1 Referencing Across Scopes

**From Project to Product Feature:**
```markdown
Reference: [f-DIT-001-combat](../../../products/dnd-initiative-tracker/features/f-DIT-001-combat.md)
```

**From Story to Epic:**
```markdown
**Epic:** [epic-DIT-001-combat-redesign](../epics/epic-DIT-001-combat-redesign.md)
```

**From Feature-Increment to Product Feature:**
```markdown
**Target Feature:** products/dnd-initiative-tracker → [f-DIT-003-round-tracking](../../../products/dnd-initiative-tracker/features/f-DIT-003-round-tracking.md)
```

### 10.2 ID-Only References

When full paths are not needed (within same scope):
```markdown
This story implements epic-DIT-001.
This FI modifies f-DIT-003 in dnd-initiative-tracker.
Related: s-e001-001, s-e001-002, s-e001-003
```

---

## 11. Summary: ID Pattern Quick Reference

| Artifact | Pattern | Scope | Example |
|----------|---------|-------|---------|
| Product (folder) | `lowercase-dashes` | Global | `dnd-initiative-tracker` |
| Product (prefix) | `PRX` (3-4 chars) | Global | `DIT` |
| Business Analysis | `ba-PRX-XXX-slug.md` | Product | `ba-DIT-001-overview.md` |
| Feature | `f-PRX-XXX-slug.md` | Product | `f-DIT-001-combat.md` |
| Solution Design | `sd-PRX-XXX-slug.md` | Product | `sd-DIT-001-api.md` |
| Tech Architecture | `ta-PRX-XXX-slug.md` | Product | `ta-DIT-001-database.md` |
| Decision (product) | `dec-PRX-XXX-slug.md` | Product | `dec-DIT-001-pricing.md` |
| BA Increment | `bai-PRX-XXX-slug.md` | Project | `bai-DIT-001-new-feat.md` |
| Feature-Increment | `fi-PRX-XXX-slug.md` | Project | `fi-DIT-001-combat-v2.md` |
| SD Increment | `sdi-PRX-XXX-slug.md` | Project | `sdi-DIT-001-api-v2.md` |
| TA Increment | `tai-PRX-XXX-slug.md` | Project | `tai-DIT-001-cache.md` |
| Epic | `epic-PRX-XXX-slug.md` | Project | `epic-DIT-001-combat.md` |
| Story | `s-eXXX-YYY-slug.md` | Project | `s-e001-001-add-button.md` |
| Decision (project) | `dec-XXX-slug.md` | Project | `dec-001-scope.md` |
| Dev Plan | `dp-sXXX-YYY-slug.md` | Project | `dp-s001-001-tasks.md` |
| Sprint | `sprint-N` | Project | `sprint-5` |
