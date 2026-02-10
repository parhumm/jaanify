---
title: "Jaanify MVP — Cycle 5 Launch Readiness Gap Analysis"
cycle: 5
date: 2026-02-10
jaan_to_version: "v5.0.0 (SHA: 5e22ff19)"
previous_cycle: 4
gap_summary:
  total: 7
  p0: 3
  p1: 2
  p2: 2
  p3: 0
  new_skills_needed: 3
  skill_improvements_needed: 2
  existing_untested: 2
progress:
  specification: 75
  scaffold: 40
  production: 0
  tests: 0
---

# Jaanify MVP — Cycle 5 Launch Readiness Gap Analysis

> Date: 2026-02-10
> jaan-to Version: v5.0.0 (SHA: 5e22ff19)
> Cycle: 5
> Previous: [04-launch-gaps.md](../04-cycle/04-launch-gaps.md) (Cycle 4, 2026-02-10)

---

## Executive Summary

Cycle 5 was a **regression testing and audit expansion cycle** triggered by jaan-to v5.0.0's token optimization release (extracting ~2,200 lines of boilerplate from 31 SKILL.md files). The primary finding: **v5.0.0 did NOT degrade output quality** across any of the 11 skills tested. All scorecards explicitly confirm no quality degradation from the token optimization.

Jaanify now has **25 deliverables** across 5 co-evolution cycles, up from 19 in Cycle 4. The key advancement is **full 5/5 detect domain coverage** (dev, design, writing, product, UX) — up from 1/5 in Cycle 4. The consolidated knowledge pack scores **5.6/10** with 33 findings (2 critical, 5 high, 10 medium, 9 low, 7 informational).

The core blockers remain unchanged: **production code is at 0%, tests are at 0%, and infrastructure is at 0%**. The 3 original P0 gaps (L-01 service implementation, L-02 integration/wiring, L-03 test generation) still block any runnable application. The 2 P1 gaps (L-04 security, L-05 CI/CD) still block safe public release.

**New in Cycle 5:** 2 additional P2 gaps discovered through the expanded detect suite:
- **L-06 (Monetization Infrastructure)**: detect-product found pricing copy but zero enforcement code (E-PRD-001, Critical)
- **L-07 (i18n Infrastructure)**: detect-writing found 7-language microcopy specs but zero i18n framework wiring (i18n maturity Level 0)

Total: 7 gaps (P0: 3, P1: 2, P2: 2). 27 skills tested, average score 4.38/5.

---

## Section A — Current State

Jaanify remains at the specification-to-scaffold threshold with no movement toward production code. Cycle 5 expanded audit coverage but did not advance implementation.

### Implementation Progress

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 80% | 0% | 0% |
| Frontend | 100% | 80% | 0% | 0% |
| Infrastructure | 0% | 0% | 0% | 0% |
| Marketing / GTM | 50% | 0% | 0% | N/A |
| **Overall** | **75%** | **40%** | **0%** | **0%** |

**Evidence (unchanged from Cycle 4):**
- **Specification 75%**: Backend and frontend fully specified (PRD, stories, task breakdowns, API contract, data model, test cases, design system, UX research). Infrastructure has no spec (0%). Marketing/GTM has tracking + microcopy but no landing page spec (50%).
- **Scaffold 40%**: Backend scaffold (21 route handlers, 7 Prisma models, 13 TODO stubs). Frontend scaffold (26 components, 20 hooks, 5 TODO stubs in single-file bundles). Infrastructure and marketing have zero scaffold.
- **Production 0%**: No `src/`, `app/`, or `pages/` directories with actual source code. All scaffolds live in `jaan-to/outputs/`, not in a runnable project structure.
- **Tests 0%**: Zero `*.test.ts`, `*.spec.ts`, or `*.test.tsx` files. No `vitest.config.*`, `playwright.config.*`, or `jest.config.*`.

### Existing Deliverables (25)

