# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-02-16

### Added

- Deploy API to Railway and Web to Vercel — first production deployment with live health checks (`/v1/health` returns 200, Vercel returns 200)
- Achieve first successful monorepo build — `pnpm build` compiles both `apps/api` and `apps/web` after resolving 31+ TypeScript errors
- Pass full test suite — 77 tests across unit and integration suites (52 failures fixed via mock corrections, import fixes, and type alignment)
- Upgrade jaan-to plugin from v6.1.1 to v6.3.0 — 2 new skills (`dev-verify`, `qa-test-run`), improvements to 4 existing skills, resolving GitHub issues #83, #84, #85, #78, #82, #81
- Integrate 15 infrastructure files from v6.3.0 infra-scaffold — updated CI/CD workflows, Dockerfiles, docker-compose, environment configs

### Changed

- Migrate Vercel deployment from Git integration to Vercel CLI with token authentication — resolves monorepo Root Directory detection issues
- Update CD workflow to use `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets for programmatic deployment

### Fixed

- Resolve 31+ TypeScript compilation errors: missing `jose` dependency, `authMiddleware`/`authPlugin` export mismatch, invalid `ProblemType` strings, duplicate `AuthTokens` type definitions, and Prisma schema drift
- Fix Docker runtime stage — preserve full pnpm workspace `node_modules/` structure to retain generated Prisma client (5 Dockerfile iterations)
- Fix Railway deployment — add `docker/Dockerfile.api` and `railway.toml` to `watchPatterns` for automatic rebuild triggers
- Fix Vercel deployment — correct Output Directory from `apps/web/.next` to `.next` (relative to Root Directory), move `vercel.json` to `apps/web/`
- Fix CD pipeline Vercel deployment — replace broken Git integration with Vercel CLI deploy using `--prod --yes` flag
- Fix CI lint failures — exclude `e2e/` directory and `next-env.d.ts` from ESLint and TypeScript compilation scopes
- Fix 52 test failures — correct MSW mock handlers, align Prisma mock returns with schema types, fix factory definitions, and update import paths
- Set Railway environment variables — `DATABASE_URL`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`, `CORS_ORIGIN`

### Security

- Post-launch engineering audit (detect-dev) scores 8.1/10 — 38/39 GitHub Actions SHA-pinned, Docker non-root users, Vercel security headers, Fastify security middleware stack verified
- Identify 6 CI/CD findings for remediation: `continue-on-error` masking security scan failures, unpinned `vercel@latest`, missing top-level workflow `permissions:` block

## [0.2.0] - 2026-02-13

### Added

