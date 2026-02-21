---
title: "Cycle 14 Plan — Jaanify"
cycle: 14
date: 2026-02-21
jaan_to_version: "v7.2.0-1-g3c10276"
jaan_to_sha: "3c10276fc7249cd2968e5ac1a88107c05e669566"
previous_version: "v7.2.0"
bottleneck: "scaffold-to-code (login/auth integration)"
skills_queued: 5
market_focus: "Working login flow for all users"
---

# Cycle 14 Plan — Jaanify

> Date: 2026-02-21
> jaan-to: v7.2.0 → v7.2.0-1-g3c10276 (SHA: 3c10276)
> Bottleneck: scaffold-to-code (login/auth integration)
> Co-Evolution Step: REVIEW & TEST → BUILD

---

## State Assessment

### Progress Matrix (Current)

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% | 90% | 80% |
| Frontend | 100% | 100% | 85% | 40% |
| Infrastructure | 100% | 100% | 100% | N/A |
| Marketing / GTM | 65% | 50% | 20% | N/A |
| **Overall** | **91%** | **88%** | **74%** | **55%** |

### Version Delta

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| jaan-to version | v7.2.0 | v7.2.0-1-g3c10276 | +1 commit (merge PR #147) |
| Total skills | 44 | 44 | — |
| Skills tested | 43 | 43 | — |
| Skills untested | 1 | 1 | — (backend-pr-review) |

### Open Gaps (from 13-launch-gaps.md)

| Priority | Gap ID | Gap | Skill Exists? |
|----------|--------|-----|---------------|
| P1 | L-30 | Scaffold Integration Pending | `dev-output-integrate` (tested, 4.5/5) |
| P2 | L-06 | Monetization (Stripe) | No dedicated skill (deferred) |
| P2 | L-07 | i18n Infrastructure | Partial (deferred) |
| P3 | L-20 | CI/CD Failure Masking | `devops-infra-scaffold` (impr.) |
| P3 | L-21 | Unpinned vercel@latest | `devops-infra-scaffold` (impr.) |
| P3 | L-22 | Missing Permissions Block | `devops-infra-scaffold` (impr.) |
| P3 | L-23 | Dependency Mismatches | `dev-verify` (impr.) |
| P3 | L-24 | Web Unit Tests Missing | `qa-test-generate` (re-run) |
| P3 | L-25 | Turbo Remote Cache | `devops-deploy-activate` |
| P3 | G-TS-01–05 | team-ship improvements (5) | `team-ship` (impr.) |

---

## Bottleneck Analysis

**Classification:** scaffold-to-code (login/auth integration)

The state machine maps to "quality-and-polish" (all dimensions > 50%), but the **user-identified critical path** overrides: login/auth scaffolds produced in C13 are NOT integrated into production code. Gap L-30 is the only P1 gap. The scaffolds (6 FE + 2 BE files, ~2200 lines) are ready in `jaan-to/outputs/` but users cannot log in until they're wired into `apps/`.

**Focus skills for this bottleneck:**
- `dev-output-integrate` — copy scaffolds into apps/
- `dev-verify` — validate build after integration

---

## Execution Queue

| # | Type | Exact jaan-to Skill | Addresses | Expected Output | Rationale |
|---|------|---------------------|-----------|-----------------|-----------|
| 1 | P1 Gap | `/jaan-to:dev-output-integrate` (login/auth scaffolds) | L-30, L-26–L-29 | 8 files integrated into apps/, login page at /login, auth middleware, navbar auth | Single step to working login flow |
| 2 | Verification | `/jaan-to:dev-verify` | Build confidence | Both apps build (0 errors), runtime health check | Ensures integration didn't break anything |
| 3 | Closing | `/jaan-to:release-iterate-changelog` | CHANGELOG | v0.5.0 entry for login/auth integration | Record this cycle's changes |
| 4 | Closing | `/gaps-critical-doc` | Gap analysis | 14-launch-gaps.md with updated progress matrix | Launch readiness assessment |
| 5 | Closing | `/gaps-critical-issue` | GitHub issues | Issue requests for remaining gaps | Co-evolution feedback loop |

**Total:** 5 jaan-to skill invocations

**Queue rules applied:**
- Priority order: P1 (L-30) → verification → closing
- Dependency order: integrate → verify → changelog → gap analysis → issue requests
- Token budget: well under 12 cap
- Every item = exact jaan-to skill invocation (zero manual items)

---

## Market Impact

**This cycle advances:** Production code (74% → ~92%), closing the scaffold-to-code gap for login/auth

**Revenue blocker addressed:** L-30 (scaffold integration) — users can log in after this cycle

**What's needed for first paying user:**
1. ~~Integrate login scaffolds~~ (this cycle)
2. ~~Verify build~~ (this cycle)
3. Wire Google OAuth with real credentials (env var configuration)
4. Deploy updated code (CI/CD already exists — push triggers deploy)
5. Add Stripe billing (L-06 — future cycle)

**GTM status:**
- After this cycle: full funnel Home → Login → Dashboard → Tasks
- Landing page already live with professional copy
- CI/CD pipeline active (GitHub Actions → Railway + Vercel)
- Push to main after successful build triggers deployment

---

## Deferred Items

Items that cannot be addressed this cycle (need new jaan-to skills or are user-deferred):

| Gap | Description | Action |
|-----|-------------|--------|
| L-06 | Monetization (Stripe) | Deferred by user — no dedicated jaan-to skill |
| L-07 | i18n Infrastructure | Deferred by user — partial skill coverage |
| L-24 | Web Unit Tests Missing | Deferred to next cycle — `qa-test-generate` |
| G-TS-01–05 | team-ship improvements | Filed as [#149](https://github.com/parhumm/jaan-to/issues/149) |

These will be checked via `/gaps-critical-issue` at cycle close.

---

## Autonomous Decisions

| # | Decision | Rationale | Source |
|---|----------|-----------|--------|
| 1 | Skip qa-test-generate/qa-test-run this cycle | User's explicit focus is integrate + verify + make available. Testing deferred to C15. | User arguments |
| 2 | Skip devops-deploy-activate | CI/CD already active (C10-C11). Push to main triggers auto-deploy. No need for re-activation. | scorecards/devops-deploy-activate.md, .github/workflows/ |
| 3 | dev-output-integrate may need manual invocation | Skill has `disable-model-invocation: true` — may not be available via Skill tool. Will attempt Skill tool first; if fails, read SKILL.md and execute as guided prompt. | vendor/jaan-to/skills/dev-output-integrate/SKILL.md |
| 4 | "make sure it's available for all users" = integrate + push | App is already deployed. After integration + verify, push triggers CI/CD → live deployment. No separate deploy step needed. | .github/workflows/cd.yml, user arguments |
| 5 | Keep cycle narrow (5 skills) | User directive is precise: "That's the single step between now and a working login flow." Respect the scope. | User arguments |

---

## Expected Outcomes

After this cycle completes:

### Target Progress Matrix

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% | 95% | 80% |
| Frontend | 100% | 100% | 95% | 40% |
| Infrastructure | 100% | 100% | 100% | N/A |
| **Overall** | **93%** | **88%** | **92%** | **55%** |

### Deliverables

- New deliverables: 8 files integrated into apps/
- Scorecards written: 2 (dev-output-integrate retest, dev-verify retest)
- Gaps resolved: 1 (L-30) + 4 dependents (L-26–L-29)
- Learn feedback submitted: as needed based on findings
- Detect domains covered: 5/5 (unchanged)

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-21 |
| Output Path | gap-reports/14-cycle/14-plan.md |
| Skill | cycle-new |
| Status | Awaiting Approval |

---

> Generated by cycle-new | 2026-02-21 | Co-Evolution Cycle 14
