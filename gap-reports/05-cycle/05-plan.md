---
title: "Cycle 5 Plan — Jaanify"
cycle: 5
date: 2026-02-10
jaan_to_version: "v5.0.0"
jaan_to_sha: "5e22ff1923aae9b5b1f68b1fa16740e5ad5b7ae2"
previous_version: "v4.5.0"
bottleneck: "scaffold-to-code"
skills_queued: 11
market_focus: "quality-verification-after-v5-token-optimization"
---

# Cycle 5 Plan — Jaanify

> Date: 2026-02-10
> jaan-to: v4.5.0 → v5.0.0 (SHA: 5e22ff19)
> Bottleneck: scaffold-to-code
> Co-Evolution Step: REVIEW & TEST → BUILD
> Cycle Focus: v5.0.0 token optimization regression testing + detect domain coverage

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
| jaan-to version | v4.5.0 | v5.0.0 | 2 releases (v4.5.1, v5.0.0) |
| Total skills | 31 | 31 | 0 (no new skills) |
| Skills tested | 18 | 18 | 0 (pending this cycle) |
| Skills untested (user-facing) | 5 | 5 | 0 |

### v5.0.0 Changes (Token Optimization Release)

This is a **structural/performance release**, not a feature release. No new skills were added. Changes:

1. **Language + pre-execution boilerplate extracted** from all 31 SKILL.md files (−754 lines total)
2. **Reference sections extracted** from 7 skills into separate files:
   - `detect-dev` — SARIF + OpenSSF reference (−196 lines)
   - `detect-pack` — Consolidation logic reference (−242 lines)
   - `pm-research-about` — Research methodology reference (−206 lines)
   - `backend-task-breakdown` — Export formats reference (−211 lines)
   - `ux-microcopy-write` — Microcopy reference (−199 lines)
   - `ux-research-synthesize` — Templates reference (−124 lines)
   - `skill-create` + `skill-update` — v3 compliance + git workflow (−1,036 lines combined)
3. **Frontmatter flags added** to 13 skills: `disable-model-invocation` (7) and `context:fork` (6)
4. **CLAUDE.md trimmed** from 282 to ~97 lines
5. **v4.5.1** standardized backend + frontend skill output paths to `{id}-{slug}` convention

**Risk**: Extracted references may not load properly, causing quality degradation in affected skills.

### Open Gaps (from latest launch-gaps.md)

| Priority | Gap ID | Gap | Skill Exists? |
|----------|--------|-----|---------------|
| **P0** | L-01 | Service Implementation Skill | No |
| **P0** | L-02 | Integration / Wiring Skill | No |
| **P0** | L-03 | Test Stub Generation | No (scaffold deficiency) |
| **P1** | L-04 | Security Hardening | Partial |
| **P1** | L-05 | CI/CD Scaffold Skill | No |

---

## Bottleneck Analysis

**Classification:** scaffold-to-code

Core BE + FE are 100% specified and 80% scaffolded, but production code is 0%. No `src/`, `app/`, or `pages/` directories exist. All 21 backend route handlers return `// TODO: implement`. All 26 frontend components are bundled in single files in `jaan-to/outputs/`, not in a runnable project structure.

The bottleneck is crossing the scaffold-to-production threshold, but this is blocked by missing jaan-to skills (L-01, L-02, L-03). Since v5.0.0 added no new skills to address these gaps, this cycle focuses on:
1. Verifying v5.0.0 didn't degrade existing skill quality (regression testing)
2. Filling detect domain coverage to 5/5 (untested skills)
3. Researching scaffold-to-code strategies via pm-research-about

**Focus skills for this bottleneck:**
- `detect-design`, `detect-writing`, `detect-product`, `detect-ux` (fill quality audit domains)
- `backend-scaffold`, `frontend-scaffold` (re-test v5.0.0 quality)
- `pm-research-about` (research implementation strategy)
- `ux-flowchart-generate` (untested — system flow diagrams)

---

## Execution Queue

