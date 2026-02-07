# Gap Report — Cycle 2

> Date: 2026-02-07
> jaan-to Version: v3.16.3 (submodule updated from v3.14.1 mid-session)

---

## What We Accomplished

### Trigger
Cycle 2 was triggered by merging `dev → main` on jaan-to repo, which fixed the `plugin.json` registration bug blocking 4 skills. Skills were also renamed (prefix `jaan-to-` removed from directory names).

### Skills Executed (4 previously-blocked skills)

| # | Skill | Output | Files |
|---|-------|--------|-------|
| 1 | `pm-story-write` | 7 user stories (US-01 through US-07) with Gherkin ACs, INVEST validation | 8 files |
| 2 | `dev-be-task-breakdown` | 28 backend tasks, 8 vertical slices, Prisma schema, dependency graph | 1 file |
| 3 | `ux-research-synthesize` | 6 UX themes, executive brief, 5 prioritized recommendations | 2 files |
| 4 | `ux-heatmap-analyze` | Predictive UX audit of 3 component previews, 8 findings | 2 files |

### Deliverables

- **PM**: 7 detailed Gherkin stories covering natural language input, daily plan, voice capture, onboarding, reasoning cards, prioritization, and accessibility
- **Dev**: Complete backend task plan with Prisma schema for 7 tables (users, tasks, daily_plans, daily_plan_slots, user_feedback, guest_sessions, audit_logs)
- **UX**: Market research synthesized into actionable UX themes with 5 INSIGHT/SO WHAT/NOW WHAT recommendations
- **UX**: Predictive audit identifying reasoning card visibility, voice FAB discoverability, and onboarding CTA positioning as top issues
- **Scorecards**: 4 new per-skill scorecards
- **Git**: 4 separate commits (one per skill) + this report

---

## What's Still Missing

### From Cycle 1 Gap Report — Items Resolved

| # | Gap | Status |
|---|-----|--------|
| 1 | pm-story-write blocked | RESOLVED — 7 stories written |
| 2 | dev-be-task-breakdown blocked | RESOLVED — 28 tasks with schema |
| 3 | ux-research-synthesize blocked | RESOLVED — Full synthesis complete |
| 4 | ux-heatmap-analyze blocked | RESOLVED — Predictive audit complete (limited by pre-implementation) |

### From Cycle 1 Gap Report — Items Still Open

| # | Gap | Status | Roadmap Skill | Notes |
|---|-----|--------|---------------|-------|
| 5 | API design / OpenAPI spec | ROADMAP | `dev-api-contract` (dev.md) | OpenAPI contract with payloads, errors, versioning. Needs OpenAPI MCP |
| 6 | Database schema design | ROADMAP | `dev-be-data-model` (dev.md) | Tables + constraints + indexes + migration notes. Prisma schema already generated in Cycle 2 via `dev-be-task-breakdown` |
| 7 | Backend code generation | OPEN | — | No roadmap skill generates code files. Need: `dev-be-scaffold` — generate Fastify routes, Prisma models, service files from task breakdown |
| 8 | Security threat model | ROADMAP | `sec-threat-model-lite` (sec.md) | Threats + mitigations checklist, high-risk areas, verification steps |
| 9 | UX persona creation | ROADMAP | `ux-persona-create` (ux.md) | Personas with goals, pain points, behaviors, JTBD. AI Score 5, Rank #16 |
| 10 | CI/CD / deployment | OPEN | — | No roadmap skill creates CI/CD pipelines. Need: `sre-pipeline-create` — generate GitHub Actions workflows, Dockerfile, deploy manifests |

### New Gaps Discovered in Cycle 2

