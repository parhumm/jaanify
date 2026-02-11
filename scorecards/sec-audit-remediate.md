# Scorecard: sec-audit-remediate

> Tested: 2026-02-11 (C7) | jaan-to v6.0.0 (SHA: 736820e) | Cycle 7
> Skill version: v6.0.0 (new skill)
> First test — no prior scorecard exists

---

## Score: 4.5 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4.5/5 | Generated 12 output files (6 fixes + 4 tests + 2 reports) covering 5 open findings + 1 hardening measure. Correctly identified 3 findings already fixed in prior cycles. All Critical and High findings addressed |
| Output Quality | 25% | 4.5/5 | Fix files are production-ready Fastify plugins (fp-wrapped, versioned). Test files have 27 test cases covering attack-replay, negative, positive, and boundary scenarios. RFC 9457 error format on rate limit and CSRF failures. Integration readme has per-fix instructions with before/after code |
| Context Awareness | 20% | 5/5 | Cross-referenced detect-dev findings against current source code (post backend-service-implement). Correctly identified E-DEV-001 as already fixed. Used Fastify v5 plugin patterns, fastify-plugin wrapper, Zod validation. Referenced OWASP Top 10 mapping throughout |
| Learning Integration | 15% | 4/5 | Applied research docs 72 (jose JWT, httpOnly cookies, CSRF patterns) and 73 (SARIF parsing, CWE-to-fix mapping). No learn file existed (first run). Triage matrix correctly applied: Confirmed+Critical/High → auto-fix, Tentative+Medium → fix+review |
| Workflow Efficiency | 10% | 4.5/5 | Single-pass generation with clear triage presentation before writing. Application order documented for correct plugin registration sequence. Rollback plan included for each fix |

---

## Strengths

1. **Cross-reference with current state** — Did not re-generate a fix for E-DEV-001 (JWT verification) since backend-service-implement already addressed it. Saved effort and avoided conflicting fixes
2. **Defense-in-depth approach** — Added security headers via @fastify/helmet as bonus hardening even though no specific finding required it. CSRF protection uses three layers: SameSite cookie + CSRF token + CORS
3. **Production-ready plugin architecture** — All fixes are wrapped in `fastify-plugin` with name and version constraints, matching the project's existing plugin pattern (auth.ts). Clean integration path
4. **Comprehensive regression tests** — 27 test cases including attack-replay scenarios (forged CSRF tokens, rate limit exhaustion), boundary tests (auth endpoint stricter limits), and negative tests (missing headers)
5. **Actionable integration guide** — Per-fix instructions with exact file paths, before/after code snippets, plugin registration order, and rollback plan. Frontend changes documented for token storage migration

## Issues

1. **CSRF exempt list may need expansion** — Only `/v1/auth/google` and `/v1/auth/register` are CSRF-exempt. If guest session endpoints or webhook endpoints are added later, they'll need exemption too
2. **Rate limit uses in-memory store** — Default @fastify/rate-limit uses in-memory counters, which don't share across multiple server instances. Production with horizontal scaling needs Redis-backed store
3. **Typed formatters reference Prisma types directly** — If Prisma model changes, formatters need updating. Could be addressed with automatic generation from schema, but manual is acceptable for MVP
4. **No fix for Google id_token verification** — auth.service.ts line 68 still uses `decodeJwt()` for Google's id_token (noted in backend-service-implement scorecard). This is lower risk since the token comes from Google's token endpoint, but would be more secure with JWKS verification

## Gaps Discovered

- Rate limit persistence across server restarts/replicas needs Redis store configuration
- Google id_token should be verified against Google's JWKS endpoint for maximum security
- Content-Security-Policy may need adjustment when Swagger UI is accessed (inline styles)
- No security monitoring/alerting generated (OWASP A09: Logging Failures not addressed)
