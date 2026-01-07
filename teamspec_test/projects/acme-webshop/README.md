# ACME Webshop Project

> **Example TeamSpec Project** — This is a fictive project demonstrating the recommended folder structure.

## Project Overview

E-commerce platform for ACME retail with product catalog, shopping cart, and checkout capabilities.

## Folder Structure

```
acme-webshop/
├── project.yml                 # Project metadata and configuration
├── README.md                   # This file
│
├── adr/                        # Architecture Decision Records
│   ├── ADR-001-frontend-framework.md
│   └── ADR-002-payment-architecture.md
│
├── decisions/                  # Business decisions
│   ├── decision-log.md         # Index of all decisions
│   ├── DEC-001-shipping-strategy.md
│   └── DEC-003-guest-checkout.md
│
├── dev-plans/                  # Development task breakdowns (sprint-agnostic)
│   └── story-201-tasks.md      # One file per story
│
├── features/                   # Feature Canon (source of truth)
│   ├── features-index.md       # Index of all features
│   ├── story-ledger.md         # Story-to-feature tracking
│   ├── AWS-001-product-catalog.md
│   ├── AWS-002-shopping-cart.md
│   ├── AWS-003-checkout-flow.md
│   └── storymaps/
│       ├── README.md
│       └── checkout-journey.md
│
├── epics/                      # Epic definitions
│   └── EPIC-003-checkout-payments.md
│
└── stories/                    # User stories by workflow state
    ├── backlog/                # New stories, not yet refined
    │   └── STORY-202-paypal-integration.md
    ├── ready-to-refine/        # Stories awaiting dev refinement
    │   └── STORY-203-wishlist-add.md
    └── ready-for-development/  # Stories ready for sprint
        └── STORY-201-guest-checkout.md
```

## Key Concepts Demonstrated

### 1. Feature Canon
The `/features/` folder is the **single source of truth** for system behavior. Stories describe changes (deltas) to features, not full behavior.

### 2. Story Workflow Folders
Stories move through folders as they progress:
- `backlog/` → New stories
- `ready-to-refine/` → Awaiting dev input
- `ready-for-development/` → Sprint-ready

### 3. Decision Tracking
Business decisions (`/decisions/`) are linked to features and stories, providing traceability.

### 4. Architecture Decision Records
Technical decisions (`/adr/`) document architectural choices with context and rationale.

### 5. Development Plans
Task breakdowns (`/dev-plans/`) live in sprint folders and link to stories.

## Team

| Role | Name |
|------|------|
| Product Owner | @product-lead |
| Functional Analyst | @jane-fa |
| Functional Analyst | @mike-fa |
| Developer | @dev-sarah |
| Developer | @dev-tom |
| QA Lead | @qa-lead |

## Status

| Metric | Value |
|--------|-------|
| Active Features | 4 |
| In Development | 2 |
| Stories in Backlog | 1 |
| Current Sprint | Sprint 12 |
