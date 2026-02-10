---
story_id: US-06
epic: "Jaanify MVP"
title: "View Task Prioritization with Visible AI Factors"
priority: high
status: draft
estimate: TBD
labels: [frontend, backend, ai, prioritization]
created: 2026-02-07
last_updated: 2026-02-07
assignee: ""
author: "@solo-dev"
team: ""
component: "task-list"
---

# US-06: View Task Prioritization with Visible AI Factors

## Executive Summary

Display AI-calculated priority rankings on every task in the list view with visible reasoning factors — enabling users to validate the AI's logic, spot when the AI lacks context, and manually override priorities with feedback that improves future recommendations.

## Context

Traditional task managers either force users to manually prioritize (Todoist, TickTick) or silently auto-prioritize (Motion, Reclaim.ai). Both approaches fail: manual prioritization adds cognitive load, while silent auto-prioritization erodes trust. Jaanify takes a third path — AI prioritizes transparently, showing the factors considered (deadline, importance, dependencies, energy level, time estimates, completion patterns). When the AI's context is incomplete, users can see exactly what's missing and correct it, creating a feedback loop that improves over time.

## Story Statement

**As a** user reviewing my task list who needs to decide what to work on next,
**I want to** see what factors the AI considered when prioritizing each task and how much each factor influenced the ranking,
**So that** I can validate the reasoning, identify when the AI's context is incomplete, and override with feedback that improves future suggestions.

## Acceptance Criteria

### Scenario 1: Task List Shows Priority Rank with Reasoning
```gherkin
Given the user has multiple active tasks
When the user views the task list
Then each task displays its priority rank (1, 2, 3...)
  And each task shows a Tier 1 Reasoning Card with a one-line explanation
  And tasks are ordered by AI-calculated priority score
  And the priority factors include: deadline proximity, user-set importance, dependencies, estimated energy level, time of day fit
```

### Scenario 2: User Manually Overrides Priority
```gherkin
Given the user is viewing the prioritized task list
When the user drags a task to a different position or taps "Change priority"
Then a feedback prompt shows: "Help the AI learn — why should this be higher/lower?"
  And the options include: "Deadline changed", "More urgent than AI thinks", "Less important", "Context AI doesn't know"
  And the user's override is applied immediately
  And re-prioritization of remaining tasks completes within 3 seconds
  And the override reason is stored for AI model improvement
```

### Scenario 3: Two Tasks Have Identical Priority Scores
```gherkin
Given two or more tasks have the same AI-calculated priority score
When the user views the task list
Then the tied tasks are grouped with a visual indicator: "Equal priority"
  And the Tier 2 view shows which factors differ between the tied tasks
  And the user can manually break the tie by setting preference
```

### Scenario 4: Re-Prioritization Timeout After Override
```gherkin
Given the user has overridden a task priority
  And the AI re-prioritization request does not respond within 5 seconds
When the timeout is reached
Then the user's manual override is applied as the final order
  And a subtle notice shows: "Using your preference — AI update pending"
  And the system retries AI re-prioritization in the background
  And the task list does not freeze or show a loading spinner
```

### Scenario 5: Empty Task List
```gherkin
Given the user has no active tasks
When the user views the task list
Then a friendly empty state shows: "All clear! Add a task when you're ready"
  And a prominent "Add Task" button is displayed
  And no priority ranking UI or Reasoning Cards are rendered
```

## Scope

### In-Scope
- Priority rank display on every task in list view
- Tier 1 Reasoning Card on each ranked task
- Priority factors: deadline proximity, user importance, dependencies, energy level, time of day, completion patterns
- Manual override with structured feedback
- Re-prioritization after override (<3s via OpenAI)
- Equal-priority handling with visual grouping
- Fallback when AI re-prioritization times out
- Empty state for zero tasks

### Out-of-Scope
- Custom priority factors (user-defined) → v2
- Priority based on calendar context → v2
- Priority based on location/GPS → Future
- Team priority alignment → v3
- Historical priority accuracy reporting → v2

## Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| AI prioritization endpoint | Technical | Pending | Backend |
| Reasoning Card component (US-05) | Story | Pending | Frontend |
| Override feedback storage schema | Technical | Pending | Backend |
| OpenAI API for re-prioritization | External Service | Available | OpenAI |
| Task data model with priority fields | Technical | Pending | Backend |

## Technical Notes

- Priority endpoint: `POST /api/v1/tasks/prioritize` — accepts task list, returns ordered list with scores and reasoning
- Override endpoint: `PATCH /api/v1/tasks/{id}/priority` with body `{ position: number, reason: string }`
- Priority score: Float 0.0-1.0, calculated from weighted factors
- Factor weights default: `{ deadline: 0.3, importance: 0.25, dependencies: 0.2, energy: 0.15, time_fit: 0.1 }`
- Optimistic UI: Apply override immediately in Zustand, sync to backend async
- Re-prioritization uses React Query mutation with 5s timeout

## Open Questions

- [ ] How should the AI handle tasks with no deadline? Default priority strategy needed — @solo-dev by 2026-02-20
- [ ] Should historical completion patterns be included in MVP or deferred? (Suggested: defer, needs data collection period) — @solo-dev by 2026-02-15
- [ ] Should users see a "priority confidence" score? (e.g., "AI is 85% confident about this ranking") — @solo-dev by 2026-02-20

## Definition of Done

- [ ] Acceptance criteria verified by QA
- [ ] Code reviewed and approved
- [ ] Unit tests written (>=80% coverage)
- [ ] Documentation updated
- [ ] PO acceptance received

---

> Generated by jaan.to pm-story-write | 2026-02-07
