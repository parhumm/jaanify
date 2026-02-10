---
story_id: US-01
epic: "Jaanify MVP"
title: "Create Task via Natural Language Input"
priority: critical
status: draft
estimate: TBD
labels: [frontend, backend, ai, nlp]
created: 2026-02-07
last_updated: 2026-02-07
assignee: ""
author: "@solo-dev"
team: ""
component: "task-input"
---

# US-01: Create Task via Natural Language Input

## Executive Summary

Enable users to create tasks by typing naturally (e.g., "Call Sarah about the Johnson proposal by Friday 2 PM") with real-time AI parsing that extracts title, deadline, category, and priority — eliminating the friction of structured forms and keeping users in their natural thought flow.

## Context

Jaanify's core premise is removing friction from task capture. Research shows productivity apps lose 70% of users by Day 30, partly because structured input forms break the user's thought flow. Freelancers and knowledge workers think in natural language, not form fields. By parsing natural text in real-time and showing users what the AI extracted (and why), Jaanify delivers its first "show your work" moment within seconds of the user's first interaction.

## Story Statement

**As a** freelancer juggling multiple clients who thinks in quick, natural sentences,
**I want to** type a task in plain language and have Jaanify automatically extract the title, deadline, category, and priority in real-time,
**So that** I can capture tasks without breaking my thought flow or switching to a structured form, reducing the risk of forgotten commitments.

## Acceptance Criteria

### Scenario 1: Successful Natural Language Parsing
```gherkin
Given the user is on the task input screen
When the user types "Call Sarah about the Johnson proposal by Friday 2 PM"
Then the AI parsing preview updates in real-time (<100ms p95)
  And the parsed fields display: title "Call Sarah about the Johnson proposal", deadline "Friday 2:00 PM", category "Client work"
  And a Tier 1 Reasoning Card shows: "Detected deadline: Friday 2 PM | Category: Client work (keyword: proposal)"
```

### Scenario 2: Ambiguous Input with No Clear Deadline
```gherkin
Given the user is on the task input screen
When the user types "Think about new marketing strategy"
Then the AI extracts the title "Think about new marketing strategy"
  And the deadline field shows "None detected" with option to add manually
  And the category is auto-suggested as "Planning" with confidence indicator
  And the priority defaults to "Medium" with reasoning: "No deadline or urgency markers detected"
```

### Scenario 3: Input with Multiple Tasks Detected
```gherkin
Given the user is on the task input screen
When the user types "Buy groceries and pick up dry cleaning before 5 PM"
Then the AI detects two potential tasks
  And the user is shown a split suggestion: "Buy groceries (by 5 PM)" and "Pick up dry cleaning (by 5 PM)"
  And the user can accept the split or keep as a single task
```

### Scenario 4: AI Parsing Service Unavailable
```gherkin
Given the user is on the task input screen
  And the AI parsing service is unavailable
When the user types a task in natural language
Then the input is accepted as a plain-text task title
  And a subtle notification shows "AI parsing temporarily unavailable — you can add details manually"
  And all manual fields (deadline, category, priority) are shown for direct input
  And the task is queued for AI enrichment when the service recovers
```

### Scenario 5: Empty or Whitespace-Only Input
```gherkin
Given the user is on the task input screen
When the user attempts to save a task with empty or whitespace-only input
Then the save button remains disabled
  And a hint shows: "Type a task to get started — try something like 'Review Q1 report by Thursday'"
```

## Scope

### In-Scope
- Real-time NLP parsing of text input via Fastify REST endpoint
- Extraction of: title, deadline, category (auto-detected), priority (auto-suggested)
- Editable parsed fields before saving
- Tier 1 Reasoning Card showing parsing logic
- Graceful fallback when AI service is unavailable
- Input validation (empty, whitespace, character limits)

### Out-of-Scope
- Voice input → See US-03
- Recurring task detection ("every Monday") → v2 enhancement
- Multi-language NLP parsing → v2 (English-only for MVP)
- Bulk task import from text → Future story
- Smart suggestions based on past tasks → v2

## Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| OpenAI API for NLP parsing | External Service | Available | OpenAI |
| Fastify REST endpoint `/api/v1/tasks/parse` | Technical | Pending | Backend |
| Task data model (PostgreSQL schema) | Technical | Pending | Backend |
| Reasoning Card component (US-05) | Story | Pending | Frontend |

## Technical Notes

- Fastify endpoint: `POST /api/v1/tasks/parse` accepts raw text, returns structured fields
- Real-time preview uses debounced requests (300ms debounce, <100ms p95 response)
- AI model: OpenAI GPT-4o-mini for cost-effective parsing (upgrade path to GPT-4o if quality insufficient)
- Parsed fields stored alongside raw input for AI learning feedback loop
- Zustand store manages parsing state; optimistic UI updates before server confirmation

## Open Questions

- [ ] Should multi-task detection (Scenario 3) be in MVP or deferred to v2? — @solo-dev by 2026-02-20
- [ ] Maximum input character limit? (Suggested: 500 characters) — @solo-dev by 2026-02-15
- [x] ~~AI model for parsing?~~ — **Decision**: GPT-4o-mini for MVP (2026-02-07)

## Definition of Done

- [ ] Acceptance criteria verified by QA
- [ ] Code reviewed and approved
- [ ] Unit tests written (>=80% coverage)
- [ ] Documentation updated
- [ ] PO acceptance received

---

> Generated by jaan.to pm-story-write | 2026-02-07
