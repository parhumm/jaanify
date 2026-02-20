# Research: Login/Auth UX for Jaanify

> Generated: 2026-02-20 | Skill: pm-research-about | Cycle 13
> jaan-to: v7.2.0 (SHA: 3c10276)

---

## Research Question

Best practices for login/auth UX in Next.js 15 App Router with Google OAuth, including auth guards, session management, and neurodivergent-friendly login flows.

---

## Key Findings

### 1. Next.js 15 Auth Architecture (2025-2026)

**Recommended stack**: Auth.js (NextAuth v5) or custom JWT with `jose` library.

**Defense-in-depth pattern** (critical after CVE-2025-29927):
- Middleware: First-line route protection, redirect unauthenticated users
- Data Access Layer (DAL): Verify session at every data access point
- Client state (Zustand): UI-level auth display (user avatar, role-based UI)

**Middleware pattern** for `middleware.ts`:
```typescript
export function middleware(request) {
  const token = request.cookies.get('session')?.value;
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
export const config = { matcher: ['/dashboard/:path*', '/tasks/:path*'] };
```

### 2. Google OAuth Best Practices

- Use `app/api/auth/[...nextauth]/route.ts` for Auth.js integration
- Or custom route calling backend `/auth/google` endpoint (Jaanify pattern)
- Store tokens in HttpOnly cookies (NOT localStorage — current Jaanify vulnerability)
- Support popup and redirect flows for OAuth

### 3. Neurodivergent-Friendly Auth (WCAG 2.2 SC 3.3.8)

**WCAG 3.3.8 Accessible Authentication (Minimum)**:
- No cognitive function tests required for login
- Support password managers and autofill
- Allow copy-paste in all fields
- No CAPTCHAs without alternatives

**ADHD-specific patterns**:
- Clean, minimal login page with one clear CTA
- Large "Continue with Google" button (reduces typing)
- "Skip for now" option that creates guest session
- No time limits on login forms
- Show/hide password toggle
- Use email instead of usernames
- Save form state if session expires during login

**Recommended login hierarchy for Jaanify**:
1. **Primary**: "Continue with Google" (one-click, no typing)
2. **Secondary**: Email magic link (minimal typing)
3. **Fallback**: Email + password (with autofill support)
4. **Guest**: "Try without account" (60-second onboarding)

### 4. Session Management with Zustand

- Zustand store holds client-side auth state (user info, avatar, role)
- Hydrate from cookie/API on app mount
- Middleware handles server-side protection
- Client store handles UI reactivity (show/hide nav items)

---

## Sources

- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [WorkOS Next.js App Router Auth Guide 2026](https://workos.com/blog/nextjs-app-router-authentication-guide-2026)
- [WCAG 2.2 SC 3.3.8 Accessible Authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)
- [Auth0 WCAG 3.3.8 Guide](https://auth0.com/blog/an-accessible-guide-to-wcag-3-3-8-authentication-without-frustration/)
- [Smashing Magazine: Designing for Neurodiversity](https://www.smashingmagazine.com/2025/06/designing-for-neurodiversity/)
- [UXPA: Designing for ADHD](https://uxpa.org/designing-for-adhd-in-ux/)
- [Authgear: Login UX 2025 Guide](https://www.authgear.com/post/login-signup-ux-guide)