| Deliverable | Cycle | Skill | Key Metric |
|-------------|-------|-------|------------|
| PRD | 1 | `pm-prd-write` | 7 features, MVP scope, success metrics |
| Market Research | 1 | `pm-research-about` | AI task management competitive landscape |
| Frontend Tasks | 1 | `frontend-task-breakdown` | 68 tasks across 7 epics |
| Test Cases | 1 | `qa-test-cases` | 74 BDD scenarios across 7 stories |
| Design Components | 1 | `frontend-design` | 3 HTML previews (dashboard, task input, onboarding) |
| Microcopy Pack 1 | 1 | `ux-microcopy-write` | Core screens, 7 languages |
| GTM DataLayer | 1 | `data-gtm-datalayer` | 18 events for task lifecycle |
| User Stories | 2 | `pm-story-write` | US-01 through US-07 with Gherkin ACs |
| Backend Tasks | 2 | `backend-task-breakdown` | 28 tasks, 8 vertical slices |
| UX Research | 2 | `ux-research-synthesize` | 6 themes, 5 recommendations |
| UX Heatmap | 2 | `ux-heatmap-analyze` | Predictive audit, 3 screens |
| Data Model | 3 | `backend-data-model` | 7 tables, DDL, indexes, migration playbook |
| API Contract | 3 | `backend-api-contract` | OpenAPI 3.1, 21 endpoints, RFC 9457 errors |
| Microcopy Pack 2 | 3 | `ux-microcopy-write` | Task creation form, 7 languages |
| Backend Scaffold | 4 | `backend-scaffold` | 21 route handlers, 7 Prisma models, Zod schemas |
| Frontend Scaffold | 4 | `frontend-scaffold` | 26 components, 20 hooks, 25 types, 4 stores |
| Engineering Audit | 4 | `detect-dev` | 6.1/10, 11 findings (1C/2H/3M/3L/2I) |
| CHANGELOG | 4 | `release-iterate-changelog` | v0.1.0 + [Unreleased] Cycle 5 entries |
| **Design System Audit** | **5** | `detect-design` | 6.5/10, 5 findings (0C/0H/2M/2L/1I) |
| **Writing System Audit** | **5** | `detect-writing` | 5.0/10, 5 findings (0C/1H/1M/2L/1I) |
| **Product Reality Audit** | **5** | `detect-product` | 4.5/10, 6 findings (1C/1H/2M/1L/1I) |
| **UX Audit** | **5** | `detect-ux` | 6.0/10, 6 findings (0C/1H/2M/1L/2I) |
| **UX Flowcharts** | **5** | `ux-flowchart-generate` | 4 flows with evidence map, Mermaid diagrams |
| **Scaffold-to-Production Research** | **5** | `pm-research-about` | ~45 sources, vertical slice strategy |
| **Knowledge Pack (5/5)** | **5** | `detect-pack` | 5.6/10, 33 findings, all 5 domains |

---

## Section B — Launch & GTM Gap Analysis

### P0 — Launch Blockers

These 3 gaps prevent any runnable application from existing. All 3 remain open from previous cycles.

---

#### Gap L-01: Service Implementation Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that generates real business logic from scaffold stubs + task breakdown + API contract + data model |
| **Exists in jaan-to?** | No — does not exist in v5.0.0 skill catalog (31 skills) |
| **Related gaps** | #17 (Cycle 4), #7 (Cycle 2 — backend code generation) |
| **Blocks** | Production code — without this, 0% of Jaanify actually works |

**Key points:**
- Backend scaffold has 21 route handlers returning `// TODO: implement` — 10 stubs in services alone
- Cycle 5 research (62-dev-scaffold-to-production-strategy.md) confirmed vertical slice approach with 16-27 hours for all 6 pure TODO stubs
- All upstream inputs ready: task breakdown (28 tasks), API contract (21 endpoints), data model (7 tables)
- detect-product found pricing copy but zero enforcement code — service implementation would address this
- Research identified 4 new jaan-to skill gaps matching this need: `dev-implement`, `dev-test-generate`, `infra-ci-scaffold`, `infra-docker-scaffold`

**Expected outputs:**
- Filled service files with business logic, Prisma queries, validation
- RFC 9457 error handling from API contract
- Auth service with proper JWT lifecycle (replacing broken `decodeJwt`)
- AI reasoning service integrating OpenAI SDK

---

