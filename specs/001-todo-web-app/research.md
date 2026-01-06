# Research & Architecture Decisions

**Feature**: Todo Web Application with User Authentication
**Date**: 2026-01-05
**Status**: Complete

## Overview

This document captures research findings and architecture decisions for Phase II implementation. Each decision includes alternatives considered, rationale, and alignment with constitution principles.

## Architecture Decisions

### 1. Token Storage Strategy

**Question**: Should JWT tokens be stored in localStorage or httpOnly cookies?

**Decision**: httpOnly cookies

**Rationale**:
- Prevents XSS attacks that can steal tokens from localStorage
- httpOnly flag ensures JavaScript cannot access cookies, mitigating token theft
- Aligns with Constitution Principle: Security First
- Better Auth has built-in support for httpOnly cookie sessions
- Modern browsers fully support httpOnly cookies

**Alternatives Considered**:
| Alternative | Pros | Cons |
|-------------|------|-------|
| localStorage | Simpler to implement, works in all browsers | Vulnerable to XSS, no httpOnly protection |
| sessionStorage | Cleared on tab close (good UX) | Still vulnerable to XSS attacks |
| httpOnly cookies | Most secure, standard pattern | Requires careful cookie configuration, same-origin requirements |

**Implementation Notes**:
- Better Auth session manager configured with `sessionToken.cookie` strategy
- Cookie attributes: httpOnly, Secure, SameSite=Strict
- Token accessible via Better Auth session client API
- No manual token management needed in frontend components

---

### 2. Task List Display Pattern

**Question**: Should task list use pagination, infinite scroll, or show all tasks?

**Decision**: Show all tasks with virtual scrolling if needed

**Rationale**:
- MVP simplicity - no pagination complexity
- Performance acceptable for expected scale (<1000 tasks per user)
- Better UX for task management - see everything at once
- Aligns with Success Criteria SC-002 (95% of operations <1 second)
- Can add pagination later if performance degrades

**Alternatives Considered**:
| Alternative | Pros | Cons |
|-------------|------|-------|
| Pagination | Better performance for large lists, predictable load times | Poor UX for task scanning, requires navigation state |
| Infinite scroll | Good UX for large datasets, handles unknown sizes | Infinite scroll complexity, no quick way to jump to end |
| Show all | Simplest implementation, best for task scanning | Performance degrades with very large lists |

**Implementation Notes**:
- Frontend renders all tasks in single list component
- Performance monitored via SC-002 (95% operations <1 second)
- If performance threshold breached, implement pagination in Phase II+
- Consider react-virtualized for rendering optimization if tasks exceed 100

---

### 3. Form Editing Behavior

**Question**: Should task editing use inline editing, modal dialog, or separate page?

**Decision**: Modal dialog

**Rationale**:
- Maintains context - user sees task list while editing
- Better UX on mobile - modals work well on small screens
- Faster than page navigation - no full page reload
- Consistent with deletion confirmation (also modal)
- Tailwind CSS has excellent modal component support

**Alternatives Considered**:
| Alternative | Pros | Cons |
|-------------|------|-------|
| Inline editing | Very fast, maintains exact context | Complex to implement with forms, mobile UX issues |
| Modal dialog | Good balance of speed and context | Requires modal state management |
| Separate page | Maximum space for form, familiar pattern | Loses context, slower navigation, mobile awkward |

**Implementation Notes**:
- Use TaskForm.tsx component for both create and edit (reusable)
- Modal uses z-index overlay with backdrop
- Form validation errors displayed inline within modal
- Cancel button closes modal without saving

---

### 4. Delete Confirmation UX

**Question**: Should deletion confirmation use simple confirm() dialog or custom modal?

**Decision**: Custom modal with clear action buttons

**Rationale**:
- Custom modal consistent with design system
- Better UX - styled, actionable, with clear warnings
- Works consistently across browsers (confirm() styling varies)
- Mobile-friendly - native alerts can be small/difficult
- Aligns with Clean Architecture principle (consistent UI)

