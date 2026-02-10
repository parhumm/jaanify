---
story_id: US-03
epic: "Jaanify MVP"
title: "Capture Task via Voice Input"
priority: high
status: draft
estimate: TBD
labels: [frontend, ai, voice, accessibility]
created: 2026-02-07
last_updated: 2026-02-07
assignee: ""
author: "@solo-dev"
team: ""
component: "voice-input"
---

# US-03: Capture Task via Voice Input

## Executive Summary

Enable users to create tasks by tapping a microphone button and speaking naturally, with real-time transcription and AI parsing happening in parallel — completing the full flow from speech to enriched task in 8-12 seconds, with graceful fallback when voice is unavailable.

## Context

Research indicates 10-20% of high-friction mobile actions will use voice by 2026, yet no mainstream task manager ships true multimodal voice+AI task creation. For solopreneurs and mobile-heavy users, typing on small screens is a major friction point that leads to forgotten tasks. Voice capture combined with Jaanify's AI parsing creates a uniquely fast task capture experience — speak naturally, see the enriched result, save with one tap.

## Story Statement

**As a** solopreneur on the go who frequently has ideas while away from a desk,
**I want to** tap a microphone button and speak my task naturally, seeing the AI-enriched result in real-time,
**So that** I can capture ideas and to-dos in 8-12 seconds without typing on a small screen, reducing lost ideas.

## Acceptance Criteria

### Scenario 1: Successful Voice Task Capture
```gherkin
Given the user is on any screen in the app
When the user taps the microphone FAB button
Then a recording overlay appears with a pulsing waveform animation
  And the Web Speech API begins real-time transcription displayed on screen
When the user finishes speaking (pause detection or tap to stop)
Then the AI parses the transcribed text in parallel
  And a confirmation card shows the enriched task: title, deadline, category, priority
  And the user can edit fields or tap "Save" to create the task
  And the total flow completes in 8-12 seconds
```

### Scenario 2: Microphone Permission Denied
```gherkin
Given the user has not granted microphone permission
When the user taps the microphone button
Then the browser's permission prompt appears
When the user denies microphone access
Then the microphone button shows a subtle "unavailable" indicator
  And the text input field is focused with a hint: "Microphone unavailable — type your task here"
  And no error modal or intrusive alert is shown
```

### Scenario 3: Poor Audio Quality / Background Noise
```gherkin
Given the user is recording a voice task
  And significant background noise is present
When the transcription confidence falls below 70%
Then low-confidence words are highlighted in the transcription preview
  And the user can tap highlighted words to correct them
  And the AI parsing uses the corrected text for enrichment
```

### Scenario 4: Browser Does Not Support Web Speech API
```gherkin
Given the user's browser does not support the Web Speech API (e.g., Firefox on desktop)
When the app loads
Then the microphone FAB button is hidden
  And the text input is the primary task creation method
  And no error message is shown about missing voice support
```

### Scenario 5: User Cancels Mid-Recording
```gherkin
Given the user is actively recording a voice task
When the user taps the "Cancel" button or navigates away
Then the recording stops immediately
  And no partial transcription is saved
  And the user returns to their previous screen state
  And no data is sent to the AI parsing service
```

## Scope

### In-Scope
- Microphone FAB button accessible from any screen
- Web Speech API real-time transcription with visual waveform
- Parallel AI parsing during/after transcription
- Confirmation card with editable enriched fields
- "Save" and "Cancel" actions on confirmation card
- Graceful fallback: permission denied, unsupported browser
- Low-confidence word highlighting

### Out-of-Scope
- Voice commands ("Save", "Done", "Cancel" by voice) → v2 enhancement
- Multi-language voice recognition → v2 (English-only for MVP)
- Offline voice capture with deferred parsing → v2
- Continuous listening mode → v2
- Voice-to-voice feedback (TTS reading back the parsed task) → v2

## Dependencies

| Dependency | Type | Status | Owner |
|------------|------|--------|-------|
| Web Speech API | Browser API | Available (Chrome, Edge) | Browser vendors |
| AI parsing endpoint (US-01) | Story | Pending | Backend |
| Task data model | Technical | Pending | Backend |
| Microphone permission handling | Technical | Browser-native | Frontend |

## Technical Notes

- Web Speech API: Use `SpeechRecognition` interface with `interimResults: true` for real-time preview
- Parallel flow: Start AI parsing request when interim results stabilize (debounce 500ms), update when final transcript arrives
- Waveform: Use `AudioContext.analyser` node for visual feedback (canvas-based animation)
- FAB button: Fixed position bottom-right, z-index above all content, 56px touch target (WCAG)
- Feature detection: `'SpeechRecognition' in window || 'webkitSpeechRecognition' in window`
- Voice data is never stored — only the final transcribed text is sent to the API

## Open Questions

- [ ] Should voice capture support "Save" / "Done" voice commands in MVP? (Recommended: defer to v2) — @solo-dev by 2026-02-20
- [ ] Minimum transcription confidence threshold for auto-parse? (Suggested: 70%) — @solo-dev by 2026-02-15

## Definition of Done

- [ ] Acceptance criteria verified by QA
- [ ] Code reviewed and approved
- [ ] Unit tests written (>=80% coverage)
- [ ] Documentation updated
- [ ] PO acceptance received

---

> Generated by jaan.to pm-story-write | 2026-02-07
