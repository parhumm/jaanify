---
title: "Cycle 13 Plan — Jaanify"
cycle: 13
date: 2026-02-20
jaan_to_version: "v7.2.0"
jaan_to_sha: "3c10276fc7249cd2968e5ac1a88107c05e669566"
previous_version: "v7.0.0"
bottleneck: "user-reported-P0: Login/Auth UX broken"
skills_queued: 4
market_focus: "Fix login/auth flow — user literally cannot log in"
---

# Cycle 13 Plan — Jaanify

> Date: 2026-02-20
> jaan-to: v7.0.0 → v7.2.0 (SHA: 3c10276)
> Bottleneck: user-reported-P0 — Login/Auth UX broken
> Co-Evolution Step: REVIEW & TEST → BUILD

---

## State Assessment

### Progress Matrix (Current)

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% | 90% | 75% |
| Frontend | 100% | 100% | 75% | 35% |
| Infrastructure | 100% | 100% | 85% | N/A |
| Marketing / GTM | 70% | 50% | 25% | N/A |
| **Overall** | **93%** | **88%** | **69%** | **45%** |

### Version Delta

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| jaan-to version | v7.0.0 | v7.2.0 | +2 releases |
| Total skills | 43 | 44 | +1 (team-ship) |
| Skills tested | 42 | 42 | +0 |
| Skills untested | 1 | 2 | +1 (team-ship, backend-pr-review) |

### Key Changes in v7.1.0 → v7.2.0

- **v7.1.0**: NEW `team-ship` skill — role-based agent team orchestration
- **v7.2.0**: Agent Skills open standard compatibility, security enforcement, team-ship improvements
- **pm-prd-write**: Improved output readability, document flow, RTL support
- **All 44 skills**: Added compliance sections for Agent Skills standard
- **Security**: Automated security enforcement across CI, release, and issue review
- **13 security findings remediated** across the plugin

### Open Gaps (from C12 launch-gaps + NEW from frontend investigation)

| Priority | Gap ID | Gap | Skill Exists? |
|----------|--------|-----|---------------|
| **P0** | **L-26** | **No Login Page — no `/login` route, no login button on landing** | **NEW — needs frontend-design + frontend-scaffold** |
| **P0** | **L-27** | **OAuth Not Wired — Google OAuth button has TODO, never triggers** | **NEW — needs backend-service-implement + frontend-scaffold** |
| **P1** | **L-28** | **No Auth Guard — dashboard accessible without authentication** | **NEW — needs frontend-scaffold** |
| **P1** | **L-29** | **No Session UI — no logged-in/logged-out state in navbar** | **NEW — needs frontend-design** |
| P2 | L-06 | Monetization (Stripe) — zero billing infrastructure | No dedicated skill |
| P2 | L-07 | i18n Infrastructure — zero locale infrastructure | Partial (microcopy, no wiring) |
| P3 | L-20 | CI/CD Failure Masking | devops-infra-scaffold (improvement) |
| P3 | L-21 | Unpinned vercel@latest | devops-infra-scaffold (improvement) |
| P3 | L-22 | Missing Permissions Block | devops-infra-scaffold (improvement) |
| P3 | L-23 | Dependency Version Mismatches | dev-verify (improvement) |
| P3 | L-24 | Web Unit Tests Missing | qa-test-generate (re-run) |
| P3 | L-25 | Turbo Remote Cache | devops-deploy-activate |

---

## Bottleneck Analysis

**Classification:** user-reported-P0 — Login/Auth UX broken

The standard bottleneck classification would be "quality-and-polish" (all dimensions >50%). However, the user explicitly reported a P0 usability blocker: **"I can't find login and use."**

Frontend investigation confirmed:
1. **No login page exists** — zero `/login`, `/signin`, `/auth` routes
2. **No login button** — landing page only has "Get Started" → onboarding
3. **Google OAuth is a TODO** — the "Continue with Google" button in onboarding step 4 has `// TODO: Trigger Google OAuth flow`
4. **No auth guard** — anyone can navigate directly to `/dashboard`
5. **No session management UI** — no logged-in state displayed anywhere

This overrides the automated bottleneck classification. The product cannot be used if users can't log in.

**Focus skills for this bottleneck:**
- `team-ship` (user-requested — orchestrates full fix with multi-role team)
- Internally team-ship will use: `pm-prd-write`, `pm-story-write`, `frontend-design`, `frontend-scaffold`, `backend-scaffold`, `qa-test-generate`, `qa-test-run`, `devops-infra-scaffold`

---

## Execution Queue

