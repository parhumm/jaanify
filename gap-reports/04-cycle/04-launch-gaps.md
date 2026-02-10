---
title: "Jaanify MVP — Consolidated P0 + P1 Launch Blockers"
cycle: 5
date: 2026-02-10
jaan_to_version: "v4.5.0"
previous_cycle: 3
gap_summary:
  total: 5
  p0: 3
  p1: 2
  p2: 0
  p3: 0
  new_skills_needed: 3
  skill_improvements_needed: 2
  existing_untested: 0
progress:
  specification: 75
  scaffold: 40
  production: 0
  tests: 0
---

# Jaanify MVP — Consolidated P0 + P1 Launch Blockers

> Date: 2026-02-10
> jaan-to Version: v4.5.0 (submodule)
> Cycle: 5 (consolidated from Cycle 3 + Cycle 4 launch gap reports)
> Previous: [03-launch-gaps.md](../03-cycle/03-launch-gaps.md) (Cycle 3, 2026-02-10)

---

## Executive Summary

This report consolidates the P0 and P1 launch blockers from the Cycle 3 launch readiness analysis and the Cycle 4 addendum into a single authoritative document. Both source reports identified the same 5 critical gaps — no gaps were resolved or added between them.

Jaanify has 19 deliverables across 4 co-evolution cycles: full PRD, 7 user stories, task breakdowns (68 frontend + 28 backend), OpenAPI 3.1 contract (21 endpoints), data model (7 tables), 74 BDD test cases, 3 design previews, microcopy in 7 languages, UX research, GTM tracking, backend scaffold, frontend scaffold, engineering audit (6.1/10), and CHANGELOG. Despite this breadth, **production code is at 0%, tests are at 0%, and infrastructure is at 0%**. Every scaffold service handler is a TODO stub (13 backend + 5 frontend), no source code directories exist, no test files exist, and no deployment infrastructure is in place.

The 3 P0 gaps (service implementation, integration/wiring, test generation) block any runnable application. The 2 P1 gaps (security hardening, CI/CD) block any safe public release. Together, these 5 gaps define the entire critical path to launch. 3 require new jaan-to skills that do not exist; 2 require improvements to existing capabilities.

---

## Section A — Current State

Jaanify has crossed the specification-to-scaffold threshold but has not yet crossed into production code. The project is 75% specified, 40% scaffolded, and 0% implemented.

### Implementation Progress

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 80% | 0% | 0% |
| Frontend | 100% | 80% | 0% | 0% |
| Infrastructure | 0% | 0% | 0% | 0% |
| Marketing / GTM | 50% | 0% | 0% | N/A |
| **Overall** | **75%** | **40%** | **0%** | **0%** |

**Evidence:**
- **Specification 75%**: Backend and frontend are fully specified (PRD, stories, task breakdowns, API contract, data model, test cases, design system, UX research). Infrastructure has no spec (0%). Marketing/GTM has GTM tracking + microcopy but no landing page or user docs spec (50%).
- **Scaffold 40%**: Backend scaffold has 21 route handlers, 7 Prisma models, Zod schemas, middleware — but 13 TODO stubs across 4 files (10 in services alone). Frontend scaffold has 26 components, 20 hooks, types, stores — but 5 TODO stubs in pages, all bundled in single files. Infrastructure and marketing have zero scaffold.
- **Production 0%**: No `src/`, `app/`, or `pages/` directories with actual source code. Scaffold outputs live in `jaan-to/outputs/`, not in a runnable project structure.
- **Tests 0%**: Zero `*.test.ts`, `*.spec.ts`, or `*.test.tsx` files. No `vitest.config.*`, `playwright.config.*`, or `jest.config.*` in project root.

