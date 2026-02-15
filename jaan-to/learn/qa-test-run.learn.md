# Lessons: qa-test-run

> Last updated: 2026-02-15 (Cycle 11)

---

## Edge Cases

- `@fastify/csrf-protection` v7 uses `fastify.csrfProtection(req, reply, callback)` — not `request.csrfToken()` from v6
- CSRF plugin sends its own 403 response bypassing custom error handlers — must use `setErrorHandler` + `preHandler` hook
- ProblemType renames in source must cascade to test assertions — keep test-source coupling tight
- BusinessError stores detail in `super(detail)` as `this.message` — tests should use `error.message`, not `error.detail`
- Integration tests calling `validateEnv()` crash with `process.exit(1)` in test environments — exclude by default
- Missing fixture files (`test/fixes/`) cause import errors — detect and flag as "missing upstream output"

## Common Mistakes

- Not checking `vitest.config.ts` for `setupFiles` entry — root cause of 40+ failures from missing MSW server
- Using old mock API patterns after library major version bumps (CSRF v6 → v7)
- Forgetting `vi.resetModules()` when using `vi.doMock()` for per-test module overrides
- Not re-mocking dependent modules after `vi.resetModules()` — Prisma mock also needs re-setup

## Workflow

- Phase 1: Validate config (setupFiles, alias, pool settings) BEFORE running tests
- Phase 2: Run tests, categorize failures (mock reset, API mismatch, resolution errors)
- Phase 3: Auto-fix per category; exclude unfixable (integration/missing fixtures)
- Config validation should be the FIRST step — it catches root causes of mass failures
