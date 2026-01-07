# F-002: Shopping Cart

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | F-002 |
| **Status** | 🟢 Active |
| **Owner** | @jane-fa |
| **Created** | 2025-06-15 |
| **Last Updated** | 2026-01-03 |

---

## Purpose

Allow customers to collect products they intend to purchase, review their selections, and modify quantities before proceeding to checkout.

---

## Business Value

- **User Impact**: Customers can shop at their own pace without losing selections
- **Business Impact**: Critical conversion point; cart abandonment = lost revenue
- **Success Metrics**: 
  - Cart-to-checkout rate > 65%
  - Average items per cart > 2.3
  - Cart abandonment rate < 70%

---

## In Scope

- [x] Add products to cart
- [x] Remove products from cart
- [x] Update quantities
- [x] Cart persistence (logged in users)
- [x] Guest cart (session-based)
- [x] Cart summary in header
- [x] Promotional code application
- [x] Cart merge on login

---

## Actors

- **Customer** — Adds and manages items in cart
- **Guest User** — Session-based cart storage
- **Registered User** — Persistent cart across sessions

---

## Out of Scope

- [ ] Save cart for later — planned for AWS-020
- [ ] Share cart — not planned
- [ ] Cart reservation (inventory hold) — enterprise roadmap

---

## Current Behavior

> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### Add to Cart

1. User clicks "Add to Cart" on product page or listing
2. System validates:
   - Product is in stock
   - Requested quantity available
   - Variant selected (if applicable)
3. On success:
   - Add item to cart (or increment quantity if exists)
   - Show mini-cart flyout for 3 seconds
   - Update header cart count badge
4. On failure:
   - Show inline error (e.g., "Only 3 left in stock")
   - Do not add to cart

### Cart Page

1. User navigates to `/cart`
2. System displays:
   - Line items: image, name, variant, unit price, quantity, line total
   - Quantity selector (1-10, max = available stock)
   - Remove button per item
   - Subtotal (before discounts)
   - Promo code input field
   - Applied discounts (if any)
   - Order total
   - "Continue Shopping" link
   - "Proceed to Checkout" button

### Quantity Update

1. User changes quantity via dropdown or +/- buttons
2. System validates against available stock
3. If valid: update quantity, recalculate totals
4. If exceeds stock: show error, revert to max available

### Promo Code

1. User enters code in promo field, clicks "Apply"
2. System validates:
   - Code exists and is active
   - Code not expired
   - Minimum order met (if applicable)
   - Code not already used (for single-use codes)
3. On valid: apply discount, show discount line
4. On invalid: show specific error message

### Cart Merge (Login)

1. Guest user has items in session cart
2. User logs in
3. System merges:
   - Add guest items to user's saved cart
   - If duplicate product: keep higher quantity
   - Clear session cart
4. Redirect to cart page with "Cart updated" message

---

## Business Rules

| Rule ID | Rule | Source |
|---------|------|--------|
| BR-CART-001 | Maximum 50 line items per cart | DEC-008 |
| BR-CART-002 | Maximum quantity per item = 10 | DEC-008 |
| BR-CART-003 | Guest carts expire after 7 days | DEC-015 |
| BR-CART-004 | Only one promo code per order | DEC-022 |

---

## Edge Cases

- **Product goes out of stock while in cart**: Show warning, allow checkout with reduced quantity
- **Price changes while in cart**: Update price, notify customer
- **Promo code becomes invalid**: Remove discount, show notification
- **Cart exceeds 50 items**: Prevent adding, show "cart full" message

---

## Story Ledger

| Story ID | Summary | Sprint | Status |
|----------|---------|--------|--------|
| STORY-120 | Basic add to cart | Sprint 2 | ✅ Done |
| STORY-121 | Cart page | Sprint 2 | ✅ Done |
| STORY-135 | Promo code support | Sprint 4 | ✅ Done |
| STORY-156 | Cart merge on login | Sprint 6 | ✅ Done |
| STORY-189 | Mini-cart flyout | Sprint 9 | ✅ Done |
