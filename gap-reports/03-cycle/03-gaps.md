# Gap Report — Cycle 3

> Date: 2026-02-08
> jaan-to Version: v3.19.0 (commit `984fd19`)
> Previous: v3.16.3 (Cycle 2)

---

## Section A — Cycle 3 Results

### Trigger

Cycle 3 was triggered by addition of 2 new skills (`dev-api-contract`, `dev-be-data-model`) and `learn-report` command to jaan-to v3.19.0. These directly address the #1 critical gap from Cycles 1-2: missing API contract between frontend and backend.

### Context Fixes Applied

| Fix | File | Issue | Resolution |
|-----|------|-------|------------|
| Tone-of-Voice | `jaan-to/context/tone-of-voice.md` | EduStream Academy content | Replaced with Jaanify task management content |
| Localization | `jaan-to/context/localization.md` | EduStream Academy references | Replaced with Jaanify references, updated fonts |
| Config | `jaan-to/context/config.md` | Missing new skills, stale cycle status | Added dev-api-contract, dev-be-data-model; updated to Cycle 3 |

### Skills Tested (3 new + 1 re-test)

| # | Skill | Score | Output | Key Finding |
|---|-------|-------|--------|-------------|
| 1 | `learn-report` | 2.3/5 | Learning insights report (manual) | Script fails on macOS (Bash 3.2 — needs 4+ for `declare -A`) |
| 2 | `dev-be-data-model` | 4.9/5 | 7-table data model with DDL, indexes, migration playbook | Rich learn.md integration, GDPR section, quality scorecard |
| 3 | `dev-api-contract` | 5.0/5 | OpenAPI 3.1 YAML (1271 lines, 21 endpoints) + companion guide | Resolves #1 critical gap; RFC 9457, cursor pagination, JWT auth |
| 4 | `ux-microcopy-write` (re-test) | N/A | Task creation form microcopy (14 items, 7 languages) | Validates context fixes — all output references Jaanify, not EduStream |

### Deliverables This Cycle

| Type | Count | Details |
|------|-------|---------|
| Skill outputs | 5 files | learn report, data model, api.yaml, contract guide, microcopy pack |
| Scorecards | 3 files | learn-report, dev-be-data-model, dev-api-contract |
| Context fixes | 3 files | tone-of-voice.md, localization.md, config.md |
| Scan report | 1 file | 03-scan.md |
| This gap report | 1 file | 03-gaps.md |
| Git commits | 8 | One per task (scan, tone fix, locale fix, config fix, learn, data model, contract, microcopy) |

---

## Section B — Launch Readiness Assessment

### What Jaanify Has (Complete Specification)

| Deliverable | Status | Cycle | Skill Used | Key Metric |
|-------------|--------|-------|------------|------------|
| PRD | DONE | 1 | `pm-prd-write` | Full PRD with 7 features, success metrics, MVP scope |
| User Stories (7) | DONE | 2 | `pm-story-write` | US-01 through US-07 with Gherkin ACs, INVEST validated |
| Frontend Tasks (68) | DONE | 1 | `dev-fe-task-breakdown` | 68 tasks across 7 epics |
| Backend Tasks (28) | DONE | 2 | `dev-be-task-breakdown` | 28 tasks, 8 vertical slices, dependency graph |
| Data Model | DONE | 3 | `dev-be-data-model` | 7 tables, DDL, ESR indexes, GDPR, migration playbook |
| API Contract | DONE | 3 | `dev-api-contract` | OpenAPI 3.1, 21 endpoints, RFC 9457 errors |
| Test Cases (74 BDD) | DONE | 1 | `qa-test-cases` | 74 BDD scenarios across 7 stories |
| Design System (HTML) | DONE | 1 | `dev-fe-design` | 3 HTML component previews |
| Microcopy (7 langs) | DONE | 1+3 | `ux-microcopy-write` | 14 items × 7 languages, RTL support |
| UX Research | DONE | 2 | `ux-research-synthesize` | 6 themes, 5 prioritized recommendations |
| UX Audit | DONE | 2 | `ux-heatmap-analyze` | Predictive audit, 8 findings |
| Analytics Events | DONE | 1 | `data-gtm-datalayer` | GTM dataLayer pushes for key flows |
| Tech Stack | DONE | 1 | `dev-stack-detect` | Full stack detected and documented |

