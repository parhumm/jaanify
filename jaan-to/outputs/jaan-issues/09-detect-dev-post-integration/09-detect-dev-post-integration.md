---
title: "[Feature] detect-dev post-integration re-audit trigger"
type: "feature"
label: "enhancement"
repo: "parhumm/jaan-to"
issue_url: "https://github.com/parhumm/jaan-to/issues/81"
issue_number: 81
date: "2026-02-13"
jaan_to_version: "6.1.0"
os: "Darwin 25.1.0 arm64"
related_skill: "detect-dev, dev-output-integrate"
generated_by: "gaps-critical-issue"
session_context: true
---

## Problem

After `dev-output-integrate` moves files into operational locations, the existing `detect-dev` audit becomes stale. [Jaanify](https://github.com/parhumm/jaanify) scored 9.9/10 pre-integration but 58 new files were integrated in Cycle 9 without re-audit (L-10, P3).

## What's Needed

Enhancement to detect-dev / dev-output-integrate workflow: post-integration audit suggestion, incremental audit mode for changed files only, integration-aware SARIF output, and audit state tracking.

## What Already Exists

- `detect-dev` — full SARIF audit, 9.9/10 on last run
- `dev-output-integrate` — tracks source → destination mapping
- Integration manifest from dev-output-integrate

## Related Skills

- `detect-dev` — the skill to enhance/re-trigger
- `dev-output-integrate` — the skill that triggers re-audit need
- `sec-audit-remediate` — generates fixes to verify post-integration
- Post-integration hook (issue #75) — related change detection concept

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.1.0 |
| Gap ID | L-10 |
| Priority | P3 (Quality of Life) |
| Upstream | https://github.com/parhumm/jaanify/issues/3 |

---

**Reported via:** `gaps-critical-issue` skill
**jaan-to version:** 6.1.0
**Upstream issue:** https://github.com/parhumm/jaanify/issues/3
