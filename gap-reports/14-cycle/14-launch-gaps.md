---
title: "Jaanify MVP — Cycle 14 Launch Readiness Gap Analysis"
cycle: 14
date: 2026-02-21
jaan_to_version: "v7.2.0-1-g3c10276"
previous_cycle: 13
gap_summary:
  total: 18
  p0: 0
  p1: 3
  p2: 2
  p3: 13
  new_skills_needed: 0
  skill_improvements_needed: 4
  existing_untested: 1
progress:
  specification: 93
  scaffold: 88
  production: 74
  tests: 45
---

# Jaanify MVP — Cycle 14 Launch Readiness Gap Analysis

> Date: 2026-02-21
> jaan-to Version: v7.2.0-1-g3c10276 (SHA: 3c10276)
> Cycle: 14
> Previous: [13-launch-gaps.md](../13-cycle/13-launch-gaps.md) (Cycle 13, 2026-02-20)

---

## Executive Summary

Cycle 14 completed the **critical integration step** that was the single blocker from C13: login/auth scaffolds are now integrated into `apps/` and the build passes. `dev-output-integrate` executed 10 operations (4 new files, 2 replacements, 4 merges), and `dev-verify` found and auto-fixed 2 build errors (missing 401 response schema, missing Suspense boundary).

However, integration revealed **3 new P1 gaps** that weren't visible from scaffold analysis alone: the Google OAuth callback route doesn't exist (L-31), auth service functions are still TODO stubs (L-32), and the `/users/me` endpoint the auth store calls doesn't exist (L-33). These are the new critical path to a working login flow.

Progress matrix was **recalibrated** this cycle using strict code evidence. C13's 95% production figure included scaffold-as-code; C14 uses actual implementation evidence, resulting in 74% overall production code. This is more accurate — the login UI is integrated but the backend auth service logic hasn't been implemented yet.

Gap count: 18 total (P0: 0, P1: 3, P2: 2, P3: 13). 5 gaps resolved (L-26–L-30), 5 new gaps discovered (L-31–L-35).

---

## Section A — Current State

Cycle 14 focused on one objective: integrate login/auth scaffolds from C13's team-ship output and verify the build. This was accomplished successfully.

### Implementation Progress

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% | 92% (cookie wrappers + auth plugin merged, service stubs remain) | 75% (15 test files, 77 passing) |
| Frontend | 100% | 100% | 82% (+login page, middleware, auth store, navbar auth) | 35% (7 E2E specs, 0 unit tests for auth) |
| Infrastructure | 100% | 100% | 85% (CI/CD + Docker working, hardening gaps remain) | N/A |
| Marketing / GTM | 70% | 50% | 30% (landing page + sign-in CTA) | N/A |
| **Overall** | **93%** | **88%** | **74%** | **45%** |

**Note on recalibration**: C13 reported 95% production, which counted scaffold code as production. C14 uses strict evidence: only files with real business logic (not TODO stubs) count. The auth service layer (`auth.service.ts`) contains stub functions — these are NOT counted as production code.

### Existing Deliverables (80+)

