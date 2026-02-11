---
title: Deployment Guide
doc_type: guide
created_date: 2026-02-11
updated_date: 2026-02-11
tags: [deployment, docker, railway, vercel, ci-cd, github-actions]
related: [getting-started.md, ../jaanify-architecture.md]
---

# Deployment Guide

> Deploy Jaanify's API to Railway and frontend to Vercel with GitHub Actions CI/CD.

---

## Overview

Jaanify uses a split deployment model: the Fastify API deploys to Railway, and the Next.js frontend deploys to Vercel. GitHub Actions handles CI (lint, test, build, security scan) and CD (Docker build, database migration, deploy, smoke test). This guide covers environment setup, Docker builds, and deployment configuration.

---

## Prerequisites

- A GitHub repository with push access
- Railway account and project
- Vercel account and project
- Docker installed locally (for testing builds)
- GitHub repository secrets configured

---

## Step 1: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

| Secret | Source | Purpose |
|--------|--------|---------|
| `DATABASE_URL` | Railway PostgreSQL | Production database |
| `REDIS_URL` | Upstash or Railway Redis | Production cache |
| `JWT_SECRET` | `openssl rand -base64 32` | Token signing |
| `REFRESH_TOKEN_SECRET` | `openssl rand -base64 32` | Refresh token signing |
| `GOOGLE_CLIENT_ID` | Google Cloud Console | OAuth2 |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console | OAuth2 |
| `RAILWAY_TOKEN` | Railway dashboard | API deployment |
| `VERCEL_TOKEN` | Vercel dashboard | Frontend deployment |
| `VERCEL_ORG_ID` | Vercel dashboard | Organization ID |
| `VERCEL_PROJECT_ID` | Vercel dashboard | Project ID |

---

## Step 2: Docker Images

Jaanify uses multi-stage Docker builds for minimal image sizes:

| Image | Base | Size | User |
|-------|------|------|------|
| jaanify-api | node:22-alpine | ~150MB | fastify (UID 1001) |
| jaanify-web | node:22-alpine | ~120MB | nextjs (UID 1001) |

Build locally to test:

```bash
docker build -f docker/Dockerfile.api -t jaanify-api .
docker build -f docker/Dockerfile.web -t jaanify-web .
```

Run with Docker Compose for a full-stack environment:

```bash
docker compose up
```

This starts PostgreSQL 16, Redis 7, the API, and the web app with hot-reload.

---

## Step 3: CI Pipeline

The CI workflow runs on every push and pull request:

| Stage | What It Does | Runs When |
|-------|-------------|-----------|
| Lint | ESLint + Prettier check | API or Web files changed |
| Type Check | TypeScript compilation | API or Web files changed |
| Test API | Vitest with PostgreSQL + Redis | API files changed |
| Test Web | Vitest for components | Web files changed |
| Build | Turborepo production build | After lint + test pass |
| Security | Trivy container scan | API or Web files changed |

The CI workflow uses `dorny/paths-filter` to skip unchanged apps. Estimated run time: 2-3 minutes with parallel jobs.

---

## Step 4: CD Pipeline

The CD workflow triggers on push to `main`:

1. **Build Docker images** and push to GitHub Container Registry (`ghcr.io`)
2. **Run Prisma migrations** against the production database
3. **Deploy API** to Railway using the Railway CLI
4. **Deploy Web** to Vercel using the Vercel CLI
5. **Run smoke tests** against production health endpoints

---

## Step 5: Railway Setup

Configure the Railway project for the API:

1. Create a new Railway project
2. Add a PostgreSQL plugin (provides `DATABASE_URL`)
3. Add a Redis plugin (provides `REDIS_URL`)
4. Connect your GitHub repository
5. Set the root directory to `apps/api`
6. Set the build command: `pnpm install && pnpm --filter api build`
7. Set the start command: `node dist/server.js`

The `railway.toml` configuration file handles port binding and health checks.

---

## Verification

After deployment, verify both services:

- API health: `curl https://your-api.railway.app/health` returns `{"status": "ok"}`
- Web app: Open `https://your-app.vercel.app` in a browser
- Database: Check Railway dashboard for active connections

---

## Tips

- Use Railway's preview environments for pull request deployments.
- Vercel automatically creates preview deployments for pull requests.
- Set `NODE_ENV=production` in both Railway and Vercel environment variables.
- Monitor API logs in the Railway dashboard for error tracking.

---

## Troubleshooting

**Issue: Prisma migration fails in CI**
Solution: Ensure `DATABASE_URL` secret is set correctly. The migration runs against the production database during CD, so the URL must be accessible from GitHub Actions runners.

**Issue: Docker build fails with memory errors**
Solution: Multi-stage builds require at least 4GB Docker memory. Increase Docker Desktop memory allocation in Settings > Resources.

**Issue: Vercel build fails**
Solution: Ensure `next.config.ts` includes `output: "standalone"` for Docker compatibility. Check that all environment variables are set in Vercel project settings.

---

## Related

- [Getting Started](getting-started.md)
- [Architecture](../jaanify-architecture.md)
- [Full Infrastructure Spec](../../jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/01-jaanify-mvp.md)
