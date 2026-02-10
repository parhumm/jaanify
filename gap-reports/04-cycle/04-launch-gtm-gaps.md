# Launch & GTM Skills Gap Report — Cycle 4 Addendum

> Date: 2026-02-10
> jaan-to Version: v4.5.0 (submodule)
> Parent: [04-gaps.md](04-gaps.md) (Cycle 4 Gap Report, 2026-02-09)

---

## Section A — Current State

Jaanify has completed full specification and initial scaffolding across 4 co-evolution cycles. This addendum identifies the skills gaps that must be closed before launch and go-to-market.

### Implementation Progress

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | ~80% | 0% | 0% |
| Frontend | 100% | ~80% | 0% | 0% |
| Infrastructure | 0% | 0% | 0% | 0% |
| Marketing / GTM | 0% | 0% | 0% | N/A |
| **Overall** | **100%** | **~25%** | **0%** | **0%** |

### What Exists (17 Deliverables)

| Deliverable | Cycle | Skill | Key Metric |
|-------------|-------|-------|------------|
| PRD | 1 | `pm-prd-write` | 7 features, success metrics, MVP scope |
| User Stories (7) | 2 | `pm-story-write` | Gherkin ACs for US-01 through US-07 |
| Frontend Tasks (68) | 1 | `frontend-task-breakdown` | 68 tasks across 7 epics |
| Backend Tasks (28) | 2 | `backend-task-breakdown` | 28 tasks, 8 vertical slices |
| Data Model | 3 | `backend-data-model` | 7 tables, DDL, indexes, migration playbook |
| API Contract | 3 | `backend-api-contract` | OpenAPI 3.1, 21 endpoints, RFC 9457 errors |
| Test Cases (74 BDD) | 1 | `qa-test-cases` | 74 BDD scenarios across 7 stories |
| Design System (HTML) | 1 | `frontend-design` | 3 HTML component previews |
| Microcopy (7 langs) | 1+3 | `ux-microcopy-write` | 14 items × 7 languages |
| UX Research | 2 | `ux-research-synthesize` | 6 themes, 5 recommendations |
| UX Heatmap | 2 | `ux-heatmap-analyze` | Predictive audit, 3 screens |
| GTM DataLayer | 1 | `data-gtm-datalayer` | 18 events for task lifecycle |
| Backend Scaffold | 4 | `backend-scaffold` | 21 route handlers, 7 Prisma models, Zod schemas |
| Frontend Scaffold | 4 | `frontend-scaffold` | 26 components, 20 hooks, 25 types, 4 stores |
| Engineering Audit | 4 | `detect-dev` | 6.1/10, 11 findings (1C/2H/3M/3L/2I) |
| Knowledge Pack | 4 | `detect-pack` | Risk heatmap, 1/5 domains |
| CHANGELOG | 4 | `release-iterate-changelog` | v0.1.0, Keep a Changelog format |

---

## Section B — Launch & GTM Skills Gap Analysis

### P0 — Launch Blockers

#### Gap L-01: Service Implementation Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that generates real business logic from scaffold stubs + task breakdown + API contract + data model |
| **Exists in jaan-to?** | No |
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
- Auth service with proper JWT token lifecycle

---

#### Gap L-02: Integration / Wiring Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that takes standalone scaffold files and wires them into a real, runnable project directory structure |
| **Exists in jaan-to?** | No |
| **Related gaps** | #19, #20 (Cycle 4), #3 (Cycle 1) |
| **Blocks** | Runnable application — scaffolds are blueprints, not an app |

**Key points:**
- Frontend has 26 components in a single .tsx file — production needs individual files
- Backend routes aren't connected to an app entry point
- No import aliases, no provider wiring, no app bootstrap
- No `package.json` scripts that actually run the app (`dev`, `build`, `start`)

**Expected outputs:**
- Individual component files in proper directory tree (`src/components/`, `src/hooks/`, etc.)
- App entry points (`app.ts` for backend, `layout.tsx` / `page.tsx` for Next.js)
- Provider setup (Zustand stores, auth context, theme)
- Working `package.json` scripts, `tsconfig.json`, path aliases

---

#### Gap L-03: Test Stub Generation Skill

