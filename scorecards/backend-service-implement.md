# Scorecard: backend-service-implement

> Tested: 2026-02-11 (C7) | jaan-to v6.0.0 (SHA: 736820e) | Cycle 7
> Skill version: v6.0.0 (new skill)
> First test — no prior scorecard exists

---

## Score: 4.4 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4.5/5 | Filled 3 of 6 service modules (auth, tasks, daily-plans) + 3 helper libs + auth plugin rewrite. users, feedback, guest-sessions left as stubs. Coverage is partial but hits all critical-path services |
| Output Quality | 25% | 4.5/5 | Proper jose `jwtVerify` (fixes E-DEV-001 critical finding), HS256 with iss/aud/jti claims, separate access+refresh secrets. Transaction-based guest migration. AI integration with timeout + graceful fallback. RFC 9457 errors throughout |
| Context Awareness | 20% | 5/5 | Read API contract, data model, scaffold stubs, and tech.md. Correctly used Prisma v6 APIs, Fastify v5 plugin patterns, jose for JWT, native fetch for OpenAI. All env vars match the env schema from tech stack |
| Learning Integration | 15% | 4/5 | Applied lessons: ESM `.js` extensions, service-layer functions (not classes), Prisma error mapping. Used `findFirstOrThrow` for ownership checks. Missed: no audit log entries written (AuditLog table exists but unused) |
| Workflow Efficiency | 10% | 4/5 | Generated 8 files (1222 insertions) in one pass. Clear separation: helpers in lib/, services in routes/. Auth plugin fully rewritten from scratch. Minor: could have generated all 6 service modules |

---

## Strengths

1. **Fixes critical security finding (E-DEV-001)** — Auth plugin now uses `verifyAccessToken()` (jose `jwtVerify` with secret) instead of `decodeJwt()`. Proper cryptographic verification with iss/aud/clockTolerance claims
2. **AI integration with graceful degradation** — Both `parseTask` and `generatePlan` attempt OpenAI gpt-4o-mini, fall back to rule-based logic if env var missing, API fails, or 5s timeout fires. AbortController used for timeout control
3. **Transaction-based guest migration** — `register()` runs inside `prisma.$transaction()` with maxWait/timeout: validates session → creates user → migrates tasks → deletes session → generates tokens. Atomic and correct
4. **Priority scoring algorithm** — `calculatePriorityScore()` combines deadline proximity (5 tiers, 0-30 points) + energy level (3 tiers, 0-20 points) + base 50, normalized to 0-1 Decimal(5,4). Matches data model spec
5. **Token security** — Separate JWT_SECRET and REFRESH_TOKEN_SECRET. Refresh tokens carry only `sub` claim (no email/role). Access tokens include `jti` for future revocation. 15min/7day TTLs match spec

## Issues

1. **3 of 6 service modules unfilled** — `users.service.ts`, `feedback.service.ts`, `guest-sessions.service.ts` still have TODO stubs. These are lower-priority endpoints but represent incomplete coverage
2. **Google id_token decoded without verification** — `exchangeGoogleCode()` uses `decodeJwt()` on Google's id_token (line 68 of auth.service.ts). While the token comes from Google's token endpoint (trusted channel), verifying the signature against Google's JWKS would be more secure
3. **No refresh token rotation** — `refreshToken()` issues a new pair but doesn't invalidate the old refresh token. Without a deny-list (Redis) or sessions table, old refresh tokens remain valid until TTL expiry
4. **No audit logging** — AuditLog table exists in the schema but no service writes to it. Auth events (login, register, logout) should create audit entries
5. **OpenAI call inside Prisma transaction** — `generatePlan()` makes an HTTP call to OpenAI inside `$transaction()`. If OpenAI is slow (up to 5s timeout), the transaction holds open. The 10s transaction timeout mitigates this, but the network call should ideally be outside the transaction
6. **Logout is a no-op** — Documented as intentional for MVP (stateless JWT), but should be flagged for future server-side invalidation

## Gaps Discovered

- 3 service modules (users, feedback, guest-sessions) still need implementation
- No audit log integration despite schema support
- Refresh token revocation requires Redis or sessions table (not yet scaffolded)
