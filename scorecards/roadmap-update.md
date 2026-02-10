# Scorecard: roadmap-update

> Tested: 2026-02-10 | jaan-to v5.1.0 (SHA: fdbd3ac) | Cycle 6
> Skill version: v5.1.0
> Previous score: N/A (first test)
> Note: [Internal] skill — operates on jaan-to's own roadmap, not consumer projects

---

## Score: 4.1 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4/5 | 5 modes (smart-default, mark, release, sync, validate). Smart-default correctly identified: stale "Latest: v5.0.0" header, missing v5.1.0 version section, untracked `jaan-init` task. Release mode has atomic operations (CHANGELOG + roadmap + plugin.json + marketplace.json + tag + push). Write phase untestable (read-only submodule). |
| Output Quality | 25% | 4/5 | Sync report template is well-structured with tables for unrecorded work, orphan commits, stale tasks, overview accuracy. Keep a Changelog format for releases. |
| Context Awareness | 20% | 5/5 | Cross-references git history (tags, commits) with roadmap entries using keyword extraction + fuzzy matching. Reads 4 source files (roadmap, CHANGELOG, plugin.json, marketplace.json). Detects branch for release flow (main vs feature). |
| Learning Integration | 15% | 3/5 | Has LEARN.md pre-execution framework. No project-side lessons. `ultrathink` reasoning mode for complex fuzzy matching. |
| Workflow Efficiency | 10% | 4/5 | Smart-default avoids manual scanning. Release mode handles full atomic workflow. Post-update Step 8 checks if release is warranted — prevents forgotten releases. |

---

## Strengths

1. **5 operational modes** covering different maintenance needs — from quick mark-done to full atomic release
2. **Git-aware analysis** — commit-to-task cross-referencing catches stale/orphan items
3. **Atomic release** — CHANGELOG + roadmap + plugin.json + marketplace.json + tag + push in one workflow, with branch-aware merge flow
4. **Post-update release check** (Step 8) — detects accumulated work that warrants a release
5. **Fuzzy task matching** — keyword extraction for matching commits to roadmap tasks, not just exact string match
6. **Overview table accuracy check** — verifies phase status claims against actual task completion

## Issues

1. **Read-only submodule limitation** — When used from a consumer project (Jaanify), the jaan-to submodule is read-only. The skill can analyze but not write. Untestable write phase.
2. **[Internal] designation** — Skill description explicitly marks it as internal. Consumer projects have no roadmap to maintain via this skill.
3. **No Jaanify-specific value** — This skill maintains jaan-to's own roadmap. Jaanify needs its own roadmap management, which this skill doesn't provide.

## Gaps Discovered

- **G-01**: Consumer projects like Jaanify need their own roadmap skill. roadmap-update only operates on jaan-to's plugin roadmap structure.
- **G-02**: The skill could support a `--repo` flag to operate on any git repo's roadmap, not just the local project.

## Analysis Findings (smart-default mode)

The analysis phase correctly identified:

| Finding | Type | Detail |
|---------|------|--------|
| Stale version header | Unrecorded | Roadmap shows "Latest: v5.0.0" but v5.1.0 is released |
| Missing v5.1.0 section | Unrecorded | No version section for v5.1.0 in roadmap |
| `jaan-init` not tracked | Orphan | Commit `d5bafcd` has no matching roadmap task |
| `jaan-issue-report` tracked | OK | Marked done in roadmap, matches commits |
| Overview table | OK | Phase 6 "In Progress" is accurate |

## Pre-v5 Comparison

No previous score — this is the first test of roadmap-update. The skill was classified as "Internal/Meta" in all previous cycles and never tested against Jaanify.

## History

| Cycle | jaan-to Ver | Score | Notes |
|-------|-------------|-------|-------|
| 6 | v5.1.0 | 4.1/5 | First test, analysis phase only (submodule read-only) |
