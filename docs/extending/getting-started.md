---
title: Getting Started
doc_type: guide
created_date: 2026-02-11
updated_date: 2026-02-11
tags: [setup, development, installation, quickstart]
related: [api-reference.md, deployment.md, ../jaanify-overview.md]
---

# Getting Started

> Set up Jaanify for local development in a Turborepo monorepo.

---

## Overview

This guide walks through cloning the repository, installing dependencies, configuring environment variables, starting the database, and running the API and web app locally.

---

## Prerequisites

- Node.js v22.x LTS
- pnpm v9
- Docker and Docker Compose (for PostgreSQL and Redis)
- Git

---

## Step 1: Clone and Install

Clone the repository and install dependencies:

```bash
git clone https://github.com/parhumm/jaanify.git
cd jaanify
pnpm install
```

The monorepo uses Turborepo with pnpm workspaces. Two apps live under `apps/`:

| App | Path | Purpose |
|-----|------|---------|
| API | `apps/api/` | Fastify v5 REST API |
| Web | `apps/web/` | Next.js 15 frontend |

---

## Step 2: Configure Environment Variables

Copy the example environment file and fill in required values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://jaanify:jaanify@localhost:5432/jaanify` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret for JWT signing | Generate with `openssl rand -base64 32` |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret | From Google Cloud Console |

---

## Step 3: Start Database Services

Use Docker Compose to start PostgreSQL 16 and Redis 7:

```bash
docker compose up -d postgres redis
```

This starts:
- PostgreSQL 16 on port 5432
- Redis 7 on port 6379

---

## Step 4: Run Database Migrations

Apply the Prisma schema to create tables:

```bash
pnpm --filter api prisma migrate dev
```

This creates the 7 tables defined in the data model: users, tasks, daily_plans, daily_plan_slots, user_feedback, guest_sessions, and audit_logs.

---

## Step 5: Start Development Servers

Run both apps with Turborepo:

```bash
pnpm dev
```

Or start them individually:

```bash
pnpm --filter api dev    # API on http://localhost:3000
pnpm --filter web dev    # Web on http://localhost:3001
```

---

## Verification

Confirm everything is running:

- API health check: `curl http://localhost:3000/health` returns `{"status": "ok"}`
- Web app: Open `http://localhost:3001` in a browser
- Database: `pnpm --filter api prisma studio` opens a data browser

---

## Tips

- Run `pnpm turbo build` to build both apps and verify TypeScript compilation.
- Use `pnpm --filter api test` and `pnpm --filter web test` to run tests.
- The API uses Fastify's logger — set `LOG_LEVEL=debug` in `.env` for verbose output.

---

## Troubleshooting

**Issue: Docker Compose fails to start**
Solution: Ensure Docker Desktop is running and ports 5432/6379 are not in use by other services.

**Issue: Prisma migrate fails**
Solution: Verify `DATABASE_URL` in `.env` matches the Docker Compose PostgreSQL credentials. Default is `postgresql://jaanify:jaanify@localhost:5432/jaanify`.

**Issue: Google OAuth not working**
Solution: OAuth requires valid Google Cloud credentials. For local development without OAuth, use guest sessions via `POST /v1/guest-sessions`.

---

## Related

- [API Reference](api-reference.md)
- [Deployment](deployment.md)
- [Jaanify Overview](../jaanify-overview.md)
