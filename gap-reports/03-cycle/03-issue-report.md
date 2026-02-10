---
title: "21 TODO stubs and zero tests — need 3 skills to turn specs into a running app"
issue_url: "https://github.com/parhumm/jaan-to/issues/52"
issue_number: 52
repo: "parhumm/jaan-to"
date: "2026-02-10"
source: "gap-reports/03-cycle/03-launch-gaps.md"
priorities_included: [p0, p1]
gaps_included: [L-01, L-02, L-03, L-04, L-05]
generated_by: "gaps-critical-issue"
---

Hi team,

We've been building **Jaanify** (an AI Task Manager with transparent reasoning) entirely with jaan-to for 4 co-evolution cycles now. The plugin has been fantastic for specification and scaffolding — we've generated 19 deliverables including a complete PRD, 7 user stories with Gherkin ACs, an OpenAPI 3.1 contract with 21 endpoints, a data model with 7 Prisma tables, 74 BDD test scenarios, backend scaffold (21 routes, 7 models), frontend scaffold (26 components, 20 hooks), and an engineering audit scoring 6.1/10. Average skill quality across 18 runs: 4.35/5.

But here's the honest truth: **we're at 75% specification, 40% scaffold, and 0% production code**. Every single route handler returns `// TODO: implement`. There are zero test files — `pnpm test` crashes immediately. No `src/` directory exists with actual source code. The scaffolds live in `jaan-to/outputs/`, not in a runnable project structure. We have a parts catalog, not an assembled product.

This issue covers the 5 most critical gaps (P0 + P1) that are blocking our path from scaffold to launch.

## P0 — Launch Blockers

### 1. Every route handler is a TODO stub (Gap L-01)

**The pain:** We have 21 API endpoints beautifully defined in an OpenAPI 3.1 contract, 7 Prisma models with DDL and indexes, and 28 backend tasks broken down into vertical slices. But literally every single route handler returns `// TODO: implement`. The AI reasoning engine? Empty. Task CRUD? Empty. Prioritization algorithm — Jaanify's core value prop? An empty function. The specification quality is genuinely impressive (5.0/5 for the API contract) but it's irrelevant when the business logic is `return null`.

**What we already have (the inputs are all there):**
- OpenAPI 3.1 contract with 21 endpoints, RFC 9457 error schemas (scored 5.0/5)
- Data model with 7 tables, DDL, indexes, migration playbook (scored 4.9/5)
- Backend task breakdown with 28 tasks across 8 vertical slices (scored 4.6/5)
- Backend scaffold with route handlers, Zod validation schemas, middleware (scored 4.7/5)
- 7 user stories with detailed Gherkin acceptance criteria (scored 4.5/5)

**What's missing:** A skill that reads these specs (task breakdown + API contract + data model + scaffold stubs) and generates actual business logic. Something like `backend-service-implement` that takes the TODO stubs and fills them with real Prisma queries, validation, auth flows, and error handling based on the existing specifications.

**Why it matters:** This is the single biggest blocker. Without service implementation, Jaanify's core value proposition — transparent AI reasoning for task prioritization — is literally an empty function. We invested 4 cycles specifying exactly what the code should do, and all of that investment is sitting unused because the last mile (spec → code) doesn't exist as a skill.

**Expected output:**
- Filled service files with actual business logic and Prisma queries
- Error handling following RFC 9457 patterns from the API contract
- Auth service with proper JWT token lifecycle (replacing the broken `decodeJwt`)
- AI reasoning engine implementation for task prioritization

---

### 2. Scaffolds are blueprints, not an app (Gap L-02)

**The pain:** The frontend scaffold generated 26 components, 20 hooks, 25 types, and 4 Zustand stores — all bundled in single output files. The backend routes aren't connected to an app entry point. There's no `package.json` with scripts that actually work, no `tsconfig.json` with path aliases, no provider wiring. You can't `npm run dev` because there is no dev.

**What we already have (the inputs are all there):**
- Frontend scaffold with 26 components, 20 hooks, 25 types, 4 stores (scored 4.6/5)
- Backend scaffold with 21 route handlers, 7 Prisma models, middleware (scored 4.7/5)
- Frontend task breakdown with 68 tasks across 7 epics (scored 4.6/5)
- 3 HTML design previews (dashboard, task input, onboarding) (scored 4.5/5)
- Tech stack fully defined in `context/tech.md` (Next.js 14, Fastify, Prisma, etc.)

**What's missing:** A skill that takes standalone scaffold files and wires them into a real, runnable project directory structure. Something like `project-wire` or `scaffold-integrate` that creates individual component files, sets up app entry points, provider trees, import aliases, and working `package.json` scripts.

**Why it matters:** Every project that uses `backend-scaffold` or `frontend-scaffold` hits this same wall. The scaffolds are excellent reference architectures, but they don't produce something you can run. The gap between "scaffold generated" and "app boots" is enormous and entirely manual today. This affects every jaan-to user, not just Jaanify.

**Expected output:**
- Individual component files in proper directory tree (`src/components/`, `src/hooks/`, etc.)
- App entry points (`app.ts` for backend, `layout.tsx` / `page.tsx` for Next.js)
- Provider setup (Zustand stores, auth context, theme provider)
- Working `package.json` scripts (`dev`, `build`, `start`, `test`), `tsconfig.json`, path aliases

---

### 3. 74 test scenarios that are just documentation (Gap L-03)

**The pain:** We invested in writing 74 detailed BDD test scenarios covering all 7 user stories (scored 4.7/5). Both scaffold skills dutifully configure Vitest in `package.json`. But there are zero test files. Not one `*.test.ts`, not one `*.spec.ts`. Run `pnpm test` and it crashes immediately — no `vitest.config`, no test files, no mock setup. The irony is painful: we have better test *specifications* than most shipped products, but they're just documentation.

