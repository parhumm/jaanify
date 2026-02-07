---
title: Jaanify — AI Task Manager
doc_type: concept
created_date: 2026-02-07
updated_date: 2026-02-07
tags: [jaanify, product, overview, ai-task-manager]
related: [../outputs/pm/prd/01-jaanify-mvp/01-prd-jaanify-mvp.md, ../outputs/research/01-pm-ai-task-management-market.md]
---

# Jaanify — AI Task Manager

> AI-native task manager that shows its work through transparent reasoning cards.

---

## What Is It?

Jaanify ("To give soul to your tasks") is a PWA-first AI task manager built around one principle: **show your work**. Every AI recommendation includes a visible Reasoning Card explaining the logic behind it.

The product targets two underserved segments: neurodivergent users (especially ADHD) who need trust in AI suggestions, and freelancers/solopreneurs who juggle every role without tools that understand their full context.

Jaanify introduces the **Transparent Copilot** pattern — a middle ground between "Autopilot" (AI decides silently) and "Copilot" (AI suggests without explanation).

---

## Key Points

- **3-Tier Reasoning Cards** - Every AI recommendation shows why. Tier 1 is a one-line summary, Tier 2 shows factor weights and confidence, Tier 3 exposes the full reasoning chain.
- **60-Second Onboarding** - No account required for the first task. App opens to "What's on your mind?" and the first AI-enriched task is created in under 30 seconds.
- **Natural Language + Voice Input** - Type or speak tasks naturally. AI parses deadlines, categories, subtasks, and priority in real-time.
- **AI Daily Planner** - Each morning generates a personalized plan with transparent reasoning for the task order.
- **PWA-First** - Web app with offline capability and add-to-homescreen. Native Android planned for Phase 3.

---

## How It Works

Users capture tasks via text or voice. Jaanify's AI parses the input, extracts metadata (deadlines, categories, priority), and enriches the task — showing the parsing logic in a Reasoning Card.

The AI Daily Planner generates a prioritized schedule each morning. Each task slot includes a Reasoning Card explaining why it landed where it did. Users can override any recommendation and provide feedback that trains the AI.

The 3-tier Reasoning Card system uses progressive disclosure: glanceable by default, explorable on tap, and auditable for power users who want full transparency.

---

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React v19 / Next.js v15 | PWA with SSR, TailwindCSS v4 |
| State | Zustand v5 | Client state management |
| Backend | Node.js v22 / Fastify v5 | REST API + WebSocket |
| Database | PostgreSQL 16 (Supabase) | Primary data store |
| Cache | Redis 7 (Upstash) | Cache + job queues |
| Search | Typesense | Full-text search |
| AI | OpenAI SDK | Task prioritization and reasoning |
| Mobile | Kotlin / Jetpack Compose | Android native (Phase 3) |

---

## Development Approach

Jaanify is built exclusively using the **jaan-to Claude Code plugin** through a co-evolution loop:

1. **Scan** jaan-to for available skills
2. **Build** Jaanify using those skills
3. **Report gaps** where skills are missing
4. **Iterate** as new skills are added

This approach stress-tests jaan-to in real production workflows while building a genuine product.

---

## Target Metrics (MVP)

| Metric | Target |
|--------|--------|
| Time-to-First-Task | <60 seconds |
| Day 7 Retention | >40% |
| Day 30 Retention | >15% |
| Task Completion Rate | >70% |
| Reasoning Card Engagement | >30% expand rate |

---

## Related

- [Jaanify MVP PRD](../outputs/pm/prd/01-jaanify-mvp/01-prd-jaanify-mvp.md)
- [AI Task Management Market Research](../outputs/research/01-pm-ai-task-management-market.md)
- [Tech Stack](../context/tech.md)