### What Jaanify Needs to Ship (Implementation Gap)

| Need | Status | Blocker | Who Builds It |
|------|--------|---------|---------------|
| **Prisma schema file** | MISSING | No skill generates `.prisma` files | Need `dev-be-scaffold` skill or manual |
| **Backend code (Fastify)** | BLOCKED | No code-gen skill | Need `dev-be-scaffold` — routes, services, middleware |
| **Frontend code (React)** | BLOCKED | `dev-fe-design` outputs HTML only | Need HTML→React conversion skill |
| **Security threat model** | MISSING | No skill exists | Need `sec-threat-model-lite` (on roadmap) |
| **CI/CD pipeline** | MISSING | No skill exists | Need `sre-pipeline-create` or manual |
| **Database migration** | PARTIAL | DDL documented in data model, no migration files | Need Prisma schema → migration workflow |
| **WebSocket events** | MISSING | REST contract done, real-time events not specified | Need AsyncAPI spec or Socket.io event schema |
| **E2E tests** | MISSING | BDD scenarios exist but no test runner integration | Need test framework setup |

### Distance to Market Launch

```
SPECIFICATION ████████████████████████████████████████ 100%  (13/13 deliverables)
IMPLEMENTATION ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%  (0 code files exist)
```

**Assessment**: Jaanify has a **complete, production-quality specification** — every planning artifact that a development team needs exists. What's missing is the **implementation bridge**: skills that convert specifications into code files.

---

## Section C — Gap Tracking (Cycle 1→2→3)

### Resolved This Cycle

| # | Gap (from Cycle 2) | Resolution |
|---|---------------------|------------|
| 5 | API design / OpenAPI spec | RESOLVED — `dev-api-contract` generated full OpenAPI 3.1 (21 endpoints) |
| 6 | Database schema design | RESOLVED — `dev-be-data-model` generated 7-table model with DDL, indexes, migration |
| NEW | EduStream context contamination | RESOLVED — tone-of-voice.md and localization.md fixed, validated with microcopy re-test |

### Still Open (Carried from Previous Cycles)

| # | Gap | Original Cycle | Priority | Mapped Skill | Notes |
|---|-----|----------------|----------|--------------|-------|
| 7 | Backend code scaffolding | Cycle 2 | CRITICAL | ❌ Not in catalog | Fastify routes + Prisma models from task breakdown + API contract |
| 11 | Frontend code from designs | Cycle 2 | CRITICAL | ❌ Not in catalog | HTML → React v19 / Next.js v15 + TailwindCSS v4 conversion |
| 8 | Security threat model | Cycle 1 | HIGH | ✅ `sec-threat-model-lite` (planned) | OAuth, JWT, guest sessions need threat analysis |
| 10 | CI/CD / deployment | Cycle 2 | HIGH | ⚠️ `sre-pipeline-audit` (audit only) | GitHub Actions workflows, Docker, deploy manifests — creation skill missing |
| 9 | UX persona creation | Cycle 1 | MEDIUM | ✅ `ux-persona-create` + `pm-persona-card` (planned) | Formalize neurodivergent + freelancer personas |
| 12 | Story-to-task linking | Cycle 2 | MEDIUM | ❌ Not in catalog | Cross-reference IDs between PRD → Stories → Tasks → Tests |

### New Gaps Discovered in Cycle 3

| # | Gap | WHY | Priority |
|---|-----|-----|----------|
| 16 | **WebSocket event schema** | REST contract done but real-time task updates (Socket.io) have no formal spec | HIGH |
| 17 | **learn-report Bash compatibility** | Script uses `declare -A` (Bash 4+), fails on macOS stock Bash 3.2 | MEDIUM |
| 18 | **Named examples on API operations** | api.yaml has property-level examples but no named media type examples for mock server scenarios | LOW |
| 19 | **Rate limit headers** | API contract defines 429 responses but doesn't document rate limit headers (X-RateLimit-*) | LOW |
| 20 | **Legacy learn file cleanup** | 19 duplicate learn files (jaan-to-* prefix) from v3.16.2 naming migration | LOW |

### Missing Skill Definitions

Gaps marked ❌ "Not in catalog" have no matching skill in the jaan-to role-skills catalog. Definitions below follow the format from `vendor/jaan-to/roadmaps/jaan-to/tasks/role-skills/*.md`.

