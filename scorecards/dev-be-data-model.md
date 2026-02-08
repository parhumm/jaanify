# Scorecard: `/jaan-to:dev-be-data-model`

> jaan-to Version: v3.19.0 | Cycle: 3 | Date: 2026-02-08

---

## Overview

| Attribute | Value |
|-----------|-------|
| Type | Skill (skills/dev-be-data-model/) |
| SKILL.md size | 571 lines |
| Input used | Entity list (7 entities from existing backend task breakdown) |
| Output | `jaan-to/outputs/dev/backend/02-jaanify-data-model/02-data-model-jaanify-data-model.md` |
| Context files read | tech.md (PostgreSQL 16, Prisma v6), config.md, learn.md |

---

## Execution Result

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Invocable** | 5/5 | Skill loaded and executed without errors |
| **Context awareness** | 5/5 | Read tech.md → correctly used PostgreSQL 16, TIMESTAMPTZ, gen_random_uuid(), Prisma v6 |
| **Learning integration** | 5/5 | Applied learn.md: CHECK on VARCHAR (not ENUM), partial indexes for soft deletes, ESR ordering, FK indexes |
| **Output quality** | 5/5 | Full ER diagram, 7 table definitions with DDL, index strategy, migration playbook, GDPR compliance |
| **Workflow** | 4/5 | Clear 2-phase workflow with HARD STOP; minor: 6 AskUserQuestion calls could be fewer when tech.md provides answers |
| **Template adherence** | 5/5 | Output follows template structure exactly |

---

## Strengths

1. **Rich learn.md integration** — Applied every lesson: CHECK on VARCHAR, ESR composite ordering, partial indexes, FK indexes, no SERIAL keyword
2. **GDPR section** — Unprompted but correct: grace period → anonymize audit → hard delete chain
3. **Quality scorecard** — Self-assessment with 5 weighted dimensions; gives reviewers a quick health check
4. **Mermaid ER diagram** — Visual-first approach (as recommended in learn.md workflow)
5. **Migration playbook** — Correct FK dependency ordering for Prisma migration
6. **Cross-cutting patterns** — Comprehensive: timestamps, soft deletes, enum strategy, PK strategy, naming conventions

## Issues Found

### Minor: Input Detection Could Be Smarter
- Skill has entity list input but doesn't auto-detect existing Prisma schema in the project
- Had to provide entity names manually despite schema existing in backend task breakdown
- **Suggestion**: Auto-scan `jaan-to/outputs/dev/backend/` for existing schema YAML

### Minor: AskUserQuestion Count
- 4 questions asked despite tech.md providing engine (PostgreSQL) and implying greenfield
- Could skip engine question when tech.md specifies database
- **Suggestion**: Skip questions already answered by context files

### Observation: No Standalone Schema File
- Output is markdown documentation — no standalone `schema.prisma` or `.sql` file
- This is by design (skill generates docs, not code), but a companion DDL file would be useful
- **Suggestion**: Consider optional `--emit-ddl` flag for raw SQL output

---

## Score

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Functionality | 30% | 5/5 | 1.50 |
| Output Quality | 25% | 5/5 | 1.25 |
| Context Awareness | 20% | 5/5 | 1.00 |
| Learning Integration | 15% | 5/5 | 0.75 |
| Workflow Efficiency | 10% | 4/5 | 0.40 |

**Overall**: 4.9/5.0

---

## Comparison with Cycle 2 Schema

The existing schema YAML from `dev-be-task-breakdown` (Cycle 2) had:
- Native ENUM types → now corrected to CHECK on VARCHAR
- No ON DELETE behavior specified → now explicit CASCADE/RESTRICT/SET NULL
- No partial indexes for soft deletes → now added
- No ESR rationale → now documented per composite index
- No GDPR section → now comprehensive deletion workflow
- No migration order → now FK dependency chain documented

`dev-be-data-model` significantly improves upon the embedded schema from task breakdown.
