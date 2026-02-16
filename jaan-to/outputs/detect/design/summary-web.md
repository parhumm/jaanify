---
tool: detect-design
platform: web
run_depth: light
date: 2026-02-16
jaan_to_version: v7.0.0
findings_summary:
  critical: 0
  high: 1
  medium: 2
  low: 1
  informational: 2
overall_score: 7.8
---

# Design System Detection — Web Platform

## Executive Summary

Jaanify's web platform (`apps/web/`) features a well-structured design system built on TailwindCSS v4 with custom `@theme` tokens. 25 design tokens span 5 categories (colors, typography, spacing, radius, shadows) with full dark mode support via `next-themes` class-based switching. The 23-component library follows atomic design (atoms → molecules → organisms → layouts) with 100% TypeScript prop interfaces. Token discipline is excellent — zero arbitrary Tailwind values detected. Primary gaps are in component documentation (no Storybook) and missing breakpoint/animation tokens.

## Token Inventory

### Colors (10 tokens) — Confidence: Confirmed

| Token | Light Value | Dark Value | Category |
|-------|------------|------------|----------|
| `--color-sage` | `oklch(0.55 0.08 150)` | `oklch(0.65 0.08 150)` | Brand primary |
| `--color-sage-dark` | `oklch(0.45 0.08 150)` | `oklch(0.55 0.08 150)` | Brand primary variant |
| `--color-sage-light` | `oklch(0.75 0.06 150)` | `oklch(0.40 0.06 150)` | Brand primary variant |
| `--color-cream` | `oklch(0.97 0.01 80)` | `oklch(0.18 0.01 260)` | Background |
| `--color-cream-dark` | `oklch(0.93 0.02 80)` | `oklch(0.15 0.01 260)` | Background variant |
| `--color-terracotta` | `oklch(0.62 0.12 40)` | `oklch(0.70 0.12 40)` | Accent warm |
| `--color-terracotta-dark` | `oklch(0.52 0.12 40)` | `oklch(0.60 0.12 40)` | Accent warm variant |
| `--color-gold` | `oklch(0.72 0.12 85)` | `oklch(0.78 0.12 85)` | Accent highlight |
| `--color-gold-dark` | `oklch(0.58 0.12 85)` | `oklch(0.65 0.12 85)` | Accent highlight variant |
| `--color-text` | `oklch(0.20 0.02 260)` | `oklch(0.92 0.01 80)` | Text primary |
| `--color-bg` | `oklch(0.97 0.005 80)` | `oklch(0.14 0.01 260)` | Page background |

**Color system**: OKLCH color space throughout (perceptually uniform). Palette: sage (green), cream (neutral), terracotta (warm), gold (highlight).

### Typography (1 token) — Confidence: Confirmed

| Token | Value | Notes |
|-------|-------|-------|
| `--font-sans` | `var(--font-dm-sans), "DM Sans", system-ui, sans-serif` | Loaded via `next/font` |

**Gap**: No typography scale tokens (font sizes, weights, line heights). Relies on Tailwind defaults.

### Spacing (6 tokens) — Confidence: Confirmed

| Token | Value | Scale |
|-------|-------|-------|
| `--spacing-xs` | `0.25rem` (4px) | Base unit |
| `--spacing-sm` | `0.5rem` (8px) | 2x |
| `--spacing-md` | `1rem` (16px) | 4x |
| `--spacing-lg` | `1.5rem` (24px) | 6x |
| `--spacing-xl` | `2rem` (32px) | 8x |
| `--spacing-2xl` | `3rem` (48px) | 12x |

**Scale**: 4px base unit, consistent multiplier progression.

### Border Radius (5 tokens) — Confidence: Confirmed

| Token | Value |
|-------|-------|
| `--radius-sm` | `0.375rem` (6px) |
| `--radius-md` | `0.5rem` (8px) |
| `--radius-lg` | `0.75rem` (12px) |
| `--radius-xl` | `1rem` (16px) |
| `--radius-full` | `9999px` |

