# Scorecard: qa-test-generate

> Tested: 2026-02-11 (C7) | jaan-to v6.0.0 (SHA: 736820e) | Cycle 7
> Skill version: v6.0.0 (new skill)
> First test — no prior scorecard exists

---

## Score: 4.3 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4.5/5 | Generated 38 files (3934 lines) covering all 3 test tiers: 8 unit tests (~45 scenarios), 3 integration tests (~20 scenarios), 7 E2E Playwright specs (74 scenarios). Complete factory layer, MSW handlers, and dual configs (Vitest workspace + Playwright BDD). All 74 BDD scenarios from qa-test-cases are mapped |
| Output Quality | 25% | 4/5 | Tests have concrete assertions (no `expect(true).toBe(true)` stubs). Factory variants match entity schemas. MSW handlers cover Google OAuth + OpenAI with error variants. Custom matchers (toBeRFC9457Error, toHaveCursorPagination) add domain-specific validation. However, some E2E tests use conditional checks that silently pass when features are absent |
| Context Awareness | 20% | 4.5/5 | Correctly read backend-scaffold, service-implement, api-contract, and BDD test cases. Used Prisma v6 APIs in integration tests, jose for JWT in unit tests, native fetch patterns for OpenAI mocking. Import paths reference actual source modules. Tag routing (@smoke, @boundary, @edge-case) follows research doc 71 patterns |
| Learning Integration | 15% | 4/5 | Applied research doc 71 patterns: Fishery factories, MSW v2 handlers, Vitest workspace separation, playwright-bdd step binding. No learn file existed (first run). Applied ESM `.js` extension convention in imports. Missed: no jest-cucumber binding for Vitest (used plain describe/it instead of Given/When/Then step definitions for unit tests) |
| Workflow Efficiency | 10% | 4.5/5 | Single-pass generation of all 38 files with no manual intervention needed. Clear directory structure (config/, unit/, integration/, e2e/, fixtures/). Output document includes CI execution guide with npm scripts and GitHub Actions snippets |

---

## Strengths

1. **Full BDD scenario coverage** — All 74 scenarios from 7 features (US-01 through US-07) mapped to corresponding test files. Tag routing correctly distributes scenarios across unit, integration, and E2E tiers
2. **Rich test data layer** — 4 Fishery factories with meaningful variants (e.g., task: withDeadline, highPriority, aiParsed, deleted). DB seed module provides named scenarios (seedDashboardUser, seedMaxTasks). MSW handlers mock both Google OAuth token exchange and OpenAI completions with error variants (503, 400, timeout)
3. **Domain-specific test utilities** — Custom Vitest matchers: `toBeRFC9457Error(type, status)` validates Problem Details format, `toHaveCursorPagination()` validates cursor response shape. `buildTestApp()` helper constructs Fastify instance with auth plugin for integration tests. `generateTestToken()` and `authenticatedInject()` simplify auth in test setup
4. **Comprehensive E2E accessibility testing** — Dedicated `accessibility.spec.ts` with axe-core automated audit (WCAG 2.0 A/AA/2.1 AA), keyboard navigation trap detection, focus management verification, and reduced-motion preference testing
5. **Realistic priority scoring tests** — Unit tests for `calculatePriorityScore()` cover past-due deadlines, no-deadline tasks, within-24h urgency, and boundary conditions. Values match the algorithm spec from service implementation

## Issues

1. **Conditional E2E assertions may silently pass** — Several E2E tests use `if (await element.isVisible())` guards that skip assertions when features aren't rendered. Examples: `task-prioritization.spec.ts` line 72 (task with no AI priority), `accessibility.spec.ts` line 168 (visual timeline). These tests pass vacuously when the feature is absent, hiding potential regressions
2. **No Given/When/Then binding for unit tests** — Research doc 71 recommends jest-cucumber pattern adapted for Vitest with feature-scoped step definitions. Generated unit tests use plain `describe/it` blocks instead. BDD traceability is maintained via test names but step reuse across scenarios is lost
3. **Integration tests use simplified mocking** — Integration tests mock Prisma at the module level (`vi.mock('@prisma/client')`) rather than using a real test database. This means they test service logic + route wiring but don't validate actual SQL queries or Prisma model behavior
4. **3 unfilled services have no tests** — users.service, feedback.service, and guest-sessions.service are TODO stubs (from backend-service-implement), so no unit tests were generated. This is correct behavior but means test coverage is incomplete for those endpoints
5. **WebSocket scenarios not covered** — BDD scenarios F2-S8 (WebSocket disconnection) and F2-S12 (plan refresh) are documented as known limitations. No WebSocket test infrastructure was generated
6. **E2E page objects assume specific data-testid conventions** — Page objects reference `data-testid` attributes (e.g., `task-card`, `tier2-card`, `priority-rank`) that must match frontend implementation exactly. No mapping document generated to guide frontend developers

## Gaps Discovered

- jest-cucumber or equivalent BDD binding for Vitest unit tests would improve step reuse and traceability
- Real database integration testing (e.g., testcontainers or SQLite in-memory) not included
- WebSocket test infrastructure needed for real-time plan update scenarios
- Frontend developers need a data-testid contract document to match E2E page objects
- Performance threshold tests (LCP, timing) may need CI-specific calibration
