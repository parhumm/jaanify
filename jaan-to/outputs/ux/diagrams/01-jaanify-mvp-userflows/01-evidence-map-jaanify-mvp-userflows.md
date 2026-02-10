---
title: "Jaanify MVP — User Flow Evidence Map"
id: "FLOW-2026-001-evidence"
version: "1.0.0"
status: draft
date: 2026-02-10
source:
  type: prd
  path: "jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md"
tool:
  name: "ux-flowchart-generate"
  version: "1.0.0"
confidence_summary:
  high: 0
  medium: 38
  low: 0
  unknown: 0
status_summary:
  found: 38
  inferred: 0
  mismatch: 0
  unknown: 0
---

# Jaanify MVP — User Flow Evidence Map

> Generated: 2026-02-10 | jaan-to v5.0.0 (SHA: 5e22ff19) | Cycle 5
> Source mode: `prd` — all nodes are PRD-sourced (no code verification)
> Confidence: All nodes 🟡 Medium (PRD reference only, no code path)

---

## Overview Diagram

| Node ID | Node Label | PRD Reference | Confidence | Status | Notes |
|---------|-----------|---------------|------------|--------|-------|
| entry_app_open | User Opens App | US-04: "App opens to a single input" | 🟡 Medium | FOUND | Entry point for all flows |
| dec_returning | Returning user? | US-04: Guest session 7-day + auth | 🟡 Medium | FOUND | Auth state check determines flow |
| sub_onboarding | Onboarding Flow | US-04: 60-second onboarding | 🟡 Medium | FOUND | Subprocess — see Detail 1 |
| sub_task_creation | Task Creation Flow | US-01, US-03: Text + Voice | 🟡 Medium | FOUND | Subprocess — see Detail 2 |
| sub_daily_plan | Daily Plan + Reasoning | US-02, US-05, US-06 | 🟡 Medium | FOUND | Subprocess — see Detail 3 |
| step_dashboard | Dashboard View | US-02: "daily plan" implies dashboard | 🟡 Medium | FOUND | Central hub |
| dec_action | User action? | Inferred from multiple user stories | 🟡 Medium | FOUND | Branching point |

---

## Detail 1: Onboarding Flow

| Node ID | Node Label | PRD Reference | Confidence | Status | Notes |
|---------|-----------|---------------|------------|--------|-------|
| entry_first_visit | First Visit — No Account | US-04: "No account required for first interaction" | 🟡 Medium | FOUND | Guest entry point |
| step_whats_on_mind | 'What's on your mind?' Input | US-04: "single input: What's on your mind?" | 🟡 Medium | FOUND | Exact PRD quote |
| step_type_task | User types task naturally | US-01: "type...naturally" | 🟡 Medium | FOUND | Natural language input |
| load_ai_parse | AI parses input in real-time | US-01: "AI parsing preview appears in real-time" | 🟡 Medium | FOUND | Async operation |
| step_preview_parsed | Preview: title, deadline, category, priority | US-01: "NLP extracts: title, deadline, category, priority" | 🟡 Medium | FOUND | AI parse result display |
| dec_edit_fields | Edit parsed fields? | US-01: "User can edit any parsed field before saving" | 🟡 Medium | FOUND | User control point |
| step_edit_fields | User edits fields | US-01: "edit any parsed field" | 🟡 Medium | FOUND | Field editing |
| step_reasoning_preview | Reasoning Card shown on first task | US-04: "Reasoning Card shown on the first task demonstrates AI transparency" | 🟡 Medium | FOUND | First transparency moment |
| step_save_first_task | Save first task (no account) | US-04: "first task created...within 30 seconds" | 🟡 Medium | FOUND | Value before signup |
| dec_create_account | Create account? | US-04: "Account creation prompt appears only after first task is saved" | 🟡 Medium | FOUND | Deferred signup gate |
| step_google_oauth | Sign up with Google | PRD Security: "OAuth2 via Google (primary)" | 🟡 Medium | FOUND | Primary OAuth |
| step_email_signup | Sign up with email | PRD Security: "OAuth2...and GitHub (secondary)" + implied email | 🟡 Medium | FOUND | Secondary auth |
| load_create_account | Creating account... | Inferred from auth flow | 🟡 Medium | FOUND | Async account creation |
| step_skip_account | Continue as guest (7-day session) | US-04: "Guest session persists for 7 days" | 🟡 Medium | FOUND | Guest continuation |
| success_onboarded | First task created — Dashboard | US-04: Combined success state | 🟡 Medium | FOUND | Terminal success |
| err_ai_parse | Error: AI parsing failed | Inferred from Rollback Plan: "Fallback to rule-based" | 🟡 Medium | FOUND | Error state |
| step_manual_entry | Manual task entry fallback | Inferred from error recovery need | 🟡 Medium | FOUND | Graceful degradation |

