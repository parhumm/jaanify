---
tool: detect-product
platform: api
run_depth: light
date: 2026-02-16
jaan_to_version: v7.0.0
findings_summary:
  critical: 1
  high: 1
  medium: 1
  low: 0
  informational: 2
overall_score: 6.5
---

# Product Detection — API Platform

## Executive Summary

The Jaanify API (`apps/api/`) is a Fastify v5 backend serving 6 route domains with 16 endpoints. Core product features include AI-powered task parsing (OpenAI), daily plan generation with AI ordering, JWT authentication, guest sessions, and user feedback collection. No monetization enforcement exists — no billing integration, no entitlement gates, no tier checks. Analytics instrumentation is absent.

## Feature Inventory

### API Routes (16 endpoints)

| Domain | Method | Path | Auth | Confidence |
|--------|--------|------|------|------------|
| Health | GET | `/v1/health` | Public | Confirmed |
| Auth | POST | `/v1/auth/register` | Public | Tentative |
| Auth | POST | `/v1/auth/login` | Public | Tentative |
| Auth | POST | `/v1/auth/refresh` | Public | Tentative |
| Users | GET | `/v1/users/me` | Authenticated | Tentative |
| Tasks | GET | `/v1/tasks` | Authenticated | Tentative |
| Tasks | GET | `/v1/tasks/:task_id` | Authenticated | Tentative |
| Tasks | POST | `/v1/tasks` | Authenticated | Tentative |
| Tasks | PATCH | `/v1/tasks/:task_id` | Authenticated | Tentative |
| Tasks | DELETE | `/v1/tasks/:task_id` | Authenticated | Tentative |
| Tasks | POST | `/v1/tasks/parse` | Authenticated | Tentative |
| Daily Plans | GET | `/v1/daily-plans` | Authenticated | Tentative |
| Daily Plans | GET | `/v1/daily-plans/:plan_id` | Authenticated | Tentative |
| Daily Plans | POST | `/v1/daily-plans/generate` | Authenticated | Tentative |
| Daily Plans | PATCH | `/v1/daily-plans/:plan_id/slots/:slot_id` | Authenticated | Tentative |
| Feedback | POST | `/v1/feedback` | Authenticated | Tentative |
| Guest Sessions | POST | `/v1/guest-sessions` | Public | Tentative |
| Guest Sessions | GET | `/v1/guest-sessions/:anonymous_id` | Public | Tentative |

### AI Integration

- **OpenAI API**: Used in `tasks.service.ts` (task parsing) and `daily-plans.service.ts` (plan ordering)
- **Fallback pattern**: Rule-based ordering when OpenAI fails (graceful degradation)
- **Error handling**: Custom `openai-unavailable` error type (503 status)

### Security Stack

| Plugin | Purpose |
|--------|---------|
| `@fastify/helmet` | Security headers |
| `@fastify/cors` | Cross-origin resource sharing |
| `@fastify/rate-limit` | Rate limiting |
| `@fastify/cookie` | Cookie parsing |
| CSRF plugin | CSRF protection |
| Auth plugin | JWT authentication |
| Swagger/SwaggerUI | API documentation at `/docs` |

## Monetization + Entitlement Summary

**Model**: None detected
**Tiers**: None detected
**Enforcement**: 0 code gates found [Confidence: Confirmed]

No Stripe, PayPal, or custom billing integration. No `checkSubscription`, `requiresPremium`, or `userTier` patterns. No feature flag system. No entitlement enforcement.

```yaml
evidence:
  id: E-PRD-API-001
  type: absence
  confidence: 1.0
  method: grep-pattern-match
  description: "No billing/payment/entitlement patterns found in apps/api/src/"
```

## Top Findings

### E-PRD-API-001: No Monetization Path (Critical)

**Severity**: Critical
**Confidence**: Confirmed (1.0)

No billing integration, no tier enforcement, no payment endpoints. The API serves all features to all authenticated users equally. Revenue generation requires billing infrastructure.

### E-PRD-API-002: No Analytics Instrumentation (High)

**Severity**: High
**Confidence**: Confirmed (1.0)

No PostHog, Mixpanel, GA4, Segment, or any analytics SDK detected. Product usage metrics are not being captured. Feature adoption, retention signals, and user behavior are invisible.

```yaml
evidence:
  id: E-PRD-API-002
  type: absence
  confidence: 1.0
  method: grep-pattern-match
  description: "No analytics SDK patterns found in apps/api/src/"
```

### E-PRD-API-003: Guest Session Feature (Informational)

**Severity**: Informational
**Confidence**: Tentative (0.70)

Guest session endpoints allow anonymous usage. This could support a try-before-signup onboarding flow, which is product-positive for conversion.

```yaml
evidence:
  id: E-PRD-API-003
  type: feature
  confidence: 0.70
  location:
    uri: "apps/api/src/routes/guest-sessions/index.ts"
    startLine: 6
  layers:
    surface: "POST /v1/guest-sessions, GET /v1/guest-sessions/:anonymous_id"
    code_path: "apps/api/src/routes/guest-sessions/index.ts"
```

### E-PRD-API-004: AI-Powered Core Features (Informational)

**Severity**: Informational
**Confidence**: Confirmed (1.0)

OpenAI integration in two core features (task parsing, daily plan generation) is the primary product differentiator. Graceful degradation to rule-based ordering is implemented.

```yaml
evidence:
  id: E-PRD-API-004
  type: feature
  confidence: 1.0
  location:
    uri: "apps/api/src/routes/daily-plans/daily-plans.service.ts"
    startLine: 114
  layers:
    surface: "POST /v1/daily-plans/generate, POST /v1/tasks/parse"
    code_path: "apps/api/src/routes/daily-plans/daily-plans.service.ts, apps/api/src/routes/tasks/tasks.service.ts"
```

---

Features at Tentative confidence (surface layer only). Run with `--full` for copy layer analysis, instrumentation audit, constraint analysis, and 3-layer evidence linking (7 output files).

---

> Generated by detect-product (light mode) | 2026-02-16 | jaan-to v7.0.0
