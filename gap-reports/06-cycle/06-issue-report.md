---
title: "27 deliverables across 6 cycles but 0% production code — need skills to close the last mile"
issue_url: "https://github.com/parhumm/jaan-to/issues/58"
issue_number: 58
repo: "parhumm/jaan-to"
date: "2026-02-10"
source: "gap-reports/06-cycle/06-launch-gaps.md"
priorities_included: [p0, p1]
gaps_included: [L-01, L-02, L-03, L-04, L-05]
generated_by: "gaps-critical-issue"
---

Hi team,

We've been building [Jaanify](https://github.com/parhumm/jaanify) (a Smart AI Task Manager with transparent AI reasoning) entirely with jaan-to for **6 cycles** now. The plugin has been fantastic for specification and scaffolding — we've generated **27 deliverables** including a full PRD with 7 user stories, an OpenAPI 3.1 contract with 21 endpoints, 74 BDD test scenarios, a PostgreSQL data model with 7 tables, frontend and backend scaffolds, a complete 5/5 domain audit (33 findings), 4 UX flowcharts, and a scaffold-to-production conversion strategy from 45+ sources. We've tested **28 of 33 jaan-to skills** with an average score of 4.24/5.

But here's the honest truth: **we're at 75% specification, 40% scaffold, and 0% production code**. Zero. Not a single line of business logic runs. `pnpm test` would crash immediately because zero test files exist. There's no `app.ts`, no `layout.tsx`, no runnable project structure — just beautifully specified blueprints sitting in `jaan-to/outputs/`. [Jaanify](https://github.com/parhumm/jaanify)'s core value proposition — AI-powered task prioritization with transparent reasoning cards — is an empty function right now.

