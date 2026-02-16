---
tool: detect-ux
platform: web
mode: light
overall_score: 7.0
scan_date: 2026-02-16
findings_summary:
  total: 12
  strengths: 8
  gaps: 4
component_count: 23
accessibility_score: 7.5
user_flow_score: 7.0
component_ux_score: 7.5
---

# Jaanify Web -- UX Detection Summary (Light Mode)

## Executive Summary

Jaanify's web frontend demonstrates above-average UX maturity for an
early-stage product. The component architecture follows atomic design
principles (atoms/molecules/organisms/layouts), with consistent accessibility
patterns including `aria-*` attributes, screen-reader-only text, focus-visible
rings, and comprehensive `prefers-reduced-motion` support across every
animated component. The 4-step onboarding flow with progressive disclosure is
well-structured, and the AI reasoning transparency (3-tier ReasoningCard) is a
standout differentiator.

Key gaps include: no `error.tsx` error boundaries in any route segment, no
`loading.tsx` streaming fallbacks, limited keyboard navigation testing beyond
Enter/Space handlers, and the "Skip for now" button in onboarding step 4
lacks `focus-visible` styling.

**Overall UX Score: 7.0 / 10**

---

## User Flow Map

```
Landing (/)
  |
  |-- "Get Started" / "Try Jaanify Free" CTA
  v
Onboarding (/onboarding)
  |-- Step 1: Natural language task input (textarea, autoFocus)
  |-- Step 2: AI parsing results + ReasoningCard demo
  |-- Step 3: Daily plan preview (3 tasks, ordered)
  |-- Step 4: Account creation (Google OAuth) or "Skip for now"
  |
  |-- Skip --> Dashboard
  v
Dashboard (/dashboard)
  |-- DashboardHeader (greeting, date)
  |-- StatCards (completed today, focus time, streak)
  |-- DailyPlanComponent (today's AI-generated plan)
  |-- TaskCard list (all active tasks with reasoning)
  |-- VoiceFAB (floating action button, bottom-right)
  |
  |-- VoiceFAB or "Add task" --> Task Creation
  v
Task Creation (/tasks/new)
  |-- Back button (router.back())
  |-- SuggestionChips (idle state)
  |-- TaskInputForm (textarea with debounced AI parsing)
  |-- ParsedField cards (deadline, category, energy, estimated)
  |-- ActionButtons (Cancel / Save Task)
  |-- On save --> redirect to Dashboard
```

### Navigation Patterns

- **Landing to Onboarding:** Three CTA links (`/onboarding`) -- nav bar, hero
  primary, and final CTA section
- **Onboarding progression:** State-driven steps via Zustand store
  (`useOnboardingStore`), with button-based forward navigation
- **Dashboard to Task Creation:** Two entry points -- VoiceFAB (redirects to
  `/tasks/new`) and DailyPlan empty state "Add a task" button
- **Task Creation to Dashboard:** `router.push("/dashboard")` on successful save;
  `router.back()` on cancel or back button
- **No explicit back navigation from Dashboard:** No way to return to landing
  or onboarding from dashboard (appropriate for authenticated state)

---

## Accessibility Assessment

### Strengths

#### E-UX-WEB-001: Skip Navigation Links

**Location:** `apps/web/src/app/LandingPage.tsx:211-216`,
`apps/web/src/components/layouts/DashboardLayout.tsx:10-15`

Both the landing page and dashboard layout include skip-to-content links using
the `sr-only focus:not-sr-only` pattern. These become visible on focus,
styled with sage background and white text, providing keyboard users an
efficient bypass for navigation.

```tsx
<a
  href="#features"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4
    focus:left-4 focus:z-50 focus:px-4 focus:py-2
    focus:bg-(--color-sage) focus:text-white focus:rounded-lg"
>
  Skip to features
</a>
```

---

#### E-UX-WEB-002: Comprehensive `prefers-reduced-motion` Support

**Location:** `apps/web/src/app/globals.css:56-63`, all 23 component files

Every component with animation or transition includes the
`motion-reduce:transition-none` or `motion-reduce:animate-none` Tailwind
utility. Additionally, `globals.css` includes a global CSS media query that
sets `animation-duration`, `animation-iteration-count`,
`transition-duration`, and `scroll-behavior` to near-zero/auto for users who
prefer reduced motion.

Components with motion-reduce coverage (19/19 animated components):
- FadeIn (LandingPage), OnboardingStep, TaskCard, ReasoningCard,
  ReasoningTier1, Skeleton, DailyPlan (2 uses), TaskInputForm (2 uses),
  Checkbox, VoiceFAB (2 uses), ActionButtons, Button, IconButton, TextInput,
  Chip, ProgressDots, OnboardingContent

---

#### E-UX-WEB-003: ARIA Attributes and Semantic HTML

**Location:** Across all component files

