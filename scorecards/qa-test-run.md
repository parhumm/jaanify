# Scorecard: qa-test-run

> jaan-to v6.3.0 | Cycle 11 | 2026-02-15

## Score: 4.6 / 5

## What It Did Well

- **Error categorization**: Clear diagnostic framework for classifying test failures (mock reset, API mismatch, resolution errors)
- **Auto-fix scope**: Successfully fixed 7 distinct error categories without manual intervention
- **Non-destructive**: Excluded unfixable tests (integration/missing fixtures) rather than deleting or stubbing them
- **Build preservation**: All fixes maintained API type check passing (0 errors)

## What Needs Improvement

- **Missing fixtures**: Skill should detect `test/fixes/` imports that don't exist and flag them as "missing upstream output" rather than letting them fail at runtime
- **Integration test awareness**: Should detect tests requiring external services (DB) and auto-exclude them with a clear message, rather than letting process.exit crash the runner
- **setupFiles detection**: The skill didn't catch that `vitest.config.ts` was missing its `setupFiles` entry — this was the root cause of 40+ failures. Config validation should be a Phase 1 step

## Observations

- First test run in Jaanify's history — 77 unit + security tests passing
- Node 18 ↔ jose v6 webcrypto incompatibility required pool-level workaround
- The `.js` → `.ts` import resolution is a common pain point for NodeNext TypeScript projects using Vitest
- ProblemType rename cascade (source → tests) highlights the need for test-source coupling analysis

## Tested With

| Input | Value |
|-------|-------|
| Project | Jaanify (apps/api) |
| Framework | Vitest 2.1.9 + MSW 2.x |
| Test Count | 77 passing / 0 failing |
| Coverage | Not measured (deferred) |
