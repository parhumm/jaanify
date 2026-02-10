---
title: "Jaanify MVP — Writing System Detection"
id: "AUDIT-2026-006"
version: "1.0.0"
status: draft
date: 2026-02-10
target:
  name: "jaanify"
  platform: "all"
  commit: "0defd6a"
  branch: "main"
tool:
  name: "detect-writing"
  version: "1.0.0"
  rules_version: "2024.1"
confidence_scheme: "four-level"
findings_summary:
  critical: 0
  high: 1
  medium: 1
  low: 2
  informational: 1
overall_score: 5.0
lifecycle_phase: post-build
---

# Jaanify MVP — Writing System Detection (Light Mode)

> Detected: 2026-02-10 | jaan-to v5.0.0 (SHA: 5e22ff19) | Cycle 5
> Platform: all (single-platform)
> Mode: Light (string inventory + i18n maturity)
> Analysis Mode: Full (UI components detected in scaffold)

---

## Executive Summary

Jaanify's writing system exists in two disconnected layers: **scaffold-inline strings** (hardcoded in components) and **spec-level microcopy packs** (7-language deliverables from `ux-microcopy-write` Cycles 1+3). These two layers are not connected — the microcopy specifications have not been integrated into the component code.

The scaffold contains ~55 user-facing strings across 8 UI categories (buttons, errors, empty states, loading, voice, forms, onboarding, accessibility). The strings are well-crafted — friendly, direct, and encouraging — matching the PRD's "Friendly & Encouraging" tone target. Error handling uses RFC 9457 Problem Details on the backend with human-friendly messages on the frontend. Accessibility strings (sr-only, aria-label, aria-live) are consistently present.

However, **i18n maturity is Level 0**: zero locale files, no i18n library configured, all strings hardcoded inline. The 7-language microcopy specs are deliverables in `jaan-to/outputs/` but have no technical connection to the scaffold code.

**Score: 5.0/10** — Good writing quality, zero internationalization infrastructure.

---

## String Corpus Overview

**Total strings analyzed:** ~55 user-facing strings across 3 scaffold files
**Source files:** `01-jaanify-mvp-components.tsx`, `01-jaanify-mvp-pages.tsx`, `01-jaanify-mvp-config.ts`

### String Categories Found

| Category | Count | Examples |
|----------|-------|---------|
| **Buttons/CTAs** | ~8 | "Save Task", "Cancel", "See why", "Less detail", "See full reasoning" |
| **Error messages** | ~4 | "Couldn't parse your input. You can still save manually." |
| **Empty states** | ~3 | "No tasks" section, "What's on your mind?" |
| **Loading states** | ~5 | "Loading...", "Parsing your input", "Processing voice input" |
| **Voice interaction** | ~6 | "Start voice input", "Stop voice recording", "Retry voice input" |
| **Form labels** | ~8 | "Deadline", "Category", "Priority", "What do you need to do?" |
| **Accessibility (sr-only)** | ~10 | "Collapse reasoning", screen reader labels for interactive elements |
| **Onboarding** | ~5 | Step titles, welcome copy |
| **Suggestions** | ~4 | "Call...", "Remind me...", "Review...", "Buy..." |

### Writing Quality Signals

| Signal | Assessment |
|--------|-----------|
| **Tone** | Friendly & encouraging, matches PRD specification |
| **Directness** | High — imperative verbs ("Save", "Cancel", "See why") |
| **Error handling** | Empathetic — "Couldn't parse your input. You can still save manually." (no blame) |
| **Accessibility** | Every interactive element has sr-only text or aria-label |
| **Consistency** | Consistent across components — same tone, same patterns |

---

## i18n Maturity Assessment

### Level: 0 (None) — Confidence: Confirmed (0.95)

| Criteria | Status |
|----------|--------|
| Locale files exist | No |
| i18n library installed | No (no react-i18next, next-intl, or similar) |
| Strings externalized | 0% — all hardcoded inline in components |
| Locales supported | 0 in code (7 in microcopy spec deliverables) |
| ICU MessageFormat | Not applicable |
| RTL support | Not applicable |
| String interpolation | N/A — no externalized strings |
| Centralization | None — strings scattered across component files |

### Microcopy Spec vs Implementation Gap