Semantic HTML elements used correctly:
- `<main>` in LandingPage, DashboardLayout, OnboardingLayout
- `<nav>` with `aria-label="Main navigation"` in LandingPage
- `<section>` with `aria-label` or `aria-labelledby` in LandingPage (6
  sections), DailyPlan (4 states), DashboardContent, OnboardingStep
- `<article>` in feature cards and TaskCard
- `<header>` in DashboardHeader
- `<footer>` in LandingPage, OnboardingLayout

ARIA patterns:
- `aria-expanded` on ReasoningTier1 toggle button
- `aria-invalid` and `aria-describedby` on TextInput for error association
- `aria-hidden="true"` on decorative SVGs and icons (12 instances)
- `aria-label` on VoiceFAB with state-dependent labels (4 states)
- `aria-current="step"` on ProgressDots active dot
- `role="alert"` on error messages (TextInput, TaskInputForm)
- `role="status"` on parsing indicator
- `role="group"` with `aria-label` on SuggestionChips, ProgressDots
- `role="img"` with `aria-label` on hero reasoning card preview
- `role="button"` with `tabIndex={0}` and `onKeyDown` on interactive Chip

---

#### E-UX-WEB-004: Focus Management in Onboarding

**Location:** `apps/web/src/components/organisms/OnboardingStep.tsx:13-18`

When a new onboarding step becomes active, focus is programmatically moved to
the step heading via `useRef` and `useEffect`. The heading uses
`tabIndex={-1}` so it is focusable but not in the tab order, following the
ARIA Authoring Practices pattern for managing focus in single-page
applications.

```tsx
useEffect(() => {
  if (isActive && headingRef.current) {
    headingRef.current.focus();
  }
}, [isActive]);
```

---

#### E-UX-WEB-005: Screen Reader Text

**Location:** Multiple components

Meaningful `sr-only` text is provided for:
- OnboardingStep headings ("Step 1", "Step 2", etc.)
- ReasoningTier1 toggle ("Collapse reasoning" / "See why")
- ProgressDots ("Step 1 of 4")
- Button loading state ("Loading...")
- Skip navigation links

---

#### E-UX-WEB-006: Focus-Visible Ring Consistency

**Location:** Button, IconButton, Chip, ReasoningTier1, VoiceFAB, LandingPage
CTAs

All interactive elements use `focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-(--color-sage) focus-visible:ring-offset-2` for consistent
keyboard focus indication. The use of `focus-visible` (rather than `focus`)
prevents focus rings from appearing on mouse click while maintaining them for
keyboard navigation.

---

### Gaps

#### E-UX-WEB-007: No Error Boundaries (error.tsx)

**Location:** `apps/web/src/app/` -- no `error.tsx` files found in any route
segment

Next.js App Router supports `error.tsx` files that act as React error
boundaries, catching runtime errors and displaying fallback UI. None exist in
the current codebase, meaning an unhandled error in any page component will
render the default Next.js error page.

**Impact:** High -- users hitting a runtime error (e.g., network failure
during SSR prefetch) will see an unstyled, context-free error page instead of
a branded recovery screen.

---

#### E-UX-WEB-008: No Loading Boundaries (loading.tsx)

**Location:** `apps/web/src/app/` -- no `loading.tsx` files found

While the DailyPlanComponent and DashboardContent use Skeleton components for
client-side loading states, no `loading.tsx` streaming boundaries exist for
server-side rendering. The dashboard page prefetches data via `QueryClient` in
the server component, but there is no fallback during that prefetch.

**Impact:** Medium -- users may see a blank page or layout shift during
server-side data fetching. The client-side Skeleton pattern partially
mitigates this.

---

#### E-UX-WEB-009: "Skip for now" Button Missing Focus Styles

**Location:** `apps/web/src/app/onboarding/OnboardingContent.tsx:207-211`

The "Skip for now" button in onboarding step 4 is a raw `<button>` element
without `focus-visible` ring styling. All other interactive elements in the
app use the consistent sage-colored ring pattern. This button only has
`hover:text-(--color-text)` and `underline` styles.

```tsx
<button
  onClick={() => handleComplete(true)}
  className="text-(--color-text)/50 hover:text-(--color-text) text-sm
    underline underline-offset-4"
>
```

**Impact:** Low -- keyboard users navigating the onboarding flow will lose
visual focus indication at this specific button.

---

#### E-UX-WEB-010: Limited Keyboard Navigation Beyond Basic Patterns

**Location:** Onboarding flow, Dashboard

Keyboard support is present for:
- Enter key to submit in TaskInputForm and OnboardingContent
- Enter/Space on interactive Chips
- Enter to save, Escape to cancel in ParsedField editing

However, the following keyboard patterns are absent:
- No keyboard shortcut to navigate between onboarding steps (only button
  click)
