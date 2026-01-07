# EPIC-003: Checkout & Payments

## Metadata

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-003 |
| **Status** | 🟡 In Progress |
| **Owner** | @product-lead |
| **Created** | 2025-05-15 |
| **Target Completion** | 2026-Q1 |

---

## Vision

Enable customers to seamlessly complete purchases through a secure, flexible checkout experience that supports multiple payment methods and shipping options.

---

## Business Value

- **Revenue Impact**: Direct conversion path from cart to order
- **Customer Satisfaction**: Smooth checkout = repeat customers
- **Competitive Parity**: Guest checkout and PayPal are table stakes

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Checkout completion rate | 72% | 80% |
| Average checkout time | 4.2 min | < 3 min |
| Payment failure rate | 2.8% | < 2% |

---

## Features in Scope

| Feature ID | Feature | Status |
|------------|---------|--------|
| [AWS-003](../features/AWS-003-checkout-flow.md) | Checkout Flow | 🟡 In Dev |

---

## Key Decisions

| Decision | Summary |
|----------|---------|
| [DEC-001](../decisions/DEC-001-shipping-strategy.md) | Free shipping over $50 |
| [DEC-002](../decisions/DEC-002-payment-providers.md) | Stripe + PayPal |
| [DEC-003](../decisions/DEC-003-guest-checkout.md) | Guest checkout enabled |

---

## Release Plan

### Release 1: MVP Checkout ✅
- Basic checkout flow
- Credit card payments
- Logged-in users only

### Release 2: Enhanced Checkout (Current)
- Guest checkout
- PayPal integration
- Improved mobile UX

### Release 3: Express Checkout (Planned)
- Apple Pay
- Google Pay
- One-click reorder

---

## Dependencies

- AWS-002 (Shopping Cart) — must be complete
- Stripe account setup
- PayPal merchant account

---

## Risks

| Risk | Mitigation |
|------|------------|
| Payment integration complexity | Start with Stripe, add PayPal later |
| PCI compliance | Use hosted payment forms |
| Cart abandonment | Guest checkout, progress indicators |

---

## Stories

| Story | Summary | Status |
|-------|---------|--------|
| STORY-150 | Checkout page structure | ✅ Done |
| STORY-151 | Shipping address form | ✅ Done |
| STORY-160 | Shipping method selection | ✅ Done |
| STORY-165 | Stripe integration | ✅ Done |
| STORY-175 | Confirmation page | ✅ Done |
| STORY-201 | Guest checkout | 🔄 In Progress |
| STORY-202 | PayPal integration | 📋 Backlog |
