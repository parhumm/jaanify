---
title: "[Feature] Scaffold-to-production pipeline: implement, wire, test, secure, deploy"
type: "feature"
label: "enhancement"
repo: "parhumm/jaan-to"
issue_url: "https://github.com/parhumm/jaan-to/issues/65"
issue_number: 65
date: "2026-02-11"
jaan_to_version: "6.0.0"
os: "Darwin 25.1.0 arm64"
related_skill: "backend-scaffold, frontend-scaffold, qa-test-cases, detect-dev"
generated_by: "jaan-issue-report"
session_context: true
---

## Problem

[Jaanify](https://github.com/parhumm/jaanify) has invested 6 development cycles producing 27 deliverables — a PRD with 7 features, 7 user stories with Gherkin acceptance criteria, 21 OpenAPI endpoints, 74 BDD test scenarios, 7 Prisma data models, 26 React components, and 20 hooks. All specification and scaffold work is complete.

But none of it runs. Production code is at 0%. Tests are at 0%. Infrastructure is at 0%.

Every single route handler returns `// TODO: implement`. `pnpm test` crashes immediately because zero test files exist. The frontend scaffold has 26 components crammed into a single `.tsx` file. There is no `app.ts`, no server bootstrap, no individual component files. The scaffolds sit in `jaan-to/outputs/` — they are blueprints, not a runnable application.

5 gaps at P0+P1 priority block launch. They have been open for 2–6 consecutive cycles with zero resolution. Full gap report: `gap-reports/06-cycle/06-launch-gaps.md` (jaan-to v5.1.0).

## Proposed Solution

Five new skills (or skill improvements) to complete the scaffold-to-production pipeline:

### 1. Service Implementation Skill (L-01, P0 — open since Cycle 2)

A skill that takes scaffold stubs + task breakdown + API contract + data model and generates real business logic. [Jaanify](https://github.com/parhumm/jaanify)'s core value prop — AI-powered task prioritization — is literally an empty function. The backend scaffold has 21 route handlers and 10 service stubs all returning `// TODO: implement`.

All upstream inputs are ready: 28 backend tasks, 21 API endpoints (OpenAPI 3.1), 7 Prisma data models, and a vertical-slice implementation strategy.

**Expected outputs:** Filled service files with Prisma queries, validation, RFC 9457 error handling, auth service with proper JWT lifecycle (replacing broken `decodeJwt`), AI reasoning service integrating OpenAI SDK.

### 2. Integration / Wiring Skill (L-02, P0 — open since Cycle 1)

A skill that takes standalone scaffold files and wires them into a runnable project directory structure. The frontend scaffold has 26 components in a single `.tsx` file — production needs individual files. Backend routes are not connected to any app entry point.

**Expected outputs:** Individual component files, app entry points (`app.ts` for Fastify, `layout.tsx` for Next.js), working `package.json` with `dev`/`build`/`start` scripts, `tsconfig.json` with path aliases.

### 3. Test Stub Generation (L-03, P0 — open since Cycle 1)

Both `backend-scaffold` and `frontend-scaffold` configure Vitest in `package.json` but produce zero test files. 74 BDD test cases exist as specifications but are not runnable code.

**Expected outputs:** `*.test.ts` files for services/hooks/components, `*.spec.ts` Playwright files for 7 user stories, `vitest.config.ts`, `playwright.config.ts`, MSW for API mocking, test utilities and fixtures.

### 4. Security Hardening (L-04, P1 — open since Cycle 4)

The `detect-dev` audit found 1 Critical and 2 High vulnerabilities in the scaffold output:
- **E-DEV-001 (Critical):** `decodeJwt` base64-decodes JWT without signature verification — token forgery is trivial
- **E-DEV-002 (High):** No rate limiting on auth endpoints
- **E-DEV-003 (High):** Tokens in `localStorage` instead of httpOnly cookies

**Expected outputs:** Secure JWT verification via `jose`, rate limiter via `@fastify/rate-limit`, httpOnly cookie-based sessions with CSRF protection, security regression tests.

### 5. CI/CD Scaffold Skill (L-05, P1 — open since Cycle 1)

Zero `.github/workflows/` files, zero Dockerfile, zero `docker-compose.yml` for [Jaanify](https://github.com/parhumm/jaanify). The tech stack is fully specified in `context/tech.md`.

**Expected outputs:** `.github/workflows/ci.yml` (lint, type-check, test, build, deploy), multi-stage `Dockerfile` for Fastify, `docker-compose.yml` with PostgreSQL 16 + Redis 7 + Typesense, `.env.example`.

## Use Case

[Jaanify](https://github.com/parhumm/jaanify) is a real product being built exclusively using jaan-to skills. It has reached the scaffold stage through 6 cycles of specification and scaffold generation, but cannot progress further because jaan-to's skill catalog (v5.1.0, 33 skills) covers spec-to-scaffold but not scaffold-to-production.

The critical path is: L-01/L-02 (parallel) → L-04 → L-05 → Beta Launch.

Any project using jaan-to will hit this same wall: beautiful scaffolds that don't run.

## Alternatives Considered

- **Manual implementation without skills:** Possible since all spec inputs exist, but defeats the purpose of jaan-to as a spec-to-ship pipeline and doesn't help other jaan-to users.
- **Third-party code generation tools:** Doesn't integrate with jaan-to's context system, LEARN.md feedback loop, or scaffold output format.

## Related Skills/Features

- `backend-scaffold` — produces the stubs that L-01 would fill
- `frontend-scaffold` — produces the single-file output that L-02 would split
- `qa-test-cases` — produces the 74 BDD specs that L-03 would make runnable
- `detect-dev` — finds the vulnerabilities that L-04 would remediate
- `backend-task-breakdown` — produces the 28 tasks that guide L-01 implementation
- `backend-api-contract` — produces the OpenAPI spec that L-01 implements against

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.0.0 |
| OS | Darwin 25.1.0 arm64 |
| Related skills | backend-scaffold, frontend-scaffold, qa-test-cases, detect-dev |

---

**Reported via:** `jaan-issue-report` skill
**jaan-to version:** 6.0.0
**Session context used:** true
