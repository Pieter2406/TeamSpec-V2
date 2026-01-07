# DEC-001: Free Shipping Threshold

## Metadata

| Field | Value |
|-------|-------|
| **Decision ID** | DEC-001 |
| **Status** | ✅ Approved |
| **Date** | 2025-06-01 |
| **Owner** | @product-lead |
| **Stakeholders** | @finance, @ops-lead, @marketing |

---

## Context

We need to determine the free shipping threshold for our webshop. This affects customer conversion, average order value, and fulfillment costs.

## Options Considered

### Option A: No Free Shipping
- Pros: Maximizes shipping revenue
- Cons: Higher cart abandonment, lower competitive position

### Option B: Free Shipping over $35
- Pros: Aligns with competitor pricing
- Cons: May not cover fulfillment costs on smaller orders

### Option C: Free Shipping over $50
- Pros: Covers fulfillment costs, encourages larger orders
- Cons: Slightly higher threshold than some competitors

## Decision

**Option C: Free shipping on orders over $50**

## Rationale

- Average order value is currently $42; threshold encourages +$8 upsell
- Fulfillment cost analysis shows break-even at $45 order value
- Marketing can promote "Only $X more for free shipping" upsell

## Impact

- Applies to standard shipping only
- Express and Next Day still incur fees
- Promotional codes can override (e.g., holiday free shipping)

## Features Affected

- [AWS-003](../features/AWS-003-checkout-flow.md) — Checkout Flow

## Review Date

2026-06-01 — Review threshold based on AOV trends
