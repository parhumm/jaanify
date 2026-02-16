# Scorecard: detect-product

> Tested: 2026-02-16 | jaan-to v7.0.0 (SHA: 8ee24f7d) | Cycle 12
> Skill version: v7.0.0 (reference extraction: detect-shared-reference.md, -98 lines)
> Mode: Light
> Previous: 4.5/5 (Cycle 5, v5.0.0)

---

## Score: 4.5 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 5/5 | Identified 18 API endpoints, 4 web pages, 7 product features, AI integration, zero monetization. Multi-platform detection correct. |
| Output Quality | 25% | 5/5 | SARIF evidence blocks, correct E-PRD-{PLATFORM}-NNN IDs, related_evidence cross-platform linking, 3-layer confidence model. |
| Context Awareness | 20% | 4/5 | Correctly identified monorepo with API + Web. Cross-referenced OpenAI integration across platforms. Monetization absence flagged as Critical. |
| Learning Integration | 15% | 4/5 | LEARN.md loaded and applied (SaaS vs open-source distinction, feature flag ambiguity checks). Reference doc loaded correctly. |
| Workflow Efficiency | 10% | 4/5 | Efficient light mode. Per-platform summaries provide clear product surface area. |

---

## Strengths

1. Multi-platform output (api + web) with cross-platform feature linking via `related_evidence` — improvement over C5
2. AI integration correctly identified as core differentiator with graceful degradation noted
3. Guest session feature identified as potential conversion funnel — product-aware analysis
4. Security stack inventory provides useful context for product maturity assessment
5. LEARN.md lessons applied: didn't flag absent feature flags as a problem, didn't treat env var presence as analytics proof

## Issues

1. Web feature confidence all at Tentative despite having component-level evidence — could be Firm for features with both route + component evidence
2. Landing page assessment could be deeper — component exists with real content but marked as "minimal"

## Gaps Discovered

- Monetization and analytics gaps remain from C5 — no change (P2, deferred by user)

## v7.0.0 Regression Assessment

- **Reference extraction**: `detect-shared-reference.md` (188 lines) extracted from SKILL.md. Skill loaded reference correctly — evidence format, confidence levels, and ID generation all followed the reference spec.
- **Lines removed from SKILL.md**: -98 (evidence format tables, confidence definitions, frontmatter schema)
- **Quality delta**: 0.0 (4.5 → 4.5). Identical quality maintained despite token optimization.
- **Regression verdict**: **PASS** — No quality degradation detected. Reference extraction did not affect output quality.
