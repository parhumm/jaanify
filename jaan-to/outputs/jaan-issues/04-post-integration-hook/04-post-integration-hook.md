---
title: "[Feature] Post-integration hook to detect new/modified outputs and suggest re-running dev-output-integrate"
type: "feature"
label: "enhancement"
repo: "parhumm/jaan-to"
issue_url: "https://github.com/parhumm/jaan-to/issues/75"
issue_number: 75
date: "2026-02-13"
jaan_to_version: "6.1.0"
os: "Darwin 25.1.0 arm64"
related_skill: "dev-output-integrate"
generated_by: "jaan-issue-report"
session_context: true
---

## Problem

When `dev-output-integrate` runs early in a cycle and subsequent skills (e.g., `frontend-design`, `qa-test-generate`) produce new outputs afterward, those outputs are never integrated into the project. The user must manually notice the gap and re-invoke `dev-output-integrate` — a step that is easy to forget.

**Real-world example from [Jaanify](https://github.com/parhumm/jaanify) Cycle 9:**

1. `dev-output-integrate` ran first — integrated 58 files from previous cycles
2. `frontend-design` ran third — generated a landing page in `jaan-to/outputs/frontend/design/04-jaanify-landing/`
3. The landing page was never integrated because it didn't exist when `dev-output-integrate` ran
4. The gap was only discovered during the Cycle 9 gap report review

This is a process gap that will recur in any cycle where generation skills run after integration.

## Proposed Solution

Add a **post-integration hook** that tracks which outputs have been integrated and detects when new or modified outputs appear in `jaan-to/outputs/` after integration.

**Hook behavior:**
1. After `dev-output-integrate` completes, record a manifest of integrated files (paths + timestamps/hashes)
2. When any subsequent skill writes to `jaan-to/outputs/`, compare against the manifest
3. If new files or modified files are detected that aren't in the manifest, surface a suggestion:
   > "New outputs detected in `jaan-to/outputs/frontend/design/04-jaanify-landing/` since last integration. Run `/jaan-to:dev-output-integrate` to integrate them?"

**Trigger scope:** Both new outputs AND modifications to previously integrated files should trigger the suggestion.

**Implementation options:**
- **Option A (session-level):** A Claude Code hook (`post-tool-use` or `notification` type) that runs after any generation skill and checks the outputs directory
- **Option B (skill-level):** Each generation skill checks for a `.last-integration` manifest and warns at the end of its execution
- **Option C (cycle-level):** The `cycle-new` / gap-report skills check for un-integrated outputs as part of their analysis

## Use Case

Any multi-skill cycle where `dev-output-integrate` runs before all generation skills complete:
- Cycle 9: `dev-output-integrate` → `devops-deploy-activate` → `frontend-design` (landing page never integrated)
- Future cycles: `dev-output-integrate` → `qa-test-generate` (new tests never integrated)
- Any re-run of a design/scaffold/test skill that produces updated output after initial integration

## Alternatives Considered

- **Manual discipline:** Rely on users to remember to re-run integration. Fragile — the Cycle 9 gap proves this fails in practice.
- **Always run integration last:** Enforce execution order. Too rigid — sometimes integration needs to happen early to unblock other work.
- **Batch all generation first:** Run all generation skills, then integrate once. Not always possible when skills have dependencies on integrated files.

## Related Skills/Features

- `/jaan-to:dev-output-integrate` — the skill that would be re-triggered
- `/jaan-to:frontend-design`, `/jaan-to:qa-test-generate`, `/jaan-to:backend-scaffold` — examples of generation skills that produce outputs
- Claude Code hooks system — potential implementation mechanism

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.1.0 |
| OS | Darwin 25.1.0 arm64 |
| Related skills | `dev-output-integrate`, `frontend-design` |

---

**Reported via:** `jaan-issue-report` skill
**jaan-to version:** 6.1.0
**Session context used:** true
