# Scorecard: docs-create

> Tested: 2026-02-10 | jaan-to v5.1.0 (SHA: fdbd3ac) | Cycle 6
> Skill version: v5.1.0
> Previous score: 4.2/5 (Cycle 1, v3.15.2 — scorecard authoritative, not launch-gaps 2.0/5)

---

## Score: 4.3 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4/5 | 12-step workflow with smart type detection, duplicate checking, STYLE.md validation, README index updates. `disable-model-invocation` means manual execution only. |
| Output Quality | 25% | 5/5 | Generated concept doc follows template precisely: YAML frontmatter, H1/tagline/separators, content from PRD and tech.md. Under line limit. |
| Context Awareness | 20% | 4/5 | Templates reference project context. Smart type detection probes ambiguity. Relies on executor for content gathering (Step 5). |
| Learning Integration | 15% | 4/5 | LEARN.md framework with pre-execution loading. Template file exists at project level. Plugin-side LEARN.md available. |
| Workflow Efficiency | 10% | 4/5 | Smart type detection avoids unnecessary questions. 6 doc types with clear output path mapping. README auto-update in Step 10.5 is good. |

---

## Strengths

1. Comprehensive template system covering 6 doc types (skill, hook, config, guide, concept, index)
2. Smart type detection with disambiguation questions — doesn't just ask "what type?" but probes the uncertainty
3. STYLE.md validation before writing ensures consistent quality
4. README index auto-update (Step 10.5) keeps navigation in sync — this was missing in v3.15.2
5. Duplicate detection before creation prevents redundant docs
6. YAML frontmatter with `related:` field enables cross-linking

## Issues

1. `disable-model-invocation: true` prevents autonomous execution — user must manually follow all 12 steps
2. Output path `docs/{name}.md` assumes a project-level `docs/` directory. If project has no docs, the skill creates the directory but doesn't scaffold an index.
3. No auto-discovery of project content for filling template — Step 5 "Gather Content" relies entirely on executor knowledge

## Gaps Discovered

- **G-01**: The skill generates single docs well but can't scaffold an entire documentation structure (e.g., "create docs for this project" → generate index + key concept docs + API docs all at once)
- **G-02**: The `disable-model-invocation` flag means only the host agent (Claude) can execute it, not as an autonomous sub-skill

## Pre-v5 Comparison

| Dimension | v3.15.2 (C1) | v5.1.0 (C6) | Delta |
|-----------|-------------|-------------|-------|
| Overall Score | 4.2/5 | 4.3/5 | +0.1 |
| Template Quality | Good | Better (6 types, detailed placeholders) | Improved |
| README Index Updates | Not present | Step 10.5 adds auto-update | New feature |
| STYLE.md Integration | Present | Present with validation step | Same |
| Smart Type Detection | Basic | Enhanced with disambiguation | Improved |
| Learning Integration | Empty learn file | Framework with pre-execution protocol | Improved |

**NOTE**: The launch-gaps.md listed docs-create at 2.0/5 — this was incorrect. The authoritative scorecard (to-jaan-docs-create.md) shows 4.2/5. The discrepancy should be corrected in future gap reports.

## History

| Cycle | jaan-to Ver | Score | Notes |
|-------|-------------|-------|-------|
| 1 | v3.15.2 | 4.2/5 | Clean execution, good output |
| 6 | v5.1.0 | 4.3/5 | Retest: slight improvement, README auto-update is new, templates more detailed |
