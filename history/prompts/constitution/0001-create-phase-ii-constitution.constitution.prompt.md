---
id: 0001
title: Create Phase II constitution
stage: constitution
date: 2026-01-05
surface: agent
model: claude-sonnet-4.5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["constitution","setup","governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - (none)
---

## Prompt

Create Phase II constitution with:

PROJECT: Todo Full-Stack Web Application (Monorepo)

PURPOSE:
Transform Phase I console app into a modern multi-user web application with persistent database storage and authentication.

TECH STACK:
Frontend:
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth for authentication

Backend:
- Python FastAPI
- SQLModel ORM
- Async/await patterns
- JWT token verification

Database:
- Neon Serverless PostgreSQL
- Multi-tenant data isolation

Architecture:
- Monorepo structure (frontend/ and backend/)
- RESTful API with JSON responses
- JWT-based authentication
- User-specific data filtering

CORE PRINCIPLES:
1. Spec-Driven Development - No manual coding without specs
2. Agent Collaboration - Use specialized subagents for each layer
3. Reusable Skills - Leverage skills for common tasks
4. User Isolation - Every user sees only their own data
5. Security First - JWT verification on all endpoints
6. Type Safety - TypeScript frontend, Pydantic backend
7. Clean Architecture - Clear separation of concerns
8. Test-Driven - Tests before deployment

DEVELOPMENT WORKFLOW:
- Constitution defines principles
- Specify defines features
- Plan defines architecture
- Tasks break down implementation
- Subagents implement with skills
- Tests validate everything

QUALITY STANDARDS:
- 80%+ code coverage
- No hardcoded values (use env variables)
- Proper error handling everywhere
- Consistent naming conventions
- Documentation for all APIs
- Responsive mobile-first UI

CONSTRAINTS:
- Deployment target: Vercel (frontend + backend)
- Database: Neon PostgreSQL only
- Authentication: Better Auth + JWT only
- No manual database queries (use SQLModel)
- No inline styles (Tailwind only)

## Response snapshot

Created Phase II constitution (version 1.0.0) with:
- 8 core principles: Spec-Driven Development, Agent Collaboration, Reusable Skills, User Isolation, Security First, Type Safety, Clean Architecture, Test-Driven Development
- Technology stack defined for frontend (Next.js, TypeScript, Tailwind, Better Auth), backend (FastAPI, SQLModel), and database (Neon PostgreSQL)
- Development workflow with Spec-Kit flow and agent-based execution
- Quality standards for code coverage (80%+), code quality, documentation, and performance
- Project constraints on deployment, authentication, database access, styling, and code organization
- Governance section with amendment process, compliance review, and enforcement rules

## Outcome

- ✅ Impact: Constitution established as foundation for all development decisions, defining immutable hierarchy (Constitution → Specification → Plan → Tasks → Implementation)
- 🧪 Tests: No tests required for constitution creation
- 📁 Files: Created .specify/memory/constitution.md with version 1.0.0, Sync Impact Report included
- 🔁 Next prompts: Ready for feature specification (/sp.specify) to begin Spec-Kit workflow
- 🧠 Reflection: All 8 principles align with monorepo full-stack architecture. Templates verified for consistency with new constitution.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (constitution governance document)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): None - constitution is stable foundation
