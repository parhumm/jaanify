---
name: gaps-critical-doc
description: Launch readiness gap analysis with prioritized skills inventory and cycle-over-cycle tracking.
allowed-tools: Read, Glob, Grep, Write(gap-reports/**), Edit(jaan-to/config/settings.yaml)
argument-hint: "[cycle-number]"
user-invocable: true
---

# gaps-critical-doc

> Launch readiness gap analysis with prioritized skills inventory and cycle-over-cycle tracking.

## Context Files

Read these before execution:
- `$JAAN_LEARN_DIR/gaps-critical-doc.learn.md` - Past lessons (loaded in Pre-Execution)
- `.claude/skills/gaps-critical-doc/template.md` - Output template
- `$JAAN_CONTEXT_DIR/config.md` - Project configuration and skill catalog
- `$JAAN_CONTEXT_DIR/tech.md` - Tech stack (for implementation gap assessment)

**Output path**: `gap-reports/{NN}-cycle/{NN}-launch-gaps.md` — stored alongside other cycle gap reports.

## Input

**Arguments**: $ARGUMENTS

Parse cycle number from arguments. If not provided, auto-detect by counting `gap-reports/*-cycle/` directories.

Validate: cycle number must be a positive integer.

---

# PHASE 1: Analysis (Read-Only)

## Pre-Execution: Apply Past Lessons

**MANDATORY FIRST ACTION** — Before any other step, use the Read tool to read:
`$JAAN_LEARN_DIR/gaps-critical-doc.learn.md`

If the file exists, apply its lessons throughout this execution:
- Add questions from "Better Questions" to data gathering steps
- Note edge cases from "Edge Cases" during inventory and classification
- Follow workflow improvements from "Workflow"
- Avoid mistakes listed in "Common Mistakes"

If the file does not exist, continue without it.

### Language Settings

**Read language preference** from `jaan-to/config/settings.yaml`:

1. Check for per-skill override: `language_gaps-critical-doc` field
2. If no override, use the global `language` field
3. Resolve:

| Value | Action |
|-------|--------|
| Language code (`en`, `fa`, `tr`, etc.) | Use that language immediately |
| `"ask"` or field missing | Prompt: "What language do you prefer for the launch readiness report?" — then save choice to `jaan-to/config/settings.yaml` |

**Keep in English always**: technical terms, file paths, variable names, YAML keys, gap IDs, skill names.

## Thinking Mode

megathink

Use extended reasoning for:
- Cross-referencing gaps across cycles
- Progress matrix calculation from evidence
- Gap dependency analysis for critical path
- Priority classification decisions

## Step 1: Discover Project Structure

Glob to verify these directories exist:
- `gap-reports/` — cycle gap reports
- `scorecards/` — skill quality scorecards
- `$JAAN_OUTPUTS_DIR/` — generated deliverables
- `$JAAN_OUTPUTS_DIR/pm/prd/` — PRD (product requirements)
- `vendor/jaan-to/skills/` — available jaan-to skills

If any critical path is missing, warn the user and note which data will be absent from the report. Continue with available data.

## Step 2: Read PRD (Feature Baseline)

Read the PRD from `$JAAN_OUTPUTS_DIR/pm/prd/`. Extract:
- Total features defined
- MVP scope boundaries
- Success metrics
- Expected deliverables for launch

This establishes the "what we promised" baseline. All gaps are measured against this.

**Important**: Read the PRD FIRST before inventorying deliverables. The baseline must come from requirements, not assumptions.

## Step 3: Read All Gap Reports

Glob `gap-reports/*/*.md` and read every gap report file across all cycles.

For each gap, extract:
- Gap ID and description
- Severity / priority
- Resolution status (resolved, open, new)
- Which cycle discovered it
- Which cycle resolved it (if resolved)
- Category (infra, scaffold, security, workflow, detect)

Build a **cumulative gap registry**:
```
{gap_id: {description, discovered_cycle, resolved_cycle, severity, category, status}}
```

Track resolution velocity: gaps resolved per cycle.

## Step 4: Read All Scorecards

Glob `scorecards/*.md` and read each scorecard file.

For each scorecard, extract:
- Skill name
- Score (X/5)
- Cycle tested
- Category (planning, dev, UX, QA, data, audit, release, meta)
- Key findings or limitations

Build a **skill quality map**:
```
{skill_name: {score, cycle, category, key_finding}}
```

## Step 5: Inventory Existing Deliverables

Glob `$JAAN_OUTPUTS_DIR/**/` recursively and build a deliverable inventory.

Check existence and read file headers/frontmatter (not full content) for key metrics:

| Category | Path Pattern | What to Check |
|----------|-------------|---------------|
| PRD | `$JAAN_OUTPUTS_DIR/pm/prd/*/` | Feature count, MVP scope |
| User Stories | `$JAAN_OUTPUTS_DIR/pm/stories/*/` | Story count, Gherkin ACs |
| Frontend Tasks | `$JAAN_OUTPUTS_DIR/frontend/*/` (non-scaffold) | Task count |
| Backend Tasks | `$JAAN_OUTPUTS_DIR/backend/*/` (non-scaffold) | Task count, vertical slices |
| API Contract | `$JAAN_OUTPUTS_DIR/dev/contract/*/` | Endpoint count, OpenAPI version |
| Data Model | `$JAAN_OUTPUTS_DIR/backend/*data-model*/` | Table count, DDL |
| Test Cases | `$JAAN_OUTPUTS_DIR/qa/cases/*/` | BDD scenario count |
| Design System | `$JAAN_OUTPUTS_DIR/dev/components/*/` | Component preview count |
| Microcopy | `$JAAN_OUTPUTS_DIR/ux/content/*/` | Language count, item count |
| UX Research | `$JAAN_OUTPUTS_DIR/ux/research/*/` | Theme count |
| UX Heatmap | `$JAAN_OUTPUTS_DIR/ux/heatmap/*/` | Screen count |
| GTM DataLayer | `$JAAN_OUTPUTS_DIR/data/gtm/*/` | Event count |
| Backend Scaffold | `$JAAN_OUTPUTS_DIR/backend/scaffold/*/` | Route count, model count |
| Frontend Scaffold | `$JAAN_OUTPUTS_DIR/frontend/scaffold/*/` | Component count, hook count |
| Detect Outputs | `$JAAN_OUTPUTS_DIR/detect/*/` | Domain count (X/5) |
| CHANGELOG | `$JAAN_OUTPUTS_DIR/CHANGELOG.md` | Version entries |

Also check for (outside $JAAN_OUTPUTS_DIR):
- **Infrastructure**: `Dockerfile`, `.github/workflows/`, `docker-compose.yml`, deployment configs
- **Test files**: `*.test.ts`, `*.spec.ts`, `vitest.config.*`, `playwright.config.*`
- **Marketing**: Landing page assets, public-facing docs

Record each deliverable with: exists (yes/no), cycle created, skill used, key metric.

## Step 6: Calculate Implementation Progress Matrix

Score each area across 4 dimensions using **concrete evidence only**:

### Specification %
Count spec deliverables that exist vs expected set:
- PRD, user stories, task breakdowns (FE + BE), API contract, data model, test cases, design system, UX research

Formula: `(existing_spec_deliverables / total_expected) * 100`

### Scaffold %
Check scaffold outputs:
- Backend scaffold files exist?
- Frontend scaffold files exist?
- Do scaffold files contain implementation or only stubs?

Grep scaffold files for stub markers: `// TODO`, `// implement`, `throw new Error('Not implemented')`
- If all handlers are stubs → scaffold exists but is stub-only
- If some handlers have real logic → partial scaffold

### Production Code %
- Grep for non-stub implementations in scaffold service files
- Check for actual source code directories (src/, app/, pages/)
- If all routes return TODO → production = 0%

### Tests %
- Count test files: `*.test.ts`, `*.spec.ts`, `*.test.tsx`
- Check for test config: `vitest.config.*`, `playwright.config.*`, `jest.config.*`
- If zero test files exist → tests = 0% (config alone doesn't count)

### Areas
Calculate for each row:

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | % | % | % | % |
| Frontend | % | % | % | % |
| Infrastructure | % | % | % | % |
| Marketing / GTM | % | % | % | % |
| **Overall** | **%** | **%** | **%** | **%** |

## Step 7: Inventory jaan-to Skills

Glob `vendor/jaan-to/skills/*/SKILL.md` to get the full skill catalog.

For each gap identified (from Step 3 + new gaps from Steps 5-6), classify:

| Status | Criteria |
|--------|----------|
| **Exists + Tested** | Skill directory exists AND scorecard exists in `scorecards/` |
| **Exists + Untested** | Skill directory exists but NO scorecard |
| **Does Not Exist** | No matching skill in vendor/jaan-to/skills/ |
| **Exists but Insufficient** | Skill exists and tested but scored below 3.0 or has documented limitations that prevent addressing the gap |

Count totals:
- Skills needing creation (new skills)
- Skills needing improvement
- Skills available but untested
- Gaps already addressable with existing tested skills

## Step 8: Read Previous gaps-critical-doc Output

Glob `gap-reports/*-cycle/*-launch-gaps.md` to find the most recent previous output.

If found, read it and extract:
- Previous progress matrix percentages
- Previous gap list with priorities and IDs
- Previous summary table
- Previous cycle number

This enables cycle-over-cycle delta calculation in Step 11.

If no previous output exists, note: "First run — no delta available."

## Step 9: Classify and Prioritize Gaps (P0–P3)

Combine all gaps from:
- Cumulative gap registry (Step 3) — open gaps from previous cycles
- New gaps discovered during inventory (Steps 5-6) — missing deliverables, missing skills
- Security findings from detect outputs (if detect-dev has run)

Apply these priority criteria:

### P0 — Launch Blockers
Product cannot function at all without this.
- 0% production code in a critical area (backend services, frontend components)
- No runnable application (scaffolds not wired into project structure)
- No test infrastructure (0 test files = no quality confidence)
- No way to start the application (`dev`, `build`, `start` scripts fail)

### P1 — Security & Deploy
Product functions but cannot be safely released to users.
- Critical or High severity security findings from detect-dev audit
- No deployment pipeline (CI/CD, Docker, hosting)
- Authentication/authorization vulnerabilities
- No rate limiting on public endpoints

### P2 — GTM Essentials
Product works and is safe but users cannot find or learn it.
- No public-facing landing page or marketing site
- No user-facing documentation (help center, onboarding guide)
- Incomplete quality audit (detect suite < 3/5 domains)
- No hosted API documentation

### P3 — Quality of Life
Improvements that enhance quality but do not block launch.
- UX flowcharts, architecture diagrams
- Monitoring and observability infrastructure
- Low-severity findings from detect audits
- Documentation enhancements

For each gap, assign:
- **Gap ID**: `L-{NN}` format, sequential (L-01, L-02, ...)
- **Priority**: P0 / P1 / P2 / P3
- **Title**: Short descriptive name
- **Description**: What the gap is and why it matters
- **Key Points**: Bullet list of critical details
- **Expected Outputs**: What addressing this gap would produce
- **Skill Exists?**: From Step 7 classification
- **Blocks**: What other work this gap prevents
- **Related Gaps**: Cross-reference to gap IDs from previous cycles (#N format)

## Step 10: Build Critical Path

Analyze gap dependencies to identify the longest chain to launch:

1. Map which gaps block other gaps (from the "Blocks" field)
2. Build a dependency graph
3. Identify the critical path (longest chain from P0 gaps to "Launch")
4. Express as ASCII diagram:

```
L-01 ──→ L-04 ──→ L-05 ──→ Launch
L-02 ──────────────↗
L-03 ──────────────↗
```

Note the critical path length and what determines the minimum time to launch.

## Step 11: Compute Cycle-Over-Cycle Delta

**If previous output exists** (from Step 8):

Calculate:
- **Gaps resolved** since last run (were in previous, now resolved)
- **New gaps** discovered (not in previous output)
- **Progress matrix deltas**: e.g., "Scaffold: 0% → 25% (+25)"
- **Scorecard trends**: skills with improved/degraded scores
- **Gap count changes**: total, by priority level

Present as delta table:
| Metric | Cycle {N-1} | Cycle {N} | Delta |
|--------|-------------|-----------|-------|

**If no previous output exists**:

Note: "First run of gaps-critical-doc. No previous data for delta comparison. Future cycles will show progress changes here."

---

# HARD STOP — Human Review Gate

Present the analysis summary before writing:

```
LAUNCH READINESS ANALYSIS — CYCLE {N}
────────────────────────────────────────

DELIVERABLES FOUND: {n} across {m} categories
GAPS IDENTIFIED: {total} (P0: {n}, P1: {n}, P2: {n}, P3: {n})

IMPLEMENTATION PROGRESS
  Specification: {n}%  |  Scaffold: {n}%  |  Production: {n}%  |  Tests: {n}%

SKILLS INVENTORY
  New skills needed:        {n}
  Skills need improvement:  {n}
  Existing but untested:    {n}
  Gaps resolved:            {n}

{if delta exists:}
CYCLE DELTA (vs Cycle {N-1})
  Gaps resolved: {n}  |  New gaps: {n}
  Progress: Scaffold {old}% → {new}%, Production {old}% → {new}%

OUTPUT:
  gap-reports/{NN}-cycle/{NN}-launch-gaps.md
```

> "Proceed with writing launch readiness report? [y/n]"

**Do NOT proceed to Phase 2 without explicit approval.**

---

# PHASE 2: Generation (Write Phase)

## Step 12: Generate Output Path

Derive the output path from the cycle number:

1. `CYCLE` = cycle number from input
2. `CYCLE_PAD` = zero-padded to 2 digits (e.g., "03", "04")
3. `OUTPUT_FOLDER` = `gap-reports/${CYCLE_PAD}-cycle/`
4. `MAIN_FILE` = `${OUTPUT_FOLDER}/${CYCLE_PAD}-launch-gaps.md`

Create the output folder if it doesn't exist.

## Step 13: Write Report

Use the template from `.claude/skills/gaps-critical-doc/template.md` as the structural guide.

Fill all template variables with data gathered in Phase 1. The output file must include:

### YAML Frontmatter
- title, cycle, date, jaan_to_version
- gap_summary (total, p0, p1, p2, p3, new_skills_needed, improvements_needed, untested)
- progress (specification, scaffold, production, tests percentages)

### Executive Summary
1-2 paragraph overview of launch readiness state and most critical findings.

### Section A — Current State
- Implementation progress matrix table (from Step 6)
- Deliverable inventory table (from Step 5): Deliverable | Cycle | Skill | Key Metric

### Section B — Launch & GTM Gap Analysis
For each priority level (P0 through P3), list all gaps with:

#### Gap L-{NN}: {Title}

| Field | Detail |
|-------|--------|
| **What** | {description} |
| **Exists in jaan-to?** | {skill status from Step 7} |
| **Related gap** | {cross-reference to #N IDs from previous cycles} |
| **Blocks** | {what this gap prevents} |

**Key points:**
{bullet list}

**Expected outputs:**
{bullet list}

### Section C — Summary Table
| Priority | Gap ID | Gap | Exists in jaan-to? | Blocks |
Quick-reference for all gaps.

Plus counts: skills to create, skills to improve, existing untested.

### Section D — Critical Path
ASCII dependency diagram (from Step 10) with explanation.

### Section E — Cycle-Over-Cycle Delta
Delta table, resolved gaps, new gaps, score trends (from Step 11).
Or "first run" note if no previous data.

### Section F — Recommendations
- Immediate actions (numbered list)
- Priority order table: Step | Action | Unblocks

### Metadata Table
| Field | Value |
Date, output path, skill name, version 3.0, status.

### Bottom Line
Single-paragraph takeaway.

Write the complete report to `MAIN_FILE`.

## Step 14: Quality Check

Before confirming, verify:
- [ ] All gaps have L-NN ID, priority, title, description, key points, outputs, skill-exists status, blocks
- [ ] Progress matrix uses concrete evidence (not estimates from memory)
- [ ] Summary table matches gap analysis section (no mismatches)
- [ ] Critical path diagram is consistent with gap dependencies
- [ ] Delta section matches actual differences (or first-run note)
- [ ] No hardcoded paths (all use $JAAN_* variables in references)
- [ ] Executive summary accurately reflects the data

If any check fails, fix before confirming.

## Step 15: Capture Feedback

> "Any feedback on the launch readiness analysis? [y/n]"

If yes:
> "[1] Fix now  [2] Learn for future  [3] Both"

- **Option 1**: Revise output, re-write
- **Option 2**: Run `/jaan-to:learn-add gaps-critical-doc "{feedback}"`
- **Option 3**: Do both

## Step 16: Suggest Issue Creation

> "Run `/gaps-critical-issue` to create GitHub issues from these gaps? [y/n]"

---

## Definition of Done

- [ ] PRD read and feature baseline established
- [ ] All cycle gap reports read (gap-reports/*/)
- [ ] All scorecards read (scorecards/*.md)
- [ ] Deliverable inventory complete ($JAAN_OUTPUTS_DIR/**)
- [ ] Implementation progress matrix calculated with concrete evidence
- [ ] jaan-to skills catalog inventoried (vendor/jaan-to/skills/)
- [ ] Previous gaps-critical-doc output read for delta (or first-run noted)
- [ ] All gaps classified with P0–P3 priority levels
- [ ] Each gap has: L-NN ID, title, description, key points, expected outputs, skill-exists status, blocks, related gaps
- [ ] Critical path dependency diagram generated
- [ ] Cycle-over-cycle delta computed (or first-run noted)
- [ ] Summary table includes all gaps with priority/exists/blocks columns
- [ ] Recommendations for next cycle provided
- [ ] Output written to `gap-reports/{NN}-cycle/{NN}-launch-gaps.md`
- [ ] User approved output