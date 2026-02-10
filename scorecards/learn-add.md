# Scorecard: learn-add

> Tested: 2026-02-10 | jaan-to v5.1.0 (SHA: fdbd3ac) | Cycle 6
> Skill version: v5.1.0
> Previous score: N/A (used in all 5 cycles but never formally scored)

---

## Score: 4.0 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4/5 | 7-step workflow: parse input, route to correct file, auto-categorize, preview, write, confirm, commit. Supports skill, template, and context targets. `disable-model-invocation` requires manual execution. |
| Output Quality | 25% | 4/5 | Lessons appended to correct category with consistent formatting. Template creates well-structured LEARN.md with 4 categories. Updates "Last updated" date. |
| Context Awareness | 20% | 4/5 | Auto-categorizes lessons using keyword detection (ask→Questions, avoid→Mistakes, workflow→Workflow, edge→Edge Cases). Routes to correct LEARN.md based on target type. |
| Learning Integration | 15% | 4/5 | This IS the learning system. Well-designed 4-category structure (Better Questions, Edge Cases, Workflow, Common Mistakes) aligns with how skills consume lessons in Pre-Execution. |
| Workflow Efficiency | 10% | 4/5 | Quick add workflow. Git commit integration. Target routing handles skill/template/context distinctions. |

---

## Strengths

1. **Core learning infrastructure** — This skill is the foundation of jaan-to's learning system. Every other skill reads from LEARN.md files that learn-add writes.
2. **Smart routing** — Routes feedback to the correct file based on target type (skill, template, or context)
3. **4-category structure** — Better Questions, Edge Cases, Workflow, Common Mistakes are well-chosen categories that match how skills consume lessons
4. **Auto-categorization** — Keyword detection reduces user effort in classifying lessons
5. **HARD STOP** preview shows exactly what will be added and where
6. **Git commit integration** — Offers to commit immediately after writing

## Issues

1. **Permission concern**: `allowed-tools` includes `Write($JAAN_OUTPUTS_DIR/**)` but LEARN files are at `$JAAN_LEARN_DIR/` (separate from outputs). If permissions are strictly enforced, the skill might not be able to write to its target files. In practice, the skill has been used successfully across 5 cycles, so enforcement may be lenient or the path resolution may differ.
2. **Single lesson per invocation**: No batch mode for adding multiple lessons at once
3. **No deduplication check**: Doesn't check if a similar lesson already exists in the LEARN.md before adding
4. **No lesson validation**: Doesn't verify that the lesson is actionable or specific enough

## Gaps Discovered

- **G-01**: Permission alignment — `allowed-tools` should explicitly include `Write($JAAN_LEARN_DIR/**)` or `Edit($JAAN_LEARN_DIR/**)` for clarity
- **G-02**: Deduplication — should check for similar existing lessons before appending (keyword overlap detection)
- **G-03**: Batch mode — "add 3 lessons for pm-prd-write" would be more efficient than 3 separate invocations

## Pre-v5 Comparison

No previous formal score. The skill has been used throughout Cycles 1-5 with consistent functionality. The v5.0.0 changes added language protocol and pre-execution protocol references but didn't change core behavior.

## Usage History (Informal)

| Cycle | Usage | Notes |
|-------|-------|-------|
| 1-5 | Used in every cycle | Feedback submitted for 10+ skills |
| 6 | First formal scorecard | Added 2 lessons to backend-scaffold |

## History

| Cycle | jaan-to Ver | Score | Notes |
|-------|-------------|-------|-------|
| 6 | v5.1.0 | 4.0/5 | First formal test. Core learning infrastructure, works reliably. |
