---
title: Production Operations
doc_type: guide
created_date: 2026-02-13
updated_date: 2026-02-13
tags: [operations, monitoring, security, branch-protection, secret-rotation]
related: [deployment.md, ../jaanify-architecture.md]
---

# Production Operations

> Monitoring, secret rotation, and branch governance for deployed Jaanify services.

---

## Overview

This guide covers the three operational layers configured for Jaanify: branch protection rules that enforce CI checks before merge, automated secret rotation reminders on a 90-day cycle, and health check monitoring that creates GitHub issues on service outages.

---

## Prerequisites

- GitHub CLI (`gh`) authenticated with repo access
- Railway and Vercel accounts with deployed services
- GitHub repository secrets configured (see [Deployment Guide](deployment.md))

---

## Step 1: Branch Protection

The `main` branch is protected with these rules:

| Rule | Setting |
|------|---------|
| Required status checks | `detect-changes`, `lint`, `build`, `security` |
| Linear history | Enforced (no merge commits) |
| Force push | Blocked |
| Admin bypass | Allowed (for emergency fixes) |

To verify or modify:

```bash
gh api repos/{owner}/{repo}/branches/main/protection
```

To update required checks, edit the `required_status_checks.contexts` array via the GitHub API or Settings > Branches > Branch protection rules.

---

## Step 2: Secret Rotation

A scheduled workflow (`.github/workflows/secret-rotation-reminder.yml`) creates a GitHub issue every 90 days listing secrets to rotate.

### Secrets Requiring Rotation

| Secret | Where to Rotate | Update Command |
|--------|----------------|----------------|
| `DATABASE_URL` | Supabase Dashboard > Project Settings > Database | `gh secret set DATABASE_URL` |
| `RAILWAY_TOKEN` | Railway Dashboard > Account > Tokens | `gh secret set RAILWAY_TOKEN` |
| `VERCEL_TOKEN` | Vercel Dashboard > Account > Tokens | `gh secret set VERCEL_TOKEN` |

### Secrets That Don't Rotate

| Secret | Reason |
|--------|--------|
| `VERCEL_ORG_ID` | Static identifier, not a credential |
| `VERCEL_PROJECT_ID` | Static identifier, not a credential |
| `GITHUB_TOKEN` | Auto-rotated by GitHub Actions per run |

### Schedule

The cron runs at 09:00 UTC on the 1st of January, April, July, and October. To trigger manually:

```bash
gh workflow run secret-rotation-reminder.yml
```

---

## Step 3: Health Monitoring

A scheduled workflow (`.github/workflows/health-check.yml`) checks API and Web health every 15 minutes.

### How It Works

1. Sends HTTP requests to `API_URL/v1/health` and `WEB_URL`
2. If either returns a non-healthy status, creates a GitHub issue labeled `incident`
3. Subsequent failures add comments to the existing incident (no duplicates)
4. When services recover, auto-closes the incident issue with a resolution comment

### Configure Service URLs

Set repository variables (not secrets) once services have stable URLs:

```bash
gh variable set API_URL --body "https://your-railway-url.up.railway.app"
gh variable set WEB_URL --body "https://your-vercel-url.vercel.app"
```

The workflow skips checks for any URL variable that is empty, so it won't create false alerts before configuration.

### GitHub Labels

Three labels support the operational workflows:

| Label | Color | Used By |
|-------|-------|---------|
| `incident` | Red (#B60205) | Health check alerts |
| `security` | Red (#D73A49) | Secret rotation reminders |
| `maintenance` | Green (#0E8A16) | Secret rotation reminders |

---

## Verification

- **Branch protection**: Push directly to `main` — it should be blocked
- **Secret rotation**: Run `gh workflow run secret-rotation-reminder.yml` and check for the issue
- **Health check**: Run `gh workflow run health-check.yml` and verify it completes (skips if URLs not set)

---

## Tips

- Review and close rotation reminder issues promptly to keep the issue tracker clean.
- The health check runs every 15 minutes. Adjust the cron in `health-check.yml` if this is too frequent.
- All operational workflows use SHA-pinned GitHub Actions for supply chain security.

---

## Troubleshooting

**Issue: Secret rotation issue not created**
Solution: Ensure the workflow has `issues: write` permission and the `security` and `maintenance` labels exist.

**Issue: Health check creates duplicate incidents**
Solution: The workflow checks for existing open issues with the `incident` label. Ensure no manual issues use this label.

**Issue: Health check reports false positives**
Solution: Verify `API_URL` and `WEB_URL` repository variables are set correctly. The URLs must be publicly accessible.

---

## Related

- [Deployment Guide](deployment.md)
- [Architecture](../jaanify-architecture.md)
- [Getting Started](getting-started.md)