**What we already have (the inputs are all there):**
- 74 BDD test cases across 7 user stories with Given/When/Then format (scored 4.7/5)
- Backend scaffold with testable route handlers and Zod schemas
- Frontend scaffold with testable components and hooks
- API contract with request/response examples for every endpoint
- Vitest already declared as a dependency in scaffold `package.json`

**What's missing:** The scaffold skills should include test stub generation, or a dedicated `qa-test-generate` skill should exist that takes `qa-test-cases` output and produces runnable Vitest unit tests + Playwright E2E specs.

**Why it matters:** Zero test coverage means zero confidence. We can't launch a product that handles user data (tasks, priorities, AI reasoning) without tests. More practically, CI/CD (L-05) requires tests to gate deployments, and security hardening (L-04) needs tests to verify fixes. Tests are on the critical path, not a nice-to-have.

**Expected output:**
- `*.test.ts` files for services, hooks, and components
- `*.spec.ts` Playwright files for E2E user flows
- `vitest.config.ts` and `playwright.config.ts`
- Mock setup (MSW for API mocking, test utilities)
- A `pnpm test` command that actually runs and passes

---

## P1 — Security & Deployment (can't go public without these)

### 4. detect-dev finds vulnerabilities but nothing fixes them (Gap L-04)

**The pain:** The engineering audit (`detect-dev`, scored 4.5/5) found 11 findings including a **critical** vulnerability: the JWT `decodeJwt` function just base64-decodes the token without any cryptographic signature verification. Anyone can forge a valid-looking token. There's also no rate limiting on auth endpoints (brute force away), tokens stored in `localStorage` instead of httpOnly cookies (XSS = stolen sessions), and no CSRF protection on mutation endpoints. `detect-dev` is excellent at finding these problems. But there's no skill that fixes them.

**What we already have (the inputs are all there):**
- Engineering audit with 11 findings: 1 Critical, 2 High, 3 Medium, 3 Low, 2 Info (scored 4.5/5)
- SARIF-formatted findings with exact file locations and severity
- Backend scaffold with auth middleware already in place (just insecure)
- API contract specifying auth requirements per endpoint

**What's missing:** A remediation skill or a security-hardening mode for `backend-scaffold`. Something that reads `detect-dev` findings and generates fixes: proper JWT verification with `jose`, rate limiter middleware with `@fastify/rate-limit`, httpOnly cookie-based sessions, CSRF protection. Alternatively, `backend-scaffold` should generate secure auth patterns by default.

**Why it matters:** This is a legal and trust issue, not just a technical one. Jaanify handles user data, task content, and AI reasoning about personal priorities. Shipping with a forgeable auth token and XSS-vulnerable session storage isn't just risky — it's negligent. Every project that uses `backend-scaffold` ships with this same insecure JWT pattern, so fixing this helps the entire jaan-to ecosystem.

**Expected output:**
- Secure auth middleware with proper JWT verification (e.g., `jose` library)
- Rate limiter middleware (e.g., `@fastify/rate-limit`)
- httpOnly cookie-based session handling with CSRF protection
- Updated scaffold defaults that generate secure auth by default

---

### 5. You can't ship what you can't deploy (Gap L-05)

**The pain:** No GitHub Actions workflow. No Dockerfile. No docker-compose. No staging environment. No production environment. No database migration scripts in any pipeline. The tech stack is fully specified in `context/tech.md` (PostgreSQL, Redis, Typesense, the works), but there's zero infrastructure to actually run it anywhere.

**What we already have (the inputs are all there):**
- Tech stack fully defined in `context/tech.md` (Next.js 14, Fastify, PostgreSQL, Redis, Typesense, Prisma)
- Data model with migration playbook and DDL scripts
- Backend scaffold with defined entry points and middleware
- API contract with environment-specific base URLs

**What's missing:** An `infra-scaffold` or `cicd-scaffold` skill that generates GitHub Actions workflows, Dockerfile, docker-compose, and deployment configs from `context/tech.md`. Every scaffold skill generates application code, but none generate the infrastructure to run it.

**Why it matters:** You can't ship what you can't deploy. CI/CD is the gate between "code on main" and "product users can access." Without it, every merge is manual, every deployment is risky, and there's no automated quality gate. This blocks launch regardless of how good the application code is.

**Expected output:**
- `.github/workflows/ci.yml` (lint, test, build, deploy stages)
- `Dockerfile` + `docker-compose.yml` (PostgreSQL, Redis, Typesense, app)
- `.env.example` with all required environment variables
- Deployment config for target platform (Vercel/Railway/AWS)

---

## Summary

| Priority | Gap | Need | Type |
|----------|-----|------|------|
| **P0** | L-01 | Service Implementation Skill | New skill |
| **P0** | L-02 | Integration / Wiring Skill | New skill |
| **P0** | L-03 | Test Stub Generation | Scaffold improvement |
| **P1** | L-04 | Security Hardening | Scaffold improvement |
| **P1** | L-05 | CI/CD Scaffold Skill | New skill |

**3 new skills needed**, **2 existing skills need improvement**.

Critical path: L-01/L-02 (implementation + wiring, parallel) → L-04 (security) → L-05 (CI/CD) → Launch. L-03 (tests) runs parallel once scaffolds are wired.

---

**Project:** Jaanify — AI Task Manager with transparent reasoning ("show your work")
**Full analysis:** `gap-reports/03-cycle/03-launch-gaps.md`
**jaan-to version:** v4.5.0
