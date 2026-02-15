# Lessons: dev-output-integrate

> Last updated: 2026-02-15 (Cycle 11)

---

## Edge Cases

- ESLint 9 flat config: backend-scaffold should generate `eslint.config.js` — ESLint has no auto-discovery fallback
- Vitest + Playwright in same workspace: must generate `vitest.config.ts` with `exclude: ['e2e/**']`
- TypeScript tsconfig in Next.js: must exclude `e2e/` from include pattern — Playwright types conflict
- `next-env.d.ts` is auto-generated — must be in ESLint ignores

## Common Mistakes

- Not generating config files (eslint, vitest) alongside source files — integration breaks at CI
- Assuming CI will use the same tool resolution as local dev — monorepo hoisting masks missing dependencies

## Workflow

- After integration: verify lint, typecheck, and test commands pass locally
- Check if integrated files reference dependencies not in package.json
- Validate that CI workflow config files match the actual project structure
