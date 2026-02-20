# Backend Task Breakdown: Login/Auth Cookie Migration

> PRD: PRD-02 | Feature: F-07 (Token Management) + F-05 (Google OAuth) + F-06 (Logout)
> Date: 2026-02-20 | Cycle 13

---

## Current State Analysis

The backend already has:
- Fastify v5 auth routes: `POST /auth/google`, `POST /auth/refresh`, `POST /auth/register`, `DELETE /auth/logout`
- JWT token generation/verification in `lib/auth-tokens.ts` (HS256, 15m access / 7d refresh)
- Auth middleware plugin in `plugins/auth.ts` (extracts Bearer token from Authorization header)
- Cookie plugin registered (`@fastify/cookie`)
- CORS with `credentials: true`
- CSRF protection with double-submit cookie pattern
- **Unused** helper: `lib/secure-cookies.ts` has `setRefreshTokenCookie()` / `clearRefreshTokenCookie()` -- written but never wired in
- **Unused** helper: `lib/cookie-helpers.ts` has `getRefreshTokenFromCookie()` -- written but never wired in

## What Needs to Change

The core change: stop returning tokens in JSON body, start setting them as HttpOnly cookies via `Set-Cookie` headers. The access token is also set as a cookie (per PRD requirement for middleware session checks), while remaining available in the JSON response for the frontend in-memory store.

---

## Tasks

### T-01: Update `secure-cookies.ts` -- Add Access Token Cookie Helper

**File:** `apps/api/src/lib/secure-cookies.ts`

**Why:** The existing file only handles the refresh token cookie. PRD requires the access token to also be in an HttpOnly cookie (for Next.js middleware to check session existence).

**Changes:**
- Add `setAccessTokenCookie(reply, accessToken, options?)` -- HttpOnly, Secure, SameSite=Lax, path="/", maxAge=900 (15m)
- Add `clearAccessTokenCookie(reply, options?)`
- Add `setAuthCookies(reply, tokens)` convenience function that sets both cookies
- Add `clearAuthCookies(reply)` convenience function that clears both cookies
- Cookie names: `jaanify_access` (access), `jaanify_refresh` (refresh)
- Access token SameSite=Lax (needs to be sent on navigations for middleware check)
- Refresh token SameSite=Strict (only sent on same-origin POST to /auth/refresh)

**Acceptance:**
- [ ] `setAuthCookies` sets both cookies with correct flags
- [ ] `clearAuthCookies` clears both cookies with matching path/domain

---

### T-02: Update `POST /auth/google` Route -- Set Cookies on Login

**File:** `apps/api/src/routes/auth/index.ts`

**Why:** Currently returns `{ access_token, refresh_token, token_type, expires_in }` in JSON body. Must set cookies AND return access_token in body (for frontend in-memory store).

**Changes:**
- Import `setAuthCookies` from `lib/secure-cookies.ts`
- After `authService.googleAuth()` returns tokens, call `setAuthCookies(reply, tokens)`
- Still return JSON body with `{ access_token, token_type, expires_in }` (no refresh_token in body)
- Update response schema to make `refresh_token` absent from body

**Acceptance:**
- [ ] `Set-Cookie` headers include `jaanify_access` and `jaanify_refresh`
- [ ] JSON response body does NOT contain `refresh_token`

---

### T-03: Update `POST /auth/refresh` Route -- Read Cookie, Set New Cookies

**File:** `apps/api/src/routes/auth/index.ts`

**Why:** Currently reads `refresh_token` from request body. Must read from cookie instead (with body fallback for backwards compat during migration).

**Changes:**
- Import `getRefreshToken` from `lib/cookie-helpers.ts`
- Import `setAuthCookies` from `lib/secure-cookies.ts`
- Read refresh token from cookie first, body second: `getRefreshToken(request, body?.refresh_token)`
- After `authService.refreshToken()` returns new tokens, call `setAuthCookies(reply, tokens)`
- Return JSON body with `{ access_token, token_type, expires_in }` (no refresh_token)

**Acceptance:**
- [ ] Refresh works when token is in cookie (no body)
- [ ] Refresh works when token is in body (backwards compat)
- [ ] New cookies are set on successful refresh
- [ ] Returns 401 if no refresh token found in either location

---

### T-04: Update `POST /auth/register` Route -- Set Cookies on Registration

**File:** `apps/api/src/routes/auth/index.ts`

**Why:** Same as T-02 -- currently returns tokens in body, needs to set cookies.

**Changes:**
- Import `setAuthCookies` from `lib/secure-cookies.ts`
- After `authService.register()` returns tokens, call `setAuthCookies(reply, tokens)`
- Return JSON body without `refresh_token`

**Acceptance:**
- [ ] Cookies set on successful registration
- [ ] Guest task migration still works (no regression)

---

### T-05: Update `DELETE /auth/logout` Route -- Clear Cookies

**File:** `apps/api/src/routes/auth/index.ts`

**Why:** Currently a no-op (client clears localStorage). Must now clear HttpOnly cookies server-side since the client cannot access them via JavaScript.

**Changes:**
- Import `clearAuthCookies` from `lib/secure-cookies.ts`
- Call `clearAuthCookies(reply)` before sending 204
- Keep the `authService.logout()` call for future server-side invalidation

