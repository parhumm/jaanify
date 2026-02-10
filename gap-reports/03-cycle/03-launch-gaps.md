---
title: "Jaanify MVP — Launch Readiness Gap Analysis (Cycle 3)"
cycle: 3
date: 2026-02-10
jaan_to_version: "v4.5.0"
previous_cycle: null
gap_summary:
  total: 10
  p0: 3
  p1: 2
  p2: 3
  p3: 2
  new_skills_needed: 5
  skill_improvements_needed: 3
  existing_untested: 5
progress:
  specification: 75
  scaffold: 40
  production: 0
  tests: 0
---

# Jaanify MVP — Launch Readiness Gap Analysis (Cycle 3)

> Date: 2026-02-10
> jaan-to Version: v4.5.0
> Cycle: 3 (skill-gaps-critical)
> Previous: None (first formal run; Cycle 4 addendum used as informal baseline)

---

## Executive Summary

Jaanify has completed full product specification and initial code scaffolding across 4 co-evolution cycles with jaan-to. 19 deliverables span PRD, user stories, task breakdowns, API contract, data model, test case specs, design components, microcopy, UX research, GTM tracking, backend scaffold (21 routes, 7 Prisma models), frontend scaffold (26 components, 20 hooks), and an engineering audit (6.1/10).

Despite this breadth, **production code is at 0%** — every scaffold service handler is a TODO stub, no source code directories exist, no test files exist, and no infrastructure (CI/CD, Docker, deployment) is in place. 10 gaps remain, of which 3 are P0 launch blockers that together prevent any runnable application. 5 of the 10 gaps require new jaan-to skills that do not exist today; 5 existing skills (4 detect + 1 UX flowchart) are available but untested. The critical path to launch runs through service implementation → security hardening → CI/CD, with integration/wiring and test generation running in parallel.

---

## Section A — Current State

Jaanify has crossed the specification-to-scaffold threshold but has not yet crossed into production code. The project is 100% specified, partially scaffolded, and 0% implemented.

### Implementation Progress

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 80% | 0% | 0% |
| Frontend | 100% | 80% | 0% | 0% |
| Infrastructure | 0% | 0% | 0% | 0% |
| Marketing / GTM | 50% | 0% | 0% | N/A |
| **Overall** | **75%** | **40%** | **0%** | **0%** |

**Methodology:**
- **Specification**: PRD, stories, task breakdowns, API contract, data model, test case specs, design system, UX research. Backend/Frontend fully specified. Infrastructure has no spec. Marketing has GTM tracking + microcopy but no landing page or user docs spec.
- **Scaffold**: Backend scaffold has 21 route handlers, 7 Prisma models, Zod schemas, middleware — but all service implementations are `// TODO: implement` stubs. Frontend scaffold has 26 components, 20 hooks, types, stores — but bundled in single files, not wired to project. Infrastructure and marketing have zero scaffold.
- **Production Code**: No `src/`, `app/`, or `pages/` directories with actual source code. Scaffold outputs live in `jaan-to/outputs/`, not in a runnable project structure. `0%` across all areas.
- **Tests**: Zero `*.test.ts`, `*.spec.ts`, or `*.test.tsx` files. No `vitest.config.*`, `jest.config.*`, or `playwright.config.*` in project root. `0%`.

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

## Section B — Launch & GTM Gap Analysis

### P0 — Launch Blockers

#### Gap L-01: Service Implementation Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that generates real business logic from scaffold stubs + task breakdown + API contract + data model |
| **Exists in jaan-to?** | No — does not exist |
| **Related gap** | #17 (Cycle 4) |
| **Blocks** | Production code — without this, 0% of Jaanify actually works |

**Key points:**
- Backend scaffold has 21 route handlers that all return `// TODO: implement`
- AI reasoning engine, task CRUD, prioritization algorithm, auth flows — all empty stubs
- Task breakdown (28 tasks) + API contract (21 endpoints) + data model (7 tables) exist as input specs
- This is the single biggest gap — specification quality is irrelevant without implementation

**Expected outputs:**
- Filled service files with actual business logic, database queries (Prisma), validation
- Error handling following RFC 9457 patterns from API contract
- Auth service with proper JWT token lifecycle (replacing the broken `decodeJwt`)

---

#### Gap L-02: Integration / Wiring Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that takes standalone scaffold files and wires them into a real, runnable project directory structure |
| **Exists in jaan-to?** | No — does not exist |
| **Related gaps** | #19, #20 (Cycle 4), #3 (Cycle 1) |
| **Blocks** | Runnable application — scaffolds are blueprints, not an app |

