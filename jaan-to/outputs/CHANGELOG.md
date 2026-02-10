# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Changed

- Upgrade jaan-to plugin from v4.5.0 to v5.0.0 — token optimization extracting ~2,200 lines of boilerplate from 31 SKILL.md files with zero output quality degradation confirmed across 10 skills tested
- Upgrade jaan-to plugin from v5.0.0 to v5.1.0 — 2 new skills (jaan-init, jaan-issue-report), bootstrap now opt-in, 33 skill directories
- Migrate all output paths to jaan-to v4.5.1 naming convention (subdomain/ID-slug structure)
- Consolidate detect-pack from 1/5 domains (6.1/10) to 5/5 domains (5.6/10) with cross-domain pattern recognition and gap mapping

### Fixed

- Strip YAML frontmatter from GitHub issue body to prevent rendering issues in issue creation
- Add auto-commit behavior to local skills for consistent git workflow
- Identify permission bug in roadmap-add skill — `allowed-tools` missing `Edit(jaan-to/roadmap.md)`, causing write phase to be blocked (regression from 3.6/5 to 3.0/5)

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

- **5-domain quality audit complete**: Full knowledge pack with 33 findings across dev, design, writing, product, and UX domains. Two new critical launch gaps identified: no monetization path (L-06) and zero i18n infrastructure (L-07).
- **jaan-to v5.0.0 validated**: Token optimization regression-tested across 10 skills with zero quality degradation — confirms the plugin's structural changes are safe.
- **jaan-to v5.1.0 adopted**: 2 new skills available (jaan-init, jaan-issue-report), plugin skill coverage now at 32/33 tested.
- Critical security finding (E-DEV-001): JWT decode without signature verification remains unresolved and must be remediated before any deployment.

### Medium Impact

- Scaffold-to-production research provides actionable conversion strategy with vertical slice approach, testing pyramid, and stub priority ordering.
- 4 Mermaid user flow diagrams enable visual communication of Jaanify's core experiences (onboarding, task creation, daily planning, auth).
- 3 new local skills (cycle-new, gaps-critical-doc, gaps-critical-issue) automate the co-evolution loop workflow.
- Jaanify architecture concept document provides foundational reference for development decisions.
- Backend-scaffold learning feedback addresses 2 critical quality gaps (JWT verification, test stubs) for future scaffold runs.

### Low Impact

- Output path migration to v4.5.1 convention — no functional change, improves file organization.
- YAML frontmatter stripping fix prevents rendering issues in GitHub issues.
- Permission bug identified in roadmap-add skill — reported for jaan-to plugin fix.

---

## Support Guidance

### Known Issues

- JWT auth middleware decodes tokens without cryptographic verification (E-DEV-001 — Critical)
- No monetization path exists — zero billing, pricing, or tier enforcement code (E-PRD-001 — Critical)
- No rate limiting on any endpoint (E-DEV-002 — High)
- Access tokens stored in localStorage, vulnerable to XSS (E-DEV-003 — High)
- Zero i18n infrastructure despite 7-language microcopy specs (E-WRT-001 — High)
- All 21 backend service handlers are TODO stubs (E-PRD-002 — High)
- Auth routing hardcoded to /onboarding for all visitors (E-UX-001 — High)

### Launch Gap Summary (7 gaps)

| Gap | Priority | Description |
|-----|----------|-------------|
| L-01 | P0 | Service Implementation — TODO stubs → production code |
| L-02 | P0 | Integration/Wiring — scaffold → runnable project |
| L-03 | P1 | Test Stub Generation — zero test files |
| L-04 | P0 | Security Hardening — JWT, rate limit, CSRF |
| L-05 | P1 | CI/CD Scaffold — no pipeline |
| L-06 | P1 | Monetization — no billing/pricing (NEW in Cycle 5) |
| L-07 | P2 | i18n Infrastructure — zero locale support (NEW in Cycle 5) |

### Suggested Next Steps

1. Implement auth service with `@fastify/jwt` or `jose` (resolves E-DEV-001 + E-UX-001)
2. Define pricing model in PRD and scaffold Stripe integration (resolves E-PRD-001)
3. Begin production implementation using vertical slice approach from scaffold-to-production research
4. Run `cycle-new` to continue co-evolution loop — only jaan-init remains untested

---

[unreleased]: https://github.com/parhumm/jaanify/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/parhumm/jaanify/releases/tag/v0.1.0

---

> Generated by jaan.to | 2026-02-10 | Skill: release-iterate-changelog | Mode: auto-generate | Cycle: 6 | Status: Draft