**Acceptance:**
- [ ] Response includes `Set-Cookie` headers that expire both cookies
- [ ] 204 status code still returned

---

### T-06: Update Auth Schema -- Remove `refresh_token` from Response

**File:** `apps/api/src/routes/auth/auth.schema.ts`

**Why:** The `authTokensSchema` response schema includes `refresh_token`. Since it will no longer be in the body, the schema needs updating to avoid Fastify serialization issues.

**Changes:**
- Create `authResponseSchema` (body response): `{ access_token, token_type, expires_in }` -- no `refresh_token`
- Keep `authTokensSchema` for internal use (service layer still returns both tokens)
- Update route `response` schemas to use `authResponseSchema`

**Acceptance:**
- [ ] Swagger docs show response without `refresh_token`
- [ ] No Fastify serialization warnings

---

### T-07: Update CORS Configuration for Cookie Credentials

**File:** `apps/api/src/app.ts`

**Why:** CORS is already `credentials: true`, but `CORS_ORIGIN` defaults to `http://localhost:3001`. Need to verify this is NOT set to `*` (wildcard) because `credentials: true` + wildcard origin is rejected by browsers.

**Changes:**
- Verify `CORS_ORIGIN` env var is a specific origin, not `*`
- Add `FRONTEND_URL` env var as alias for `CORS_ORIGIN` if not already present (PRD uses this terminology)
- No code change needed if `CORS_ORIGIN` is already properly configured (it is -- defaults to `http://localhost:3001`)

**Acceptance:**
- [ ] CORS allows credentials from the frontend origin
- [ ] No wildcard origin when credentials are enabled

---

### T-08: Add `/auth/google/callback` GET Route (Optional Enhancement)

**File:** `apps/api/src/routes/auth/index.ts`

**Why:** PRD step 7 says "Frontend redirects to `redirect` param". An alternative flow has Google redirect directly to the backend callback, which sets cookies and redirects the browser to the frontend. This simplifies the frontend (no need to handle the code exchange).

**Changes:**
- Add `GET /auth/google/callback?code=...&state=...` route
- Exchange code for tokens (reuse `authService.googleAuth`)
- Set cookies via `setAuthCookies(reply, tokens)`
- Redirect to frontend URL (from `state` param or default to `CORS_ORIGIN/dashboard`)
- Mark as public path in auth plugin

**Priority:** OPTIONAL -- only if the team decides on backend-redirect flow instead of frontend code exchange. The current `POST /auth/google` flow works fine with the frontend handling the redirect.

**Acceptance:**
- [ ] GET callback exchanges code, sets cookies, redirects to frontend
- [ ] State parameter prevents open redirect (validate against allowed origins)

---

### T-09: Update Auth Plugin -- Add Cookie-Based Token Extraction (for middleware)

**File:** `apps/api/src/plugins/auth.ts`

**Why:** The auth plugin currently ONLY reads the `Authorization: Bearer <token>` header. For cookie-based auth, the access token will also be available in the `jaanify_access` cookie. The plugin should check both.

**Changes:**
- After checking `Authorization` header, fall back to `request.cookies?.jaanify_access`
- Priority: Header > Cookie (allows API clients to use Bearer, browsers use cookies)
- No other logic changes

**Acceptance:**
- [ ] Auth works with `Authorization: Bearer <token>` header (existing behavior)
- [ ] Auth works with `jaanify_access` cookie (new behavior)
- [ ] Header takes priority if both are present

---

## Task Dependency Graph

```
T-01 (cookie helpers)
  |
  +---> T-02 (google auth route)
  +---> T-03 (refresh route)
  +---> T-04 (register route)
  +---> T-05 (logout route)
  |
T-06 (schema update) --- can run in parallel with T-01
T-07 (CORS verify) ----- can run in parallel with T-01
T-09 (auth plugin) ----- can run in parallel with T-01
T-08 (callback GET) ---- optional, depends on T-01
```

## Implementation Order

1. **T-01** + **T-06** + **T-07** + **T-09** (parallel -- no dependencies)
2. **T-02** + **T-03** + **T-04** + **T-05** (parallel -- all depend on T-01)
3. **T-08** (optional, after T-01)

## Files Modified (Summary)

| File | Tasks |
|------|-------|
| `apps/api/src/lib/secure-cookies.ts` | T-01 |
| `apps/api/src/routes/auth/index.ts` | T-02, T-03, T-04, T-05, T-08 |
| `apps/api/src/routes/auth/auth.schema.ts` | T-06 |
| `apps/api/src/app.ts` | T-07 (verify only) |
| `apps/api/src/plugins/auth.ts` | T-09 |

## No Changes Needed

| File | Reason |
|------|--------|
| `lib/auth-tokens.ts` | Token generation/verification is unchanged |
| `lib/cookie-helpers.ts` | Already has the helpers we need |
| `lib/env.ts` | CORS_ORIGIN already configured |
| `prisma/schema.prisma` | No model changes for cookie-based auth |
| `auth.service.ts` | Service layer returns tokens -- route layer sets cookies |
| `plugins/csrf-protection.ts` | Already working, no changes needed |
