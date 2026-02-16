---
tool: detect-ux
platform: api
mode: light
overall_score: 8.0
scan_date: 2026-02-16
findings_count: 5
---

# Jaanify API -- UX Detection Summary (Light Mode)

## Executive Summary

The Jaanify API exhibits strong UX-aware design for a backend platform. Error
responses follow RFC 9457 Problem Details consistently across all error paths,
providing machine-readable and human-readable feedback. The guest session flow
enables a frictionless anonymous-to-authenticated conversion pattern, and the
feedback collection endpoint creates a structured loop for gathering user
sentiment on AI decisions.

**Overall UX Score: 8.0 / 10**

---

## Findings

### E-UX-API-001: RFC 9457 Problem Details -- Consistent Error UX

**Location:** `apps/api/src/lib/error-factory.ts`, `apps/api/src/plugins/error-handler.ts`

All API errors are returned with `Content-Type: application/problem+json` and
a structured body containing `type`, `title`, `status`, `detail`, and
`instance` fields. This applies to:

- Zod validation errors (400) with per-field `errors[]` array including JSON
  Pointer paths
- Prisma constraint violations mapped to 404/409
- Authentication failures (401) with descriptive problem types
- Rate limit exceeded (429) with `retry-after` header
- Internal server errors (500) with redacted detail in production

The type registry defines 9 named problem types under
`https://api.jaanify.com/errors/`, providing a stable URI namespace that
clients can programmatically consume.

**Impact:** High -- enables frontend to display precise, actionable error
messages rather than generic "something went wrong" toasts.

---

### E-UX-API-002: Guest Session Flow -- Zero-Friction Onboarding

**Location:** `apps/api/src/routes/guest-sessions/`

The API supports anonymous guest sessions with a 7-day expiry. Sessions are
created via `POST /v1/guest-sessions` with an optional `data_json` payload
(e.g., `{ first_task: "..." }`) and return a UUID-based `anonymous_id`.

This pattern enables the web onboarding flow to:
1. Let users enter their first task without signing up
2. Store onboarding context server-side
3. Convert to a full account later (Google OAuth flow, currently TODO)

**Impact:** High -- removes the biggest conversion barrier (forced signup
before value demonstration).

---

### E-UX-API-003: Feedback Collection Endpoint

**Location:** `apps/api/src/routes/feedback/`

A dedicated `POST /v1/feedback` endpoint accepts structured user feedback with
typed categories:

- `priority_override` -- user disagrees with AI priority
- `plan_override` -- user disagrees with daily plan scheduling
- `not_now` -- user defers a task
- `wrong_category` -- AI miscategorized a task
- `other` -- freeform feedback

Each record links to a specific `task_id` and/or `plan_id`, with an optional
`reason` field (max 500 chars). This creates a closed feedback loop where
user corrections can train and improve AI reasoning over time.

**Impact:** Medium -- enables AI model improvement and signals that user
agency is valued.

---

### E-UX-API-004: Tiered Rate Limiting with Informative Headers

**Location:** `apps/api/src/plugins/rate-limiter.ts`

Rate limits are tiered by endpoint sensitivity:
- Auth endpoints: 5 req/min (brute-force protection)
- Write endpoints: 30 req/min
- Read endpoints: 100 req/min (global default)

Responses include `x-ratelimit-limit`, `x-ratelimit-remaining`,
`x-ratelimit-reset`, and `retry-after` headers, giving the frontend
sufficient information to implement client-side throttling or display
countdown timers.

Rate limit exceeded errors follow the same RFC 9457 format as all other
errors, maintaining consistency.

**Impact:** Medium -- prevents degraded UX from abuse while giving clients
enough data to handle limits gracefully.

---

### E-UX-API-005: Validation with Actionable Pointers

**Location:** `apps/api/src/plugins/error-handler.ts` (Zod validation path)

Validation errors return a structured `errors[]` array where each entry
contains a `detail` message and a JSON Pointer `pointer` field. This enables
the frontend to map server-side validation errors directly to specific form
fields for inline error display.

Example response shape:
```json
{
  "type": "https://api.jaanify.com/errors/validation",
  "status": 400,
  "title": "Validation Error",
  "detail": "2 validation error(s) in request",
  "errors": [
    { "detail": "Required", "pointer": "/title" },
    { "detail": "Invalid email", "pointer": "/email" }
  ]
}
```

**Impact:** Medium -- enables precise inline error highlighting in the
frontend rather than a single error banner.

---

## Gaps Identified

| Gap | Severity | Description |
|-----|----------|-------------|
| No A/B testing infrastructure | Low | No feature flag or experiment framework detected |
| No analytics events | Low | No server-side event tracking for funnel analysis |
| Guest-to-user conversion not implemented | Medium | Auth service has TODO for account linking |

---

## Score Breakdown

| Category | Score | Notes |
|----------|-------|-------|
| Error UX (RFC 9457) | 9/10 | Comprehensive, consistent, with field-level pointers |
| Onboarding flow support | 8/10 | Guest sessions exist; conversion not yet wired |
| Feedback mechanisms | 8/10 | Structured types with task/plan linking |
| Rate limiting UX | 8/10 | Informative headers, consistent error format |
| Analytics/experimentation | 5/10 | No server-side tracking or feature flags |
| **Overall** | **8.0/10** | |
