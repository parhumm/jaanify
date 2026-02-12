---
title: "Cycle 9 Plan — Jaanify"
cycle: 9
date: 2026-02-12
jaan_to_version: "v6.1.0"
jaan_to_sha: "02c9e3c"
previous_version: "v6.0.0"
bottleneck: "code-to-tested"
skills_queued: 6
market_focus: "Beta launch readiness — integrate all generated artifacts and activate deployment pipeline"
---

# Cycle 9 Plan — Jaanify

> Date: 2026-02-12
> jaan-to: v6.0.0 → v6.1.0 (SHA: 02c9e3c)
> Bottleneck: code-to-tested
> Co-Evolution Step: REVIEW & TEST → BUILD

---

## State Assessment

### Progress Matrix (Current)

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% | 90% | 0% |
| Frontend | 100% | 100% | 80% | 0% |
| Infrastructure | 100% | 100% | 0% | N/A |
| Marketing / GTM | 50% | 0% | 0% | N/A |
| **Overall** | **100%** | **100%** | **60%** | **0%** |

### Version Delta

| Metric | Previous | Current | Change |
|--------|----------|---------|--------|
| jaan-to version | v6.0.0 | v6.1.0 | +1 minor release |
| Total skills | 38 | 40 | **+2** |
| Skills tested | 38 | 38 | 0 (2 new untested) |
| Skills untested | 0 | 2 | +2 |

### v6.1.0 Changelog (v6.0.0 → v6.1.0)

| Commit | Description |
|--------|-------------|
| `02c9e3c` | release: prepare v6.1.0 |
| `d3e17b5` | Merge PR #72: feat/70-dev-output-integrate |
| `eedcbab` | feat(skills): add dev-output-integrate and devops-deploy-activate |
| `8765f54` | Merge PR #71: fix/seed-reconciliation |
| `0c66bcb` | feat(skill): Add post-detect seed reconciliation to all detect skills |
| `5db70b6` | Merge PR #69: fix/issue-64-outputs-dir-default |
| `e83964e` | fix(config): correct seed settings.yaml default path examples |
| `0ff5254` | chore: remove all legacy migration code from bootstrap |
| `35135b2` | feat: switch bootstrap from eager to lazy template/learn seeding |
| `8ef8c96` | fix(skill): Convert jaan-issue-report to AskUserQuestion |
| `6b6a6fe` | fix(skill): Update jaan-issue-report smart submit fallback |

### Open Gaps (from 08-launch-gaps.md)

| Priority | Gap ID | Gap | Skill Exists? |
|----------|--------|-----|---------------|
| **P1** | L-08 | Output Integration | **YES — `dev-output-integrate` (NEW in v6.1.0)** |
| **P1** | L-09 | Deployment Pipeline Activation | **YES — `devops-deploy-activate` (NEW in v6.1.0)** |
| P2 | L-06 | Monetization Infrastructure | No (post-beta) |
| P2 | L-07 | i18n Infrastructure | Partial (post-beta) |
| P3 | L-10 | Re-run Detect Suite | Yes (`detect-dev`) |
| P3 | L-11 | Landing Page | Partial (`frontend-design`) |

---

## Bottleneck Analysis

**Classification:** code-to-tested

Production code exists at 60% (28 API files, 42 web files with real implementations). But tests remain at 0% — not because they haven't been generated (37 test files, 3,782 LOC exist in jaan-to/outputs), but because they haven't been **integrated into the project**.

This is an **integration bottleneck**, not a generation bottleneck. The solution is `dev-output-integrate` (L-08), which copies generated artifacts into their operational locations, followed by `devops-deploy-activate` (L-09) to make the pipeline live.

**Focus skills for this bottleneck:**
- `dev-output-integrate` — Install tests, security fixes, CI/CD, Docker into project
- `devops-deploy-activate` — Activate GitHub Actions, provision deploy targets
- `detect-dev` — Re-audit integrated code for security posture

---

## Execution Queue

| # | Type | Exact jaan-to Skill | Addresses | Expected Output | Rationale |
|---|------|---------------------|-----------|-----------------|-----------|
| 1 | P1 Gap | `/jaan-to:dev-output-integrate` | L-08 | Tests, security fixes, CI/CD workflows, Docker configs installed in project | Critical path step 1 — all generated artifacts become operational |
| 2 | P1 Gap | `/jaan-to:devops-deploy-activate` | L-09 | GitHub secrets configured, Actions SHA-pinned, Railway/Vercel provisioned | Critical path step 2 — deployment pipeline goes live |
| 3 | P3 Gap | `/jaan-to:frontend-design` | L-11 | Landing page with value proposition, features, CTA | Public-facing marketing page for user acquisition |
| 4 | Closing | `/jaan-to:release-iterate-changelog` | — | CHANGELOG updated with Cycle 9 entries | Standard cycle closing |
| 5 | Closing | `/gaps-critical-doc` | — | `09-launch-gaps.md` with updated progress matrix | Launch readiness assessment |
| 6 | Closing | `/gaps-critical-issue` | — | GitHub issue requests for remaining P2+ gaps | Co-evolution feedback to jaan-to |

