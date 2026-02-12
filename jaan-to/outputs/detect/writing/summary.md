---
title: "Jaanify MVP — Writing System Detection"
id: "AUDIT-2026-009"
version: "1.0.0"
status: draft
date: 2026-02-12
target:
  name: "jaanify"
  platform: "all"
  commit: "901f4be"
  branch: "main"
tool:
  name: "detect-writing"
  version: "1.0.0"
  rules_version: "2024.1"
confidence_scheme: "four-level"
findings_summary:
  critical: 0
  high: 1
  medium: 2
  low: 2
  informational: 1
overall_score: 5.0
lifecycle_phase: post-build
---

# Jaanify MVP — Writing System Detection (Light Mode)

> Detected: 2026-02-12 | Target: Full repository (monorepo — apps/web + apps/api)
> Platform: all (single-platform)
> Mode: Light (string inventory + i18n maturity)
> Analysis Mode: Full (UI components detected in apps/web/)

---

## Executive Summary

Jaanify now has **real production code** with ~163 user-facing strings across the frontend (`apps/web/src/`, 113 strings in 32 .tsx files) and backend (`apps/api/src/`, ~50 error/status messages). This is a significant advance from the previous detection (2026-02-10) which analyzed scaffold-only code with ~55 strings.

The writing quality remains strong — friendly, direct, and encouraging tone matching the PRD spec. Error messages are empathetic ("Couldn't parse your input. You can still save manually."), accessibility strings are comprehensive (skip link, sr-only, aria-labels on all interactive elements), and the backend uses RFC 9457 Problem Details with a structured error factory.

However, **i18n maturity remains Level 0**: zero locale files, no i18n library installed, all ~163 strings hardcoded inline. The 7-language microcopy specifications from Cycles 1+3 are still disconnected from code. The i18n gap is now larger in absolute terms — 163 strings need externalization vs 55 previously.

**Score: 5.0/10** — Good writing quality, zero internationalization infrastructure.

---

## String Corpus Overview

**Total strings:** ~163 user-facing strings across 38+ source files

### Frontend Strings (apps/web/src/) — 113 strings, 32 files

| Category | Count | Examples |
|----------|-------|---------|
| **Headings** | ~12 | "What's on your mind?", "Your day, planned", "Today's Plan", "Good morning/afternoon/evening" |
| **Buttons/CTAs** | ~14 | "Show me the magic", "Save Task", "Cancel", "See full reasoning", "Try again", "Continue with Google" |
| **Body text** | ~12 | "Type one task. We'll show you something cool.", "Your tasks are saved for 7 days. Sign in to keep them forever." |
| **Labels** | ~11 | "Deadline", "Category", "Energy", "Estimated", "Confidence:", "Done today", "Focus time", "Streak" |
| **Accessibility** | ~22 | "Skip to main content", "Go back", "Collapse reasoning", "Stop voice recording", "Task description" |
| **Placeholders** | ~6 | "e.g. Call Sarah about the proposal by Friday", "What do you need to do?", "Call...", "Remind me..." |
| **Error messages** | ~3 | "Couldn't parse your input. You can still save manually.", "Couldn't generate your daily plan." |
| **Loading states** | ~3 | "AI is planning your day...", "Updating plan...", "Loading..." |
| **Empty states** | ~2 | "No tasks for today", "Add your first task and let AI plan your day" |
| **Onboarding** | ~8 | 4-step wizard titles, subtitles, demo task text |
| **Metadata** | ~2 | "Jaanify — Smart AI Task Manager", page description |

### Backend Strings (apps/api/src/) — ~50 strings, 6+ files

| Category | Count | Source Files |
|----------|-------|-------------|
| **Error factory titles** | 9 | `lib/error-factory.ts` — "Validation Failed", "Authentication Required", "Token Expired", etc. |
| **Prisma error messages** | 3 | `lib/error-factory.ts` — "A record with the given value(s) already exists", etc. |
| **Auth error messages** | 8 | `plugins/auth.ts`, `routes/auth/auth.service.ts` — "Missing Authorization header", "Access token has expired", etc. |
| **Error handler messages** | 6 | `plugins/error-handler.ts` — "Validation Error", "Internal Server Error", etc. |
| **AI system prompts** | 2 | `routes/tasks/tasks.service.ts`, `routes/daily-plans/daily-plans.service.ts` |
| **Zod default messages** | ~15 | 6 schema files — default Zod validation messages (not customized) |
| **API metadata** | 3 | `app.ts` — "Jaanify API", version, description |
| **Log/startup messages** | 4 | `server.ts` — startup, shutdown messages |