#### Gap L-02: Integration / Wiring Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that takes standalone scaffold files and wires them into a runnable project directory structure |
| **Exists in jaan-to?** | No — does not exist in v5.0.0 skill catalog |
| **Related gaps** | #19, #20 (Cycle 4), #3 (Cycle 1 — dev-integration-plan) |
| **Blocks** | Runnable application — scaffolds are blueprints, not an app |

**Key points:**
- Frontend scaffold has 26 components in a single `.tsx` file — production needs individual files
- Backend routes not connected to app entry point — no `app.ts` or server bootstrap
- detect-ux found `/tasks/new` dead link (E-UX-002) — a wiring gap in navigation
- Cycle 5 research prescribes monorepo structure: `packages/shared-types/`, `apps/api/`, `apps/web/`
- Has been open since Cycle 1 — longest-standing gap alongside L-03 and L-05

**Expected outputs:**
- Individual component files in `src/components/`, `src/hooks/`, `src/stores/`
- App entry points (`app.ts` for Fastify, `layout.tsx` for Next.js)
- Working `package.json` with `dev`, `build`, `start` scripts
- `tsconfig.json` with path aliases, `next.config.js`, `tailwind.config.ts`

---

#### Gap L-03: Test Stub Generation

| Field | Detail |
|-------|--------|
| **What** | A skill that generates Vitest unit tests + Playwright E2E tests from 74 existing BDD scenarios + scaffold code |
| **Exists in jaan-to?** | No (scaffold deficiency) — scaffolds configure Vitest in `package.json` but generate zero test files |
| **Related gaps** | #15 (Cycle 4), #5 (Cycle 1 — dev-test-plan) |
| **Blocks** | Quality confidence — cannot launch with 0% test coverage |

**Key points:**
- Both scaffold skills configure Vitest but produce zero test files — `pnpm test` fails immediately
- 74 BDD test cases exist as specs — they need to become runnable code
- Cycle 5 research prescribes test pyramid: 70% unit (Vitest + mocked Prisma), 20% integration (real Postgres), 10% E2E (Playwright)
- Test infrastructure prerequisite for CI/CD (L-05)
- Has been open since Cycle 1

**Expected outputs:**
- `*.test.ts` files for services, hooks, components
- `*.spec.ts` Playwright files for 7 user stories
- `vitest.config.ts`, `playwright.config.ts`
- Mock setup: MSW for API mocking, test utilities, fixtures

---

### P1 — Security & Deployment

These 2 gaps prevent safe public release. Unchanged from Cycle 4.

---

#### Gap L-04: Security Hardening

| Field | Detail |
|-------|--------|
| **What** | Fix critical security vulnerabilities found by `detect-dev` audit in scaffold output |
| **Exists in jaan-to?** | Partial — `detect-dev` finds issues but no skill remediates them |
| **Related gap** | #16 (Cycle 4) |
| **Blocks** | Safe public release — critical vulnerability in auth system |

**Key points:**
- **E-DEV-001 (Critical):** JWT `decodeJwt` base64-decodes without signature verification — token forgery possible
- **E-DEV-002 (High):** No rate limiting on auth endpoints
- **E-DEV-003 (High):** Tokens in `localStorage` instead of httpOnly cookies
- detect-writing cross-referenced this finding (E-WRT-002 linked to E-DEV-003)
- Scaffold quality issue — `backend-scaffold` should generate secure auth by default

**Expected outputs:**
- Secure JWT verification using `jose` library
- Rate limiter via `@fastify/rate-limit` on public endpoints
- httpOnly cookie-based sessions with CSRF protection
- Security regression tests

---

#### Gap L-05: CI/CD Scaffold Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate GitHub Actions workflows, Dockerfile, docker-compose from `tech.md` context |
| **Exists in jaan-to?** | No — does not exist in v5.0.0 skill catalog |
| **Related gaps** | #18 (Cycle 4), #8 (Cycle 2), #10 (Cycle 1) |
| **Blocks** | Deployment — cannot ship what you cannot deploy |

**Key points:**
- Zero `.github/workflows/` files, zero Dockerfile, zero docker-compose for Jaanify
- Tech stack fully specified in `context/tech.md` — all inputs available
- Cycle 5 research prescribes 7-phase CI pipeline: Install → Lint+TypeCheck → Unit → Integration → Build → E2E → Deploy
- Has been open since Cycle 1 — longest-standing gap alongside L-02 and L-03
- Depends on L-01+L-02+L-03+L-04

