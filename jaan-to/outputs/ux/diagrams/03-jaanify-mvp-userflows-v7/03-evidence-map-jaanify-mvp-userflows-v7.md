# Evidence Map: Jaanify MVP User Flows (v7 Regression)

> Companion to `03-flowchart-jaanify-mvp-userflows-v7.md` -- traces every diagram node to its source.
> **Generated:** 2026-02-16

---

## Confidence Key

| Level | Symbol | Criteria |
|---|---|---|
| High | Green | PRD + code + test |
| Medium | Yellow | PRD or code (not both), or missing test |
| Low | Red | Inferred only -- no direct trace |
| Unknown | Black | Not yet assessed |

---

## Node Evidence

### Overview Diagram

| Node ID | Label | PRD Ref | Code Path | Code Symbol | Test Path | Confidence | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `entry_app_open` | User Opens App | PRD: Solution Overview | -- | -- | -- | Yellow Medium | FOUND | Entry point for all flows |
| `dec_returning` | Returning user? | PRD: US-04 AC | -- | -- | -- | Yellow Medium | FOUND | Determines onboarding vs dashboard |
| `sub_onboarding` | See: Detail 1 -- Onboarding Flow | PRD: US-04 | -- | -- | -- | Yellow Medium | FOUND | Sub-process reference |
| `sub_task_creation` | See: Detail 2 -- Task Creation Flow | PRD: US-01, US-03 | -- | -- | -- | Yellow Medium | FOUND | Sub-process reference |
| `sub_daily_plan` | See: Detail 3 -- Daily Plan + Reasoning | PRD: US-02, US-05, US-06, US-07 | -- | -- | -- | Yellow Medium | FOUND | Sub-process reference |
| `step_dashboard` | Dashboard View | PRD: Solution Overview | -- | -- | -- | Yellow Medium | FOUND | Central navigation hub |
| `dec_action` | User action? | PRD: Solution Overview | -- | -- | -- | Yellow Medium | FOUND | Routes to core features |
| `step_task_list` | Task List with Priority Reasoning | PRD: US-06 | -- | -- | -- | Yellow Medium | FOUND | US-06 task prioritization view |
| `dec_focus` | Enter Focus Mode? | PRD: US-07 AC1 | -- | -- | -- | Yellow Medium | FOUND | Focus Mode toggle for ADHD users |

### Detail 1: Onboarding Flow

| Node ID | Label | PRD Ref | Code Path | Code Symbol | Test Path | Confidence | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `entry_first_visit` | First Visit -- No Account | PRD: US-04 | -- | -- | -- | Yellow Medium | FOUND | 60-second onboarding entry |
| `step_whats_on_mind` | Display 'What is on your mind?' Input | PRD: US-04 AC1 | -- | -- | -- | Yellow Medium | FOUND | Single input field, no splash |
| `step_type_task` | User types task naturally | PRD: US-01 | -- | -- | -- | Yellow Medium | FOUND | Natural language input |
| `load_ai_parse` | AI parses input in real-time | PRD: US-01 AC2 | -- | -- | -- | Yellow Medium | FOUND | Fastify REST, < 100ms p95 |
| `step_preview_parsed` | Preview: title, deadline, category, priority | PRD: US-01 AC1 | -- | -- | -- | Yellow Medium | FOUND | NLP extraction results |
| `dec_edit_fields` | Edit parsed fields? | PRD: US-01 AC3 | -- | -- | -- | Yellow Medium | FOUND | User can edit before saving |
| `step_edit_fields` | User edits fields | PRD: US-01 AC3 | -- | -- | -- | Yellow Medium | FOUND | Inline edit of parsed fields |
| `step_reasoning_preview` | Reasoning Card shown on first task | PRD: US-04 AC3, US-01 AC4 | -- | -- | -- | Yellow Medium | FOUND | Demonstrates AI transparency |
| `step_save_first_task` | Save first task -- no account | PRD: US-04 AC2 | -- | -- | -- | Yellow Medium | FOUND | Task created < 30s of app open |
| `dec_create_account` | Create account? | PRD: US-04 AC4 | -- | -- | -- | Yellow Medium | FOUND | Soft prompt, not blocking |
| `step_google_oauth` | Sign up with Google | PRD: Security, OAuth2 | -- | -- | -- | Yellow Medium | FOUND | Primary OAuth provider |
| `step_github_oauth` | Sign up with GitHub | PRD: Security, OAuth2 | -- | -- | -- | Yellow Medium | FOUND | Secondary OAuth provider (was missing in C5) |
| `step_email_signup` | Sign up with email | PRD: Security | -- | -- | -- | Yellow Medium | INFERRED | Implied by JWT + next-auth |
| `load_create_account` | Creating account... | PRD: US-04 | -- | -- | -- | Yellow Medium | FOUND | Async account creation |
| `step_skip_account` | Continue as guest -- 7-day session | PRD: US-04 AC5 | -- | -- | -- | Yellow Medium | FOUND | localStorage + anonymous Supabase |
| `success_onboarded` | First task created -- Dashboard | PRD: US-04 | -- | -- | -- | Yellow Medium | FOUND | Terminal success state |
| `err_ai_parse` | Error: AI parsing failed | PRD: US-01 (implied) | -- | -- | -- | Yellow Medium | INFERRED | Error path for AI parse |
| `step_manual_entry` | Manual task entry fallback | PRD: US-03 AC7 (pattern) | -- | -- | -- | Yellow Medium | INFERRED | Graceful fallback |

