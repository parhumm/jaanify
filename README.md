# Jaanify

**"To give soul to your tasks"** — A Smart AI Task Manager with transparent reasoning.

## What is Jaanify?

Jaanify is an AI-powered task manager that shows you *why* it makes each recommendation, not just *what* to do next.

Most AI task managers operate as black boxes — they reorder your priorities without explanation. Jaanify takes a different approach with **3-Tier Reasoning Cards**: progressive disclosure that lets you glance at a recommendation, explore the factors behind it, or audit the full reasoning chain.

**Built for:** Neurodivergent individuals (especially ADHD), freelancers, and solopreneurs who need transparency and trust from their tools.

### Core Features (MVP)

- **Natural Language Task Input** — Text and voice capture with real-time AI parsing
- **3-Tier Reasoning Cards** — Glanceable, explorable, and auditable AI explanations
- **AI Daily Planner** — Personalized task ordering with visible factor analysis
- **60-Second Onboarding** — Start with "What's on your mind?", account creation deferred
- **Voice Capture** — Tap-to-speak task entry in 8-12 seconds
- **PWA-First** — Web + offline-capable from day one

## What is jaan-to?

[jaan-to](https://github.com/parhumm/jaan-to) is a Claude Code plugin that provides 21 AI-powered skills for product workflows — from writing PRDs and user stories to generating frontend designs, backend task breakdowns, API contracts, test cases, and more.

Skills span six domains:

| Domain | Examples |
|--------|----------|
| Product Management | PRD writing, user story generation |
| Development | Frontend/backend task breakdown, API contracts, data models, stack detection |
| UX & Content | Microcopy packs, research synthesis, heatmap analysis |
| QA | BDD/Gherkin test case generation |
| Data & Analytics | GTM dataLayer tracking |
| Workflow | Roadmap management, learning capture, skill creation |

## The Co-Evolution Loop

This project serves a dual purpose:

1. **Build a real product** — Jaanify is a launchable task manager, not a demo
2. **Stress-test jaan-to** — Every artifact is produced exclusively through jaan-to skills

Jaanify and jaan-to evolve together in a structured cycle:

```
SCAN → REVIEW & TEST → BUILD → GAP REPORT → (user adds skills) → repeat
```

- **Scan** — Pull latest jaan-to, check for new or updated skills
- **Review & Test** — Run each skill against Jaanify context, score results on per-skill scorecards
- **Build** — Advance Jaanify using all available skills
- **Gap Report** — Document missing capabilities, request top priorities

Each cycle is tracked with version-pinned scan reports, scorecards, and gap analyses in this repo.

## Project Status

| Phase | Status | Key Outputs |
|-------|--------|-------------|
| Discovery | Complete | Market research report |
| Definition | Complete | MVP PRD, stack detection, context files |
| Design | Complete | 3 interactive component previews, 7-language microcopy pack |
| Planning | Complete | 68 frontend tasks, 28 backend tasks, dependency graphs |
| Quality & Analytics | Complete | 74 BDD test cases, 18 GTM tracking events |
| Wrap-up | In Progress | Scorecards, gap reports, learnings capture |

3 co-evolution cycles completed so far, tracking jaan-to from v3.15.2 through v3.19.0.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Next.js 15, TailwindCSS 4, Zustand 5 |
| Backend | Node.js 22, Fastify 5, REST + WebSocket (Socket.io) |
| Database | PostgreSQL 16 (Supabase), Redis 7 (Upstash), Typesense |
| AI | OpenAI SDK |
| Testing | Vitest 3, Playwright 1.50, Storybook 8 |
| Infrastructure | AWS, Docker, GitHub Actions |

## Repo Structure

```
jaanify/
├── vendor/jaan-to/       # Git submodule — the jaan-to plugin (read-only)
├── jaan-to/               # Plugin workspace — outputs, templates, context, docs
├── scorecards/            # Per-skill quality scorecards (updated each cycle)
├── gap-reports/           # Per-cycle scan reports and gap analyses
│   ├── 01-cycle/
│   ├── 02-cycle/
│   └── 03-cycle/
└── CLAUDE.md              # Project rules (single source of truth)
```

## Getting Started

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/parhumm/jaanify.git
cd jaanify

# Pull latest jaan-to plugin
git submodule update --remote --merge vendor/jaan-to
```

## License

TBD

## Contributing

TBD