#### Gap #7 → `dev-be-scaffold` (DEV)

- **Logical**: `dev-be-scaffold`
- **Description**: Generate production-ready backend code from specifications: Fastify routes, Prisma schema, service layer, middleware, validation
- **Input**: API contract (OpenAPI YAML) + task breakdown + data model
- **Output**: `$JAAN_OUTPUTS_DIR/dev/backend/{slug}/scaffold/` — routes, services, Prisma schema, middleware
- **Key Points**:
  - Map OpenAPI operations to Fastify route handlers (TypeScript)
  - Generate Prisma models from data model with relations and indexes
  - Include validation schemas (Zod) derived from API contract
  - Generate error handling middleware matching RFC 9457
  - Output includes setup README

#### Gap #11 → `dev-fe-scaffold` (DEV)

- **Logical**: `dev-fe-scaffold`
- **Description**: Convert HTML design previews to React v19 / Next.js v15 components with TailwindCSS v4, TypeScript, and state management
- **Input**: HTML design files + frontend task breakdown + API contract
- **Output**: `$JAAN_OUTPUTS_DIR/dev/frontend/{slug}/scaffold/` — components, pages, stores, API client, types
- **Key Points**:
  - Extract semantic HTML structure and preserve accessibility
  - Convert to TailwindCSS v4 utility classes
  - Generate TypeScript interfaces from API contract
  - Create composable component hierarchy with loading/error/empty states
  - Generate typed API client hooks

#### Gap #10 → `sre-pipeline-create` (SRE)

- **Logical**: `sre-pipeline-create`
- **Description**: Generate CI/CD pipeline configuration: GitHub Actions workflows, Dockerfile, deployment manifests, testing stages
- **Input**: Tech stack + project structure + deployment target
- **Output**: `$JAAN_OUTPUTS_DIR/sre/cicd/{slug}/pipeline/` — workflows, Dockerfile, docker-compose, deploy manifests
- **Key Points**:
  - Multi-stage Docker builds for optimization
  - Parallel test/lint/type-check jobs
  - Environment-specific deployment with approval gates
  - Secrets management pattern (GitHub Secrets)
  - Note: complements existing `sre-pipeline-audit` (audit-only)

#### Gap #12 → `pm-trace-links` (PM)

- **Logical**: `pm-trace-links`
- **Description**: Generate traceability matrix linking PRD requirements → User Stories → Tasks → Tests with bi-directional references
- **Input**: PRD + stories directory + tasks directory + test cases directory
- **Output**: `$JAAN_OUTPUTS_DIR/pm/trace/{slug}/traceability-matrix.md`
- **Key Points**:
  - Parse and extract IDs from existing artifacts (US-01, TASK-BE-01, etc.)
  - Build dependency graph with forward/backward links
  - Detect orphaned items (tasks with no story, tests with no task)
  - Generate coverage metrics (% requirements with tests)
  - Include Mermaid diagrams for visual traceability

---

## Section D — Priority Skills for Cycle 4+

### Tier 1: Unblock Implementation (Needed for MVP Launch)

| Priority | Skill Needed | Input Available | Output Expected |
|----------|-------------|-----------------|-----------------|
| 1 | `dev-be-scaffold` | API contract + task breakdown + data model | Fastify routes, Prisma schema, service layer, middleware |
| 2 | `dev-fe-scaffold` or `dev-fe-design` React mode | HTML previews + frontend tasks + API contract | React v19 components, Next.js pages, Zustand stores, API client |

**Rationale**: With API contract (Cycle 3) + data model (Cycle 3) + task breakdowns (Cycle 2) all complete, the only missing piece is converting specs to code. These two skills would unblock actual development.

### Tier 2: Quality & Safety (Needed Before Public Launch)

| Priority | Skill Needed | Input Available | Output Expected |
|----------|-------------|-----------------|-----------------|
| 3 | `sec-threat-model-lite` | API contract + auth design + data model | STRIDE analysis, risk matrix, mitigation checklist |
| 4 | `sre-pipeline-create` | Tech stack + project structure | GitHub Actions CI/CD, Dockerfile, deploy manifests |
| 5 | `dev-ws-events` or AsyncAPI skill | Real-time requirements from PRD | Socket.io event schemas, AsyncAPI spec |