This issue covers the **5 most critical gaps** (P0 + P1) that are blocking [Jaanify](https://github.com/parhumm/jaanify)'s launch. These gaps have been open for 2–6 cycles. All specification inputs exist. The vertical slice strategy is researched. What's missing are the skills to go from scaffold to production.

## P0 — Launch Blockers

### 1. Every route handler returns `// TODO: implement` (Gap L-01)

**The pain:** [Jaanify](https://github.com/parhumm/jaanify)'s backend has 21 route handlers and every single one does literally nothing. The auth service? `// TODO: implement`. The AI reasoning engine — the entire differentiator of the product? `// TODO: implement`. There are 10 service stubs that are completely empty. We have a full OpenAPI contract with RFC 9457 error handling, a data model with 7 tables, and 28 backend tasks broken down by vertical slice — and none of it has been turned into actual business logic.

**What we already have (the inputs are all there):**
- API contract: 21 endpoints with request/response schemas (`backend-api-contract`, scored 5.0/5)
- Data model: 7 PostgreSQL tables with DDL, indexes, constraints (`backend-data-model`, scored 4.9/5)
- Backend task breakdown: 28 tasks in 8 vertical slices (`backend-task-breakdown`, scored 4.6/5)
- Scaffold: 21 route handlers, 7 Prisma models, Zod validation schemas (`backend-scaffold`, scored 4.7/5)
- Scaffold-to-production research: vertical slice strategy with effort estimates (~45 sources)
- Learning feedback: JWT security fix (`jose` over `decodeJwt`) and test stub requests submitted in Cycle 6

**What's missing:** A skill (something like `dev-implement` or `backend-service-generate`) that reads these specs and generates actual business logic — real Prisma queries, real validation, real error handling. The inputs are all there; we need the transformation step from specification → working code.

**Why it matters:** Without production code, [Jaanify](https://github.com/parhumm/jaanify) doesn't exist as a product. We can't demo it, test it, or ship it. Six cycles of specification work are sitting idle. The AI reasoning service — the entire reason [Jaanify](https://github.com/parhumm/jaanify) is different from every other task manager — is a TODO stub.

**Expected output:**
- Filled service files with real Prisma queries, business logic, and validation
- RFC 9457 error handling wired from the API contract
- Auth service with proper JWT verification using `jose` (replacing the broken `decodeJwt`)
- AI reasoning service integrating OpenAI SDK for task prioritization

---

### 2. Scaffolds are a parts catalog, not an assembled product (Gap L-02)

**The pain:** The frontend scaffold has 26 components — all in a single `.tsx` file. The backend has 21 routes — not connected to any app entry point. There's no `app.ts`, no `layout.tsx`, no `package.json` with working `dev`/`build`/`start` scripts. We don't have a project — we have a parts catalog. Running `npm start` would fail because there's nothing to start.

**What we already have (the inputs are all there):**
- Frontend scaffold: 26 components, 20 TanStack Query hooks, 4 Zustand stores, 25 TypeScript types (`frontend-scaffold`, scored 4.6/5)
- Backend scaffold: 21 routes, 7 Prisma models, middleware chain (`backend-scaffold`, scored 4.7/5)
- Monorepo architecture: Turborepo layout researched in Cycle 5 (`packages/shared-types/`, `apps/api/`, `apps/web/`)
- UX flowcharts: 4 user journeys with navigation patterns mapped
- Architecture concept doc: Transparent Copilot approach documented in Cycle 6

**What's missing:** A skill (something like `dev-integration-wire` or `scaffold-to-project`) that takes standalone scaffold files and wires them into a runnable project directory. Split the single-file bundles into individual component files, create app entry points, generate config files, and produce a `pnpm dev` command that actually starts something.

**Why it matters:** This gap has been open since **Cycle 1** — it's the longest-standing blocker alongside L-03 and L-05. Without wiring, the scaffolds are documentation with a `.tsx` extension. Every cycle we generate more specifications and more scaffolds, but none of them can run. This is the gap between "blueprint" and "building."

**Expected output:**
- Individual component files in `src/components/`, `src/hooks/`, `src/stores/`
- App entry points (`app.ts` for Fastify, `layout.tsx` + `page.tsx` for Next.js App Router)
- Working `package.json` files with `dev`, `build`, `start` scripts that actually work
- `tsconfig.json` with path aliases, `next.config.js`, `tailwind.config.ts`

---

### 3. 74 test scenarios that are just documentation (Gap L-03)

**The pain:** We invested in writing 74 detailed BDD test scenarios across 7 user stories — task creation, AI parsing, daily plan generation, onboarding, the works. They're beautifully structured Gherkin (`qa-test-cases`, scored 4.7/5). And they're completely useless right now because zero test files exist. `pnpm test` crashes immediately. Both `backend-scaffold` and `frontend-scaffold` configure Vitest in `package.json` but generate exactly zero `.test.ts` files. The irony is painful.

**What we already have (the inputs are all there):**
- 74 BDD/Gherkin test scenarios across 7 user stories (`qa-test-cases`, scored 4.7/5)
- Backend scaffold with Vitest configured in `package.json`
- Frontend scaffold with Vitest configured in `package.json`
- Test pyramid strategy from Cycle 5 research: 70% unit (Vitest + mocked Prisma), 20% integration, 10% E2E (Playwright)
- Learning feedback submitted in Cycle 6 requesting test stubs alongside scaffold code

**What's missing:** Either a new skill (`dev-test-generate`) that transforms BDD specs + scaffold code into runnable test files, or an improvement to `backend-scaffold` and `frontend-scaffold` to generate test stubs alongside every scaffold output. The Cycle 6 learning feedback requested exactly this — "generate vitest test stubs (`.test.ts`) for each service function alongside scaffold code."

**Why it matters:** You can't launch with 0% test coverage and claim quality confidence. The test scenarios exist — someone (the AI) carefully wrote 74 of them. But they're markdown files, not code. This also blocks CI/CD (L-05) since there's nothing for a pipeline to run. Has been open since Cycle 1 — 6 cycles without resolution.

**Expected output:**
- `*.test.ts` files for services, hooks, and components
- `*.spec.ts` Playwright files for 7 user stories
- `vitest.config.ts` and `playwright.config.ts` configuration files
- Mock setup: MSW for API mocking, test utilities, fixtures
- A `pnpm test` command that actually runs and passes

---

## P1 — Security & Deployment (can't go public without these)

### 4. Auth system is wide open — anyone can forge a token (Gap L-04)

**The pain:** The `detect-dev` audit (scored 4.5/5, very thorough) found that [Jaanify](https://github.com/parhumm/jaanify)'s auth middleware uses `decodeJwt` — which literally just base64-decodes the token without any cryptographic verification. Anyone can craft a valid-looking JWT and the server will trust it. That's finding E-DEV-001, severity Critical. On top of that: zero rate limiting on any endpoint (E-DEV-002, High), and access tokens stored in `localStorage` where any XSS attack can steal them (E-DEV-003, High).

**What we already have (the inputs are all there):**
- Full detect-dev audit: 11 findings with severity classifications (1 Critical, 2 High, 3 Medium, 3 Low, 2 Informational)
- `detect-writing` cross-referenced E-DEV-003 (confirming the token storage issue spans domains)
- Learning feedback submitted in Cycle 6: "Use `jose` library for JWT verification by default, not `decodeJwt`"
- Tech stack specifies `@fastify/jwt` or `jose` as the correct auth approach

**What's missing:** `detect-dev` finds the problems beautifully, but nothing fixes them. There's no `security-harden` or `scaffold-remediate` skill. The scaffold itself (`backend-scaffold`) should generate secure auth by default — every project that uses `backend-scaffold` currently ships with this same insecure `decodeJwt` pattern.

**Why it matters:** This is a legal and trust issue, not just a technical one. [Jaanify](https://github.com/parhumm/jaanify) is a task manager that stores users' personal tasks, daily plans, and AI reasoning data. Shipping with an auth system where anyone can forge tokens would be irresponsible. This needs to be fixed before any public release — even a beta.

**Expected output:**
- Secure JWT verification using `jose` or `@fastify/jwt` library
- Rate limiter via `@fastify/rate-limit` on auth and public endpoints
- httpOnly cookie-based token storage with CSRF protection
- Security regression tests verifying the fixes

---

### 5. You can't ship what you can't deploy (Gap L-05)

**The pain:** Zero `.github/workflows/` files for [Jaanify](https://github.com/parhumm/jaanify). Zero Dockerfile. Zero `docker-compose.yml`. The tech stack is fully specified (PostgreSQL 16, Redis 7, Typesense for search, Node.js 22, Fastify v5, Next.js 15), the Cycle 5 research prescribes a detailed 7-phase CI pipeline (Install → Lint+TypeCheck → Unit → Integration → Build → E2E → Deploy), and yet there's nothing to deploy with. This gap has been open since Cycle 1.

**What we already have (the inputs are all there):**
- Full tech stack specification in `context/tech.md` — all infrastructure choices documented
- Cycle 5 research with 7-phase CI pipeline prescription
- Docker and GitHub Actions explicitly listed as tools in tech.md
- Database, cache, and search engine choices all finalized

**What's missing:** A skill (something like `infra-ci-scaffold` or `devops-scaffold`) that reads `tech.md` and generates: GitHub Actions workflows, Dockerfile, docker-compose for the local dev environment, and deployment configuration. The infrastructure spec exists — we need the files.

**Why it matters:** Even if L-01 through L-04 are all resolved, we still can't ship without a deployment pipeline. This is the final gate on the critical path. And without `docker-compose.yml`, local development requires manually setting up PostgreSQL, Redis, and Typesense — friction that slows down everything before it.

**Expected output:**
- `.github/workflows/ci.yml` — lint, type-check, test, build, deploy stages
- `Dockerfile` — multi-stage production build for Fastify
- `docker-compose.yml` — PostgreSQL 16, Redis 7, Typesense for local dev
- `.env.example` with all required environment variables documented

---

## Summary

| Priority | Gap | Need | Type |
|----------|-----|------|------|
| **P0** | L-01 | Service implementation — fill scaffold stubs with business logic | New skill |
| **P0** | L-02 | Integration/wiring — extract scaffolds into runnable project | New skill |
| **P0** | L-03 | Test generation — turn 74 BDD scenarios into runnable tests | New skill / Scaffold improvement |
| **P1** | L-04 | Security hardening — fix JWT, rate limiting, token storage | Scaffold improvement |
| **P1** | L-05 | CI/CD scaffold — GitHub Actions, Docker, deployment | New skill |

**3 new skills needed**, **2 existing skills need improvement**.

Critical path: L-01 + L-02 (parallel) → L-04 → L-05 → Launch. L-03 runs in parallel with L-01/L-02. All 5 gaps have been open for 2–6 cycles with zero resolution.

---

**Project:** [Jaanify](https://github.com/parhumm/jaanify) — Smart AI Task Manager with transparent reasoning
**Full analysis:** `gap-reports/06-cycle/06-launch-gaps.md`
**jaan-to version:** v5.1.0 (SHA: fdbd3ac)
