# Scorecard: roadmap-add

> Tested: 2026-02-10 | jaan-to v5.1.0 (SHA: fdbd3ac) | Cycle 6
> Skill version: v5.1.0
> Previous score: 3.6/5 (Cycle 1, v3.15.2 — scorecard authoritative, not launch-gaps 2.0/5)
> Note: [Internal] skill — designed for jaan-to's roadmap, tested against Jaanify's project roadmap

---

## Score: 3.0 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 3/5 | 8-step workflow with duplication check and phase detection. **Critical bug**: allowed-tools don't include `Edit(jaan-to/roadmap.md)` — Step 6 "Write to Roadmap" would be blocked by tool permissions. Only `Write($JAAN_OUTPUTS_DIR/**)` and `Edit(jaan-to/config/settings.yaml)` are permitted. |
| Output Quality | 25% | 3/5 | Simple task format `- [ ] {task}` with optional detail doc link. Adequate for single additions but Cycle 1 noted awkward bulk usage. No template file (noted as ad-hoc in C1). |
| Context Awareness | 20% | 3/5 | Reads roadmap and checks for duplicates. Phase detection uses keyword matching. Phase table (1-8) is jaan-to-specific — doesn't match Jaanify's 6-phase structure. |
| Learning Integration | 15% | 3/5 | Has LEARN.md pre-execution framework. No project-side lessons accumulated. |
| Workflow Efficiency | 10% | 3/5 | Simple and direct. Duplication check is good. No bulk mode. Auto-commit with git. |

---

## Strengths

1. Duplication check before adding prevents redundant tasks
2. Phase detection with keyword matching suggests appropriate section
3. Optional detail doc creation (`tasks/{slug}.md`) for complex tasks
4. HARD STOP before writing ensures user control
5. Auto-commit with descriptive message

## Issues

1. **Permission bug**: `allowed-tools` doesn't include `Edit(jaan-to/roadmap.md)` — the skill can analyze but likely cannot write to the roadmap file. The `Write` permission only covers `$JAAN_OUTPUTS_DIR/**`, and `Edit` only covers `settings.yaml`.
2. **No bulk mode**: Cycle 1 feedback requested bulk task addition — still not implemented in v5.1.0
3. **Phase table mismatch**: Hardcoded 8-phase table matches jaan-to's internal roadmap, not consumer project structures
4. **Stale skill design**: Skill references `jaan-to/roadmap.md` path but roadmap-update references `docs/roadmap/roadmap.md` — inconsistent between the two roadmap skills

## Gaps Discovered

- **G-01 (Permission bug)**: allowed-tools should include `Edit(jaan-to/roadmap.md)` to allow the skill to actually write to the roadmap file
- **G-02 (No bulk mode)**: Feedback from Cycle 1 not addressed after 5 cycles
- **G-03 (Phase table)**: Phase detection should adapt to the project's actual roadmap structure rather than using a hardcoded jaan-to-specific table

## Pre-v5 Comparison

| Dimension | v3.15.2 (C1) | v5.1.0 (C6) | Delta |
|-----------|-------------|-------------|-------|
| Overall Score | 3.6/5 | 3.0/5 | **-0.6** |
| Output Quality | Good for single tasks | Same — no improvement | Same |
| Bulk Mode | Missing (requested) | Still missing | No change |
| Phase Detection | Worked with 8-phase table | Same table, doesn't match 6-phase project | Same |
| Permissions | Worked (v3 enforcement may have been looser) | allowed-tools likely blocks write | **Regression** |
| Learning Integration | Empty LEARN.md | Pre-execution framework added | Improved |

**Regression**: The overall score decreased from 3.6 to 3.0, primarily due to the allowed-tools permission issue identified in v5.1.0. The v5.0.0 tightening of tool permissions may have broken this skill's write capability without updating its permission list. Cycle 1 feedback (bulk mode, phase summary) remains unaddressed.

## History

| Cycle | jaan-to Ver | Score | Notes |
|-------|-------------|-------|-------|
| 1 | v3.15.2 | 3.6/5 | Functional but limited for bulk operations |
| 6 | v5.1.0 | 3.0/5 | Retest: permission bug likely blocks writes, Cycle 1 feedback unaddressed |