### Detail 2: Task Creation -- Text + Voice

| Node ID | Label | PRD Ref | Code Path | Code Symbol | Test Path | Confidence | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `entry_dashboard` | Dashboard -- Create Task | PRD: Solution Overview | -- | -- | -- | Yellow Medium | FOUND | Task creation entry |
| `dec_input_method` | Input method? | PRD: US-01, US-03 | -- | -- | -- | Yellow Medium | FOUND | Text vs voice path |
| `step_text_input` | Type task naturally | PRD: US-01 | -- | -- | -- | Yellow Medium | FOUND | NL text input |
| `load_text_parse` | AI parses in real-time | PRD: US-01 AC2 | -- | -- | -- | Yellow Medium | FOUND | < 100ms p95 |
| `step_text_preview` | Preview: title, deadline, category, subtasks | PRD: US-01 AC1 | -- | -- | -- | Yellow Medium | FOUND | Parsed task preview |
| `step_tap_mic` | Tap microphone FAB | PRD: US-03 AC1 | -- | -- | -- | Yellow Medium | FOUND | Accessible from any screen |
| `dec_mic_permission` | Microphone access? | PRD: US-03 AC7 | -- | -- | -- | Yellow Medium | FOUND | Permission check |
| `err_mic_denied` | Error: Mic access denied | PRD: US-03 AC7 | -- | -- | -- | Yellow Medium | FOUND | Graceful fallback trigger |
| `step_fallback_text` | Show text input with hint | PRD: US-03 AC7 | -- | -- | -- | Yellow Medium | FOUND | Fallback for denied mic |
| `step_recording` | Recording -- waveform feedback | PRD: US-03 AC2 | -- | -- | -- | Yellow Medium | FOUND | Visual waveform feedback |
| `load_transcribe` | Web Speech API transcribing | PRD: US-03 AC2 | -- | -- | -- | Yellow Medium | FOUND | Real-time transcription |
| `load_voice_parse` | AI parses spoken input | PRD: US-03 AC3 | -- | -- | -- | Yellow Medium | FOUND | Parallel with transcription |
| `step_voice_preview` | Preview: enriched task card | PRD: US-03 AC4 | -- | -- | -- | Yellow Medium | FOUND | Visual confirmation card |
| `dec_edit_task` | Edit parsed fields? | PRD: US-03 AC5 | -- | -- | -- | Yellow Medium | FOUND | Edit or save with one tap |
| `step_edit_fields` | User edits fields | PRD: US-01 AC3 | -- | -- | -- | Yellow Medium | FOUND | Same edit flow as text |
| `step_reasoning_card` | Reasoning Card -- parsing logic shown | PRD: US-01 AC4 | -- | -- | -- | Yellow Medium | FOUND | Parsing logic visibility |
| `step_save_task` | Save task | PRD: US-01, US-03 | -- | -- | -- | Yellow Medium | FOUND | Task persistence |
| `success_task_saved` | Task saved -- back to dashboard | PRD: US-01, US-03 | -- | -- | -- | Yellow Medium | FOUND | Terminal success |
| `err_parse_failed` | Error: AI parse failed | PRD: implied | -- | -- | -- | Yellow Medium | INFERRED | Error path for both text and voice |
| `step_manual_fallback` | Manual task entry | PRD: US-03 AC7 | -- | -- | -- | Yellow Medium | INFERRED | Fallback for parse failure |

### Detail 3: Daily Plan + Reasoning Cards + Focus Mode

