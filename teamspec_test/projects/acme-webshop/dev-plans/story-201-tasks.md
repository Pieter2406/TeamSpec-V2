# Development Plan: STORY-201 - Guest Checkout Flow

> **Story**: [STORY-201](../stories/ready-for-development/STORY-201-guest-checkout.md)  
> **Developer**: @dev-sarah  
> **Created**: 2026-01-02

---

## Overview

Implement guest checkout capability allowing users to complete purchases without creating an account.

---

## Task Breakdown

### 1. Backend: Guest Checkout API

| Task | Estimate | Actual | Status |
|------|----------|--------|--------|
| 1.1 Remove auth requirement from checkout endpoint | 1h | 1h | ✅ |
| 1.2 Add email field to order schema | 0.5h | 0.5h | ✅ |
| 1.3 Create guest order lookup endpoint | 2h | - | 🔄 |
| 1.4 Update order confirmation email for guests | 1h | - | ⬜ |

### 2. Frontend: Checkout Flow Changes

| Task | Estimate | Actual | Status |
|------|----------|--------|--------|
| 2.1 Remove login redirect from checkout entry | 0.5h | - | ⬜ |
| 2.2 Add email input to checkout form | 1h | - | ⬜ |
| 2.3 Add email validation | 0.5h | - | ⬜ |
| 2.4 Update checkout state management for guests | 2h | - | ⬜ |

### 3. Frontend: Post-Purchase Account Offer

| Task | Estimate | Actual | Status |
|------|----------|--------|--------|
| 3.1 Create account offer component | 2h | - | ⬜ |
| 3.2 Add password set flow for guest conversion | 3h | - | ⬜ |
| 3.3 Integrate with confirmation page | 1h | - | ⬜ |

### 4. Frontend: Order Lookup Page

| Task | Estimate | Actual | Status |
|------|----------|--------|--------|
| 4.1 Create /order/track page | 2h | - | ⬜ |
| 4.2 Order lookup form (order # + email) | 1h | - | ⬜ |
| 4.3 Display order details for guest | 1.5h | - | ⬜ |

### 5. Testing

| Task | Estimate | Actual | Status |
|------|----------|--------|--------|
| 5.1 Unit tests for guest checkout API | 2h | - | ⬜ |
| 5.2 Integration tests for guest flow | 2h | - | ⬜ |
| 5.3 E2E tests for complete guest journey | 3h | - | ⬜ |

---

## Total Estimates

| Category | Estimated | Actual |
|----------|-----------|--------|
| Backend | 4.5h | 1.5h |
| Frontend | 14h | - |
| Testing | 7h | - |
| **Total** | **25.5h** | **1.5h** |

---

## Dependencies

- [x] DEC-003 approved
- [x] UX mockups finalized
- [x] Email service configured
- [ ] QA environment ready

---

## Technical Decisions

1. **Session cart reuse**: Existing guest cart (AWS-002) will be used; no changes needed
2. **Email storage**: Guest email stored on order record, not in separate table
3. **Rate limiting**: Order lookup limited to 5 attempts per IP per hour

---

## Risks

| Risk | Mitigation |
|------|------------|
| Guest order spam | Add reCAPTCHA to checkout |
| Email deliverability | Test with multiple providers |

---

## Progress Notes

### 2026-01-02
- Started backend tasks
- Auth removal complete, tested locally

### 2026-01-03
- Email field migration deployed to dev
- Starting guest lookup endpoint

---

## Definition of Done Checklist

- [ ] All acceptance criteria met
- [ ] Unit tests passing (>80% coverage)
- [ ] E2E tests passing
- [ ] Code reviewed and approved
- [ ] Feature flag enabled in staging
- [ ] QA sign-off
- [ ] Feature Canon updated (AWS-003)