- Assemble scaffold outputs into runnable Turborepo monorepo with `apps/api` (Fastify v5), `apps/web` (Next.js 15), shared Prisma schema, pnpm workspace, and 80+ source files wired with TypeScript path aliases and turbo.json pipeline
- Implement backend service logic for auth (Google OAuth2 + JWT with jose HS256 verification), tasks (CRUD with AI field parsing), daily plans (slot-based scheduling with AI reasoning), guest sessions, users, and feedback — replacing all TODO stubs with production code
- Generate comprehensive test suite from BDD scenarios: 37 files covering Vitest unit tests (services, hooks), integration tests (API routes with MSW), and Playwright E2E specs (onboarding, task creation, daily plan, accessibility) with Fishery factories and page objects
- Generate CI/CD infrastructure: GitHub Actions CI (lint, type-check, test with PostgreSQL/Redis service containers, build, Trivy security scan) and CD (Docker build + push to ghcr.io, Prisma migration, Railway backend deploy, Vercel frontend deploy, smoke tests)
- Generate multi-stage Dockerfiles for API (~150MB, Alpine + non-root user) and Web (~120MB, Next.js standalone), docker-compose with profiles (backend, frontend, full), and environment config hierarchy (.env.example, .env.test, .env.production.example)
- Generate security remediation fixes with regression tests: rate limiter (tiered: 5/min auth, 30/min write, 100/min global), CSRF double-submit cookie protection, secure httpOnly token storage replacing localStorage, security headers (CSP, HSTS, X-Frame-Options), and typed response formatters — 6 fix files, 4 test files, 27 test cases
- Complete 5-domain quality audit (design, writing, product, UX) with consolidated knowledge pack scoring 5.6/10 across 33 findings — 2 critical, 5 high, 10 medium, identifying 2 new launch gaps (monetization, i18n)
- Generate 4 Mermaid user flow diagrams from PRD covering onboarding, task creation (text+voice), daily plan with reasoning cards, and authentication — 38 nodes with evidence map tracing each to PRD source
- Research scaffold-to-production conversion strategy covering vertical slice architecture, testing pyramid (Vitest + Prisma mocks), CI/CD pipeline patterns for Fastify v5 + Next.js 15 + Prisma v6 monorepo (~45 sources)
- Detect design system: 37 tokens (oklch color space, 6 categories), 26 React 19 components across 5 atomic levels, full dark mode — score 6.5/10
- Detect writing system: ~55 strings with consistent friendly/encouraging tone, i18n maturity Level 0 (zero locale infrastructure despite 7-language microcopy specs) — score 5.0/10
- Detect product reality: 21 endpoints + 3 pages fully specified but zero production code, no monetization path, analytics specified but not implemented — score 4.5/10
- Detect UX: 4 routes, 4 user flows mapped, auth routing broken (TODO stub), missing /tasks/new page — score 6.0/10
- Add autonomous co-evolution cycle executor (`cycle-new` local skill) for scanning, testing, building, and gap-reporting across jaan-to versions
- Add launch readiness gap analysis skill (`gaps-critical-doc`) for prioritized skills inventory with cycle-over-cycle tracking
- Add GitHub issue generation skill (`gaps-critical-issue`) for converting gap analysis into PM-voiced issue requests
- Create Jaanify architecture concept document covering Transparent Copilot approach, 3-Tier Reasoning Cards, AI reasoning pipeline, and tech stack overview
- Test and score 5 additional skills in Cycle 6: docs-update (3.0/5), docs-create (4.3/5), roadmap-update (4.1/5), roadmap-add (3.0/5), learn-add (4.0/5) — expanding tested coverage to 32/33 skills
- Submit learning feedback for backend-scaffold identifying JWT security verification gap and missing test stub generation
- Create comprehensive project documentation: Jaanify Overview (product concept, target users, revenue model), Data Model (7-entity PostgreSQL schema with relationships and indexes), Getting Started (developer setup with Docker, Prisma, env vars), API Reference (21 REST endpoints with auth, pagination, errors), and Deployment Guide (Railway + Vercel with GitHub Actions CI/CD)
- Create documentation index (docs/README.md) with contents table and quick reference for all 6 project docs
- Re-test docs-create (4.5/5, up from 4.3/5) and docs-update (4.0/5, up from 3.0/5) with larger workloads validating template quality and full audit capability
- Integrate 58 generated artifacts into operational project locations: 23 QA test files, 10 security fixes, 12 DevOps configs, and 13 E2E specs — wiring entry points (security plugin registration in app.ts), installing 8 dependencies, resolving .gitignore conflicts (resolves L-08)
- Create marketing landing page with hero section, 4-feature grid, 3-step how-it-works, social proof, and beta CTA — using existing sage/cream/terracotta design system with scroll-triggered animations and WCAG AA accessibility (L-11)
- Generate deployment pipeline activation report with guided setup checklists for 5 GitHub secrets, Railway backend provisioning, Vercel frontend linking, and Turborepo remote cache (L-09)

### Changed

- Upgrade jaan-to plugin from v5.1.0 to v6.0.0 — 2 new skills (dev-project-assemble, backend-service-implement), reference doc extraction for reduced token usage, updated research docs
- Upgrade jaan-to plugin from v4.5.0 to v5.0.0 — token optimization extracting ~2,200 lines of boilerplate from 31 SKILL.md files with zero output quality degradation confirmed across 10 skills tested
- Upgrade jaan-to plugin from v5.0.0 to v5.1.0 — 2 new skills (jaan-init, jaan-issue-report), bootstrap now opt-in, 33 skill directories
- Simplify local skill invocations by delegating issue creation to jaan-issue-report
- Migrate all output paths to jaan-to v4.5.1 naming convention (subdomain/ID-slug structure)
- Consolidate detect-pack from 1/5 domains (6.1/10) to 5/5 domains (5.6/10) with cross-domain pattern recognition and gap mapping
- Update existing architecture documentation with cross-references to new project docs (overview, data model, API reference, getting started, deployment)
- Upgrade jaan-to plugin from v6.0.0 to v6.1.0 — 2 new skills (dev-output-integrate, devops-deploy-activate) addressing GitHub Issue #70, bringing total to 40 skill directories