The project has microcopy specifications in 7 languages (EN, FA, TR, DE, FR, RU, TG) produced by `ux-microcopy-write` in Cycles 1 and 3. These are documentation-level deliverables — they define what strings should say in each language — but they exist only as spec files, not as locale JSON/YAML files consumable by an i18n framework.

**Gap**: No integration path connects the microcopy specs to the scaffold code. Scaffold components use hardcoded English strings, not i18n keys.

---

## Top Findings

### E-WRT-001: Zero i18n Infrastructure (High)

**Severity**: High | **Confidence**: Confirmed (0.95)

No i18n library, no locale files, no string externalization. All ~55 user-facing strings are hardcoded inline in component files. The project targets 7 languages per microcopy spec but has zero technical i18n infrastructure.

```yaml
evidence:
  id: E-WRT-001
  type: absence
  confidence: 0.95
  method: glob-pattern-match
  description: "No locale files found (checked: **/locales/**/*.json, **/i18n/**/*.json, **/messages/*.json). No i18n library in package.json dependencies."
```

**Recommendation**: Install `next-intl` or `react-i18next`. Externalize all strings to locale JSON files. Connect microcopy spec deliverables to locale file generation.

### E-WRT-002: Microcopy Specs Disconnected from Code (Medium)

**Severity**: Medium | **Confidence**: Confirmed (0.95)

7-language microcopy specifications exist as deliverables but are not wired into the codebase. There is no automated pipeline to convert microcopy spec Markdown files into locale JSON/YAML consumable by an i18n framework.

```yaml
evidence:
  - id: E-WRT-002a
    type: code-location
    confidence: 0.95
    location:
      uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-components.tsx"
      startLine: 667
    snippet: |
      saveLabel = "Save Task",
      cancelLabel = "Cancel",
  - id: E-WRT-002b
    type: absence
    confidence: 0.95
    description: "No locale JSON files exist to provide translated saveLabel/cancelLabel"
```

**Recommendation**: This is part of Gap L-02 (integration/wiring). The wiring skill should include locale file generation from microcopy specs.

### E-WRT-003: localStorage Token in API Client String (Low)

**Severity**: Low | **Confidence**: Confirmed (0.95)

The API client code (exported as string in config.ts) uses `localStorage.getItem("jaanify_access_token")` — a security concern flagged by detect-dev (E-DEV-003). The string itself is well-written but the pattern it implements is insecure.

```yaml
evidence:
  id: E-WRT-003
  type: code-location
  confidence: 0.95
  location:
    uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-config.ts"
    startLine: 241
    snippet: |
      const token = localStorage.getItem("jaanify_access_token");
```

**Recommendation**: Cross-reference with detect-dev E-DEV-003. Part of Gap L-04 (security hardening).

### E-WRT-004: No Content Linting or Style Guide Enforcement (Low)

**Severity**: Low | **Confidence**: Confirmed (1.0)

No content linting tools configured: no `alex`, `write-good`, `vale`, `cspell`, or `textlint` in dependencies or CI. No CODEOWNERS entry for locale files. No writing style guide document.

```yaml
evidence:
  id: E-WRT-004
  type: absence
  confidence: 1.0
  method: glob-pattern-match
  description: "No .vale.ini, .alex, cspell.json, or textlint config found"
```

**Recommendation**: Low priority for MVP. Add `cspell` for typo detection as first step.

### E-WRT-005: Backend Error Format Well-Specified (Informational)

**Severity**: Informational | **Confidence**: Firm (0.85)

Backend scaffold defines RFC 9457 Problem Details format with Zod schemas (`problemDetailsSchema`, `validationProblemDetailsSchema`). Error handling middleware maps Zod validation errors and Prisma errors to structured responses. This is a positive signal for API error writing quality.

```yaml
evidence:
  id: E-WRT-005
  type: code-location
  confidence: 0.85
  location:
    uri: "jaan-to/outputs/backend/scaffold/01-jaanify-mvp/01-jaanify-mvp-schemas.ts"
    startLine: 221
    snippet: |
      // RFC 9457 Problem Details
      export const problemDetailsSchema = z.object({...});
```

---

> Run with `--full` for NNg tone dimensions, UI copy classification, glossary, and governance analysis (6 output files).

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | jaan-to/outputs/detect/writing/summary.md |
| Skill | detect-writing |
| jaan-to | v5.0.0 (SHA: 5e22ff19) |
| Mode | Light |
| Status | Final |