### Writing Quality Signals

| Signal | Assessment |
|--------|-----------|
| **Tone** | Friendly & encouraging, matches PRD specification |
| **Directness** | High — imperative verbs ("Save", "Cancel", "See why", "Show me the magic") |
| **Error handling** | Empathetic frontend ("Couldn't parse your input. You can still save manually."), structured backend (RFC 9457) |
| **Accessibility** | Every interactive element has sr-only text or aria-label. Skip link present. |
| **Consistency** | Consistent tone across all frontend components |
| **Backend errors** | Well-structured error factory with problem type titles, Prisma/Zod error mapping |

---

## i18n Maturity Assessment

### Level: 0 (None) — Confidence: Confirmed (0.95)

| Criteria | Status |
|----------|--------|
| Locale files exist | No |
| i18n library installed | No (no react-i18next, next-intl, or similar) |
| Strings externalized | 0% — all ~163 strings hardcoded inline |
| Locales supported | 0 in code (7 in microcopy spec deliverables) |
| ICU MessageFormat | Not applicable |
| RTL support | Not applicable |
| String interpolation | Template literals only (`${variable}`) — no i18n-aware interpolation |
| Centralization | None — strings scattered across 38+ source files |

### Microcopy Spec vs Implementation Gap

The project has microcopy specifications in 7 languages (EN, FA, TR, DE, FR, RU, TG) produced by `ux-microcopy-write` in Cycles 1 and 3. These exist only as spec files in `jaan-to/outputs/`, not as locale JSON/YAML files consumable by an i18n framework.

**Gap**: No integration path connects the microcopy specs to the source code. Frontend components use hardcoded English strings, not i18n keys. Backend error messages are also hardcoded English.

---

## Top Findings

### E-WRT-001: Zero i18n Infrastructure (High)

**Severity**: High | **Confidence**: Confirmed (0.95)

No i18n library, no locale files, no string externalization. All ~163 user-facing strings are hardcoded inline across 38+ source files. The project targets 7 languages per microcopy spec but has zero technical i18n infrastructure. The gap has grown from ~55 strings (scaffold-only) to ~163 strings (real code).

```yaml
evidence:
  id: E-WRT-001
  type: absence
  confidence: 0.95
  method: glob-pattern-match
  description: "No locale files found (checked: **/locales/**/*.json, **/i18n/**/*.json, **/messages/*.json). No i18n library in any package.json dependencies."
```

**Recommendation**: Install `next-intl` or `react-i18next`. Externalize all frontend strings to locale JSON files. Add backend error message externalization.

### E-WRT-002: Microcopy Specs Disconnected from Code (Medium)

**Severity**: Medium | **Confidence**: Confirmed (0.95)

7-language microcopy specifications exist as deliverables but are not wired into the codebase. Frontend components use hardcoded English strings (`"Save Task"`, `"Cancel"`) — not i18n keys. No automated pipeline exists to convert microcopy spec Markdown files into locale JSON.

```yaml
evidence:
  - id: E-WRT-002a
    type: code-location
    confidence: 0.95
    location:
      uri: "apps/web/src/components/molecules/ActionButtons.tsx"
      startLine: 17
    snippet: |
      saveLabel = "Save Task",
      cancelLabel = "Cancel",
  - id: E-WRT-002b
    type: absence
    confidence: 0.95
    description: "No locale JSON files exist to provide translated saveLabel/cancelLabel"
```

**Recommendation**: Part of integration/wiring. The i18n setup should include locale file generation from existing microcopy specs.

### E-WRT-003: Backend Error Messages Not Externalized (Medium)

**Severity**: Medium | **Confidence**: Confirmed (0.95)

