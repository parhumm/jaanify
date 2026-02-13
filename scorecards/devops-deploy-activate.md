# Scorecard: devops-deploy-activate

> Tested: 2026-02-13 | jaan-to v6.1.1 (SHA: ec1f181) | Cycle 10
> Skill version: v6.1.0 (first release)
> Previous score: 4.0/5 (Cycle 9)

---

## Score: 4.3 / 5.0

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| Functionality | 30% | 5/5 | Full activation completed: 5 secrets configured, Railway provisioned, Vercel linked, SHA pinning verified. All checklist items resolved. |
| Output Quality | 25% | 4/5 | Activation report is comprehensive with guided checklist. CI fix (pnpm version) required manual intervention outside skill scope. |
| Context Awareness | 20% | 5/5 | Correctly detected Railway + Vercel from CD workflow, identified all secret references, detected gh auth status |
| Learning Integration | 15% | 4/5 | LEARN.md applied. SHA resolution via gh API worked cleanly for all 11 actions |
| Workflow Efficiency | 10% | 3/5 | Health monitoring and secret rotation workflows had to be written manually — skill should generate post-deploy operational workflows |

---

## Strengths

1. SHA pinning resolved all 11 unique actions across both CI and CD workflows without errors
2. Secret configuration guidance was copy-paste ready — all 5 secrets configured in one session
3. Railway and Vercel platform provisioning followed the checklist cleanly
4. Activation report provides clear status tracking (done vs pending)
5. Pipeline verification step identified real CI issues (pnpm version conflict) early

## Issues

1. **Health monitoring workflow not generated** — Had to manually write `.github/workflows/health-check.yml` with 15-min cron, auto-incident creation, and auto-close on recovery (Gap L-13)
2. **Secret rotation workflow not generated** — Had to manually write `.github/workflows/secret-rotation-reminder.yml` with 90-day cron and GitHub issue creation (Gap L-14)
3. **Repository variables not handled** — Skill manages secrets but not repository variables (API_URL, WEB_URL) needed for monitoring (Gap L-19)
4. **pnpm version conflict not detected** — Skill didn't catch that pnpm/action-setup with explicit version conflicts with package.json `packageManager` field (Gap L-16, owned by `devops-infra-scaffold`)

## Gaps Discovered

- **L-13**: Skill should generate health monitoring workflows as part of post-deploy setup
- **L-14**: Skill should generate secret rotation scheduling as part of security hardening
- **L-19**: Skill should set repository variables (not just secrets) for monitoring URLs
- Skill assumes CLIs are pre-installed — should detect and offer to install
- No "dry run" mode to validate workflow syntax without actual secrets

## History

| Cycle | jaan-to Ver | Score | Notes |
|-------|-------------|-------|-------|
| 9 | v6.1.0 | 4.0/5 | First test: SHA pinning done, platform provisioning blocked by missing CLIs |
| 10 | v6.1.1 | 4.3/5 | Retest: Full activation completed. Health/rotation workflows were manual (3 new gaps) |
