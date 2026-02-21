# Dev Verify: Login/Auth Build Verification

> **Date**: 2026-02-21
> **Mode**: Build Only (no runtime services)
> **Skill**: jaan-to:dev-verify v7.2.0
> **Cycle**: 14
> **Trigger**: Post dev-output-integrate (login/auth scaffolds)

---

## Executive Summary

**BLUF**: Build passes after 2 auto-fixes. Type check and full build both succeed for API (Fastify v5) and Web (Next.js 15). No runtime verification (services not running).

---

## Tech Stack Detected

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Node.js + TypeScript + Fastify | v22 / v5.7 / v5 |
| Frontend | React + Next.js | v19 / v15.5.12 |
| ORM | Prisma | v6.19.2 |
| Package Manager | pnpm + Turborepo | v9.15.0 / v2.8.7 |
| Testing | Vitest + Playwright | v2.x / v1.58.2 |

---

## Integration Scope

**Manifest**: Not found (`.last-integration-manifest` absent)
**Scope**: Entire project (validated all packages)

Files integrated this cycle (from dev-output-integrate):
- `apps/web/src/app/login/page.tsx` (NEW)
- `apps/web/middleware.ts` (NEW)
- `apps/web/src/stores/auth-store.ts` (NEW)
- `apps/web/src/components/NavbarAuth.tsx` (NEW)
- `apps/web/src/app/LandingPage.tsx` (REPLACED)
- `apps/web/src/lib/api-client.ts` (REPLACED)
- `apps/api/src/lib/secure-cookies.ts` (MERGED)
- `apps/api/src/routes/auth/auth.schema.ts` (MERGED)
- `apps/api/src/routes/auth/index.ts` (REPLACED)
- `apps/api/src/plugins/auth.ts` (MERGED)

---

## Build Results

### Before Auto-Fix

| Step | Result | Errors |
|------|--------|--------|
| pnpm install | Pass | 0 (warnings: Node v18 vs v22 engine mismatch) |
| prisma generate | Pass | 0 (via postinstall) |
| tsc --noEmit | **Fail** | 1 error |
| next build | **Fail** | 1 error |

**Error 1 — `type-mismatch` (auto-fixable)**
- File: `apps/api/src/routes/auth/index.ts:43`
- Error: `TS2345: Argument of type '401' is not assignable to parameter of type '200'`
- Cause: Route schema defined `response: { 200: authResponseSchema }` but handler sends 401 response. `fastify-type-provider-zod` constrains `.status()` to schema-defined codes.
- Fix: Added `problemDetailSchema` to `auth.schema.ts`, updated response map to `{ 200: authResponseSchema, 401: problemDetailSchema }`

**Error 2 — `config-mismatch` (auto-fixable)**
- File: `apps/web/src/app/login/page.tsx`
- Error: `useSearchParams() should be wrapped in a suspense boundary at page "/login"`
- Cause: Next.js 15 requires `useSearchParams()` in App Router pages to be wrapped in `<Suspense>` for static generation compatibility.
- Fix: Extracted `LoginContent` component, wrapped with `<Suspense fallback={...}>` in the default export.

### After Auto-Fix

| Step | Result | Details |
|------|--------|---------|
| pnpm install | Pass | All deps up to date |
| prisma generate | Pass | Prisma Client v6.19.2 |
| tsc --noEmit | **Pass** | 0 errors (both api + web) |
| turbo build | **Pass** | 2/2 packages built |

### Web Build Output

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    7.07 kB         136 kB
├ ○ /_not-found                            992 B         103 kB
├ ○ /dashboard                           10.7 kB         152 kB
├ ○ /login                                3.3 kB         132 kB
├ ○ /onboarding                          6.77 kB         148 kB
└ ○ /tasks/new                           4.68 kB         146 kB
+ First Load JS shared by all             102 kB

○  (Static)  prerendered as static content
```

All 6 routes statically generated including the new `/login` page.

### Warnings (Non-Blocking)

| Warning | File | Severity |
|---------|------|----------|
| autoFocus a11y | `OnboardingContent.tsx:81` | Low (pre-existing) |
| autoFocus a11y | `ParsedField.tsx:47` | Low (pre-existing) |
| autoFocus a11y | `TaskInputForm.tsx:125` | Low (pre-existing) |
| Node engine mismatch | Both apps | Info (v18 vs v22 wanted) |
| Workspace root inference | Next.js | Info (multiple lockfiles) |

---

## Recommendations

1. **Upgrade Node.js** to v22 LTS to match `engines` requirement
2. **Set `outputFileTracingRoot`** in `next.config.ts` to resolve workspace root warning
3. **Run runtime verification** when services are available (`/jaan-to:dev-verify --runtime-only`)
4. **Add smoke tests** for `/login` route — verify redirect param works, Google OAuth URL generation

---

## Metadata

- **Date**: 2026-02-21
- **Mode**: Build only
- **Output**: `jaan-to/outputs/dev/verify/03-login-auth-build/`
- **Skill version**: v7.2.0 (SHA: 3c10276)
- **Errors before**: 2
- **Errors after**: 0
- **Auto-fixed**: 2
- **Remaining**: 0
