# 07 — Migration Guide

> **Document:** TeamSpec 2.0 → 4.0 Migration Guide  
> **Status:** Planning  
> **Last Updated:** 2026-01-09

---

## 1. Migration Overview

### 1.1 What Changes

| Aspect | 2.0 | 4.0 |
|--------|-----|-----|
| Source of Truth | Project Features | **Product Features** |
| Features Location | `projects/*/features/` | `products/*/features/` |
| Feature Naming | `F-XXX-*.md` | `f-PRX-XXX-*.md` |
| Project Features | Canon | **Feature-Increments** (deltas) |
| FI Naming | — | `fi-PRX-XXX-*.md` |
| Story Naming | `S-XXX-*.md` | `s-eXXX-YYY-*.md` |
| Story Linking | → Feature | → **Epic** (in filename) |
| Canon Updates | During project | **After deployment** |
| New Role | — | **Product Owner (PO)** |
| Product Prefix | — | **PRX** (3-4 chars) |

### 1.2 Migration Path

```
┌─────────────────────────────────────────────────────────────────────┐
│                      MIGRATION OVERVIEW                             │
│                                                                     │
│  2.0 Workspace                    4.0 Workspace                     │
│  ─────────────                    ─────────────                     │
│                                                                     │
│  projects/                        products/                         │
│  └── my-project/                  └── my-product/ (PRX: MYP)        │
│      └── features/                    └── features/                 │
│          └── F-001-auth.md                └── f-MYP-001-auth.md     │
│                                                                     │
│                                   projects/                         │
│                                   └── my-project/                   │
│                                       ├── feature-increments/       │
│                                       │   └── fi-MYP-001-*.md       │
│                                       ├── epics/                    │
│                                       │   └── epic-MYP-001-*.md     │
│                                       └── stories/                  │
│                                           └── s-e001-001-*.md       │
│                                                                     │
│  File Renames:                                                      │
│  F-XXX-*.md     →  f-PRX-XXX-*.md                                   │
│  features/*.md  →  fi-PRX-XXX-*.md (in projects)                    │
│  EPIC-XXX-*.md  →  epic-PRX-XXX-*.md                                │
│  S-XXX-*.md     →  s-eXXX-YYY-*.md                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Pre-Migration Checklist

### 2.1 Backup Your Workspace

```bash
# Create backup before migration
git add -A
git commit -m "Pre-migration backup"
git tag "pre-v4-migration"
```

### 2.2 Run 2.0 Linter

```bash
teamspec lint
```

Fix all errors before migrating. Warnings can be addressed post-migration.

### 2.3 Inventory Your Features

Document all features across projects:

| Project | Feature ID | Feature Name | Status |
|---------|------------|--------------|--------|
| my-project | F-001 | User Authentication | Active |
| my-project | F-002 | Shopping Cart | Active |

### 2.4 Identify Product Boundaries

Decide how to group features into products:

**Option A: Single Product (Simple)**
- All features → one product
- Best for: Single application, monolith

**Option B: Multiple Products (Complex)**
- Group features by domain/bounded context
- Best for: Microservices, multiple applications

---

## 3. Automated Migration

### 3.1 Basic Migration

```bash
# Preview migration
teamspec migrate --dry-run

# Execute migration
teamspec migrate
```

### 3.2 Migration with Auto-Fix

```bash
# Migrate and auto-fix issues
teamspec migrate --fix
```

### 3.3 Migration with Custom Product ID

```bash
# Specify product ID
teamspec migrate --product checkout-system
```

### 3.4 Multi-Product Migration

For workspaces that should become multiple products:

```bash
# First pass: migrate features to first product
teamspec migrate --product product-a

# Manually move features to second product
# Then update project.yml target_products
```

---

## 4. Step-by-Step Manual Migration

### 4.1 Step 1: Create Products Folder

```bash
mkdir -p products
```

Create `products/products-index.md`:

```markdown
# Products Index

## Product Registry

