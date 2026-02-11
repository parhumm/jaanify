# Integration Instructions — Jaanify MVP Security Hardening

## Prerequisites

Install new dependencies:

```bash
pnpm add @fastify/rate-limit @fastify/helmet @fastify/csrf-protection
```

## Fix Application Order

Apply fixes in this order (dependencies flow top-down):

1. **Security headers** (security-headers.ts) — must be FIRST plugin registered
2. **Rate limiter** (rate-limiter.ts) — before routes
3. **Cookie types** (cookie-types.ts) — import in auth routes
4. **Secure token storage** (secure-token-storage.ts) — auth route changes
5. **CSRF protection** (csrf-protection.ts) — after cookie plugin, before routes
6. **Typed formatters** (typed-formatters.ts) — replace existing formatters in routes

## Per-Fix Instructions

### 1. Security Headers (fixes/security-headers.ts)

**What it does:** Registers @fastify/helmet with CSP, HSTS, X-Frame-Options, nosniff.

**Where to integrate:** `apps/api/src/app.ts` — register as the FIRST plugin.

```ts
// BEFORE (app.ts)
await app.register(cors, { origin: env.CORS_ORIGIN, credentials: true });

// AFTER (app.ts)
import { securityHeadersPlugin } from "./plugins/security-headers.js";

await app.register(securityHeadersPlugin); // FIRST plugin
await app.register(cors, { origin: env.CORS_ORIGIN, credentials: true });
```

**Copy file to:** `apps/api/src/plugins/security-headers.ts`

### 2. Rate Limiter (fixes/rate-limiter.ts)

**What it does:** Registers @fastify/rate-limit with tiered limits.

**Where to integrate:** `apps/api/src/app.ts` — after sensible, before routes.

```ts
// BEFORE (app.ts)
await app.register(sensible);
// ... swagger ...
await app.register(errorHandlerPlugin);

// AFTER (app.ts)
import { rateLimitPlugin } from "./plugins/rate-limiter.js";

await app.register(sensible);
await app.register(rateLimitPlugin); // ADD THIS
// ... swagger ...
await app.register(errorHandlerPlugin);
```

**Per-route limits:** Add rate limit config to auth routes:

```ts
// In auth route registration:
app.post("/auth/google", {
  config: { rateLimit: { max: 5, timeWindow: "1 minute" } },
  handler: googleAuthHandler,
});
```

**Copy file to:** `apps/api/src/plugins/rate-limiter.ts`

### 3. Cookie Types (fixes/cookie-types.ts)

**What it does:** Provides type-safe cookie access for refresh tokens.

**Where to integrate:** `apps/api/src/routes/auth/auth.service.ts` or route handler.

```ts
// In auth refresh handler:
import { getRefreshToken } from "../../lib/cookie-helpers.js";

const refreshToken = getRefreshToken(request, request.body?.refresh_token);
```

**Copy file to:** `apps/api/src/lib/cookie-helpers.ts`

### 4. Secure Token Storage (fixes/secure-token-storage.ts)

**What it does:** Sets refresh token in httpOnly cookie instead of returning it in response body.

**Where to integrate:** Auth route handlers that return tokens.

```ts
// BEFORE (auth route handler)
return tokens; // { access_token, refresh_token, token_type, expires_in }

// AFTER (auth route handler)
import { setRefreshTokenCookie } from "../../lib/secure-cookies.js";

setRefreshTokenCookie(reply, tokens.refresh_token);
return {
  access_token: tokens.access_token,
  token_type: tokens.token_type,
  expires_in: tokens.expires_in,
  // refresh_token is in httpOnly cookie, NOT in response body
};
```

**Frontend changes required:**
- Remove all `localStorage.getItem("jaanify_access_token")`
- Remove all `localStorage.setItem("jaanify_access_token", ...)`
- Store access token in Zustand store (in-memory only)
- Add silent refresh via httpOnly cookie on 401 responses
- See the frontend pattern in the fix file comments

**Copy file to:** `apps/api/src/lib/secure-cookies.ts`

### 5. CSRF Protection (fixes/csrf-protection.ts)

**What it does:** Adds CSRF token validation for all mutation endpoints.

**Where to integrate:** `apps/api/src/app.ts` — after cookie, before routes.

```ts
// AFTER cookie registration:
await app.register(cookie);
import { csrfPlugin } from "./plugins/csrf-protection.js";
await app.register(csrfPlugin); // ADD THIS
```

**Frontend changes required:**
- On app load, call `GET /v1/auth/csrf-token`
- Store the returned token in memory
- Add `x-csrf-token` header to all POST/PATCH/PUT/DELETE requests

**Copy file to:** `apps/api/src/plugins/csrf-protection.ts`

### 6. Typed Formatters (fixes/typed-formatters.ts)

**What it does:** Replaces `Record<string, unknown>` formatters with Prisma-typed versions.

**Where to integrate:** Replace existing formatters in route handler files.

```ts
// BEFORE
function formatTaskResponse(task: Record<string, unknown>) { ... }

// AFTER
import { formatTaskResponse } from "../../lib/formatters.js";
// Uses Prisma Task type directly
```

**Copy file to:** `apps/api/src/lib/formatters.ts`

## Test Execution

Run the regression tests:

```bash
# Copy test files first
cp -r jaan-to/outputs/sec/remediate/01-jaanify-mvp-hardening/tests/ apps/api/test/security/

# Run security regression tests
pnpm vitest run apps/api/test/security/
```

## CI Integration

Add to GitHub Actions workflow:

```yaml
- name: Security Regression Tests
  run: pnpm vitest run apps/api/test/security/
```

## Verification Checklist

After applying all fixes, verify:

- [ ] `pnpm build` succeeds (no TypeScript errors)
- [ ] Rate limiting: `curl -v` auth endpoint 6 times → 6th returns 429
- [ ] Cookie: Login response sets `jaanify_refresh` httpOnly cookie
- [ ] Cookie: `document.cookie` in browser console does NOT show `jaanify_refresh`
- [ ] CSRF: POST without `x-csrf-token` header → 403
- [ ] CSRF: GET /v1/auth/csrf-token returns token
- [ ] Headers: Response includes `Content-Security-Policy`, `Strict-Transport-Security`
- [ ] Headers: No `X-Powered-By` header in responses
- [ ] All 27 security regression tests pass

## Rollback Plan

Each fix is an independent Fastify plugin:

1. **Security headers:** Remove `securityHeadersPlugin` registration from app.ts
2. **Rate limiter:** Remove `rateLimitPlugin` registration from app.ts
3. **CSRF:** Remove `csrfPlugin` registration from app.ts
4. **Token storage:** Revert auth handlers to return refresh_token in body
5. **Typed formatters:** Revert to `Record<string, unknown>` formatters
6. **Cookie types:** Remove import, revert to `request.cookies?.refresh_token`

Uninstall dependencies: `pnpm remove @fastify/rate-limit @fastify/helmet @fastify/csrf-protection`
