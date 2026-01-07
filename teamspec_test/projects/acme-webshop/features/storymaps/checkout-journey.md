# Storymap: Checkout Journey

> **Created**: 2025-06-01  
> **Facilitator**: @jane-fa  
> **Participants**: @product-lead, @dev-sarah, @dev-tom, @qa-lead

---

## User Goal

Complete a purchase with minimal friction.

---

## Journey Map

```
ACTIVITIES:   Review Cart    →    Enter Details    →    Payment    →    Confirmation
                  │                    │                   │               │
BACKBONE:    View items         Shipping addr        Select method    Order placed
             Update qty         Billing addr         Enter card       Email sent
             Apply promo        Select shipping      Submit payment   Track order
                  │                    │                   │               │
RELEASES:    ─────────────────────────────────────────────────────────────────
             R1: MVP checkout (card only, logged-in users)
             R2: Guest checkout + PayPal
             R3: Express checkout (Apple Pay, Google Pay)
```

---

## Release 1: MVP Checkout

| Activity | Story | Status |
|----------|-------|--------|
| Review Cart | STORY-121 Cart page | ✅ Done |
| Review Cart | STORY-135 Promo codes | ✅ Done |
| Enter Details | STORY-151 Shipping address | ✅ Done |
| Enter Details | STORY-160 Shipping methods | ✅ Done |
| Payment | STORY-165 Stripe integration | ✅ Done |
| Confirmation | STORY-175 Confirmation page | ✅ Done |

---

## Release 2: Enhanced Checkout

| Activity | Story | Status |
|----------|-------|--------|
| Enter Details | STORY-201 Guest checkout | 🔄 In Progress |
| Payment | STORY-202 PayPal integration | 📋 Backlog |

---

## Release 3: Express Checkout

| Activity | Story | Status |
|----------|-------|--------|
| Payment | STORY-210 Apple Pay | ⚪ Planned |
| Payment | STORY-211 Google Pay | ⚪ Planned |

---

## Notes

- R1 launched 2025-10-25
- R2 targeted for 2026-02-01
- R3 depends on DEC-004 (Apple Pay approval)