| ID | Name | Status | Active Projects |
|----|------|--------|-----------------|
| my-product | My Product | active | my-project |
```

### 4.2 Step 2: Create Product Structure

```bash
mkdir -p products/my-product/{business-analysis,features,solution-designs,technical-architecture,decisions}
```

Create `products/my-product/product.yml`:

```yaml
product:
  id: "my-product"
  prefix: "MYP"           # Product prefix (3-4 chars)
  name: "My Product"
  description: |
    Migrated from TeamSpec 2.0
  status: active
  
  owner:
    role: PO
    name: "TBD"

active_projects:
  - project_id: "my-project"
    started: 2026-01-09
```

### 4.3 Step 3: Migrate Features to Product

Copy and rename features from project to product:

```bash
# Copy and rename feature files (F-XXX → f-PRX-XXX)
for f in projects/my-project/features/F-*.md; do
  num=$(basename "$f" | sed 's/F-\([0-9]*\).*/\1/')
  name=$(basename "$f" | sed 's/F-[0-9]*-//')
  cp "$f" "products/my-product/features/f-MYP-${num}-${name}"
done

# Copy index files
cp projects/my-project/features/features-index.md products/my-product/features/
cp projects/my-project/features/story-ledger.md products/my-product/features/
```

### 4.4 Step 4: Convert Project Features to Feature-Increments

Rename the folder:

```bash
mv projects/my-project/features projects/my-project/feature-increments
```

Convert F-XXX files to fi-PRX-XXX files:

**Before (F-001-auth.md):**
```markdown
# F-001: User Authentication

## Purpose
Enable users to log in...

## Current Behavior
Users can log in with email/password...
```

**After (fi-MYP-001-auth-enhancement.md):**
```markdown
# fi-MYP-001: Auth Enhancement

## Target

| Field | Value |
|-------|-------|
| **Product** | my-product (MYP) |
| **Feature** | f-MYP-001-auth |

## AS-IS

Reference: [f-MYP-001-auth](../../../products/my-product/features/f-MYP-001-auth.md)

Current: Users can log in with email/password.

## TO-BE

Add OAuth login support:
- Google OAuth
- GitHub OAuth

## Business Rules Affected

- BR-001: Login flow (modified)

## Impact

- [x] Adds Behavior
- [ ] Changes Behavior
- [ ] Fixes Behavior
- [ ] Removes Behavior
```

Create `increments-index.md`:

```markdown
# Feature-Increments Index

## Increment Registry

| ID | Target Product | Target Feature | Status | Epic |
|----|----------------|----------------|--------|------|
| fi-MYP-001 | my-product | f-MYP-001 | In Progress | epic-MYP-001 |
```

### 4.5 Step 5: Update Project.yml

Add `target_products` section:

```yaml
# project.yml
project:
  id: "my-project"
  name: "My Project"
  status: active
  
  owner:
    role: BA
    name: "Jane Doe"

target_products:
  - product_id: "my-product"
    product_prefix: "MYP"
    impact: major
    features_affected:
      - f-MYP-001
      - f-MYP-002
```

### 4.6 Step 6: Create/Update Epics

Ensure all stories link to epics:

```markdown
# epic-MYP-001: OAuth Integration

## Description
Add social login options to the authentication system.

## Feature-Increments

- [fi-MYP-001-auth-enhancement](../feature-increments/fi-MYP-001-auth-enhancement.md)

## TO-BE State

Users will be able to:
- Log in with Google
- Log in with GitHub
- Link social accounts to existing accounts

## Stories

- s-e001-001: Add Google OAuth button
- s-e001-002: Add GitHub OAuth button
- s-e001-003: Account linking flow
```

### 4.7 Step 7: Update Stories

Rename stories to include Epic ID and update links:

**Before (S-001-add-google-oauth.md):**
```markdown
# S-001: Add Google OAuth Button

**Feature:** [F-001](../features/F-001-auth.md)
...
```

**After (s-e001-001-add-google-oauth.md):**
```markdown
# s-e001-001: Add Google OAuth Button

**Epic:** [epic-MYP-001](../epics/epic-MYP-001-oauth-integration.md)
**Feature-Increment:** [fi-MYP-001](../feature-increments/fi-MYP-001-auth-enhancement.md)

## Before

Users can only log in with email/password.

## After

Users can click "Sign in with Google" button.

