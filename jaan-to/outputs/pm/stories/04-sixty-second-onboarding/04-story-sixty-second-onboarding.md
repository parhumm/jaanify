---
story_id: US-04
epic: "Jaanify MVP"
title: "Complete Onboarding in 60 Seconds Without Account"
priority: critical
status: draft
estimate: TBD
labels: [frontend, backend, onboarding, growth]
created: 2026-02-07
last_updated: 2026-02-07
assignee: ""
author: "@solo-dev"
team: ""
component: "onboarding"
---

# US-04: Complete Onboarding in 60 Seconds Without Account

## Executive Summary

Enable first-time users to create their first AI-enriched task without creating an account, experiencing Jaanify's transparent AI value proposition within 60 seconds of opening the app — then softly prompting for account creation only after the first value moment is delivered.

## Context

Research shows apps with <60-second first-value moments see 2-4x activation improvement, yet most task managers front-load registration forms, tutorials, and permission requests. Jaanify inverts this by opening directly to a task input — no splash screen, no tutorial, no account required. The first task demonstrates AI parsing and Reasoning Cards immediately. Guest sessions persist for 7 days, giving users time to experience value before committing. This approach directly addresses the 70% Day 30 churn rate in productivity apps.

## Story Statement

**As a** first-time user who is skeptical about yet another task management app,
**I want to** create my first AI-enriched task without being forced to create an account,
**So that** I can experience Jaanify's unique AI transparency before deciding to commit, reducing my risk of wasting time on sign-up.

## Acceptance Criteria

### Scenario 1: First Task Created in Under 60 Seconds
```gherkin
Given a first-time user opens Jaanify for the first time
When the app loads
Then the page LCP is under 2 seconds
  And the screen shows a single input field: "What's on your mind?"
  And no splash screen, tutorial modal, or account prompt is displayed
When the user types a task and taps "Add"
Then the AI enriches the task with parsed fields and a Reasoning Card
  And the enriched task appears in the task list within 30 seconds of app open
```

### Scenario 2: Soft Account Prompt After First Task
```gherkin
Given the user has just created their first task as a guest
When the enriched task is displayed
Then a non-blocking account prompt appears below the task: "Save your tasks — create a free account"
  And the prompt includes Google OAuth and email sign-up options
  And a "Maybe later" dismiss button is clearly visible
When the user taps "Maybe later"
Then the prompt dismisses and does not reappear for 24 hours
  And the user continues using the app as a guest
```

### Scenario 3: Guest Session Persists for 7 Days
```gherkin
Given the user created tasks as a guest without creating an account
When the user returns to Jaanify within 7 days
Then all previously created tasks are still visible
  And guest data is stored in localStorage with anonymous Supabase session backup
When the user returns after 7 days without an account
Then a message shows: "Your guest session has expired. Create an account to keep your tasks."
  And the user can sign up to recover their tasks (if Supabase session exists)
```

### Scenario 4: AI Enrichment Fails on First Task
```gherkin
Given a first-time guest user
  And the AI parsing service is temporarily unavailable
When the user creates their first task
Then the task is saved with the raw text as the title
  And a subtle message shows: "We'll add AI insights when our service recovers"
  And the onboarding experience is not blocked or degraded
  And the account prompt still appears after task creation
```

### Scenario 5: Returning Guest Converts to Registered User
```gherkin
Given a guest user has created 5 tasks over 3 days
When the user decides to create an account via Google OAuth
Then all guest tasks are migrated to the new account
  And task history, AI reasoning data, and preferences are preserved
  And the guest session is terminated
  And a confirmation shows: "Welcome! Your 5 tasks have been saved to your account."
```

## Scope

### In-Scope
- Zero-friction landing: single input field, no splash/tutorial
- Guest session with localStorage + anonymous Supabase session
- 7-day guest session expiration
- Soft, non-blocking account prompt after first task
- Guest-to-registered account migration with data preservation
- Page LCP <2s performance target
- AI enrichment with graceful fallback

### Out-of-Scope
- Guided product tour / tutorial → v2 (opt-in only)
- Onboarding questionnaire (work type, preferences) → v2
- Referral tracking in onboarding flow → v2
- A/B testing of onboarding variations → v2
- Social sign-in beyond Google OAuth → v2 (GitHub secondary)

## Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| Anonymous Supabase session | Technical | Available | Supabase |
| Google OAuth integration | Technical | Pending | Backend |
| AI parsing endpoint (US-01) | Story | Pending | Backend |
| Reasoning Card component (US-05) | Story | Pending | Frontend |
| Guest-to-user migration endpoint | Technical | Pending | Backend |

## Technical Notes

- Guest session: Generate anonymous UUID, store in localStorage + Supabase `anon` session
- Guest data migration: `POST /api/v1/auth/migrate-guest` transfers tasks from guest UUID to authenticated user
- LCP target: Critical path is single input component — use Next.js SSR with minimal JS bundle
- Account prompt: Render as bottom sheet component, dismiss state stored in localStorage
- Feature flag: `ENABLE_GUEST_MODE` for rollback (redirect to sign-up if disabled)

## Open Questions

- [ ] Is 7-day guest session retention sufficient, or should anonymous data persist longer? — @solo-dev by 2026-02-20
- [ ] Should the account prompt re-appear after 24 hours or only show once? (Suggested: re-appear after 24h, max 3 times) — @solo-dev by 2026-02-15
- [ ] Should guest users have access to daily plan (US-02) or only task creation? — @solo-dev by 2026-02-20

## Definition of Done

- [ ] Acceptance criteria verified by QA
- [ ] Code reviewed and approved
- [ ] Unit tests written (>=80% coverage)
- [ ] Documentation updated
- [ ] PO acceptance received

---

> Generated by jaan.to pm-story-write | 2026-02-07
