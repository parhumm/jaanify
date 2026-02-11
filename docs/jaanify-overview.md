---
title: Jaanify Overview
doc_type: concept
created_date: 2026-02-11
updated_date: 2026-02-11
tags: [overview, product, ai, task-management, transparent-copilot]
related: [jaanify-architecture.md, data-model.md, extending/api-reference.md]
---

# Jaanify Overview

> An AI task manager that shows its reasoning, built for neurodivergent users, freelancers, and solopreneurs.

---

## What Is It?

Jaanify ("To give soul to your tasks") is a Smart AI Task Manager that makes AI reasoning transparent. Every recommendation includes a Reasoning Card explaining why, at three levels of detail. Users type or speak tasks in natural language, and Jaanify's AI parses, prioritizes, and plans their day with full visibility into the decision process.

The project targets a gap in the $2.2B task management market: no competitor shows users why the AI made its recommendations. Jaanify's "Transparent Copilot" approach addresses the trust deficit that causes 90% of productivity app users to churn within 30 days.

---

## Key Points

- **Transparent Copilot** - Every AI recommendation includes visible reasoning. Unlike "Autopilot" tools that decide silently, Jaanify shows its work through 3-tier Reasoning Cards: glanceable one-liners, explorable factor weights, and auditable full reasoning chains.
- **Natural Language Input** - Users type or speak tasks naturally ("Call Sarah about the Johnson proposal by Friday 2 PM"). Jaanify's AI extracts titles, deadlines, categories, and priorities in real-time.
- **60-Second Onboarding** - No account required for the first task. The app opens to a single input field. Guest sessions persist for 7 days. Account creation is deferred until after the first value moment.
- **AI Daily Planner** - Each morning, the AI generates a prioritized daily plan. Each task slot includes reasoning for its position. Users override with feedback that improves future recommendations.
- **Accessibility-First** - Designed for neurodivergent users with Focus Mode (single task view), visual timelines for time blindness, gentle nudge notifications, and WCAG 2.1 AA compliance.

---

## How It Works

### Target Users

| Segment | Need | How Jaanify Helps |
|---------|------|-------------------|
| Neurodivergent users | Trust and understand AI decisions | 3-tier Reasoning Cards, Focus Mode |
| Freelancers | Capture tasks fast across contexts | Voice input, natural language parsing |
| Solopreneurs | Prioritize across multiple roles | AI daily planner with visible factors |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Next.js 15 (App Router), TailwindCSS v4, Zustand v5 |
| Backend | Node.js 22 + Fastify v5, Prisma v6, REST + WebSocket |
| Database | PostgreSQL 16 (Supabase), Redis 7 (Upstash) |
| AI | OpenAI SDK for prioritization and reasoning generation |
| Infrastructure | Docker, GitHub Actions CI/CD, Railway (API), Vercel (Web) |

### Monorepo Structure

```
jaanify/
  apps/api/       Fastify v5 REST API (27 source files)
  apps/web/       Next.js 15 frontend (41 source files)
  packages/       Shared types and utilities
  turbo.json      Turborepo pipeline config
```

### Revenue Model

Freemium with Pro tier:
- **Free**: Core task management, AI daily plans, Reasoning Cards (Tier 1)
- **Pro ($8/mo)**: Full Reasoning Cards (all tiers), advanced AI features, priority support

---

## Examples

**Task creation**: User types "Buy groceries for dinner tonight, remind me at 4 PM" and Jaanify extracts title, deadline (4 PM today), category (Personal), and generates a Reasoning Card explaining the parsing.

**Daily plan**: At 7 AM, Jaanify generates a plan with 6 tasks. Task #1 shows "Deadline in 2h + blocks 3 tasks" as its Tier 1 reasoning. Tapping expands to show deadline proximity (40%), dependency count (30%), energy match (20%), and time-of-day fit (10%).

---

## Related

- [Architecture](jaanify-architecture.md)
- [Data Model](data-model.md)
- [API Reference](extending/api-reference.md)
- [Getting Started](extending/getting-started.md)
- [Deployment](extending/deployment.md)
