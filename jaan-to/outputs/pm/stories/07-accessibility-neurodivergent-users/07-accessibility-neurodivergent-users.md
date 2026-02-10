---
story_id: US-07
epic: "Jaanify MVP"
title: "Use Accessible Interface Adapted for Neurodivergent Needs"
priority: high
status: draft
estimate: TBD
labels: [frontend, accessibility, ux, neurodivergent]
created: 2026-02-07
last_updated: 2026-02-07
assignee: ""
author: "@solo-dev"
team: ""
component: "accessibility"
---

# US-07: Use Accessible Interface Adapted for Neurodivergent Needs

## Executive Summary

Build an adaptive interface that reduces visual clutter when users feel overwhelmed (Focus Mode), supports time perception with visual timelines, provides gentle opt-in nudge notifications, and meets WCAG 2.1 AA compliance — specifically designed for users with ADHD and other neurodivergent conditions who need executive function support, not hindrance.

## Context

Neurodivergent individuals (366M globally) are dramatically underserved by productivity tools — existing apps are either too simple (can't adapt to non-linear thinking) or too complex (trigger decision paralysis). Research shows users with ADHD struggle with time blindness, visual overwhelm, and notification fatigue. Jaanify addresses this by offering adaptive UI modes: Focus Mode for overwhelmed moments, visual timelines to combat time blindness, and warm-toned gentle nudges instead of aggressive notification patterns. This is both a moral imperative and a strategic one — capturing even 1% of the neurodivergent market represents a significant user base with extremely low satisfaction with alternatives.

## Story Statement

**As a** user with ADHD who experiences decision paralysis when facing a long task list,
**I want to** use an interface that adapts to my current state — showing less when I'm overwhelmed and more when I'm focused,
**So that** the app supports my executive function instead of adding to cognitive load, helping me actually complete tasks rather than just listing them.

## Acceptance Criteria

### Scenario 1: Activate Focus Mode for Single-Task View
```gherkin
Given the user is viewing the task list with multiple tasks
When the user activates Focus Mode (toggle in header or keyboard shortcut)
Then the UI reduces to show only the single next recommended task
  And the Reasoning Card for that task is displayed
  And a progress indicator shows: "Task 1 of N today"
  And "Complete" and "Skip" buttons are prominently displayed
  And all other navigation and secondary UI elements are minimized
When the user completes or skips the task
Then the next recommended task appears with a smooth transition
```

### Scenario 2: Navigate All Task Operations via Keyboard
```gherkin
Given the user is on any screen in the app
When the user navigates using keyboard only (Tab, Enter, Space, Arrow keys, Escape)
Then all interactive elements are reachable via Tab in logical order
  And focus indicators are clearly visible (minimum 2px outline, 3:1 contrast ratio)
  And Enter/Space activates buttons and toggles
  And Escape closes modals, menus, and expanded Reasoning Cards
  And Arrow keys navigate within task lists and Reasoning Card tiers
```

### Scenario 3: Screen Reader Reads Reasoning Cards Correctly
```gherkin
Given a screen reader (VoiceOver, NVDA, JAWS) is active
When the user navigates to a task with a Reasoning Card
Then the screen reader announces: task title, priority rank, and Tier 1 reasoning text
  And expandable tiers use aria-expanded and aria-controls attributes
  And factor weight bars include aria-label with percentage values (e.g., "Deadline factor: 40%")
  And the expand/collapse action is announced as "expanded" or "collapsed"
```

### Scenario 4: High-Contrast Mode for Color-Coded Priorities
```gherkin
Given the user has enabled high-contrast mode in their OS or in Jaanify settings
When priority colors are displayed (critical=red, high=orange, medium=yellow, low=green)
Then all priority indicators meet WCAG AA 4.5:1 contrast ratio against their background
  And priority is conveyed through both color AND text label/icon (not color alone)
  And visual patterns or shapes differentiate priority levels for color-blind users
```

### Scenario 5: Reduced Motion Respects System Preference
```gherkin
Given the user has enabled "prefers-reduced-motion" in their OS settings
When animations would normally play (Reasoning Card expand, task transitions, waveform pulse)
Then all non-essential animations are disabled
  And essential state changes use instant transitions instead of animated ones
  And the app remains fully functional without motion
```

### Scenario 6: Gentle Nudge Notifications with Opt-In Control
```gherkin
Given the user has opted in to task nudge notifications
When a deadline is approaching for a task
Then a gentle notification appears with warm tone: "Friendly reminder: {task title} is due in 1 hour"
  And the notification frequency respects the user's chosen limit (default: max 3 per day)
  And each notification includes a "Snooze" and "Turn off nudges" option
  And notifications are opt-in by default (not enabled until user explicitly enables them)
When the user has not opted in to notifications
Then no nudge notifications are sent
  And no permission prompts appear unsolicited
```

## Scope

### In-Scope
- Focus Mode: single-task view with complete/skip navigation
- Full keyboard navigation for all core flows
- Screen reader support (ARIA attributes, semantic HTML, live regions)
- High-contrast mode with WCAG AA 4.5:1 compliance
- Color-independent priority indicators (text + icon + color)
- `prefers-reduced-motion` support
- Gentle nudge notifications (opt-in, frequency control, warm tone)
- Visual timeline indicators for time-sensitive tasks
- WCAG 2.1 AA compliance for all core flows

### Out-of-Scope
- WCAG AAA compliance → v2 enhancement
- Customizable UI density settings → v2
- Cognitive load estimation per task → v2
- Biometric-based mood detection → Future research
- Dyslexia-friendly font options → v2
- Audio/haptic feedback for task completion → v2

## Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| Task list component | Technical | Pending | Frontend |
| Reasoning Card component (US-05) | Story | Pending | Frontend |
| Push notification infrastructure (PWA) | Technical | Pending | Frontend |
| User preferences storage | Technical | Pending | Backend |
| WCAG 2.1 AA audit tool (axe-core) | Technical | Available | DevDep |

## Technical Notes

- Focus Mode: Zustand state `{ focusMode: boolean }` toggles between list and single-task view
- Keyboard: Follow WAI-ARIA design patterns for disclosure widgets, menus, and listboxes
- Screen reader: Use `role="region"`, `aria-live="polite"` for dynamic updates, `aria-label` on all interactive elements
- High contrast: CSS custom properties switch via `.high-contrast` class on root; test with Windows High Contrast Mode
- Reduced motion: `@media (prefers-reduced-motion: reduce)` override all transition/animation properties
- Notifications: PWA push via Service Worker, preference stored in user settings
- Testing: Integrate axe-core in CI pipeline; manual testing with VoiceOver (macOS), NVDA (Windows)

## Open Questions

- [ ] Should Focus Mode default to ON for new users who self-identify as neurodivergent during onboarding? (Suggested: offer as option, not default) — @solo-dev by 2026-02-20
- [ ] Maximum nudge frequency? (Suggested: 3/day default, configurable 1-10) — @solo-dev by 2026-02-15
- [ ] Should visual timeline show relative or absolute time? (e.g., "in 2 hours" vs "3:00 PM") — @solo-dev by 2026-02-20

## Definition of Done

- [ ] Acceptance criteria verified by QA
- [ ] Code reviewed and approved
- [ ] Unit tests written (>=80% coverage)
- [ ] axe-core WCAG 2.1 AA audit passes with zero violations
- [ ] Manual screen reader testing completed (VoiceOver)
- [ ] Documentation updated
- [ ] PO acceptance received

---

> Generated by jaan.to pm-story-write | 2026-02-07
