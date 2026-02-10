---
title: "Jaanify MVP — Product Reality Detection"
id: "AUDIT-2026-007"
version: "1.0.0"
status: draft
date: 2026-02-10
target:
  name: "jaanify"
  platform: "all"
  commit: "2b993d5"
  branch: "main"
tool:
  name: "detect-product"
  version: "1.0.0"
  rules_version: "2024.1"
confidence_scheme: "four-level"
findings_summary:
  critical: 1
  high: 1
  medium: 2
  low: 1
  informational: 1
overall_score: 4.5
lifecycle_phase: post-build
---

# Jaanify MVP — Product Reality Detection (Light Mode)

> Detected: 2026-02-10 | jaan-to v5.0.0 (SHA: 5e22ff19) | Cycle 5
> Platform: all (single-platform)
> Mode: Light (surface + business logic scan)

---

## Executive Summary

Jaanify has a **comprehensive feature surface** — 21 backend API endpoints across 7 domains and 3 frontend pages — but **zero production code** behind any of them. Every backend service handler returns `// TODO: implement` and all scaffold code lives in `jaan-to/outputs/`, not in a runnable project. The product is fully specified as a "Transparent Copilot" AI task manager with 7 core features (natural language input, reasoning cards, daily planner, voice capture, 60-second onboarding, guest mode, categories) targeting neurodivergent individuals and freelancers.

**Monetization: None detected.** The PRD mentions a freemium model but no billing code, pricing page, tier enforcement, or payment integration exists anywhere — not even in scaffold form. This is the most critical product gap: Jaanify has no revenue path.

**Analytics: Specified but not implemented.** PostHog is referenced in the PRD with env vars in scaffold config, and 18 GTM dataLayer events are fully specified. But zero analytics SDK code exists in the scaffold — no `posthog.capture()`, no GTM initialization. Feature flags use a custom env-var approach via Zustand store (3 flags: reasoning cards, voice input, guest mode).

**Score: 4.5/10** — Strong feature specification, zero implementation, no monetization path.

---

## Feature Inventory

### Backend API Routes (21 endpoints) — Confidence: Tentative (0.70)

All routes exist as Fastify v5 handler definitions with Zod schemas. All service calls are to TODO stubs.

| Domain | Endpoints | Auth | Status |
|--------|-----------|------|--------|
| **Auth** | POST /auth/google, POST /auth/refresh, POST /auth/register, DELETE /auth/logout | Public | TODO stubs |
| **Tasks** | GET /tasks, POST /tasks, GET /tasks/:id, PATCH /tasks/:id, DELETE /tasks/:id | Authenticated | TODO stubs |
| **Parse** | POST /tasks/parse | Authenticated | TODO stub |
| **AI** | POST /tasks/:id/prioritize, GET /daily-plan | Authenticated | TODO stubs |
| **Categories** | GET /categories, POST /categories | Authenticated | TODO stubs |
| **Users** | GET /users/me, PATCH /users/me, PATCH /users/me/preferences | Authenticated | TODO stubs |
| **Onboarding** | POST /onboarding/guest | Public | TODO stub |
| **Health** | GET /health | Public | TODO stub |

### Frontend Pages (3) — Confidence: Tentative (0.70)

| Page | Route | Auth | Components |
|------|-------|------|-----------|
| Dashboard | `/` (authenticated) | Required | TaskList, DailyPlanner, TaskInput, Sidebar, Header |
| Onboarding | `/onboarding` | Public (guest) | OnboardingFlow (4-step wizard) |
| Root Layout | N/A | N/A | Providers, theme, font, PWA manifest |

### Feature Domains (from PRD) — Confidence: Firm (0.80)

| Feature | PRD | Scaffold | Production | Evidence Layers |
|---------|-----|----------|------------|-----------------|
| Natural Language Task Input | Specified | Component + Route | 0% | Surface + Code (stub) |
| 3-Tier Reasoning Cards | Specified | Component | 0% | Surface only |
| AI Daily Planner | Specified | Component + Route | 0% | Surface + Code (stub) |
| Voice Capture | Specified | Component | 0% | Surface only |
| 60-Second Onboarding | Specified | Component + Route | 0% | Surface + Code (stub) |
| Guest Mode | Specified | Route | 0% | Code (stub) only |
| Categories & Organization | Specified | Routes | 0% | Code (stubs) only |

---

## Monetization + Entitlement Summary

### Monetization Model: None Detected — Confidence: Confirmed (0.95)

```yaml
evidence:
  id: E-PRD-001
  type: absence
  confidence: 0.95
  method: grep-pattern-match
  description: "No Stripe, PayPal, billing, subscription, pricing, or tier enforcement code found. Searched: stripe*, paypal*, billing*, subscription*, premium*, pricing*, upgrade*, checkSubscription, requiresPremium, userTier, planId across all scaffold and output files."
```

### Feature Flags: Custom Env-Var Implementation

3 feature flags via Zustand store in `useUIStore`:

| Flag | Default | Purpose |
|------|---------|---------|
| `ENABLE_REASONING_CARDS` | `true` | Toggle 3-tier reasoning card visibility |
| `ENABLE_VOICE_INPUT` | `true` | Toggle voice capture FAB |
| `ENABLE_GUEST_MODE` | `true` | Toggle anonymous guest sessions |

No external feature flag service (no LaunchDarkly, Unleash, Split.io). Flags are compile-time env vars, not runtime toggleable.

