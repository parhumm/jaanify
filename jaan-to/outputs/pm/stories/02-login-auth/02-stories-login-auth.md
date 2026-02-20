# User Stories: Login/Auth UX Fix

> ID: STORIES-02 | Generated: 2026-02-20 | Skill: pm-story-write | Cycle 13
> PRD: 02-prd-login-auth.md

---

## US-08: Login Page with Google OAuth

**As a** new or returning user,
**I want** a dedicated login page with a "Continue with Google" button,
**So that** I can sign in quickly without typing passwords.

### Acceptance Criteria

```gherkin
Given I navigate to /login
When the page loads
Then I see the Jaanify logo and a "Continue with Google" button
And I see a "Try without account" link below

Given I click "Continue with Google"
When Google OAuth consent screen appears and I authorize
Then I am redirected to /dashboard with my session active
And my profile picture appears in the navbar

Given I click "Try without account"
When I am redirected to /onboarding
Then I can create tasks without signing in
```

**Priority**: P0 | **Effort**: M | **Feature**: F-01, F-05

---

## US-09: Landing Page Sign-In Button

**As a** returning user visiting the landing page,
**I want** to see a "Sign In" button in the navbar,
**So that** I can access my account without going through onboarding again.

### Acceptance Criteria

```gherkin
Given I am on the landing page (/)
When the page loads
Then I see "Sign In" in the top-right navbar next to "Get Started"

Given I am already authenticated
When I visit the landing page
Then I see my avatar instead of "Sign In"
And clicking my avatar navigates to /dashboard

Given I click "Sign In"
When I am not authenticated
Then I am navigated to /login
```

**Priority**: P0 | **Effort**: S | **Feature**: F-02

---

## US-10: Auth Guard on Protected Routes

**As a** product owner,
**I want** unauthenticated users redirected to login when accessing protected routes,
**So that** user data is protected and login is enforced.

### Acceptance Criteria

```gherkin
Given I am not authenticated
When I navigate to /dashboard
Then I am redirected to /login?redirect=/dashboard

Given I am not authenticated
When I navigate to /tasks/new
Then I am redirected to /login?redirect=/tasks/new

Given I complete login from /login?redirect=/dashboard
When authentication succeeds
Then I am redirected to /dashboard (not the default page)

Given I am authenticated
When I navigate to /dashboard
Then the page loads normally without redirect
```

**Priority**: P0 | **Effort**: S | **Feature**: F-03

---

## US-11: Session State in Navbar

**As an** authenticated user,
**I want** to see my profile picture and name in the navbar,
**So that** I know I'm logged in and can access account options.

### Acceptance Criteria

```gherkin
Given I am authenticated
When any page loads
Then the navbar shows my Google profile picture and display name
And a dropdown menu is available with "Dashboard" and "Sign Out"

Given I click "Sign Out"
When the logout API call succeeds
Then my session is cleared
And I am redirected to /
And the navbar shows "Sign In" again
```

**Priority**: P1 | **Effort**: M | **Feature**: F-04, F-06

---

## US-12: Secure Token Management

**As a** security-conscious user,
**I want** my authentication tokens stored securely in HttpOnly cookies,
**So that** my session cannot be stolen by XSS attacks.

### Acceptance Criteria

```gherkin
Given the backend returns authentication tokens
When the response is processed
Then tokens are set via Set-Cookie header with HttpOnly, Secure, SameSite flags
And no tokens are stored in localStorage

Given my access token expires
When I make an API request
Then the refresh token is used automatically to get a new access token
And I am not redirected to login
```

**Priority**: P1 | **Effort**: M | **Feature**: F-07