| # | Type | Exact jaan-to Skill | Addresses | Expected Output | Rationale |
|---|------|---------------------|-----------|-----------------|-----------|
| 1 | Setup | Config update + `agent_teams_enabled: true` | Pre-req | Updated config.md + settings.yaml | team-ship requires agent_teams_enabled |
| 2 | **P0** | **`/jaan-to:team-ship "Fix Jaanify login/auth UX: add login page with Google OAuth, wire auth flow, add auth guards on protected routes, add session state to navbar" --track fast`** | **L-26, L-27, L-28, L-29** | **Login page, OAuth wiring, auth guards, session UI** | **User-requested; orchestrates 8 sub-skills via team** |
| 3 | Scorecard | Write scorecard for team-ship | First test | team-ship.md scorecard | NEW skill — first-ever test against Jaanify |
| 4 | Closing | `/jaan-to:release-iterate-changelog` | Changelog | Updated CHANGELOG.md | Record cycle 13 changes |
| 5 | Closing | `/gaps-critical-doc` | Gap analysis | 13-launch-gaps.md | Launch readiness with new gap status |
| 6 | Closing | `/gaps-critical-issue` | Issue requests | GitHub issue templates | Request skill improvements |

**Total:** 4 direct jaan-to skill invocations + team-ship orchestrating ~8 sub-skills internally = ~12 total skill executions

**Queue rules applied:**
- Priority order: P0 (team-ship for login fix) → closing skills
- Dependency order: config update → team-ship → scorecard → closing
- Token budget cap: 12 max (4 direct + 8 team-ship internal)
- Every item = exact jaan-to skill invocation (zero manual items)

---

## Market Impact

**This cycle advances:** Frontend usability from "broken login" to "functional auth flow" — a prerequisite for ANY user adoption

**Revenue blocker addressed:** L-26 + L-27 (users literally cannot log in → zero retention possible)

**What's needed for first paying user:**
1. ~~Working login flow~~ ← THIS CYCLE addresses it
2. L-06 Monetization (Stripe) — next cycle
3. Working task management flow (already functional post-login)
4. Deployed to production (infra exists)

**GTM status:**
- Landing page exists with professional marketing copy
- 60-second onboarding flow exists
- Auth flow is the MISSING LINK between marketing site and product usage
- After this cycle: the funnel Home → Login → Dashboard → Tasks should be complete

---

## Deferred Items

Items that cannot be addressed this cycle (need new jaan-to skills or are lower priority):

| Gap | Description | Action |
|-----|-------------|--------|
| L-06 | Monetization (Stripe integration) | No dedicated jaan-to skill; request via gaps-critical-issue |
| L-07 | i18n Infrastructure (locale wiring) | Partial skill coverage; defer |
| L-20/21/22 | CI/CD hardening | devops-infra-scaffold improvement; defer to C14 |
| L-24 | Web unit tests | qa-test-generate re-run; may be partially addressed by team-ship QA |
| L-25 | Turbo remote cache | devops-deploy-activate; defer |

These will be submitted via `/gaps-critical-issue` at cycle close.

---

## Autonomous Decisions

| # | Decision | Rationale | Source |
|---|----------|-----------|--------|
| 1 | Override bottleneck classification from "quality-and-polish" to "user-reported-P0" | User explicitly reported they can't log in — this blocks all product usage | User input + frontend investigation |
| 2 | Use team-ship with `--track fast` (8 skills) instead of `--track full` (20 skills) | Fast track is sufficient for a focused feature fix; full track would exceed token budget | team-ship SKILL.md, LEARN.md token budget lesson |
| 3 | Enable `agent_teams_enabled: true` in settings.yaml | Required for team-ship to pass environment check (Step 1) | team-ship SKILL.md Step 1 |
| 4 | Classify 4 new P0/P1 gaps (L-26 through L-29) from frontend investigation | C12 gap analysis missed these because it focused on code quality, not UX flow testing | Frontend investigation findings |
| 5 | Defer detect-ux re-run to save token budget for team-ship | team-ship QA role will validate the fix; separate detect-ux can run in C14 | LEARN.md token budget cap |
| 6 | Skip regression testing this cycle — focus entirely on the login fix | C12 already ran 9/9 regression tests with +0.11 avg improvement; no regressions detected | C12 gap report |

---

## Expected Outcomes

After this cycle completes:

### Target Progress Matrix

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% | 92% | 75% |
| Frontend | 100% | 100% | 85% | 45% |
| Infrastructure | 100% | 100% | 85% | N/A |
| **Overall** | **93%** | **88%** | **78%** | **50%** |

### Deliverables

- New deliverables: Login page, OAuth wiring, auth guards, session UI, team-ship orchestration log
- Scorecards written: 1 (team-ship — first test)
- Gaps resolved: L-26, L-27, L-28, L-29 (partially or fully)
- Learn feedback submitted: based on team-ship findings
- Detect domains covered: 5/5 (unchanged from C12)

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-20 |
| Output Path | gap-reports/13-cycle/13-plan.md |
| Skill | cycle-new |
| Status | AWAITING APPROVAL |

---

> Generated by cycle-new | 2026-02-20 | Co-Evolution Cycle 13