### Analytics: Specified but Not Implemented

| Signal | Status | Evidence |
|--------|--------|----------|
| PostHog | Env vars defined, SDK not installed | `NEXT_PUBLIC_POSTHOG_KEY=""` in .env.example |
| GTM DataLayer | 18 events fully specified | `jaan-to/outputs/data/gtm/01-jaanify-core-tracking/` |
| PostHog in PRD | Referenced for all 8 success metrics | PRD success metrics table |
| Actual tracking code | Zero | No `posthog.capture()` or `window.dataLayer.push()` in scaffold |

---

## Top Findings

### E-PRD-001: No Monetization Path (Critical)

**Severity**: Critical | **Confidence**: Confirmed (0.95)

Jaanify has no billing integration, no pricing page, no tier enforcement, and no payment processing. The PRD mentions a freemium model but this has not been translated into any technical artifact — no Stripe integration, no subscription management, no entitlement gates. Without a monetization path, the product cannot generate revenue.

```yaml
evidence:
  id: E-PRD-001
  type: absence
  confidence: 0.95
  method: grep-pattern-match
  description: "Zero billing-related code in entire codebase. Searched all scaffold outputs."
```

**Recommendation**: Define pricing model (freemium tiers) in PRD. Add billing integration to backend task breakdown. This requires a new jaan-to cycle focused on monetization specification.

### E-PRD-002: All 21 Route Handlers Are TODO Stubs (High)

**Severity**: High | **Confidence**: Confirmed (0.95)

Every backend service function is a TODO stub. The surface layer (routes + schemas) exists but the code path layer (business logic) is empty. Features cannot be assessed for correctness.

```yaml
evidence:
  id: E-PRD-002
  type: code-location
  confidence: 0.95
  location:
    uri: "jaan-to/outputs/backend/scaffold/01-jaanify-mvp/01-jaanify-mvp-services.ts"
    startLine: 1
    snippet: |
      // All 13 service functions return // TODO: implement
  method: pattern-match
```

**Recommendation**: Gap L-01 (service implementation). Requires new jaan-to skill or manual implementation.

### E-PRD-003: Analytics Specified But Not Implemented (Medium)

**Severity**: Medium | **Confidence**: Confirmed (0.95)

PostHog is referenced in PRD success metrics, env vars exist in config, and 18 GTM events are fully specified — but zero analytics tracking code exists in the scaffold.

```yaml
evidence:
  - id: E-PRD-003a
    type: code-location
    confidence: 0.95
    location:
      uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-config.ts"
      startLine: 467
    snippet: |
      NEXT_PUBLIC_POSTHOG_KEY=""
      NEXT_PUBLIC_POSTHOG_HOST=""
  - id: E-PRD-003b
    type: absence
    confidence: 0.95
    description: "No posthog.capture() or dataLayer.push() calls in scaffold components"
```

**Recommendation**: Analytics implementation should be part of the integration/wiring phase (L-02). PostHog SDK installation and GTM dataLayer event wiring needed.

### E-PRD-004: Feature Flags Not Runtime-Toggleable (Medium)

**Severity**: Medium | **Confidence**: Firm (0.85)

Feature flags are compile-time env vars (`NEXT_PUBLIC_*`), not runtime-toggleable. Changes require redeployment. No A/B testing capability.

```yaml
evidence:
  id: E-PRD-004
  type: code-location
  confidence: 0.85
  location:
    uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-config.ts"
    startLine: 414
    snippet: |
      ENABLE_REASONING_CARDS: process.env.NEXT_PUBLIC_ENABLE_REASONING_CARDS !== "false",
  method: pattern-match
```

**Recommendation**: Low priority for MVP. Consider PostHog feature flags (included in PostHog free tier) for runtime toggling post-launch.

### E-PRD-005: PRD Success Metrics Well-Defined (Informational)

**Severity**: Informational | **Confidence**: Confirmed (0.95)

8 success metrics defined with clear measurement methods, baselines, and targets. Metrics cover retention (D7, D30), engagement (task completion, reasoning card expansion, voice usage), and growth (WAU). All tied to PostHog events.

```yaml
evidence:
  id: E-PRD-005
  type: code-location
  confidence: 0.95
  location:
    uri: "jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md"
    startLine: 62
    snippet: |
      | Time-to-First-Task | 3-5 minutes (competitor avg) | <60 seconds |
  method: pattern-match
```

### E-PRD-006: No Landing Page or Marketing Surface (Low)

**Severity**: Low | **Confidence**: Confirmed (1.0)

No marketing/landing page exists — no `/pricing`, `/about`, `/features` routes. No SEO metadata beyond the basic meta title/description in root layout. No social sharing cards (OpenGraph, Twitter Card).

```yaml
evidence:
  id: E-PRD-006
  type: absence
  confidence: 1.0
  method: glob-pattern-match
  description: "No landing/*, marketing/*, pricing.* pages found"
```

**Recommendation**: Landing page needed for user acquisition. Can be generated via `frontend-design` skill.

---

> Features at Tentative confidence (surface layer only). Run with `--full` for copy layer analysis, instrumentation audit, feature flag detection, constraint analysis, and 3-layer evidence linking.

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | jaan-to/outputs/detect/product/summary.md |
| Skill | detect-product |
| jaan-to | v5.0.0 (SHA: 5e22ff19) |
| Mode | Light |
| Status | Final |
