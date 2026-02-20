# PRD: Jaanify Login/Auth UX Fix

> ID: PRD-02 | Generated: 2026-02-20 | Skill: pm-prd-write | Cycle 13
> jaan-to: v7.2.0 (SHA: 3c10276)

---

## Problem Statement

Users cannot find how to log in to Jaanify. The landing page has no login button, no `/login` route exists, the Google OAuth button in onboarding is a TODO, and the dashboard is accessible without authentication. This means zero user retention is possible because accounts are never created.

## Goal

Add a complete, neurodivergent-friendly login/auth flow so users can:
1. Find the login option immediately on the landing page
2. Sign in with Google OAuth (primary) or continue as guest
3. Be redirected to login when accessing protected routes
4. See their session state (avatar, name) in the navbar
5. Log out cleanly

## Scope

### In Scope (This PRD)

| Feature | Description |
|---------|-------------|
| F-01: Login Page | Dedicated `/login` route with Google OAuth button + guest option |
| F-02: Landing Page Login Button | "Sign In" button in navbar + secondary CTA on hero |
| F-03: Auth Guard Middleware | Next.js middleware protecting `/dashboard` and `/tasks/*` routes |
| F-04: Session State Navbar | User avatar + name in navbar when logged in, "Sign In" when not |
| F-05: Google OAuth Wiring | Wire "Continue with Google" to backend `POST /auth/google` |
| F-06: Logout Flow | Logout button in navbar dropdown, calls `DELETE /auth/logout` |
| F-07: Token Management | Move from localStorage to HttpOnly cookies for token storage |

### Out of Scope

- Email/password registration (defer to v2)
- Magic link authentication (defer to v2)
- Multi-factor authentication (defer to v2)
- Social logins beyond Google (defer to v2)
- Account settings page (defer to v2)

## Technical Requirements

### Login Page (`/login`)
- Clean, minimal layout with Jaanify branding
- Primary CTA: "Continue with Google" (large, high-contrast button)
- Secondary: "Try without account" link → `/onboarding`
- Redirect parameter: `/login?redirect=/dashboard` → after auth, go to redirect URL
- WCAG 2.2 SC 3.3.8 compliant (no cognitive function tests)
- ADHD-friendly: minimal elements, clear focus path, no distractions

### Landing Page Updates
- Sticky navbar: Add "Sign In" button (right side, next to "Get Started")
- Hero section: Keep "Get Started" as primary, add "Sign In" as secondary link
- If user is already authenticated: show user avatar instead of "Sign In"

### Middleware (`middleware.ts`)
- Protect routes: `/dashboard`, `/dashboard/*`, `/tasks/*`
- Check for session cookie (NOT localStorage token)
- Redirect to `/login?redirect={originalPath}` if no session
- Allow: `/`, `/login`, `/onboarding`, `/api/*`, `/_next/*`, static assets

### Session State
- Zustand store: `useAuthStore` with `user`, `isAuthenticated`, `isLoading`
- Hydrate on app mount from `/users/me` API call
- Navbar component reads from store
- Show: user avatar (Google profile pic), display name, logout dropdown

### Google OAuth Flow
1. User clicks "Continue with Google" on `/login`
2. Frontend redirects to Google OAuth consent screen
3. Google redirects back with auth code
4. Frontend sends code to backend `POST /auth/google`
5. Backend validates, creates/finds user, returns JWT tokens
6. Frontend stores tokens in HttpOnly cookies (set by backend via Set-Cookie header)
7. Frontend redirects to `redirect` param (default: `/dashboard`)

### Token Management (Security Fix)
- **Current (insecure)**: `localStorage.getItem('jaanify_access_token')`
- **Target (secure)**: HttpOnly cookies set by backend via `Set-Cookie` header
- API client reads token from cookie automatically (browser sends with `withCredentials: true`)
- Backend sets: `access_token` (HttpOnly, Secure, SameSite=Lax, 1h) and `refresh_token` (HttpOnly, Secure, SameSite=Strict, 7d)

## Entities

- **User** (existing): id, email, name, avatar_url, google_id, created_at
- **Session** (implicit via JWT): user_id, access_token, refresh_token, expires_at

## Success Metrics

| Metric | Target |
|--------|--------|
| Login page findability | "Sign In" visible within 2 seconds of landing |
| OAuth completion rate | >80% of users who click "Continue with Google" complete flow |
| Auth guard coverage | 100% of protected routes redirect when unauthenticated |
| Time to login | <10 seconds from clicking "Sign In" to dashboard |

## Acceptance Criteria

- [ ] `/login` page renders with Google OAuth button
- [ ] Landing page navbar shows "Sign In" button
- [ ] Clicking "Sign In" navigates to `/login`
- [ ] "Continue with Google" triggers OAuth flow (or mock in dev)
- [ ] Unauthenticated access to `/dashboard` redirects to `/login`
- [ ] Unauthenticated access to `/tasks/new` redirects to `/login`
- [ ] Authenticated user sees avatar + name in navbar
- [ ] Logout button clears session and redirects to `/`
- [ ] Tokens stored in HttpOnly cookies, not localStorage