### Shadows (3 tokens) — Confidence: Confirmed

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 2px oklch(0 0 0 / 0.05)` |
| `--shadow-md` | `0 4px 6px oklch(0 0 0 / 0.07)` |
| `--shadow-lg` | `0 10px 15px oklch(0 0 0 / 0.1)` |

### Animation Utilities (4 custom utilities)

| Utility | Description |
|---------|-------------|
| `animate-in` | Entry animation (300ms, ease-out-expo) |
| `slide-in-from-bottom-2` | 0.5rem translate-y |
| `slide-in-from-bottom-4` | 1rem translate-y |
| `fade-in` | Opacity 0 → 1 |

**Accessibility**: `prefers-reduced-motion` media query disables all animations globally.

## Component Inventory

### Atoms (8 primitives)

| Component | Props Interface | Variants |
|-----------|----------------|----------|
| Button | `ButtonProps extends ButtonHTMLAttributes` | size, variant |
| IconButton | `IconButtonProps extends ButtonHTMLAttributes` | — |
| TextInput | `TextInputProps` | — |
| Checkbox | `CheckboxProps` | — |
| Badge | `BadgeProps` | priority-based colors |
| Chip | `ChipProps` | selected/unselected |
| ProgressDots | `ProgressDotsProps` | step count |
| Skeleton | `SkeletonProps` | animated loading |

### Molecules (7 composed)

| Component | Props Interface | Purpose |
|-----------|----------------|---------|
| ReasoningTier1 | `ReasoningTier1Props` | AI reasoning summary card |
| SuggestionChips | `SuggestionChipsProps` | Selectable chip group |
| StatCard | `StatCardProps` | Dashboard metric display |
| VoiceFAB | `VoiceFABProps` | Voice input floating button |
| ActionButtons | `ActionButtonsProps` | Action button group |
| ParsedField | `ParsedFieldProps` | AI-parsed field display |
| PlanTaskRow | `PlanTaskRowProps` | Daily plan task row |

### Organisms (6 complex)

| Component | Props Interface | Purpose |
|-----------|----------------|---------|
| ReasoningCard | `ReasoningCardProps` | 3-tier AI reasoning card |
| TaskCard | `TaskCardProps` | Task display card |
| OnboardingStep | `OnboardingStepProps` | Onboarding flow step |
| DashboardHeader | `DashboardHeaderProps` | Dashboard header |
| DailyPlan | `DailyPlanComponentProps` | Daily plan display |
| TaskInputForm | `TaskInputFormProps` | Natural language task input |

### Layouts (2)

| Component | Props Interface | Purpose |
|-----------|----------------|---------|
| DashboardLayout | `DashboardLayoutProps` | Dashboard page wrapper |
| OnboardingLayout | `OnboardingLayoutProps` | Onboarding page wrapper |

## Token Coverage Gaps

| Category | Status | Notes |
|----------|--------|-------|
| Colors | Complete | 10 tokens, light + dark |
| Typography | Partial | Font family only — no size/weight/line-height tokens |
| Spacing | Complete | 6-step scale, 4px base |
| Border Radius | Complete | 5-step scale |
| Shadows | Complete | 3-level elevation |
| Breakpoints | Missing | Relies on Tailwind defaults |
| Z-index | Missing | No z-index scale defined |
| Animation timing | Missing | Only 300ms hardcoded in utility |

## Top Findings

### E-DSN-WEB-001: No Component Documentation System

**Severity**: High
**Confidence**: Confirmed (1.0)

No Storybook, Docusaurus, or other component documentation tool detected. Component discovery relies solely on filesystem navigation.

```yaml
evidence:
  id: E-DSN-WEB-001
  type: absence
  confidence: 1.0
  method: glob-pattern-match
  description: "No .stories.{tsx,jsx,ts,js,mdx} or .storybook/ found"
```

### E-DSN-WEB-002: Incomplete Typography Token Scale

**Severity**: Medium
**Confidence**: Confirmed (0.95)

Only `--font-sans` defined. No font size, weight, or line-height tokens. Components rely entirely on Tailwind's default typography scale, which may drift from design intent.

```yaml
evidence:
  id: E-DSN-WEB-002
  type: incomplete-token-set
  confidence: 0.95
  location:
    uri: "apps/web/src/app/globals.css"
    startLine: 20
  snippet: |
    --font-sans: var(--font-dm-sans), "DM Sans", system-ui, sans-serif;
    /* No --font-size-*, --font-weight-*, --leading-* tokens */
```

### E-DSN-WEB-003: Missing Breakpoint Tokens

**Severity**: Medium
**Confidence**: Confirmed (0.90)

No responsive breakpoint tokens defined in `@theme`. Project depends on Tailwind's default breakpoints without explicit documentation of which breakpoints the design system targets.

```yaml
evidence:
  id: E-DSN-WEB-003
  type: absence
  confidence: 0.90
  method: theme-section-scan
  description: "No --breakpoint-* tokens in @theme block"
```

### E-DSN-WEB-004: Hardcoded Colors in Meta Theme

**Severity**: Low
**Confidence**: Confirmed (0.95)

Two hardcoded hex colors in `layout.tsx` meta theme-color tags. These are browser chrome colors and cannot reference CSS custom properties, so this is an expected limitation but should be documented.

```yaml
evidence:
  id: E-DSN-WEB-004a
  type: token-definition
  confidence: 0.95
  location:
    uri: "apps/web/src/app/globals.css"
    startLine: 11
  snippet: |
    --color-cream: oklch(0.97 0.01 80);  /* ≈ #FAF8F5 */
  id: E-DSN-WEB-004b
  type: hardcoded-usage
  confidence: 0.95
  location:
    uri: "apps/web/src/app/layout.tsx"
    startLine: 23
  snippet: |
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
```

### E-DSN-WEB-005: Excellent Token Discipline

**Severity**: Informational
**Confidence**: Confirmed (1.0)

Zero arbitrary Tailwind values (e.g., `text-[#xxx]`, `bg-[#xxx]`) found across all 23 components. All color, spacing, and radius usage references design tokens. This indicates strong token adoption.

```yaml
evidence:
  id: E-DSN-WEB-005
  type: positive-finding
  confidence: 1.0
  method: grep-pattern-match
  description: "0 matches for text-[#, bg-[#, border-[# across all .tsx files"
```

### E-DSN-WEB-006: Dark Mode Fully Implemented

**Severity**: Informational
**Confidence**: Confirmed (1.0)

Complete dark mode support via `next-themes` ThemeProvider (class-based switching). All 10 color tokens have dark mode overrides in `@theme dark` block. System preference detection enabled.

```yaml
evidence:
  id: E-DSN-WEB-006
  type: positive-finding
  confidence: 1.0
  location:
    uri: "apps/web/src/app/globals.css"
    startLine: 42
  snippet: |
    @theme dark {
      --color-sage: oklch(0.65 0.08 150);
      /* ... all 10 tokens overridden */
    }
```

---

Run with `--full` for brand assets, UI patterns, accessibility audit, governance signals, and full drift analysis (6 output files).

---

> Generated by detect-design (light mode) | 2026-02-16 | jaan-to v7.0.0
