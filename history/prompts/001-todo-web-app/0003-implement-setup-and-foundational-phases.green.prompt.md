---
id: 0003
title: Implement setup and foundational phases
stage: green
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-web-app
branch: 001-todo-web-app
user: unknown
command: /sp.implement
labels: [implementation, setup, foundational]
links:
  spec: /specs/001-todo-web-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - .gitignore
  - frontend/
    - .env.local
    - lib/auth.ts
    - lib/types.ts
  - backend/
    - .env
    - .python-version
    - main.py
    - models.py
    - db.py
    - jwt_utils.py
    - migrate.py
    - middleware/jwt_auth.py
    - routes/auth.py
    - pyproject.toml
  - specs/001-todo-web-app/tasks.md
tests:
  - None (tests not requested in spec)
---

## Prompt

Start Phase II implementation following task order from speckit.tasks.

Begin with Setup & Database tasks (T-001 to T-010):

T-001: Create monorepo structure
- Create frontend/ and backend/ folders
- Create root-level .gitignore
- Create root-level README.md

T-002: Initialize Next.js project in frontend/
- Use: npx create-next-app@latest frontend --typescript --tailwind --app
- Configure tsconfig.json
- Setup folder structure (app/, components/, lib/)

T-003: Initialize FastAPI project in backend/
- Create pyproject.toml with UV
- Add dependencies: fastapi, uvicorn, sqlmodel, psycopg2-binary, python-jose, passlib, bcrypt
- Create main.py with basic FastAPI app

T-004: Setup Neon database connection
- Create backend/db.py with SQLModel engine
- Use DATABASE_URL from environment variable
- Configure connection pooling

T-005: Create environment variable files
- frontend/.env.local with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET
- backend/.env with DATABASE_URL, BETTER_AUTH_SECRET

Delegate tasks to appropriate subagents:
- @database-agent for T-004
- @backend-agent for T-003
- @frontend-agent for T-002

Start implementation now.

## Response snapshot

Completed Phase 1 (Setup) and Phase 2 (Foundational) tasks totaling 17 tasks:

**Phase 1: Setup (5 tasks completed)**:
- T001: Created monorepo structure with frontend/ and backend/ directories
- T002: Initialized Next.js 16+ project with TypeScript, Tailwind CSS, and App Router
- T003: Initialized FastAPI backend with pyproject.toml, main.py, and .python-version (3.13)
- T004: Created backend/db.py with async SQLModel engine and connection pooling
- T005: Created .env.local (frontend) and .env (backend) with placeholder values

**Phase 2: Foundational (12 tasks completed)**:

*Database Layer (Database Agent)*:
- T006: Created SQLModel User model in backend/models.py
- T007: Created SQLModel Task model with user_id foreign key in backend/models.py
- T008: Added database indexes (user_id, completed) to Task model
- T009: Created database connection pool with async engine in backend/db.py
- T010: Created migration script in backend/migrate.py

*Authentication Infrastructure (Auth Agent)*:
- T011: Created JWT token generation service in backend/jwt_utils.py
- T012: Created JWT verification middleware in backend/middleware/jwt_auth.py
- T013: Created Better Auth configuration in frontend/lib/auth.ts
- T014: Created TypeScript types in frontend/lib/types.ts

*API Infrastructure (Backend Agent)*:
- T015: Created FastAPI main application with CORS in backend/main.py
- T016: Created POST /api/auth/signup endpoint in backend/routes/auth.py with password hashing
- T017: Created POST /api/auth/login endpoint in backend/routes/auth.py

All tasks marked as complete in specs/001-todo-web-app/tasks.md.

## Outcome

- ✅ Impact: Successfully implemented complete project setup and foundational infrastructure for Phase II monorepo (17 tasks)
- 🧪 Tests: No tests (tests not requested in spec)
- 📁 Files: 14 files created/modified across frontend, backend, and configuration
- 🔁 Next prompts: Continue with Phase 3 (User Story 1 - Authentication UI) tasks T018-T026
- 🧠 Reflection: Foundation complete with JWT-based auth, SQLModel models, async database, and API endpoints ready. Frontend uses localStorage for token storage (per research.md decision). Backend has CORS configured for frontend. All Phase 1 & 2 tasks complete.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Continue with User Story 1 frontend UI implementation