**Key points:**
- Frontend has 26 components in a single `.tsx` file — production needs individual files
- Backend routes aren't connected to an app entry point
- No import aliases, no provider wiring, no app bootstrap
- No `package.json` scripts that actually run the app (`dev`, `build`, `start`)

**Expected outputs:**
- Individual component files in proper directory tree (`src/components/`, `src/hooks/`, etc.)
- App entry points (`app.ts` for backend, `layout.tsx` / `page.tsx` for Next.js)
- Provider setup (Zustand stores, auth context, theme)
- Working `package.json` scripts, `tsconfig.json`, path aliases

---

#### Gap L-03: Test Stub Generation

| Field | Detail |
|-------|--------|
| **What** | A skill that generates Vitest unit tests + Playwright E2E tests from 74 existing BDD scenarios + scaffold code |
| **Exists in jaan-to?** | No — scaffold skills configure Vitest but generate zero test files |
| **Related gaps** | #15 (Cycle 4), #5 (Cycle 1) |
| **Blocks** | Quality confidence — cannot launch with 0% test coverage |

**Key points:**
- Both scaffold skills configure Vitest in `package.json` but generate zero test files
- `pnpm test` fails immediately — no vitest.config, no test files, no mock setup
- 74 BDD test cases (from `qa-test-cases`) already exist as specs — they need to become code
- Test infrastructure is a prerequisite for CI/CD pipeline

**Expected outputs:**
- `*.test.ts` files for services, hooks, components
- `*.spec.ts` Playwright files for E2E user flows
- `vitest.config.ts`, `playwright.config.ts`
- Mock setup (MSW for API mocking, test utilities)

---

### P1 — Security & Deployment

#### Gap L-04: Security Hardening

| Field | Detail |
|-------|--------|
| **What** | Fix critical security vulnerabilities found by `detect-dev` audit in scaffold output |
| **Exists in jaan-to?** | Partial — `detect-dev` finds issues but no skill fixes them |
| **Related gap** | #16 (Cycle 4) |
| **Blocks** | Safe public release — critical vulnerability in auth system |

**Key points:**
- **E-DEV-001 (Critical):** JWT `decodeJwt` function base64-decodes without crypto signature verification — any attacker can forge tokens
- **E-DEV-002 (High):** No rate limiting on auth endpoints — brute force attacks possible
- **E-DEV-003 (High):** Tokens stored in `localStorage` instead of httpOnly cookies — XSS can steal sessions
- **E-DEV-005 (Medium):** Missing CSRF protection on mutation endpoints
- Scaffold skill should generate secure auth middleware by default

**Expected outputs:**
- Secure auth middleware with proper JWT verification (e.g., `jose` library)
- Rate limiter middleware (e.g., `@fastify/rate-limit`)
- httpOnly cookie-based session handling with CSRF protection

---

#### Gap L-05: CI/CD Scaffold Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate GitHub Actions workflows, Dockerfile, docker-compose, and deployment configs from `tech.md` context |
| **Exists in jaan-to?** | No — does not exist |
| **Related gaps** | #18 (Cycle 4), #8 (Cycle 2) |
| **Blocks** | Deployment — cannot ship what you cannot deploy |

**Key points:**
- No GitHub Actions workflow for build/test/lint/deploy
- No Dockerfile or docker-compose for local development or production
- No staging/production environment configuration
- No database migration scripts in CI pipeline
- Tech stack is fully specified in `context/tech.md` — skill input is available

**Expected outputs:**
- `.github/workflows/ci.yml` (lint, test, build, deploy)
- `Dockerfile` + `docker-compose.yml` (PostgreSQL, Redis, Typesense, app)
- `.env.example` with all required environment variables
- Deployment config for target platform (Vercel/Railway/AWS)

---

### P2 — GTM Essentials

#### Gap L-06: Landing Page / Marketing Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate a product marketing site / landing page from PRD + design system + microcopy |
| **Exists in jaan-to?** | No — does not exist |
| **Related gap** | New — not previously identified before Cycle 4 addendum |
| **Blocks** | User acquisition — no public-facing page exists |

**Key points:**
- Jaanify has full PRD, 3 HTML design previews, microcopy in 7 languages, GTM tracking events
- No public-facing page to acquire users
- `frontend-design` creates app UI, not marketing pages
- `frontend-scaffold` generates app components, not landing pages
- GTM DataLayer events (18) are specified but need a page to fire on

**Expected outputs:**
- Landing page with value proposition, feature highlights, CTA sections
- SEO metadata, Open Graph tags, structured data
- GTM/analytics integration (using existing `data-gtm-datalayer` output)
- Responsive design following existing design system

---

