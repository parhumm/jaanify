# YOUR_PROJECT_NAME — Project Rules

## What Is This
YOUR_PROJECT_NAME is YOUR_PROJECT_DESCRIPTION being built
EXCLUSIVELY using the jaan-to Claude Code plugin. This project serves dual purpose:
1. Build a real, launchable product
2. Stress-test jaan-to plugin through real production use

## Single Source of Truth
- Product name is **YOUR_PROJECT_NAME** — use this name everywhere, no aliases or alternatives
- This CLAUDE.md is the authoritative reference for project rules
- jaan-to GitHub repo is the authoritative source for plugin state (not local folders)
- Scorecards are the authoritative record of skill quality
- Gap reports are the authoritative record of what's missing
- When in doubt, check this file first — it overrides assumptions from previous sessions

## Repo
- Public repo: YOUR_REPO_URL
- jaan-to submodule: `vendor/jaan-to/` → https://github.com/parhumm/jaan-to/ (main branch)
- Always pull latest before scanning: `git submodule update --remote --merge vendor/jaan-to`

## SECURITY — PUBLIC REPO
- NEVER commit API keys, tokens, secrets, passwords, .env files
- NEVER commit credentials, private URLs, auth tokens
- Scan staged files before every commit for: sk-, ghp_, token=, password=, api_key=
- Use placeholder values in all config/context files (e.g. YOUR_API_KEY_HERE)

## Co-Evolution Loop
This project follows an iterative co-evolution cycle with jaan-to:
1. SCAN — Check https://github.com/parhumm/jaan-to/ for new/updated skills, agents, hooks
2. REVIEW & TEST — Test new features with YOUR_PROJECT_NAME context, score on scorecard
3. BUILD — Advance YOUR_PROJECT_NAME using all available jaan-to skills
4. GAP REPORT — Document missing skills, request top priorities from user
5. User adds skills → loop back to step 1

## Always Do
- Record jaan-to version (tag/commit SHA) in every scan, scorecard, and gap report
- Use jaan-to skills for ALL product work — no shortcuts outside the plugin
- Write per-skill scorecards in scorecards/{skill-name}.md
- Write gap reports in gap-reports/NN-cycle/NN-{scan|gaps}.md
- Verify skill outputs match jaan-to documentation
- Check v3.0.0 compliance: env vars, ID structure, no hardcoded paths
- Commit after each completed task — never batch multiple tasks into one commit

## Never Do
- Skip the jaan-to scan at cycle start
- Commit without checking for secrets
- Use hardcoded jaan-to/ paths (use $JAAN_* env vars)
- Pre-plan future cycles — they are driven by co-evolution loop
- Write heavy test reports — keep scorecards lightweight and actionable

## Folder Structure
- vendor/jaan-to/ — Git submodule (read-only, always pull latest main before scanning)
- jaan-to/ — Plugin workspace (created by /jaan-init)
- scorecards/ — Per-skill scorecards (living documents, updated each cycle)
- gap-reports/ — Per-cycle subfolders (NN-cycle/NN-{scan|gaps}.md)