---

## Detail 2: Task Creation — Text + Voice

| Node ID | Node Label | PRD Reference | Confidence | Status | Notes |
|---------|-----------|---------------|------------|--------|-------|
| entry_dashboard | Dashboard — Create Task | US-01, US-03 imply dashboard context | 🟡 Medium | FOUND | Dashboard entry |
| dec_input_method | Input method? | US-01 (text) + US-03 (voice) dual paths | 🟡 Medium | FOUND | Branching point |
| step_text_input | Type task naturally | US-01: "type...naturally" | 🟡 Medium | FOUND | Text path start |
| load_text_parse | AI parses in real-time | US-01: "AI parsing preview appears in real-time...< 100ms p95" | 🟡 Medium | FOUND | Async AI parse |
| step_text_preview | Preview: title, deadline, category, subtasks | US-01: "NLP extracts" + parsed output | 🟡 Medium | FOUND | Text result |
| step_tap_mic | Tap microphone FAB | US-03: "Microphone button accessible from any screen (FAB)" | 🟡 Medium | FOUND | Voice path start |
| dec_mic_permission | Microphone access? | US-03: "Graceful fallback if microphone access denied" | 🟡 Medium | FOUND | Permission gate |
| err_mic_denied | Error: Mic access denied | US-03: "microphone access denied" | 🟡 Medium | FOUND | Permission error |
| step_fallback_text | Show text input with hint | US-03: "show text input with hint" | 🟡 Medium | FOUND | Exact PRD quote |
| step_recording | Recording — waveform feedback | US-03: "real-time with visual waveform feedback" | 🟡 Medium | FOUND | Recording state |
| load_transcribe | Speech-to-text transcribing | US-03: "Web Speech API transcribes in real-time" | 🟡 Medium | FOUND | Async transcription |
| load_voice_parse | AI parses spoken input | US-03: "AI parses spoken input in parallel with transcription" | 🟡 Medium | FOUND | Parallel AI parse |
| step_voice_preview | Preview: enriched task card | US-03: "Visual confirmation card shows enriched task" | 🟡 Medium | FOUND | Voice result |
| dec_edit_task | Edit parsed fields? | US-01: "edit any parsed field" (applies to both) | 🟡 Medium | FOUND | Edit decision |
| step_edit_fields | User edits fields | US-01 + US-03: "User can edit or save with one tap" | 🟡 Medium | FOUND | Field editing |
| step_reasoning_card | Reasoning Card — parsing logic shown | US-01: "Reasoning Card shows parsing logic" | 🟡 Medium | FOUND | Transparency moment |
| step_save_task | Save task | US-01, US-03: save action | 🟡 Medium | FOUND | Save action |
| success_task_saved | Task saved — back to dashboard | Combined success state | 🟡 Medium | FOUND | Terminal success |
| err_parse_failed | Error: AI parse failed | Rollback Plan: "Fallback to rule-based prioritization" | 🟡 Medium | FOUND | AI failure |
| step_manual_fallback | Manual task entry | Inferred fallback | 🟡 Medium | FOUND | Degraded path |

