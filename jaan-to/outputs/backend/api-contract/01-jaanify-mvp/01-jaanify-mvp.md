# Jaanify MVP — API Contract Guide

> **Executive Summary**: The Jaanify API is an AI-native task management interface that powers task CRUD with transparent AI reasoning, daily plan generation with Reasoning Cards, voice-captured natural language input, and anonymous guest sessions for 60-second onboarding. 21 endpoints across 6 resource groups serve internal web/mobile frontends via REST + JWT Bearer auth.

**Generated**: 2026-02-08
**Skill**: `/jaan-to:dev-api-contract`
**jaan-to Version**: v3.19.0
**Status**: Complete

---

## Authentication

The API uses **JWT Bearer tokens** obtained via Google OAuth2.

| Scheme | Type | Location | Expiry |
|--------|------|----------|--------|
| Access Token | JWT | `Authorization: Bearer <token>` | 1 hour |
| Refresh Token | Opaque | httpOnly cookie | 7 days |

**Public endpoints** (no auth required):
- `POST /auth/google` — OAuth2 login
- `POST /auth/refresh` — Token refresh
- `POST /auth/register` — Guest → account conversion
- `POST /guest-sessions` — Create anonymous session
- `GET /guest-sessions/{anonymous_id}` — Retrieve guest session

All other endpoints require a valid JWT access token.

---

## Quick Start

### 1. Authenticate via Google OAuth2
```bash
curl -X POST https://api.jaanify.com/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{"code": "4/0AX4XfWg...", "redirect_uri": "https://jaanify.com/auth/callback"}'
```

### 2. Create a task with AI parsing
```bash
curl -X POST https://api.jaanify.com/v1/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Call Sarah about the Johnson proposal by Friday 2 PM",
    "raw_input": "Call Sarah about the Johnson proposal by Friday 2 PM"
  }'
```

### 3. Preview AI parsing without creating a task
```bash
curl -X POST https://api.jaanify.com/v1/tasks/parse \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input": "Buy groceries for dinner tonight, remind me at 4 PM"}'
```

### 4. Generate today's AI daily plan
```bash
curl -X POST https://api.jaanify.com/v1/daily-plans/generate \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Start a guest session (no auth)
```bash
curl -X POST https://api.jaanify.com/v1/guest-sessions \
  -H "Content-Type: application/json" \
  -d '{"data_json": {"first_task": "Buy groceries"}}'
```

---

## Pagination

All list endpoints use **cursor-based pagination**:

| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `cursor` | string (opaque) | — | — |
| `limit` | integer | 20 | 100 |

**Example flow:**
```bash
# First page
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.jaanify.com/v1/tasks?limit=10"

# Response includes pagination metadata:
# { "data": [...], "pagination": { "cursor": "eyJpZCI6IjEyMyJ9", "has_more": true, "limit": 10 } }

# Next page
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.jaanify.com/v1/tasks?limit=10&cursor=eyJpZCI6IjEyMyJ9"
```

---

## Error Handling

All errors follow **RFC 9457 Problem Details** format with `application/problem+json` content type:

```json
{
  "type": "https://api.jaanify.com/errors/not-found",
  "status": 404,
  "title": "Not Found",
  "detail": "Task with ID 123e4567-e89b-12d3-a456-426614174000 not found."
}
```

**Validation errors** include field-level details:
```json
{
  "type": "https://api.jaanify.com/errors/validation",
  "status": 422,
  "title": "Validation Error",
  "detail": "Request body contains invalid fields",
  "errors": [
    { "detail": "must be a valid email address", "pointer": "/email" },
    { "detail": "must be at most 500 characters", "pointer": "/title" }
  ]
}
```

### Status Code Reference

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | GET success, PATCH success |
| 201 | Created | POST success (resource created) |
| 204 | No Content | DELETE success |
| 400 | Bad Request | Malformed JSON, missing required fields |
| 401 | Unauthorized | Missing or expired token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist or was soft-deleted |
| 409 | Conflict | Duplicate (e.g., daily plan already exists for today) |
| 422 | Validation Error | Valid JSON but business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Unexpected server failure |

---

## Resources — Endpoint Reference

### Auth (4 endpoints)

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | /v1/auth/google | authGoogle | Authenticate via Google OAuth2 |
| POST | /v1/auth/refresh | authRefresh | Refresh access token |
| POST | /v1/auth/register | authRegister | Convert guest session to account |
| DELETE | /v1/auth/logout | authLogout | Logout and invalidate tokens |

### User (3 endpoints)

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| GET | /v1/users/me | getMe | Get current user profile |
| PATCH | /v1/users/me | updateMe | Update current user profile |
| DELETE | /v1/users/me | deleteMe | Delete account (30-day GDPR grace) |

### Task (5 endpoints)

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| GET | /v1/tasks | listTasks | List user's tasks (paginated) |
| POST | /v1/tasks | createTask | Create task with optional AI parsing |
| POST | /v1/tasks/parse | parseTask | AI-parse natural language (preview) |
| GET | /v1/tasks/{task_id} | getTask | Get single task with reasoning |
| PATCH | /v1/tasks/{task_id} | updateTask | Update task fields |
| DELETE | /v1/tasks/{task_id} | deleteTask | Soft-delete a task |

### Daily Plan (4 endpoints)

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| GET | /v1/daily-plans | listDailyPlans | List daily plans (paginated) |
| POST | /v1/daily-plans/generate | generateDailyPlan | Generate AI daily plan |
| GET | /v1/daily-plans/{plan_id} | getDailyPlan | Get plan with slots and reasoning |
| PATCH | /v1/daily-plans/{plan_id}/slots/{slot_id} | updatePlanSlot | Reorder/complete/skip a slot |

### Feedback (1 endpoint)

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | /v1/feedback | createFeedback | Submit feedback on AI recommendation |

### Guest (2 endpoints)

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | /v1/guest-sessions | createGuestSession | Create anonymous guest session |
| GET | /v1/guest-sessions/{anonymous_id} | getGuestSession | Get guest session by anonymous ID |

**Total: 21 endpoints**

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Versioning | URL path `/v1/` | Cache-friendly, most visible, separate spec per version |
| Auth | JWT Bearer (OAuth2 Google) | Internal frontends, token refresh via httpOnly cookie |
| Errors | RFC 9457 Problem Details | Machine-readable, extensible, industry standard |
| Pagination | Cursor-based | Consistent results under concurrent writes, scalable |
| Null handling | `type: ["string", "null"]` | OpenAPI 3.1 native (no `nullable: true`) |
| Enums | `enum` arrays | Matches CHECK constraints in data model |
| IDs | UUID v4 | Unguessable, no sequential enumeration |
| Soft deletes | DELETE → sets `deleted_at` | GDPR-compliant, reversible within grace period |

---

## Validation & Tooling

```bash
# Lint the spec
npx @stoplight/spectral-cli lint api.yaml
npx @redocly/cli lint api.yaml

# Start mock server
npx @stoplight/prism-cli mock api.yaml

# Generate TypeScript client
npx orval --input api.yaml --output ./src/api/

# Run contract tests
schemathesis run --url http://localhost:4010 api.yaml
```

---

## Metadata

| Field | Value |
|-------|-------|
| Skill | `/jaan-to:dev-api-contract` |
| jaan-to Version | v3.19.0 |
| Date | 2026-02-08 |
| Spec Format | OpenAPI 3.1.0 |
| Status | Complete |
