---
story_id: US-02
epic: "Jaanify MVP"
title: "View Transparent AI Daily Plan"
priority: critical
status: draft
estimate: TBD
labels: [frontend, backend, ai, real-time]
created: 2026-02-07
last_updated: 2026-02-07
assignee: ""
author: "@solo-dev"
team: ""
component: "daily-planner"
---

# US-02: View Transparent AI Daily Plan

## Executive Summary

Generate a personalized AI daily plan each morning (or on demand) where every task slot includes visible reasoning for its position — enabling users with ADHD and other knowledge workers to trust the AI's suggestions instead of second-guessing or ignoring them.

## Context

The core trust deficit in AI task managers is that users can't see why the AI ordered their day a certain way. For users with ADHD, this is especially paralyzing — they need external structure but can't follow advice they don't understand. Research shows 84% of consumers would trust AI more with explainability. By showing reasoning on every daily plan slot, Jaanify transforms the daily plan from a black-box directive into a collaborative agreement between user and AI.

## Story Statement

**As a** knowledge worker with ADHD who struggles with prioritization and decision paralysis,
**I want to** see my daily plan with clear, one-line reasons why each task is ordered the way it is,
**So that** I can trust the AI's suggestions, feel confident about what to work on next, and reduce the executive function burden of deciding task order.

## Acceptance Criteria

### Scenario 1: Daily Plan Generated with Reasoning
```gherkin
Given the user has 3 or more active tasks
When the user opens the app in the morning or taps "Generate Daily Plan"
Then an AI-generated daily plan appears within 3 seconds
  And each task slot shows a Tier 1 Reasoning Card (e.g., "#1 because: deadline in 2h + blocks 3 tasks")
  And the plan is ordered by AI-calculated priority
```

### Scenario 2: Empty State — No Tasks
```gherkin
Given the user has no active tasks
When the user views the daily plan
Then a friendly empty state shows: "No tasks yet — add your first task to get a personalized plan"
  And a prominent "Add Task" button is displayed
  And no AI generation is triggered
```

### Scenario 3: User Overrides AI Recommendation
```gherkin
Given the user is viewing their daily plan
When the user drags a task to a different position or taps "Not now"
Then a feedback prompt appears with options: "Already done", "Not today", "Wrong priority", "Other"
  And the user's selection is stored for AI learning
  And the plan re-orders remaining tasks within 3 seconds
  And a confirmation shows: "Got it — plan updated. Your feedback helps improve future suggestions."
```

### Scenario 4: AI Service Timeout During Generation
```gherkin
Given the user requests a daily plan
  And the OpenAI API does not respond within 5 seconds
When the timeout threshold is reached
Then a fallback plan is generated using rule-based prioritization (deadline proximity + user-set importance)
  And a subtle notice shows: "Using simplified prioritization — AI reasoning will be available shortly"
  And the system retries AI generation in the background
```

### Scenario 5: Real-Time Plan Update on Task Completion
```gherkin
Given the user is viewing their daily plan
When the user completes a task from the plan
Then the completed task moves to a "Done" section with visual feedback
  And remaining tasks re-prioritize via WebSocket update (<500ms)
  And reasoning cards update to reflect the new context (e.g., "#1 because: next dependency unblocked")
```

## Scope

### In-Scope
- AI daily plan generation via OpenAI SDK (<3s response)
- Tier 1 Reasoning Cards on every plan slot
- Tier 2 expansion on tap (factor weights, confidence)
- Override/feedback mechanism with structured options
- Real-time plan updates via WebSocket (Socket.io v4)
- Rule-based fallback when AI unavailable
- Empty state for users with no tasks

### Out-of-Scope
- Calendar integration (Google Calendar, Outlook) → v2
- Time-blocking / duration estimation on plan slots → v2
- Multi-day planning (weekly view) → v2
- Auto-generate at fixed time (e.g., 7 AM push notification) → Pending open question
- Team daily plans → v3

## Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| OpenAI API for plan generation | External Service | Available | OpenAI |
| WebSocket server (Socket.io v4) | Technical | Pending | Backend |
| Reasoning Card component (US-05) | Story | Pending | Frontend |
| Task CRUD operations | Technical | Pending | Backend |
| User feedback storage schema | Technical | Pending | Backend |

## Technical Notes

- Plan generation endpoint: `POST /api/v1/plan/generate` — sends all active tasks, returns ordered list with reasoning
- WebSocket channel: `plan:updated` for real-time sync across devices
- Override feedback stored in `user_feedback` table with task_id, feedback_type, timestamp
- Fallback prioritization algorithm: `score = (deadline_urgency * 0.4) + (user_importance * 0.3) + (dependency_count * 0.2) + (estimated_energy_match * 0.1)`
- Cache daily plan in Redis (Upstash) with 1-hour TTL; invalidate on task changes

## Open Questions

- [ ] Should the daily plan auto-generate at a fixed time (e.g., 7 AM) or on first app open? — @solo-dev by 2026-02-20
- [ ] Maximum number of tasks to include in daily plan? (Suggested: 7-10, based on cognitive load research) — @solo-dev by 2026-02-20
- [ ] Should completed tasks remain visible in plan or move to separate section? — @solo-dev by 2026-02-15

## Definition of Done

- [ ] Acceptance criteria verified by QA
- [ ] Code reviewed and approved
- [ ] Unit tests written (>=80% coverage)
- [ ] Documentation updated
- [ ] PO acceptance received

---

> Generated by jaan.to pm-story-write | 2026-02-07
