---
title: "Jaanify Web — Writing System Detection"
id: "AUDIT-2026-010-WEB"
version: "1.0.0"
status: draft
date: 2026-02-16
target:
  name: "jaanify"
  platform: web
  branch: "main"
tool:
  name: "detect-writing"
  version: "1.0.0"
  rules_version: "2024.1"
run_depth: light
jaan_to_version: v7.0.0
confidence_scheme: "four-level"
findings_summary:
  critical: 0
  high: 1
  medium: 1
  low: 2
  informational: 1
overall_score: 5.5
lifecycle_phase: post-build
---

# Jaanify Web — Writing System Detection (Light Mode)

> Detected: 2026-02-16 | Target: apps/web/src/
> Platform: web (frontend only)
> Mode: Light (string inventory + i18n maturity + tone analysis)
> Analysis Mode: Full (33 .tsx component files analyzed)

---

## Executive Summary

The Jaanify web frontend contains approximately **120 user-facing strings**
across 33 `.tsx` files in `apps/web/src/`. Writing quality is strong --
the tone is consistently friendly, encouraging, and direct, matching the PRD
specification for a consumer-facing AI task manager. Microcopy is well-crafted
with empathetic error messages, clear CTAs, and comprehensive accessibility
strings (skip link, sr-only labels, aria attributes on all interactive
elements).

However, **i18n maturity remains Level 0**: no i18n library is installed, no
locale files exist, and all strings are hardcoded inline in JSX. The 7-language
microcopy specifications from earlier cycles remain disconnected from source
code. Every string would need to be extracted and keyed before any
localization work can begin.

**Score: 5.5/10** -- Good-to-strong writing quality, zero i18n infrastructure.

---

## UI Copy Inventory (Sampled)

**Total estimated strings:** ~120 user-facing strings across 33 .tsx files

### By Category

| Category | Count | Key Examples |
|----------|-------|-------------|
| **Headings** | ~15 | "Give soul to your tasks", "What's on your mind?", "Your day, planned", "Save your progress?", "No tasks for today", "Task management with transparency" |
| **Buttons / CTAs** | ~16 | "Get Started", "Try Jaanify Free", "Show me the magic", "Save Task", "Cancel", "See full reasoning", "Not now", "Try again", "Add a task", "Continue with Google", "Start Free -- 60 Seconds" |
| **Body text** | ~14 | "Type one task. We'll show you something cool.", "The task manager that shows its work.", "Your tasks are saved for 7 days. Sign in to keep them forever.", "No credit card required. Start in 60 seconds." |
| **Labels** | ~12 | "Deadline", "Category", "Energy", "Estimated", "Confidence:", "Done today", "Focus time", "Streak", "All Tasks", "Today's Plan", "Reasoning Chain" |
| **Accessibility** | ~18 | "Skip to features", "Enter your first task", "Task description", "Stop voice recording", "Processing voice input", "Start voice input", "Collapse reasoning", "See why", "Parsing your input" |
| **Placeholders** | ~6 | "e.g. Call Sarah about the proposal by Friday", "What do you need to do?", "Call...", "Remind me...", "Review...", "Buy..." |
| **Error messages** | ~4 | "Couldn't parse your input. You can still save manually.", "Couldn't generate your daily plan.", "Reasoning unavailable. Retry" |
| **Loading / State** | ~5 | "AI is planning your day...", "Updating plan...", "Add your first task and let AI plan your day" |
| **Onboarding** | ~10 | "Here's what we found", "AI analyzed your task and here's the reasoning", "See your day planned", "Almost done", "Skip for now -- I'll sign in later" |
| **Landing page** | ~14 | Feature titles, descriptions, step labels, trust badges ("Open Source", "Privacy First", "WCAG AA Accessible", "Works Offline"), testimonial, footer |
| **Metadata** | ~2 | page title, description (via layout.tsx) |

### Key Component String Map

| Component | File | String Count | Notable Strings |
|-----------|------|-------------|-----------------|
| **LandingPage** | `app/LandingPage.tsx` | ~35 | Hero headline, feature descriptions, CTA copy, trust badges, testimonial |
| **OnboardingContent** | `app/onboarding/OnboardingContent.tsx` | ~18 | 4-step wizard: headings, body, button labels, demo task text |
| **DashboardContent** | `app/dashboard/DashboardContent.tsx` | ~6 | Stat labels ("Done today", "Focus time", "Streak"), section heading |
| **DashboardHeader** | `organisms/DashboardHeader.tsx` | ~3 | "Good morning/afternoon/evening" greeting with time-based logic |
| **TaskInputForm** | `organisms/TaskInputForm.tsx` | ~6 | Placeholder, parsed field labels, error message |
| **DailyPlan** | `organisms/DailyPlan.tsx` | ~8 | Empty/loading/error state copy, section heading |
| **TaskCard** | `organisms/TaskCard.tsx` | ~2 | Estimated time format, energy badge |
| **ReasoningCard** | `organisms/ReasoningCard.tsx` | ~6 | "Confidence:", "Not now", "See full reasoning", "Less detail", "Reasoning Chain", "Historical accuracy:" |
| **ReasoningTier1** | `molecules/ReasoningTier1.tsx` | ~2 | "See why", "Collapse reasoning" (sr-only) |
| **ActionButtons** | `molecules/ActionButtons.tsx` | ~2 | "Save Task", "Cancel" (defaults) |
| **VoiceFAB** | `molecules/VoiceFAB.tsx` | ~4 | aria-labels for 4 states: idle, listening, processing, error |