| Node ID | Label | PRD Ref | Code Path | Code Symbol | Test Path | Confidence | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `entry_morning` | Morning / On-demand Plan Request | PRD: US-02 | -- | -- | -- | Yellow Medium | FOUND | Daily plan trigger |
| `load_generate_plan` | AI generates daily plan -- < 3s | PRD: US-02 AC1 | -- | -- | -- | Yellow Medium | FOUND | OpenAI SDK, < 3s response |
| `step_view_plan` | View ordered task list | PRD: US-02 AC1 | -- | -- | -- | Yellow Medium | FOUND | Transparent task ordering |
| `dec_focus_mode` | Focus Mode? | PRD: US-07 AC1 | -- | -- | -- | Yellow Medium | FOUND | Reduces UI to single task |
| `step_focus_single` | Single next task + reasoning card | PRD: US-07 AC1 | -- | -- | -- | Yellow Medium | FOUND | Focus Mode view |
| `step_task_slot` | Task slot with Tier 1 reason | PRD: US-02 AC2 | -- | -- | -- | Yellow Medium | FOUND | Default reasoning visible |
| `dec_explore_reason` | Explore reasoning? | PRD: US-05 | -- | -- | -- | Yellow Medium | FOUND | Progressive disclosure entry |
| `step_tier1` | Tier 1: One-line summary | PRD: US-05 AC1 | -- | -- | -- | Yellow Medium | FOUND | Glanceable reasoning |
| `step_tier2` | Tier 2: Factor weights, confidence | PRD: US-05 AC2 | -- | -- | -- | Yellow Medium | FOUND | Explorable reasoning |
| `step_tier3` | Tier 3: Full chain, accuracy, weights | PRD: US-05 AC3 | -- | -- | -- | Yellow Medium | FOUND | Auditable reasoning |
| `dec_action` | User action? | PRD: US-02 AC3, AC4 | -- | -- | -- | Yellow Medium | FOUND | Complete, override, or next |
| `step_complete_task` | Complete task | PRD: US-02 | -- | -- | -- | Yellow Medium | FOUND | Task completion |
| `step_override` | Override: Not now because... | PRD: US-02 AC4 | -- | -- | -- | Yellow Medium | FOUND | Override with feedback |
| `step_override_reason` | Select override reason | PRD: US-02 AC4 | -- | -- | -- | Yellow Medium | FOUND | Structured feedback options |
| `load_reprioritize` | AI re-prioritizes -- < 3s | PRD: US-06 AC5 | -- | -- | -- | Yellow Medium | FOUND | Re-prioritization on override |
| `step_next_task` | View next task slot | PRD: US-02 | -- | -- | -- | Yellow Medium | FOUND | Continue through plan |
| `step_nudge` | Gentle nudge notification -- opt-in | PRD: US-07 AC3 | -- | -- | -- | Yellow Medium | FOUND | Warm tone, opt-in only |
| `success_plan_done` | Daily plan reviewed | PRD: US-02 | -- | -- | -- | Yellow Medium | FOUND | Terminal success |
| `err_plan_failed` | Error: Plan generation failed | PRD: Rollback Plan | -- | -- | -- | Yellow Medium | FOUND | Feature flag fallback |
| `step_manual_prioritize` | Manual task ordering | PRD: Rollback Plan | -- | -- | -- | Yellow Medium | FOUND | Rule-based fallback |
| `load_realtime` | Real-time update via WebSocket -- < 500ms | PRD: US-02 AC6 | -- | -- | -- | Yellow Medium | FOUND | Socket.io v4 sync |

---

## Mismatches

No mismatches detected (PRD-only mode -- single source, no cross-reference possible).

---

## Source File Index

| File Path | Last Modified | Nodes Derived |
|---|---|---|
| `jaan-to/outputs/pm/prd/01-jaanify-mvp/01-jaanify-mvp.md` | 2026-02-07 | 43 |

---

## Summary Statistics

| Metric | Value |
|---|---|
| Total Nodes | 43 |
| FOUND Status | 38 |
| INFERRED Status | 5 |
| MISMATCH Status | 0 |
| UNKNOWN Status | 0 |
| Yellow Medium Confidence | 43 (100%) -- expected for PRD-only mode |

---

## Metadata

| Field | Value |
|-------|-------|
| Companion To | 03-flowchart-jaanify-mvp-userflows-v7.md |
| Generated | 2026-02-16 |
| Output Path | jaan-to/outputs/ux/diagrams/03-jaanify-mvp-userflows-v7/ |
| Skill | ux-flowchart-generate |
| Version | 3.0 |
