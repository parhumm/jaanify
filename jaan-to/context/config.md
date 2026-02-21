# jaan.to Configuration {#config}

> Configured for Jaanify — Smart AI Task Manager
> Last Updated: 2026-02-21
> Status: **Active** — Cycle 14

---

## Enabled Roles {#enabled-roles}

Based on detected tech stack, these skill roles are enabled:

- `pm` - Product Management (PRDs, stories, research)
- `dev` - Development (task breakdowns, data models, API contracts, scaffolds, component design)
- `ux` - User Experience (microcopy, heatmap analysis, flowcharts, research synthesis)
- `data` - Data & Analytics (GTM tracking)
- `qa` - Quality Assurance (testing, accessibility)
- `release` - Release Management (changelogs, iteration)

> **Note**: All roles enabled by default for empty projects. Refine based on actual usage.

---

## Output Settings {#output-settings}

### ID Generation
- **Format**: Sequential numeric (01, 02, 03...)
- **Scope**: Per subdomain (pm/prd, pm/stories, dev/backend, etc.)
- **Auto-increment**: Yes

### File Naming
- **Convention**: `{ID}-{slug}/{ID}-{type}-{slug}.md`
- **Example**: `01-user-auth/01-prd-user-auth.md`

### Index Updates
- **Auto-generate**: Yes
- **README per subdomain**: Yes
- **Sort order**: By ID (ascending)

---

## Language Preferences {#language-preferences}

### Microcopy Languages
Default set (7 languages):
- English (EN)
- Persian/Farsi (FA)
- Turkish (TR)
- German (DE)
- French (FR)
- Russian (RU)
- Tajik (TG)

### Tone Defaults
- **Product**: Friendly & Encouraging
- **Technical**: Clear & Concise
- **Transactional**: Professional & Reassuring

---

## Quality Gates {#quality-gates}

### Approval Checkpoints
- PRD generation: HARD STOP before generation
- Skill creation: Interactive wizard
- Context file updates: Show diffs for customized sections

### Learning System
- **Capture feedback**: Yes
- **Auto-categorize lessons**: Yes (Better Questions, Edge Cases, Workflow, Common Mistakes)
- **Apply lessons**: Yes (read LEARN.md files in Pre-Execution)

---

## Integration Settings {#integration-settings}

### Git Workflow
- **Auto-commit**: No (user confirms)
- **Branch naming**: `feature/{slug}`, `skill/{skill-name}`
- **Commit message format**: Conventional Commits

### Export Formats
- **Task breakdowns**: Jira CSV, Linear MD, JSON
- **Microcopy**: Markdown + JSON (i18n)
- **GTM tracking**: Markdown with code blocks

---

## Project Metadata {#metadata}

- **Project Type**: SaaS — AI Task Manager
- **Product Name**: Jaanify
- **Team Size**: Solo (AI-assisted via jaan-to)
- **Stage**: Launch (Cycle 14)
- **jaan-to Version**: v7.2.0-1-g3c10276 (44 skill directories)
- **Primary Domain**: Productivity / Task Management
- **Target Platforms**: Web (Next.js), Android (Kotlin), API (Fastify)