---

## i18n Maturity Assessment

### Level: 0 (None) -- Confidence: Confirmed (0.95)

| Criteria | Status |
|----------|--------|
| Locale files exist | No |
| i18n library installed | No (no `next-intl`, `react-i18next`, `react-intl`, or similar) |
| `t()` / `useTranslation` calls | 0 |
| `FormattedMessage` components | 0 |
| Strings externalized | 0% -- all ~120 strings hardcoded inline in JSX |
| Locales supported | 0 in code (7 in microcopy spec deliverables) |
| ICU MessageFormat | Not applicable |
| RTL support | Not applicable |
| String interpolation | Template literals only (`${variable}`) -- no i18n-aware patterns |
| Centralization | None -- strings scattered across 33 component files |
| Date/number formatting | `toLocaleDateString("en-US", ...)` hardcoded in DashboardHeader |

### Externalization Gap

All user-facing strings live inline in component JSX/TSX. There is no string
catalog, no JSON/YAML locale files, and no extraction tooling. The hardcoded
`"en-US"` locale in `DashboardHeader.tsx` (line 14) confirms English-only
implementation.

---

## Tone Analysis (NNg Voice Dimensions)

Sampled from 4 key surfaces: LandingPage, OnboardingContent, DashboardContent,
TaskInputForm/DailyPlan.

### Dimension Ratings

| Dimension | Rating | Evidence |
|-----------|--------|----------|
| **Funny vs Serious** | Slightly Playful (3/7) | "Show me the magic", "Give soul to your tasks", "something cool" -- playful but not jokey. Errors stay serious. |
| **Formal vs Casual** | Casual (2/7) | Contractions throughout ("We'll", "Here's", "Couldn't", "I'll"). First/second person address ("your tasks", "your day"). Conversational fragments ("Almost done"). |
| **Respectful vs Irreverent** | Respectful (6/7) | Empathetic error messages ("You can still save manually"). Privacy assurance ("No spam, ever"). No dismissive language. Accessibility-first design. |
| **Enthusiastic vs Matter-of-fact** | Enthusiastic (5/7) | "Give soul to your tasks", "Try Jaanify Free", "Start Free -- 60 Seconds". Energy tapers in app interior (dashboard labels are matter-of-fact). |

### Voice Profile Summary

