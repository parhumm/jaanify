---
tool: detect-product
platform: web
run_depth: light
date: 2026-02-16
jaan_to_version: v7.0.0
findings_summary:
  critical: 1
  high: 1
  medium: 1
  low: 0
  informational: 2
overall_score: 6.2
---

# Product Detection — Web Platform

## Executive Summary

The Jaanify web app (`apps/web/`) is a Next.js 15 App Router application with 4 pages: landing, dashboard, task creation, and onboarding. The product surfaces include a 4-step onboarding flow, AI-powered task input with natural language parsing, daily plan visualization, and reasoning cards showing AI decision transparency. No monetization UI exists — no pricing page, no upgrade prompts, no billing management. Analytics is absent.

## Feature Inventory

### Pages / Routes (4 pages)

| Route | Component | Auth Required | Feature Domain | Confidence |
|-------|-----------|--------------|----------------|------------|
| `/` | `LandingPage.tsx` | No | Marketing | Tentative |
| `/dashboard` | `DashboardContent.tsx` | Yes | Core product | Tentative |
| `/tasks/new` | `TaskInputContent.tsx` | Yes | Task creation | Tentative |
| `/onboarding` | `OnboardingContent.tsx` | Yes | Onboarding | Tentative |

### Product Features (Surface Layer)

| Feature | Components | Related API Evidence |
|---------|-----------|---------------------|
| Natural language task input | `TaskInputForm`, `ParsedField`, `SuggestionChips` | `E-PRD-API-004` |
| AI daily plan | `DailyPlan`, `PlanTaskRow` | `E-PRD-API-004` |
| 3-tier reasoning cards | `ReasoningCard`, `ReasoningTier1` | — |
| 4-step onboarding | `OnboardingStep`, `OnboardingContent` | — |
| Task management | `TaskCard`, `ActionButtons` | — |
| Dashboard overview | `DashboardHeader`, `StatCard` | — |
| Voice input (FAB) | `VoiceFAB` | — |

### State Management

| Store | Purpose |
|-------|---------|
| `task-store` | Task CRUD state |
| `user-store` | User profile + theme preference |
| `onboarding-store` | Onboarding flow state |
| `ui-store` | UI state (modals, toasts) |

## Monetization + Entitlement Summary

**Model**: None detected
**Tiers**: None detected
**Enforcement**: 0 UI gates found [Confidence: Confirmed]

No pricing page, no upgrade prompts, no billing UI, no tier-gated features. All dashboard features are accessible to all authenticated users.

```yaml
evidence:
  id: E-PRD-WEB-001
  type: absence
  confidence: 1.0
  method: glob-and-grep
  description: "No pricing*, tiers*, plans*, upgrade, or billing patterns found in apps/web/src/"
```

## Top Findings

### E-PRD-WEB-001: No Monetization UI (Critical)

**Severity**: Critical
**Confidence**: Confirmed (1.0)
**Related**: `E-PRD-API-001`

No pricing page, no upgrade flow, no billing management. Users cannot pay for the product. This aligns with the API finding — monetization is completely absent across both platforms.

### E-PRD-WEB-002: No Analytics Integration (High)

**Severity**: High
**Confidence**: Confirmed (1.0)
**Related**: `E-PRD-API-002`

Despite `NEXT_PUBLIC_POSTHOG_KEY` appearing in `.env.example`, no PostHog SDK or any analytics tracking code exists in the web application source. Product usage is not being measured.

```yaml
evidence:
  id: E-PRD-WEB-002
  type: absence
  confidence: 1.0
  method: grep-pattern-match
  description: "No posthog.capture, analytics.track, gtag, or similar in apps/web/src/"
```

### E-PRD-WEB-003: Landing Page Present but Minimal (Medium)

**Severity**: Medium
**Confidence**: Tentative (0.70)

Landing page exists at `/` (`LandingPage.tsx`) but product marketing value proposition depth is unclear from surface scan. No pricing section, no feature comparison, no social proof detected.

```yaml
evidence:
  id: E-PRD-WEB-003
  type: feature
  confidence: 0.70
  location:
    uri: "apps/web/src/app/LandingPage.tsx"
  layers:
    surface: "/ route with LandingPage component"
```

### E-PRD-WEB-004: Google OAuth TODO (Informational)

**Severity**: Informational
**Confidence**: Confirmed (1.0)

Two TODO comments in `OnboardingContent.tsx` for Google OAuth integration. Authentication flow is incomplete — email/password assumed but OAuth not wired.

```yaml
evidence:
  id: E-PRD-WEB-004
  type: incomplete-feature
  confidence: 1.0
  location:
    uri: "apps/web/src/app/onboarding/OnboardingContent.tsx"
    startLine: 190
  snippet: |
    fill="#4285F4"  /* Google brand colors present but OAuth not wired */
```

### E-PRD-WEB-005: Voice Input FAB Component (Informational)

**Severity**: Informational
**Confidence**: Tentative (0.60)

`VoiceFAB` component exists for voice task capture (PRD US-03). Implementation depth unclear from surface scan — may be UI-only or connected to Web Speech API.

```yaml
evidence:
  id: E-PRD-WEB-005
  type: feature
  confidence: 0.60
  location:
    uri: "apps/web/src/components/molecules/VoiceFAB.tsx"
  layers:
    surface: "VoiceFAB component in molecules/"
```

---

Features at Tentative confidence (surface layer only). Run with `--full` for copy layer analysis, instrumentation audit, constraint analysis, and 3-layer evidence linking (7 output files).

---

> Generated by detect-product (light mode) | 2026-02-16 | jaan-to v7.0.0
