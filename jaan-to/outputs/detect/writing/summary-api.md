---
title: "Jaanify API — Writing System Detection"
id: "AUDIT-2026-010-API"
version: "1.0.0"
status: draft
date: 2026-02-16
target:
  name: "jaanify"
  platform: api
  branch: "main"
tool:
  name: "detect-writing"
  version: "1.0.0"
  rules_version: "2024.1"
run_depth: light
jaan_to_version: v7.0.0
confidence_scheme: "four-level"
findings_summary:
  critical: 0
  high: 0
  medium: 0
  low: 0
  informational: 1
overall_score: 10.0
lifecycle_phase: post-build
---

# Jaanify API — Writing System Detection (Light Mode)

> Detected: 2026-02-16 | Target: apps/api/
> Platform: api (backend only)
> Mode: Light
> Analysis Mode: Not Applicable (no user-facing UI copy)

---

## Executive Summary

The Jaanify API backend has no user-facing UI copy. All error responses follow
the RFC 9457 Problem Details specification via a dedicated error factory
(`apps/api/src/lib/error-factory.ts`). Error messages are structured,
machine-readable, and consumed by API clients -- not end-users directly.

No i18n infrastructure is expected or required for the API platform.
The backend error message catalog is well-structured with 9 problem types,
Prisma error mapping, and a `BusinessError` class for typed error propagation.

**Score: 10.0/10** -- Not Applicable; backend has no user-facing copy to evaluate.

---

## Findings

### E-WRT-API-001: RFC 9457 Error Format (Informational)

**Severity**: Informational | **Confidence**: Confirmed (0.95)

The API uses RFC 9457 Problem Details format for all error responses. The error
factory at `apps/api/src/lib/error-factory.ts` defines 9 problem types with
structured creation, a `BusinessError` class with stack trace preservation, and
Prisma error code mapping (P2002, P2003, P2025). All error type URIs use the
`https://api.jaanify.com/errors/` prefix.

Problem types defined:
- `validation-error` (400) -- "Validation Failed"
- `authentication-required` (401) -- "Authentication Required"
- `token-expired` (401) -- "Token Expired"
- `insufficient-permissions` (403) -- "Insufficient Permissions"
- `resource-not-found` (404) -- "Not Found"
- `unique-constraint-violation` (409) -- "Resource Already Exists"
- `invalid-state-transition` (409) -- "Invalid State Transition"
- `rate-limit-exceeded` (429) -- "Rate Limit Exceeded"
- `openai-unavailable` (503) -- "AI Service Unavailable"

```yaml
evidence:
  id: E-WRT-API-001
  type: code-location
  confidence: 0.95
  location:
    uri: "apps/api/src/lib/error-factory.ts"
    startLine: 7
    endLine: 17
  snippet: |
    const PROBLEM_TYPES = {
      'validation-error':            { status: 400, title: 'Validation Failed' },
      'authentication-required':     { status: 401, title: 'Authentication Required' },
      'token-expired':               { status: 401, title: 'Token Expired' },
      'insufficient-permissions':    { status: 403, title: 'Insufficient Permissions' },
      'resource-not-found':          { status: 404, title: 'Not Found' },
      'unique-constraint-violation': { status: 409, title: 'Resource Already Exists' },
      'invalid-state-transition':    { status: 409, title: 'Invalid State Transition' },
      'rate-limit-exceeded':         { status: 429, title: 'Rate Limit Exceeded' },
      'openai-unavailable':          { status: 503, title: 'AI Service Unavailable' },
    };
  method: pattern-match
```

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-16 |
| Output Path | jaan-to/outputs/detect/writing/summary-api.md |
| Skill | detect-writing |
| Mode | Light |
| Previous Run | AUDIT-2026-009 (2026-02-12, combined, score 5.0/10) |
| Status | Draft |
