---
title: "Jaanify MVP — Design System Detection"
id: "AUDIT-2026-005"
version: "1.0.0"
status: draft
date: 2026-02-10
target:
  name: "jaanify"
  platform: "all"
  commit: "1b221f8"
  branch: "main"
tool:
  name: "detect-design"
  version: "1.0.0"
  rules_version: "2024.1"
confidence_scheme: "four-level"
findings_summary:
  critical: 0
  high: 0
  medium: 2
  low: 2
  informational: 1
overall_score: 6.5
lifecycle_phase: post-build
---

# Jaanify MVP — Design System Detection (Light Mode)

> Detected: 2026-02-10 | jaan-to v5.0.0 (SHA: 5e22ff19) | Cycle 5
> Platform: all (single-platform)
> Mode: Light (token + component scan)

---

## Executive Summary

Jaanify has a **well-designed token system** with 37 design tokens across 6 categories (colors, typography, spacing, radii, shadows, animations) using modern oklch color space and TailwindCSS v4 CSS-first configuration. The system includes full dark mode support via `@custom-variant dark` with 11 dark theme token overrides. 26 React 19 components follow atomic design methodology across 5 levels with consistent variant/size patterns and TypeScript typing.

However, the entire design system exists only in **scaffold form** — all tokens are embedded in a config.ts string export and all 26 components are bundled in a single .tsx file within `jaan-to/outputs/`. No actual CSS files, no individual component files, and no Storybook stories exist in the project root. The design system is architecturally sound but not yet operational.

**Score: 6.5/10** — Strong design foundations offset by scaffold-only state.

---

## Token Inventory

### Colors (22 tokens) — Confidence: Confirmed (0.95)

**Light Mode (11 tokens):**

| Token | Value | Category |
|-------|-------|----------|
| `--color-sage` | `oklch(0.55 0.08 150)` | Brand primary |
| `--color-sage-dark` | `oklch(0.45 0.08 150)` | Brand primary hover |
| `--color-sage-light` | `oklch(0.75 0.06 150)` | Brand primary muted |
| `--color-cream` | `oklch(0.97 0.01 80)` | Background primary |
| `--color-cream-dark` | `oklch(0.93 0.02 80)` | Background secondary |
| `--color-terracotta` | `oklch(0.62 0.12 40)` | Accent / danger |
| `--color-terracotta-dark` | `oklch(0.52 0.12 40)` | Accent hover |
| `--color-gold` | `oklch(0.72 0.12 85)` | Warning / highlight |
| `--color-gold-dark` | `oklch(0.58 0.12 85)` | Warning hover |
| `--color-text` | `oklch(0.20 0.02 260)` | Text primary |
| `--color-bg` | `oklch(0.97 0.005 80)` | Page background |

**Dark Mode (11 tokens):** Full dark theme via `@custom-variant dark` with adjusted lightness values.

**Naming Convention:** `--color-{name}` with `-dark` and `-light` modifiers. Semantic naming (sage = brand, cream = bg, terracotta = accent). oklch color space for perceptual uniformity.

### Typography (1 token) — Confidence: Confirmed (0.95)

| Token | Value |
|-------|-------|
| `--font-sans` | `var(--font-dm-sans), "DM Sans", system-ui, sans-serif` |

Font loaded via `next/font/google` with `display: "swap"` and CSS variable `--font-dm-sans`.

### Spacing (6 tokens) — Confidence: Confirmed (0.95)

| Token | Value | Scale |
|-------|-------|-------|
| `--spacing-xs` | `0.25rem` (4px) | Base unit |
| `--spacing-sm` | `0.5rem` (8px) | 2x |
| `--spacing-md` | `1rem` (16px) | 4x |
| `--spacing-lg` | `1.5rem` (24px) | 6x |
| `--spacing-xl` | `2rem` (32px) | 8x |
| `--spacing-2xl` | `3rem` (48px) | 12x |

Scale base: 4px. Linear scale progression.

### Border Radius (5 tokens) — Confidence: Confirmed (0.95)

| Token | Value |
|-------|-------|
| `--radius-sm` | `0.375rem` |
| `--radius-md` | `0.5rem` |
| `--radius-lg` | `0.75rem` |
| `--radius-xl` | `1rem` |
| `--radius-full` | `9999px` |

