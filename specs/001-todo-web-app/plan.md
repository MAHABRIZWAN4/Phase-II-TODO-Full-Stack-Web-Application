# Implementation Plan: Todo Web Application with User Authentication

**Branch**: `001-todo-web-app` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

## Summary

Transform the Phase I console todo application into a modern full-stack web application with user authentication. Technical approach combines Next.js 16+ frontend with App Router, FastAPI backend with SQLModel ORM, and Neon PostgreSQL database. Architecture follows monorepo pattern with strict separation between frontend/ and backend/ directories. All API endpoints protected by JWT token verification, and every database query filters by user_id to ensure multi-tenant data isolation. Better Auth manages frontend sessions while JWT tokens secure backend API communication.

## Technical Context

**Language/Version**: TypeScript 5.0+ (frontend, strict mode), Python 3.11+ (backend)
**Primary Dependencies**:
  - Frontend: Next.js 16+, React 18+, Better Auth, Tailwind CSS 3.4+
  - Backend: FastAPI 0.104+, SQLModel 0.0.14, Pydantic 2.5+, SQLAlchemy 2.0+
  - Auth: bcrypt 4.1+, python-jose 3.3+ (JWT)
**Storage**: Neon PostgreSQL (serverless, managed connection pooling)
**Testing**: pytest (backend), Jest + React Testing Library (frontend)
**Target Platform**: Vercel (frontend + backend serverless functions)
**Project Type**: Web application (monorepo with frontend/ and backend/ directories)
**Performance Goals**:
  - 95% of API requests complete in <1000ms (p95)
  - Task list renders in <500ms after API response
  - Page load (login, dashboard) in <2000ms
  - Support up to 1000 concurrent users
**Constraints**:
  - JWT token expiry: 7 days
  - Task title max: 200 characters
  - Task description max: 1000 characters
  - Mobile support: 320px minimum screen width
  - Task list pagination: show all tasks (no hard limit per SC-002)
**Scale/Scope**:
  - Expected users: 100-1000 (Phase II MVP)
  - Expected tasks per user: 10-100 typical, up to 1000 supported
  - API endpoints: 7 (authentication + task CRUD)
  - Database tables: 2 (Users, Tasks)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Spec-Driven Development
✅ **PASS**: All implementation follows from spec → plan → tasks hierarchy. This plan establishes the technical approach for implementing the specification's 6 user stories and 30 functional requirements.

### Agent Collaboration
✅ **PASS**: Plan assigns clear responsibilities:
  - Frontend Agent: Next.js components, React state, Tailwind styling
  - Backend Agent: FastAPI endpoints, business logic, validation
  - Database Agent: SQLModel schemas, migrations, Neon DB operations
  - Auth Agent: Better Auth integration, JWT verification, session management
  Each agent operates within its defined domain.

### Reusable Skills
✅ **PASS**: This plan is generated via `/sp.plan` skill. Implementation will proceed via `/sp.tasks` and `/sp.implement` skills.

### User Isolation
✅ **PASS**: All database queries filter by user_id (FR-010, FR-011). Task model includes user_id foreign key with proper indexing. JWT verification middleware prevents cross-user access.

### Security First
✅ **PASS**: JWT tokens verified on ALL protected endpoints (FR-027, FR-028). Passwords hashed with bcrypt (FR-002). SQLModel prevents SQL injection. Input validation with Pydantic and TypeScript. CORS restricted to frontend domain.

### Type Safety
✅ **PASS**: Frontend uses TypeScript strict mode. Backend uses Pydantic models. API contracts typed on both sides. No `any` types permitted without justification.

### Clean Architecture
✅ **PASS**: Clear separation enforced:
  - Presentation: Next.js components/pages
  - Business Logic: FastAPI routes/services layer
  - Data: SQLModel models
  Dependency direction: UI → API → Services → Models. No circular dependencies.

