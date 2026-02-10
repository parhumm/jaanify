# Lessons: cycle-new

> Seeded from manual Cycles 1-4 (2026-02-07 through 2026-02-09).
> Last updated: 2026-02-10

Accumulated lessons from past co-evolution cycles. Read this before planning any new cycle to avoid past mistakes and apply learned improvements.

---

## Better Questions

Questions to check during cycle assessment:

### Plugin Cache vs Submodule Version (2026-02-09)

**Context**: Cycle 4 — `ux-flowchart-generate` skill existed in v4.5.0 submodule but was not available in v4.4.0 plugin cache. Skill invocation failed silently.

**What to check**:
- Compare submodule version (`git -C vendor/jaan-to describe --tags`) with cached plugin version
- If mismatch: note which skills may be unavailable and flag in scan report
- Check `vendor/jaan-to/.claude-plugin/plugin.json` for the cached version

### Upstream Specs Before Scaffold (2026-02-09)

**Context**: Scaffold skills produce generic output without proper input specs.

**What to check**:
- Before running `backend-scaffold`: verify API contract, data model, and task breakdown exist
- Before running `frontend-scaffold`: verify design components, task breakdown, and API contract exist
- If any upstream spec is missing, run the spec skill first

### PRD Scope Changes (2026-02-10)

**Context**: Progress matrix is measured against PRD feature baseline.

**What to check**:
- Has the PRD been updated since last cycle?
- Have success metrics changed?
- Has MVP scope expanded or contracted?
- If changed, recalculate progress matrix against new baseline

### Detect Domain Coverage (2026-02-09)

**Context**: Cycle 4 ran detect-pack with 1/5 domains — produced weak consolidation.

**What to check**:
- Count existing detect outputs in `$JAAN_OUTPUTS_DIR/detect/`
- Only run detect-pack if >= 3/5 domains have been analyzed
- Priority order for filling domains: dev (done) → design → writing → product → ux

### Gap Report Section E vs Section F (2026-02-10)

**Context**: Section E in gaps.md lists priorities; Section F in launch-gaps.md lists recommended actions.

**What to check**:
- Read Section F of launch-gaps.md FIRST — it has the priority order table
- Cross-reference with Section E of gaps.md for additional context
- Both inform the decision engine, but Section F is the primary input

---

## Edge Cases

Special cases to check and handle:

### Scaffold Stubs vs Production Code (2026-02-09)

**Context**: Backend scaffold has 21 route handlers that all return `// TODO: implement`. Frontend has 5 TODO stubs in pages.

**What to do**:
- NEVER count scaffold TODO stubs as production code
- Grep for `// TODO`, `throw new Error('Not implemented')` to count stubs
- Production code % = (non-stub implementations / total handlers) * 100
- If all handlers are stubs → production = 0%

### Single-File Component Output (2026-02-09)

**Context**: Frontend scaffold bundles all 26 components into a single `.tsx` file.

**What to do**:
- Count this as scaffold (the components exist) but NOT production-ready
- Production-ready requires individual files in `src/components/` directories
- This is tracked as Gap L-02 (Integration/Wiring)

### Empty Output Directories (2026-02-09)

**Context**: Some output directories contain only `README.md` index files with no actual deliverables.

**What to do**:
- Do NOT count directories with only README.md as existing deliverables
- Check for actual content files (`.md`, `.tsx`, `.ts`, `.prisma`, `.json`) beyond the index
- An empty index = no deliverable

### Child Skill HARD STOPs (2026-02-09)

**Context**: When cycle-new invokes jaan-to skills like `backend-scaffold`, those skills have their own HARD STOPs.

**What to do**:
- These HARD STOPs CANNOT be bypassed — the user must approve each one
- Plan for this in the execution queue (each skill with HARD STOP requires user interaction)
- If a child skill's HARD STOP is rejected, scorecard the attempt and move on

### Renamed Skills Across Versions (2026-02-09)

**Context**: v4.0.0 renamed several skills (e.g., `dev-be-data-model` → `backend-data-model`).

**What to do**:
- Match scorecards to CURRENT skill names, not legacy names
- Check if old-name scorecards exist and should be treated as the same skill
- The skill catalog in `vendor/jaan-to/skills/` always has current names

### Token Budget Exhaustion (2026-02-10)

**Context**: A single cycle with 10+ skill invocations may exceed context window limits.

**What to do**:
- Cap execution queue at 12 skill invocations per cycle
- If more are needed, defer lower-priority items to next cycle
- Monitor context usage — if approaching limits, skip remaining non-critical skills
- Always ensure closing skills (detect-pack, changelog, gaps-critical-doc) have room

---

## Workflow

Process improvements learned from 4 manual cycles:

### Submodule Update First (2026-02-09)

**Context**: Multiple cycles were affected by stale skill versions. Gap #14 (cache mismatch) was directly caused by not updating properly.

**What to do**:
- Step 0.3 (submodule update) is ALWAYS the first action after reading LEARN.md
- Never skip it, even if "nothing has changed" — verify anyway
- Record both the tag AND commit SHA