**Expected outputs:**
- `.github/workflows/ci.yml` — lint, type-check, test, build, deploy
- `Dockerfile` — multi-stage build for Fastify
- `docker-compose.yml` — PostgreSQL 16, Redis 7, Typesense
- `.env.example` with all required variables

---

### P2 — GTM Essentials

2 new gaps discovered in Cycle 5 through expanded detect suite.

---

#### Gap L-06: Monetization Infrastructure

| Field | Detail |
|-------|--------|
| **What** | Billing integration, pricing tier enforcement, and subscription management |
| **Exists in jaan-to?** | No skill for billing scaffold or entitlement enforcement |
| **Related gap** | NEW — discovered by `detect-product` (E-PRD-001, Critical) |
| **Blocks** | Revenue — product may function but cannot monetize |

**Key points:**
- detect-product found pricing-related copy in PRD but **zero Stripe/payment integration** in scaffold code
- No `checkSubscription()`, no `requiresPremium`, no entitlement gates
- PRD mentions freemium model but scaffold enforces no tier differentiation
- Missing from both backend-scaffold and frontend-scaffold outputs
- Not a launch blocker for beta (can launch free-tier-only) but blocks revenue

**Expected outputs:**
- Stripe integration (subscriptions, checkout, webhooks)
- Entitlement middleware for tier-gated features
- Pricing page components
- Subscription management UI (upgrade/downgrade/cancel)

---

#### Gap L-07: i18n Infrastructure

| Field | Detail |
|-------|--------|
| **What** | i18n framework wiring to connect existing 7-language microcopy specs to actual UI |
| **Exists in jaan-to?** | Partial — `ux-microcopy-write` generates specs but no skill wires them into code |
| **Related gap** | NEW — discovered by `detect-writing` (i18n maturity Level 0) |
| **Blocks** | International users — 7-language specs exist but code is English-only |

**Key points:**
- detect-writing scored i18n maturity at Level 0 (None): no locale files, no i18n library, all strings hardcoded
- 2 microcopy packs exist (core screens + task creation form, 7 languages each) but zero integration
- No `next-intl`, `react-i18next`, or locale directory structure
- ~55 inline hardcoded strings detected in scaffold components
- Not a launch blocker for English-only beta but wastes existing microcopy investment

**Expected outputs:**
- `next-intl` or `react-i18next` setup
- Locale files generated from existing microcopy specs
- String extraction from inline hardcoded text
- Language switcher UI component

---

## Section C — Summary Table

