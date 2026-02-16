# Scorecard: `/jaan-to:backend-data-model`

> jaan-to Version: v7.0.0 | Cycle: 12 | Date: 2026-02-16

---

## Overview

| Attribute | Value |
|-----------|-------|
| Type | Skill (skills/backend-data-model/) |
| SKILL.md size | 437 lines (-134 from v4.3.0; reference material externalized) |
| Reference file | `docs/extending/backend-data-model-reference.md` (166 lines) |
| Input used | Existing Prisma schema (7 entities from apps/api/prisma/schema.prisma) |
| Output | `jaan-to/outputs/backend/data-model/03-jaanify-entities-v7-regression/03-jaanify-entities-v7-regression.md` |
| Context files read | tech.md (PostgreSQL 16, Prisma v6), settings.yaml, learn.md, backend-data-model-reference.md |

---

## Execution Result

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Invocable** | 5/5 | Skill loaded; SKILL.md parsed without errors; reference file loaded |
| **Context awareness** | 5/5 | Read tech.md correctly: PostgreSQL 16, TIMESTAMPTZ, gen_random_uuid(), Prisma v6 |
| **Learning integration** | 5/5 | Applied learn.md: CHECK on VARCHAR, partial indexes, ESR ordering, FK indexes, no SERIAL |
| **Output quality** | 5/5 | Full ER diagram, 7 tables with DDL, index strategy, migration playbook, GDPR, quality scorecard; NEW: brownfield gap analysis (partial index predicates) |
| **Workflow** | 4/5 | Clear 2-phase workflow with HARD STOP; SKILL.md defines 6 AskUserQuestion calls, but correctly notes "skip questions already answered by input or tech.md" |
| **Template adherence** | 5/5 | Output follows template.md structure exactly; all required sections present |
| **Reference loading** | 5/5 | SKILL.md has 5 explicit `> **Reference**: See backend-data-model-reference.md` callouts; reference material accessible and correct |

---

## Strengths

1. **Token optimization successful** — 134 lines removed from SKILL.md with zero loss of output quality; reference material properly externalized to `backend-data-model-reference.md`
2. **Brownfield analysis** — Correctly identified existing Prisma schema as brownfield input; detected partial index gap (tasks indexes missing `WHERE deleted_at IS NULL`)
3. **Learn.md integration** — All lessons applied: CHECK on VARCHAR, ESR composite ordering, partial indexes, FK indexes, no SERIAL keyword
4. **GDPR section** — Maintained from C3: grace period, anonymize audit, hard delete chain
5. **Quality scorecard** — Self-assessment with 5 weighted dimensions; Index Coverage honestly scored 4/5 due to Prisma partial index limitation
6. **Migration playbook** — Practical brownfield recommendations with `CREATE INDEX CONCURRENTLY` and correct warning about transaction blocks

## Issues Found

### Minor: AskUserQuestion Skip Logic

- SKILL.md says "skip questions already answered by input or tech.md" (improved from C3)
- But the skip logic is implicit: each question says "ask if not in tech.md"
- In practice with an existing Prisma schema, all 6 questions could be auto-answered
- **Suggestion**: Add explicit "auto-answer from schema" path for brownfield input

### Minor: Transaction Block Warning

- Output recommends `BEGIN; ... CREATE INDEX CONCURRENTLY ... COMMIT;`
- Correctly notes this is invalid (CONCURRENTLY cannot run in transaction)
- But the SQL block itself is still wrapped in BEGIN/COMMIT which could confuse copy-paste users
- **Suggestion**: Remove the transaction wrapper from the SQL block; keep only the individual statements

### Observation: Prisma Partial Index Gap Documented but Not Resolved

- C3 output recommended partial indexes for tasks
- C12 correctly identified that Prisma v6 still doesn't support partial indexes natively
- The gap persists in the actual schema.prisma
- **Suggestion**: Include a raw SQL migration file in the output folder alongside the markdown

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

## Regression Assessment: Cycle 3 vs Cycle 12

| Dimension | C3 (v3.19.0) | C12 (v7.0.0) | Delta | Notes |
|-----------|-------------|-------------|-------|-------|
| Functionality | 5/5 (1.50) | 5/5 (1.50) | 0.0 | Both cycles fully functional |
| Output Quality | 5/5 (1.25) | 5/5 (1.25) | 0.0 | C12 adds brownfield gap analysis |
| Context Awareness | 5/5 (1.00) | 5/5 (1.00) | 0.0 | Both read tech.md correctly |
| Learning Integration | 5/5 (0.75) | 5/5 (0.75) | 0.0 | Both apply all learn.md lessons |
| Workflow Efficiency | 4/5 (0.40) | 4/5 (0.40) | 0.0 | AskUserQuestion count unchanged |
| **Overall** | **4.9/5.0** | **4.9/5.0** | **0.0** | **PASS** (within +/-0.3) |

### Token Optimization Impact

| Metric | v3.19.0 (C3) | v7.0.0 (C12) | Change |
|--------|-------------|-------------|--------|
| SKILL.md lines | 571 | 437 | -134 (-23.5%) |
| Reference file | N/A | 166 lines | NEW |
| Total instruction lines | 571 | 603 | +32 (+5.6%) |
| Output quality | 5/5 | 5/5 | No change |
| Reference callout count | 0 | 5 | Token-on-demand pattern |

The token optimization removed 134 lines from SKILL.md and placed them in `backend-data-model-reference.md`. The total instruction material grew by 32 lines (reference file adds detail not previously inline). Output quality is unchanged. The "token-on-demand" pattern (load reference only when needed) reduces prompt size for simple invocations while preserving full depth for production-depth runs.

### Regression Verdict

**PASS** -- Score delta is 0.0 (target: within +/-0.3). Token optimization achieved 23.5% reduction in SKILL.md with zero quality regression. The externalized reference material (`backend-data-model-reference.md`) is correctly loaded via 5 explicit callouts in SKILL.md. Brownfield input handling is a net improvement over C3's greenfield-only test.

---

## Comparison with Cycle 3 Output

The C3 output (`02-jaanify-data-model`) was a greenfield schema design. The C12 output (`03-jaanify-entities-v7-regression`) is a brownfield analysis of the implemented Prisma schema.

Key differences:

- C3 recommended partial indexes on tasks; C12 identified they are still missing in schema.prisma
- C3 had `audit_logs` relationship to users in ER diagram; C12 removed it (audit_logs has no FK to users)
- C12 added concrete `CREATE INDEX CONCURRENTLY` migration steps for the partial index gap
- C12 quality scorecard honestly scored Index Coverage at 4/5 (vs C3's 5/5) due to the Prisma limitation
- Both outputs have identical GDPR, retention, and cross-cutting concern sections