#### Gap L-07: Complete Detect Suite

| Field | Detail |
|-------|--------|
| **What** | Run `detect-design`, `detect-writing`, `detect-product`, `detect-ux` for full quality picture |
| **Exists in jaan-to?** | Yes — 4 skills available but untested |
| **Related gap** | #21 (Cycle 4) |
| **Blocks** | Pre-launch quality audit — currently 1/5 domains covered |

**Key points:**
- Only `detect-dev` has been run (engineering audit, 6.1/10)
- `detect-pack` consolidation is weak at 1/5 domain coverage (20%)
- Need design consistency audit before UI launch
- Need writing/tone audit (microcopy exists in 7 languages)
- Need product reality check (features vs claims)
- Need UX heuristic evaluation (user journeys specified)

**Expected outputs:**
- 4 domain audit reports (`detect-design`, `detect-writing`, `detect-product`, `detect-ux`)
- Updated `detect-pack` consolidation with full 5/5 risk heatmap
- Actionable findings to fix before launch

---

#### Gap L-08: User Documentation Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate user-facing help docs, onboarding guides, and API documentation |
| **Exists in jaan-to?** | Partial — `docs-create` generates developer docs, not user-facing content |
| **Related gap** | New — not previously identified before Cycle 4 addendum |
| **Blocks** | User onboarding — US-04 (60-Second Onboarding) needs supporting materials |

**Key points:**
- `docs-create` generates internal developer documentation
- No skill for end-user help content, onboarding flows, or product guides
- API contract (OpenAPI 3.1) exists but needs hosted interactive docs
- Microcopy in 7 languages exists but needs a help center structure

**Expected outputs:**
- User onboarding guide (supporting US-04 60-second onboarding)
- Help center content (FAQ, feature guides)
- API reference docs (generated from OpenAPI 3.1 contract)
- In-app tooltip/coach-mark content

---

### P3 — Quality of Life

#### Gap L-09: UX Flowchart Generation

| Field | Detail |
|-------|--------|
| **What** | `ux-flowchart-generate` for Mermaid user-flow and system-flow diagrams |
| **Exists in jaan-to?** | Yes — available in v4.5.0 submodule, was blocked by plugin cache at v4.4.0 |
| **Related gap** | #14 (Cycle 4) |
| **Blocks** | Documentation quality — not a launch blocker |

**Key points:**
- Skill exists in v4.5.0 submodule but was previously blocked by plugin cache version mismatch
- Generates Mermaid flowcharts (userflow, systemflow, architecture, stateflow)
- Useful for developer handoff, onboarding docs, and architecture documentation
- GitHub-renderable Mermaid diagrams can serve as living architecture docs

**Expected outputs:**
- Mermaid user-flow diagrams for 7 user stories
- System architecture diagram
- State machine diagrams for task lifecycle

---

#### Gap L-10: Monitoring / Observability Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate logging, error tracking, and health check infrastructure |
| **Exists in jaan-to?** | No — does not exist |
| **Related gap** | New — not previously identified before Cycle 4 addendum |
| **Blocks** | Post-launch operations — flying blind without observability |

**Key points:**
- No structured logging setup (Fastify has pino, but no configuration)
- No error boundary configuration for React frontend
- No health endpoint (`/health`) for uptime monitoring
- No error tracking integration (Sentry, LogRocket, etc.)
- Production incidents require observability to diagnose

**Expected outputs:**
- Logger configuration (pino with structured JSON, log levels)
- Error tracking integration config
- `/health` and `/ready` endpoints
- React error boundaries with reporting
- Basic alerting setup (uptime, error rate)

---

## Section C — Summary Table

