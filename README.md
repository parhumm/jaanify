# YOUR_PROJECT_NAME

> Built with the [jaan-to](https://github.com/parhumm/jaan-to) co-evolution loop.

## Getting Started

```bash
# 1. Clone with submodules
git clone --recurse-submodules YOUR_REPO_URL
cd YOUR_PROJECT_NAME

# 2. Pull latest jaan-to
git submodule update --remote --merge vendor/jaan-to

# 3. Initialize jaan-to plugin workspace
/jaan-init

# 4. Start your first co-evolution cycle
/cycle-new
```

## How to Use This Template

After cloning, replace these template variables across the project:

| Variable | Replace With | Files |
|----------|-------------|-------|
| `YOUR_PROJECT_NAME` | Your product name (e.g., "Acme App") | `CLAUDE.md`, `README.md`, `docs/idea-to-product.md`, `.claude/skills/cycle-new/SKILL.md`, `.claude/skills/gaps-critical-issue/SKILL.md` |
| `YOUR_PROJECT_DESCRIPTION` | One-line description (e.g., "an AI-powered fitness tracker") | `CLAUDE.md`, `docs/idea-to-product.md` |
| `YOUR_REPO_URL` | Your GitHub repo URL | `CLAUDE.md`, `README.md` |
| `your-project-name` | Kebab-case name for npm (e.g., "acme-app") | `package.json` |
| `YOUR_PRODUCT_PITCH` | One-sentence product pitch for PRD generation | `docs/idea-to-product.md` |
| `YOUR_TECH_STACK` | Tech stack summary (e.g., "Next.js 15 + Fastify 5 + PostgreSQL 16") | `docs/idea-to-product.md` |

**Quick start:**

1. Fork/clone this repo with submodules
2. Find-and-replace the variables above in all listed files
3. Run `/jaan-init` to create the plugin workspace
4. Run `/cycle-new` to start your first co-evolution cycle

See [docs/idea-to-product.md](docs/idea-to-product.md) for the full skill-by-skill pipeline guide.

## Structure

```
vendor/jaan-to/    # Git submodule (read-only)
jaan-to/           # Plugin workspace (created by /jaan-init)
scorecards/        # Per-skill quality scorecards
gap-reports/       # Per-cycle scan + gap reports
CLAUDE.md          # Project rules
docs/              # Guides (idea-to-product pipeline)
```

## License

TBD
