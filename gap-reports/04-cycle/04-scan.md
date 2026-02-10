# Scan Report — Cycle 4

> Date: 2026-02-09
> jaan-to Version: v4.5.0 (commit `6a07617`)
> Previous: v3.19.0 (Cycle 3)
> Version Delta: 15+ releases, 11 new skills

---

## Version Delta Summary

| Metric | Cycle 3 (v3.19.0) | Cycle 4 (v4.5.0) | Change |
|--------|-------------------|-------------------|--------|
| Total skills | 21 | 31 directories (32 per CHANGELOG) | +11 |
| Roles | 5 (pm, dev, ux, data, qa) | 7 (+wp, +release) | +2 |
| Breaking changes | — | v4.0.0 skill renames | 1 major |
| Detect modes | Full only | Light + Full | New |
| Multi-platform | No | Yes (v3.24.0) | New |
| Language system | Partial | All skills (v3.22.0) | Complete |

---

## Release-by-Release Changelog (v3.19.0 → v4.5.0)

### v3.20.0 — Language Preference System
- Global/per-skill language setting via `settings.yaml`
- Ask once, persist forever

### v3.22.0 — Language Settings in All 21 Skills
- Every skill reads language from config
- Docusaurus documentation site added

### v3.23.0 — 6 Detect & Knowledge Pack Skills (Phase 5)
- `detect-dev` — Engineering audit with OpenSSF scoring
- `detect-design` — Design system detection with drift findings
- `detect-writing` — Writing system extraction, NNg tone dimensions
- `detect-product` — Product reality extraction, monetization scanning
- `detect-ux` — UX audit with route extraction, Nielsen's 10 heuristics
- `detect-pack` — Consolidate all detect outputs into scored index
- `dev-stack-detect` merged into `detect-dev`

### v3.23.1 — Detect Output Path Standardization
- All 6 detect skills write to `$JAAN_OUTPUTS_DIR/detect/{domain}/`

### v3.24.0 — Multi-Platform Support in All Detect Skills
- Auto-detection of monorepo platforms (web, backend, mobile)
- Platform-scoped evidence IDs (E-DEV-WEB-001)
- `pack-detect` renamed to `detect-pack`

### v4.0.0 — BREAKING: Skill Renames
- `dev-be-data-model` → `backend-data-model`
- `dev-be-task-breakdown` → `backend-task-breakdown`
- `dev-api-contract` → `backend-api-contract`
- `dev-fe-design` → `frontend-design`
- `dev-fe-task-breakdown` → `frontend-task-breakdown`
- Output paths: `outputs/dev/backend/` → `outputs/backend/`, `outputs/dev/frontend/` → `outputs/frontend/`

### v4.1.0 — Light/Full Mode for Detect Skills
- Light mode (default): Reduced steps, single `summary.md`, lower tokens
- Full mode (`--full`): All steps, all output files

### v4.1.1 — Path Standardization
- All 19 skills migrated from hardcoded paths to `$JAAN_*` env vars
- Automated path scan in skill-create

### v4.2.0 — Backend & Frontend Scaffold Skills ★
- **`backend-scaffold`** — Fastify v5 + Prisma + Zod from API contracts/data models/tasks
- **`frontend-scaffold`** — React 19 / Next.js 15 + TailwindCSS v4 + typed API hooks
- **RESOLVES Cycle 1-3 Critical Gaps #7 and #11**

### v4.2.1 — YAML Description Fix + Validation
- Fixed `backend-scaffold` description colon-space parsing
- Added colon detection to `validate-skills.sh`

### v4.3.0 — WordPress PR Review Skill
- `wp-pr-review` — Security, performance, WPCS standards review
- New `wp` role (not relevant to Jaanify)

### v4.4.0 — Release Changelog Skill
- `release-iterate-changelog` — Generate changelogs from git history
- 5 input modes: auto-generate, create, release, add, from-input
- New `release` role

### v4.5.0 — UX Flowchart Generation Skill
- `ux-flowchart-generate` — Mermaid flowcharts from PRDs/docs/code
- 4 source types, 4 diagram goals, 17 quality gates
- Evidence maps + confidence scoring + unknowns lists

---

## New Skills to Test in Cycle 4

| # | Skill | Version | Priority | Reason |
|---|-------|---------|----------|--------|
| 1 | `backend-scaffold` | v4.2.0 | CRITICAL | Resolves Gap #7 — generates Fastify backend code |
| 2 | `frontend-scaffold` | v4.2.0 | CRITICAL | Resolves Gap #11 — generates React/Next.js frontend |
| 3 | `ux-flowchart-generate` | v4.5.0 | HIGH | Visualize user/system flows from PRD |
| 4 | `release-iterate-changelog` | v4.4.0 | MEDIUM | Generate Jaanify CHANGELOG |
| 5 | `detect-dev` (light mode) | v4.1.0 | MEDIUM | Audit scaffold code quality |
| 6 | `detect-pack` (light mode) | v3.23.0 | LOW | Cross-domain audit summary |

**Skipped**: `wp-pr-review` (WordPress-specific, Jaanify is not WordPress)

---

## Impact on Existing Artifacts

### v4.0.0 Migration Required
- Output paths changed: `outputs/dev/backend/` → `outputs/backend/` (already migrated per git status)
- Output paths changed: `outputs/dev/frontend/` → `outputs/frontend/` (already migrated per git status)
- API contract stays at `outputs/dev/contract/` (not renamed in v4.0.0)
- `config.md` needs version update (v3.19.0 → v4.5.0) and cycle update (3 → 4)

### Learn Files Cleanup Needed
- 19x `jaan-to-*` prefixed duplicates (v3.16.2 legacy)
- 7x `to-jaan-*` prefixed duplicates (v1.x internal)
- 4x `dev-*` duplicates of `backend-*`/`frontend-*` renames

---

## Cumulative Skill Coverage

| Status | Count | Skills |
|--------|-------|--------|
| Tested (C1-3) | 17 | pm-prd-write, pm-story-write, pm-research-about, frontend-design, frontend-task-breakdown, backend-task-breakdown, backend-api-contract, backend-data-model, qa-test-cases, data-gtm-datalayer, ux-microcopy-write, ux-heatmap-analyze, ux-research-synthesize, detect-dev (detect mode pre-v4.1), learn-report, dev-stack-detect (deprecated) |
| To Test (C4) | 5 | backend-scaffold, frontend-scaffold, ux-flowchart-generate, release-iterate-changelog, detect-dev (light) |
| Not Relevant | 1 | wp-pr-review |
| Internal/Meta | 8 | skill-create, skill-update, docs-create, docs-update, learn-add, roadmap-add, roadmap-update, detect-pack |
