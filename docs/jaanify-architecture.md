---
title: Jaanify Architecture
doc_type: concept
created_date: 2026-02-10
updated_date: 2026-02-10
tags: [architecture, transparent-ai, reasoning-cards, pwa]
related: [../jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md, ../jaan-to/context/tech.md]
---

# Jaanify Architecture

> How Jaanify combines transparent AI reasoning with modern web infrastructure.

---

## What Is It?

Jaanify is an AI-native task manager built on a "Transparent Copilot" approach. Every AI recommendation includes visible reasoning through a 3-tier system, targeting neurodivergent users, freelancers, and solopreneurs who need to trust and understand their tools.

The architecture separates three concerns: task data management (Fastify REST API + PostgreSQL), AI reasoning generation (OpenAI SDK), and real-time delivery (WebSocket via Socket.io).

---

## Key Points

- **Transparent Copilot** - AI recommendations always include explanations. Users see why tasks are prioritized, not just the result. This differentiates Jaanify from "Autopilot" tools that decide silently.
- **3-Tier Reasoning Cards** - Progressive disclosure: Tier 1 (glanceable one-liner), Tier 2 (factor weights and confidence), Tier 3 (full reasoning chain and historical accuracy). Users choose their depth.
- **PWA-First** - Service Worker + Workbox for offline capability, add-to-homescreen on Android. No native app required for MVP.
- **60-Second Onboarding** - No account for first interaction. Guest session persists 7 days via localStorage. Account creation deferred until after first value moment.
- **Monorepo Structure** - Turborepo with `apps/api/` (Fastify v5), `apps/web/` (Next.js 15), `packages/shared-types/` (TypeScript types shared across apps).

---

## How It Works

### Backend (apps/api/)

Fastify v5 serves a REST API at `/api/v1/` with 21 endpoints covering task CRUD, AI prioritization, user authentication, and daily plan generation. Prisma v6 provides type-safe PostgreSQL access with 7 data models (User, Task, Category, Label, ReasoningCard, DailyPlan, AuditLog). Redis 7 via Upstash handles caching and BullMQ job queues for async AI processing.

### Frontend (apps/web/)

Next.js 15 with App Router renders the UI. Zustand v5 manages client state (task list, user preferences, reasoning card expansion). React Query v5 handles server state with optimistic updates for task operations. TailwindCSS v4 provides responsive, mobile-first styling.

### AI Reasoning Pipeline

1. User creates or modifies a task (text or voice input)
2. Fastify endpoint receives the request and enqueues an AI job
3. BullMQ worker sends task context to OpenAI SDK
4. AI returns structured reasoning (factors, weights, confidence)
5. Reasoning stored as ReasoningCard linked to the task
6. WebSocket (Socket.io v4) pushes the update to connected clients in <500ms

### Authentication

JWT tokens with 1-hour expiry and refresh tokens. OAuth2 via Google (primary) and GitHub (secondary). Guest sessions use anonymous Supabase sessions with 7-day TTL.

---

## Examples

**Task creation flow**: User types "Call Sarah about the Johnson proposal by Friday 2 PM" -> NLP extracts title, deadline, category -> AI generates reasoning card -> Task stored with metadata -> Reasoning card shown inline.

**Daily plan generation**: Each morning (or on demand), the AI generates a prioritized daily plan. Each slot shows a Tier 1 reasoning card. User taps to expand to Tier 2 (factor weights) or long-presses for Tier 3 (full reasoning chain).

---

## Related

- [PRD](../jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md)
- [Tech Stack](../jaan-to/context/tech.md)
- [API Contract](../jaan-to/outputs/backend/api-contract/)
- [Data Model](../jaan-to/outputs/backend/data-model/)
