---
title: "[Feature] dev-local-run skill — auto-detect requirements and run project locally"
type: "feature"
label: "enhancement"
repo: "parhumm/jaan-to"
issue_url: "https://github.com/parhumm/jaan-to/issues/77"
issue_number: 77
date: "2026-02-13"
jaan_to_version: "6.1.0"
os: "Darwin 25.1.0 arm64"
related_skill: "devops-infra-scaffold, dev-project-assemble"
generated_by: "gaps-critical-issue"
session_context: true
---

## Problem

Running a project locally after cloning requires reading through READMEs, figuring out prerequisites (databases, env vars, migrations, dependencies), and executing multiple manual steps in the right order. For [Jaanify](https://github.com/parhumm/jaanify), the "Quick Start" requires 5 manual steps — any of which can fail silently.

## Proposed Solution

A `dev-local-run` skill that:

1. **Scans project config** — reads `package.json`, `docker-compose.yml`, `.env.example`, `prisma/schema.prisma`, `Makefile`, etc.
2. **Detects requirements** — databases needed, env vars to set, package manager, Node version, migrations, build steps
3. **Plans setup sequence** — orders steps by dependency (databases before migrations, install before build)
4. **Executes with feedback** — runs each step, reports progress, handles failures gracefully
5. **Generates missing `.env`** — copies from `.env.example`, generates random secrets where needed

## Use Cases

- New contributor cloning a repo for the first time
- Returning to a project after weeks/months away
- CI/CD local reproduction of pipeline issues
- Any jaan-to project that uses `devops-infra-scaffold` or `dev-project-assemble` outputs

## Related Skills

- `devops-infra-scaffold` — generates the Docker/CI configs this skill would read
- `dev-project-assemble` — assembles the project structure this skill would detect
- `dev-output-integrate` — integrates outputs; `dev-local-run` would verify the result actually runs
- `dev-server-check` (proposed, issue #78) — verifies the result after startup

## Environment

| Field | Value |
|-------|-------|
| jaan-to version | 6.1.0 |
| Motivation | Jaanify Quick Start friction |
| Gap ID | L-13 (new) |

---

**Reported via:** `gaps-critical-issue` skill
**jaan-to version:** 6.1.0
