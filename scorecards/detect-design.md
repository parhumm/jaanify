# Scorecard: detect-design

> Tested: 2026-02-16 | jaan-to v7.0.0 (SHA: 8ee24f7d) | Cycle 12
> Skill version: v7.0.0 (reference extraction: detect-shared-reference.md, -100 lines)
> Mode: Light
> Previous: 4.3/5 (Cycle 5, v5.0.0)

---

## Score: 4.5 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 5/5 | Detected all token categories, component inventory, dark mode, drift signals. Multi-platform detection worked correctly. |
| Output Quality | 25% | 5/5 | SARIF evidence blocks, correct E-DSN-{PLATFORM}-NNN IDs, paired drift evidence, YAML frontmatter. |
| Context Awareness | 20% | 4/5 | Correctly identified monorepo with api (no UI) and web (UI) platforms. Adapted to TailwindCSS v4 @theme syntax. |
| Learning Integration | 15% | 4/5 | LEARN.md loaded and applied (Tailwind edge case, vendor exclusion). Reference doc loaded correctly from extracted path. |
| Workflow Efficiency | 10% | 4/5 | Light mode produced single summary per platform. HARD STOP presented cleanly. |

---

## Strengths

1. Multi-platform detection correctly identified api (Not Applicable) and web (UI present) — improved from C5 which was single-platform
2. TailwindCSS v4 `@theme` syntax correctly parsed — all 25 tokens extracted across 5 categories
3. Zero arbitrary values detected — correctly reported as a positive finding (E-DSN-WEB-005)
4. Dark mode analysis comprehensive — detected `next-themes` ThemeProvider + `@theme dark` overrides
5. Token coverage gap analysis identified missing breakpoints, z-index, and animation timing tokens
6. LEARN.md lessons applied: checked Tailwind config first, excluded vendor CSS, scoped a11y claims

## Issues

1. Did not explicitly verify that `detect-shared-reference.md` was loaded (no log message) — reference loading is implicit
2. Component variant analysis could be deeper (only Button variants noted, others have variants too)
3. No cross-reference to existing detect-design outputs from C5 for delta comparison

## Gaps Discovered

- None new — findings align with existing gaps (no Storybook, incomplete typography scale)

## v7.0.0 Regression Assessment

- **Reference extraction**: `detect-shared-reference.md` (188 lines) extracted from SKILL.md. Skill loaded reference correctly — all evidence format, confidence levels, and ID generation followed the reference spec.
- **Lines removed from SKILL.md**: -100 (mostly evidence format tables, confidence level definitions, frontmatter schema)
- **Quality delta**: +0.2 (4.3 → 4.5). Improvement attributed to better project state (real code vs scaffold) and multi-platform detection maturity, NOT token optimization.
- **Regression verdict**: **PASS** — No quality degradation detected. Reference extraction did not affect output quality.
