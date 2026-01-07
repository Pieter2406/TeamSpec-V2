# S-202: PayPal Payment Integration

> **Template Version**: 1.0  
> **Last Updated**: 2026-01-04

---

## User Story

**As a** customer who prefers PayPal,  
**I want** to pay with my PayPal account,  
**So that** I don't need to enter my credit card details.

| Metadata | |
| :--- | :--- |
| **Status** | Backlog |
| **Estimate** | 5 Points |
| **Author** | @jane-fa |
| **Sprint** | - |

---

## Linked Project

| Project ID | Name |
|------------|------|
| [acme-webshop](../../project.yml) | ACME Webshop Platform |

---

## Linked Epic

| Epic ID | Epic Name |
|---------|-----------|
| EPIC-003 | Checkout & Payments |

---

## Linked Feature

| Feature ID | Feature Name |
|------------|--------------|
| [F-003](../../features/F-003-checkout-flow.md) | Checkout Flow |

---

## Feature Impact

### Impact Type

- [x] **Adds Behavior** — New capability not currently in the feature

### Delta Description

**Before (current behavior):**  
Only credit card payment via Stripe is available.

**After (new behavior):**  
- PayPal button displayed as payment option
- Users can authenticate with PayPal popup
- PayPal transactions processed and recorded alongside card payments

---

## Decision References

| Decision ID | Summary | Impact on This Story |
|-------------|---------|----------------------|
| [DEC-002](../../decisions/DEC-002-payment-providers.md) | Payment provider selection | PayPal approved as secondary provider |

---

## Acceptance Criteria (AC)

### AC1: PayPal Button Display
**Given** I am on the payment step of checkout  
**When** the page loads  
**Then** I should see a PayPal button below the credit card form

### AC2: PayPal Authentication
**Given** I click the PayPal button  
**When** the PayPal popup opens  
**Then** I should be able to log in to my PayPal account  
**And** approve the payment

### AC3: PayPal Payment Success
**Given** I approve payment in PayPal  
**When** I return to the checkout  
**Then** my order should be placed  
**And** I should see the confirmation page  
**And** payment method should show "PayPal"

### AC4: PayPal Payment Failure
**Given** I cancel the PayPal popup  
**When** I return to checkout  
**Then** I should remain on the payment step  
**And** see message "PayPal payment was cancelled"

---

## Technical Notes

- Use PayPal JavaScript SDK (v5)
- Server-side order creation via PayPal REST API
- Capture payment on order submission

---

## Definition of Ready Checklist

- [x] User story follows format
- [x] Acceptance criteria are testable
- [x] Feature link provided
- [x] Decision link provided
- [ ] Estimate refined by dev team
- [ ] PayPal sandbox credentials obtained
- [ ] UX mockups approved

---

## Blockers

- Awaiting PayPal sandbox credentials from @ops-lead
