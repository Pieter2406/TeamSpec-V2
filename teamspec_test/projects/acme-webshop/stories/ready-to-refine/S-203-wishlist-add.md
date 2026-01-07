# S-203: Wishlist - Add Product

> **Template Version**: 1.0  
> **Last Updated**: 2026-01-05

---

## User Story

**As a** logged-in customer,  
**I want** to save products to my wishlist,  
**So that** I can easily find them later when I'm ready to buy.

| Metadata | |
| :--- | :--- |
| **Status** | Ready to Refine |
| **Estimate** | 3 Points |
| **Author** | @mike-fa |
| **Sprint** | - |

---

## Linked Project

| Project ID | Name |
|------------|------|
| [acme-webshop](../../project.yml) | ACME Webshop Platform |

---

## Linked Feature

| Feature ID | Feature Name |
|------------|--------------|
| [F-002](../../features/F-002-shopping-cart.md) | Shopping Cart |

---

## Linked Epic

| Epic ID | Epic Name |
|---------|-----------|
| [EPIC-003](../../epics/EPIC-003-checkout-payments.md) | Checkout & Payments |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature

### Delta Description

**Before (current behavior):**  
N/A — Wishlist feature does not exist yet.

**After (new behavior):**  
- Heart icon on product cards and detail pages
- Clicking heart adds product to user's wishlist
- Heart filled state indicates product is in wishlist

---

## Acceptance Criteria (AC)

### AC1: Add to Wishlist from Product Card
**Given** I am logged in  
**And** I am viewing a product listing  
**When** I click the heart icon on a product card  
**Then** the product should be added to my wishlist  
**And** the heart icon should become filled

### AC2: Add to Wishlist from Product Page
**Given** I am logged in  
**And** I am on a product detail page  
**When** I click "Add to Wishlist"  
**Then** the product should be added to my wishlist  
**And** the button should change to "In Wishlist"

### AC3: Not Logged In
**Given** I am not logged in  
**When** I click a wishlist heart icon  
**Then** I should see a prompt to log in or create an account

---

## Definition of Ready Checklist

- [x] User story follows format
- [x] Acceptance criteria are testable
- [x] Feature link provided
- [ ] UX mockups reviewed
- [ ] API design discussed with dev

---

## Questions for Refinement

1. Should guests be able to wishlist with session storage?
2. Maximum items in wishlist?
