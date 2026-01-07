# F-003: Checkout Flow

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | F-003 |
| **Status** | 🟡 In Development |
| **Owner** | @jane-fa |
| **Created** | 2025-07-01 |
| **Last Updated** | 2026-01-06 |

---

## Purpose

Guide customers through a secure and efficient process to complete their purchase, collecting shipping details, selecting delivery options, and processing payment.

---

## Business Value

- **User Impact**: Smooth checkout = completed purchases, happy customers
- **Business Impact**: Primary revenue conversion point
- **Success Metrics**: 
  - Checkout completion rate > 75%
  - Average checkout time < 3 minutes
  - Payment failure rate < 2%

---

## In Scope

- [x] Single-page checkout
- [x] Shipping address form
- [x] Billing address (same as shipping toggle)
- [x] Shipping method selection
- [x] Credit card payment (Stripe)
- [x] Order summary review
- [x] Order confirmation page
- [ ] Guest checkout (in development)
- [ ] PayPal payment (in development)

---

## Actors

- **Customer** — Completes purchase flow
- **Guest User** — Purchases without account (when enabled)
- **Registered User** — Purchases with saved addresses and payment methods

---

## Out of Scope

- [ ] Express checkout (Apple Pay, Google Pay) — planned for AWS-025
- [ ] Buy now, pay later — roadmap Q2 2026
- [ ] Subscription orders — not planned

---

## Current Behavior

> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### Checkout Entry

1. User clicks "Proceed to Checkout" from cart
2. System validates:
   - Cart has at least 1 item
   - All items still in stock
   - User is logged in (guest checkout coming soon)
3. On valid: redirect to `/checkout`
4. On invalid: show error, remain on cart

### Shipping Address

1. User fills address form:
   - Full name (required)
   - Address line 1 (required)
   - Address line 2 (optional)
   - City (required)
   - State/Province (dropdown, required)
   - Postal code (required, validated per country)
   - Country (dropdown, required, default: USA)
   - Phone (required for delivery contact)
2. Saved addresses shown for logged-in users
3. Option to save new address to account

### Shipping Method

1. After address entered, system fetches shipping options
2. Options displayed:
   - Standard (5-7 business days) — $5.99 or FREE over $50
   - Express (2-3 business days) — $12.99
   - Next Day (order by 2pm) — $24.99
3. User selects option; totals update

### Payment

1. User enters card details via Stripe Elements:
   - Card number
   - Expiry date
   - CVC
2. "Billing same as shipping" checked by default
3. If unchecked, billing address form appears

### Order Review & Submit

1. Final review shows:
   - Items, quantities, prices
   - Shipping address
   - Shipping method & cost
   - Payment method (last 4 digits)
   - Subtotal, shipping, tax, total
2. User clicks "Place Order"
3. System processes payment via Stripe
4. On success: create order, send confirmation email, redirect to confirmation
5. On failure: show error, allow retry

### Order Confirmation

1. User lands on `/order/confirmation/{order-id}`
2. Page displays:
   - Order number
   - Estimated delivery date
   - Items ordered
   - Shipping address
   - "Continue Shopping" button
3. Confirmation email sent within 1 minute

---

## Business Rules

| Rule ID | Rule | Source |
|---------|------|--------|
| BR-CHK-001 | Free shipping on orders over $50 | DEC-030 |
| BR-CHK-002 | Next day shipping cutoff is 2pm local time | DEC-032 |
| BR-CHK-003 | Tax calculated based on shipping address | DEC-028 |
| BR-CHK-004 | Orders cannot be modified after payment | DEC-035 |

---

## Edge Cases

- **Payment failure**: Show error, allow retry, do not create order
- **Stock depleted during checkout**: Notify customer, allow removing item
- **Invalid shipping address**: Show validation error, suggest corrections
- **Session timeout**: Preserve cart, redirect to login, resume checkout

---

## Story Ledger

| Story ID | Summary | Sprint | Status |
|----------|---------|--------|--------|
| STORY-150 | Basic checkout page structure | Sprint 5 | ✅ Done |
| STORY-151 | Shipping address form | Sprint 5 | ✅ Done |
| STORY-160 | Shipping method selection | Sprint 6 | ✅ Done |
| STORY-165 | Stripe payment integration | Sprint 7 | ✅ Done |
| STORY-175 | Order confirmation page | Sprint 8 | ✅ Done |
| STORY-201 | Guest checkout | Sprint 12 | 🔄 In Progress |
| STORY-202 | PayPal integration | Sprint 12 | 📋 Backlog |