The backend has a well-structured error factory (`lib/error-factory.ts`) with 9 problem type titles and structured Prisma error mapping. However, all error message strings are hardcoded inline. Auth error messages include detailed user guidance ("Use /v1/auth/refresh to obtain a new token") that would benefit from externalization for future localization.

```yaml
evidence:
  id: E-WRT-003
  type: code-location
  confidence: 0.95
  location:
    uri: "apps/api/src/lib/error-factory.ts"
    startLine: 8
    endLine: 16
    snippet: |
      "Validation Failed"
      "Authentication Required"
      "Token Expired"
      "Insufficient Permissions"
      "Not Found"
      "Resource Already Exists"
      "Invalid State Transition"
      "Rate Limit Exceeded"
      "AI Service Unavailable"
  method: pattern-match
```

**Recommendation**: Create an error message catalog. Low priority for MVP (API consumers handle their own i18n), but needed before multi-language support.

### E-WRT-004: No Content Linting or Style Guide Enforcement (Low)

**Severity**: Low | **Confidence**: Confirmed (1.0)

No content linting tools configured: no `alex`, `write-good`, `vale`, `cspell`, or `textlint` in dependencies or CI. No writing style guide document.

```yaml
evidence:
  id: E-WRT-004
  type: absence
  confidence: 1.0
  method: glob-pattern-match
  description: "No .vale.ini, .alex, cspell.json, or textlint config found"
```

**Recommendation**: Low priority for MVP. Add `cspell` for typo detection as first step.

### E-WRT-005: Zod Default Validation Messages Not Customized (Low)

**Severity**: Low | **Confidence**: Confirmed (0.95)

All 6 Zod schema files use default validation messages (`.min(1)` → "String must contain at least 1 character(s)"). These technical messages are exposed to API consumers and could be more user-friendly.

```yaml
evidence:
  id: E-WRT-005
  type: code-location
  confidence: 0.95
  location:
    uri: "apps/api/src/routes/tasks/tasks.schema.ts"
    snippet: |
      title: z.string().min(1).max(500)
      // Uses default: "String must contain at least 1 character(s)"
  method: pattern-match
```

**Recommendation**: Add custom error messages to Zod schemas: `.min(1, { message: "Title is required" })`. Low priority — Zod defaults are functional.

### E-WRT-006: Backend Error Format Well-Structured (Informational)

**Severity**: Informational | **Confidence**: Confirmed (0.95)

Backend uses RFC 9457 Problem Details format with a dedicated error factory, Zod validation error mapping, and Prisma error mapping. Error handler plugin catches and normalizes all error types. This is a strong positive signal for API error quality.

```yaml
evidence:
  id: E-WRT-006
  type: code-location
  confidence: 0.95
  location:
    uri: "apps/api/src/lib/error-factory.ts"
    startLine: 1
    snippet: |
      // RFC 9457 Problem Details error factory
      // 9 problem types with structured error creation
  method: pattern-match
```

---

## Changes Since Previous Detection (AUDIT-2026-006)

| Metric | Previous (2026-02-10) | Current (2026-02-12) | Delta |
|--------|-----------------------|----------------------|-------|
| String corpus | ~55 (scaffold only) | ~163 (real code) | +108 strings |
| Source files | 3 (scaffold) | 38+ (apps/web + apps/api) | +35 files |
| i18n maturity | Level 0 | Level 0 | No change |
| Overall score | 5.0 | 5.0 | No change |
| Findings | 5 | 6 | +1 (Zod defaults) |
| Backend errors | Scaffold stubs | Real implementation | Significant advance |

> **Key change**: The codebase has moved from scaffold-only to real production code. Writing quality remains strong but the i18n gap has grown — 163 strings now need externalization vs 55 previously. New finding: backend error messages in real implementation are well-structured but not externalized.

---

> Run with `--full` for NNg tone dimensions, UI copy classification, glossary, and governance analysis (6 output files).

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-12 |
| Output Path | jaan-to/outputs/detect/writing/summary.md |
| Skill | detect-writing |
| Mode | Light |
| Previous Run | AUDIT-2026-006 (2026-02-10, score 5.0/10) |
| Status | Draft |