### Fixed

- Strip YAML frontmatter from GitHub issue body to prevent rendering issues in issue creation
- Add auto-commit behavior to local skills for consistent git workflow
- Use jaan-issue-report --submit flag in gaps-critical-issue for correct GitHub issue creation
- Identify permission bug in roadmap-add skill — `allowed-tools` missing `Edit(jaan-to/roadmap.md)`, causing write phase to be blocked (regression from 3.6/5 to 3.0/5)

### Security

- Remediate 5 of 11 detect-dev findings: rate limiting (E-DEV-002), secure httpOnly token storage replacing localStorage (E-DEV-003), CSRF double-submit cookie protection (E-DEV-005), typed response formatters (E-DEV-004), and @fastify/cookie type augmentation (E-DEV-006)
- Resolve critical JWT decode vulnerability (E-DEV-001) — auth-tokens.ts now uses jose `jwtVerify` with HS256, issuer/audience validation, and clock tolerance
- Add security headers via @fastify/helmet: Content-Security-Policy, HSTS (1 year + preload), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin
- Harden GitHub Actions supply chain: pin all 11 actions across CI and CD workflows to immutable SHA digests, eliminating mutable tag references (v3, v4, v5) that are vulnerable to tag-hijacking attacks

## [0.1.0] - 2026-02-09

### Added

- Generate production-ready backend scaffold with Fastify v5, Prisma v6, Zod validation, JWT auth middleware, RFC 9457 error handling, and 21 route handlers covering all API endpoints
- Generate production-ready frontend scaffold with React 19, Next.js 15 (App Router), TailwindCSS v4 (CSS-first config), 26 components across atomic design levels, 20 TanStack Query v5 hooks, and 4 Zustand v5 stores
- Create 3 interactive design components — dashboard, task input, and onboarding screens — with responsive layouts, dark mode support, and WCAG AA accessibility patterns
- Define OpenAPI 3.1 API contract with 21 endpoints, request/response schemas, RFC 9457 error responses, and JWT + OAuth2 Google security schemes
- Define PostgreSQL data model with 7 tables (User, Task, DailyPlan, DailyPlanSlot, Feedback, GuestSession, RefreshToken), constraints, indexes, and retention policies
- Create Jaanify MVP Product Requirements Document with 7 user stories, acceptance criteria, success metrics, and phased release plan
- Break down backend into 28 development tasks with dependency graph, reliability patterns, and error taxonomy
- Break down frontend into 68 development tasks across 26 components with state matrices, accessibility requirements, and effort estimates
- Generate BDD/Gherkin test cases for 7 core user flows including task creation, AI parsing, daily plan generation, and onboarding
- Generate GTM dataLayer tracking specification with custom events for task lifecycle, AI interactions, and conversion funnel
- Generate multi-language microcopy pack for dashboard, task input, and onboarding screens with cultural adaptation
- Conduct predictive UX audit via heatmap analysis identifying attention patterns and interaction friction across core screens
- Synthesize market research into UX insights covering AI task management competitive landscape and user expectations
- Detect and document full tech stack (Node.js 22, Fastify v5, React 19, Next.js 15, PostgreSQL 16, TailwindCSS v4)

### Changed

- Run engineering audit (detect-dev light mode) on scaffold outputs identifying 11 findings: 1 critical (JWT signature bypass), 2 high (missing rate limiting, localStorage token storage), 3 medium, 3 low, 2 informational — score 6.1/10
- Consolidate detect outputs into knowledge pack (detect-pack light mode) with risk heatmap across 5 domains (1/5 analyzed)

---

## User Impact Notes

### High Impact

- **First production deployment**: Jaanify API live on Railway (`/v1/health` → 200 OK), Web live on Vercel (200 OK). Both services accessible at production URLs.
- **First working build**: `pnpm build` succeeds for both `apps/api` and `apps/web` after resolving 31+ TypeScript errors from integration seams.
- **Test suite green**: 77 tests passing across all suites — 52 failures diagnosed and fixed.
- **Google OAuth configured**: Real `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` set on Railway with correct redirect URIs.

