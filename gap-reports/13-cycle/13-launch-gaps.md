---
title: "Jaanify MVP — Cycle 13 Launch Readiness Gap Analysis"
cycle: 13
date: 2026-02-20
jaan_to_version: "v7.2.0"
previous_cycle: 12
gap_summary:
  total: 14
  p0: 0
  p1: 1
  p2: 2
  p3: 11
  new_skills_needed: 0
  skill_improvements_needed: 4
  existing_untested: 1
progress:
  specification: 100
  scaffold: 100
  production: 95
  tests: 70
---

# Jaanify MVP — Cycle 13 Launch Readiness Gap Analysis

> Date: 2026-02-20
> jaan-to Version: v7.2.0 (SHA: 3c10276)
> Cycle: 13
> Previous: [12-launch-gaps.md](../12-cycle/12-launch-gaps.md) (Cycle 12, 2026-02-16)

---

## Executive Summary

Cycle 13 was driven by a **user-reported P0 usability gap**: "I can't find login and use." Frontend investigation confirmed that no login page exists, Google OAuth is a TODO, and the dashboard is accessible without authentication. This cycle used the **new team-ship skill** (v7.1.0) to orchestrate a multi-role fix: PM (research + PRD + stories), Backend (task breakdown + scaffold), and Frontend (6-file scaffold).

The result: **complete login/auth scaffolds are ready** — login page, auth middleware, auth store, navbar auth component, landing page updates, and API client cookie migration. However, these scaffolds are NOT yet integrated into `apps/`. The production code % remains at 95% from C12, with the critical caveat that the existing auth flow is non-functional (discovered this cycle).

**team-ship scored 3.6/5** — its first-ever test. Key issues: permission delegation broken (PM got stuck on WebSearch), no brownfield mode, greenfield bias. 5 improvement gaps filed.

Gap count increased from 8 (C12) to 14 (C13): 4 login/auth gaps scaffolded but pending integration (L-26–L-29), 1 integration gap (L-30), 5 team-ship improvements (G-TS-01–G-TS-05), plus the 8 unchanged from C12.

---

## Section A — Current State

### Implementation Progress

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% (+cookie scaffold) | 95%* | 80% (15 test files, 77 passing) |
| Frontend | 100% (+PRD-02, US-08–12) | 100% (+6 login files) | 90%* | 60% (7 E2E specs) |
| Infrastructure | 100% | 100% | 100% | N/A |
| Marketing / GTM | 60% | 0% | 15% | N/A |
| **Overall** | **100%** | **100%** | **95%*** | **70%** |

*\*Production code unchanged from C12. Login/auth scaffolds produced but not yet integrated via dev-output-integrate. The auth flow remains non-functional until integration.*

### Existing Deliverables (75+)

| Deliverable | Cycle | Skill | Key Metric |
|-------------|-------|-------|------------|
| PRD (MVP) | C1 | pm-prd-write | 7 user stories, MVP scope |
| **PRD (Login/Auth)** | **C13** | **pm-prd-write (lead)** | **7 features (F-01–F-07)** |
| User Stories (7 MVP) | C1 | pm-story-write | 7 stories with Gherkin ACs |
| **User Stories (5 Auth)** | **C13** | **pm-story-write (lead)** | **US-08–US-12** |
| **Auth Research** | **C13** | **pm-research-about (lead)** | **WCAG 3.3.8, ADHD UX, Next.js auth** |
| Frontend Tasks | C1 | frontend-task-breakdown | Task inventory |
| Backend Tasks (MVP) | C1 | backend-task-breakdown | Vertical slices |
| **Backend Tasks (Auth)** | **C13** | **backend-task-breakdown (agent)** | **9 tasks, cookie helpers found** |
| API Contract | C2 | backend-api-contract | 21 endpoints, OpenAPI 3.1 |
| Data Model | C2+C12 | backend-data-model | 8 tables, DDL + ERD |
| Test Cases (BDD) | C2+C12 | qa-test-cases | 51 BDD scenarios |
| Frontend Design (4) | C1-C10 | frontend-design | Dashboard, task input, onboarding, landing |
| Microcopy (2 packs) | C1-C5 | ux-microcopy-write | 7 languages |
| UX Research | C1 | ux-research-synthesize | 5 themes |
| UX Flowcharts (3) | C4+C12 | ux-flowchart-generate | MVP user flows |
| GTM DataLayer | C2 | data-gtm-datalayer | Event taxonomy |
| Backend Scaffold (MVP) | C3 | backend-scaffold | Routes, services, models |
| **Backend Scaffold (Auth)** | **C13** | **backend-scaffold (agent)** | **Cookie wrappers, route mods** |
| Frontend Scaffold (MVP) | C3 | frontend-scaffold | Components, hooks |
| **Frontend Scaffold (Auth)** | **C13** | **frontend-scaffold (agent)** | **6 files: login, middleware, store, navbar, landing, API client** |
| Infra Scaffold (2) | C7+C11 | devops-infra-scaffold | CI/CD, Docker |
| Deploy Activation (3) | C8-C11 | devops-deploy-activate | Railway + Vercel |
| Security Remediation | C6 | sec-audit-remediate | Hardening guide |
| Project Assembly | C8 | dev-project-assemble | Monorepo structure |
| Output Integration (4) | C8-C11 | dev-output-integrate | Scaffold wiring |
| Build Verification (2) | C11 | dev-verify | Build fix, server check |
| Test Execution | C11 | qa-test-run | 52 failures fixed |
| Detect Suite (5/5) | C11-C12 | detect-* | All 5 domains |
| Knowledge Pack | C12 | detect-pack | Consolidated summary |
| Research (3+1) | C1-C13 | pm-research-about | Market, scaffold, PWA, auth UX |
| CHANGELOG | C5+ | release-iterate-changelog | v0.4.0 added |
| **Team Orchestration Log** | **C13** | **team-ship** | **4 teammates, 8 files, ~2200 lines** |

