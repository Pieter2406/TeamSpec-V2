# DEC-003: Enable Guest Checkout

## Metadata

| Field | Value |
|-------|-------|
| **Decision ID** | DEC-003 |
| **Status** | ✅ Approved |
| **Date** | 2025-11-15 |
| **Owner** | @product-lead |
| **Stakeholders** | @marketing, @data-team, @jane-fa |

---

## Context

Currently, users must create an account to complete checkout. Analytics show 23% cart abandonment at the "Create Account" step. We need to decide whether to allow guest checkout.

## Options Considered

### Option A: Keep Mandatory Account Creation
- Pros: More customer data, easier re-marketing
- Cons: High abandonment, friction

### Option B: Guest Checkout with Post-Purchase Account Offer
- Pros: Lower friction, can still capture account creation post-purchase
- Cons: Less data upfront

### Option C: Guest Checkout Only (Remove Accounts)
- Pros: Simplest UX
- Cons: Lose all relationship features

## Decision

**Option B: Enable guest checkout with post-purchase account creation offer**

## Rationale

- Industry data shows 35% of shoppers abandon carts if forced to create account
- Post-purchase account creation converts at ~40% (with incentive)
- We'll still collect email for order updates, enabling marketing

## Implementation Details

- Guest checkout available via checkbox on checkout entry
- Email required for order confirmation/tracking
- After order: "Create account to track orders and earn rewards" CTA
- Guest orders visible in admin, searchable by email

## Impact

- Expected 15-20% improvement in checkout conversion
- Marketing will offer 10% off next order for account creation

## Features Affected

- [AWS-003](../features/AWS-003-checkout-flow.md) — Checkout Flow
- [AWS-004](../features/AWS-004-customer-accounts.md) — Customer Accounts

## Stories Created

- STORY-201: Guest checkout flow
