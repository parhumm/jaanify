# Scan Report — Cycle 6

> Date: 2026-02-10
> jaan-to Version: v5.1.0 (commit `fdbd3ac`)
> Previous: v5.0.0 (Cycle 5)
> Version Delta: 1 release (v5.1.0)
> Cycle Focus: Test untested and low-scoring skills, compare pre-v5 output quality

---

## Version Delta Summary

| Metric | Cycle 5 (v5.0.0) | Cycle 6 (v5.1.0) | Change |
|--------|-------------------|-------------------|--------|
| Total skills | 31 | 33 | +2 (jaan-init, jaan-issue-report) |
| Roles | 7 | 7 | 0 |
| Breaking changes | None | None | 0 |
| New skills | 0 | 2 | +2 |
| Bootstrap behavior | Auto-run | Opt-in via /jaan-to:jaan-init | Changed |

---

## Release-by-Release Changelog (v5.0.0 → v5.1.0)

### v5.1.0 — jaan-init + jaan-issue-report, Bootstrap Opt-in

Commits:
- `fdbd3ac` Merge pull request #56 from parhumm/dev
- `3fbf8c5` release: v5.1.0
- `90252a6` docs(changelog): move bootstrap opt-in entry to [Unreleased]
- `b456198` feat(skill): add jaan-issue-report — report issues with session context awareness
- `d5bafcd` feat(bootstrap): make bootstrap opt-in per project with /jaan-to:jaan-init

**New skill: jaan-init**
- Replaces auto-run bootstrap with explicit initialization
- Creates jaan-to/ directory structure with seed files
- Handles already-initialized projects gracefully

**New skill: jaan-issue-report**
- Report bugs, feature requests, or skill issues to parhumm/jaan-to
- Session context scanning: auto-detects issues from conversation history
- Privacy sanitization: strips paths, tokens, personal info
- Local-only or direct GitHub submission via `gh` CLI
- Includes LEARN.md seed lessons

**Bootstrap change**
- Bootstrap script now opt-in per project
- Activated via `/jaan-to:jaan-init` instead of auto-running

---

## Skills to Test in Cycle 6

User-directed focus: "test other skills" — specifically untested and low-scoring skills with pre-v5 quality comparison.

| # | Skill | Status | Previous Score | Test Reason |
|---|-------|--------|----------------|-------------|
| 1 | `docs-update` | Untested | — | Never tested against any project |
| 2 | `docs-create` | Needs Retest | 2.0/5 (C1, v3.15.2) | Low score, compare v5.1.0 vs pre-v5 |
| 3 | `roadmap-update` | Untested | — | Never tested, compare with v5.1.0 baseline |
| 4 | `roadmap-add` | Needs Retest | 2.0/5 (C1, v3.15.2) | Low score, compare v5.1.0 vs pre-v5 |
| 5 | `learn-add` | Untested (formally) | — | Used every cycle but never scored |

## Deferred (per user direction)

| # | Skill | Reason |
|---|-------|--------|
| 1 | `jaan-init` | User requested skip |
| 2 | `jaan-issue-report` | User requested skip |

---

## Impact on Existing Artifacts

### v5.1.0 Changes
- No impact on existing outputs — new skills only
- Bootstrap behavior change does not affect already-initialized projects
- jaan-issue-report adds new output subdomain: `$JAAN_OUTPUTS_DIR/jaan-issues/`

---

## Cumulative Skill Coverage

| Status | Count | Skills |
|--------|-------|--------|
| Tested (C1-5) | 27 | pm-prd-write, pm-story-write, pm-research-about, frontend-design, frontend-task-breakdown, frontend-scaffold, backend-task-breakdown, backend-api-contract, backend-data-model, backend-scaffold, qa-test-cases, data-gtm-datalayer, ux-microcopy-write, ux-heatmap-analyze, ux-research-synthesize, ux-flowchart-generate, detect-dev, detect-design, detect-writing, detect-product, detect-ux, detect-pack, release-iterate-changelog, docs-create, roadmap-add, learn-report (local), gaps-critical-doc (local) |
| To Test (C6) | 3 | docs-update, roadmap-update, learn-add |
| To Retest (C6) | 2 | docs-create (2.0/5), roadmap-add (2.0/5) |
| Deferred (C6) | 2 | jaan-init (NEW), jaan-issue-report (NEW) |
| Not Relevant | 1 | wp-pr-review |
| Internal/Meta | 2 | skill-create, skill-update |
| **Total** | **33** | |

---

> Scan complete. v5.1.0 adds 2 new skills (jaan-init, jaan-issue-report) and makes bootstrap opt-in. Cycle 6 focuses on testing 5 untested/low-scoring skills with pre-v5 quality comparison. New skills deferred per user direction.
