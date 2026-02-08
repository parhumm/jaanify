# Learning Insights Report — Cycle 3

> **Executive Summary**: 40 learn files across 21 unique skills contain 222 total lessons. The richest learning is in pm-story-write (68 guidelines), qa-test-cases (61), and ux-research-synthesize (43). Seven skills have empty Common Mistakes and Edge Cases sections. 19 legacy files (jaan-to-/to-jaan- prefixed) are exact duplicates of new files and can be cleaned up.

**Generated**: 2026-02-08
**jaan-to Version**: v3.19.0
**Method**: Manual analysis (learning-summary.sh requires Bash 4+ for associative arrays; macOS ships Bash 3.2)

---

## Summary

| Metric | Value |
|--------|-------|
| Total Learn Files | 40 (20 unique + 20 legacy duplicates) |
| Unique Skills with Lessons | 21 |
| Total Lessons (## sections) | 222 |
| Skills with Common Mistakes | 13 |
| Skills with Edge Cases | 13 |
| Skills Missing Both | 7 |

---

## Lessons by Skill (Unique Only, Sorted by Learning Depth)

| Skill | Lessons | Common Mistakes | Edge Cases | Total Guidelines |
|-------|---------|-----------------|------------|------------------|
| `pm-story-write` | 6 | 27 | 41 | 68 |
| `qa-test-cases` | 6 | 24 | 37 | 61 |
| `ux-research-synthesize` | 6 | 18 | 25 | 43 |
| `dev-be-task-breakdown` | 6 | 16 | 8 | 24 |
| `dev-fe-design` | 6 | 8 | 4 | 12 |
| `dev-be-data-model` | 6 | 8 | 7 | 15 |
| `dev-api-contract` | 6 | 7 | 5 | 12 |
| `dev-fe-task-breakdown` | 6 | 8 | 8 | 16 |
| `ux-heatmap-analyze` | 6 | 8 | 7 | 15 |
| `dev-stack-detect` | 6 | 10 | 7 | 17 |
| `ux-microcopy-write` | 5 | 8 | 7 | 15 |
| `roadmap-update` | 6 | 6 | 4 | 10 |
| `data-gtm-datalayer` | 6 | 4 | 3 | 7 |
| `pm-prd-write` | 6 | 3 | 4 | 7 |
| `skill-create` | 6 | 0 | 0 | 0 |
| `skill-update` | 6 | 0 | 0 | 0 |
| `pm-research-about` | 6 | 0 | 0 | 0 |
| `docs-create` | 6 | 0 | 0 | 0 |
| `docs-update` | 6 | 0 | 0 | 0 |
| `learn-add` | 1 | 0 | 0 | 0 |
| `roadmap-add` | 1 | 0 | 0 | 0 |

---

## Top Skills by Learning Activity

1. **`pm-story-write`** — 68 guidelines (27 mistakes + 41 edge cases)
2. **`qa-test-cases`** — 61 guidelines (24 mistakes + 37 edge cases)
3. **`ux-research-synthesize`** — 43 guidelines (18 mistakes + 25 edge cases)
4. **`dev-be-task-breakdown`** — 24 guidelines (16 mistakes + 8 edge cases)
5. **`dev-stack-detect`** — 17 guidelines (10 mistakes + 7 edge cases)

---

## Coverage Gaps

Skills missing structured insights (no Common Mistakes or Edge Cases):

- `skill-create` — Missing: Common Mistakes, Edge Cases (sections exist but empty)
- `skill-update` — Missing: Common Mistakes, Edge Cases (sections exist but empty)
- `pm-research-about` — Missing: Common Mistakes, Edge Cases (sections exist but empty)
- `docs-create` — Missing: Common Mistakes, Edge Cases (sections exist but empty)
- `docs-update` — Missing: Common Mistakes, Edge Cases (sections exist but empty)
- `learn-add` — Stub file (1 lesson only, no subsections)
- `roadmap-add` — Stub file (1 lesson only, no subsections)

---

## Legacy File Duplication

19 legacy files with `jaan-to-` or `to-jaan-` prefixes are exact duplicates of their clean-named counterparts. These date from the v3.16.2 naming migration and can be safely removed.

**Affected pairs**: All 19 renamed skills have both old and new learn files present.

---

## Script Compatibility Issue

`learning-summary.sh` uses Bash 4+ associative arrays (`declare -A`) but macOS ships with Bash 3.2 (GPLv2). The script fails on stock macOS without `brew install bash`.

**Recommendation**: Replace associative arrays with portable POSIX constructs, or add a Bash version check with a clear error message.

---

## Metadata

| Field | Value |
|-------|-------|
| Skill | `/jaan-to:learn-report` |
| jaan-to Version | v3.19.0 |
| Date | 2026-02-08 |
| Status | Complete |