**Alternatives Considered**:
| Alternative | Pros | Cons |
|-------------|------|-------|
| confirm() dialog | Simplest implementation | Browser-dependent styling, poor mobile UX |
| Custom modal | Consistent design, better UX | More code to implement |
| No confirmation | Fastest operation | High risk of accidental deletions |

**Implementation Notes**:
- Reusable DeleteConfirm.tsx component
- Styled with danger color (red) for delete action
- Clear message: "Are you sure you want to delete this task?"
- Two buttons: Cancel (secondary), Delete (danger/primary)
- Optional: "Don't show this again" checkbox for power users

---

### 5. Error Display Strategy

**Question**: Should errors show as toast notifications or inline messages?

**Decision**: Toast notifications for API errors, inline for validation errors

**Rationale**:
- API errors (network, server) don't need to interrupt user flow → toast
- Validation errors are field-specific → inline is clearer
- Toasts stack nicely for multiple errors
- Aligns with field-level validation requirement (clarification Q7)
- Common pattern in modern web applications

**Alternatives Considered**:
| Alternative | Pros | Cons |
|-------------|------|-------|
| Toast only | Consistent error UX | Field-specific validation harder to understand |
| Inline only | Very clear what field is wrong | API errors feel intrusive |
| Toast + inline | Best of both approaches | Slightly more complex |

**Implementation Notes**:
- Use react-hot-toast or similar lightweight toast library
- Toast configuration: auto-dismiss after 5s, closeable
- Validation errors: red border + text below input field
- Error types defined in contracts/types.ts

---

### 6. Network Failure Handling

**Question**: Should network failures use retry logic or show error immediately?

**Decision**: Exponential backoff retry (3 attempts) then show error

**Rationale**:
- Handles transient network issues without frustrating user
- Vercel serverless functions can have cold starts (first request slow)
- 3 retries is reasonable limit (not infinite loops)
- Final error displayed clearly with what went wrong
- Aligns with Success Criteria SC-002 (95% operations <1 second)

**Alternatives Considered**:
| Alternative | Pros | Cons |
|-------------|------|-------|
| Show error immediately | Transparent, user knows issue immediately | Frustrating for transient issues, poor UX |
| Retry indefinitely | Maximum success rate | Can hang, poor UX, resource waste |
| Exponential backoff | Balances UX and success rate | Slightly more complex |

**Implementation Notes**:
- Retry only on: 5xx server errors, network errors, timeouts
- Do NOT retry on: 4xx client errors (validation, auth failures)
- Backoff pattern: 100ms, 300ms, 900ms (multiply by 3 each retry)
- Retry logic centralized in lib/api.ts API client
- Final error shows toast with details and retry option

---

### 7. Validation Error Display

**Question**: Should validation errors be field-level or form-level?

**Decision**: Field-level validation errors

**Rationale**:
- Clearer UX - user knows exactly which field has error
- Standard pattern expected by modern web users
- Works well with Tailwind CSS error styling
- Aligns with SC-006 requirement ("inline and clearly explain")

**Alternatives Considered**:
| Alternative | Pros | Cons |
|-------------|------|-------|
| Field-level | Very clear, easy to fix | More markup, requires form state |
| Form-level | Simpler to implement | Unclear which field has error |

**Implementation Notes**:
- Each input component (Input.tsx, TaskForm.tsx) displays its own errors
- Validation errors: red text below input, red input border
- Shake animation on invalid form submission (visual feedback)
- Form disabled until all validation errors resolved

---

### 8. JWT Token Expiry Duration

**Question**: How long should JWT tokens be valid?

**Decision**: 7 days

**Rationale**:
- Balances security and UX (not too frequent re-login)
- Industry standard for web applications
- Long enough for typical usage patterns (daily users)
- Short enough to limit damage if token is compromised
- Allows users to stay logged in across multiple sessions

**Alternatives Considered**:
| Duration | Pros | Cons |
|----------|------|-------|
| 1 day | Very secure | Frustrating for frequent users |
| 7 days | Good balance | Tokens valid for week if compromised |
| 30 days | Great UX | Larger security window for compromised tokens |