- No Escape key to cancel/close ReasoningCard expansion
- No keyboard shortcut to add a new task from the dashboard
- VoiceFAB is keyboard-accessible (inherits button semantics) but no
  keyboard shortcut for quick access

**Impact:** Low-Medium -- basic keyboard navigation works via tab order, but
power-user keyboard shortcuts are not yet implemented.

---

## Component UX Patterns

### E-UX-WEB-011: Loading States (Skeleton Component)

**Location:** `apps/web/src/components/atoms/Skeleton.tsx`

A dedicated Skeleton component provides three variants (`text`, `circular`,
`rectangular`) with animated gradient shimmer. It correctly uses
`aria-hidden="true"` and respects `prefers-reduced-motion` by falling back to
a static background color.

Usage across the app:
- DashboardContent: 3 rectangular skeletons for StatCards during load
- DailyPlanComponent: 3 rectangular skeletons during AI plan generation
- ReasoningCard: 2 text skeletons during tier 3 reasoning fetch

---

### E-UX-WEB-012: Error Handling in UI

**Location:** Multiple components

Error handling patterns found:
- **TaskInputForm:** Displays inline error with `role="alert"` when parsing
  fails: "Couldn't parse your input. You can still save manually."
- **ReasoningCard:** Shows error state with retry button when tier 3 fetch
  fails: "Reasoning unavailable. Retry"
- **DailyPlanComponent:** Dedicated error section with "Try again" button
  when plan generation fails
- **TextInput:** Field-level validation errors with `aria-invalid`,
  `aria-describedby`, and `role="alert"` for live error announcements

**Gap:** No global error boundary or toast notification system. Errors are
handled per-component but there is no unified error notification layer.

---

### Form Validation Patterns

- **TextInput:** Supports error display with proper ARIA association
  (`aria-invalid`, `aria-describedby`)
- **TaskInputForm:** Client-side debounced validation via AI parsing (600ms
  debounce), with graceful degradation to manual save on parse failure
- **OnboardingContent:** Minimum length check (4 chars) before enabling
  submit
- **API-side:** Zod schemas with field-level validation pointers (see API
  summary E-UX-API-005)

---

### Responsive Design

- **Tailwind responsive classes** used throughout: `sm:`, `lg:`, `xl:`,
  `2xl:` breakpoints for layout widths, font sizes, and flex direction
- **`clamp()` typography:** Hero heading uses
  `text-[clamp(2.25rem,5vw,3.75rem)]` for fluid font sizing
- **Mobile-first layout:** Landing page CTAs stack vertically on mobile
  (`flex-col`) and horizontally on `sm:` (`sm:flex-row`)
- **`min-h-dvh`:** Dashboard and task input use dynamic viewport height for
  mobile browser chrome handling
- **Responsive max-widths:** Content containers use progressive
  `max-w-[640px] sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl`

---

### Dark Mode Support

- **CSS custom properties:** All colors defined as CSS tokens in
  `globals.css` with light/dark theme variants using `@theme dark`
- **Theme detection:** Layout includes `themeColor` meta tag that responds to
  `prefers-color-scheme`
- **`suppressHydrationWarning`:** Set on `<html>` for theme provider
  hydration compatibility

---

## Design System Analysis

### Atomic Design Structure

```
atoms/          6 components  (Button, IconButton, TextInput, Checkbox,
                               Badge, Chip, ProgressDots, Skeleton)
molecules/      6 components  (ReasoningTier1, SuggestionChips, StatCard,
                               VoiceFAB, ActionButtons, ParsedField,
                               PlanTaskRow)
organisms/      5 components  (ReasoningCard, TaskCard, OnboardingStep,
                               DashboardHeader, DailyPlan, TaskInputForm)
layouts/        2 components  (DashboardLayout, OnboardingLayout)
```

All components use a shared `cn()` utility (classnames merger) and reference
design tokens from `globals.css`. Touch targets meet the WCAG 44px minimum
via `min-h-[44px]` on buttons (md size) and `h-14 w-14` on VoiceFAB.

---

## Score Breakdown

| Category | Score | Notes |
|----------|-------|-------|
| User Flow Design | 7.5/10 | Clear happy path; no back-navigation from dashboard |
| Accessibility | 7.5/10 | Strong ARIA, skip links, motion-reduce; missing error boundaries |
| Loading States | 8.0/10 | Skeleton component used well; no streaming boundaries |
| Error Handling | 6.5/10 | Per-component errors; no global boundary or toast system |
| Form UX | 7.5/10 | Debounced AI parsing, inline errors, graceful degradation |
| Responsive Design | 7.5/10 | Mobile-first with fluid typography; well-considered breakpoints |
| Design System | 8.0/10 | Atomic structure, token-driven, consistent patterns |
| Keyboard Navigation | 6.0/10 | Basic support; no shortcuts or advanced patterns |
| **Overall** | **7.0/10** | |