### Shadows (3 tokens) — Confidence: Confirmed (0.95)

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 2px oklch(0 0 0 / 0.05)` |
| `--shadow-md` | `0 4px 6px oklch(0 0 0 / 0.07)` |
| `--shadow-lg` | `0 10px 15px oklch(0 0 0 / 0.1)` |

Shadow values use oklch for consistency with color tokens.

### Animations (4 utilities) — Confidence: Confirmed (0.95)

Custom `@utility` definitions: `animate-in`, `slide-in-from-bottom-2`, `slide-in-from-bottom-4`, `slide-in-from-right-4`, `fade-in`. Entry animation keyframe with configurable translate and opacity variables. Reduced motion support via `@media (prefers-reduced-motion: reduce)`.

---

## Component Inventory

**Total: 26 components** across 5 atomic design levels.

| Level | Components | Key Patterns |
|-------|-----------|--------------|
| **Atoms (8)** | Button, IconButton, Input, Badge, LoadingSpinner, ConfidenceMeter, Avatar, Chip | Variant + Size props, `cn()` utility, aria attributes |
| **Molecules (~8)** | TaskCard, ReasoningCard, TaskInput, VoiceCapture, CategoryChip, PriorityIndicator, SearchBar, FilterBar | Compound patterns, state machines |
| **Organisms (~6)** | TaskList, DailyPlanner, TaskDetail, Sidebar, Header, OnboardingFlow | Data-fetching, 4-state (loading/error/empty/success) |
| **Templates (~2)** | DashboardLayout, OnboardingLayout | Server Component shells |
| **Pages (~2)** | Dashboard, Onboarding | Next.js 15 App Router pages |

**Component Patterns:**
- TypeScript interfaces for all props
- Variant styling via `Record<Variant, string>` maps
- `cn()` utility (clsx + tailwind-merge) for class composition
- React 19 patterns: `ref` as prop (no `forwardRef`), no `defaultProps`
- Accessibility: `aria-label`, `aria-live`, `role`, focus-visible rings, 44px min touch targets
- `'use client'` directive only on interactive components

---

## Token Coverage Gaps

| Category | Status | Notes |
|----------|--------|-------|
| Colors | Complete | 11 light + 11 dark, semantic naming |
| Typography | Partial | 1 font family — missing font size, weight, and line-height tokens |
| Spacing | Complete | 6-step scale with 4px base |
| Border Radius | Complete | 5 variants including `full` |
| Shadows | Complete | 3 elevation levels |
| Breakpoints | Missing | Using TailwindCSS v4 defaults (no custom tokens) |
| Z-index | Missing | No z-index token scale defined |
| Transitions | Partial | Animation utilities defined, no transition-duration/easing tokens |

---

## Top Findings

### E-DSN-001: Design Tokens Embedded in Config String Export (Medium)

**Severity**: Medium | **Confidence**: Confirmed (0.95)

All design tokens are defined inside a JavaScript string export (`globalsCss`) in `01-jaanify-mvp-config.ts` rather than in an actual CSS file. The tokens exist as scaffold output but are not wired into a runnable project.

```yaml
evidence:
  id: E-DSN-001
  type: code-location
  confidence: 0.95
  location:
    uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-config.ts"
    startLine: 97
    endLine: 212
    snippet: |
      export const globalsCss = `
      @import "tailwindcss";
      @theme {
        --color-sage: oklch(0.55 0.08 150);
        ...
      }`;
  method: pattern-match
```

**Recommendation**: Extract `globalsCss` content to `src/app/globals.css` as part of integration/wiring (Gap L-02).

### E-DSN-002: 26 Components Bundled in Single File (Medium)

**Severity**: Medium | **Confidence**: Confirmed (0.95)

All 26 React components are defined sequentially in a single 1,300+ line file. Production requires individual files at `src/components/{level}/{Name}.tsx`.

```yaml
evidence:
  id: E-DSN-002
  type: code-location
  confidence: 0.95
  location:
    uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-components.tsx"
    startLine: 1
    endLine: 4
    snippet: |
      // 26 components across 5 atomic design levels
      // Each component has a "File:" comment indicating intended location
  method: pattern-match
```

**Recommendation**: Requires integration/wiring skill (Gap L-02) to extract into individual files.

### E-DSN-003: Hardcoded Hex in Viewport Theme Color (Low)

**Severity**: Low | **Confidence**: Confirmed (0.95)

Viewport `themeColor` meta uses hardcoded hex values instead of design token references.

```yaml
evidence:
  - id: E-DSN-003a
    type: token-definition
    confidence: 0.95
    location:
      uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-config.ts"
      startLine: 111
    snippet: |
      --color-bg: oklch(0.97 0.005 80);
  - id: E-DSN-003b
    type: conflicting-usage
    confidence: 0.95
    location:
      uri: "jaan-to/outputs/frontend/scaffold/01-jaanify-mvp/01-jaanify-mvp-pages.tsx"
      startLine: 40
    snippet: |
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
        { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
      ],
```

**Recommendation**: Convert hex values to match oklch token equivalents. Note: `themeColor` meta requires hex — maintain a derived hex constant from the token.

### E-DSN-004: No Storybook Stories or Visual Regression Testing (Low)

**Severity**: Low | **Confidence**: Confirmed (1.0)

Zero `*.stories.{tsx,jsx,mdx}` files exist. No `.storybook/` configuration directory. No visual regression tools (Chromatic, Percy, BackstopJS) configured. Package.json includes Storybook scripts but no story files.

```yaml
evidence:
  id: E-DSN-004
  type: absence
  confidence: 1.0
  method: glob-pattern-match
  description: "No *.stories.* files found in project"
```

**Recommendation**: Generate component stories alongside scaffold output (Gap L-03 scope).

### E-DSN-005: Missing Breakpoint, Z-index, and Transition Tokens (Informational)

**Severity**: Informational | **Confidence**: Firm (0.85)

The token system covers colors, spacing, radii, and shadows but omits breakpoint tokens (relying on TailwindCSS v4 defaults), z-index scale, and transition timing/easing tokens.

```yaml
evidence:
  id: E-DSN-005
  type: absence
  confidence: 0.85
  method: pattern-match
  description: "No --breakpoint-*, --z-*, or --transition-* tokens found"
```

**Recommendation**: Define explicit breakpoint, z-index, and transition tokens in the theme for consistency. Low priority — TailwindCSS defaults are adequate for MVP.

---

> Run with `--full` for brand assets, UI patterns, accessibility audit, governance signals, and full drift analysis (6 output files).

---

## Metadata

| Field | Value |
|-------|-------|
| Created | 2026-02-10 |
| Output Path | jaan-to/outputs/detect/design/summary.md |
| Skill | detect-design |
| jaan-to | v5.0.0 (SHA: 5e22ff19) |
| Mode | Light |
| Status | Final |
