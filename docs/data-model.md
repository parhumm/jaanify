---
title: Jaanify Data Model
doc_type: concept
created_date: 2026-02-11
updated_date: 2026-02-11
tags: [data-model, postgresql, prisma, database, schema]
related: [jaanify-architecture.md, extending/api-reference.md]
---

# Jaanify Data Model

> 7-entity PostgreSQL schema with UUID keys, soft deletes, and JSONB reasoning storage.

---

## What Is It?

Jaanify's data model stores tasks, AI reasoning, daily plans, user feedback, and guest sessions across 7 PostgreSQL tables. The schema uses UUID primary keys, soft deletes on users and tasks, JSONB columns for flexible AI reasoning data, and CHECK constraints for enum fields. Prisma v6 provides type-safe access.

---

## Key Points

- **7 Entities** - `users`, `tasks`, `daily_plans`, `daily_plan_slots`, `user_feedback`, `guest_sessions`, `audit_logs`. Each entity maps to a Prisma model.
- **Reasoning as JSONB** - AI reasoning cards are stored as JSONB in `tasks.reasoning_json` and `daily_plan_slots.reasoning_json`. This allows flexible schema evolution as the AI reasoning format matures.
- **Soft Deletes** - Users and tasks use `deleted_at` timestamps instead of hard deletes. Unique constraints are partial (e.g., email uniqueness excludes soft-deleted records).
- **Guest Sessions** - Anonymous sessions stored with a 7-day TTL via `expires_at` column. Guest data converts to a full user account on registration.
- **Audit Trail** - All significant actions logged to `audit_logs` with entity references and JSONB metadata.

---

## How It Works

### Entity Relationship Diagram

```
users ──1:N──> tasks ──1:N──> daily_plan_slots
  │                              ↑
  └──1:N──> daily_plans ──1:N───┘
  │
  └──1:N──> user_feedback (links to task or plan)
  └──1:N──> audit_logs
```

`guest_sessions` is standalone (converts to `users` on registration).

### Table Summary

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User accounts | email, auth_provider, preferences_json |
| `tasks` | Task items with AI metadata | title, raw_input, priority_score, reasoning_json, status |
| `daily_plans` | Per-user daily plans | date (unique per user), reasoning_method |
| `daily_plan_slots` | Ordered task slots in a plan | position, reasoning_json, status |
| `user_feedback` | Override feedback for AI learning | feedback_type, reason |
| `guest_sessions` | Anonymous sessions (7-day TTL) | anonymous_id, data_json, expires_at |
| `audit_logs` | Action audit trail | action, entity_type, entity_id, metadata |

### Enum Strategy

Enums use CHECK constraints on VARCHAR columns instead of PostgreSQL ENUM types:

| Column | Valid Values |
|--------|-------------|
| `users.auth_provider` | google, email, guest |
| `tasks.status` | active, completed, archived |
| `tasks.energy_level` | low, medium, high |
| `daily_plans.status` | generating, active, completed |
| `daily_plan_slots.status` | pending, completed, skipped |

This avoids ALTER TYPE migrations when adding new values.

### Key Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| `users` | email (partial, active only) | Login lookup |
| `tasks` | (user_id, status, created_at) | Task list queries |
| `tasks` | (user_id, deadline) WHERE deadline IS NOT NULL | Deadline-based prioritization |
| `daily_plans` | (user_id, date) UNIQUE | One plan per user per day |
| `audit_logs` | (entity_type, entity_id) | Entity history lookup |

---

## Examples

**Task with reasoning**: A task record stores `reasoning_json` containing the AI's factor weights, confidence score, and data sources used for prioritization. The frontend reads this JSONB to render Reasoning Cards at Tiers 1-3.

**Guest-to-user conversion**: A guest session stores task data in `data_json`. On registration, the system creates a `users` row, migrates `data_json` tasks to the `tasks` table, and deletes the guest session.

---

## Related

- [Architecture](jaanify-architecture.md)
- [API Reference](extending/api-reference.md)
- [Full Data Model Spec](../jaan-to/outputs/backend/data-model/02-jaanify-data-model/02-jaanify-data-model.md)
