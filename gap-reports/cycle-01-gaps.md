# Gap Report — Cycle 1

> Date: 2026-02-07
> jaan-to Version: v3.15.2 (plugin cache updated to v3.16.2 mid-session)

---

## What We Accomplished

### Phase 1: Discovery
- Market research report on AI task management (competitors, pain points, XAI opportunity)

### Phase 2: Definition
- Full MVP PRD with 7 user stories, acceptance criteria, success metrics, rollback plan
- Stack detection report (pre-implementation baseline)
- Jaanify product overview concept document
- Tech stack context files populated (tech.md, integrations.md)

### Phase 3: Design
- 3 interactive HTML preview pages (dashboard, task input, onboarding) — openable in browser
- Cohesive design system (sage/cream/terracotta tokens, DM Sans, CSS custom properties)
- 24-item multi-language microcopy pack in 7 languages with JSON export

### Phase 4: Planning
- 68 frontend implementation tasks across 26 components with state machines, dependency graph, performance budgets

### Phase 5: Quality & Analytics
- 74 BDD/Gherkin test cases with concrete data, traceability matrix, quality checklist
- 18 GTM dataLayer tracking events with KPI mapping and TypeScript utility module

### Phase 6: Wrap-up
- 10 per-skill scorecards
- This gap report
- Git history: 14 commits on main

---

## Where We Got Stuck

### 1. No backend task breakdown (skill exists but blocked)
- `/jaan-to-dev-be-task-breakdown` exists on disk but is NOT registered in plugin.json on main branch
- Impact: Frontend task breakdown is complete, but there is no corresponding backend plan for the Fastify API, database schema, or WebSocket server
- Workaround attempted: None (per project rules, only available skills used)

### 2. No user stories with Gherkin acceptance criteria
- `/jaan-to-pm-story-write` exists on disk but NOT registered in plugin.json on main branch
- Impact: PRD has user stories but they aren't expanded into detailed Gherkin-format stories with INVEST validation
- The QA test cases were generated directly from PRD acceptance criteria instead

### 3. No UX research synthesis
- `/jaan-to-ux-research-synthesize` exists on disk but NOT registered
- Impact: Market research exists but hasn't been synthesized into UX themes, user journey maps, or design implications

### 4. No UX heatmap analysis for designs
- `/jaan-to-ux-heatmap-analyze` exists on disk but NOT registered
- Impact: 3 component previews were created but lack UX audit of layout effectiveness, attention flow, or interaction patterns

### 5. No API design / OpenAPI specification
- No skill exists for generating API contracts
- Impact: Frontend task breakdown explicitly flagged "API contracts undefined" as the #1 risk. No contract between frontend and backend.

### 6. No database schema design
- No skill exists for generating database schemas
- Impact: PRD defines tasks, users, reasoning data, but no data model exists

### 7. No backend code generation
- No skill exists for generating backend application code
- Impact: Can't build the Fastify API from the task breakdown

---

## Skills Requested (Priority Order)

### A. Fix plugin.json on main (4 skills already exist, blocked by bug)

| # | Skill | WHY | URGENCY |
|---|-------|-----|---------|
| 1 | `jaan-to-pm-story-write` | Expand PRD user stories into detailed Gherkin with INVEST validation | HIGH |
| 2 | `jaan-to-dev-be-task-breakdown` | Backend task plan equivalent to the frontend breakdown we created | HIGH |
| 3 | `jaan-to-ux-research-synthesize` | Synthesize market research into UX themes and design recommendations | MEDIUM |
| 4 | `jaan-to-ux-heatmap-analyze` | Audit the 3 component designs for attention flow and usability | MEDIUM |

**Root cause**: `plugin.json` on main branch lacks `"skills": "./skills/"` path for these 4 skills. Fixed in commit `d56ea2f` on dev branch. Merging dev → main would unblock all 4 immediately.

### B. New skills needed (don't exist yet)

| # | Skill | WHY | URGENCY |
|---|-------|-----|---------|
| 5 | API design / OpenAPI spec | Frontend is planned but has no API contract — #1 integration risk | HIGH |
| 6 | Database schema design | Need data model for tasks, users, reasoning, sessions | HIGH |
| 7 | Backend code generation | Can't build the Fastify API without code generation skill | HIGH |
| 8 | Security threat model | Public auth system (Google OAuth, JWT, guest sessions) needs threat analysis | MEDIUM |
| 9 | UX persona creation | PRD references personas (neurodivergent, freelancer) without formal definitions | MEDIUM |
| 10 | CI/CD / deployment | Can't deploy or set up GitHub Actions pipeline | LOW (not yet) |

---

## Feature Requests (non-skill improvements)

| # | Request | Impact |
|---|---------|--------|
| 1 | **Batch mode for fe-design** — Generate multiple related components in one invocation | Reduces overhead for multi-screen design work |
| 2 | **Shared design tokens file** — fe-design should extract tokens into a shared file imported by all previews | Eliminates CSS duplication across components |
| 3 | **React code output alongside HTML** — fe-design generates HTML preview but could also emit React component code | Bridges design → implementation gap |
| 4 | **Tone-of-voice product detection** — microcopy-write should detect when tone-of-voice.md references a different product | Prevents stale context from previous projects |
| 5 | **Research output folder alignment** — pm-research uses flat NN-prefix naming instead of ID-slug subfolder pattern | Consistency with other skills |
| 6 | **Smart early exit for stack-detect** — When no source code exists, skip manifest scanning layers | More efficient on pre-implementation projects |

---

## Cycle 1 Summary

| Metric | Value |
|--------|-------|
| Skills invoked | 10 unique skills (12 total invocations) |
| Skills blocked | 4 (plugin.json bug on main) |
| Skills missing | 6 (don't exist yet) |
| Deliverables produced | 14 output files across 7 skill domains |
| Git commits | 14 on main |
| Average skill score | 4.4/5.0 |
| Highest-scoring skill | jaan-to-dev-fe-design (5.0/5) |
| Lowest-scoring skill | jaan-to-dev-stack-detect (3.6/5) |
| Top improvement priority | Merge dev → main to unblock 4 skills |

---

## Cycle 2 Trigger

**Cycle 2 starts when**: User merges `dev` → `main` on jaan-to repo to fix plugin.json.

**First actions in Cycle 2**:
1. Pull latest jaan-to submodule
2. Scan for newly available skills (expect 4 unblocked)
3. Run `/jaan-to-pm-story-write` on PRD user stories
4. Run `/jaan-to-dev-be-task-breakdown` for backend plan
5. Run `/jaan-to-ux-research-synthesize` on market research
6. Run `/jaan-to-ux-heatmap-analyze` on 3 component designs
7. Report new gaps