### Test-Driven Development
✅ **PASS**: Plan includes testing strategy. Test coverage requirement (80%+) specified. Tests will be generated in Phase 2 (`/sp.tasks`). API endpoints documented with OpenAPI for contract testing.

**Constitution Check Result**: ✅ ALL GATES PASS - Proceed with Phase 0 and Phase 1

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-web-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── openapi.yaml     # OpenAPI/Swagger spec
│   └── types.ts         # TypeScript API types
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/                                    # Next.js 16+ application
├── app/                                    # App Router directory
│   ├── (auth)/                            # Authentication route group
│   │   ├── login/
│   │   │   └── page.tsx             # Login page (client component)
│   │   └── signup/
│   │       └── page.tsx             # Signup page (client component)
│   ├── dashboard/
│   │   └── page.tsx                 # Main dashboard with task list (server + client)
│   ├── layout.tsx                       # Root layout with Better Auth provider
│   └── page.tsx                         # Landing page (redirect to login/dashboard)
├── components/
│   ├── TaskList.tsx                    # Client component: displays all tasks
│   ├── TaskItem.tsx                    # Client component: single task with actions
│   ├── TaskForm.tsx                    # Client component: add/edit task form
│   ├── DeleteConfirm.tsx                 # Client component: deletion confirmation modal
│   └── ui/                             # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Spinner.tsx
├── lib/
│   ├── api.ts                          # Centralized API client with JWT injection
│   ├── auth.ts                          # Better Auth configuration
│   └── types.ts                         # Shared TypeScript types (from contracts/)
└── middleware.ts                          # Next.js middleware for route protection

backend/                                      # FastAPI application
├── main.py                                # FastAPI app initialization and CORS config
├── models.py                               # SQLModel database models
├── routes/
│   ├── auth.py                            # Authentication endpoints (signup, login)
│   └── tasks.py                           # Task CRUD endpoints
├── middleware/
│   └── jwt_auth.py                         # JWT verification middleware
├── db.py                                   # SQLAlchemy engine and session factory
├── config.py                               # Environment variables and configuration
└── tests/
    ├── test_auth.py                        # Authentication endpoint tests
    └── test_tasks.py                       # Task CRUD endpoint tests

tests/                                         # Integration tests (optional, per spec)
├── contract/                               # API contract tests
│   └── test_api_contracts.py
└── integration/                            # End-to-end integration tests
    └── test_user_journeys.py