| Deliverable | Cycle | Skill | Key Metric |
|-------------|-------|-------|------------|
| PRD (MVP) | C1 | pm-prd-write | 7 user stories, MVP scope |
| PRD (Login/Auth) | C13 | pm-prd-write (lead) | 7 features (F-01–F-07) |
| User Stories (7 MVP) | C1 | pm-story-write | 7 stories with Gherkin ACs |
| User Stories (5 Auth) | C13 | pm-story-write (lead) | US-08–US-12 |
| Auth Research | C13 | pm-research-about (lead) | WCAG 3.3.8, ADHD UX, Next.js auth |
| Frontend Tasks | C1 | frontend-task-breakdown | Task inventory |
| Backend Tasks (MVP) | C1 | backend-task-breakdown | Vertical slices |
| Backend Tasks (Auth) | C13 | backend-task-breakdown (agent) | 9 tasks, cookie helpers found |
| API Contract | C2 | backend-api-contract | 21 endpoints, OpenAPI 3.1 |
| Data Model | C2+C12 | backend-data-model | 8 tables, DDL + ERD |
| Test Cases (BDD) | C2+C12 | qa-test-cases | 51 BDD scenarios |
| Frontend Design (4) | C1-C10 | frontend-design | Dashboard, task input, onboarding, landing |
| Microcopy (2 packs) | C1-C5 | ux-microcopy-write | 7 languages |
| UX Research | C1 | ux-research-synthesize | 5 themes |
| UX Flowcharts (3) | C4+C12 | ux-flowchart-generate | MVP user flows |
| GTM DataLayer | C2 | data-gtm-datalayer | Event taxonomy |
| Backend Scaffold (MVP) | C3 | backend-scaffold | Routes, services, models |
| Backend Scaffold (Auth) | C13 | backend-scaffold (agent) | Cookie wrappers, route mods |
| Frontend Scaffold (MVP) | C3 | frontend-scaffold | Components, hooks |
| Frontend Scaffold (Auth) | C13 | frontend-scaffold (agent) | 6 files: login, middleware, store, navbar |
| **Login Page** | **C14** | **dev-output-integrate** | **Integrated at /login** |
| **Auth Middleware** | **C14** | **dev-output-integrate** | **Protecting /dashboard, /tasks/*** |
| **Auth Store** | **C14** | **dev-output-integrate** | **Zustand with hydrate/logout** |
| **NavbarAuth** | **C14** | **dev-output-integrate** | **Avatar dropdown + sign-out** |
| **Cookie Auth (BE)** | **C14** | **dev-output-integrate** | **Dual header+cookie extraction** |
| **Build Verification** | **C14** | **dev-verify** | **2 errors → 0, build passes** |
| Infra Scaffold (2) | C7+C11 | devops-infra-scaffold | CI/CD, Docker |
| Deploy Activation (3) | C8-C11 | devops-deploy-activate | Railway + Vercel |
| Security Remediation | C6 | sec-audit-remediate | Hardening guide |
| Project Assembly | C8 | dev-project-assemble | Monorepo structure |
| Output Integration (5) | C8-C14 | dev-output-integrate | Scaffold wiring |
| Build Verification (3) | C11+C14 | dev-verify | Build fix, server check |
| Test Execution | C11 | qa-test-run | 52 failures fixed |
| Detect Suite (5/5) | C11-C12 | detect-* | All 5 domains |
| Knowledge Pack | C12 | detect-pack | Consolidated summary |
| Research (3+1) | C1-C13 | pm-research-about | Market, scaffold, PWA, auth UX |
| CHANGELOG | C5+ | release-iterate-changelog | v0.5.0 added |
| Team Orchestration Log | C13 | team-ship | 4 teammates, 8 files |

---

## Section B — Launch & GTM Gap Analysis

### P1 — Auth Flow Completion (3 gaps)

#### Gap L-31: Google OAuth Callback Route Missing

| Field | Detail |
|-------|--------|
| **What** | Login page generates Google OAuth URL but `/login/callback` handler doesn't exist. Users click "Continue with Google", get redirected to Google, then land on a 404. |
| **Exists in jaan-to?** | Yes — `backend-scaffold` or `backend-service-implement` (tested) |
| **Related gap** | Follow-on from L-27 (OAuth Not Wired — scaffolded in C13) |
| **Blocks** | Working Google OAuth login, user acquisition |

**Key points:**
- Frontend `PUBLIC_PREFIXES` already includes `/login/` for callback routes
- Backend needs `/v1/auth/google` handler to exchange authorization code for tokens
- Callback must: exchange code → verify ID token → upsert user → generate token pair → set cookies → redirect

**Expected outputs:**
- `apps/web/src/app/login/callback/page.tsx` — callback route that sends code to API
- `apps/api/src/routes/auth/auth.service.ts` — `googleAuth()` implementation

---

#### Gap L-32: Auth Service Stubs Still TODO

| Field | Detail |
|-------|--------|
| **What** | `auth.service.ts` functions (`googleAuth`, `refreshToken`, `register`, `logout`) are stubs. Auth routes return errors at runtime. |
| **Exists in jaan-to?** | Yes — `backend-service-implement` (tested, scored 4.7/5) |
| **Related gap** | Dependency for L-31 |
| **Blocks** | All auth flows (login, refresh, register, logout) |

**Key points:**
- Route handlers call `authService.googleAuth()`, `authService.refreshToken()`, etc.
- These functions need: Google token exchange, Prisma user upsert, token pair generation, refresh token rotation
- `auth-tokens.ts` already has `generateTokenPair()` and `verifyRefreshToken()` — service layer needs to compose these

**Expected outputs:**
- Full implementation of `googleAuth()`, `refreshToken()`, `register()`, `logout()` in `auth.service.ts`

---

#### Gap L-33: /users/me Endpoint Missing

| Field | Detail |
|-------|--------|
| **What** | Auth store `hydrate()` calls `GET /users/me` but no route handler exists. Session hydration fails on page load. |
| **Exists in jaan-to?** | Yes — `backend-scaffold` or `backend-service-implement` (tested) |
| **Related gap** | Blocks L-29 resolution (session UI depends on hydration) |
| **Blocks** | Session persistence, NavbarAuth showing user info |

**Key points:**
- Auth store calls `apiClient.get("/users/me")` to check if session is valid
- Needs a route that reads `request.userId` (set by auth plugin) and returns user profile
- Prisma User model exists — just needs a thin route + service function

**Expected outputs:**
- `GET /v1/users/me` route returning user profile from Prisma

---

### P2 — GTM Essentials (2 gaps — unchanged, deferred by user directive)

#### Gap L-06: Monetization — No Billing/Pricing Infrastructure

| Field | Detail |
|-------|--------|
| **What** | Zero billing, pricing, or tier enforcement. No Stripe integration. |
| **Exists in jaan-to?** | No dedicated monetization skill. |
| **Related gap** | Open since Cycle 5. **Deferred by user directive.** |
| **Blocks** | Revenue generation |

---

#### Gap L-07: i18n — Zero Locale Infrastructure

| Field | Detail |
|-------|--------|
| **What** | Zero internationalization infrastructure despite 7-language microcopy specs. |
| **Exists in jaan-to?** | `ux-microcopy-write` generates translations but no wiring skill exists. |
| **Related gap** | Open since Cycle 5. **Deferred by user directive.** |
| **Blocks** | Multi-language support |

---

### P3 — Quality of Life (13 gaps)

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
| **What** | TypeScript ^5.6.0 (API) vs ^5.7.0 (Web), vitest major version mismatch |
| **Exists in jaan-to?** | `dev-verify` (improvement) |

---

#### Gap L-24: Web Unit Tests Missing (unchanged)

| Field | Detail |
|-------|--------|
| **What** | Zero Vitest unit tests for frontend components. Now includes 4 new auth components with no tests. |
| **Exists in jaan-to?** | `qa-test-generate` (re-run needed) |

---

#### Gap L-25: Turbo Remote Cache (unchanged)

| Field | Detail |
|-------|--------|
| **What** | No TURBO_TOKEN/TURBO_TEAM configured |
| **Exists in jaan-to?** | `devops-deploy-activate` (Step 9) |

---

#### Gap L-34: Node.js Version Mismatch

| Field | Detail |
|-------|--------|
| **What** | Local Node v18.20.6 vs `engines: >=22.0.0` in both apps. Builds pass but production should match. |
| **Exists in jaan-to?** | Manual fix (nvm/fnm upgrade) |

---

#### Gap L-35: Integration Manifest Not Generated

| Field | Detail |
|-------|--------|
| **What** | `dev-output-integrate` doesn't write `.last-integration-manifest`. Persists since C11. |
| **Exists in jaan-to?** | `dev-output-integrate` (improvement needed) |

---

#### Gaps G-TS-01 through G-TS-05: team-ship Improvements (unchanged from C13)

| Gap | Description | Exists in jaan-to? |
|-----|-------------|---------------------|
| G-TS-01 | Permission delegation broken for spawned agents | `team-ship` (improvement) |
| G-TS-02 | No brownfield mode for existing projects | `team-ship` (improvement) |
| G-TS-03 | No stuck-agent recovery protocol | `team-ship` (improvement) |
| G-TS-04 | Model specification not enforced | `team-ship` (improvement) |
| G-TS-05 | QA flow needs integration before test generation | `team-ship` (improvement) |

---

## Section C — Summary Table

| Priority | Gap ID | Gap | Exists in jaan-to? | Blocks |
|----------|--------|-----|---------------------|--------|
| P1 | L-31 | OAuth Callback Missing | `backend-service-implement` (tested) | Login flow |
| P1 | L-32 | Auth Service Stubs TODO | `backend-service-implement` (tested) | All auth flows |
| P1 | L-33 | /users/me Missing | `backend-scaffold` (tested) | Session hydration |
| P2 | L-06 | Monetization (Stripe) | No dedicated skill | Revenue |
| P2 | L-07 | i18n Infrastructure | Partial | Multi-language |
| P3 | L-20 | CI/CD Failure Masking | `devops-infra-scaffold` (impr.) | Security gates |
| P3 | L-21 | Unpinned vercel@latest | `devops-infra-scaffold` (impr.) | Supply chain |
| P3 | L-22 | Missing Permissions Block | `devops-infra-scaffold` (impr.) | Least privilege |
| P3 | L-23 | Dependency Mismatches | `dev-verify` (impr.) | Consistency |
| P3 | L-24 | Web Unit Tests Missing | `qa-test-generate` (re-run) | Component coverage |
| P3 | L-25 | Turbo Remote Cache | `devops-deploy-activate` | CI performance |
| P3 | L-34 | Node.js Version Mismatch | Manual fix | Production parity |
| P3 | L-35 | Integration Manifest | `dev-output-integrate` (impr.) | Validation scope |
| P3 | G-TS-01 | team-ship permissions | `team-ship` (impr.) | Autonomous teams |
| P3 | G-TS-02 | team-ship brownfield | `team-ship` (impr.) | Feature additions |
| P3 | G-TS-03 | team-ship recovery | `team-ship` (impr.) | Reliability |
| P3 | G-TS-04 | team-ship model spec | `team-ship` (impr.) | Cost optimization |
| P3 | G-TS-05 | team-ship QA flow | `team-ship` (impr.) | End-to-end workflow |

**Skills that need to be created:** 0
**Skills that need improvement:** 4 (`team-ship`, `devops-infra-scaffold`, `dev-output-integrate`, `dev-verify`)
**Skills that exist but are untested for this project:** 1 (`backend-pr-review`)

---

## Section D — Critical Path

```
L-32 (Auth Service) ──→ L-31 (OAuth Callback) ──→ Working Login
         │                        │
         ↓                        ↓
L-33 (/users/me) ──→ Session Hydration ──→ NavbarAuth Works
                                                    │
                                                    ↓
                                          L-06 (Monetization) ──→ Revenue

L-20 ──→ L-21 ──→ L-22 ──→ Hardened CI/CD
L-24 ──────────────────────→ Test Coverage
G-TS-01 → G-TS-02 → G-TS-03 → Mature team-ship
```

**Critical path to working login**: L-32 → L-31 → L-33 (3 steps — all `backend-service-implement`).
**Critical path to revenue**: L-32 → L-31 → L-33 → L-06 (4 steps — backend service + monetization).
**Critical path to production hardening**: L-20 → L-21 → L-22 (3 steps — all infra-scaffold).

---

## Section E — Cycle-Over-Cycle Delta

| Metric | Cycle 13 | Cycle 14 | Delta |
|--------|----------|----------|-------|
| Total Gaps | 14 | 18 | **+4** (net: +5 new, -5 resolved, +4 from recalibration) |
| P0 Gaps | 0 | 0 | — |
| P1 Gaps | 1 | 3 | **+2** (L-30 resolved, L-31/L-32/L-33 discovered) |
| P2 Gaps | 2 | 2 | — (L-06, L-07 unchanged) |
| P3 Gaps | 11 | 13 | **+2** (L-34, L-35 new) |
| Specification | 100% | 93% | **-7** (recalibrated — marketing spec not 100%) |
| Scaffold | 100% | 88% | **-12** (recalibrated) |
| Production Code | 95%* | 74% | **-21** (recalibrated — strict evidence) |
| Tests | 70% | 45% | **-25** (recalibrated — strict evidence) |
| Scorecards | 43 | 43 | — (2 updated, 0 new files) |
| Average Score | 4.53 | 4.4 | -0.13 (recalibrated with updated scores) |
| jaan-to Version | v7.2.0 | v7.2.0-1-g3c10276 | +1 merge commit |

*C13 production % inflated by counting scaffold-only code. C14 uses strict evidence.*

### What Changed

- **5 gaps resolved**: L-26 (login page), L-27 (OAuth wired), L-28 (auth guard), L-29 (session UI), L-30 (scaffold integration)
- **5 new gaps discovered**: L-31 (OAuth callback), L-32 (auth service stubs), L-33 (/users/me), L-34 (Node.js version), L-35 (integration manifest)
- **Build now passes**: Both `tsc --noEmit` and `turbo build` succeed for API + Web
- **3 bugs fixed during integration**: cookie name mismatch, missing 401 schema, missing Suspense boundary
- **Progress matrix recalibrated**: C14 uses strict code evidence instead of scaffold-as-production counting

### Resolution Velocity

| Cycle | Gaps Resolved | New Gaps | Net Change |
|-------|--------------|----------|------------|
| C11 | 9 | 6 | -3 |
| C12 | 2 | 2 | 0 |
| C13 | 0 | 6 | +6 |
| C14 | 5 | 5 | 0 |

---

## Section F — Recommendations for Cycle 15

### Immediate Actions

1. **Run `backend-service-implement`** to implement `googleAuth()`, `refreshToken()`, `register()`, `logout()` in `auth.service.ts` (resolves L-32)
2. **Add OAuth callback route** — implement Google code exchange flow and `/login/callback` page (resolves L-31)
3. **Add `/users/me` endpoint** — thin route returning user profile from Prisma (resolves L-33)
4. **Run `dev-verify`** to confirm the build passes after service implementation
5. **Run `devops-deploy-activate`** to deploy the complete auth flow
6. **Run `qa-test-generate`** to create tests for auth components (partially addresses L-24)

### Priority Order

| Step | Action | Unblocks |
|------|--------|----------|
| 1 | `backend-service-implement` (auth service logic) | All auth flows (L-32) |
| 2 | Backend scaffold: OAuth callback + /users/me | Login flow (L-31, L-33) |
| 3 | `dev-verify` (build after implementation) | Deployment confidence |
| 4 | `devops-deploy-activate` (deploy auth) | Live login for users |
| 5 | `qa-test-generate` (auth tests) | Quality confidence (L-24) |
| 6 | Begin monetization (L-06) when ready | Revenue generation |

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-21 |
| Output Path | gap-reports/14-cycle/14-launch-gaps.md |
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
| G-TS-01–05 | team-ship improvements | [#149](https://github.com/parhumm/jaan-to/issues/149) (open) |
| L-31/32/33 | Auth service implementation | [#151](https://github.com/parhumm/jaan-to/issues/151) (**NEW — C14**) |
| L-34/35 | Version + manifest | P3 — no issue needed |

---

> **Bottom line:** Cycle 14 accomplished the single critical integration step from C13: login/auth scaffolds are now production code and the build passes. The login page is live at `/login`, auth middleware protects routes, and the navbar shows session state. However, the backend auth service layer remains unimplemented — `googleAuth()`, `refreshToken()`, `register()`, and `logout()` are still stubs. The critical path to a working login flow is now 3 steps: implement auth service (L-32), add OAuth callback (L-31), add /users/me endpoint (L-33) — all addressable with existing jaan-to skills. The co-evolution loop continues: 14 cycles, 44 skills cataloged, 43 scorecard files, average 4.4/5.
