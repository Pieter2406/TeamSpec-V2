# ADR-002: Payment Provider Architecture

## Status

**Accepted** — 2025-06-10

## Context

The webshop needs to accept online payments. We need to decide on:
1. Primary payment provider
2. Architecture for supporting multiple providers
3. PCI compliance approach

## Decision

1. **Primary Provider**: Stripe as primary payment processor
2. **Architecture**: Payment Provider Abstraction Layer (PPAL) with adapter pattern
3. **PCI Compliance**: Use provider-hosted payment forms (Stripe Elements, PayPal SDK)

## Rationale

### Stripe as Primary
- Industry-leading developer experience
- Transparent pricing (2.9% + $0.30)
- Built-in fraud detection (Radar)
- Excellent documentation

### Abstraction Layer
- Enables adding PayPal without refactoring checkout
- Testable (mock adapters in tests)
- Supports future providers (Apple Pay, etc.)

### Provider-Hosted Forms
- No card data touches our servers
- PCI SAQ-A compliance (simplest)
- Reduces security liability

## Architecture

```
┌─────────────────────────────────────┐
│        Checkout Service             │
├─────────────────────────────────────┤
│      PaymentProviderInterface       │
├──────────────┬──────────────────────┤
│ StripeAdapter│  PayPalAdapter │ ... │
└──────────────┴──────────────────────┘
```

## Consequences

### Positive
- Easy to add new providers
- No PCI DSS burden
- Unified payment API internally

### Negative
- Abstraction adds complexity
- Must maintain adapters per provider

## Related Features

- [AWS-003](../features/AWS-003-checkout-flow.md) — Checkout Flow

## Related Decisions

- [DEC-002](../decisions/DEC-002-payment-providers.md) — Payment provider selection