### Existing Deliverables (19)

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
| Backend Scaffold | 4 | `backend-scaffold` | 21 route handlers, 7 Prisma models, Zod schemas, JWT auth |
| Frontend Scaffold | 4 | `frontend-scaffold` | 26 components, 20 hooks, 25 types, 4 stores, 3 pages |
| Engineering Audit | 4 | `detect-dev` | 6.1/10, 11 findings (1C/2H/3M/3L/2I) |
| Knowledge Pack | 4 | `detect-pack` | Risk heatmap, 1/5 domains analyzed |
| CHANGELOG | 4 | `release-iterate-changelog` | v0.1.0, Keep a Changelog format |

---

## Section B — P0 + P1 Gap Analysis

### P0 — Launch Blockers

These 3 gaps prevent any runnable application from existing. Without resolving all three, Jaanify remains at 0% production code regardless of specification quality.

---

#### Gap L-01: Service Implementation Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that generates real business logic from scaffold stubs + task breakdown + API contract + data model |
| **Exists in jaan-to?** | No — does not exist in v4.5.0 skill catalog (31 skills) |
| **Related gaps** | #17 (Cycle 4), #7 (Cycle 2 — backend code generation) |
| **Blocks** | Production code — without this, 0% of Jaanify actually works |

**Key points:**
- Backend scaffold has 21 route handlers that all return `// TODO: implement` — 10 TODO stubs in the services file alone
- AI reasoning engine, task CRUD, prioritization algorithm, auth flows — all empty stubs
- Task breakdown (28 tasks) + API contract (21 endpoints) + data model (7 tables) exist as input specs — all inputs are ready
- This is the single biggest gap — the entire critical path starts here
- No jaan-to skill in the catalog addresses code generation from specifications

**Expected outputs:**
- Filled service files with actual business logic, database queries (Prisma), validation
- Error handling following RFC 9457 patterns from API contract
- Auth service with proper JWT token lifecycle (replacing the broken `decodeJwt`)
- AI reasoning service integrating OpenAI SDK for task prioritization

---

#### Gap L-02: Integration / Wiring Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that takes standalone scaffold files and wires them into a real, runnable project directory structure |
| **Exists in jaan-to?** | No — does not exist in v4.5.0 skill catalog |
| **Related gaps** | #19, #20 (Cycle 4), #3 (Cycle 1 — dev-integration-plan) |
| **Blocks** | Runnable application — scaffolds are blueprints in `jaan-to/outputs/`, not an app |

**Key points:**
- Frontend has 26 components bundled in a single `.tsx` file — production needs individual files in `src/components/`
- Backend routes aren't connected to an app entry point — no `app.ts` or server bootstrap
- No import aliases, no provider wiring, no app bootstrap code
- No `package.json` scripts that actually run the app (`dev`, `build`, `start`)
- Scaffold outputs live in `jaan-to/outputs/backend/scaffold/` and `jaan-to/outputs/frontend/scaffold/` — not in a project root

**Expected outputs:**
- Individual component files in proper directory tree (`src/components/`, `src/hooks/`, `src/stores/`, etc.)
- App entry points (`app.ts` for Fastify backend, `layout.tsx` / `page.tsx` for Next.js)
- Provider setup (Zustand stores, auth context, theme provider)
- Working `package.json` with `dev`, `build`, `start`, `test`, `lint` scripts
- `tsconfig.json` with path aliases (`@/components`, `@/hooks`, etc.)
- `next.config.js`, `tailwind.config.ts`, `postcss.config.js`

---

#### Gap L-03: Test Stub Generation

| Field | Detail |
|-------|--------|
| **What** | A skill that generates Vitest unit tests + Playwright E2E tests from 74 existing BDD scenarios + scaffold code |
| **Exists in jaan-to?** | No — scaffold skills configure Vitest in `package.json` but generate zero test files |
| **Related gaps** | #15 (Cycle 4), #5 (Cycle 1 — dev-test-plan) |
| **Blocks** | Quality confidence — cannot launch with 0% test coverage |

**Key points:**
- Both scaffold skills configure Vitest in `package.json` but generate zero test files
- `pnpm test` would fail immediately — no `vitest.config.ts`, no test files, no mock setup
- 74 BDD test cases (from `qa-test-cases`) already exist as specs — they need to become runnable code
- Test infrastructure is a prerequisite for CI/CD pipeline (L-05 depends on this)
- This is a scaffold skill deficiency — the existing `backend-scaffold` and `frontend-scaffold` should include test stubs