**Implementation Notes**:
- JWT payload includes `exp` field with timestamp
- Backend validates expiry on every request
- Frontend Better Auth session manager handles token refresh
- User redirected to login when token expires
- "Remember me" option could extend to 30 days (future enhancement)

---

### 9. Refresh Token Strategy

**Question**: Should we implement refresh tokens or require re-login after expiry?

**Decision**: No refresh tokens for Phase II MVP; users re-login after 7 days

**Rationale**:
- MVP simplicity - reduces complexity
- 7-day expiry is reasonable balance
- No refresh tokens means less attack surface
- Can add refresh tokens in Phase II+ if UX requires it
- Aligns with Out of Scope (no advanced auth features)

**Alternatives Considered**:
| Approach | Pros | Cons |
|----------|------|-------|
| Refresh tokens | Better UX (no forced re-login) | More complexity, additional attack surface |
| Re-login after expiry | Simpler, more secure | Users must re-login weekly |

**Implementation Notes**:
- JWT is single-use token (no refresh)
- User redirected to login page on expiry (401 Unauthorized)
- Session cookie cleared automatically
- Token contains user_id for immediate extraction
- Consider refresh tokens in future if user feedback indicates need

---

### 10. Database Connection Pooling

**Question**: What connection pooling strategy for Neon serverless PostgreSQL?

**Decision**: SQLAlchemy pool with pool_pre_ping=True

**Rationale**:
- Serverless functions need robust connection management
- pool_pre_ping=True prevents stale connections
- Neon supports connection pooling natively
- SQLAlchemy pool is well-tested, production-ready
- Aligns with Constitution Principle (no manual database queries)

**Alternatives Considered**:
| Strategy | Pros | Cons |
|----------|------|-------|
| SQLAlchemy pool | Proven, well-documented | Requires configuration |
| Single connection | Simplest | Stale connections, connection leaks |
| External pooling service | Offloaded complexity | Additional dependency, cost |

**Implementation Notes**:
```python
# backend/db.py
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600,  # Recycle after 1 hour
    echo=False
)
```
- Pool size 5 for serverless (small footprint)
- Vercel serverless functions can spin up to 20 concurrent
- Monitoring in place for connection pool metrics

---

### 11. CORS Configuration

**Question**: Should frontend and backend be on same domain or separate subdomains?

**Decision**: Same domain (vercel.app) with path-based routing

**Rationale**:
- Vercel supports rewrites for API routing to backend functions
- Simpler deployment - single Vercel project
- No CORS complexity needed
- Better performance (no preflight requests)
- Aligns with Project Constraints (Vercel deployment)

**Alternatives Considered**:
| Strategy | Pros | Cons |
|----------|------|-------|
| Same domain (vercel.app) | Simplest, no CORS | Requires Vercel rewrites configuration |
| Separate subdomains | Clear separation | CORS complexity, multiple projects |
| Separate domains | Maximum separation | CORS complexity, multiple projects |

**Implementation Notes**:
```typescript
// frontend/vercel.json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ]
}
```
- Frontend at `app.vercel.app`
- API routes at `app.vercel.app/api/*`
- Vercel rewrites `/api/*` to backend functions
- FastAPI CORS configured for same-origin only
- No additional CORS headers needed

---

### 12. Environment Variable Sharing

**Question**: How to share BETTER_AUTH_SECRET between frontend and backend?

**Decision**: Vercel environment variables (shared across project)

**Rationale**:
- Vercel Environment Variables UI supports project-wide secrets
- Secure - never committed to codebase
- Accessible to both frontend build and backend runtime
- Supports preview environments (dev, staging, prod)
- Aligns with Constitution: Secrets MUST be in env vars

**Alternatives Considered**:
| Strategy | Pros | Cons |
|----------|------|-------|
| Vercel env vars | Native, secure, supports environments | Requires Vercel Pro for some features |
| .env files | Simple, works locally | Risk of committing secrets, deployment complexity |
| Secret management service | Enterprise-grade | Overkill for MVP, cost, complexity |

