# Lessons: dev-verify

> Last updated: 2026-02-15 (Cycle 11)

---

## Edge Cases

- NodeNext moduleResolution: TypeScript uses `.js` extensions in imports for `.ts` files — Vitest needs `test.alias` mapping to resolve correctly
- jose v6 requires Web Crypto API — Node 18 needs `--experimental-global-webcrypto` flag via `pool: 'forks'` + `execArgv`
- `mockReset: true` in Vitest resets all mock implementations between tests — module-level mock setups must be repeated in `beforeEach`
- Prisma `$transaction` mock needs re-setup after `mockReset` — callback implementation lost between tests
- e2e Playwright specs must be excluded from both Vitest `include` and TypeScript `tsconfig.json exclude`
- ESLint 9 flat config requires explicit `eslint.config.js` — no automatic detection from `.eslintrc`

## Common Mistakes

- Not running `prisma generate` before `tsc --noEmit` — causes missing Prisma client types
- Assuming Vitest excludes e2e by default — it includes all `*.test.ts` files regardless of test framework
- Not checking `setupFiles` in vitest.config.ts — MSW server lifecycle depends on this
- Using `vi.doMock` without `vi.resetModules()` — cached module registry ignores new mock

## Workflow

- Run type check FIRST to catch compilation errors before test execution
- Categorize build errors: missing-dependency, export-import-mismatch, type-mismatch, config-mismatch
- Auto-fix dependency installs and export renames; report schema-drift for upstream fix
- Build pipeline order: install → prisma generate → tsc --noEmit → full build