---

## Detail 3: Daily Plan + Reasoning Cards

| Node ID | Node Label | PRD Reference | Confidence | Status | Notes |
|---------|-----------|---------------|------------|--------|-------|
| entry_morning | Morning / On-demand Plan Request | US-02: "Daily plan generated each morning (or on demand)" | 🟡 Medium | FOUND | Plan trigger |
| load_generate_plan | AI generates daily plan — < 3s | US-02: "AI...< 3s response" | 🟡 Medium | FOUND | Async plan generation |
| step_view_plan | View ordered task list | US-02: "daily plan...transparent task ordering" | 🟡 Medium | FOUND | Plan view |
| step_task_slot | Task slot with Tier 1 reason | US-02: "Each task slot includes a Tier 1 Reasoning Card" | 🟡 Medium | FOUND | Task + reason |
| dec_explore_reason | Explore reasoning? | US-05: Progressive disclosure model | 🟡 Medium | FOUND | Drill-down decision |
| step_tier1 | Tier 1: One-line summary | US-05: "One-line summary visible by default" | 🟡 Medium | FOUND | Default tier |
| step_tier2 | Tier 2: Factor weights, confidence %, data sources | US-05: "factor weights (visual bars), confidence percentage, data points" | 🟡 Medium | FOUND | Expanded tier |
| step_tier3 | Tier 3: Full chain, historical accuracy, adjust weights | US-05: "complete reasoning chain, historical accuracy...Adjust weights" | 🟡 Medium | FOUND | Power user tier |
| dec_action | User action? | US-02 + US-06: multiple actions | 🟡 Medium | FOUND | Action branching |
| step_complete_task | Complete task | US-02: Implied task completion | 🟡 Medium | FOUND | Complete action |
| step_override | Override: 'Not now because...' | US-02: "override any recommendation and provide feedback" | 🟡 Medium | FOUND | Override action |
| step_override_reason | Select override reason | US-02: "'Not now because...' with options" | 🟡 Medium | FOUND | Feedback capture |
| load_reprioritize | AI re-prioritizes — < 3s | US-06: "Re-prioritization happens in < 3s" | 🟡 Medium | FOUND | Async reprioritize |
| step_next_task | View next task slot | Inferred from plan navigation | 🟡 Medium | FOUND | Task iteration |
| success_plan_done | Daily plan reviewed | Combined success state | 🟡 Medium | FOUND | Terminal |
| err_plan_failed | Error: Plan generation failed | Rollback Plan: "Fallback to rule-based prioritization" | 🟡 Medium | FOUND | AI failure |
| step_manual_prioritize | Manual task ordering | Inferred fallback | 🟡 Medium | FOUND | Degraded path |
| load_realtime | Real-time update via WebSocket — < 500ms | US-02: "Real-time updates via WebSocket...< 500ms" | 🟡 Medium | FOUND | Async sync |

---

## Confidence Summary

| Confidence | Count | Percentage |
|-----------|-------|------------|
| 🟢 High (PRD + Code + Test) | 0 | 0% |
| 🟡 Medium (PRD only) | 38 | 100% |
| 🔴 Low (Inferred) | 0 | 0% |
| ⚫ Unknown | 0 | 0% |

**Note**: All nodes are 🟡 Medium because this is a PRD-only source analysis. Code verification would upgrade confirmed nodes to 🟢 High. No nodes needed pure inference (🔴 Low) — all are traceable to PRD sections.

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | jaan-to/outputs/ux/diagrams/01-jaanify-mvp-userflows/01-evidence-map-jaanify-mvp-userflows.md |
| Skill | ux-flowchart-generate |
| jaan-to | v5.0.0 (SHA: 5e22ff19) |
| Total Nodes | 38 |
| Nodes with PRD Reference | 38 (100%) |
| Nodes with Code Reference | 0 (0%) |
