# Scorecard: ux-flowchart-generate

> Tested: 2026-02-16 | jaan-to v7.0.0 | Cycle 12
> Skill version: v3.23.0 (introduced), v5.0.0 (boilerplate extraction), v7.0.0 (reference material extraction)
> Regression test against baseline: Cycle 5, v5.0.0, score 4.1/5

---

## Score: 4.6 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4.5/5 | Generated 4 diagrams (1 overview + 3 detail) from PRD. All 7 user stories covered including US-07 Focus Mode (was gap in C5). GitHub OAuth added (was missing in C5). 43 nodes, 52 edges. |
| Output Quality | 25% | 5/5 | All 17 quality gates passed. Proper node shapes, semantic IDs, labeled edges, classDef styles. Evidence map with 43 rows. Template resolved from project copy (Step B). |
| Context Awareness | 20% | 4.5/5 | Referenced tech stack (Fastify < 100ms, WebSocket < 500ms, OpenAI < 3s, Web Speech API, LCP < 2s) in node labels. Correctly identified PRD-only confidence as Medium. tech.md loaded. |
| Learning Integration | 15% | 4.5/5 | LEARN.md loaded from project path (ux-flowchart-generate.learn.md, 171 lines). Applied lessons: semantic IDs, error paths for async ops, auto-split at >25 nodes. Reference material (ux-flowchart-reference.md) loaded. |
| Workflow Efficiency | 10% | 4/5 | PRD-only mode straightforward. v7 reference extraction reduces SKILL.md by 114 lines. All external references resolved correctly. HARD STOP summary presented. |

---

## Regression Assessment: Cycle 5 (v5.0.0) vs Cycle 12 (v7.0.0)

| Dimension | C5 Score | C12 Score | Delta | Assessment |
|-----------|----------|-----------|-------|------------|
| Functionality | 4.0 | 4.5 | +0.5 | IMPROVED: US-07 Focus Mode now included in Detail 3. GitHub OAuth added to onboarding. |
| Output Quality | 5.0 | 5.0 | 0.0 | STABLE: All 17 gates pass. Evidence map coverage maintained at 100%. |
| Context Awareness | 4.0 | 4.5 | +0.5 | IMPROVED: Additional tech constraints referenced (LCP < 2s, Web Speech API). |
| Learning Integration | 4.0 | 4.5 | +0.5 | IMPROVED: LEARN.md now exists and was applied. Reference material loaded from ux-flowchart-reference.md. |
| Workflow Efficiency | 3.0 | 4.0 | +1.0 | IMPROVED: Fewer intermediate steps. Reference extraction means faster convention lookup. |
| **Weighted Total** | **4.1** | **4.6** | **+0.5** | **IMPROVED** |

**Delta: +0.5 (exceeds +/-0.3 threshold -- marked as IMPROVED, not regression)**

---

## Strengths

1. All 7 user stories represented in diagrams (US-07 Focus Mode integrated into Detail 3)
2. GitHub OAuth included as secondary auth provider (was gap in C5 output)
3. Correct splitting at 43 nodes -- overview + 3 detail diagrams, max 19 per diagram
4. All edges labeled -- no unlabeled edges in any of the 4 diagrams
5. Error paths included for every async operation (AI parse, plan gen, voice transcribe, WebSocket sync)
6. Evidence map is complete -- 43/43 nodes with PRD references
7. Unknowns table identifies 7 concrete gaps (up from 5 in C5, more thorough)
8. Reference material (ux-flowchart-reference.md) loaded and applied -- node shapes, edge conventions, quality gates all sourced from reference

## Issues

1. All nodes are Medium confidence (expected for PRD-only) -- mixed mode with code would upgrade many to High
2. Focus Mode transition logic between full list and single-task view remains underspecified (Unknown U5)
3. Visual timeline component for time blindness (US-07 AC2) not represented as a flow node -- only noted as Unknown U6
4. Nudge notification node (`step_nudge`) has only one inbound edge from nowhere explicit -- could be clarified as system-triggered

## Issues Resolved from C5

1. US-07 (Accessibility/Focus Mode) now represented as `dec_focus_mode` and `step_focus_single` nodes in Detail 3
2. GitHub OAuth now included as `step_github_oauth` in onboarding flow
3. Guest-to-account migration documented as Unknown U3 (was only in Gaps section before)

## Gaps Discovered

- Visual timeline component (US-07 AC2) needs its own interaction flow
- High-contrast mode toggle (US-07 AC4) not represented in any diagram
- Voice command vocabulary ("Save"/"Done") needs definition (Unknown U4, carried from C5)

---

## v7.0.0 Token Optimization Assessment

- **Reference extraction**: 114 lines removed from SKILL.md. Moved to `ux-flowchart-reference.md`.
- **Reference loading**: CONFIRMED -- ux-flowchart-reference.md was loaded during execution. Node shapes, edge conventions, quality gates, confidence scoring, and GitHub rendering constraints all sourced from reference file.
- **Sections moved to reference**:
  - Node Shapes (strict mapping table)
  - Node ID Conventions
  - Edge Conventions table
  - Style Definitions (classDef declarations)
  - Quality Gate Checklist (17 hard-fail, 2 warn, 5 human-review)
  - Confidence Scoring (4 levels with criteria)
  - GitHub Rendering Constraints
- **Quality impact**: No degradation detected. All 17 quality gates passed. Evidence map coverage at 100%. Node/edge conventions correctly applied.
- **Conclusion**: v7.0.0 token optimization did NOT degrade ux-flowchart-generate output quality. Score improved from 4.1 to 4.6 due to better coverage (US-07, GitHub OAuth) and LEARN.md integration.

---

## Test Artifacts

| Artifact | Path |
|----------|------|
| Flowchart output | `jaan-to/outputs/ux/diagrams/03-jaanify-mvp-userflows-v7/03-flowchart-jaanify-mvp-userflows-v7.md` |
| Evidence map | `jaan-to/outputs/ux/diagrams/03-jaanify-mvp-userflows-v7/03-evidence-map-jaanify-mvp-userflows-v7.md` |
| C5 baseline | `jaan-to/outputs/ux/diagrams/01-jaanify-mvp-userflows/01-flowchart-jaanify-mvp-userflows.md` |
| PRD input | `jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md` |
| Reference material | `vendor/jaan-to/docs/extending/ux-flowchart-reference.md` |
| LEARN.md | `jaan-to/learn/ux-flowchart-generate.learn.md` |
