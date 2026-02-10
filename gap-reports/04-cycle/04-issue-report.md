---
title: "5 launch blockers, 0% progress across 4 cycles — consolidated final ask"
issue_url: "https://github.com/parhumm/jaan-to/issues/53"
issue_number: 53
repo: "parhumm/jaan-to"
date: "2026-02-10"
source: "gap-reports/04-cycle/04-launch-gaps.md"
priorities_included: [p0, p1]
gaps_included: [L-01, L-02, L-03, L-04, L-05]
generated_by: "gaps-critical-issue"
---

> **Supersedes #52** — this is the consolidated version combining Cycle 3 and Cycle 4 launch readiness analyses into a single authoritative request.

Hi team,

We've been building **[Jaanify](https://github.com/parhumm/jaanify)** (an AI Task Manager with transparent reasoning) entirely with jaan-to for 4 co-evolution cycles now. The plugin has been outstanding for specification and scaffolding — 19 deliverables, 18 skills tested at an average of 4.35/5, including a 5.0/5 API contract, 4.9/5 data model, and 4.7/5 backend scaffold. The spec quality is genuinely world-class.

But here's the honest truth: **we ran the same gap analysis twice (Cycle 3 and Cycle 4) and got identical results both times — 0% production code, 0% tests, 0% infrastructure**. Not a single number moved. We consolidated both reports and the picture is stark: 5 gaps, 3 of which have been open since Cycle 1 (that's 4 cycles ago), and none of them can be resolved with the current skill catalog.

This issue covers all 5 launch blockers (3 P0 + 2 P1) — the complete critical path from scaffold to ship. Nothing else matters until these are addressed.

## P0 — Launch Blockers (the app literally doesn't work)

### 1. Every route handler is a TODO stub (Gap L-01)