### Config Update at Cycle Start (2026-02-09)

**Context**: Other skills read `config.md` to determine current cycle number and jaan-to version. Stale config = wrong version references in their outputs.

**What to do**:
- Update `$JAAN_CONTEXT_DIR/config.md` in Step 3.2 (before any skill execution)
- Update: jaan-to Version, Stage, Cycle number
- Commit immediately so downstream skills see correct values

### One Commit Per Task (2026-02-09)

**Context**: CLAUDE.md rule: "Commit after each completed task — never batch multiple tasks into one commit."

**What to do**:
- Commit after each skill output
- Commit after each scorecard
- Commit after each learn-add feedback
- Never combine skill output + scorecard in one commit
- Use Conventional Commits format: `{type}(cycle-{N}): {description}`

### Security Scan Before Every Commit (2026-02-10)

**Context**: CLAUDE.md rule: "NEVER commit API keys, tokens, secrets, passwords, .env files."

**What to do**:
- Before every `git commit`, run: `git diff --cached | grep -iE '(sk-|ghp_|token=|password=|api_key=)'`
- If matches found: unstage the file, warn, do NOT commit
- Check all files — not just the ones you think might have secrets

### Dependency-Ordered Queue (2026-02-09)

**Context**: Some skills depend on others' outputs (e.g., detect-pack needs detect-* outputs).

**What to do**:
- learn-add → scaffold re-run (feedback must be submitted before re-running)
- pm-research-about → scaffold re-run (research informs the approach)
- detect-* → detect-pack (need >= 3/5 domains first)
- All skills → release-iterate-changelog (changelog covers the whole cycle)
- All skills → gaps-critical-doc (gap analysis covers the whole cycle)

### Scorecard Immediately After Skill (2026-02-09)

**Context**: Delaying scorecards risks forgetting details about skill performance.

**What to do**:
- Write scorecard IMMEDIATELY after each skill completes
- Score honestly — the scorecard is the authoritative record of skill quality
- Compare to previous score if re-testing (note improvement/degradation)
- Include jaan-to version (tag + SHA) in every scorecard header

---

## Common Mistakes

Things to avoid based on Cycles 1-4:

### Never Skip Submodule Update (2026-02-09)

**Context**: Gap #14 — plugin cache v4.4.0 vs submodule v4.5.0 caused `ux-flowchart-generate` to be unavailable.

**What NOT to do**:
- Don't assume the submodule is up to date
- Don't skip the update "because nothing changed"

### Never Use Manual Coding (2026-02-10)

**Context**: CLAUDE.md: "Use jaan-to skills for ALL product work — no shortcuts outside the plugin."

**What NOT to do**:
- Don't write code manually to fill scaffold stubs
- Don't manually extract components into individual files
- Don't manually create CI/CD configs
- Instead: use `/jaan-to:pm-research-about` to research, `/jaan-to:learn-add` to improve skills, `/gaps-critical-issue` to request new skills

### Never Pre-Plan Future Cycles (2026-02-10)

**Context**: CLAUDE.md: "Never Do: Pre-plan future cycles — they are driven by co-evolution loop."

**What NOT to do**:
- Don't write a plan for Cycle N+1 in the gap report
- Section E can list PRIORITIES but not a PLAN
- Each cycle is planned at invocation time based on current state

### Never Batch Commits (2026-02-09)

**Context**: CLAUDE.md: "Commit after each completed task — never batch."

**What NOT to do**:
- Don't combine multiple skill outputs into one commit
- Don't save all commits for the end of the cycle
- Don't combine scorecard + skill output in one commit

### Never Commit Secrets (2026-02-10)

**Context**: CLAUDE.md: "NEVER commit API keys, tokens, secrets, passwords, .env files."

**What NOT to do**:
- Don't commit without running the security grep
- Don't assume generated code is secret-free — scaffold skills may include placeholder API keys

### Don't Run detect-pack Too Early (2026-02-09)

**Context**: Cycle 4 ran detect-pack with 1/5 domains. Output was technically correct but provided limited value.

**What NOT to do**:
- Don't run detect-pack with fewer than 3/5 detect domains analyzed
- The consolidation value emerges at 3+ domains
- Priority: fill detect-design, detect-writing, detect-product, detect-ux first

### Don't Count Specs as Code Progress (2026-02-10)

**Context**: Jaanify has 100% specification but 0% production code. These are different dimensions.

**What NOT to do**:
- Don't report "75% complete" when specification is 100% but code is 0%
- Always separate the 4 dimensions: Specification / Scaffold / Production / Tests
- The overall % is an average across dimensions, not just specification

### Don't Harden TODO Stubs (2026-02-09)

**Context**: Security hardening (L-04) on scaffold code with all-TODO-stub services is meaningless.

**What NOT to do**:
- Don't run security hardening until real service implementations exist
- JWT verification, rate limiting, cookie auth are meaningless on `// TODO: implement` stubs
- Wait for L-01 (service implementation) before L-04 (security hardening)