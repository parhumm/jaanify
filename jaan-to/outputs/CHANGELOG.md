# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Activate full deployment pipeline — 5 GitHub secrets configured (DATABASE_URL, RAILWAY_TOKEN, VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID), Railway backend project provisioned with `api` service, Vercel frontend project created and linked to GitHub repo with preview deployments (resolves L-09)
- Integrate marketing landing page into app root route — hero, features, how-it-works, social proof, and beta CTA now live at `/` (resolves L-11)
- Set up branch protection on `main` with required CI status checks (detect-changes, lint, build, security), linear history enforcement, and force-push blocking

### Fixed

- Fix CI pipeline failure caused by pnpm version conflict — remove explicit `version` parameter from `pnpm/action-setup@v4` to let `package.json` `packageManager` field drive version selection
- Add missing `babel-plugin-react-compiler` dependency to `apps/web` resolving Next.js production build failure in CI
- Add `output: "standalone"` to `apps/web/next.config.ts` enabling minimal standalone server for Docker container builds

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

- **Deployment pipeline fully activated**: 5 GitHub secrets configured, Railway backend provisioned, Vercel frontend linked. CI pipeline verified working (lint, test, security all pass). Resolves L-09.
- **All generated artifacts operational**: 58 files moved from `jaan-to/outputs/` into project locations — tests run, security plugins load, CI/CD workflows execute.
- **Runnable monorepo assembled**: Scaffold outputs wired into working Turborepo project with `apps/api` and `apps/web`, shared Prisma schema, and TypeScript path aliases.
- **Backend services implemented**: All 21 TODO stubs replaced with production logic — Google OAuth2 flow, JWT token management, task CRUD with AI parsing, daily plan generation.
- **Critical JWT vulnerability resolved**: E-DEV-001 fixed — auth now uses jose `jwtVerify` with HS256, issuer/audience validation.
- **GitHub Actions hardened**: All 11 actions across 2 workflows pinned to SHA digests. Supply chain attack surface eliminated.

### Medium Impact

- **Landing page live at root route**: Marketing page with hero, features, and CTA now renders at `/` (L-11 fully resolved).
- **Branch protection active**: `main` branch now requires passing CI checks before merge.
- **CI build fixes applied**: pnpm version conflict resolved, babel-plugin-react-compiler installed, Next.js standalone output configured.
- **Test suite generated**: 37 test files with Vitest unit/integration tests and Playwright E2E specs.
- **Security hardening**: 6 fix files with 27 regression tests covering OWASP Top 10 categories.

### Low Impact

- Docker build now works with Next.js standalone output configuration.
- Infra-scaffold output files synced with pnpm version fix.

---

## Support Guidance

### Known Issues

- No monetization path exists — zero billing, pricing, or tier enforcement code (E-PRD-001 — Critical)
- Zero i18n infrastructure despite 7-language microcopy specs (E-WRT-001 — High)
- Auth routing hardcoded to /onboarding for all visitors (E-UX-001 — High)
- No Turbo remote cache configured in CI — missing TURBO_TOKEN/TURBO_TEAM for cross-PR caching
- Pre-existing TypeScript error in web app (React Query generic type mismatch)
- **Rotate Supabase database password** — credentials were shared in plain text during pipeline activation setup

### Resolved Since 0.1.0

- ~~JWT auth middleware decodes tokens without cryptographic verification (E-DEV-001 — Critical)~~ — Fixed in Cycle 7
- ~~No rate limiting on any endpoint (E-DEV-002 — High)~~ — Rate limiter fix integrated in Cycle 9
- ~~Access tokens stored in localStorage, vulnerable to XSS (E-DEV-003 — High)~~ — Secure httpOnly cookie fix integrated in Cycle 9
- ~~All 21 backend service handlers are TODO stubs (E-PRD-002 — High)~~ — All services implemented
- ~~No CI/CD pipeline (L-05 — P1)~~ — GitHub Actions CI/CD generated and integrated
- ~~No test files (L-03 — P1)~~ — 37 test files generated and integrated
- ~~Generated artifacts stuck in outputs/ (L-08 — P1)~~ — 58 files integrated into project in Cycle 9
- ~~GitHub Actions not pinned by SHA (supply chain risk)~~ — All 11 actions SHA-pinned in Cycle 9
- ~~GitHub secrets not configured (0/5 required)~~ — All 5 secrets configured in Cycle 10
- ~~Railway and Vercel CLIs not installed~~ — Both installed and authenticated in Cycle 10
- ~~Next.js standalone output not configured~~ — Added to next.config.ts in Cycle 10
- ~~CI build broken (pnpm version conflict)~~ — Fixed in Cycle 10

### Launch Gap Summary (Updated Cycle 10)

| Gap | Priority | Status | Description |
|-----|----------|--------|-------------|
| L-01 | P0 | **Resolved** | Service Implementation — production code replaces TODO stubs |
| L-02 | P0 | **Resolved** | Integration/Wiring — monorepo assembled and runnable |
| L-03 | P1 | **Resolved** | Test Generation — 37 test files with unit, integration, E2E |
| L-04 | P0 | **Resolved** | Security Hardening — JWT fixed, rate limit, CSRF, headers |
| L-05 | P1 | **Resolved** | CI/CD Scaffold — GitHub Actions CI + CD pipelines |
| L-06 | P1 | Open | Monetization — no billing/pricing |
| L-07 | P2 | Open | i18n Infrastructure — zero locale support |
| L-08 | P1 | **Resolved** | Output Integration — 58 artifacts installed into project |
| L-09 | P1 | **Resolved** | Deploy Pipeline — secrets configured, Railway + Vercel provisioned |
| L-11 | P3 | **Resolved** | Landing Page — integrated into root route |

### Suggested Next Steps

1. Rotate Supabase database password and update DATABASE_URL GitHub secret
2. Trigger a full CD pipeline run after committing pending changes
3. Define pricing model and scaffold Stripe integration (resolves L-06)
4. Set up next.js i18n with next-intl or similar (resolves L-07)
5. Fix React Query TypeScript error in web app
6. Configure Turbo remote cache (TURBO_TOKEN/TURBO_TEAM)

---

[unreleased]: https://github.com/parhumm/jaanify/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/parhumm/jaanify/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/parhumm/jaanify/releases/tag/v0.1.0

---

> Generated by jaan.to | 2026-02-13 | Skill: release-iterate-changelog | Mode: release 0.2.0 | Cycle: 10 | Status: Released
