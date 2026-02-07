---
story_id: US-05
epic: "Jaanify MVP"
title: "Drill Down into AI Reasoning via 3-Tier Cards"
priority: critical
status: draft
estimate: TBD
labels: [frontend, ai, ux, trust]
created: 2026-02-07
last_updated: 2026-02-07
assignee: ""
author: "@solo-dev"
team: ""
component: "reasoning-card"
---

# US-05: Drill Down into AI Reasoning via 3-Tier Cards

## Executive Summary

Implement a 3-tier progressive disclosure system for AI reasoning — from a glanceable one-liner (Tier 1) to explorable factor weights (Tier 2) to a full auditable reasoning chain (Tier 3) — enabling users to build trust in AI recommendations at their own pace and depth.

## Context

Jaanify's core differentiator is the "Transparent Copilot" approach — showing users *why* the AI made each recommendation. No competitor in the $2.2B AI task management market shows reasoning. The 3-tier system balances two competing needs: casual users want quick reassurance (one-liner), while power users want full auditability. Research shows 84% of consumers trust AI more with explainability, and the Reasoning Card is the single component that delivers this promise across every feature.

## Story Statement

**As a** user who wants to understand and trust Jaanify's AI decisions,
**I want to** tap on any AI recommendation and see progressively more detail about the reasoning,
**So that** I can build trust at my own pace — glancing at a summary or auditing the full decision chain — and feel confident acting on AI suggestions.

## Acceptance Criteria

### Scenario 1: Tier 1 — Glanceable Reasoning Displayed by Default
```gherkin
Given any AI recommendation is visible (daily plan, task priority, parsed input)
When the recommendation renders on screen
Then a Tier 1 Reasoning Card is visible by default
  And it shows a one-line summary (e.g., "#1 because: deadline in 2h + blocks 3 tasks")
  And the one-liner is concise (<=80 characters)
  And a subtle expand indicator (chevron or "See why") is visible
```

### Scenario 2: Tier 2 — Explorable Factor Weights on Tap
```gherkin
Given a Tier 1 Reasoning Card is displayed
When the user taps the card or the expand indicator
Then the card smoothly animates to Tier 2 view (150-300ms ease-out)
  And Tier 2 shows: factor weight bars (visual), confidence percentage, data points used
  And an "Override" button is available to change the AI recommendation
  And a "See full reasoning" link is visible for Tier 3
```

### Scenario 3: Tier 3 — Full Auditable Reasoning Chain
```gherkin
Given the user is viewing Tier 2 of a Reasoning Card
When the user taps "See full reasoning" or long-presses the card
Then Tier 3 expands to show: complete reasoning chain (step-by-step logic), historical accuracy for similar recommendations, and "Adjust weights" controls
  And the reasoning chain is presented as a readable narrative, not raw data
  And the user can adjust individual factor weights via sliders
  And adjusted weights are saved and applied to future recommendations
```

### Scenario 4: Tier Preference Persisted Across Sessions
```gherkin
Given the user has previously set their default reasoning view to Tier 2
When the user opens the app in a new session
Then all Reasoning Cards default to Tier 2 view
  And the preference is stored in Zustand state synced to localStorage
  And the user can change the default via settings
```

### Scenario 5: Reasoning Data Unavailable (Fallback)
```gherkin
Given an AI recommendation was generated using rule-based fallback (AI service was unavailable)
When the user views the Reasoning Card
Then Tier 1 shows a simplified explanation (e.g., "Prioritized by deadline proximity")
  And Tier 2 shows available factors without confidence percentage
  And Tier 3 shows: "Full AI reasoning unavailable — using rule-based prioritization"
  And no broken UI or empty states are displayed
```

## Scope

### In-Scope
- 3-tier progressive disclosure component (Tier 1, 2, 3)
- Smooth CSS animations between tiers (TailwindCSS transitions)
- Factor weight visualization (horizontal bars with labels)
- Confidence percentage display
- Override button integration (triggers feedback flow)
- Tier preference persistence (Zustand + localStorage)
- Fallback display for rule-based recommendations
- WCAG 2.1 AA accessibility for all tiers

### Out-of-Scope
- AI accuracy self-reporting ("78% accurate historically") → v2 after data collection
- Community validation ("23 users agreed with this reasoning") → v3
- Reasoning Card sharing/export → v2
- Custom reasoning templates per user → v3
- A/B testing different Tier 1 formats (1-line vs 2-line vs icon) → Pending open question

## Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| AI reasoning data in API responses | Technical | Pending | Backend |
| Override/feedback endpoint (US-02) | Story | Pending | Backend |
| Factor weights data schema | Technical | Pending | Backend |
| Historical accuracy data (v2) | Technical | Deferred | Backend |

## Technical Notes

- Component: `<ReasoningCard tier={1|2|3} data={reasoningData} onOverride={handler} />`
- Animation: CSS `max-height` transition with `overflow: hidden` for smooth expand/collapse
- Factor weights: Array of `{ factor: string, weight: number, label: string }` rendered as horizontal bars
- Zustand slice: `reasoningPreferences: { defaultTier: 1|2|3, expandedCards: Set<string> }`
- Accessibility: `aria-expanded`, `aria-controls`, keyboard Enter/Space to toggle, focus management on expand
- Performance: Tier 3 data lazy-loaded on demand (not fetched with initial recommendation)

## Open Questions

- [ ] Optimal Tier 1 length? Testing needed: 1-line vs. 2-line vs. icon-only — @solo-dev by 2026-03-01
- [ ] Should Tier 3 "Adjust weights" persist globally or per-task? (Suggested: global with per-task override) — @solo-dev by 2026-02-20
- [ ] Should reasoning history be stored for user review? ("See how recommendations changed over time") — @solo-dev by 2026-03-01

## Definition of Done

- [ ] Acceptance criteria verified by QA
- [ ] Code reviewed and approved
- [ ] Unit tests written (>=80% coverage)
- [ ] Documentation updated
- [ ] PO acceptance received

---

> Generated by jaan.to pm-story-write | 2026-02-07
