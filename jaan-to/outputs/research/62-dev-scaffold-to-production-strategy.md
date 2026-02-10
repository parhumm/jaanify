---
title: "Scaffold-to-Production Strategy: Fastify v5 + Next.js 15 + Prisma v6 Monorepo"
category: dev
date: 2026-02-10
topic: "Strategies for transitioning from scaffold TODO stubs to production code"
sources_consulted: 45
research_method: "Adaptive 3-wave (Scout + Gap Fill + Verification)"
tool:
  name: "pm-research-about"
  version: "1.0.0"
status: final
---

# Scaffold-to-Production Strategy: Fastify v5 + Next.js 15 + Prisma v6 Monorepo

> Researched: 2026-02-10 | jaan-to v5.0.0 (SHA: 5e22ff19) | Cycle 5
> Sources: ~45 unique sources across 3 research waves
> Context: Jaanify MVP — converting scaffold TODO stubs to production code

---

## Executive Summary

Converting scaffold code with TODO stubs to production requires a **vertical slice approach** — implementing complete features end-to-end rather than layer-by-layer. The optimal strategy for a Fastify v5 + Next.js 15 + Prisma v6 monorepo (Turborepo/pnpm) is:

1. **Prioritize by business value**: Start with the smallest feature that delivers user value (onboarding flow for Jaanify)
2. **Implement happy path first**: Get end-to-end working before adding error handling and edge cases
3. **Use feature flags for incremental deployment**: Deploy behind flags, toggle on gradually
4. **Test pyramid**: 70% unit (Vitest + mocked Prisma), 20% integration (real Postgres), 10% E2E (Playwright)
5. **Deploy backend first**: Backward-compatible API changes, then frontend consumes new features

Key finding: The scaffold-to-production transition is primarily a **prioritization and sequencing problem**, not a technical one. The existing scaffolds (21 BE routes, 26 FE components) are architecturally sound — the challenge is implementing the TODO stubs in the right order.

---

## 1. Vertical Slice Conversion Strategy

### What is a Vertical Slice?

A vertical slice is a complete piece of functionality cutting from UI to database. Instead of implementing all routes, then all services, then all tests (horizontal), implement one complete feature at a time (vertical).

**For Jaanify, this means:**

| Slice | Backend (Fastify) | Frontend (Next.js) | Database (Prisma) |
|-------|-------------------|--------------------|--------------------|
| Onboarding | POST /guest-sessions, POST /tasks/parse | OnboardingFlow component | GuestSession + Task models |
| Task CRUD | GET/POST/PATCH/DELETE /tasks | TaskCard, SmartTaskInput | Task model + indexes |
| Daily Plan | POST /daily-plans/generate, GET /daily-plans | DailyPlanComponent, ReasoningCard | DailyPlan + DailyPlanSlot |
| Auth | POST /auth/google, /auth/register | Auth redirects, session management | User model + OAuth |

### Priority Ordering

Based on research, the recommended order for Jaanify:

