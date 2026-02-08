# Scorecard: `/jaan-to:dev-api-contract`

> jaan-to Version: v3.19.0 | Cycle: 3 | Date: 2026-02-08

---

## Overview

| Attribute | Value |
|-----------|-------|
| Type | Skill (skills/dev-api-contract/) |
| SKILL.md size | 540 lines |
| Input used | PRD reference (01-prd-jaanify-mvp.md) |
| Output | `jaan-to/outputs/dev/contract/01-jaanify-mvp/api.yaml` + companion guide |
| Context files read | tech.md (Fastify v5, JWT, PostgreSQL 16), config.md, learn.md |

---

## Execution Result

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Invocable** | 5/5 | Skill loaded and executed without errors |
| **Context awareness** | 5/5 | Read tech.md → correctly used JWT Bearer, URL path /v1/ versioning, Fastify patterns |
| **Learning integration** | 5/5 | Applied learn.md: flat $ref, RFC 9457, no `nullable: true`, named examples pattern |
| **Output quality** | 5/5 | Full OpenAPI 3.1 YAML (1271 lines) + companion markdown with Quick Start guide |
| **Workflow** | 5/5 | Clear 2-phase workflow with HARD STOP; design decisions made autonomously from PRD + tech.md |
| **Template adherence** | 5/5 | Output follows template structure: schemas → components → paths → companion guide |

---

## Strengths

1. **Comprehensive coverage** — 21 endpoints covering all 7 user stories: auth, user profile, task CRUD with AI parsing, daily plan generation, feedback loop, guest sessions
2. **AI-native design** — Reasoning Cards embedded in Task and DailyPlanSlot schemas with 3-tier structure (tier1 one-liner + factor weights + confidence)
3. **RFC 9457 compliance** — ProblemDetails and ValidationProblemDetails schemas with `application/problem+json` content type on every error response
4. **OpenAPI 3.1 correctness** — Proper null handling via `type: ["string", "null"]` (never `nullable: true`), `allOf` composition for Timestamps, flat component references
5. **Task parse endpoint** — Dedicated `/tasks/parse` for real-time NLP preview without creating a task, with <100ms p95 target documented
6. **Guest session flow** — Unauthenticated endpoints for 60-second onboarding with data migration on registration via `/auth/register`
7. **Companion guide** — Executive summary, cURL Quick Start, pagination flow, error handling reference, tooling commands

## Issues Found

### Minor: No Named Examples on Operations
- The SKILL.md specifies named `examples` (plural) per operation response (e.g., `user-success`, `user-not-found`)
- The generated spec has property-level `example` values but no named media type examples on operation responses
- This reduces usefulness for mock servers (Prism uses named examples for scenarios)
- **Suggestion**: Add `examples:` block on key operations (at least create/get success + 404 error)

### Minor: WebSocket Events Not Documented
- tech.md specifies "Socket.io v4 (real-time task updates)" as part of the stack
- The REST contract doesn't include WebSocket event schemas or a separate AsyncAPI reference
- This is expected (REST spec covers REST), but a note pointing to a future AsyncAPI spec would be helpful
- **Suggestion**: Add a note in the companion guide: "Real-time events via Socket.io are documented separately"

### Minor: No Rate Limit Headers
- 429 TooManyRequests responses are defined but no rate limit headers documented
- Standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Suggestion**: Add rate limit response headers to shared responses

### Observation: DailyPlanSlot Missing Timestamps
- `DailyPlanSlot` schema doesn't use `allOf` with Timestamps (unlike Task and DailyPlan)
- Slot has no `created_at`/`updated_at` — may be intentional since slots are managed through the plan
- **Suggestion**: Clarify whether slots need independent timestamps

---

## Score

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Functionality | 30% | 5/5 | 1.50 |
| Output Quality | 25% | 5/5 | 1.25 |
| Context Awareness | 20% | 5/5 | 1.00 |
| Learning Integration | 15% | 5/5 | 0.75 |
| Workflow Efficiency | 10% | 5/5 | 0.50 |

**Overall**: 5.0/5.0

---

## Gap Resolution

This skill directly addresses the **#1 CRITICAL gap** identified in Cycles 1 and 2:

> "No API contract exists between frontend and backend. Frontend tasks reference endpoints that don't have formal specs."

The generated contract now provides:
- Request/response schemas for all 21 endpoints
- RFC 9457 error taxonomy matching backend task breakdown
- Auth scheme matching tech.md (JWT + OAuth2 Google)
- Guest session endpoints for 60-second onboarding flow
- Cursor-based pagination matching data model indexes
- AI reasoning structures embedded in Task and DailyPlanSlot schemas

**Status**: Gap RESOLVED. Frontend and backend teams can now independently implement against a shared contract.
