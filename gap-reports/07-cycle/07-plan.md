---
title: "Cycle 7 Plan — Jaanify"
cycle: 7
date: 2026-02-11
jaan_to_version: "v6.0.0"
jaan_to_sha: "736820e08843fbeab07724594a8f1ff636143f51"
previous_version: "v5.1.0"
bottleneck: "scaffold-to-code"
skills_queued: 8
market_focus: "Production code generation — move from 0% to first runnable application"
---

# Cycle 7 Plan — Jaanify

> Date: 2026-02-11
> jaan-to: v5.1.0 → v6.0.0 (SHA: 736820e)
> Bottleneck: scaffold-to-code
> Co-Evolution Step: REVIEW & TEST → BUILD

---

## Context: Issue Comments

Cycle 7 is triggered by jaan-to v6.0.0 release, which addresses ALL 5 open P0/P1 gaps. Two issue comments confirm the mapping:

- **[Issue #53 comment](https://github.com/parhumm/jaan-to/issues/53#issuecomment-3882780165)**: Confirms L-01→L-05 skill mapping, provides recommended execution order
- **[Issue #58 comment](https://github.com/parhumm/jaan-to/issues/58#issuecomment-3882780292)**: Confirms all 5 gaps addressed, provides critical path and per-gap skill descriptions

Both comments recommend the same execution order:
1. `dev-project-assemble` → bootable project
2. `backend-service-implement` → fill TODO stubs
3. `sec-audit-remediate` → harden security
4. `qa-test-generate` → runnable tests
5. `devops-infra-scaffold` → CI/CD + Docker

---

## State Assessment

### Progress Matrix (Current)

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 80% | 0% | 0% |
| Frontend | 100% | 80% | 0% | 0% |
| Infrastructure | 0% | 0% | 0% | 0% |
| Marketing / GTM | 50% | 0% | 0% | N/A |
| **Overall** | **75%** | **40%** | **0%** | **0%** |

### Version Delta

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| jaan-to version | v5.1.0 | v6.0.0 | **+1 major** |
| Total skills | 33 | 38 | **+5** |
| Skills tested | 28 | 28 | 0 (new skills untested) |
| Skills untested | 5 | 10 | **+5** |

### v6.0.0 New Skills (All 5 Address Open Gaps)

| New Skill | Addresses | Gap Priority |
|-----------|-----------|-------------|
| `backend-service-implement` | L-01: Service Implementation | P0 |
| `dev-project-assemble` | L-02: Integration / Wiring | P0 |
| `qa-test-generate` | L-03: Test Stub Generation | P0 |
| `sec-audit-remediate` | L-04: Security Hardening | P1 |
| `devops-infra-scaffold` | L-05: CI/CD Scaffold | P1 |

### v6.0.0 Additional Changes

- 2 new roles: `sec` (Security), `devops` (DevOps/Infrastructure)
- 7 new research docs (#68-#74): full-cycle dev, scaffold assembly, service implementation, BDD test generation, scaffold hardening, SARIF remediation, CI/CD generation
- New plans: `dev-app-develop.md`, `spec-to-ship.md`
- New docs: `token-strategy.md`, `DEPENDENCIES.md`
- Plugin cache updated: marketplace.json + plugin.json bumped

### Open Gaps (from 06-launch-gaps.md)

| Priority | Gap ID | Gap | Skill Exists? (v6.0.0) |
|----------|--------|-----|------------------------|
| **P0** | L-01 | Service Implementation | **YES** → `backend-service-implement` |
| **P0** | L-02 | Integration / Wiring | **YES** → `dev-project-assemble` |
| **P0** | L-03 | Test Stub Generation | **YES** → `qa-test-generate` |
| **P1** | L-04 | Security Hardening | **YES** → `sec-audit-remediate` |
| **P1** | L-05 | CI/CD Scaffold | **YES** → `devops-infra-scaffold` |
| P2 | L-06 | Monetization Infrastructure | No |
| P2 | L-07 | i18n Infrastructure | Partial |

**For the first time in 6 cycles, ALL P0 and P1 gaps have corresponding jaan-to skills.**

---

## Bottleneck Analysis

**Classification:** scaffold-to-code

The state machine matches: `production == 0% AND scaffold > 0%`. Jaanify has:
- 100% specification for backend + frontend
- 80% scaffold (17 files, 182 KB of typed placeholder code)
- 0% production code (no `src/`, `app/`, `pages/`)
- 0% tests (74 BDD specs but zero test files)
- 0% infrastructure (zero Docker, CI/CD, env configs)

v6.0.0 delivers exactly the 5 skills needed to cross this gap. This is the breakthrough cycle.

**Focus skills for this bottleneck:**
- `dev-project-assemble` — wire scaffolds into runnable project structure
- `backend-service-implement` — fill 21 TODO stubs with business logic
- `qa-test-generate` — convert 74 BDD scenarios into runnable test files
- `sec-audit-remediate` — fix critical security findings
- `devops-infra-scaffold` — generate deployment pipeline

---

## Execution Queue

| # | Type | Exact jaan-to Skill | Addresses | Expected Output | Rationale |
|---|------|---------------------|-----------|-----------------|-----------|
| 1 | P0 | `/jaan-to:dev-project-assemble` | L-02 Wiring | Monorepo structure, config files, entry points, provider wiring, `package.json` scripts | Must have runnable project structure before filling services; auto-detects Turborepo from tech.md |
| 2 | P0 | `/jaan-to:backend-service-implement` | L-01 Services | Filled service files with Prisma queries, RFC 9457 errors, auth lifecycle, AI reasoning | All upstream inputs ready: 5.0/5 API contract, 4.9/5 data model, 4.6/5 task breakdown |
| 3 | P0 | `/jaan-to:qa-test-generate` | L-03 Tests | Vitest unit tests, Playwright E2E specs, MSW mocks, test factories | 74 BDD scenarios + scaffold code provide rich inputs for test generation |
| 4 | P1 | `/jaan-to:sec-audit-remediate` | L-04 Security | JWT `jose` verification, rate limiting, httpOnly cookies, CSRF, regression tests | Depends on L-01/L-02 producing real code; fixes 1 Critical + 2 High findings |
| 5 | P1 | `/jaan-to:devops-infra-scaffold` | L-05 CI/CD | GitHub Actions CI, Dockerfile, docker-compose (PG16+Redis7+Typesense), `.env.example` | Reads tech.md for full stack detection; completes deployment pipeline |
| 6 | Close | `/jaan-to:release-iterate-changelog` | Changelog | Updated CHANGELOG with Cycle 7 entries | Captures all deliverables from this cycle |
| 7 | Close | `/gaps-critical-doc` | Gap analysis | `07-launch-gaps.md` with updated progress matrix, gap status | Launch readiness assessment after implementation |
| 8 | Close | `/gaps-critical-issue` | Issue requests | GitHub issue requests for remaining gaps (L-06, L-07) | Feeds co-evolution loop for P2 gaps |

**Total:** 8 jaan-to skill invocations

**Queue rules applied:**
- Priority order: P0 → P1 → closing (no untested utility skills, no GTM, no re-tests)
- Dependency order: project-assemble (L-02) → service-implement (L-01) → sec-audit (L-04); all → changelog → gaps
- Token budget cap: 8 of 12 max — leaves headroom for child skill HARD STOPs
- Every item = exact jaan-to skill invocation (zero manual items)

---

## Market Impact

**This cycle advances:** Production code (0% → target 30-50%), tests (0% → target 20-30%), infrastructure (0% → target 50-70%)

**Revenue blocker addressed:** L-01 through L-05 form the complete critical path to beta launch. Resolving all 5 in one cycle collapses the 3-stage critical path into a single execution pass.

**What's needed for first paying user:**
- Production code that runs (L-01 + L-02 this cycle)
- Tests proving quality (L-03 this cycle)
- Secure auth system (L-04 this cycle)
- Deployment pipeline (L-05 this cycle)
- Monetization infrastructure (L-06 — deferred, post-beta)

**GTM status:**
- Market research completed (Cycle 1)
- GTM tracking specified (18 PostHog events)
- No landing page designed yet
- Monetization (L-06) and i18n (L-07) deferred to post-beta

---

## Deferred Items

Items that cannot be addressed this cycle (need new jaan-to skills or are post-beta):

| Gap | Description | Action |
|-----|-------------|--------|
| L-06 | Monetization Infrastructure (Stripe, entitlements) | Submit via `/gaps-critical-issue` — needs new skill |
| L-07 | i18n Infrastructure (next-intl wiring) | Submit via `/gaps-critical-issue` — needs wiring skill |
| Untested utility skills | jaan-init, jaan-issue-report, skill-create, skill-update, wp-pr-review | Defer to next cycle — not on critical path |

These will be submitted via `/gaps-critical-issue` at cycle close.

---

## Autonomous Decisions

| # | Decision | Rationale | Source |
|---|----------|-----------|--------|
| 1 | Skip detect skills re-run | All 5/5 domains already covered in C5-C6. detect-pack consolidated at 5.6/10. Re-running on scaffold before production code exists adds no value. Will re-run after production code exists. | LEARN.md: "Don't run detect-pack with < 3/5 domains" + all 5 already done |
| 2 | Follow issue comment execution order | Both #53 and #58 comments recommend: assemble → implement → secure → test → deploy. This matches critical path from 06-launch-gaps.md Section D. | Issue #53 comment, Issue #58 comment, 06-launch-gaps.md Section D |
| 3 | Skip untested utility skills | jaan-init (project setup already done), jaan-issue-report (not needed), skill-create/update (jaan-to internal), wp-pr-review (WordPress, N/A). None advance production code. | Skill descriptions vs Jaanify current state |
| 4 | Skip GTM/market skills | No frontend to attach GTM to yet. Landing page design premature before app works. GTM tracking specs already exist. | Progress matrix: 0% production, GTM specs at 50% |
| 5 | No learn-add pre-runs needed | v6.0.0 was built specifically for Jaanify's gaps (per issue comments). Skills should have correct behavior without pre-loading learn feedback. Will submit learn feedback after execution if improvements needed. | Issue #53: "Your specification investment... was building the exact input corpus these skills need" |
| 6 | sec-audit-remediate after service-implement | LEARN.md: "Don't harden TODO stubs." Security hardening on placeholder code is meaningless. Need real service implementations first. | LEARN.md Common Mistakes: "Don't Harden TODO Stubs" |

---

## Expected Outcomes

After this cycle completes:

### Target Progress Matrix

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 80% | 40% | 20% |
| Frontend | 100% | 80% | 30% | 15% |
| Infrastructure | 30% | 50% | 0% | 0% |
| **Overall** | **82%** | **52%** | **23%** | **12%** |

### Deliverables

- New deliverables: 5 (one per new skill)
- Scorecards written: 5 (one per new skill)
- Gaps resolved: 5 (L-01 through L-05)
- Learn feedback submitted: as needed post-execution
- Detect domains covered: 5/5 (unchanged — will re-run after production code exists)

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-11 |
| Output Path | gap-reports/07-cycle/07-plan.md |
| Skill | cycle-new |
| Status | Pending Approval |

---

> Generated by cycle-new | 2026-02-11 | Co-Evolution Cycle 7
