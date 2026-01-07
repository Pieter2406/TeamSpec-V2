# ADR-001: Frontend Framework Selection

## Status

**Accepted** — 2025-05-20

## Context

We need to select a frontend framework for the ACME Webshop. The team has experience with React and Vue. We need a framework that supports:

- Server-side rendering for SEO
- Component-based architecture
- Good ecosystem for e-commerce
- TypeScript support

## Decision

We will use **Next.js** (React) as our frontend framework.

## Rationale

1. **SSR/SSG Support**: Next.js has excellent built-in server-side rendering and static generation
2. **Team Familiarity**: 4 of 5 frontend devs have React experience
3. **Ecosystem**: Large ecosystem of e-commerce components (Stripe, PayPal integrations)
4. **TypeScript**: First-class TypeScript support
5. **Vercel Hosting**: Easy deployment path with Vercel

## Consequences

### Positive
- Fast initial page loads (SEO benefit)
- Code sharing between SSR and client
- Strong typing with TypeScript

### Negative
- Learning curve for Vue developers (1 team member)
- Vercel lock-in for optimal deployment

## Alternatives Considered

1. **Nuxt.js (Vue)** — Good SSR, but smaller ecosystem
2. **Remix** — Newer, less proven at scale
3. **Astro** — Great for static, less suited for dynamic e-commerce

## Related Features

- All frontend features depend on this decision

## Review Date

2026-05-20 — Review framework choice
