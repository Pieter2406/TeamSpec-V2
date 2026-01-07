# Test Cases: STORY-201 Guest Checkout

## Test Suite: Guest Checkout E2E

### TC-201-001: Guest Proceeds to Checkout Successfully

**Preconditions:**
- User is not logged in
- Cart has at least one item

**Steps:**
1. Navigate to cart page
2. Click "Proceed to Checkout"
3. Observe result

**Expected Result:**
- Checkout page loads (no redirect to login)
- Email input field is visible
- Cart items displayed in order summary

---

### TC-201-002: Email Validation - Invalid Format

**Preconditions:**
- User on guest checkout page

**Steps:**
1. Enter "not-an-email" in email field
2. Click "Continue" or focus next field

**Expected Result:**
- Validation error appears
- "Please enter a valid email" message shown
- Cannot proceed without valid email

---

### TC-201-003: Order Confirmation Email Received

**Preconditions:**
- Guest checkout completed with test email

**Steps:**
1. Complete guest checkout
2. Check email inbox

**Expected Result:**
- Confirmation email received within 1 minute
- Email contains order number
- Email contains tracking link

---

### TC-201-004: Post-Purchase Account Creation

**Preconditions:**
- Guest checkout completed, on confirmation page

**Steps:**
1. Observe confirmation page
2. Click "Create an account" CTA
3. Set password
4. Submit

**Expected Result:**
- Account created with order email
- Discount code displayed
- Redirected to account page

---

### TC-201-005: Guest Order Lookup

**Preconditions:**
- Guest order exists in system

**Steps:**
1. Navigate to /order/track
2. Enter order number
3. Enter order email
4. Click "Track Order"

**Expected Result:**
- Order details displayed
- Current status shown
- Order items listed