**Expected outputs:**
- `*.test.ts` files for services, hooks, components (unit tests)
- `*.spec.ts` Playwright files for E2E user flows (7 stories)
- `vitest.config.ts` with proper path resolution and coverage config
- `playwright.config.ts` with browser matrix
- Mock setup: MSW for API mocking, test utilities, fixtures
- Minimum viable coverage: service layer unit tests + critical path E2E

---

### P1 — Security & Deployment

These 2 gaps prevent safe public release. The product may function locally, but cannot be exposed to users without addressing both.

---

#### Gap L-04: Security Hardening

| Field | Detail |
|-------|--------|
| **What** | Fix critical security vulnerabilities found by `detect-dev` audit in scaffold output |
| **Exists in jaan-to?** | Partial — `detect-dev` finds issues (scored 4.5/5) but no skill remediates them |
| **Related gap** | #16 (Cycle 4) |
| **Blocks** | Safe public release — critical vulnerability in auth system |

**Key points:**
- **E-DEV-001 (Critical):** JWT `decodeJwt` function in scaffold base64-decodes without crypto signature verification — any attacker can forge tokens. This is the #1 finding from the engineering audit.
- **E-DEV-002 (High):** No rate limiting on auth endpoints — brute force attacks on login/register are possible
- **E-DEV-003 (High):** Tokens stored in `localStorage` instead of httpOnly cookies — any XSS vulnerability can steal user sessions
- **E-DEV-005 (Medium):** Missing CSRF protection on mutation endpoints
- The scaffold skill (`backend-scaffold`) should generate secure auth middleware by default — this is a scaffold quality issue
- `detect-dev` scored 6.1/10 overall — 1 Critical, 2 High, 3 Medium, 3 Low, 2 Informational findings

**Expected outputs:**
- Secure auth middleware with proper JWT verification using `jose` library (replacing broken `decodeJwt`)
- Rate limiter middleware via `@fastify/rate-limit` on all auth and public endpoints
- httpOnly cookie-based session handling with CSRF protection (replacing `localStorage` tokens)
- Input validation hardening on all mutation endpoints
- Security regression tests covering the 4 critical/high findings

---

#### Gap L-05: CI/CD Scaffold Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate GitHub Actions workflows, Dockerfile, docker-compose, and deployment configs from `tech.md` context |
| **Exists in jaan-to?** | No — does not exist in v4.5.0 skill catalog |
| **Related gaps** | #18 (Cycle 4), #8 (Cycle 2), #10 (Cycle 1) |
| **Blocks** | Deployment — cannot ship what you cannot deploy |

