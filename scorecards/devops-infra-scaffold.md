# Scorecard: devops-infra-scaffold

> Tested: 2026-02-11 (C7) | jaan-to v6.0.0 (SHA: 736820e) | Cycle 7
> Skill version: v6.0.0 (new skill)
> First test — no prior scorecard exists

---

## Score: 4.5 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 4.5/5 | Generated 15 files covering CI, CD, Docker, docker-compose, env configs, and deploy configs. Full pipeline: lint → typecheck → test (with PostgreSQL/Redis service containers) → build → security scan → Docker build → migrate → deploy → smoke test |
| Output Quality | 25% | 4.5/5 | Multi-stage Dockerfiles follow Alpine + non-root user pattern. Docker Compose uses healthchecks and profiles. CI uses `dorny/paths-filter` for monorepo efficiency. BuildKit cache mounts for fast rebuilds. RFC 9457-aligned smoke test. Migration script has deploy/status/reset modes |
| Context Awareness | 20% | 5/5 | Correctly detected Turborepo monorepo with apps/api + apps/web structure. Used pnpm v9 throughout. Service containers match PostgreSQL 16 + Redis 7 from tech.md. Prisma v6 for migrations. All 16 env vars from env.ts schema mapped to .env.example |
| Learning Integration | 15% | 4/5 | Applied research doc 74 patterns: path-filtered matrix builds, Docker layer caching, healthcheck-based depends_on, profiles for selective startup. No learn file existed (first run). Could have included Turbo remote cache config |
| Workflow Efficiency | 10% | 4.5/5 | Single-pass generation of all files. Readme includes copy commands for installation. Clear separation of concerns: ci/ for workflows, docker/ for containers, config/ for env, deploy/ for platform configs |

---

## Strengths

1. **Monorepo-aware CI** — Uses `dorny/paths-filter` to skip CI stages when packages are unchanged. API tests only run when apps/api/ changes, saving CI minutes. Shared package changes trigger both API and Web pipelines
2. **Multi-stage Docker builds** — 3-stage pattern (deps → build → runtime) with Alpine base. API image ~150MB, Web image ~120MB (Next.js standalone). BuildKit cache mounts for pnpm store. Non-root users (fastify/nextjs UID 1001)
3. **Full service container setup** — CI test job spins up PostgreSQL 16 and Redis 7 as service containers with healthchecks. Prisma migrations run before tests. Matches the actual production database stack
4. **Profile-based docker-compose** — `--profile backend`, `--profile frontend`, `--profile full` for selective startup. Hot-reload via bind mounts with anonymous volumes protecting node_modules. Production overlay via `docker-compose.prod.yml`
5. **Environment config hierarchy** — Three-tier: `.env.example` (dev defaults), `.env.test` (CI), `.env.production.example` (template). All variables documented with generation commands for secrets

## Issues

1. **GitHub Actions not pinned by SHA** — Actions use version tags (v3, v4, v5) instead of commit SHAs. Should pin by SHA for supply chain security (e.g., `actions/checkout@b4ffde6...` instead of `@v4`)
2. **No Turbo remote cache** — CI doesn't configure `TURBO_TOKEN` and `TURBO_TEAM` for Turborepo remote caching. This would significantly speed up builds across PRs
3. **Railway CLI output parsing** — CD workflow assumes `railway status --json | jq -r '.url'` returns the deployment URL. This may need adjustment based on actual Railway CLI version
4. **Next.js standalone not configured** — Dockerfile.web assumes `output: "standalone"` in next.config.ts, but this isn't currently set in the scaffold. Readme mentions this but it's easy to miss
5. **.env files excluded by .gitignore** — .env.test and .env.production.example were excluded by the root .gitignore `*.env*` pattern. Required `git add -f` to commit. Consider adding explicit allowlist in .gitignore

## Gaps Discovered

- Turbo remote cache configuration needed for faster CI
- GitHub Actions should be pinned by SHA for supply chain security
- E2E test stage (Playwright) not included in CI — would need browser install step
- No Kubernetes/Helm chart generated (not needed for MVP but relevant for scale)
- No observability config (logging, metrics, tracing) — see OWASP A09
