# Scorecard: frontend-scaffold

> Tested: 2026-02-09 | jaan-to v4.5.0 | Cycle 4
> Skill version: v4.2.0

---

## Score: 4.6 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 5/5 | All 26 components generated, all 21 API endpoints covered with hooks, 25 TypeScript types from OpenAPI, 4 Zustand stores, 3 pages with routing |
| Output Quality | 25% | 4.5/5 | Correct React 19 patterns (ref as prop, no forwardRef, no manual memo), TailwindCSS v4 CSS-first config, `@theme {}` with OKLCH, `@custom-variant dark`, Server Components default. Minor: all components in single file (scaffold format), `@theme dark` syntax may not be valid v4 |
| Context Awareness | 20% | 5/5 | Correctly read tech.md — React 19 (not 18), Next.js 15 App Router (not Pages), TailwindCSS v4 (not v3), Zustand v5, TanStack Query v5, pnpm. All design tokens extracted from HTML previews |
| Learning Integration | 15% | 4/5 | Applied learn.md lessons: no `useEffect` for data fetching, no `forwardRef`, no `tailwind.config.js`, no `@tailwind` directives, `@utility` instead of `@layer utilities`. Missed: Orval config not fully integrated into hooks file (manual hooks written instead of generated) |
| Workflow Efficiency | 10% | 4.5/5 | All 7 files generated with correct naming convention. HARD STOP handled via autonomous decision protocol. Index updated. Commit clean |

---

## Strengths

1. **Complete component coverage** — All 26 components from the task breakdown inventory are present with correct atomic design levels and state definitions
2. **Server/Client boundary correctness** — 8 Server Components (display-only: Badge, ProgressDots, Skeleton, StatCard, DashboardHeader, DashboardLayout, pages) vs 18 Client Components, with `'use client'` only where interactivity is needed
3. **Modern React 19 patterns** — `ref` as regular prop, React Compiler enabled in next.config, `useActionState` awareness, no deprecated patterns (`forwardRef`, `useMemo`, `useCallback`, `Context.Provider`, `defaultProps`)
4. **TailwindCSS v4 accuracy** — `@import "tailwindcss"`, `@theme {}` blocks, OKLCH colors, `@custom-variant dark`, `@utility` for custom utilities, `@tailwindcss/postcss` as single PostCSS plugin, no `tailwind.config.js`
5. **Accessibility depth** — Skip nav link, `aria-expanded`, `aria-invalid`, `aria-describedby`, `aria-label`, `aria-current="step"`, `sr-only`, `role="alert"`, focus-visible rings, reduced motion support, 44x44px touch targets, semantic HTML
6. **Query key factory** — Hierarchical `queryKeys` object with `queryOptions()` factories for type-safe reuse

## Issues

1. **`@theme dark` syntax uncertain** — TailwindCSS v4 dark mode via `@theme dark {}` may not be the correct API; the standard approach uses CSS `@media (prefers-color-scheme: dark)` inside `@theme` or class-based via `@custom-variant dark`
2. **Orval not wired into hooks** — The `orval.config.ts` is present but hooks are manually written rather than generated; in production you'd run `pnpm generate:api` and import from `src/lib/api/generated/`
3. **No test stubs generated** — Vitest/Playwright configs and test files not scaffolded (same gap as backend-scaffold)
4. **All components in single file** — Scaffold format bundles all 26 components into one `.tsx` file; extraction into individual files is a manual step
5. **DailyPlanResponse import** — The `DailyPlanComponent` references `DailyPlanResponse` type but the import in the single-file scaffold may not resolve; works when extracted to individual files
6. **Missing Storybook config** — Listed in tech.md but not scaffolded

## Gaps Discovered

- No MSW (Mock Service Worker) setup for development API mocking
- No Storybook v8 configuration scaffolded
- No PWA manifest or service worker scaffolded
- No Sentry error monitoring setup
- No CI/CD pipeline configuration
- No Docker development environment

## Comparison with Previous Skills

| Metric | backend-scaffold (C4) | frontend-scaffold (C4) |
|--------|----------------------|----------------------|
| Score | 4.7/5 | 4.6/5 |
| Components/Entities | 21 routes + 7 models | 26 components + 20 hooks |
| Context aware | Yes | Yes |
| Learn integration | Good | Good |
| Test stubs | No | No |
| Framework accuracy | Fastify v5 correct | React 19 + Next.js 15 correct |
| Config generation | package.json + tsconfig | package.json + next.config + postcss + globals.css |
