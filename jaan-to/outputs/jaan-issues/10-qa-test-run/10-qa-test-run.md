---
title: "[Feature] qa-test-run skill — execute generated tests, fix failures, report coverage"
type: "feature"
label: "enhancement"
repo: "parhumm/jaan-to"
issue_url: "https://github.com/parhumm/jaan-to/issues/82"
issue_number: 82
date: "2026-02-13"
jaan_to_version: "6.1.0"
os: "Darwin 25.1.0 arm64"
related_skill: "qa-test-generate, qa-test-cases"
generated_by: "gaps-critical-issue"
session_context: true
---

## Problem

`qa-test-generate` creates test files but no skill actually runs them. [Jaanify](https://github.com/parhumm/jaanify) has 22 test files installed but `pnpm test` has never been executed. Nobody knows if they pass, fail, or compile (L-12, P3).

## What's Needed

A skill that: auto-detects test runners (vitest, playwright), executes tests with proper setup, diagnoses common failures (missing imports, ungenerated Prisma client), auto-fixes simple issues, generates coverage reports, and summarizes results.

## Known Risks

- Prisma client needs `prisma generate` before unit tests
- Integration tests need a test database
- E2E tests need running application
- Moved files from `dev-output-integrate` may have broken import paths

## Related Skills

- `qa-test-generate` — generates the tests this skill executes
- `qa-test-cases` — generates BDD scenarios informing test expectations
- `dev-local-run` (proposed, issue #77) — starts app for E2E tests
- `dev-server-check` (proposed, issue #78) — verifies server before E2E
- `dev-output-integrate` — installs tests; this skill verifies they work

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.1.0 |
| Gap ID | L-12 |
| Priority | P3 (Quality of Life) |
| Upstream | https://github.com/parhumm/jaanify/issues/4 |

---

**Reported via:** `gaps-critical-issue` skill
**jaan-to version:** 6.1.0
**Upstream issue:** https://github.com/parhumm/jaanify/issues/4
