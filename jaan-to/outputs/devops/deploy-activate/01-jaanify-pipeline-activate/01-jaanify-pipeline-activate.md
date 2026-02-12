# Deployment Pipeline Activation — Jaanify

> Generated: 2026-02-12 | jaan-to v6.1.0 (SHA: 02c9e3c) | Cycle 9
> Skill: devops-deploy-activate | ID: 01-jaanify-pipeline-activate

---

## Executive Summary

Activated the Jaanify deployment pipeline by hardening GitHub Actions supply chain (SHA pinning 11 unique actions across 2 workflows) and generating a guided setup checklist for secrets and platform provisioning. Railway and Vercel CLIs are not installed locally, so platform provisioning is deferred to manual setup with documented steps.

---

## 1. Infra-Scaffold Analysis

| Category | Details |
|----------|---------|
| Secrets Referenced | `DATABASE_URL`, `RAILWAY_TOKEN`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `GITHUB_TOKEN` (auto) |
| Deployment Platforms | Railway (backend API), Vercel (frontend web) |
| Docker Registry | ghcr.io (GitHub Container Registry) |
| GitHub Actions Used | 11 unique actions across CI + CD workflows |

## 2. CLI Tool Status

| Tool | Status |
|------|--------|
| `gh` | Authenticated as parhumm |
| `railway` | Not installed |
| `vercel` | Not installed |

## 3. Current State (Pre-Activation)

| Item | Status |
|------|--------|
| Secrets Configured | 0/5 required (GITHUB_TOKEN is automatic) |
| Platform Links | None (.vercel/, railway.toml not found) |
| Existing Workflows | ci.yml, cd.yml (from dev-output-integrate) |

## 4. Activation Completed

### GitHub Actions SHA Pinning (11 actions)

All mutable tag references replaced with immutable SHA digests:

**ci.yml (6 unique actions):**

| Action | Before | After (SHA) |
|--------|--------|-------------|
| actions/checkout | @v4 | @34e114876b0b11c390a56381ad16ebd13914f8d5 # v4 |
| pnpm/action-setup | @v4 | @41ff72655975bd51cab0327fa583b6e92b6d3061 # v4 |
| actions/setup-node | @v4 | @49933ea5288caeca8642d1e84afbd3f7d6820020 # v4 |
| actions/upload-artifact | @v4 | @ea165f8d65b6e75b540449e92b4886f43607fa02 # v4 |
| dorny/paths-filter | @v3 | @de90cc6fb38fc0963ad72b210f1f284cd68cea36 # v3 |
| aquasecurity/trivy-action | @master | @c1824fd6edce30d7ab345a9989de00bbd46ef284 # master |

**cd.yml (7 unique actions):**

| Action | Before | After (SHA) |
|--------|--------|-------------|
| actions/checkout | @v4 | @34e114876b0b11c390a56381ad16ebd13914f8d5 # v4 |
| pnpm/action-setup | @v4 | @41ff72655975bd51cab0327fa583b6e92b6d3061 # v4 |
| actions/setup-node | @v4 | @49933ea5288caeca8642d1e84afbd3f7d6820020 # v4 |
| docker/setup-buildx-action | @v3 | @8d2750c68a42422c14e847fe6c8ac0403b4cbd6f # v3 |
| docker/login-action | @v3 | @c94ce9fb468520275223c153574b00df6fe4bcc9 # v3 |
| docker/metadata-action | @v5 | @c299e40c65443455700f0fdfc63efafe5b349051 # v5 |
| docker/build-push-action | @v5 | @ca052bb54ab0790a636c9b5f226502c73d547a25 # v5 |

**Pinning Summary:**
- Pinned: 11 actions
- Skipped: 0
- Failed: 0

## 5. Remaining Setup Checklist

The following items require manual setup. Complete these before the first deployment:

### 5a. GitHub Secrets (5 required)

Run these commands after obtaining the values:

```bash
# Database (Neon, Supabase, or Railway Postgres)
gh secret set DATABASE_URL

# Railway (backend deployment)
# Get token from: https://railway.app/account/tokens
gh secret set RAILWAY_TOKEN

# Vercel (frontend deployment)
# Get values from: https://vercel.com/account/tokens + project settings
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
```

### 5b. Platform Provisioning

**Railway (Backend):**
1. Install: `npm install -g @railway/cli`
2. Login: `railway login`
3. Create project: `railway init`
4. Link repo: `railway link`
5. Set env vars: `railway variables set DATABASE_URL=... NODE_ENV=production`
6. Verify: `railway status`

**Vercel (Frontend):**
1. Install: `npm install -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Set env vars via Vercel dashboard
5. Enable preview deployments for PRs
6. Verify: `vercel inspect`

### 5c. Turborepo Remote Cache (Optional)

1. Create token at https://vercel.com/account/tokens
2. Set secrets:
   ```bash
   gh secret set TURBO_TOKEN
   gh secret set TURBO_TEAM
   ```
3. Verify: `turbo run build --dry`

### 5d. Verification Pipeline

After secrets and platforms are configured:
```bash
# Trigger CI manually
gh workflow run ci.yml

# Monitor
gh run list --limit 1
gh run watch
```

## 6. Quality Checklist

- [x] All GitHub Actions pinned to SHA digests
- [x] No mutable tags (v4, latest) remaining in workflows
- [x] Activation report written with full manifest
- [ ] All required secrets configured in GitHub (pending — 0/5)
- [ ] Backend platform connected and responding (pending — Railway not provisioned)
- [ ] Frontend platform connected with preview deployments (pending — Vercel not provisioned)
- [ ] Remote cache configured (pending — optional)
- [ ] CI pipeline triggered and completed (pending — secrets needed first)

## 7. Next Steps

**Immediate (before first deploy):**
1. Configure 5 GitHub secrets using `gh secret set` commands above
2. Install Railway CLI and provision backend
3. Install Vercel CLI and link frontend
4. Trigger first CI run: `gh workflow run ci.yml`

**Follow-up:**
- Set up monitoring/alerting for deployed services
- Configure branch protection rules
- Schedule secret rotation (recommended: 90 days)
- Run `/jaan-to:detect-dev` post-deployment for security re-audit
