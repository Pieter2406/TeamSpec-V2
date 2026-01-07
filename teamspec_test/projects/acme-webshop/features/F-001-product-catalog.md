# F-001: Product Catalog

## Metadata

| Field | Value |
|-------|-------|
| **Feature ID** | F-001 |
| **Status** | 🟢 Active |
| **Owner** | @jane-fa |
| **Created** | 2025-06-01 |
| **Last Updated** | 2025-12-15 |

---

## Purpose

Provide customers with a browsable and searchable collection of products, enabling them to discover items, view details, and make informed purchase decisions.

---

## Business Value

- **User Impact**: Customers can easily find and evaluate products
- **Business Impact**: Core revenue driver; better catalog = higher conversion
- **Success Metrics**: 
  - Product page views > 50,000/month
  - Add-to-cart rate from product page > 8%
  - Category navigation completion > 75%

---

## In Scope

- [x] Product listing pages (grid/list view)
- [x] Product detail pages
- [x] Category hierarchy (3 levels deep)
- [x] Product images (up to 6 per product)
- [x] Price display with sale indicators
- [x] Stock availability indicators
- [x] Product variants (size, color)

---

## Actors

- **Customer** — Browses and views products
- **Guest User** — Can browse without login
- **Registered User** — Can browse with personalized experience

---

## Out of Scope

- [ ] Product comparison — planned for AWS-015
- [ ] Recently viewed — planned for AWS-016
- [ ] Product bundles — roadmap Q3 2026

---

## Current Behavior

> ⚠️ **AUTHORITATIVE SECTION**: This describes what the system does TODAY.

### Product Listing Page

1. User navigates to category via menu or URL `/category/{slug}`
2. System displays products in grid layout (4 columns desktop, 2 mobile)
3. Each product card shows:
   - Primary image (hover reveals secondary)
   - Product name (max 2 lines, truncate)
   - Price (strike-through original if on sale)
   - Star rating average (if > 3 reviews)
   - "Add to Cart" quick button (for simple products)
4. Default sort: "Best Sellers"
5. Pagination: 24 products per page, infinite scroll on mobile

### Product Detail Page

1. User clicks product card or navigates to `/product/{slug}`
2. System displays:
   - Image gallery (main image + thumbnails)
   - Product name, SKU, brand
   - Price with tax indication
   - Variant selectors (dropdowns for size/color)
   - Quantity selector (1-10, respecting stock)
   - "Add to Cart" button
   - Stock indicator: "In Stock", "Low Stock (< 5)", "Out of Stock"
   - Description (collapsible sections)
   - Specifications table
   - Related products carousel (4 items)

### Stock Rules

- **In Stock**: Available quantity > 10
- **Low Stock**: Available quantity 1-10, show exact count
- **Out of Stock**: Available quantity = 0, disable Add to Cart

---

## Business Rules

| Rule ID | Rule | Source |
|---------|------|--------|
| BR-CAT-001 | Products without images cannot be published | DEC-005 |
| BR-CAT-002 | Sale price must be < regular price | DEC-005 |
| BR-CAT-003 | Out of stock products remain visible but non-purchasable | DEC-012 |

---

## Edge Cases

- **No products in category**: Display "No products found" message with suggestions
- **Invalid product URL**: Redirect to 404 page
- **Variant out of stock**: Grey out option, show "Out of Stock" label
- **Price unavailable**: Show "Contact for price" instead of price

---

## Technical Notes

- Product data synced from ERP every 15 minutes
- Images served via CDN (Cloudflare)
- Category tree cached for 1 hour

---

## Story Ledger

| Story ID | Summary | Sprint | Status |
|----------|---------|--------|--------|
| STORY-101 | Initial product listing page | Sprint 1 | ✅ Done |
| STORY-102 | Product detail page | Sprint 1 | ✅ Done |
| STORY-115 | Add variant selection | Sprint 3 | ✅ Done |
| STORY-142 | Low stock indicator | Sprint 5 | ✅ Done |
| STORY-178 | Sale price display | Sprint 8 | ✅ Done |
