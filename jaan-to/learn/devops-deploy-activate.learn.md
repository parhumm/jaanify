# Lessons: devops-deploy-activate

> Last updated: 2026-02-15 (Cycle 11)

---

## Edge Cases

- Vercel monorepo: framework detection requires `next` in root `package.json` — set Root Directory to `apps/web` in dashboard
- Vercel CLI `--cwd` doesn't override project Root Directory from dashboard settings
- Railway token expiration: validate with `railway whoami` before deploy attempt
- Supabase free tier pauses after inactivity — migration step needs `continue-on-error: true`
- GitHub Actions `needs: [job]` blocks dependent jobs on failure — use `if: always()` for smoke tests
- Railway `railway up --service` uploads source code; env vars must be set separately via `railway vars set` or dashboard
- Railway "Application not found" 404 means no healthy deployment — check `railway logs` for crash errors
- Vercel CLI v50+ in non-interactive mode requires `--scope` for personal accounts but rejects personal account scope — use `.vercel/project.json` linking instead
- Vercel `DEPLOYMENT_NOT_FOUND` means zero deployments exist — Git integration may not be connected

## Common Mistakes

- Assuming Vercel CLI deploy works the same as Git integration for monorepos — they use different Root Directory resolution
- Using `vercel build` locally when pnpm is not available on runner — prefer remote builds via `vercel deploy --prod`
- Setting `framework: null` in vercel.json — Vercel then doesn't process `.next` directory as Next.js serverless
- Not validating deployment config locally before pushing multiple fix attempts to CI
- Assuming Railway `deploy-api` step sets env vars — it only deploys code; env vars are separate
- Using wrong Vercel URL — `vercel project ls` shows the canonical URL; auto-generated URLs may differ from what was stored in `vars.WEB_URL`
- Vercel Output Directory set to `apps/web/.next` when Root Directory is already `apps/web` — causes double-nested path error

## Workflow

- Verify all CLI tools authenticated BEFORE attempting deployment
- Validate deployment config with dry-run before triggering real pipeline
- For monorepos: confirm Vercel Root Directory setting matches the framework's package.json location
- Use Git integration (auto-deploy on push) rather than CLI deploy for Vercel monorepos