| Priority | Gap ID | Gap | Exists in jaan-to? | Blocks |
|----------|--------|-----|---------------------|--------|
| **P0** | L-01 | Service Implementation Skill | No | Production code |
| **P0** | L-02 | Integration / Wiring Skill | No | Runnable application |
| **P0** | L-03 | Test Stub Generation | No (scaffold deficiency) | Quality confidence |
| **P1** | L-04 | Security Hardening | Partial (detect finds, doesn't fix) | Safe public release |
| **P1** | L-05 | CI/CD Scaffold Skill | No | Deployment pipeline |
| **P2** | L-06 | Monetization Infrastructure | No | Revenue |
| **P2** | L-07 | i18n Infrastructure | Partial (specs exist, no wiring) | International users |

**Skills that need to be created:** 3 (L-01 service-impl, L-02 wiring, L-05 CI/CD)
**Skills that need improvement:** 2 (L-03 scaffold test gen, L-04 security remediation)
**Skills that exist but are untested for this gap:** 2 (L-06 no billing skill, L-07 microcopy-to-code wiring)

---

## Section D — Critical Path

```
L-01 Service Impl ──→ L-04 Security ──→ L-05 CI/CD ──→ Launch (Beta)
L-02 Wiring ─────────────────────────↗
L-03 Test Gen ───────────────────────↗

Post-Beta:
L-06 Monetization ──→ Revenue
L-07 i18n ──→ International
```

**Critical path length:** 3 sequential stages to beta launch (unchanged from Cycle 4).

**What determines minimum time to launch:**

1. **L-01 + L-02 are the bottleneck.** No production code without service implementation (L-01), no runnable app without wiring (L-02). These two run in parallel.
2. **L-03 runs in parallel** with L-01/L-02 — test stubs can be generated alongside.
3. **L-04 depends on L-01/L-02** — security hardening is meaningless on TODO stubs.
4. **L-05 depends on all above** — CI/CD deploys secure, tested code. Final gate.
5. **L-06 and L-07 are post-beta** — not on the critical path to initial launch.

---

## Section E — Cycle-Over-Cycle Delta

**Baseline:** Cycle 4 launch-gaps report (`gap-reports/04-cycle/04-launch-gaps.md`, 2026-02-10)

| Metric | Cycle 4 Report | Cycle 5 | Delta |
|--------|---------------|---------|-------|
| Total gaps | 5 | 7 | **+2** (L-06, L-07 new) |
| P0 gaps | 3 | 3 | 0 |
| P1 gaps | 2 | 2 | 0 |
| P2 gaps | 0 | 2 | **+2** |
| Specification | 75% | 75% | 0 |
| Scaffold | 40% | 40% | 0 |
| Production | 0% | 0% | 0 |
| Tests | 0% | 0% | 0 |
| New skills needed | 3 | 3 | 0 |
| Improvements needed | 2 | 2 | 0 |
| Skills tested | 18 | 27 | **+9** |
| Average score | 4.35/5 | 4.38/5 | +0.03 |
| Deliverables | 19 | 25 | **+6** |
| Detect domains | 1/5 | 5/5 | **+4** |
| Knowledge pack score | N/A | 5.6/10 | New metric |

**Gaps resolved since Cycle 4:** 0
**New gaps since Cycle 4:** 2 (L-06 Monetization, L-07 i18n — both P2)
**Implementation progress:** No change in production code or test coverage.

### Cycle 5 Achievements (Non-Implementation)

Despite no implementation progress, Cycle 5 produced significant audit and planning value:

1. **Full 5/5 detect coverage** — design, writing, product, UX audits completed (was 1/5)
2. **v5.0.0 regression confirmed** — all 11 skills tested, zero quality degradation
3. **Scaffold-to-production research** — actionable vertical slice strategy with effort estimates
4. **UX flowcharts** — 4 user journeys mapped with evidence traceability
5. **Knowledge pack consolidated** — 33 findings across 5 domains, cross-domain patterns identified
6. **9 new scorecards** — quality data for detect-design, detect-writing, detect-product, detect-ux, ux-flowchart-generate, backend-scaffold (re-test), frontend-scaffold (re-test), pm-research-about, detect-pack, release-iterate-changelog

### Cumulative Gap Registry

| Gap ID | Description | First Discovered | Cycle Trail | Status |
|--------|-------------|-----------------|-------------|--------|
| L-01 | Service Implementation | Cycle 2 (#7) | C2→C3→C4→C5 | **Open** |
| L-02 | Integration / Wiring | Cycle 1 (#3) | C1→C2→C3→C4→C5 | **Open** |
| L-03 | Test Stub Generation | Cycle 1 (#5) | C1→C2→C3→C4→C5 | **Open** |
| L-04 | Security Hardening | Cycle 4 (#16) | C4→C5 | **Open** |
| L-05 | CI/CD Scaffold | Cycle 1 (#10) | C1→C2→C3→C4→C5 | **Open** |
| L-06 | Monetization Infrastructure | **Cycle 5 (NEW)** | C5 | **Open** |
| L-07 | i18n Infrastructure | **Cycle 5 (NEW)** | C5 | **Open** |

### Skill Quality Map (27 Skills Tested)

| Skill | Score | Cycle | Category |
|-------|-------|-------|----------|
| `backend-api-contract` | 5.0/5 | 3 | Dev |
| `backend-data-model` | 4.9/5 | 3 | Dev |
| `pm-prd-write` | 4.8/5 | 1 | Planning |
| `qa-test-cases` | 4.7/5 | 1 | QA |
| `backend-scaffold` | 4.7/5 | 4 (re-tested C5) | Dev |
| `frontend-task-breakdown` | 4.6/5 | 1 | Planning |
| `backend-task-breakdown` | 4.6/5 | 2 | Planning |
| `frontend-scaffold` | 4.6/5 | 4 (re-tested C5) | Dev |
| `pm-story-write` | 4.5/5 | 2 | Planning |
| `frontend-design` | 4.5/5 | 1 | Design |
| `detect-dev` | 4.5/5 | 4 | Audit |
| `detect-ux` | 4.4/5 | 5 | Audit |
| `detect-pack` | 4.4/5 | 5 | Audit |
| `data-gtm-datalayer` | 4.4/5 | 1 | Data |
| `pm-research-about` | 4.3/5 | 5 | Planning |
| `ux-microcopy-write` | 4.3/5 | 1 | UX |
| `release-iterate-changelog` | 4.3/5 | 5 | Release |
| `detect-design` | 4.3/5 | 5 | Audit |
| `detect-writing` | 4.2/5 | 5 | Audit |
| `ux-research-synthesize` | 4.2/5 | 2 | UX |
| `detect-product` | 4.1/5 | 5 | Audit |
| `ux-flowchart-generate` | 4.1/5 | 5 | UX |
| `ux-heatmap-analyze` | 4.0/5 | 2 | UX |
| `learn-report` | 2.3/5 | 3 | Meta |
| `docs-create` | 2.0/5 | 1 | Meta |
| `roadmap-add` | 2.0/5 | 1 | Meta |
| `dev-stack-detect` (retired) | 3.5/5 | 1 | Dev |

**Average:** 4.38/5 across 27 runs (4.16/5 including legacy outliers)

---

## Section F — Recommendations for Cycle 6

### Immediate Actions

1. **Begin manual implementation** of L-01 (service implementation) — all specification inputs are ready, Cycle 5 research provides a vertical slice strategy with effort estimates (16-27 hours). Start with Slice 1 (Foundation) + Slice 2 (Guest Onboarding) per the research recommendation.
2. **Request new skills** via `skill-create` for the 3 missing capabilities: `dev-implement` (L-01), `dev-integration-wire` (L-02), `infra-ci-scaffold` (L-05).
3. **Submit `learn-add` feedback** to `backend-scaffold` requesting: (a) test stubs with every scaffold, (b) secure JWT via `jose` by default, (c) rate limiting on auth endpoints.
4. **Begin wiring (L-02)** in parallel: extract scaffold outputs into runnable monorepo structure following the Turborepo layout from research.
5. **Defer L-06 and L-07** to post-beta — they are P2 and not on the critical path.

### Priority Order

| Step | Action | Unblocks |
|------|--------|----------|
| 1 | Service implementation (L-01): fill scaffold stubs with business logic | Production code |
| 2 | Integration/wiring (L-02): extract scaffold into monorepo structure | Runnable application |
| 3 | Test generation (L-03): create test files from 74 BDD scenarios | Quality confidence |
| 4 | Security hardening (L-04): fix JWT, rate limiting, cookie auth | Safe public release |
| 5 | CI/CD scaffold (L-05): GitHub Actions, Docker, deployment | Deployment pipeline |
| 6 | Monetization (L-06): Stripe integration, entitlement gates | Revenue (post-beta) |
| 7 | i18n wiring (L-07): connect microcopy specs to UI framework | International users (post-beta) |

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | gap-reports/05-cycle/05-launch-gaps.md |
| Skill | gaps-critical-doc |
| Version | 3.0 |
| Status | Final |

---

> **Bottom line:** Cycle 5 confirmed jaan-to v5.0.0 works (zero quality degradation across 11 skills) and expanded audit coverage from 1/5 to 5/5 detect domains, revealing 2 new P2 gaps (monetization, i18n). However, the core problem persists: 7 gaps (3 P0, 2 P1, 2 P2) stand between Jaanify and launch, with production code still at 0%. The 3 P0 blockers (service implementation, integration/wiring, test generation) have been open for 1-5 cycles with zero resolution. The critical path is unchanged: L-01/L-02 (parallel) → L-04 → L-05. All specification inputs are ready, and Cycle 5 research provides a concrete vertical slice strategy. The next cycle must transition from auditing to implementing.
