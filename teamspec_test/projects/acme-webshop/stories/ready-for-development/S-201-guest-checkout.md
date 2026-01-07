# S-201: Guest Checkout Flow

> **Template Version**: 1.0  
> **Last Updated**: 2026-01-06

---

## User Story

**As a** first-time shopper,  
**I want** to complete my purchase without creating an account,  
**So that** I can quickly buy what I need without friction.

| Metadata | |
| :--- | :--- |
| **Status** | In Progress |
| **Estimate** | 8 Points |
| **Author** | @jane-fa |
| **Sprint** | Sprint 12 |

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
Users must be logged in to access checkout. Clicking "Proceed to Checkout" as a guest redirects to login/register page.

**After (new behavior):**  
- Users can proceed to checkout without logging in
- Email field added to checkout for order confirmation
- Guest orders trackable via order number + email
- Post-purchase CTA offered to create account

---

## Decision References

| Decision ID | Summary | Impact on This Story |
|-------------|---------|----------------------|
| [DEC-003](../../decisions/DEC-003-guest-checkout.md) | Enable guest checkout | Business approval for guest checkout flow |

---

## Acceptance Criteria (AC)

### AC1: Guest Checkout Entry
**Given** I am not logged in  
**And** I have items in my cart  
**When** I click "Proceed to Checkout"  
**Then** I should see the checkout page (not login redirect)  
**And** I should see an email input field for order confirmation

### AC2: Email Validation
**Given** I am on guest checkout  
**When** I enter an invalid email format  
**Then** I should see validation error "Please enter a valid email"  
**And** I should not be able to submit payment

### AC3: Order Confirmation Email
**Given** I complete a guest checkout  
**When** payment succeeds  
**Then** I should receive order confirmation email within 1 minute  
**And** email should include order number and tracking link

### AC4: Post-Purchase Account Offer
**Given** I complete a guest checkout  
**When** I land on the confirmation page  
**Then** I should see "Create an account for 10% off your next order"  
**And** I should be able to set a password to convert to registered user

### AC5: Guest Order Lookup
**Given** I completed a guest order  
**When** I visit `/order/track`  
**And** I enter my order number and email  
**Then** I should see my order status and details

---

## Out of Scope

- Converting existing guest orders to account (future story)
- Social login for guests
- Saved addresses for guests

---

## Technical Notes

- Session-based cart already works for guests (AWS-002)
- Stripe accepts guest payments (no account linking needed)
- Email service already configured for transactional emails

### Architecture Reference

See [ADR-002: Payment Provider Architecture](../../adr/ADR-002-payment-architecture.md) for payment integration approach.

### Test Cases

- [TC-201-guest-checkout.md](../../test-cases/TC-201-guest-checkout.md) - E2E test scenarios

---

## Definition of Ready Checklist

- [x] User story follows format
- [x] Acceptance criteria are testable
- [x] Feature link provided
- [x] Decision link provided
- [x] Estimate assigned
- [x] No blocking dependencies
- [x] UX mockups available (in Figma)

---

## Development Plan

See: [story-201-tasks.md](../../dev-plans/story-201-tasks.md)
