# Setup & Deployment Instructions — Jaanify MVP

## Quick Start (Local Development)

### 1. Copy environment files

```bash
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/config/.env.example .env
# Edit .env with your Google OAuth + OpenAI credentials
```

### 2. Start database and cache

```bash
docker compose up -d postgres redis
```

### 3. Run migrations

```bash
pnpm --filter api exec prisma migrate dev
```

### 4. Start development servers

```bash
pnpm turbo dev
# API: http://localhost:3000
# Web: http://localhost:3001
# Docs: http://localhost:3000/docs
```

### Alternative: Full Docker environment

```bash
docker compose --profile full up
```

---

## File Installation Guide

Copy generated files to your project root:

```bash
# CI/CD workflows
mkdir -p .github/workflows
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/ci/ci.yml .github/workflows/ci.yml
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/ci/cd.yml .github/workflows/cd.yml

# Docker files
mkdir -p docker
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/docker/Dockerfile.api docker/
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/docker/Dockerfile.web docker/
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/docker/docker-compose.yml docker-compose.yml
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/docker/docker-compose.prod.yml docker-compose.prod.yml
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/docker/.dockerignore .dockerignore

# Environment configs
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/config/.env.example .env.example
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/config/.env.test .env.test

# Deployment configs
mkdir -p deploy
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/deploy/railway.toml railway.toml
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/deploy/vercel.json vercel.json
cp jaan-to/outputs/devops/infra-scaffold/01-jaanify-mvp/deploy/migration.sh deploy/migration.sh
chmod +x deploy/migration.sh
```

---

## CI/CD Setup

### GitHub Actions Secrets

Set these in GitHub repository Settings → Secrets and Variables → Actions:

| Secret | Source |
|--------|--------|
| `DATABASE_URL` | Production PostgreSQL connection string (from Supabase/Railway) |
| `RAILWAY_TOKEN` | Railway API token (from railway.app → Account → Tokens) |
| `VERCEL_TOKEN` | Vercel API token (from vercel.com → Account → Tokens) |
| `VERCEL_ORG_ID` | Vercel org ID (from vercel.com → Settings) |
| `VERCEL_PROJECT_ID` | Vercel project ID (from project settings) |

### GitHub Environments

Create a `production` environment in Settings → Environments:
- Enable "Required reviewers" for deploy approval
- Add production secrets (DATABASE_URL, etc.)

---

## Deployment

### Backend (Railway)

1. Create a new Railway project at railway.app
2. Connect your GitHub repository
3. Railway will auto-detect `railway.toml`
4. Add environment variables in Railway dashboard
5. Push to main → CD workflow triggers

### Frontend (Vercel)

1. Import project at vercel.com/import
2. Set root directory to `apps/web`
3. Vercel auto-detects Next.js
4. Add `NEXT_PUBLIC_API_URL` environment variable
5. Push to main → CD workflow triggers

### Database Migrations

Migrations run automatically in CD before deploy:

```bash
# Manual migration (local)
./deploy/migration.sh

# Check status
./deploy/migration.sh --status

# Reset (DESTRUCTIVE — dev only)
./deploy/migration.sh --reset
```

---

## Docker Commands Reference

```bash
# Development
docker compose up                        # All services (default profile)
docker compose --profile backend up      # API + PostgreSQL + Redis
docker compose --profile frontend up     # Web only
docker compose --profile full up         # Everything

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Build images
docker build -f docker/Dockerfile.api -t jaanify-api .
docker build -f docker/Dockerfile.web -t jaanify-web .

# View logs
docker compose logs -f api
docker compose logs -f web

# Reset
docker compose down -v                   # Stop + remove volumes
```

---

## Next.js Standalone Output

For the Docker build to work, add to `apps/web/next.config.ts`:

```ts
const nextConfig = {
  output: "standalone",
  // ... existing config
};
```

This enables Next.js to produce a minimal standalone server that doesn't require node_modules at runtime.

---

## Troubleshooting

### Prisma migration fails in CI
- Verify `DATABASE_URL` secret is set correctly
- Check PostgreSQL service container health in CI logs
- Run `pnpm --filter api exec prisma migrate status` locally

### Docker build fails on `pnpm deploy --prod`
- Ensure `pnpm-lock.yaml` is committed and up to date
- Run `pnpm install --frozen-lockfile` locally first

### Vercel build fails
- Check `vercel.json` outputDirectory matches your Next.js config
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel environment variables
- Run `npx turbo-ignore web` to test the ignore command locally
