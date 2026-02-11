---
title: API Reference
doc_type: guide
created_date: 2026-02-11
updated_date: 2026-02-11
tags: [api, rest, endpoints, authentication, fastify]
related: [getting-started.md, ../data-model.md, ../jaanify-architecture.md]
---

# API Reference

> 21 REST endpoints for task management, AI reasoning, daily plans, and authentication.

---

## Overview

The Jaanify API is a REST interface at `/api/v1/` powered by Fastify v5. It handles task CRUD with AI parsing, daily plan generation with Reasoning Cards, Google OAuth2 authentication, and guest sessions for anonymous onboarding.

All authenticated endpoints require a JWT Bearer token in the `Authorization` header.

---

## Prerequisites

- A running Jaanify API instance (see [Getting Started](getting-started.md))
- `curl` or an API client like Insomnia/Postman

---

## Step 1: Authentication

The API supports two auth methods:

| Method | Use Case | Endpoint |
|--------|----------|----------|
| Google OAuth2 | Full accounts | `POST /v1/auth/google` |
| Guest sessions | Anonymous onboarding | `POST /v1/guest-sessions` |

**Google OAuth2 flow:**
```bash
POST /v1/auth/google
Body: {"code": "4/0AX4XfWg...", "redirect_uri": "https://jaanify.com/auth/callback"}
Returns: {"access_token": "...", "refresh_token": "...", "user": {...}}
```

**Guest session (no auth required):**
```bash
POST /v1/guest-sessions
Body: {"data_json": {"first_task": "Buy groceries"}}
Returns: {"id": "...", "anonymous_id": "abc123", "expires_at": "..."}
```

---

## Step 2: Endpoint Reference

### Auth (4 endpoints)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/auth/google` | Exchange OAuth2 code for tokens |
| POST | `/v1/auth/refresh` | Refresh an expired access token |
| POST | `/v1/auth/register` | Convert guest session to full account |
| DELETE | `/v1/auth/logout` | Revoke refresh token |

### Tasks (7 endpoints)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/tasks` | List user's tasks (paginated) |
| POST | `/v1/tasks` | Create a task with AI parsing |
| GET | `/v1/tasks/:id` | Get a single task with reasoning |
| PATCH | `/v1/tasks/:id` | Update task fields |
| DELETE | `/v1/tasks/:id` | Soft-delete a task |
| POST | `/v1/tasks/:id/complete` | Mark task as completed |
| POST | `/v1/tasks/parse` | Preview AI parsing without saving |

### Daily Plans (4 endpoints)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/daily-plans` | List user's daily plans |
| GET | `/v1/daily-plans/:id` | Get plan with slots and reasoning |
| POST | `/v1/daily-plans/generate` | Generate today's AI daily plan |
| PATCH | `/v1/daily-plans/:id/slots/:slotId` | Update a slot (reorder, skip) |

### Users (2 endpoints)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/users/me` | Get current user profile |
| PATCH | `/v1/users/me` | Update preferences |

### Feedback (2 endpoints)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/feedback` | Submit feedback on AI recommendation |
| GET | `/v1/feedback` | List user's feedback history |

### Guest Sessions (2 endpoints)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/guest-sessions` | Create anonymous session |
| GET | `/v1/guest-sessions/:anonymousId` | Retrieve guest session data |

---

## Step 3: Common Patterns

### Pagination

All list endpoints use cursor-based pagination:

```bash
GET /v1/tasks?limit=10
GET /v1/tasks?limit=10&cursor=eyJpZCI6IjEyMyJ9
```

Response includes `pagination.cursor`, `pagination.has_more`, and `pagination.limit`.

### Error Format

Errors follow RFC 9457 Problem Details:

```json
{
  "type": "https://api.jaanify.com/errors/not-found",
  "status": 404,
  "title": "Not Found",
  "detail": "Task with ID abc123 not found."
}
```

Validation errors include field-level `errors[]` with JSON Pointer paths.

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 401 | Unauthorized (missing/expired token) |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Rate Limited |

---

## Verification

Test the API is running:

```bash
curl http://localhost:3000/health
# {"status": "ok"}

curl -X POST http://localhost:3000/v1/guest-sessions \
  -H "Content-Type: application/json" \
  -d '{"data_json": {}}'
# Returns guest session with anonymous_id
```

---

## Tips

- Use `POST /v1/tasks/parse` to preview AI parsing without creating a task. The response shows extracted title, deadline, category, and reasoning.
- Token expiry is 1 hour. Use `POST /v1/auth/refresh` with the httpOnly cookie to get a new access token.
- Rate limits apply to all endpoints. The API returns `429` with a `Retry-After` header when exceeded.

---

## Related

- [Getting Started](getting-started.md)
- [Data Model](../data-model.md)
- [Full OpenAPI Spec](../../jaan-to/outputs/backend/api-contract/01-jaanify-mvp/01-jaanify-mvp.md)
