# Verification Report — Server Deployment Check

> jaan-to v6.3.0 | dev-verify (server) | 2026-02-15

## Executive Summary

Server deployment verification for Railway API and Vercel Web. Both services respond (no timeout) but return 404/DEPLOYMENT_NOT_FOUND. Railway requires a fresh deploy with a valid token. Vercel requires Root Directory configuration update on dashboard.

## Build Verification (Local)

| Check | Status | Notes |
|-------|--------|-------|
| pnpm install | Pass | All dependencies installed |
| prisma generate | Pass | Client generated |
| tsc --noEmit (API) | Pass | 0 errors |
| tsc --noEmit (Web) | Pass | 0 errors (e2e excluded) |
| pnpm build (API) | Pass | dist/ generated |
| pnpm build (Web) | Pass | .next/ generated |

## CI Pipeline

| Job | Status |
|-----|--------|
| detect-changes | Pass |
| lint (API + Web) | Pass |
| test-api (77 tests) | Pass |
| test-web | Pass (no tests, --passWithNoTests) |
| security (Trivy + audit) | Pass |
| build (turbo) | Pass |

**CI Status: FULLY GREEN**

## Runtime Verification (Server)

| Service | URL | Status | Response | Latency |
|---------|-----|--------|----------|---------|
| API (Railway) | https://api-production-75430.up.railway.app | 404 | Application not found | 626ms |
| Web (Vercel) | https://jaanify-parhumkhgmailcoms-projects.vercel.app | 404 | DEPLOYMENT_NOT_FOUND | 444ms |

### API (Railway) — NOT DEPLOYED

- **Root Cause**: RAILWAY_TOKEN secret is expired/invalid
- **Evidence**: CD workflow `deploy-api` step fails with "Invalid RAILWAY_TOKEN"
- **Fix**: User must regenerate Railway token and update via `gh secret set RAILWAY_TOKEN`

### Web (Vercel) — NOT DEPLOYED

- **Root Cause**: Vercel project Root Directory is not set to `apps/web`
- **Evidence**: Vercel framework detection fails — "No Next.js version detected"
- **Fix**: User must update Vercel project settings → Root Directory → `apps/web`
- **After fix**: Remove `apps/web/vercel.json` (only root `vercel.json` needed with Root Directory set)

## Cross-Validation

| Check | Status |
|-------|--------|
| Build passes, services unhealthy | Expected — deployment config issues, not code issues |
| Docker image built and pushed | Pass — ghcr.io image available |
| Prisma migration to Supabase | Pass — DB schema up to date |

## User Action Items

1. **Railway**: Generate new token → `gh secret set RAILWAY_TOKEN` → trigger CD redeploy
2. **Vercel**: Dashboard → Project Settings → General → Root Directory → set to `apps/web`
3. After both: Push any commit or run `gh workflow run cd.yml` to trigger fresh CD

## Metadata

| Field | Value |
|-------|-------|
| Date | 2026-02-15 |
| Mode | Runtime-only (server check) |
| Skill | dev-verify |
| jaan-to Version | v6.3.0 |