**Implementation Notes**:
```bash
# Vercel Environment Variables
BETTER_AUTH_SECRET=your-secret-here
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET_KEY=your-jwt-secret
```
- `.env.example` documents all required variables
- `.env` in `.gitignore` (never committed)
- Better Auth reads from `process.env.BETTER_AUTH_SECRET`
- Backend reads from `os.getenv("BETTER_AUTH_SECRET")`
- Preview environments have separate secrets

---

### 13. Database Migration Strategy

**Question**: Should migrations be manual or automated in deployment pipeline?

**Decision**: Alembic migrations run via Vercel deploy script

**Rationale**:
- Ensures database schema is always in sync with code
- Prevents manual errors and schema drift
- Alembic is SQLAlchemy's migration tool (integrated)
- Can run migrations atomically (roll back if fail)
- Aligns with Quality Standards (migration automation)

**Alternatives Considered**:
| Strategy | Pros | Cons |
|----------|------|-------|
| Automated via deploy | Consistency, no manual steps | Requires migration script setup |
| Manual | Full control | Human error risk, schema drift possible |
| Cloud-native migrations | Platform-managed | Vendor lock-in, limited flexibility |

**Implementation Notes**:
```bash
# Vercel deploy script
vercel deploy --prod && python -m alembic upgrade head
```
- Alembic configuration: `backend/alembic.ini`
- Migration files tracked: `backend/alembic/versions/`
- Downgrade supported: `alembic downgrade base`
- Migration status logged in deployment output
- Rollback plan: if migration fails, revert code deployment

---

## Technology Stack Validation

### Frontend Stack
| Technology | Version | Purpose | Status |
|------------|--------|---------|--------|
| Next.js | 16+ | React framework, SSR, App Router | ✅ Required by Constitution |
| React | 18+ | UI library | ✅ Latest stable |
| TypeScript | 5.0+ | Type safety | ✅ Required by Constitution |
| Tailwind CSS | 3.4+ | Styling | ✅ Required by Constitution |
| Better Auth | Latest | Authentication | ✅ Required by Constitution |

### Backend Stack
| Technology | Version | Purpose | Status |
|------------|--------|---------|--------|
| FastAPI | 0.104+ | Web framework | ✅ Required by Constitution |
| SQLModel | 0.0.14+ | ORM, type safety | ✅ Required by Constitution |
| Pydantic | 2.5+ | Validation | ✅ Required by Constitution |
| SQLAlchemy | 2.0+ | Database core | ✅ SQLModel dependency |
| python-jose | 3.3+ | JWT handling | ✅ Chosen for JWT |
| bcrypt | 4.1+ | Password hashing | ✅ Chosen for security |

### Database
| Technology | Version | Purpose | Status |
|------------|--------|---------|--------|
| Neon PostgreSQL | Latest | Managed database | ✅ Required by Constitution |
| Alembic | Latest | Migrations | ✅ Recommended |

### Deployment
| Technology | Purpose | Status |
|------------|---------|--------|
| Vercel | Frontend + backend hosting | ✅ Required by Constitution |
| Vercel Serverless Functions | Backend runtime | ✅ Chosen for deployment |

## Constitution Compliance Summary

✅ **Spec-Driven Development**: All decisions flow from spec requirements
✅ **Agent Collaboration**: Each agent has clear responsibilities defined
✅ **Reusable Skills**: Research documents decisions for `/sp.tasks` execution
✅ **User Isolation**: All queries filter by user_id, JWT verification on endpoints
✅ **Security First**: httpOnly cookies, bcrypt hashing, CORS restricted
✅ **Type Safety**: TypeScript strict mode, Pydantic models, typed API contracts
✅ **Clean Architecture**: Clear separation (UI/API/Models), no circular dependencies
✅ **Test-Driven**: Testing strategy defined, 80%+ coverage requirement

## Next Steps

1. Create data model: [data-model.md](./data-model.md)
2. Define API contracts: [contracts/openapi.yaml](./contracts/openapi.yaml)
3. Generate TypeScript types: [contracts/types.ts](./contracts/types.ts)
4. Create quickstart guide: [quickstart.md](./quickstart.md)
5. Update agent context with new technologies
6. Generate implementation tasks: `/sp.tasks`
