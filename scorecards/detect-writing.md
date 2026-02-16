# Scorecard: detect-writing

> Tested: 2026-02-16 | jaan-to v7.0.0 (SHA: c49ee8f) | Cycle 12
> Skill version: v3.23.0 (introduced), v7.0.0 (reference extraction to detect-shared-reference.md)
> Mode: Light
> Previous: v5.0.0, Cycle 5, Score 4.2/5.0

---

## Score: 4.5 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 5/5 | Full string inventory (~120 strings, 11 categories), NNg 4-dimension tone analysis, i18n maturity Level 0. Component-level string map with counts. |
| Output Quality | 25% | 5/5 | SARIF evidence blocks on all 5 findings. Paired evidence on E-WRT-WEB-002 (3 locations). Correct E-WRT-{PLATFORM}-NNN IDs. Platform split (api + web). |
| Context Awareness | 20% | 4/5 | Cross-referenced microcopy specs with inline strings. Identified hardcoded "en-US" locale. Noted RFC 9457 as positive signal for API. Previous run comparison table included. |
| Learning Integration | 15% | 4/5 | LEARN.md loaded (existed from C5). Pre-execution protocol loaded from v7.0.0 path. detect-shared-reference.md loaded successfully. |
| Workflow Efficiency | 10% | 4/5 | Parallel execution with detect-ux. Platform split handled correctly. NNg tone analysis now included in light mode (was missing in C5). |

---

## Strengths

1. NNg 4-dimension tone analysis now included — was flagged as missing in C5 light mode, now present with detailed evidence
2. Component-level string map with per-component counts — much more granular than C5's approximate count
3. String count improved from ~55 (C5) to ~120 — reflects codebase growth AND better detection coverage
4. Platform split correctly produces separate api/web summaries
5. Previous run comparison table explicitly tracks delta from last detection

## Issues

1. No glossary or string key suggestions — would help with future i18n extraction
2. Light mode still skips reading-level analysis — noted in upsell but could be useful even in light mode

## Regression Assessment (v7.0.0 Token Optimization)

| Metric | C5 (v5.0.0) | C12 (v7.0.0) | Delta |
|--------|-------------|--------------|-------|
| Score | 4.2 | 4.5 | +0.3 |
| Findings | 5 | 5 | 0 |
| Evidence format | SARIF | SARIF | Same |
| Platform handling | Combined | Split (api + web) | Improved |
| Tone analysis | Not included | Full NNg 4-dimension | Added |
| Reference loading | Pre-execution protocol | detect-shared-reference.md | Verified |

**Score delta**: +0.3 (within PASS threshold of +/-0.3)
**Verdict**: **PASS** — v7.0.0 token optimization did NOT degrade detect-writing output quality. Output improved due to NNg tone analysis and platform split.