| Priority | Gap ID | Gap | Exists in jaan-to? | Blocks |
|----------|--------|-----|---------------------|--------|
| **P0** | L-01 | Service Implementation Skill | No | Production code |
| **P0** | L-02 | Integration / Wiring Skill | No | Runnable application |
| **P0** | L-03 | Test Stub Generation | No (scaffold deficiency) | Quality confidence |
| **P1** | L-04 | Security Hardening | Partial (detect finds, doesn't fix) | Safe public release |
| **P1** | L-05 | CI/CD Scaffold Skill | No | Deployment pipeline |
| **P2** | L-06 | Landing Page / Marketing Skill | No | User acquisition |
| **P2** | L-07 | Complete Detect Suite | Yes (4 untested skills) | Pre-launch quality audit |
| **P2** | L-08 | User Documentation Skill | Partial (`docs-create` is dev-only) | User onboarding |
| **P3** | L-09 | UX Flowchart Generation | Yes (available, previously cache-blocked) | Documentation |
| **P3** | L-10 | Monitoring / Observability | No | Post-launch operations |

**Skills that need to be created:** 5 (L-01 service-impl, L-02 wiring, L-05 CI/CD, L-06 landing-page, L-10 monitoring)
**Skills that need improvement:** 3 (L-03 scaffold test gen, L-04 security remediation, L-08 user docs)
**Skills that exist but are blocked/untested:** 5 (L-07: detect-design, detect-writing, detect-product, detect-ux; L-09: ux-flowchart-generate)

---

## Section D — Critical Path

```
L-01 Service Impl ──→ L-04 Security ──→ L-05 CI/CD ──→ Launch
L-02 Wiring ─────────────────────────↗
L-03 Test Gen ───────────────────────↗
L-07 Detect Suite ──→ Fix findings ──↗
L-06 Landing Page ──────────────────────→ GTM
L-08 User Docs ─────────────────────────→ GTM
L-09 Flowcharts (parallel, non-blocking)
L-10 Monitoring (parallel, pre-launch)
```

**Critical path length:** 3 sequential stages — L-01/L-02 (implementation) → L-04 (security) → L-05 (deployment).

**What determines minimum time to launch:**
1. **L-01 + L-02** are the bottleneck. No production code can exist without service implementation, and no runnable app can exist without integration/wiring. These two gaps must be solved first and can run in parallel with each other.
2. **L-04** depends on L-01/L-02 — security hardening is meaningless on TODO stubs.
3. **L-05** depends on L-04 — CI/CD must deploy secure code.
4. **L-03** (tests) can run in parallel with L-01/L-02 once scaffold is wired.
5. **L-07** (detect suite) can run immediately — all 4 skills exist today.

---

## Section E — Cycle-Over-Cycle Delta

First formal run of `skill-gaps-critical`. No previous output exists in `jaan-to/outputs/gaps/`.

**Informal baseline:** Cycle 4 addendum (`gap-reports/04-cycle/04-launch-gtm-gaps.md`, 2026-02-10).

| Metric | Cycle 4 Addendum | This Report | Delta |
|--------|-----------------|-------------|-------|
| Total gaps | 10 | 10 | 0 |
| P0 gaps | 3 | 3 | 0 |
| P1 gaps | 2 | 2 | 0 |
| P2 gaps | 3 | 3 | 0 |
| P3 gaps | 2 | 2 | 0 |
| Specification | 100%* | 75% | -25 (recalculated with infra/GTM) |
| Scaffold | ~25% | 40% | +15 (recalculated per-area average) |
| Production | 0% | 0% | 0 |
| Tests | 0% | 0% | 0 |
| New skills needed | 5 | 5 | 0 |
| Improvements needed | 3 | 3 | 0 |
| Untested skills | 2 | 5 | +3 (counted individual detect skills) |

*Cycle 4 addendum measured specification for backend/frontend only (100%). This report includes infrastructure (0%) and marketing/GTM (50%) in the average, yielding 75% overall.

**Gaps resolved since Cycle 4 addendum:** 0
**New gaps since Cycle 4 addendum:** 0
**Progress since Cycle 4 addendum:** No new deliverables, skills, or code since the addendum was written.

### Cumulative Gap Registry (All Cycles)

| # | Gap | Discovered | Resolved | Category | Status |
|---|-----|-----------|----------|----------|--------|
| #1 | Missing API contract | Cycle 1 | Cycle 3 | Dev | Resolved |
| #2 | Missing data model | Cycle 1 | Cycle 3 | Dev | Resolved |
| #3 | No dev-integration-plan skill | Cycle 1 | — | Workflow | Open → L-02 |
| #4 | Missing market research | Cycle 1 | Cycle 1 | Research | Resolved |
| #5 | No dev-test-plan skill | Cycle 1 | — | Workflow | Open → L-03 |
| #6 | Learn scripts fail on macOS | Cycle 2 | — | Infra | Open (Bash 3.2) |
| #7 | Missing backend scaffold | Cycle 2 | Cycle 4 | Scaffold | Resolved |
| #8 | No CI/CD pipeline skill | Cycle 2 | — | Workflow | Open → L-05 |
| #11 | Missing frontend scaffold | Cycle 2 | Cycle 4 | Scaffold | Resolved |
| #12 | learn-report script broken | Cycle 3 | — | Meta | Open (2.3/5) |
| #14 | Plugin cache version mismatch | Cycle 4 | — | Infra | Open |
| #15 | No test stub generation | Cycle 4 | — | Scaffold | Open → L-03 |
| #16 | JWT signature verification | Cycle 4 | — | Security | Open → L-04 |
| #17 | No service implementation skill | Cycle 4 | — | Workflow | Open → L-01 |
| #18 | No CI/CD scaffold skill | Cycle 4 | — | Workflow | Open → L-05 |
| #19 | No integration/wiring skill | Cycle 4 | — | Workflow | Open → L-02 |
| #20 | Single-file component output | Cycle 4 | — | Scaffold | Open → L-02 |
| #21 | detect-pack single domain | Cycle 4 | — | Detect | Open → L-07 |

**Resolution velocity:** 5 gaps resolved across 4 cycles (Cycle 1: 1, Cycle 3: 2, Cycle 4: 2). 13 gaps remain open, 8 of which map to launch readiness gaps L-01 through L-10.

### Skill Quality Map (20 Scorecards)

| Skill | Score | Cycle | Category |
|-------|-------|-------|----------|
| `pm-prd-write` | 4.8/5 | 1 | Planning |
| `frontend-design` | 4.5/5 | 1 | Design |
| `ux-microcopy-write` | 4.3/5 | 1 | UX |
| `qa-test-cases` | 4.7/5 | 1 | QA |
| `frontend-task-breakdown` | 4.6/5 | 1 | Planning |
| `data-gtm-datalayer` | 4.4/5 | 1 | Data |
| `pm-story-write` | 4.5/5 | 2 | Planning |
| `ux-research-synthesize` | 4.2/5 | 2 | UX |
| `ux-heatmap-analyze` | 4.0/5 | 2 | UX |
| `backend-task-breakdown` | 4.6/5 | 2 | Planning |
| `learn-report` | 2.3/5 | 3 | Meta |
| `backend-data-model` | 4.9/5 | 3 | Dev |
| `backend-api-contract` | 5.0/5 | 3 | Dev |
| `backend-scaffold` | 4.7/5 | 4 | Dev |
| `frontend-scaffold` | 4.6/5 | 4 | Dev |
| `detect-dev` | 4.5/5 | 4 | Audit |
| `detect-pack` | 4.0/5 | 4 | Audit |
| `release-iterate-changelog` | 4.2/5 | 4 | Release |

**Average score:** 4.35/5 across 18 skill runs (excluding `learn-report` outlier: 4.47/5)

---

## Section F — Recommendations for Cycle 4

### Immediate Actions

1. **Run existing untested detect skills** (L-07) — `detect-design`, `detect-writing`, `detect-product`, `detect-ux` all exist today and require zero new development. This closes the easiest gap.
2. **Run `ux-flowchart-generate`** (L-09) — skill is now available in v4.5.0 submodule. Generate user-flow and architecture Mermaid diagrams.
3. **Submit `learn-add` feedback** for scaffold skills requesting: (a) test stub generation in `backend-scaffold` and `frontend-scaffold`, (b) secure JWT middleware by default, (c) individual file output option for `frontend-scaffold`.
4. **Assess manual implementation** for L-01 (service implementation) and L-02 (integration/wiring) — these are the longest-pole gaps and may need manual work if no jaan-to skill is created.
5. **Security hardening** (L-04) — even on scaffold code, replace `decodeJwt` with `jose`/`@fastify/jwt`, add `@fastify/rate-limit`, move tokens to httpOnly cookies. This can be done manually and reduces critical risk.

### Priority Order

| Step | Action | Unblocks |
|------|--------|----------|
| 1 | Run `detect-design` + `detect-writing` + `detect-product` + `detect-ux` | L-07 → full 5/5 quality audit |
| 2 | Run `ux-flowchart-generate` | L-09 → flow diagrams |
| 3 | Submit learn-add for service impl + test gen + secure auth | L-01, L-03, L-04 → future skill improvements |
| 4 | Manual or skill-assisted service implementation | L-01 → production code |
| 5 | Wire scaffolds into runnable project structure | L-02 → runnable app |
| 6 | Security hardening (JWT, rate limit, cookies) | L-04 → safe release |
| 7 | CI/CD setup (GitHub Actions, Docker) | L-05 → deployment |

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | gap-reports/03-cycle/03-launch-gaps.md |
| Skill | skill-gaps-critical |
| Version | 3.0 |
| Status | Final |

---

> **Bottom line:** Jaanify is comprehensively specified and partially scaffolded but has 0% production code, 0% tests, and 0% infrastructure. The 3 P0 gaps (service implementation, integration/wiring, test generation) all require new jaan-to skills that don't exist yet — these are the true launch blockers. The fastest path to progress is running the 5 existing untested skills (4 detect + ux-flowchart) to close easy wins while submitting learn-add feedback and beginning manual implementation for the critical path items.