| # | Type | Exact jaan-to Skill | Addresses | Expected Output | Rationale |
|---|------|---------------------|-----------|-----------------|-----------|
| 1 | Untested | `Skill(jaan-to:detect-design)` | Detect 2/5 + v5.0.0 test | Design system detection with drift findings | First test; had boilerplate extraction + context:fork flag |
| 2 | Untested | `Skill(jaan-to:detect-writing)` | Detect 3/5 + v5.0.0 test | Writing system extraction, NNg tone dimensions | First test; had boilerplate extraction + context:fork flag |
| 3 | Untested | `Skill(jaan-to:detect-product)` | Detect 4/5 + v5.0.0 test | Product reality extraction, monetization scan | First test; had boilerplate extraction + context:fork flag |
| 4 | Untested | `Skill(jaan-to:detect-ux)` | Detect 5/5 + v5.0.0 test | UX audit with Nielsen's 10 heuristics | First test; had boilerplate extraction + context:fork flag |
| 5 | Untested | `Skill(jaan-to:ux-flowchart-generate)` | Gap #14 (cache) + v5.0.0 | Mermaid flowcharts from PRD | First test; was blocked in C4 by plugin cache v4.4.0 |
| 6 | Re-test | `Skill(jaan-to:backend-scaffold)` | L-01 quality + v5.0.0 | Backend scaffold with v5.0.0 path convention | Re-test; path standardization + boilerplate changes. Compare C4 score (4.7/5) |
| 7 | Re-test | `Skill(jaan-to:frontend-scaffold)` | L-02 quality + v5.0.0 | Frontend scaffold with v5.0.0 path convention | Re-test; path standardization + boilerplate changes. Compare C4 score (4.6/5) |
| 8 | Re-test | `Skill(jaan-to:pm-research-about, args: "strategies for transitioning from scaffold TODO stubs to production code in Fastify v5 + Next.js 15 + Prisma v6 monorepo — implementation patterns, code generation approaches, and incremental deployment")` | L-01 research + v5.0.0 | Research report on scaffold-to-code strategy | Re-test; had methodology reference extracted (−206 lines). Dual purpose: test quality + advance L-01 knowledge |
| 9 | Re-test | `Skill(jaan-to:detect-pack)` | Full consolidation + v5.0.0 | Consolidated index with risk heatmap (5/5 domains) | Re-test; had consolidation logic extracted (−242 lines). Now has 5/5 domain input vs 1/5 in C4 |
| 10 | Closing | `Skill(jaan-to:release-iterate-changelog)` | CHANGELOG update + v5.0.0 | Updated CHANGELOG with Cycle 5 entries | Re-test v5.0.0 + cycle closing requirement |
| 11 | Closing | `Skill(gaps-critical-doc, args: "5")` | Launch readiness analysis | Updated launch-gaps.md with Cycle 5 delta | Always-run closing skill |

**Total:** 11 jaan-to skill invocations

**Queue rules applied:**
- Priority order: untested (fills detect gaps) → re-tests (v5.0.0 quality) → closing
- Dependency order: detect-* (1-4) before detect-pack (9); all skills before changelog (10) and gaps-critical-doc (11)
- Token budget cap: 11/12 (1 slot reserved for contingency)
- Every item = exact jaan-to skill invocation (zero manual items)

---

## Market Impact

**This cycle advances:** Quality assurance (detect 1/5 → 5/5), scaffold-to-code research, v5.0.0 quality verification

