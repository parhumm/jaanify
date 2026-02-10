# Lessons: skill-gaps-critical

> Last updated: 2026-02-10

Accumulated lessons from past executions. Read this before analyzing launch
readiness to avoid past mistakes and apply learned improvements.

Seeded from manual Cycle 4 gap analysis (04-launch-gtm-gaps.md).

---

## Better Questions

Questions and patterns that improve gap analysis quality:

- Ask "Has the jaan-to submodule been updated since last cycle?" to detect
  version delta that may introduce new skills or fix existing ones
- Check if plugin cache version matches submodule version — mismatches cause
  skills to be unavailable even when they exist in the submodule
- Confirm with user whether scaffold stubs (TODO comments) should count as
  partial implementation or zero implementation
- Ask "Are there manual fixes applied outside jaan-to skills?" to capture
  progress not visible in skill outputs
- Check if detect-pack has been run with enough domains — 1/5 domain coverage
  gives weak consolidation value
- Ask "Has the PRD scope changed since last cycle?" to update the feature
  baseline before measuring gaps

## Edge Cases

Special cases to check and handle:

- **Scaffold stubs vs production code**: Both scaffold skills configure Vitest
  in package.json but generate zero test files. Do not count Vitest config as
  "test infrastructure exists" unless actual test files exist
- **Single-file component output**: Frontend scaffold bundles all components into
  a single .tsx file. This counts as scaffold but not as production-ready code
- **Security findings auto-promotion**: Critical security findings from detect-dev
  (like JWT signature bypass E-DEV-001) should auto-promote to P1 gaps even if
  the user has not explicitly reported them as gaps
- **Partial detect coverage**: When detect-pack shows <3/5 domains, the quality
  picture is incomplete. Note this explicitly and recommend running remaining
  detect skills before next gap analysis
- **Renamed skills across versions**: v4.0.0 renamed several skills
  (dev-be-data-model -> backend-data-model). Match scorecards to current skill
  names, not legacy names
- **Gap ID format coexistence**: Previous cycles use #N numbering in manual
  gap reports. This skill uses L-NN format. Keep both systems clear and
  cross-reference where applicable
- **Empty output directories**: Some output directories may exist but contain
  only README.md index files with no actual deliverables. Do not count empty
  directories as existing deliverables

## Workflow

Process improvements learned from past runs:

- Read PRD FIRST to establish the feature baseline before inventorying
  deliverables — this ensures gaps are measured against requirements, not
  assumptions
- Inventory deliverables by globbing output directory structure, then read file
  headers/frontmatter for metrics — do not read entire files (token budget)
- Calculate progress matrix from concrete evidence (file exists/not, stub
  markers in code, test file count) rather than subjective estimates
- Sort gaps by priority first, then by dependency order within each priority level
- Build the critical path diagram AFTER classifying all gaps — dependencies
  often only become clear after seeing the full picture
- Cross-reference gap reports across cycles to track resolution velocity
  (gaps resolved per cycle)
- When counting deliverables, distinguish between specification artifacts
  (PRD, stories, tasks) and implementation artifacts (scaffold, production code)
- Check for infrastructure files outside $JAAN_OUTPUTS_DIR — Dockerfiles,
  CI configs, and deployment scripts live at project root

## Common Mistakes

Things to avoid based on past feedback:

- Do not count specification deliverables (PRD, stories, tasks) as progress
  toward production code — specification is a prerequisite, not implementation
- Do not assume a skill exists just because a similar name appears in the skills
  directory — verify by reading the SKILL.md description
- Do not inflate scaffold percentages — ~80% scaffold with 0% production code
  means the product is not functional
- Do not present gap analysis as a criticism of the project — it is a roadmap
  for what to build next, framed constructively
- Do not skip reading previous skill-gaps-critical output — the delta
  comparison is one of the most valuable sections for tracking progress
- Do not hardcode deliverable counts from memory — always read and count from
  the actual output files in the current session
- Do not double-count gaps — if a gap from a previous cycle (#N) maps to a
  new gap (L-NN), cross-reference them but count only once