| Field | Detail |
|-------|--------|
| **What** | A skill that generates Vitest unit tests + Playwright E2E tests from 74 existing BDD scenarios + scaffold code |
| **Exists in jaan-to?** | No (scaffold skills configure Vitest but generate zero test files) |
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

### P1 — Security & Deployment (required before any public release)

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
| **Exists in jaan-to?** | No |
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

### P2 — GTM Essentials (required for go-to-market)

#### Gap L-06: Landing Page / Marketing Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate a product marketing site / landing page from PRD + design system + microcopy |
| **Exists in jaan-to?** | No |
| **Related gap** | New — not previously identified |
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
- `detect-pack` consolidation is weak at 1/5 domain coverage
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
| **Related gap** | New — not previously identified |
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

### P3 — Quality of Life (improve quality, not blockers)

#### Gap L-09: UX Flowchart Generation

| Field | Detail |
|-------|--------|
| **What** | `ux-flowchart-generate` for Mermaid user-flow and system-flow diagrams |
| **Exists in jaan-to?** | Yes — available in v4.5.0, blocked by plugin cache at v4.4.0 |
| **Related gap** | #14 (Cycle 4) |
| **Blocks** | Documentation quality — not a launch blocker |

**Key points:**
- Skill exists in v4.5.0 submodule but plugin cache is stuck at v4.4.0
- Generates Mermaid flowcharts (userflow, systemflow, architecture, stateflow)
- Useful for developer handoff, onboarding docs, and architecture documentation
- Resolving cache mismatch (Gap #14) would unblock this

**Expected outputs:**
- Mermaid user-flow diagrams for 7 user stories
- System architecture diagram
- State machine diagrams for task lifecycle

---

#### Gap L-10: Monitoring / Observability Skill

| Field | Detail |
|-------|--------|
| **What** | A skill to generate logging, error tracking, and health check infrastructure |
| **Exists in jaan-to?** | No |
| **Related gap** | New — not previously identified |
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
| **P3** | L-09 | UX Flowchart Generation | Yes (cache blocked) | Documentation |
| **P3** | L-10 | Monitoring / Observability | No | Post-launch operations |

**Skills that need to be created:** 5 (L-01, L-02, L-05, L-06, L-10)
**Skills that need improvement:** 3 (L-03 scaffold deficiency, L-04 partial, L-08 partial)
**Skills that exist but are blocked/untested:** 2 (L-07, L-09)

---

## Section D — Recommendations for Cycle 5

### Immediate Actions

1. **Submit `learn-add` feedback** for L-01 (service implementation), L-02 (integration/wiring), L-03 (test generation) — request new skills or scaffold skill improvements
2. **Resolve plugin cache** (Gap #14) to unblock `ux-flowchart-generate` (L-09)
3. **Run remaining detect skills** (L-07) — these exist today and require no new development

### Cycle 5 Priority Order

| Step | Action | Unblocks |
|------|--------|----------|
| 1 | Run `detect-design` + `detect-writing` + `detect-product` + `detect-ux` | L-07 → full quality audit |
| 2 | Resolve cache, run `ux-flowchart-generate` | L-09 → flow diagrams |
| 3 | Submit learn-add for service implementation skill | L-01 → future production code |
| 4 | Submit learn-add for test generation in scaffold skills | L-03 → future test coverage |
| 5 | Manual security hardening of JWT, rate limiting | L-04 → safe release readiness |

### Critical Path to Launch

```
L-01 Service Impl ──→ L-04 Security ──→ L-05 CI/CD ──→ Launch
L-02 Wiring ─────────────────────────↗
L-03 Test Gen ───────────────────────↗
L-07 Detect Suite ──→ Fix findings ──↗
L-06 Landing Page ──────────────────────→ GTM
L-08 User Docs ─────────────────────────→ GTM
```

**Estimated skill dependency**: L-01 + L-02 must complete before L-04 and L-05 can be meaningful. L-03 can run in parallel with L-01/L-02.

---

> **Bottom line:** 5 of 10 gaps require new jaan-to skills that don't exist yet. The biggest blocker is L-01 (service implementation) — without it, Jaanify stays at 0% production code regardless of specification quality. Cycle 5 should prioritize running existing untested skills (L-07, L-09) while submitting learn-add feedback for the 5 missing skills.