## Acceptance Criteria
...
```

**File rename pattern:**
```bash
# S-001-*.md → s-e001-001-*.md (for Epic 001, Story 001)
# S-002-*.md → s-e001-002-*.md (for Epic 001, Story 002)
```

### 4.8 Step 8: Update .teamspec Core

```bash
teamspec update
```

Or manually copy new files:
- `.teamspec/agents/AGENT_PO.md`
- `.teamspec/templates/feature-increment-template.md`
- Updated `teamspec.yml`

### 4.9 Step 9: Run Linter

```bash
teamspec lint
```

Address any remaining issues.

---

## 5. Post-Migration Tasks

### 5.1 Verify Bidirectional Links

Ensure product.yml and project.yml reference each other:

```bash
# In product.yml
active_projects:
  - project_id: "my-project"

# In project.yml  
target_products:
  - product_id: "my-product"
```

### 5.2 Update copilot-instructions.md

```bash
teamspec generate-prompts
```

Or manually update `.github/copilot-instructions.md` with 4.0 content.

### 5.3 Team Communication

Notify team of changes:
- New PO role required
- Stories now link to Epics
- Features are now in products folder
- Canon updates happen after deployment

### 5.4 Clean Up

After verifying migration:

```bash
# Remove backup folders
rm -rf projects/my-project/features.migrated

# Commit changes
git add -A
git commit -m "Migrated to TeamSpec 4.0"
```

---

## 6. Troubleshooting

### 6.1 Common Issues

#### Issue: Duplicate Feature IDs Across Projects

**Symptom:** Multiple projects have F-001

**Solution:**
- Decide which is the "canonical" version
- Migrate canonical version to product
- Rename others or convert to FI files

#### Issue: Stories Don't Have Epics

**Symptom:** TS-STORY-006 errors

**Solution:**
- Create epics for logical story groupings
- Update stories with Epic links
- Or use `ts:fix` to auto-create placeholder epics

#### Issue: Missing Target Products

**Symptom:** TS-PROJ-003 errors

**Solution:**
- Ensure product exists in products/
- Add product to project.yml target_products
- Add project to product.yml active_projects

### 6.2 Rollback

If migration fails:

```bash
git reset --hard pre-v4-migration
```

---

## 7. Migration Scenarios

### 7.1 Single Project → Single Product

Most common scenario.

```
Before:
projects/
└── my-project/
    └── features/
        ├── F-001-auth.md
        └── F-002-cart.md

After:
products/
└── my-product/
    └── features/
        ├── F-001-auth.md
        └── F-002-cart.md

projects/
└── my-project/
    └── feature-increments/
        └── (empty until new changes needed)
```

### 7.2 Multiple Projects → Single Product

Projects sharing the same domain.

```
Before:
projects/
├── project-a/features/F-001-auth.md
└── project-b/features/F-002-cart.md

After:
products/
└── shared-product/
    └── features/
        ├── F-001-auth.md
        └── F-002-cart.md

projects/
├── project-a/
│   └── feature-increments/
└── project-b/
    └── feature-increments/
```

### 7.3 Single Project → Multiple Products

Project spans multiple domains.

```
Before:
projects/
└── monolith/features/
    ├── F-001-auth.md
    ├── F-002-payments.md
    └── F-003-shipping.md

After:
products/
├── user-system/features/F-001-auth.md
├── payment-system/features/F-002-payments.md
└── logistics/features/F-003-shipping.md

projects/
└── monolith/
    ├── feature-increments/
    └── project.yml (targets all 3 products)
```

---

## 8. Migration Checklist

### Pre-Migration
- [ ] Backup workspace (git commit/tag)
- [ ] Run `teamspec lint` and fix errors
- [ ] Document feature inventory
- [ ] Decide product boundaries
- [ ] Identify PO for each product

### Migration
- [ ] Run `teamspec migrate` (or manual steps)
- [ ] Create product structure
- [ ] Migrate features to products
- [ ] Convert project features to feature-increments
- [ ] Update project.yml with target_products
- [ ] Create/update epics
- [ ] Add Epic links to stories

### Post-Migration
- [ ] Run `teamspec lint` and fix issues
- [ ] Update .teamspec core files
- [ ] Update copilot-instructions.md
- [ ] Verify bidirectional links
- [ ] Notify team
- [ ] Clean up backup files
- [ ] Commit changes