**Revenue blocker addressed:** No P0/P1 gaps are directly resolved this cycle (they require new jaan-to skills that don't exist in v5.0.0). However:
- Full detect coverage (5/5) provides comprehensive quality baseline for launch readiness
- pm-research-about output informs L-01 implementation strategy
- Scaffold re-tests verify v5.0.0 produces launch-quality output

**What's needed for first paying user:**
- L-01: Service implementation (scaffold stubs → real business logic)
- L-02: Integration/wiring (scaffold files → runnable project)
- L-03: Test generation (BDD scenarios → runnable test files)
- L-04: Security hardening (JWT, rate limiting, cookies)
- L-05: CI/CD pipeline (GitHub Actions, Docker, deployment)

**GTM status:**
- GTM tracking specified (18 events via data-gtm-datalayer)
- Microcopy in 7 languages for 2 screen packs
- No landing page, marketing site, or user documentation yet
- pm-research-about (#8 in queue) will include GTM considerations in scaffold-to-code strategy

---

## Deferred Items

Items that cannot be addressed this cycle (need new jaan-to skills):

| Gap | Description | Action |
|-----|-------------|--------|
| L-01 | Service Implementation Skill | No skill exists in v5.0.0 catalog. Will request via `/gaps-critical-issue` at cycle close. |
| L-02 | Integration / Wiring Skill | No skill exists in v5.0.0 catalog. Will request via `/gaps-critical-issue` at cycle close. |
| L-03 | Test Stub Generation | Scaffold deficiency — no test files generated. Will request via `/gaps-critical-issue`. |
| L-05 | CI/CD Scaffold Skill | No skill exists in v5.0.0 catalog. Will request via `/gaps-critical-issue`. |

These will be submitted via `/gaps-critical-issue` at cycle close.

---

## Autonomous Decisions

| # | Decision | Rationale | Source |
|---|----------|-----------|--------|
| 1 | Run all 4 untested detect skills before scaffold re-tests | Detect skills analyze existing C4 outputs — no dependency on v5.0.0 scaffold output. This fills detect domains to 5/5 and enables meaningful detect-pack consolidation. | LEARN.md: "Don't run detect-pack with < 3/5 domains" |
| 2 | Re-run both scaffold skills despite same inputs | v5.0.0 changed boilerplate extraction and v4.5.1 changed output paths. Re-running produces a direct quality comparison against C4 scorecards (4.7/5 and 4.6/5). If scores drop, v5.0.0 regression is confirmed. | User request: "review all skills and output quality" |
| 3 | Use pm-research-about for scaffold-to-code strategy | Dual purpose: (a) regression test pm-research-about after v5.0.0 methodology reference extraction (−206 lines), (b) advance Gap L-01 knowledge with actionable implementation strategy. | Gap L-01 is the #1 launch blocker; research informs approach |
| 4 | Skip re-testing spec skills (pm-prd-write, pm-story-write, qa-test-cases) | These skills are high-scoring (4.5-4.8/5) and produce spec documents that already exist. Re-running them would overwrite good output. Token budget is better spent on untested skills and scaffold quality verification. | Token budget cap (12 max); specs are 100% for BE/FE |
| 5 | Test ux-flowchart-generate despite scaffold-to-code bottleneck | It was blocked in C4 by plugin cache v4.4.0. With v5.0.0, cache should be aligned. Flow diagrams from PRD provide visual system architecture that helps with L-02 (integration/wiring). | Gap #14 (cache mismatch) from C4; LEARN.md: "Plugin Cache vs Submodule Version" |

---

## Expected Outcomes

After this cycle completes:

### Target Progress Matrix

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | 100% | 80% | 0% | 0% |
| Frontend | 100% | 80% | 0% | 0% |
| Infrastructure | 0% | 0% | 0% | 0% |
| **Overall** | **75%** | **40%** | **0%** | **0%** |

Note: Progress matrix is not expected to change this cycle. The focus is quality verification (v5.0.0 regression testing) and detect coverage expansion, not new deliverable creation. The scaffold re-tests replace existing outputs at the same quality level.

### Deliverables

- New deliverables: 5 (4 detect domain reports + 1 flowchart)
- Scorecards written: 11 (4 new detect + 1 ux-flowchart + 4 re-test updates + 2 closing)
- Gaps resolved: 0 (all 5 P0+P1 gaps require new skills not in v5.0.0)
- Learn feedback submitted: TBD (based on re-test findings)
- Detect domains covered: 5/5 (up from 1/5)

### Quality Metrics

- v5.0.0 regression test coverage: 7 skills re-tested out of 18 previously tested (39%)
- New skill coverage: 5 untested skills tested (fills all user-facing gaps in catalog)
- Detect domain coverage: 1/5 → 5/5 (100%)
- Skills with reference extraction tested: 4/7 (detect-dev via detect-pack, pm-research-about, detect-pack direct)

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | gap-reports/05-cycle/05-plan.md |
| Skill | cycle-new |
| Status | Awaiting Approval |

---

> Generated by cycle-new | 2026-02-10 | Co-Evolution Cycle 5