---

## Section B — Launch & GTM Gap Analysis

### P1 — Integration Required (1 gap)

#### Gap L-30: Scaffold Integration Pending

| Field | Detail |
|-------|--------|
| **What** | Login/auth scaffolds (8 files) produced by team-ship but NOT integrated into apps/. Users still cannot log in. |
| **Exists in jaan-to?** | Yes — `dev-output-integrate` (tested, scored 4.5/5) |
| **Related gap** | Resolves L-26, L-27, L-28, L-29 when complete |
| **Blocks** | Working login flow, user retention, revenue |

**Key points:**
- 6 frontend scaffolds need placement: login page → `app/login/page.tsx`, middleware → `middleware.ts`, auth store → `stores/auth-store.ts`, navbar → `components/navbar/NavbarAuth.tsx`, landing page update, API client update
- 2 backend changes needed: cookie wrappers in `lib/secure-cookies.ts`, auth route modifications
- Integration checklist documented in orchestration log

**Expected outputs:**
- Integrated login page at `/login`
- Working auth middleware protecting `/dashboard` and `/tasks/*`
- Updated navbar with session state
- Cookie-based token management

---

### P2 — GTM Essentials (2 gaps — unchanged from C12)

#### Gap L-06: Monetization — No Billing/Pricing Infrastructure

| Field | Detail |
|-------|--------|
| **What** | Zero billing, pricing, or tier enforcement. No Stripe. |
| **Exists in jaan-to?** | No dedicated monetization skill. |
| **Related gap** | Open since Cycle 5. **Deferred by user directive.** |
| **Blocks** | Revenue generation |

---

#### Gap L-07: i18n — Zero Locale Infrastructure

| Field | Detail |
|-------|--------|
| **What** | Zero internationalization infrastructure. |
| **Exists in jaan-to?** | `ux-microcopy-write` generates translations but no wiring skill. |
| **Related gap** | Open since Cycle 5. **Deferred by user directive.** |
| **Blocks** | Multi-language support |

---

### P3 — Quality of Life (11 gaps)

#### Gaps L-20, L-21, L-22: CI/CD Hardening (unchanged from C12)

