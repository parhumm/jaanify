---
title: "[Feature] dev-server-check skill — validate running server health and API responses"
type: "feature"
label: "enhancement"
repo: "parhumm/jaan-to"
issue_url: "https://github.com/parhumm/jaan-to/issues/78"
issue_number: 78
date: "2026-02-13"
jaan_to_version: "6.1.0"
os: "Darwin 25.1.0 arm64"
related_skill: "backend-api-contract, devops-deploy-activate"
generated_by: "gaps-critical-issue"
session_context: true
---

## Problem

After starting a project locally or deploying to staging/production, there's no automated way to verify that everything is actually working. For [Jaanify](https://github.com/parhumm/jaanify) with multiple services (API + web + PostgreSQL + Redis), checking each component is tedious and error-prone.

## Proposed Solution

A `dev-server-check` skill that:

1. **Detects running services** — reads docker-compose, package.json scripts, port configs
2. **Hits health endpoints** — checks `/health`, `/v1/health`, or custom health routes
3. **Validates API responses** — compares actual responses against OpenAPI contract (if available)
4. **Runs smoke tests** — basic CRUD operations on key endpoints
5. **Reports results** — pass/fail summary with actionable error details

## Use Cases

- Post-deploy verification (staging/production)
- After `dev-local-run` to confirm everything started correctly
- CI smoke test step after deployment
- After `dev-output-integrate` to verify integrated code doesn't break the server

## Related Skills

- `dev-local-run` (proposed, issue #77) — starts the project; this skill verifies it works
- `backend-api-contract` — generates OpenAPI specs this skill could validate against
- `qa-test-generate` — generates full test suites; this skill does quick smoke tests
- `devops-deploy-activate` — activates deployment; this skill verifies the deployed result

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.1.0 |
| Motivation | No way to verify Jaanify runs after integration |
| Gap ID | L-14 (new) |

---

**Reported via:** `gaps-critical-issue` skill
**jaan-to version:** 6.1.0
