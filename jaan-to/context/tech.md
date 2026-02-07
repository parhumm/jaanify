# Technology Stack {#tech-stack}

> Configured for Jaanify — Smart AI Task Manager
> Last Updated: 2026-02-07
> Status: **Initial Stack** — MVP architecture

---

## Current Stack {#current-stack}

### Backend
- **Language**: Node.js (v22.x LTS)
- **Framework**: Fastify v5
- **API Style**: REST + WebSocket for real-time
- **Auth**: JWT + OAuth2 (Google, GitHub)

### Frontend
- **Language**: TypeScript (v5.4)
- **Framework**: React v19 with Next.js v15
- **State Management**: Zustand v5
- **Styling**: TailwindCSS v4

### Mobile
- **Platform**: Android (Kotlin)
- **Architecture**: MVVM + Jetpack Compose
- **Min SDK**: Android 8.0 (API 26)

### Infrastructure
- **Cloud Provider**: AWS (planned)
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **CDN**: CloudFront (planned)

---

## Databases {#databases}

- **Primary**: PostgreSQL 16 (Supabase)
- **Cache**: Redis 7 (Upstash)
- **Search**: Typesense (for task search)
- **Queue**: BullMQ (Redis-backed)

---

## Frameworks {#frameworks}

### Backend Frameworks
- Fastify v5 (REST API)
- Socket.io v4 (real-time task updates)
- Prisma v6 (ORM)
- OpenAI SDK (AI task prioritization)

### Frontend Frameworks
- React v19 with Next.js v15 (App Router)
- Zustand v5 (state management)
- TailwindCSS v4 (styling)
- React Query v5 (server state)

### Testing
- **Unit Testing**: Vitest v3
- **E2E Testing**: Playwright v1.50
- **Component Testing**: Storybook v8

---

## Dependencies {#dependencies}

### Package Management
- **Tool**: pnpm v9
- **Monorepo**: Turborepo

### Key Libraries
- date-fns (date handling)
- zod (validation)
- next-auth (authentication)
- resend (transactional email)

---

## Technical Constraints {#technical-constraints}

**Performance Requirements:**
- API response time: <100ms p95 for read operations
- Real-time sync: <500ms for task state changes
- AI suggestions: <3s for prioritization
- Page load: <2s LCP

**Security Requirements:**
- JWT tokens with 1-hour expiration, refresh tokens
- HTTPS everywhere
- Input sanitization (XSS, SQL injection prevention via Prisma)
- Rate limiting on all API endpoints

**Platform Support:**
- Desktop: Chrome 100+, Firefox 100+, Safari 16+, Edge 100+
- Mobile Web: iOS Safari 16+, Android Chrome 100+
- Native: Android 8.0+ (Kotlin)

---

## Common Patterns {#common-patterns}

- REST API with /api/v1/ prefix
- Repository pattern for data access
- Middleware chain for auth/validation/logging
- Server Actions for form mutations (Next.js)
- Optimistic updates for task operations