| Field | Detail |
|-------|--------|
| **L-20** | `continue-on-error: true` on security scans |
| **L-21** | Unpinned `vercel@latest` |
| **L-22** | Missing top-level `permissions: {}` |
| **Exists in jaan-to?** | `devops-infra-scaffold` (improvement) |
| **Related gap** | [#114](https://github.com/parhumm/jaan-to/issues/114) |

---

#### Gap L-23: Dependency Version Mismatches (unchanged)

| Field | Detail |
|-------|--------|
| **What** | TypeScript ^5.6.0 (API) vs ^5.7.0 (Web) |
| **Exists in jaan-to?** | `dev-verify` (improvement) |

---

#### Gap L-24: Web Unit Tests Missing (unchanged)

| Field | Detail |
|-------|--------|
| **What** | Zero Vitest unit tests for frontend components |
| **Exists in jaan-to?** | `qa-test-generate` (re-run needed) |

---

#### Gap L-25: Turbo Remote Cache (unchanged)

| Field | Detail |
|-------|--------|
| **What** | No TURBO_TOKEN/TURBO_TEAM |
| **Exists in jaan-to?** | `devops-deploy-activate` (Step 9) |

---

#### Gap G-TS-01: team-ship Permission Delegation

| Field | Detail |
|-------|--------|
| **What** | Spawned agents can't use WebSearch without manual user approval |
| **Exists in jaan-to?** | `team-ship` (improvement needed) |
| **Blocks** | Autonomous team orchestration |

---

#### Gap G-TS-02: team-ship Brownfield Mode

| Field | Detail |
|-------|--------|
| **What** | No `--brownfield` flag for adding features to existing projects |
| **Exists in jaan-to?** | `team-ship` (improvement needed) |
| **Blocks** | Feature additions on existing codebases |

---

#### Gap G-TS-03: team-ship Stuck-Agent Recovery

| Field | Detail |
|-------|--------|
| **What** | No timeout/fallback when an agent gets stuck |
| **Exists in jaan-to?** | `team-ship` (improvement needed) |
| **Blocks** | Reliable autonomous orchestration |

---

#### Gap G-TS-04: team-ship Model Enforcement

| Field | Detail |
|-------|--------|
| **What** | Model spec in roles.md not enforced (all agents used opus) |
| **Exists in jaan-to?** | `team-ship` (improvement needed) |
| **Blocks** | Cost optimization |

---

#### Gap G-TS-05: team-ship QA Before Integration

| Field | Detail |
|-------|--------|
| **What** | QA role can't run until scaffolds are integrated |
| **Exists in jaan-to?** | `team-ship` (improvement needed) |
| **Blocks** | End-to-end team workflow |

---

## Section C — Summary Table

| Priority | Gap ID | Gap | Exists in jaan-to? | Blocks |
|----------|--------|-----|---------------------|--------|
| P1 | L-30 | Scaffold Integration Pending | `dev-output-integrate` (tested) | Working login, retention |
| P2 | L-06 | Monetization (Stripe) | No dedicated skill | Revenue |
| P2 | L-07 | i18n Infrastructure | Partial | Multi-language |
| P3 | L-20 | CI/CD Failure Masking | `devops-infra-scaffold` (impr.) | Security gates |
| P3 | L-21 | Unpinned vercel@latest | `devops-infra-scaffold` (impr.) | Supply chain |
| P3 | L-22 | Missing Permissions Block | `devops-infra-scaffold` (impr.) | Least privilege |
| P3 | L-23 | Dependency Mismatches | `dev-verify` (impr.) | Consistency |
| P3 | L-24 | Web Unit Tests Missing | `qa-test-generate` (re-run) | Component coverage |
| P3 | L-25 | Turbo Remote Cache | `devops-deploy-activate` | CI performance |
| P3 | G-TS-01 | team-ship permissions | `team-ship` (impr.) | Autonomous teams |
| P3 | G-TS-02 | team-ship brownfield | `team-ship` (impr.) | Feature additions |
| P3 | G-TS-03 | team-ship recovery | `team-ship` (impr.) | Reliability |
| P3 | G-TS-04 | team-ship model spec | `team-ship` (impr.) | Cost optimization |
| P3 | G-TS-05 | team-ship QA flow | `team-ship` (impr.) | End-to-end workflow |

**Skills that need to be created:** 0
**Skills that need improvement:** 4 (`devops-infra-scaffold`, `dev-verify`, `devops-deploy-activate`, `team-ship`)
**Skills that exist but are untested for this gap:** 1 (`backend-pr-review`)

---

## Section D — Critical Path

```
L-30 (Integrate scaffolds) ──→ Working Login ──→ User Retention
                                      │
                                      ↓
                              L-06 (Monetization) ──→ Revenue

L-20 ──→ L-21 ──→ L-22 ──→ Hardened CI/CD
L-24 ──────────────────────→ Test Coverage
G-TS-01 → G-TS-02 → G-TS-03 → Mature team-ship
```

**Critical path to working login**: L-30 only (1 step — dev-output-integrate).
**Critical path to revenue**: L-30 → L-06 (2 steps — integrate + monetize).
**Critical path to production hardening**: L-20 → L-21 → L-22 (3 steps — all infra-scaffold).

---

## Section E — Cycle-Over-Cycle Delta

| Metric | Cycle 12 | Cycle 13 | Delta |
|--------|----------|----------|-------|
| Total Gaps | 8 | 14 | **+6** |
| P0 Gaps | 0 | 0 | — |
| P1 Gaps | 0 | 1 | **+1** (L-30 integration) |
| P2 Gaps | 2 | 2 | — |
| P3 Gaps | 6 | 11 | **+5** (team-ship findings) |
| Specification | 100% | 100% | — (+PRD-02, +5 stories) |
| Scaffold | 100% | 100% | — (+8 auth files) |
| Production Code | 95% | 95% | — (integration pending) |
| Tests | 70% | 70% | — |
| Scorecards | 42 | 43 | **+1** (team-ship) |
| Average Score | 4.55 | 4.53 | -0.02 (team-ship 3.6 lowered avg) |
| jaan-to Version | v7.0.0 | v7.2.0 | **+2 releases** |
| New Skill | — | team-ship | +1 |

### What Changed

- **Scaffolded but not integrated**: Login page, auth middleware, auth store, navbar auth, landing page update, API client update, backend cookie helpers
- **User-reported gap discovered**: Auth/login UX non-functional (was not visible in C12's code-level analysis)
- **New skill tested**: team-ship first real-world test exposed 5 improvement areas
- **Resolution velocity**: 0 gaps fully resolved (scaffolds ready, integration pending)

---

## Section F — Recommendations for Cycle 14

### Immediate Actions

1. **Run `dev-output-integrate`** to copy login/auth scaffolds into `apps/` — this resolves L-30 and makes L-26–L-29 functional
2. **Run `dev-verify`** to confirm the build passes after integration
3. **Run `qa-test-generate`** to create tests for the new auth components (partially addresses L-24)
4. **Run `qa-test-run`** to validate auth flow end-to-end
5. **Submit `learn-add team-ship` feedback** for permission delegation, brownfield mode, stuck-agent recovery

### Priority Order

| Step | Action | Unblocks |
|------|--------|----------|
| 1 | `dev-output-integrate` (login/auth scaffolds) | Working login flow (L-30) |
| 2 | `dev-verify` (build after integration) | Deployment confidence |
| 3 | `qa-test-generate` (auth components) | Test coverage (L-24 partial) |
| 4 | `qa-test-run` (auth flow validation) | Quality confidence |
| 5 | `learn-add team-ship` (5 improvement areas) | Better team-ship in future |
| 6 | Deploy updated frontend + backend | Live login for users |
| 7 | Begin monetization (L-06) when ready | Revenue generation |

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Output Path | gap-reports/13-cycle/13-launch-gaps.md |
| Skill | gaps-critical-doc |
| Version | 3.0 |
| Status | Final |

---

## GitHub Issues

| Gap ID | Title | Issue |
|--------|-------|-------|
| L-06 | Monetization (Stripe) | [#79](https://github.com/parhumm/jaan-to/issues/79) (open, deferred) |
| L-07 | i18n Infrastructure | [#80](https://github.com/parhumm/jaan-to/issues/80) (open, deferred) |
| L-20/21/22 | CI/CD Hardening | [#114](https://github.com/parhumm/jaan-to/issues/114) (open) |
| L-23 | Dependency Mismatches | [#115](https://github.com/parhumm/jaan-to/issues/115) (open) |
| G-TS-01–05 | team-ship improvements | [#149](https://github.com/parhumm/jaan-to/issues/149) (**NEW — C13**) |
| L-30 | Scaffold Integration | Addressable with existing `dev-output-integrate` |
| L-24 | Web Unit Tests | Addressable with existing `qa-test-generate` |
| L-25 | Turbo Remote Cache | Addressable with existing `devops-deploy-activate` |

- **Created by:** `gaps-critical-issue` → `gh issue create`
- **Date:** 2026-02-20
- **Priorities checked:** P0, P1, P3 (team-ship findings)
- **Issues created:** 1 ([#149](https://github.com/parhumm/jaan-to/issues/149))

---

> **Bottom line:** Cycle 13 responded to a user-reported P0: "I can't find login and use." The team-ship skill orchestrated a multi-role team that produced 8 scaffold files (~2200 lines) covering login page, auth middleware, auth store, navbar session state, and cookie-based token management. These scaffolds are ready but NOT yet integrated — `dev-output-integrate` is the single step between the current state and a working login flow. team-ship scored 3.6/5 in its first test, revealing 5 improvement areas (permission delegation, brownfield mode, stuck-agent recovery, model enforcement, QA flow). The co-evolution loop continues: 13 cycles, 44 skills cataloged, 43 tested, average 4.53/5.