**The pain:** 21 API endpoints beautifully defined in an OpenAPI 3.1 contract (scored 5.0/5). 7 Prisma models with DDL and indexes (scored 4.9/5). 28 backend tasks broken into vertical slices (scored 4.6/5). And every single route handler returns `// TODO: implement` — 10 TODO stubs in the services file alone. The AI reasoning engine? Empty function. Task CRUD? Empty function. Prioritization algorithm — [Jaanify](https://github.com/parhumm/jaanify)'s entire value proposition? Empty function.

**What we already have (the inputs are all there):**
- OpenAPI 3.1 contract: 21 endpoints, RFC 9457 error schemas, request/response examples (5.0/5)
- Data model: 7 tables, DDL, ESR indexes, GDPR section, migration playbook (4.9/5)
- Backend task breakdown: 28 tasks across 8 vertical slices with dependency graph (4.6/5)
- Backend scaffold: route handlers, Zod validation, middleware, Prisma models (4.7/5)
- User stories: 7 with Gherkin ACs (4.5/5)

**What's missing:** A skill that reads existing specs (task breakdown + API contract + data model + scaffold stubs) and generates actual business logic. Every input is ready — the spec-to-code bridge is the only missing piece. This gap was first identified in Cycle 2 as #7 ("backend code generation") and has been open for 4 cycles.

**Why it matters:** Without service implementation, [Jaanify](https://github.com/parhumm/jaanify)'s core promise — "show your work" AI reasoning for task prioritization — is literally `return null`. We invested 4 cycles and 18 skill runs specifying exactly what the code should do, and all of that investment sits unused. The specification quality is irrelevant without implementation.

**Expected output:**
- Filled service files with actual business logic, Prisma queries, validation
- Error handling following RFC 9457 patterns from the API contract
- Auth service with proper JWT token lifecycle (replacing the broken `decodeJwt`)
- AI reasoning service integrating OpenAI SDK for task prioritization

---

### 2. Scaffolds are a parts catalog, not an assembled product (Gap L-02)

**The pain:** Frontend scaffold: 26 components, 20 hooks, 25 types, 4 Zustand stores — all bundled in single `.tsx` output files sitting in `jaan-to/outputs/`. Backend routes: not connected to any app entry point. Run `npm run dev`? There is no dev script. No `tsconfig.json`, no path aliases, no provider wiring, no app bootstrap. The scaffold outputs are reference architectures, not a runnable application. This gap has been open since Cycle 1 (#3, "dev-integration-plan") — the longest-standing unresolved gap in the project.

**What we already have (the inputs are all there):**
- Frontend scaffold: 26 components, 20 hooks, 25 types, 4 stores, 3 pages (4.6/5)
- Backend scaffold: 21 route handlers, 7 Prisma models, Zod schemas, middleware (4.7/5)
- Frontend task breakdown: 68 tasks across 7 epics (4.6/5)
- 3 HTML design previews: dashboard, task input, onboarding (4.5/5)
- Tech stack fully defined in `context/tech.md` (Next.js v15, Fastify v5, TailwindCSS v4)

**What's missing:** A skill that takes standalone scaffold files and wires them into a real, runnable project directory structure. Every project that uses `backend-scaffold` or `frontend-scaffold` hits this same wall — the gap between "scaffold generated" and "app boots" is enormous and entirely manual. This affects every jaan-to user, not just [Jaanify](https://github.com/parhumm/jaanify).

**Why it matters:** You can't demo a parts catalog. You can't user-test a parts catalog. You can't deploy a parts catalog. Until scaffolds become a running app, nothing downstream (tests, security hardening, CI/CD, GTM) can happen.

**Expected output:**
- Individual component files in proper directory tree (`src/components/`, `src/hooks/`, etc.)
- App entry points (`app.ts` for Fastify, `layout.tsx` / `page.tsx` for Next.js)
- Provider setup (Zustand stores, auth context, theme provider)
- Working `package.json` with `dev`, `build`, `start`, `test`, `lint` scripts
- `tsconfig.json` with path aliases, `next.config.js`, `tailwind.config.ts`

---

### 3. 74 test scenarios that are just documentation (Gap L-03)

**The pain:** We invested in writing 74 detailed BDD test scenarios covering all 7 user stories (scored 4.7/5). Both scaffold skills dutifully configure Vitest in `package.json`. But there are zero test files. Not one `*.test.ts`. Not one `*.spec.ts`. Run `pnpm test` and it crashes immediately — no `vitest.config.ts`, no test files, no mock setup. We have better test *specifications* than most shipped products, and they're just markdown. This gap was first identified in Cycle 1 (#5, "dev-test-plan") and has been open for 4 cycles.

**What we already have (the inputs are all there):**
- 74 BDD test cases across 7 user stories in Given/When/Then format (4.7/5)
- Backend scaffold with testable route handlers and Zod schemas
- Frontend scaffold with testable components and hooks
- API contract with request/response examples for every endpoint
- Vitest already declared as a dependency in scaffold `package.json`

**What's missing:** The scaffold skills should include test stub generation, or a dedicated `qa-test-generate` skill should exist that takes `qa-test-cases` output + scaffold code and produces runnable Vitest unit tests + Playwright E2E specs.

**Why it matters:** Zero test coverage means zero confidence. CI/CD (L-05) requires tests to gate deployments. Security hardening (L-04) needs tests to verify fixes don't regress. Tests are on the critical path — not a nice-to-have. Every scaffold project ships with zero tests today.

**Expected output:**
- `*.test.ts` files for services, hooks, and components
- `*.spec.ts` Playwright files for E2E user flows
- `vitest.config.ts` and `playwright.config.ts`
- Mock setup (MSW for API mocking, test utilities, fixtures)
- A `pnpm test` command that actually runs and passes

---

## P1 — Security & Deployment (can't go public without these)

### 4. detect-dev finds critical vulnerabilities but nothing fixes them (Gap L-04)

**The pain:** The engineering audit (`detect-dev`, scored 4.5/5) found a **critical** vulnerability: the JWT `decodeJwt` function just base64-decodes the token without any cryptographic signature verification. Anyone can forge a valid-looking token and impersonate any user. Also: no rate limiting on auth endpoints (brute force away), tokens stored in `localStorage` instead of httpOnly cookies (any XSS = stolen sessions), and no CSRF protection on mutation endpoints. Overall score: 6.1/10, with 1 Critical, 2 High, 3 Medium findings. `detect-dev` is excellent at finding problems — but nothing in the catalog fixes them.

**What we already have (the inputs are all there):**
- Engineering audit: 11 findings with SARIF-formatted locations and severity (4.5/5)
- Backend scaffold with auth middleware already in place (just insecure)
- API contract specifying auth requirements per endpoint
- Knowledge pack consolidating risk assessment (4.0/5)

**What's missing:** Either a remediation skill that reads `detect-dev` findings and generates fixes, or `backend-scaffold` should generate secure auth patterns by default (proper JWT verification with `jose`, `@fastify/rate-limit`, httpOnly cookies, CSRF protection). The scaffold currently ships insecure auth to every project that uses it.

**Why it matters:** This is a legal and trust issue, not just a technical one. [Jaanify](https://github.com/parhumm/jaanify) handles user data — tasks, priorities, AI reasoning about personal workflows. Shipping with forgeable auth tokens and XSS-vulnerable session storage isn't just risky, it's negligent. And every project that uses `backend-scaffold` inherits this same critical vulnerability.

**Expected output:**
- Secure auth middleware with proper JWT verification using `jose`
- Rate limiter middleware via `@fastify/rate-limit`
- httpOnly cookie-based session handling with CSRF protection
- Security regression tests covering the 4 critical/high findings
- Updated scaffold defaults that generate secure auth by default

---

### 5. You can't ship what you can't deploy (Gap L-05)

**The pain:** No GitHub Actions workflow. No Dockerfile. No docker-compose. No staging environment. No production environment. No database migration scripts in any pipeline. The tech stack is fully specified in `context/tech.md` (PostgreSQL 16, Redis 7, Typesense, Fastify v5, Next.js v15), but there's zero infrastructure to run it anywhere. This gap has been open since Cycle 1 (#10) — the longest-standing unresolved gap alongside L-02.

**What we already have (the inputs are all there):**
- Tech stack fully defined in `context/tech.md`
- Data model with migration playbook and DDL scripts
- Backend scaffold with defined entry points and middleware
- API contract with environment-specific base URLs

**What's missing:** An `infra-scaffold` or `cicd-scaffold` skill that generates GitHub Actions workflows, Dockerfile, docker-compose, and deployment configs from `context/tech.md`. Every scaffold skill generates application code, but none generate the infrastructure to run it.

**Why it matters:** CI/CD is the gate between "code on main" and "product users can access." Without it, every merge is manual, every deployment is risky, and there's no automated quality gate. This is the final step on the critical path — everything upstream (L-01, L-02, L-03, L-04) feeds into this.

**Expected output:**
- `.github/workflows/ci.yml` (lint, type-check, test, build, deploy stages)
- `Dockerfile` + `docker-compose.yml` (PostgreSQL 16, Redis 7, Typesense, app)
- `.env.example` with all required environment variables
- Deployment config for target platform (Vercel for frontend, Railway/AWS for backend)
- Database migration step in CI (Prisma migrate)

---

## Summary

| Priority | Gap | Need | Type | Open Since |
|----------|-----|------|------|------------|
| **P0** | L-01 | Service Implementation Skill | New skill | Cycle 2 |
| **P0** | L-02 | Integration / Wiring Skill | New skill | Cycle 1 |
| **P0** | L-03 | Test Stub Generation | Scaffold improvement | Cycle 1 |
| **P1** | L-04 | Security Hardening | Scaffold improvement | Cycle 4 |
| **P1** | L-05 | CI/CD Scaffold Skill | New skill | Cycle 1 |

**3 new skills needed**, **2 existing skills need improvement**.

Critical path: L-01/L-02 (parallel, implementation + wiring) → L-04 (security) → L-05 (CI/CD) → Launch. L-03 (tests) runs parallel once scaffolds are wired.

Three of these gaps have been open since Cycle 1. The delta between the Cycle 3 and Cycle 4 gap analyses was exactly zero — no progress on any of these 5 blockers. This consolidated issue represents the single authoritative request.

---

**Project:** [Jaanify](https://github.com/parhumm/jaanify) — AI Task Manager with transparent reasoning ("show your work")
**Full analysis:** `gap-reports/04-cycle/04-launch-gaps.md`
**jaan-to version:** v4.5.0