### Tier 3: Nice to Have

| Priority | Skill Needed | Notes |
|----------|-------------|-------|
| 6 | `ux-persona-create` | Formalize neurodivergent + freelancer personas |
| 7 | Cross-artifact linking | Auto-traceability PRD → Stories → Tasks → Tests |
| 8 | Skill chaining | Output of one skill auto-feeds next |

---

## Section E — Critical Path to Launch

All 13 skills needed to take Jaanify from specification (100%) to production launch, in dependency order.

### Phase 1: Unblock Implementation (CRITICAL — no code exists without these)

| Skill | Catalog Status | Input Ready | Output |
|-------|---------------|-------------|--------|
| `dev-be-scaffold` | ❌ Not in catalog | API contract + task breakdown + data model | Fastify routes, Prisma schema, services, middleware |
| `dev-fe-scaffold` | ❌ Not in catalog | HTML previews + FE tasks + API contract | React v19 components, Next.js pages, stores, API client |

### Phase 2: Integration & Testing

| Skill | Catalog Status | Input Ready | Output |
|-------|---------------|-------------|--------|
| `dev-fe-state-machine` | ✅ In catalog | Screen designs + FE tasks | UI states + transitions per screen |
| `dev-integration-plan` | ✅ In catalog | API contract + provider docs | API call sequence, retry, failure modes |
| `dev-integration-mock-stubs` | ✅ In catalog | Integration plan | Stub interfaces, fake responses for local dev |
| `dev-test-plan` | ✅ In catalog | All specs + code | Unit/integration/e2e scope, fixtures, mocks |

### Phase 3: Security & Infrastructure

| Skill | Catalog Status | Input Ready | Output |
|-------|---------------|-------------|--------|
| `sec-threat-model-lite` | ✅ In catalog | API contract + auth design + data model | STRIDE analysis, risk matrix, mitigations |
| `sre-pipeline-create` | ❌ Not in catalog | Tech stack + project structure | GitHub Actions CI/CD, Docker, deploy manifests |
| `dev-ws-events` | ❌ Not in catalog | Real-time requirements from PRD | Socket.io event schema / AsyncAPI spec |

### Phase 4: Ship

| Skill | Catalog Status | Input Ready | Output |
|-------|---------------|-------------|--------|
| `dev-observability-events` | ✅ In catalog | Feature specs | Structured logs, metrics, trace spans |
| `dev-observability-alerts` | ✅ In catalog | Observability events | Alert thresholds, severity, noise reduction |
| `dev-docs-generate` | ✅ In catalog | Code + API contract | README, API docs, runbooks |
| `dev-ship-check` | ✅ In catalog | All artifacts | Feature flags, migrations, Go/No-Go |

### Summary

```
❌ Not in catalog (must be created):   3 skills  (dev-be-scaffold, dev-fe-scaffold, sre-pipeline-create + dev-ws-events)
✅ In catalog (must be implemented):  10 skills
                               Total: 13 skills to launch
```

---

## Cycle 3 Summary

| Metric | Value |
|--------|-------|
| Skills invoked this cycle | 3 new + 1 re-test = 4 |
| Total skills invoked (cumulative) | 17 unique skills (of 21 available) |
| Context files fixed | 3 (tone-of-voice, localization, config) |
| Deliverables produced this cycle | 5 output files + 3 scorecards |
| Total deliverables (cumulative) | 32+ output files |
| Git commits this cycle | 8 (one per task) |
| Average skill score (new skills) | 4.07/5.0 (learn-report 2.3, data-model 4.9, contract 5.0) |
| Average skill score (excl. learn-report) | 4.95/5.0 |
| Top gap resolved | API Contract (#1 critical gap since Cycle 1) |
| Top remaining gap | Backend/Frontend code scaffolding |

---

## Cycle 4 Trigger

**Cycle 4 starts when**: Code scaffolding skills (`dev-be-scaffold`, `dev-fe-scaffold`) are added to jaan-to, OR the user decides to begin manual implementation using existing specifications.

**First actions in Cycle 4**:
1. Pull latest jaan-to submodule
2. Scaffold Fastify backend from API contract + data model + task breakdown
3. Scaffold React frontend from HTML previews + frontend tasks + API contract
4. Generate security threat model
5. Set up CI/CD pipeline
6. Report new gaps