Jaanify's writing voice is **friendly-casual with respectful enthusiasm**. The
landing page and onboarding lean more energetic ("Show me the magic", "Give
soul to your tasks"), while the in-app dashboard settles into a calmer,
utility-focused register ("Done today", "All Tasks", "Today's Plan"). This
gradient is appropriate -- marketing surfaces attract, while productivity
surfaces stay out of the way.

Error copy is empathetic and actionable: "Couldn't parse your input. You can
still save manually." provides both acknowledgment and a recovery path.
"Couldn't generate your daily plan." plus a "Try again" button follows the
same pattern.

### Consistency Assessment

**Rating: Good** -- Tone is consistent within each surface (landing,
onboarding, dashboard, error states). The transition from enthusiastic
(landing) to matter-of-fact (dashboard) is intentional and appropriate. No
jarring tone shifts detected within any single user flow.

---

## Top Findings

### E-WRT-WEB-001: Zero i18n Infrastructure (High)

**Severity**: High | **Confidence**: Confirmed (0.95)

No i18n library is installed. No locale files exist. All ~120 user-facing
strings are hardcoded inline across 33 component files. The project has
7-language microcopy specifications as deliverables but zero technical
infrastructure to use them. Date formatting is hardcoded to `"en-US"`.

```yaml
evidence:
  id: E-WRT-WEB-001
  type: absence
  confidence: 0.95
  method: glob-pattern-match + dependency-check
  description: >
    No locale files found (searched: **/locales/**/*.json, **/i18n/**/*.json,
    **/messages/*.json). No i18n library in package.json dependencies.
    No t(), useTranslation, or FormattedMessage patterns in source code.
    Date locale hardcoded: toLocaleDateString("en-US", ...) in DashboardHeader.tsx:14.
```

**Recommendation**: Install `next-intl` (Next.js-native i18n). Extract all
frontend strings to locale JSON files. Replace `"en-US"` hardcoding with
locale-aware formatting.

### E-WRT-WEB-002: Microcopy Specs Disconnected from Code (Medium)

**Severity**: Medium | **Confidence**: Confirmed (0.95)

7-language microcopy specifications exist in `jaan-to/outputs/` deliverables
but are not wired into the codebase. Frontend components use hardcoded English
strings -- not i18n keys. No automated pipeline converts microcopy spec
Markdown files into locale JSON.

```yaml
evidence:
  - id: E-WRT-WEB-002a
    type: code-location
    confidence: 0.95
    location:
      uri: "apps/web/src/components/molecules/ActionButtons.tsx"
      startLine: 17
      endLine: 18
    snippet: |
      saveLabel = "Save Task",
      cancelLabel = "Cancel",
  - id: E-WRT-WEB-002b
    type: code-location
    confidence: 0.95
    location:
      uri: "apps/web/src/app/LandingPage.tsx"
      startLine: 293
    snippet: |
      Try Jaanify Free
  - id: E-WRT-WEB-002c
    type: absence
    confidence: 0.95
    description: "No locale JSON files provide translated strings for any component"
```

**Recommendation**: Establish a pipeline from microcopy spec deliverables to
consumable locale JSON files as part of i18n setup.

### E-WRT-WEB-003: No Content Linting or Style Guide (Low)

**Severity**: Low | **Confidence**: Confirmed (1.0)

No content linting tools configured: no `alex`, `write-good`, `vale`,
`cspell`, or `textlint` in dependencies or CI. No writing style guide
document exists. Tone consistency is maintained informally.

```yaml
evidence:
  id: E-WRT-WEB-003
  type: absence
  confidence: 1.0
  method: glob-pattern-match + dependency-check
  description: "No .vale.ini, .alex, cspell.json, or textlint config found in repo"
```

**Recommendation**: Low priority for MVP. Add `cspell` for typo detection as
a first step. Consider a lightweight voice-and-tone guide document.

### E-WRT-WEB-004: Hardcoded en-US Date Locale (Low)

**Severity**: Low | **Confidence**: Confirmed (1.0)

`DashboardHeader.tsx` hardcodes `"en-US"` as the locale for date formatting
(`toLocaleDateString("en-US", ...)`). This will display English day/month
names regardless of the user's browser locale.

```yaml
evidence:
  id: E-WRT-WEB-004
  type: code-location
  confidence: 1.0
  location:
    uri: "apps/web/src/components/organisms/DashboardHeader.tsx"
    startLine: 14
  snippet: |
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  method: pattern-match
```

**Recommendation**: Replace `"en-US"` with `undefined` (uses browser locale)
or integrate with an i18n-aware date formatting utility. Low priority until
i18n infrastructure exists.

### E-WRT-WEB-005: Strong Accessibility Copy (Informational)

**Severity**: Informational | **Confidence**: Confirmed (0.95)

Accessibility copy is comprehensive and well-written across all components:
- Skip link ("Skip to features") present on landing page
- All interactive elements have descriptive `aria-label` attributes
- VoiceFAB has 4 state-specific aria-labels (idle, listening, processing, error)
- ReasoningTier1 uses `sr-only` for expand/collapse state announcements
- Decorative elements marked with `aria-hidden="true"`
- `motion-reduce` classes applied consistently

```yaml
evidence:
  id: E-WRT-WEB-005
  type: code-location
  confidence: 0.95
  locations:
    - uri: "apps/web/src/app/LandingPage.tsx"
      startLine: 211
      snippet: 'Skip to features'
    - uri: "apps/web/src/components/molecules/VoiceFAB.tsx"
      startLine: 23
      snippet: |
        aria-label={
          isListening ? "Stop voice recording"
          : isProcessing ? "Processing voice input"
          : state === "error" ? "Retry voice input"
          : "Start voice input"
        }
    - uri: "apps/web/src/components/molecules/ReasoningTier1.tsx"
      startLine: 52
      snippet: |
        <span className="sr-only">{isExpanded ? "Collapse reasoning" : expandLabel}</span>
  method: pattern-match
```

---

## Changes Since Previous Detection (AUDIT-2026-009)

| Metric | Previous (2026-02-12) | Current (2026-02-16) | Delta |
|--------|-----------------------|----------------------|-------|
| Scope | Combined (api + web) | Web-only (split) | Narrowed |
| String corpus | ~163 (api + web) | ~120 (web only) | Comparable |
| Source files | 38+ (all) | 33 (web .tsx only) | Comparable |
| i18n maturity | Level 0 | Level 0 | No change |
| Overall score | 5.0 | 5.5 | +0.5 (tone analysis positive) |
| Findings | 6 (combined) | 5 (web only) | N/A (split) |
| Tone analysis | Not included | Full NNg 4-dimension | New |

> **Key change**: This run splits the previous combined summary into per-platform
> files (`summary-api.md` and `summary-web.md`). Writing quality assessment is
> slightly higher (5.5 vs 5.0) because tone analysis confirms consistent,
> well-calibrated voice across all surfaces. The i18n gap remains the primary
> score drag.

---

> Run with `--full` for complete string extraction, glossary generation,
> reading-level analysis, and per-component copy audit (6 output files).

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-16 |
| Output Path | jaan-to/outputs/detect/writing/summary-web.md |
| Skill | detect-writing |
| Mode | Light |
| Previous Run | AUDIT-2026-009 (2026-02-12, combined, score 5.0/10) |
| Status | Draft |
