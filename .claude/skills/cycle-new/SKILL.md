---
name: cycle-new
description: |
  Autonomous Co-Evolution Loop executor — SCAN jaan-to for new skills,
  REVIEW & TEST each against Jaanify, BUILD product using exact jaan-to skills,
  GAP REPORT on what's missing. Goal: launch Jaanify to market and revenue.
  Auto-triggers on: new cycle, next cycle, run cycle, advance jaanify, launch cycle
allowed-tools: >-
  Read, Glob, Grep,
  Bash(git *), Bash(gh *),
  Write(gap-reports/**), Write(scorecards/**),
  Edit(gap-reports/**), Edit(scorecards/**),
  Edit(jaan-to/context/**), Edit(jaan-to/config/settings.yaml),
  Skill(jaan-to:*), Skill(gaps-critical-doc), Skill(gaps-critical-issue)
argument-hint: "[cycle-number] [--focus spec|scaffold|code|test|audit|gtm]"
user-invocable: true
---

# cycle-new

> Co-Evolution Loop executor: SCAN → REVIEW & TEST → BUILD → GAP REPORT.
> Goal: Launch Jaanify to market and generate revenue using only jaan-to skills.

## Context Files

Read these before execution:
- `.claude/skills/cycle-new/LEARN.md` — Past cycle lessons (loaded in Pre-Execution)
- `.claude/skills/cycle-new/template.md` — Cycle plan output template
- `$JAAN_CONTEXT_DIR/config.md` — Project configuration (cycle number, jaan-to version)
- `$JAAN_CONTEXT_DIR/tech.md` — Tech stack (Fastify v5, React 19, Next.js 15, PostgreSQL 16)
- `CLAUDE.md` — Project rules (**AUTHORITATIVE** — overrides all assumptions)

## Input

**Arguments**: $ARGUMENTS

Parse from arguments:
1. **Cycle number** — positive integer (e.g., `5`). If omitted, auto-detect by counting `gap-reports/*-cycle/` directories + 1.
2. **--focus** — optional scope filter: `spec`, `scaffold`, `code`, `test`, `audit`, `gtm`. If omitted, auto-detect from progress matrix bottleneck.

Validate: cycle number must be greater than the latest completed cycle.

---

# CO-EVOLUTION STEP 1: SCAN

> "Check https://github.com/parhumm/jaan-to/ for new/updated skills, agents, hooks"
> — CLAUDE.md Co-Evolution Loop, Step 1

---

## Phase 0: Pre-flight

### Step 0.1: Apply Past Lessons

**MANDATORY FIRST ACTION** — Before any other step, use the Read tool to read:
`.claude/skills/cycle-new/LEARN.md`

If the file exists, apply its lessons throughout this execution:
- Add questions from "Better Questions" to assessment steps
- Note edge cases from "Edge Cases" during progress calculation
- Follow workflow improvements from "Workflow"
- Avoid mistakes listed in "Common Mistakes"

If the file does not exist, continue without it.

### Step 0.2: Language Settings

**Read language preference** from `jaan-to/config/settings.yaml`:

1. Check for per-skill override: `language_cycle-new` field
2. If no override, use the global `language` field
3. Resolve:

| Value | Action |
|-------|--------|
| Language code (`en`, `fa`, `tr`, etc.) | Use that language for conversation |
| `"ask"` or field missing | Default to English — do NOT ask the user |

**Keep in English always**: all technical outputs (scan reports, scorecards, gap reports, commit messages), file paths, skill names, YAML keys.

### Step 0.3: Pull Latest jaan-to

**MANDATORY** — per CLAUDE.md: "Always pull latest before scanning."

```bash
git submodule update --remote --merge vendor/jaan-to
```

Detect version:
```bash
JAAN_VERSION=$(git -C vendor/jaan-to describe --tags --always 2>/dev/null || git -C vendor/jaan-to rev-parse --short HEAD)
JAAN_SHA=$(git -C vendor/jaan-to rev-parse HEAD)
```

Read `$JAAN_CONTEXT_DIR/config.md` and extract the previous jaan-to version. Record:
- Previous version (from config.md)
- Current version ($JAAN_VERSION)
- Commit SHA ($JAAN_SHA)
- Version delta (releases between previous and current)

### Step 0.4: Security Baseline Check

Per CLAUDE.md: "NEVER commit API keys, tokens, secrets, passwords, .env files."

Before any commits this cycle, verify no secrets exist in tracked files:
```bash
git diff --name-only HEAD | xargs grep -liE '(sk-|ghp_|token=|password=|api_key=|secret=)' 2>/dev/null || true
```

If any matches found, flag them and do NOT proceed until resolved.

---

## Phase 1: Assessment (Read-Only)

### Thinking Mode

megathink

Use extended reasoning for:
- Progress matrix calculation from concrete evidence
- Bottleneck classification from state machine
- Gap-to-skill mapping decisions
- Execution queue dependency ordering

### Step 1.1: Read All Project State

Read these files in parallel:
- `CLAUDE.md` — authoritative project rules
- PRD: Glob `$JAAN_OUTPUTS_DIR/pm/prd/*/` and read the latest PRD for feature baseline
- Latest gap report: Glob `gap-reports/*-cycle/*-gaps.md`, read the most recent
- Latest launch-gaps: Glob `gap-reports/*-cycle/*-launch-gaps.md`, read the most recent
- All scorecards: Glob `scorecards/*.md`, read each for skill quality map
- Config: `$JAAN_CONTEXT_DIR/config.md`
- Tech: `$JAAN_CONTEXT_DIR/tech.md`

Extract from PRD:
- Total features defined (MVP scope)
- Success metrics (what "launched" means)
- Target users (neurodivergent individuals, freelancers, solopreneurs)

Extract from latest launch-gaps:
- Gap inventory with P0-P3 priorities
- Critical path dependency chain
- Section F priority order (recommended next actions)
- Progress matrix from that report

Extract from scorecards:
- Build skill quality map: `{skill_name: {score, cycle, category, key_finding}}`
- Average score across all tested skills

### Step 1.2: Calculate Progress Matrix

**Concrete evidence only** — never estimate from memory.

**Specification %**:
Count spec deliverables that exist vs expected set:
- PRD, user stories, task breakdowns (FE + BE), API contract, data model, test cases, design system, UX research, microcopy, GTM tracking
- Formula: `(existing / total_expected) * 100`

**Scaffold %**:
- Glob `$JAAN_OUTPUTS_DIR/backend/scaffold/` and `$JAAN_OUTPUTS_DIR/frontend/scaffold/`
- Count files and check if they contain real content (not empty)
- Grep for `// TODO`, `throw new Error('Not implemented')` to count stub markers
- Formula: files with content / total expected scaffold files

**Production Code %**:
- Check for actual source code directories: `src/`, `app/`, `pages/` in project root
- Grep scaffold service files for non-stub implementations
- If all routes return TODO → production = 0%

**Tests %**:
- Count test files: `*.test.ts`, `*.spec.ts`, `*.test.tsx`
- Check for test configs: `vitest.config.*`, `playwright.config.*`
- Zero test files = 0% (config alone doesn't count)

**Infrastructure %**:
- Check for: `Dockerfile`, `docker-compose.*`, `.github/workflows/*.yml`
- Check for: `.env.example`, deployment configs

Build the matrix:

| Area | Specification | Scaffold | Production Code | Tests |
|------|---------------|----------|-----------------|-------|
| Backend | % | % | % | % |
| Frontend | % | % | % | % |
| Infrastructure | % | % | % | % |
| Marketing / GTM | % | % | % | % |
| **Overall** | **%** | **%** | **%** | **%** |

### Step 1.3: Read Gap Priorities

From latest `launch-gaps.md`:
- **Section B**: All gaps with priority (P0-P3), description, skill-exists status
- **Section C**: Summary table
- **Section D**: Critical path dependency diagram
- **Section F**: Priority order — this is the primary input to the decision engine

If no launch-gaps.md exists, build gap list from the regular gaps.md file.

### Step 1.4: Inventory Available jaan-to Skills

Glob `vendor/jaan-to/skills/*/SKILL.md` → full catalog.

For each skill, classify:

| Status | Criteria |
|--------|----------|
| **Tested** | Skill directory exists AND scorecard exists in `scorecards/` |
| **Untested** | Skill directory exists but NO scorecard |
| **Needs Retest** | Scorecard exists but score < 4.0 OR tested > 2 cycles ago |

Count totals:
- Total skills in catalog
- Tested with scorecard
- Untested (new since last scan)
- Needs retest

Compare against previous scan report to detect new/updated skills since last cycle.

### Step 1.5: Classify Bottleneck

Apply state machine based on progress matrix:

```
IF specification < 100%:
  BOTTLENECK = "ideation-to-spec"
  FOCUS_SKILLS = pm-prd-write, pm-story-write, frontend-task-breakdown,
                 backend-task-breakdown, backend-api-contract, backend-data-model

ELSE IF scaffold < 50% AND specification >= 80%:
  BOTTLENECK = "spec-to-scaffold"
  FOCUS_SKILLS = backend-scaffold, frontend-scaffold, frontend-design

ELSE IF production == 0% AND scaffold > 0%:
  BOTTLENECK = "scaffold-to-code"
  FOCUS_SKILLS = backend-scaffold (re-run with learn feedback),
                 frontend-scaffold (re-run with learn feedback),
                 pm-research-about (implementation strategies)

ELSE IF production > 0% AND tests == 0%:
  BOTTLENECK = "code-to-tested"
  FOCUS_SKILLS = qa-test-cases, detect-dev

ELSE IF tests > 0% AND infrastructure == 0%:
  BOTTLENECK = "tested-to-deployed"
  FOCUS_SKILLS = pm-research-about (CI/CD strategy)

ELSE IF all dimensions > 50%:
  BOTTLENECK = "quality-and-polish"
  FOCUS_SKILLS = detect-design, detect-writing, detect-product, detect-ux,
                 detect-pack, ux-flowchart-generate, release-iterate-changelog
```

Record the bottleneck classification and focus skills.

### Step 1.6: Map Every Gap → Exact jaan-to Skill(s)

FOR EACH open gap in the launch-gaps summary table:

1. **Find matching jaan-to skill(s)** from the catalog that can address this gap
2. **If direct match exists**: Add `Skill(jaan-to:{skill-name})` with specific arguments
3. **If no direct match but close skill exists**: Add `Skill(jaan-to:learn-add {skill})` to request improvement + `Skill(jaan-to:{skill-name})` to re-run with feedback
4. **If no skill exists at all**: Add `Skill(jaan-to:pm-research-about)` to research the approach, then mark for `/gaps-critical-issue` to request new skill creation

**RULE**: Every gap MUST map to at least one exact jaan-to skill invocation. No manual work items.

Build the complete gap-to-skill mapping table.

---

# CO-EVOLUTION STEP 2: REVIEW & TEST

> "Test new features with Jaanify context, score on scorecard"
> — CLAUDE.md Co-Evolution Loop, Step 2

---

## Phase 2: Decision Engine

### Step 2.1: Build Execution Queue

The execution queue is an ordered list of exact jaan-to skill invocations. Build it from 6 sources in priority order:

**Source 1 — P0 Gap Resolution**

For each P0 gap, add the mapped jaan-to skills from Step 1.6.

Current P0 gaps and their skill mappings:

| Gap | jaan-to Skill Invocations |
|-----|--------------------------|
| L-01 Service Implementation | 1. `/jaan-to:learn-add backend-scaffold "generate real business logic in service stubs instead of TODO comments; use Prisma queries from data model; implement auth flows with jose library"` |
| | 2. `/jaan-to:pm-research-about "best practices for generating Fastify v5 service implementations from OpenAPI 3.1 + Prisma v6 schemas"` |
| | 3. `/jaan-to:backend-scaffold` (re-run with updated learn feedback) |
| L-02 Integration / Wiring | 1. `/jaan-to:learn-add frontend-scaffold "output individual component files instead of single bundled .tsx; generate app entry point and provider wiring"` |
| | 2. `/jaan-to:pm-research-about "how to wire Next.js 15 App Router scaffold components into runnable project with path aliases and providers"` |
| | 3. `/jaan-to:frontend-scaffold` (re-run with updated learn feedback) |
| L-03 Test Stub Generation | 1. `/jaan-to:learn-add backend-scaffold "generate vitest test stubs for each route handler and service function alongside scaffold code"` |
| | 2. `/jaan-to:learn-add frontend-scaffold "generate vitest + testing-library test stubs for each component alongside scaffold code"` |
| | 3. `/jaan-to:qa-test-cases` (re-run if stale — check if BDD scenarios cover new scaffolded code) |

**Source 2 — P1 Gap Resolution**

| Gap | jaan-to Skill Invocations |
|-----|--------------------------|
| L-04 Security Hardening | 1. `/jaan-to:learn-add backend-scaffold "replace decodeJwt with jose library for JWT verification; add @fastify/rate-limit middleware; use httpOnly cookies instead of localStorage for token storage; add CSRF protection"` |
| | 2. `/jaan-to:detect-dev` (re-run after any code changes to verify fixes) |
| L-05 CI/CD Scaffold | 1. `/jaan-to:pm-research-about "GitHub Actions CI/CD pipeline for Fastify v5 + Next.js 15 monorepo with Prisma migrations, Docker, PostgreSQL 16"` |

**Source 3 — New/Untested Skills**

Skills from the catalog with NO scorecard (must test against Jaanify):
- `/jaan-to:detect-design` — fills detect domain 2/5
- `/jaan-to:detect-writing` — fills detect domain 3/5
- `/jaan-to:detect-product` — fills detect domain 4/5
- `/jaan-to:detect-ux` — fills detect domain 5/5
- `/jaan-to:ux-flowchart-generate` — user flow + system flow Mermaid diagrams
- `/jaan-to:docs-create` — project documentation generation
- `/jaan-to:docs-update` — documentation staleness audit

Only include skills relevant to Jaanify's current state and the bottleneck classification.

**Source 4 — Market / GTM Skills (Revenue Focus)**

The goal is market launch and revenue. Include GTM skills:
- `/jaan-to:pm-research-about "Jaanify go-to-market strategy for AI task manager targeting neurodivergent users and freelancers"` (if not done previously)
- `/jaan-to:frontend-design` (landing page / marketing screens — if needed)
- `/jaan-to:ux-microcopy-write` (if new screens added this cycle)
- `/jaan-to:data-gtm-datalayer` (if new tracking events needed)

**Source 5 — Learn Feedback Submissions**

For each gap where an existing skill is insufficient, queue:
- `/jaan-to:learn-add {skill-name} "{specific improvement request}"`

These feed the co-evolution loop: jaan-to learns from Jaanify's needs.

**Source 6 — Always-Run Closing Skills**

These run at the end of every cycle:
- `/jaan-to:detect-pack` — consolidate all detect outputs (ONLY if >= 3/5 domains analyzed)
- `/jaan-to:release-iterate-changelog` — update CHANGELOG.md with this cycle's changes
- `/gaps-critical-doc` — launch readiness analysis (local skill)

### Queue Rules

1. **Maximum 12 skill invocations** per cycle (token budget cap). If more are needed, defer lower-priority items.
2. **Priority order**: P0 gaps → P1 gaps → untested skills → GTM/market → re-tests → closing skills.
3. **Dependency order**: L-01 before L-04 (security hardening needs real code). detect-* before detect-pack. learn-add before scaffold re-runs.
4. **Every item = exact jaan-to skill** with explicit arguments. Zero manual work items.
5. **If --focus flag provided**: Filter queue to only include items matching the focus area.

### Step 2.2: Resolve Unknowns Autonomously

For ANY decision where existing docs/scorecards/gap reports don't provide enough context:

1. Invoke `/jaan-to:pm-research-about "{targeted question about the specific unknown}"`
2. Read the research output
3. Make a decision based on the research findings
4. Document in the decision log: `Decision: X | Rationale: Y | Source: research at {path}`

**NEVER ask the user for decisions.** The only user interaction is the HARD STOP cycle plan approval.

Examples of decisions to make autonomously:
- "Should we re-run backend-scaffold or wait for learn feedback to take effect?" → Research, decide, document.
- "Which detect skills are most valuable for current state?" → Check detect-pack learn.md lesson about 3/5 minimum, decide, document.
- "Is it worth running ux-flowchart-generate before production code exists?" → Research value of early flow diagrams, decide, document.

### Step 2.3: Generate Cycle Plan

Write structured plan to `gap-reports/{NN}-cycle/{NN}-plan.md` using `.claude/skills/cycle-new/template.md`:

- Cycle number and date
- jaan-to version delta
- Bottleneck classification with rationale
- Execution queue (ordered table: # | Exact jaan-to Skill | Addresses | Expected Output | Rationale)
- Market impact assessment (which dimension advances, which revenue blocker is addressed)
- Deferred items (gaps that need NEW jaan-to skills — will request via `/gaps-critical-issue`)
- Autonomous decision log (every decision made without user input)
- Expected outcomes (target progress matrix after this cycle)

---

# HARD STOP — Cycle Plan Review

Present the complete plan:

```
CYCLE {N} PLAN — JAANIFY CO-EVOLUTION
────────────────────────────────────────
jaan-to: {prev_version} → {curr_version} (SHA: {short_sha})
Bottleneck: {classification}
New skills detected: {n}

PROGRESS MATRIX (current):
  Specification: {n}%  |  Scaffold: {n}%  |  Production: {n}%  |  Tests: {n}%

EXECUTION QUEUE ({n} jaan-to skill invocations):
  1. /jaan-to:{skill} — {purpose}
  2. /jaan-to:{skill} — {purpose}
  ...
  N. /gaps-critical-doc — launch readiness analysis

MARKET IMPACT:
  This cycle advances: {which dimensions move forward}
  Revenue blocker addressed: {which gap(s)}

DEFERRED (needs new jaan-to skills — will request via /gaps-critical-issue):
  - {gap}: {description}

AUTONOMOUS DECISIONS:
  1. {decision} — {rationale} — Source: {source}
```

> "Proceed with Cycle {N}? [y/n]"

**Do NOT proceed to Phase 3 without explicit approval.**

After approval, execution is **FULLY AUTONOMOUS**. No more questions.
Child jaan-to skills retain their own HARD STOPs — approve those individually based on analysis quality.

---

# CO-EVOLUTION STEP 3: BUILD

> "Advance Jaanify using all available jaan-to skills"
> — CLAUDE.md Co-Evolution Loop, Step 3

---

## Phase 3: Execution (Fully Autonomous After Approval)

### Step 3.1: Write Scan Report

Write `gap-reports/{NN}-cycle/{NN}-scan.md` following the format from previous scan reports:

- Header: Date, jaan-to version (tag + commit SHA), previous version, version delta
- Version delta summary table
- Release-by-release changelog (from submodule git log between versions)
- New skills to test this cycle
- Impact on existing artifacts
- Cumulative skill coverage (tested / untested / not relevant / internal)

**Record jaan-to version (tag + commit SHA)** — per CLAUDE.md: "Record jaan-to version in every scan."

**Security scan before commit**:
```bash
git add "gap-reports/{NN}-cycle/{NN}-scan.md"
git diff --cached | grep -iE '(sk-|ghp_|token=|password=|api_key=)' || true
```

Commit: `docs(cycle-{N}): scan report for jaan-to {version}`

### Step 3.2: Update Config

Edit `$JAAN_CONTEXT_DIR/config.md`:
- `jaan-to Version` → new version tag + skill count
- `Stage` → current stage (e.g., "Implementation (Cycle {N})")
- Cycle number in metadata

**Update at cycle START** — per LEARN.md: "Config.md is read by other skills — stale config = wrong version references."

Commit: `chore(cycle-{N}): update config to jaan-to {version}`

### Step 3.3: Execute Skill Queue

FOR EACH item in the execution queue:

**3.3.1 — Invoke the exact jaan-to skill**:
```
Skill(jaan-to:{skill-name}, args: "{arguments}")
```

Wait for skill to complete. If the skill presents a HARD STOP, the user will approve it — this is expected behavior for child skills.

**3.3.2 — Record outputs**:
- File paths written/modified
- Key metrics (endpoints generated, components created, findings count, etc.)
- Any errors or issues encountered
- Score assessment (preliminary)

**3.3.3 — Write scorecard immediately**:
Per CLAUDE.md: "Write per-skill scorecards in scorecards/{skill-name}.md"

Write `scorecards/{skill-name}.md` with:
```markdown
# Scorecard: {skill-name}

> Tested: {YYYY-MM-DD} | jaan-to {version} (SHA: {short_sha}) | Cycle {N}
> Skill version: {version from SKILL.md or tag}

---

## Score: {X.X} / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | X/5 | {notes} |
| Output Quality | 25% | X/5 | {notes} |
| Context Awareness | 20% | X/5 | {notes} |
| Learning Integration | 15% | X/5 | {notes} |
| Workflow Efficiency | 10% | X/5 | {notes} |

---

## Strengths
{numbered list}

## Issues
{numbered list}

## Gaps Discovered
{bullet list}
```

If the scorecard already exists (skill re-tested), update it with the new score and add a "Re-tested" note comparing to previous score.

**3.3.4 — Security scan before commit**:
```bash
git diff --cached | grep -iE '(sk-|ghp_|token=|password=|api_key=)' || true
```
If secrets found: unstage the file, warn in output, do NOT commit. Move to next skill.

**3.3.5 — Commit skill output**:
Per CLAUDE.md: "Commit after each completed task — never batch multiple tasks into one commit."

```bash
git add {output-files}
git commit -m "{type}(cycle-{N}): {skill-name} — {1-line summary}

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**3.3.6 — Commit scorecard**:
```bash
git add "scorecards/{skill-name}.md"
git commit -m "docs(cycle-{N}): {skill-name} scorecard ({score}/5)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Error handling**: If a skill fails or produces unusable output:
- Scorecard it with the failure details (score the attempt, not 0)
- Note the failure in the cycle plan
- Move to the next item in the queue
- Maximum 1 retry per skill per cycle

### Step 3.4: Submit Learn Feedback

After executing all queued skills, submit learn feedback for each gap where an existing skill is insufficient:

```
Skill(jaan-to:learn-add, args: "{skill-name} \"{specific improvement request based on this cycle's findings}\"")
```

Commit each: `chore(cycle-{N}): learn-add feedback for {skill-name}`

This feeds the co-evolution loop — jaan-to improves from Jaanify's real-world usage.

---

# CO-EVOLUTION STEP 4: GAP REPORT

> "Document missing skills, request top priorities from user"
> — CLAUDE.md Co-Evolution Loop, Step 4

---

## Phase 4: Audit + Close

### Step 4.1: Run Remaining Detect Skills

If detect coverage is < 5/5 domains, run the missing ones:
- `/jaan-to:detect-design` — Design system detection with drift findings
- `/jaan-to:detect-writing` — Writing system extraction, NNg tone dimensions
- `/jaan-to:detect-product` — Product reality extraction, monetization scanning
- `/jaan-to:detect-ux` — UX audit with journey mapping

Scorecard + commit each individually.

### Step 4.2: Consolidate Detect

**Only run if >= 3/5 detect domains are available** — per LEARN.md: "Don't run detect-pack with < 3/5 domains (weak consolidation)."

If threshold met:
```
Skill(jaan-to:detect-pack)
```

Scorecard + commit.

### Step 4.3: Update Changelog

```
Skill(jaan-to:release-iterate-changelog)
```

This adds this cycle's entries to `$JAAN_OUTPUTS_DIR/CHANGELOG.md`.
Scorecard + commit.

### Step 4.4: Write Cycle Gap Report

Write `gap-reports/{NN}-cycle/{NN}-gaps.md` following the established format:

- **Section A — Cycle {N} Results**: Skills tested (table with score), deliverables produced, commits made
- **Section B — Launch Readiness Assessment**: Updated progress matrix (calculated fresh, not from memory)
- **Section C — Gaps Identified**: Gaps resolved this cycle, new gaps discovered, gaps still open from previous cycles
- **Section D — Skill Quality Summary**: Cumulative scores across all cycles
- **Section E — Priority Skills for Next Cycle**: List priorities but do **NOT** pre-plan (per CLAUDE.md "Never Do: Pre-plan future cycles")
- **Section F — Co-Evolution Loop Status**: ASCII diagram showing cycle progression

**Record jaan-to version** in report header — per CLAUDE.md.

### Step 4.5: Market Readiness Assessment

Include in the gap report a "Market Readiness" subsection:

1. **What's needed for first paying user?** — Reference PRD success metrics as baseline
2. **Which gaps block revenue?** — Map P0/P1 gaps to revenue impact
3. **What can be launched in current state?** — Even partial launch options
4. **GTM strategy status** — Has pm-research-about been used for market research?
5. **Recommend next GTM actions** — Which jaan-to skills to use for market advancement

### Step 4.6: Run /gaps-critical-doc

Invoke the local skill:
```
Skill(gaps-critical-doc, args: "{cycle-number}")
```

This produces `gap-reports/{NN}-cycle/{NN}-launch-gaps.md` with:
- Full deliverable inventory
- P0-P3 gap classification
- Critical path diagram
- Skill inventory (exists/untested/needed)
- Cycle-over-cycle delta

Commit: `docs(cycle-{N}): launch readiness gap analysis via gaps-critical-doc`

### Step 4.7: Final Commits

Commit all remaining Phase 4 outputs **individually** (one commit per file):
- Gap report: `docs(cycle-{N}): gap report with launch readiness update`
- Any other modified files

### Step 4.8: Feedback Capture

> "Cycle {N} complete. Any feedback on this cycle? [y/n]"

If yes → append to `.claude/skills/cycle-new/LEARN.md` under the appropriate section (Better Questions, Edge Cases, Workflow, or Common Mistakes).

---

## CLAUDE.md Rules Enforcement Checklist

Every cycle execution MUST satisfy all of these (from CLAUDE.md "Always Do" and "Never Do"):

### Always Do
- [x] Record jaan-to version (tag/commit SHA) in every scan, scorecard, and gap report
- [x] Use jaan-to skills for ALL product work — no shortcuts outside the plugin
- [x] Write per-skill scorecards in scorecards/{skill-name}.md
- [x] Write gap reports in gap-reports/NN-cycle/NN-{scan|gaps}.md
- [x] Verify skill outputs match jaan-to documentation
- [x] Check v3.0.0 compliance: env vars, ID structure, no hardcoded paths
- [x] Commit after each completed task — never batch multiple tasks into one commit

### Never Do
- [x] Never skip the jaan-to scan at cycle start → Step 0.3 is mandatory
- [x] Never commit without checking for secrets → Step 3.3.4 scans before every commit
- [x] Never use hardcoded jaan-to/ paths → All refs use $JAAN_* env vars
- [x] Never pre-plan future cycles → Section E lists priorities only, no plan
- [x] Never write heavy test reports → Scorecards are lightweight and actionable

---

## Definition of Done

**Co-Evolution Loop compliance:**
- [ ] SCAN: Submodule pulled to latest, version delta detected
- [ ] SCAN: Scan report written to `gap-reports/{NN}-cycle/{NN}-scan.md`
- [ ] SCAN: jaan-to version (tag + SHA) recorded in scan, every scorecard, and gap report
- [ ] REVIEW & TEST: Each new/relevant skill tested against Jaanify context
- [ ] REVIEW & TEST: Per-skill scorecard written for every skill invoked
- [ ] BUILD: All queued skills executed — ONLY jaan-to plugin skills, no shortcuts
- [ ] BUILD: Each task committed individually (never batched)
- [ ] BUILD: No secrets committed (security scan before each commit)
- [ ] GAP REPORT: `gap-reports/{NN}-cycle/{NN}-gaps.md` written with Sections A-F
- [ ] GAP REPORT: `/gaps-critical-doc` invoked → `launch-gaps.md` written
- [ ] GAP REPORT: Section E lists priorities but does NOT pre-plan next cycle

**Market readiness:**
- [ ] Progress matrix shows measurable advancement toward launch
- [ ] Market readiness assessment included in gap report
- [ ] GTM gaps identified and flagged for next cycle

**Quality:**
- [ ] Detect coverage expanded (target: 5/5 domains)
- [ ] CHANGELOG updated via release-iterate-changelog
- [ ] Learn feedback submitted for all insufficient skills
- [ ] All outputs use $JAAN_* env vars (v3.0.0 compliance)
- [ ] User feedback captured (if provided)