| # | Gap | WHY | URGENCY |
|---|-----|-----|---------|
| 11 | **Frontend code generation from designs** | 3 HTML component previews exist but no React/Next.js code. `dev-fe-design` produces HTML only. | HIGH |
| 12 | **Story-to-task linking** | User stories and backend tasks were generated independently — no cross-reference IDs | MEDIUM |
| 13 | **UX heatmap predictive mode** | Skill is designed for post-launch CSV data but had to be adapted for pre-implementation audit. Needs explicit predictive mode. | MEDIUM |
| 14 | **Research synthesis for secondary sources** | ux-research-synthesize is designed for interview transcripts. Secondary market research required adaptation. | LOW |
| 15 | **Batch story generation** | pm-story-write processes one story at a time. 7 stories required 7 sequential passes through the full workflow. | LOW |

---

## Skills Requested (Priority Order)

### A. High Priority (Unblock Implementation)

| # | Skill | WHY | URGENCY |
|---|-------|-----|---------|
| 1 | API design / OpenAPI spec generation | Frontend plan exists, backend plan exists, but no contract between them. #1 integration risk. | CRITICAL |
| 2 | Backend code scaffolding | Task breakdown with schema exists but no actual Fastify routes, Prisma models, or service files | HIGH |
| 3 | Frontend code generation (React from HTML) | 3 HTML previews need conversion to React v19 / Next.js v15 components with TailwindCSS | HIGH |

### B. Medium Priority (Quality & Safety)

| # | Skill | WHY | URGENCY |
|---|-------|-----|---------|
| 4 | Security threat model | OAuth, JWT, guest sessions, anonymous data — public-facing auth needs threat analysis | MEDIUM |
| 5 | Integration test generation | Stories + task breakdown are done, need integration test suite | MEDIUM |
| 6 | UX persona creation | Formalize neurodivergent and freelancer personas with behavioral patterns | MEDIUM |

### C. Improvements to Existing Skills

| # | Skill | Improvement |
|---|-------|-------------|
| 7 | `ux-heatmap-analyze` | Add predictive audit mode for pre-implementation |
| 8 | `ux-research-synthesize` | Add secondary research mode |
| 9 | `pm-story-write` | Add batch mode for multi-story generation |
| 10 | `dev-be-task-breakdown` | Generate standalone Prisma schema file |

---

## Feature Requests (non-skill improvements)

| # | Request | Impact |
|---|---------|--------|
| 1 | **Cross-artifact linking** — Auto-generate traceability from PRD → Stories → Tasks → Tests | Enables impact analysis and coverage tracking |
| 2 | **Skill chaining** — Output of one skill auto-feeds as input to another | Reduces manual copy-paste between skill invocations |
| 3 | **React code output from fe-design** | Bridges design → implementation (from Cycle 1 gap report, still relevant) |
| 4 | **Shared design tokens extraction** | Still duplicated across all 3 HTML previews |

---

## Cycle 2 Summary

| Metric | Value |
|--------|-------|
| Skills invoked this cycle | 4 unique skills |
| Total skills invoked (cumulative) | 14 unique skills |
| Skills blocked (resolved) | 4 → 0 |
| Skills missing (new + carried) | 6 existing + 5 new = 11 gaps |
| Deliverables produced this cycle | 13 output files |
| Total deliverables (cumulative) | 27 output files |
| Git commits this cycle | 5 (4 skill outputs + 1 scorecards/gap) |
| Average skill score this cycle | 4.65/5.0 |
| Highest-scoring skills | pm-story-write, ux-research-synthesize (4.8/5) |
| Lowest-scoring skill | ux-heatmap-analyze (4.4/5 — pre-implementation limitation) |
| Top improvement priority | API design skill to bridge frontend ↔ backend |

---

## Cycle 3 Trigger

**Cycle 3 starts when**: New skills are added for API design, backend code scaffolding, or frontend code generation.

**First actions in Cycle 3**:
1. Pull latest jaan-to submodule
2. Scan for new skills
3. Generate OpenAPI spec from PRD + backend task breakdown
4. Scaffold Fastify routes from task breakdown
5. Convert HTML previews to React components
6. Report new gaps
