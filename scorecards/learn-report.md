# Scorecard: `/jaan-to:learn-report`

> jaan-to Version: v3.19.0 | Cycle: 3 | Date: 2026-02-08

---

## Overview

| Attribute | Value |
|-----------|-------|
| Type | Command (bash script), not a skill directory |
| Script | `scripts/learning-summary.sh` |
| Input | Learn directory (`jaan-to/learn/`) |
| Output formats | Markdown, JSON |
| Dependencies | Bash 4+ (associative arrays) |

---

## Execution Result

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Invocable** | 1/5 | Script fails on macOS (Bash 3.2) — `declare -A: invalid option` |
| **Output quality** | N/A | Could not run; manual analysis performed |
| **Usefulness** | 4/5 | The report concept is excellent — coverage gaps, top skills, structured insights |
| **Context awareness** | 3/5 | Uses config-loader.sh for path resolution; does not read product context |
| **Learning integration** | 2/5 | Reads learn files but cannot capture feedback (it IS the learn system) |

---

## Issues Found

### Critical: Bash 4+ Dependency
- `declare -A` requires Bash 4+ for associative arrays
- macOS ships Bash 3.2.57 (GPLv2 — Apple won't ship GPLv3 bash)
- No version check or fallback in the script
- **Impact**: Cannot run on stock macOS without `brew install bash`

### Minor: Env Var Requirements
- Requires `CLAUDE_PLUGIN_ROOT` and `CLAUDE_PROJECT_DIR` to be set
- These are normally set by the plugin hook system, not available in manual invocation
- Script errors with `unbound variable` without them

### Observation: Legacy File Handling
- Script counts legacy (`jaan-to-*`) and new files separately
- This inflates totals (40 files reported vs 21 unique skills)
- Should either deduplicate or report unique skill count

---

## Score

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Functionality | 30% | 1/5 | 0.30 |
| Output Quality | 25% | 3/5 | 0.75 |
| Usefulness (concept) | 20% | 4/5 | 0.80 |
| Reliability | 15% | 1/5 | 0.15 |
| Documentation | 10% | 3/5 | 0.30 |

**Overall**: 2.3/5.0

---

## Recommendations

1. **Fix Bash compatibility**: Replace `declare -A` with portable POSIX constructs (e.g., temp files or `awk` for key-value tracking)
2. **Add version check**: `if [[ ${BASH_VERSINFO[0]} -lt 4 ]]; then echo "Requires Bash 4+"; exit 1; fi`
3. **Deduplicate legacy files**: Detect `jaan-to-*` / `to-jaan-*` prefixed files and report unique skills only
4. **Document env requirements**: Note that manual invocation needs `CLAUDE_PLUGIN_ROOT` and `CLAUDE_PROJECT_DIR`
