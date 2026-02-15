# Lessons: devops-deploy-activate

> Last updated: 2026-02-15 (Cycle 11)

---

## Edge Cases

- Vercel monorepo: framework detection requires `next` in root `package.json` — set Root Directory to `apps/web` in dashboard
- Vercel CLI `--cwd` doesn't override project Root Directory from dashboard settings
- Railway token expiration: validate with `railway whoami` before deploy attempt
- Supabase free tier pauses after inactivity — migration step needs `continue-on-error: true`
- GitHub Actions `needs: [job]` blocks dependent jobs on failure — use `if: always()` for smoke tests

## Common Mistakes

- Assuming Vercel CLI deploy works the same as Git integration for monorepos — they use different Root Directory resolution
- Using `vercel build` locally when pnpm is not available on runner — prefer remote builds via `vercel deploy --prod`
- Setting `framework: null` in vercel.json — Vercel then doesn't process `.next` directory as Next.js serverless
- Not validating deployment config locally before pushing multiple fix attempts to CI

## Workflow

- Verify all CLI tools authenticated BEFORE attempting deployment
- Validate deployment config with dry-run before triggering real pipeline
- For monorepos: confirm Vercel Root Directory setting matches the framework's package.json location
- Use Git integration (auto-deploy on push) rather than CLI deploy for Vercel monorepos
