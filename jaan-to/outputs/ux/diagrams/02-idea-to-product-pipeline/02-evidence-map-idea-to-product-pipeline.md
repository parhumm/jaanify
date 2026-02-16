# Evidence Map: jaan-to Idea-to-Product Pipeline

> Companion to `02-flowchart-idea-to-product-pipeline.md` — traces every diagram node to its source.
> **Generated:** 2026-02-16

## Confidence Key

| Level | Symbol | Criteria |
|---|---|---|
| High | 🟢 | PRD + code + test |
| Medium | 🟡 | PRD or code (not both), or missing test |
| Low | 🔴 | Inferred only — no direct trace |
| Unknown | ⚫ | Not yet assessed |

## Node Evidence

| Node ID | Label | PRD Ref | Code Path | Code Symbol | Test Path | Confidence | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `entry_idea` | Your Idea | Plan §Context | — | — | — | 🟢 | FOUND | Entry point — user's product idea |
| `step_init` | jaan-init | Plan §Phase 0 | — | — | — | 🟢 | FOUND | Initializes jaan-to workspace |
| `data_context` | context files | Plan §Section 6 | `jaan-to/context/tech.md` | — | — | 🟢 | FOUND | Real file exists in Jaanify project |
| `step_research` | pm-research-about | Plan §Phase 1 | — | — | — | 🟢 | FOUND | Market/topic research skill |
| `step_prd` | pm-prd-write | Plan §Phase 1 | `jaan-to/outputs/pm/prd/01-jaanify-mvp/` | — | — | 🟢 | FOUND | Real output exists in Jaanify |
| `step_stories` | pm-story-write | Plan §Phase 1 | `jaan-to/outputs/pm/stories/01-*/` | — | — | 🟢 | FOUND | 7 stories exist in Jaanify |
| `data_prd` | PRD | Plan §Phase 1 | `jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md` | — | — | 🟢 | FOUND | Central artifact feeding multiple phases |
| `step_flowchart` | ux-flowchart-generate | Plan §Phase 2 | `jaan-to/outputs/ux/diagrams/01-*/` | — | — | 🟢 | FOUND | Real output exists |
| `step_be_tasks` | backend-task-breakdown | Plan §Phase 2 | `jaan-to/outputs/backend/task-breakdown/01-*/` | — | — | 🟢 | FOUND | Real output exists |
| `step_fe_tasks` | frontend-task-breakdown | Plan §Phase 2 | `jaan-to/outputs/frontend/task-breakdown/01-*/` | — | — | 🟢 | FOUND | Real output exists |
| `step_data_model` | backend-data-model | Plan §Phase 2 | `jaan-to/outputs/backend/data-model/02-*/` | — | — | 🟢 | FOUND | Real output exists |
| `step_api_contract` | backend-api-contract | Plan §Phase 2 | `jaan-to/outputs/backend/api-contract/01-*/api.yaml` | — | — | 🟢 | FOUND | Real OpenAPI spec exists |
| `data_specs` | Specs + Tasks | Plan §Phase 2 | Multiple output dirs | — | — | 🟡 | INFERRED | Aggregate artifact node |
| `step_be_scaffold` | backend-scaffold | Plan §Phase 3 | `jaan-to/outputs/backend/scaffold/01-*/` | — | — | 🟢 | FOUND | 7 scaffold files exist |
| `step_fe_scaffold` | frontend-scaffold | Plan §Phase 3 | `jaan-to/outputs/frontend/scaffold/01-*/` | — | — | 🟢 | FOUND | 6 scaffold files exist |
| `step_fe_design` | frontend-design | Plan §Phase 3 | `jaan-to/outputs/frontend/design/01-*/` | — | — | 🟢 | FOUND | 3 designs exist |
| `step_assemble` | dev-project-assemble | Plan §Phase 3 | `jaan-to/outputs/dev/project-assemble/01-*/` | — | — | 🟢 | FOUND | Real output exists |
| `data_code` | Running Code | Plan §Phase 3 | `apps/api/`, `apps/web/` | — | — | 🟢 | FOUND | Monorepo apps exist |
| `step_test_cases` | qa-test-cases | Plan §Phase 4 | `jaan-to/outputs/qa/cases/01-*/` | — | — | 🟢 | FOUND | 74 BDD test cases exist |
| `step_test_gen` | qa-test-generate | Plan §Phase 4 | `jaan-to/outputs/qa/test-generate/01-*/` | — | — | 🟢 | FOUND | Unit + integration + e2e tests exist |
| `step_test_run` | qa-test-run | Plan §Phase 4 | — | — | — | 🟢 | FOUND | 77 tests passing in Jaanify |
| `dec_tests_pass` | Tests pass? | Plan §Phase 4 | — | — | — | 🟢 | FOUND | Decision gate in quality phase |
| `step_security` | sec-audit-remediate | Plan §Phase 4 | — | — | — | 🟢 | FOUND | Security audit run in Cycle 11 |
| `step_infra` | devops-infra-scaffold | Plan §Phase 5 | `.github/workflows/` | — | — | 🟢 | FOUND | CI/CD workflows exist |
| `step_deploy` | devops-deploy-activate | Plan §Phase 5 | `docker/Dockerfile.api` | — | — | 🟢 | FOUND | Docker + Railway config exist |
| `step_changelog` | release-iterate-changelog | Plan §Phase 5 | — | — | — | 🟢 | FOUND | Changelog v0.3.0 exists |
| `success_live` | Live Product | Plan §Phase 5 | — | — | — | 🟡 | INFERRED | Terminal success state |

## Mismatches

No mismatches detected — single source mode (doc).

## Source File Index

| File Path | Last Modified | Nodes Derived |
|---|---|---|
| `/Users/parhumm/.claude/plans/stateless-hopping-blanket.md` | 2026-02-16 | All 24 nodes (primary source) |
| `jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md` | 2026-02-07 | Context for tech stack references |

---

## Metadata

| Field | Value |
|-------|-------|
| Companion To | 02-flowchart-idea-to-product-pipeline.md |
| Generated | 2026-02-16 |
| Output Path | jaan-to/outputs/ux/diagrams/02-idea-to-product-pipeline/ |
| Skill | ux-flowchart-generate |
| Version | 3.0 |