### Medium Impact

- **Docker runtime fixed**: Prisma client now correctly available in production container after 5 Dockerfile iterations.
- **CD pipeline operational**: Both Railway and Vercel deployments automated via GitHub Actions on push to `main`.
- **jaan-to v6.3.0**: 2 new skills (`dev-verify` with build fix automation, `qa-test-run` with failure diagnosis) proven in production use.

### Low Impact

- Railway `watchPatterns` now includes Dockerfile for automatic rebuilds.
- CI excludes e2e/ and generated files from lint/typecheck scopes.

---

## Support Guidance

### Known Issues

- No monetization path exists — zero billing, pricing, or tier enforcement code (L-06)
- Zero i18n infrastructure despite 7-language microcopy specs (L-07)
- `continue-on-error: true` on CI security scans and CD smoke tests masks failures (F-DEV-001)
- Unpinned `vercel@latest` in CD workflow (F-DEV-003)
- No top-level `permissions:` block in CI/CD workflows (F-DEV-005)
- `@vitest/coverage-v8` major version mismatch with `vitest` (F-DEV-007)

### Resolved Since 0.2.0

- ~~31+ TypeScript compilation errors~~ — All resolved in Cycle 11 dev-verify
- ~~52 test failures~~ — All fixed in Cycle 11 qa-test-run
- ~~API not deployed (Railway returning 404)~~ — Live with all env vars configured
- ~~Web not deployed (Vercel DEPLOYMENT_NOT_FOUND)~~ — Live via CLI deployment
- ~~Docker runtime missing Prisma client~~ — Fixed by preserving pnpm workspace structure
- ~~Railway not rebuilding on Dockerfile changes~~ — watchPatterns updated

### Launch Gap Summary (Updated Cycle 11)

| Gap | Priority | Status | Description |
|-----|----------|--------|-------------|
| L-01 | P0 | **Resolved** | Service Implementation — production code replaces TODO stubs |
| L-02 | P0 | **Resolved** | Integration/Wiring — monorepo assembled and runnable |
| L-03 | P1 | **Resolved** | Test Generation — 77 tests passing |
| L-04 | P0 | **Resolved** | Security Hardening — JWT fixed, rate limit, CSRF, headers |
| L-05 | P1 | **Resolved** | CI/CD Scaffold — GitHub Actions CI + CD pipelines |
| L-06 | P1 | Open | Monetization — no billing/pricing |
| L-07 | P2 | Open | i18n Infrastructure — zero locale support |
| L-08 | P1 | **Resolved** | Output Integration — artifacts installed into project |
| L-09 | P1 | **Resolved** | Deploy Pipeline — Railway + Vercel live |
| L-10 | P2 | **Resolved** | Security Re-audit — 8.1/10 post-launch score |
| L-11 | P3 | **Resolved** | Landing Page — integrated into root route |
| L-13 | P1 | **Resolved** | Health Monitoring — 15-min cron with incident management |
| L-14 | P1 | **Resolved** | Secret Rotation — quarterly reminders |
| L-15 | P1 | **Resolved** | Page Wiring — frontend routes connected |
| L-16 | P2 | **Resolved** | pnpm CI Fix — packageManager field respected |
| L-17 | P2 | **Resolved** | Next.js Standalone — Docker build consistent |
| L-18 | P1 | **Resolved** | Compiler Plugin — React Compiler dependency added |
| L-19 | P1 | **Resolved** | Repo Variables — health check URLs configured |

### Suggested Next Steps

1. Remove `continue-on-error: true` from CI security scans (F-DEV-001)
2. Pin `vercel` CLI version in CD workflow (F-DEV-003)
3. Add top-level `permissions: {}` to CI/CD workflows (F-DEV-005)
4. Define pricing model and scaffold Stripe integration (L-06)
5. Set up Next.js i18n with next-intl (L-07)
6. Fix `@vitest/coverage-v8` version mismatch (F-DEV-007)

---

[unreleased]: https://github.com/parhumm/jaanify/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/parhumm/jaanify/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/parhumm/jaanify/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/parhumm/jaanify/releases/tag/v0.1.0

---

> Generated by jaan.to | 2026-02-16 | Skill: release-iterate-changelog | Mode: release v0.3.0 | Cycle: 11 | Status: Updated