```

**Structure Decision**: Monorepo web application structure chosen to align with constitution requirements. Frontend uses Next.js 16+ App Router with TypeScript strict mode and Tailwind CSS. Backend uses FastAPI with SQLModel ORM for type-safe database access. Clear separation maintained: frontend/ for UI components, backend/ for API and business logic. Database models in backend/models.py, API routes in backend/routes/. Shared types contract in specs/contracts/types.ts used by both frontend and backend for type safety.

## Phase 0: Research & Architecture Decisions

See [research.md](./research.md) for detailed findings on:

1. **Token Storage Decision**: localStorage (simpler) vs httpOnly cookies (more secure)
   - **Decision**: httpOnly cookies (more secure)
   - **Rationale**: Prevents XSS token theft, aligns with Security First principle

2. **Task List Display Strategy**: Pagination vs infinite scroll vs show all
   - **Decision**: Show all tasks with virtual scrolling if needed
   - **Rationale**: MVP simplicity, performance acceptable for expected scale (<1000 tasks/user)

3. **Form Editing Behavior**: Inline editing vs modal vs separate page
   - **Decision**: Modal dialog for task editing
   - **Rationale**: Better UX, maintains context, works well on mobile

4. **Delete Confirmation**: Simple confirm() dialog vs custom modal
   - **Decision**: Custom modal with clear action buttons
   - **Rationale**: Better UX, consistent design system, works on all browsers

5. **Error Display**: Toast notifications vs inline messages
   - **Decision**: Toast notifications for API errors, inline for validation errors
   - **Rationale**: Toasts don't interrupt flow for transient errors, inline for field-specific issues

6. **Network Failure Handling**: Retry logic vs show error
   - **Decision**: Exponential backoff retry (3 attempts) then show error
   - **Rationale**: Handles transient network issues without frustrating user

7. **Validation Display**: Field-level vs form-level
   - **Decision**: Field-level validation errors
   - **Rationale**: Clearer UX, user knows exactly what to fix

8. **JWT Token Expiry**: Duration specification
   - **Decision**: 7 days
   - **Rationale**: Balances security and UX (not too frequent re-login)

9. **Refresh Tokens**: Implement or require re-login
   - **Decision**: No refresh tokens for Phase II MVP; users re-login after 7 days
   - **Rationale**: MVP simplicity, adequate for expected usage pattern

10. **Database Connection Pooling**: Strategy for Neon serverless
    - **Decision**: Use SQLAlchemy pool with pool_pre_ping=True
    - **Rationale**: Handles serverless connection lifecycle, prevents stale connections

11. **CORS Configuration**: Same domain vs separate subdomains
    - **Decision**: Same domain (vercel.app) with path-based routing
    - **Rationale**: Simpler deployment, avoids CORS complexity, Vercel supports this pattern

12. **Environment Variables**: Sharing BETTER_AUTH_SECRET between frontend and backend
    - **Decision**: Vercel environment variables (shared across project)
    - **Rationale**: Secure, Vercel-managed, no secret in codebase

13. **Database Migrations**: Manual vs automated in deployment
    - **Decision**: Alembic migrations run via Vercel deploy script
    - **Rationale**: Ensures database schema is always in sync, prevents drift

## Phase 1: Data Model Design

See [data-model.md](./data-model.md) for complete schema including:
- User table (Better Auth managed)
- Task table with foreign key relationships
- Indexes for performance
- Validation rules from functional requirements
- State transition diagrams

## Phase 1: API Contracts

See [contracts/](./contracts/) directory for:
- [openapi.yaml](./contracts/openapi.yaml) - Complete OpenAPI/Swagger specification
- [types.ts](./contracts/types.ts) - TypeScript types matching Pydantic models

**API Endpoints Summary**:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | /api/auth/signup | Create new user account | No |
| POST | /api/auth/login | Login and return JWT | No |
| GET | /api/tasks | Get authenticated user's tasks | Yes |
| POST | /api/tasks | Create new task for user | Yes |
| GET | /api/tasks/{id} | Get specific task (must be owned by user) | Yes |
| PUT | /api/tasks/{id} | Update task (must be owned by user) | Yes |
| DELETE | /api/tasks/{id} | Delete task (must be owned by user) | Yes |
| PATCH | /api/tasks/{id}/complete | Toggle task completion (must be owned by user) | Yes |

**Note**: All endpoints use `/api/` prefix. User ID extracted from JWT token; `{user_id}` not in URL path (removed from spec clarification). This enhances security and reduces API surface.

## Phase 1: Quickstart Guide

See [quickstart.md](./quickstart.md) for developer onboarding including:
- Prerequisites and setup
- Local development environment
- Database configuration
- Running frontend and backend
- Testing workflow
- Common tasks and troubleshooting

## Complexity Tracking

> No constitution violations found; this section not required.

## Architectural Decision Records

This plan includes several architecturally significant decisions:

📋 **Architectural decision detected**: Token storage strategy (httpOnly vs localStorage) impacts security model and implementation. Document reasoning and tradeoffs? Run `/sp.adr token-storage-strategy`

📋 **Architectural decision detected**: Task list display pattern (pagination vs show all) impacts performance and scalability. Document reasoning and tradeoffs? Run `/sp.adr task-list-display-strategy`

📋 **Architectural decision detected**: JWT token expiry and refresh token strategy affects UX and security posture. Document reasoning and tradeoffs? Run `/sp.adr jwt-token-lifecycle`

*(Note: ADRs optional but recommended for significant architectural decisions. Run suggested commands to create ADRs if desired.)*