1. **Slice 1: Foundation** — Prisma migrations, env validation, Fastify server startup, health check
2. **Slice 2: Guest Onboarding** — Guest sessions + task parse (delivers first user value, matches PRD's 60-second target)
3. **Slice 3: Task CRUD** — Core task operations (most service stubs already partially implemented)
4. **Slice 4: Auth** — Google OAuth + guest-to-account migration (deferred per PRD design)
5. **Slice 5: Daily Plan** — AI plan generation + reasoning cards (requires OpenAI integration)
6. **Slice 6: Real-time** — WebSocket sync via Socket.io (enhancement, not critical path)

### Converting TODO Stubs

The existing scaffold has 22 service functions: 13 implemented, 6 pure TODO stubs, 3 partial.

**Conversion approach per stub:**

```
1. Write the test first (Vitest) — define expected behavior
2. Implement the service function — replace TODO with real logic
3. Verify the route handler works — Fastify .inject() test
4. Wire the frontend hook — TanStack Query mutation/query
5. E2E test the flow — Playwright happy path
```

**Distinctive labeling**: Use `// STUB:` prefix instead of generic `// TODO:` to distinguish migration stubs from regular TODOs. Track stub count as a metric.

---

## 2. Tech-Specific Production Patterns

### Fastify v5 Production Checklist

| Pattern | Implementation | Source |
|---------|----------------|--------|
| Reverse proxy | Nginx or HAProxy for TLS termination, never expose Node.js directly | Fastify official docs |
| Binding | Listen on `0.0.0.0` (not `127.0.0.1`) for container deployments | Fastify K8s guide |
| Capacity | 2 vCPU per instance for lowest latency (2nd handles GC + libuv) | Fastify recommendations |
| Validation | Full JSON schemas with `type` property required in v5 | v5 breaking changes |
| Testing | Use `.inject()` method — no SuperTest needed | Fastify testing guide |
| Shutdown | Graceful shutdown with SIGINT/SIGTERM handlers + `app.close()` | Already in scaffold |

### Next.js 15 Production Checklist

| Pattern | Implementation | Source |
|---------|----------------|--------|
| Caching | Explicitly opt into caching (v15 changed to uncached by default) | Next.js official |
| Error pages | Create `app/global-error.tsx` and `app/global-not-found.tsx` | Next.js production checklist |
| Build validation | Run `next build` + `next start` locally before deploy | Next.js official |
| Bundle analysis | Use `@next/bundle-analyzer` to identify bloat | Next.js official |
| Dynamic APIs | Wrap `cookies()` and `searchParams` usage with Suspense | Next.js caching guide |
| Metadata | Implement `generateMetadata()` for SEO on all pages | Next.js metadata API |

### Prisma v6 Production Workflow

| Pattern | Implementation | Source |
|---------|----------------|--------|
| Migration | `prisma migrate deploy` only in production (never `db push`) | Prisma official |
| Locking | 10-second advisory lock on PostgreSQL during migrations | Prisma docs |
| Version control | Commit `.prisma/migrations/`, `migration_lock.toml`, `schema.prisma` | Prisma best practices |
| Schema changes | Expand-and-contract pattern for zero-downtime alterations | Prisma guide |
| Testing | Mock Prisma Client in unit tests, real DB in integration tests | Prisma testing series |
| Singleton | `globalThis` pattern prevents connection pool exhaustion | Already in scaffold |

---

## 3. Monorepo Structure

### Recommended Shared Packages

```
packages/
├── shared-types/     # Zod schemas + TypeScript types (single source of truth)
├── shared-config/    # ESLint, TypeScript, PostCSS configs
└── shared-ui/        # React components used across apps (if applicable)

apps/
├── api/              # Fastify v5 backend
├── web/              # Next.js 15 frontend
└── (future: mobile/) # React Native / Kotlin
```

### Type Sharing Strategy

The existing scaffold has Zod schemas in `01-jaanify-mvp-schemas.ts` (backend) and TypeScript types in `01-jaanify-mvp-types.ts` (frontend). For production:

1. Move shared Zod schemas to `packages/shared-types/`
2. Export `z.infer<>` types from the same package
3. Backend imports schemas for validation, frontend imports types for API contracts
4. Single source of truth prevents type drift

### Turborepo Configuration

- Use `turbo run build --filter=[affected]` in CI to build only changed packages
- Enable remote caching (Vercel) to share build artifacts across CI runs
- Parallel tasks: lint, type-check, and test can run simultaneously
- Sequential tasks: build → deploy (deploy depends on build)

---

## 4. Testing Strategy

### Test Pyramid for Jaanify

```
         /\
        /  \          E2E: Playwright (10%)
       /    \         - Critical user journeys
      /------\        - Cross-browser verification
     /        \
    /  Integr. \      Integration: Vitest + real DB (20%)
   /    Tests   \     - Fastify .inject() with Postgres
  /--------------\    - Prisma operations verification
 /                \
/    Unit Tests    \  Unit: Vitest + mocked deps (70%)
/------------------\  - Service layer business logic
                      - Utility functions, validators
```

### Fastify Testing Pattern

```typescript
// Use Fastify's built-in .inject() — no SuperTest needed
import { buildApp } from "../src/app.js";

describe("Task routes", () => {
  let app;
  beforeAll(async () => { app = await buildApp(); });
  afterAll(async () => { await app.close(); });

  it("creates a task", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      payload: { title: "Test task", raw_input: "Test task by Friday" },
      headers: { authorization: "Bearer test-jwt" },
    });
    expect(response.statusCode).toBe(201);
  });
});
```

### Prisma Testing Pattern

```typescript
// Unit test: mock Prisma Client
import { mockDeep } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = mockDeep<PrismaClient>();

// Integration test: real database
// Use Docker Postgres in CI, test database locally
// Wrap each test in transaction for isolation + rollback
```

### Playwright E2E Pattern

```typescript
// Next.js 15 App Router E2E
import { test, expect } from "@playwright/test";

test("onboarding creates first task in <60s", async ({ page }) => {
  await page.goto("/");
  await page.fill('[placeholder="What\'s on your mind?"]', "Buy groceries");
  await page.click("text=Save");
  await expect(page.locator(".task-card")).toBeVisible();
});
```

---

## 5. CI/CD Pipeline

### GitHub Actions Structure

```
Phase 1: Install → Cache pnpm + Turborepo artifacts
Phase 2: Lint + Type Check → turbo run lint typecheck
Phase 3: Unit Tests → turbo run test:unit
Phase 4: Integration Tests → Postgres Docker service + Prisma migrate + tests
Phase 5: Build → turbo run build
Phase 6: E2E Tests → next start + Playwright
Phase 7: Deploy → Staging (PR) or Production (main merge)
```

### Deployment Order

1. **Backend first** — Deploy Fastify with backward-compatible API changes
2. **Run Prisma migrations** — `prisma migrate deploy` in CI pipeline
3. **Frontend second** — Deploy Next.js to consume new API features
4. **Feature flags** — Toggle new features gradually via env vars

### Zero-Downtime Strategy

- **Backend**: Blue-green deployment (2 environments, atomic traffic switch)
- **Frontend**: Vercel handles this automatically with immutable deployments
- **Database**: Expand-and-contract migrations (add nullable → backfill → deploy → drop old)

---

## 6. Jaanify-Specific Recommendations

### Critical Path (Minimum Viable Implementation)

Based on the scaffold analysis (22 service functions, 6 pure TODO stubs):

| Priority | Stub | Effort | Dependency |
|----------|------|--------|------------|
| P0 | `parseTaskInput()` — OpenAI NLP | M (3-5h) | OpenAI API key |
| P0 | `authenticateWithGoogle()` — OAuth | M (3-5h) | Google OAuth credentials |
| P0 | `generateDailyPlan()` — AI ordering | L (5-8h) | OpenAI + task data |
| P1 | `refreshAccessToken()` — JWT refresh | S (1-2h) | jose library |
| P1 | `invalidateRefreshToken()` — Token blacklist | S (1-2h) | Redis |
| P1 | `registerFromGuest()` — Migration | M (3-5h) | Auth + guest sessions |

**Total estimate**: 16-27 hours for all 6 TODO stubs.

### New jaan-to Skill Needs

The scaffold-to-production transition reveals gaps that jaan-to could address:

1. **`dev-implement`** — Convert a specific TODO stub to production code using upstream specs
2. **`dev-test-generate`** — Generate Vitest test files from service layer stubs
3. **`infra-ci-scaffold`** — Generate GitHub Actions pipeline from monorepo structure
4. **`infra-docker-scaffold`** — Generate Dockerfile + docker-compose from tech stack

---

## Sources (Top 15)

### Primary Sources (Official Documentation)
1. [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) — Official Next.js
2. [Fastify Recommendations](https://fastify.dev/docs/latest/Guides/Recommendations/) — Official Fastify
3. [Prisma Development and Production Workflows](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production) — Official Prisma
4. [Fastify Testing Guide](https://fastify.dev/docs/v5.3.x/Guides/Testing/) — Official Fastify
5. [Playwright + Next.js Testing](https://nextjs.org/docs/pages/guides/testing/playwright) — Official Next.js
6. [GitHub Actions + Turborepo](https://turborepo.dev/docs/guides/ci-vendors/github-actions) — Official Turborepo

### Expert Practitioner Content
7. [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/) — Jimmy Bogard (original author)
8. [Prisma Testing Series: Unit Testing](https://www.prisma.io/blog/testing-series-2-xPhjjmIEsM) — Prisma Blog
9. [Prisma Testing Series: Mocking](https://www.prisma.io/blog/testing-series-1-8eRB5p0Y8o) — Prisma Blog
10. [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) — Martin Fowler

### Community & Starters
11. [fastify-trpc-next](https://github.com/maybemaby/fastify-trpc-next) — Monorepo starter
12. [fuelstack](https://github.com/riipandi/fuelstack) — Full-stack monorepo
13. [Monorepo Architecture Guide 2025](https://feature-sliced.design/blog/frontend-monorepo-explained) — Feature-Sliced Design
14. [2025 Monorepo That Actually Scales](https://medium.com/@TheblogStacker/2025-monorepo-that-actually-scales-turborepo-pnpm-for-next-js-ab4492fbde2a) — Medium
15. [Blazing fast Prisma + Postgres tests](https://codepunkt.de/writing/blazing-fast-prisma-and-postgres-tests-in-vitest/) — Codepunkt

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | jaan-to/outputs/research/62-dev-scaffold-to-production-strategy.md |
| Skill | pm-research-about |
| jaan-to | v5.0.0 (SHA: 5e22ff19) |
| Research Size | Quick (20) — 3 agents, ~45 sources |
| Category | dev |
