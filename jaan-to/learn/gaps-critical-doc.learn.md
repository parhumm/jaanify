# Lessons: gaps-critical-doc

> Last updated: 2026-02-16

Accumulated lessons from past executions.

---

## Better Questions

- When all P0/P1 gaps are resolved, shift focus to asking "What would make this production-grade?" rather than "What blocks launch?"

## Edge Cases

- **Post-launch audits generate new gaps**: detect-dev findings from post-launch audits (e.g., continue-on-error patterns, unpinned dependencies) create P3 gaps that weren't visible pre-launch. Include these even though they're not blockers.
- **Deferred gaps persist across cycles**: L-06 (monetization) and L-07 (i18n) have been open since Cycle 5. Don't re-analyze them each cycle — note them as "deferred by user directive" and move on.

## Workflow

- **2026-02-16 (Cycle 11)**: When previous cycle resolved all P0/P1 gaps, the report shifts from "what blocks launch" to "what improves quality." Frame the executive summary accordingly — celebrate the launch milestone, then list P3 improvements.
- **2026-02-16 (Cycle 11)**: Count resolved gaps from v6.3.0 skill improvements separately from gaps resolved by manual work — this shows the co-evolution loop value.

## Common Mistakes

- Don't re-file skill improvement issues that were already addressed in the latest jaan-to version. Check the changelog/release notes first.