**Total:** 6 jaan-to skill invocations

**Skipped (user decision):** `/jaan-to:detect-dev` (L-10) — deferred to next cycle

**Queue rules applied:**
- Priority order: P1 → P3 → closing
- Dependency order: dev-output-integrate before devops-deploy-activate (L-09 depends on L-08)
- Dependency order: dev-output-integrate before detect-dev (audit needs integrated code)
- Token budget cap: 6 of 12 max (lean and focused)
- Every item = exact jaan-to skill invocation (zero manual items)

---

## Market Impact

**This cycle advances:** Production Code (60% → 80%+), Tests (0% → ~80%), Infrastructure (0% → ~80%)

**Revenue blocker addressed:** L-08 (artifacts not integrated) and L-09 (no deployment pipeline) — the only two blockers to beta launch

**What's needed for first paying user:**
1. ~~L-08 Output Integration~~ → This cycle
2. ~~L-09 Deployment Pipeline~~ → This cycle
3. L-06 Monetization (Stripe) → Post-beta, can launch free-tier-only first

**GTM status:**
- Market research done (C1)
- GTM DataLayer spec exists (18 events)
- 7 project docs created (C8)
- Landing page (L-11) deferred to post-integration
- **After this cycle: Jaanify is deployable for invite-only beta**

---

## Deferred Items

Items that cannot be addressed this cycle (need new jaan-to skills or are post-beta):

| Gap | Description | Action |
|-----|-------------|--------|
| L-06 | Monetization (Stripe integration) | No jaan-to skill exists → request via `/gaps-critical-issue` |
| L-07 | i18n (wire microcopy to UI) | Partial skill → request improvement via `/gaps-critical-issue` |
| L-11 | Landing page | `frontend-design` can address → defer to Cycle 10 |

These will be submitted via `/gaps-critical-issue` at cycle close.

---

## Autonomous Decisions

| # | Decision | Rationale | Source |
|---|----------|-----------|--------|
| 1 | Focus cycle entirely on L-08 + L-09 critical path | These are the only 2 blockers to beta launch; all other gaps are post-beta | Section F of 08-launch-gaps.md |
| 2 | Run detect-dev between integration and deployment | Audit integrated code before deploying — catches issues before they're live | LEARN.md: "Don't harden TODO stubs" → now we have real code |
| 3 | Skip detect domain expansion | All 5/5 detect domains already covered (C5). No need for re-runs except detect-dev | LEARN.md: Detect Domain Coverage |
| 4 | Skip learn-add feedback before skill execution | Both new skills are untested — will submit learn feedback AFTER testing if needed | LEARN.md: Scorecard Immediately After Skill |
| 5 | Defer L-06, L-07, L-11 to post-beta | Monetization/i18n/landing page don't block invite-only beta launch | 08-launch-gaps.md Section D critical path |
| 6 | Cap queue at 6 skills (not 12) | Focused cycle — integration + deployment + audit + closing. Less is more for a critical-path cycle | LEARN.md: Token Budget Exhaustion |

---

## Expected Outcomes

After this cycle completes:

### Target Progress Matrix

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 100% | 95% | 80% |
| Frontend | 100% | 100% | 85% | 80% |
| Infrastructure | 100% | 100% | 80% | N/A |
| **Overall** | **100%** | **100%** | **85%** | **80%** |

### Deliverables

- New deliverables: 4 (integration log, detect-dev re-audit, deploy activation report, CHANGELOG update)
- Scorecards written: 3 (dev-output-integrate, devops-deploy-activate, detect-dev re-test)
- Gaps resolved: 2-3 (L-08 Output Integration, L-09 Deployment Pipeline, potentially L-10 Re-audit)
- Learn feedback submitted: As needed based on skill performance
- Detect domains covered: 5/5 (maintained from C5)

### Beta Launch Readiness

If L-08 and L-09 are fully resolved:
- Tests installed and runnable
- Security fixes applied
- CI/CD pipeline active on GitHub Actions
- Backend deployed to Railway
- Frontend deployed to Vercel
- **Jaanify is deployable for invite-only beta**

---

## Co-Evolution Loop Highlight

**Issue #70 → v6.1.0 → Cycle 9**: This cycle demonstrates the co-evolution loop at its best:
1. Cycle 7 identified L-08 and L-09 gaps
2. `/gaps-critical-issue` created GitHub issue #70 requesting new skills
3. jaan-to v6.1.0 shipped `dev-output-integrate` and `devops-deploy-activate` — exact matches
4. Cycle 9 tests and uses both new skills to resolve the gaps

The loop is working: Jaanify's needs drive jaan-to's development, and jaan-to's new skills advance Jaanify.

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-12 |
| Output Path | gap-reports/09-cycle/09-plan.md |
| Skill | cycle-new |
| Status | Awaiting Approval |

---

> Generated by cycle-new | 2026-02-12 | Co-Evolution Cycle 9