**Key points:**
- No GitHub Actions workflow for build/test/lint/deploy — zero `.github/workflows/` files for Jaanify
- No Dockerfile or docker-compose for local development or production
- No staging/production environment configuration
- No database migration scripts in CI pipeline
- Tech stack is fully specified in `context/tech.md`: PostgreSQL 16, Redis 7, Typesense, Fastify v5, Next.js v15 — all inputs available
- This gap has been open since Cycle 1 (Gap #10) and Cycle 2 (Gap #8) — longest-standing unresolved gap
- Depends on L-01 + L-02 (need actual code to deploy) and L-03 (need tests to run in CI)

**Expected outputs:**
- `.github/workflows/ci.yml` — lint, type-check, test, build, deploy stages
- `Dockerfile` — multi-stage build for Fastify backend
- `docker-compose.yml` — PostgreSQL 16, Redis 7, Typesense, app (local dev)
- `.env.example` with all required environment variables documented
- Deployment config for target platform (Vercel for Next.js frontend, Railway/AWS for Fastify backend)
- Database migration step in CI (Prisma migrate)

---

## Section C — Summary Table

| Priority | Gap ID | Gap | Exists in jaan-to? | Blocks |
|----------|--------|-----|---------------------|--------|
| **P0** | L-01 | Service Implementation Skill | No | Production code |
| **P0** | L-02 | Integration / Wiring Skill | No | Runnable application |
| **P0** | L-03 | Test Stub Generation | No (scaffold deficiency) | Quality confidence |
| **P1** | L-04 | Security Hardening | Partial (detect finds, doesn't fix) | Safe public release |
| **P1** | L-05 | CI/CD Scaffold Skill | No | Deployment pipeline |

**Skills that need to be created:** 3 (L-01 service-impl, L-02 wiring, L-05 CI/CD)
**Skills that need improvement:** 2 (L-03 scaffold test gen deficiency, L-04 security remediation)

---

## Section D — Critical Path

```
L-01 Service Impl ──→ L-04 Security ──→ L-05 CI/CD ──→ Launch
L-02 Wiring ─────────────────────────↗
L-03 Test Gen ───────────────────────↗
```

**Critical path length:** 3 sequential stages.

**What determines minimum time to launch:**

1. **L-01 + L-02 are the bottleneck.** No production code can exist without service implementation (L-01), and no runnable app can exist without integration/wiring (L-02). These two must be solved first and can run in parallel with each other.
2. **L-03 can run in parallel** with L-01/L-02 once scaffold is wired — test stubs can be generated alongside service implementation.
3. **L-04 depends on L-01/L-02** — security hardening is meaningless on TODO stubs. Once real service code exists, JWT verification, rate limiting, and cookie-based auth can be applied.
4. **L-05 depends on L-01 + L-02 + L-03 + L-04** — CI/CD must deploy secure, tested code. This is the final gate before launch.

**Parallel lanes:**
- **Lane A (code):** L-01 Service Impl → L-04 Security → L-05 CI/CD
- **Lane B (structure):** L-02 Wiring → merges into L-04
- **Lane C (quality):** L-03 Test Gen → merges into L-05

---

## Section E — Cycle-Over-Cycle Delta

**Baseline:** Cycle 3 launch-gaps report (`gap-reports/03-cycle/03-launch-gaps.md`, 2026-02-10)

| Metric | Cycle 3 Report | This Report | Delta |
|--------|---------------|-------------|-------|
| Total gaps (P0+P1) | 5 | 5 | 0 |
| P0 gaps | 3 | 3 | 0 |
| P1 gaps | 2 | 2 | 0 |
| Specification | 75% | 75% | 0 |
| Scaffold | 40% | 40% | 0 |
| Production | 0% | 0% | 0 |
| Tests | 0% | 0% | 0 |
| New skills needed | 3 | 3 | 0 |
| Improvements needed | 2 | 2 | 0 |

**Gaps resolved since Cycle 3 report:** 0
**New gaps since Cycle 3 report:** 0
**Progress since Cycle 3 report:** No new deliverables, skills, or code.

### Cumulative Gap Registry (P0 + P1 Lineage)

| Gap ID | Description | First Discovered | Cycle Trail | Status |
|--------|-------------|-----------------|-------------|--------|
| L-01 | Service Implementation | Cycle 2 (#7 backend code gen) → Cycle 4 (#17) | C2 → C3 → C4 → C5 | **Open** |
| L-02 | Integration / Wiring | Cycle 1 (#3 dev-integration-plan) → Cycle 4 (#19, #20) | C1 → C2 → C3 → C4 → C5 | **Open** |
| L-03 | Test Stub Generation | Cycle 1 (#5 dev-test-plan) → Cycle 4 (#15) | C1 → C2 → C3 → C4 → C5 | **Open** |
| L-04 | Security Hardening | Cycle 4 (#16 JWT bypass) | C4 → C5 | **Open** |
| L-05 | CI/CD Scaffold | Cycle 1 (#10) → Cycle 2 (#8) → Cycle 4 (#18) | C1 → C2 → C3 → C4 → C5 | **Open** |

**Note:** L-02, L-03, and L-05 have been open since Cycle 1 — the three longest-standing unresolved gaps in the project.

### Skill Quality Map (18 Skills Tested)

| Skill | Score | Cycle | Category |
|-------|-------|-------|----------|
| `backend-api-contract` | 5.0/5 | 3 | Dev |
| `backend-data-model` | 4.9/5 | 3 | Dev |
| `pm-prd-write` | 4.8/5 | 1 | Planning |
| `qa-test-cases` | 4.7/5 | 1 | QA |
| `backend-scaffold` | 4.7/5 | 4 | Dev |
| `frontend-task-breakdown` | 4.6/5 | 1 | Planning |
| `backend-task-breakdown` | 4.6/5 | 2 | Planning |
| `frontend-scaffold` | 4.6/5 | 4 | Dev |
| `pm-story-write` | 4.5/5 | 2 | Planning |
| `frontend-design` | 4.5/5 | 1 | Design |
| `detect-dev` | 4.5/5 | 4 | Audit |
| `data-gtm-datalayer` | 4.4/5 | 1 | Data |
| `ux-microcopy-write` | 4.3/5 | 1 | UX |
| `ux-research-synthesize` | 4.2/5 | 2 | UX |
| `release-iterate-changelog` | 4.2/5 | 4 | Release |
| `ux-heatmap-analyze` | 4.0/5 | 2 | UX |
| `detect-pack` | 4.0/5 | 4 | Audit |
| `learn-report` | 2.3/5 | 3 | Meta |

**Average:** 4.35/5 across 18 runs (4.47/5 excluding `learn-report` outlier)

---

## Section F — Recommendations

### Immediate Actions

1. **Submit `learn-add` feedback** to `backend-scaffold` and `frontend-scaffold` requesting: (a) test stub generation with every scaffold, (b) secure JWT middleware by default using `jose`, (c) individual file output for frontend components instead of single-file bundles.
2. **Assess manual implementation** for L-01 (service implementation) and L-02 (integration/wiring) — these are the longest-pole gaps and may require manual work if no jaan-to skill is created. All specification inputs are ready.
3. **Manual security hardening** (L-04) — even on scaffold code, replace `decodeJwt` with `jose`/`@fastify/jwt`, add `@fastify/rate-limit`, move tokens to httpOnly cookies. This reduces critical risk immediately and does not require a new skill.
4. **Request new skills** via `skill-create` for the 3 missing capabilities: service-impl, wiring, CI/CD scaffold.

### Priority Order

| Step | Action | Unblocks |
|------|--------|----------|
| 1 | Service implementation (L-01): fill scaffold stubs with business logic | Production code — the single biggest blocker |
| 2 | Integration/wiring (L-02): extract scaffold into runnable project structure | Runnable application with `dev`/`build`/`start` scripts |
| 3 | Test generation (L-03): create test files from 74 BDD scenarios | Quality confidence, CI/CD prerequisite |
| 4 | Security hardening (L-04): fix JWT, rate limiting, cookie auth | Safe public release |
| 5 | CI/CD scaffold (L-05): GitHub Actions, Docker, deployment | Deployment pipeline — final gate to launch |

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | gap-reports/04-cycle/04-launch-gaps.md |
| Skill | gaps-critical-doc |
| Version | 3.0 |
| Status | Final |
| Sources | gap-reports/03-cycle/03-launch-gaps.md, gap-reports/04-cycle/04-launch-gaps.md (previous) |

---

> **Bottom line:** 5 gaps stand between Jaanify and launch — 3 P0 blockers (service implementation, integration/wiring, test generation) that prevent any runnable application, and 2 P1 blockers (security hardening, CI/CD) that prevent safe public release. 3 of these require new jaan-to skills that do not exist. The critical path runs L-01/L-02 (parallel) → L-04 → L-05, with L-03 running alongside. All specification inputs are ready — the bottleneck is purely implementation tooling. These 5 gaps have been open for 1-4 cycles with zero resolution progress.
