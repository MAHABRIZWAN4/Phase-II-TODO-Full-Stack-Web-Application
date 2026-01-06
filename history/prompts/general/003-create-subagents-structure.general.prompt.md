---
id: 003
title: Create subagents configuration files
stage: general
date: 2026-01-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: Create 4 subagent configuration files
labels: ["setup","subagents","configuration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/subagents/frontend-agent.md
 - .claude/subagents/backend-agent.md
 - .claude/subagents/database-agent.md
 - .claude/subagents/auth-agent.md
tests:
---

## Prompt

Create subagents folder structure:

mkdir -p .claude/subagents

Create 4 subagent files:

1. .claude/subagents/frontend-agent.md
   - Role: Next.js 16+ App Router specialist
   - Tech: TypeScript, Tailwind CSS, React Server Components
   - Responsibilities: UI components, pages, client-side logic

2. .claude/subagents/backend-agent.md
   - Role: FastAPI Python specialist
   - Tech: FastAPI, Pydantic, async/await
   - Responsibilities: REST API endpoints, business logic, JWT verification

3. .claude/subagents/database-agent.md
   - Role: Database and ORM specialist
   - Tech: SQLModel, Neon PostgreSQL, migrations
   - Responsibilities: Schema design, queries, data models

4. .claude/subagents/auth-agent.md
   - Role: Authentication specialist
   - Tech: Better Auth, JWT tokens
   - Responsibilities: User signup/signin, token generation, session management

Each file should contain:
- Agent role and expertise
- Technology focus
- Coding patterns and best practices
- How to interact with other agents

Create this file now.

## Response snapshot

Created `.claude/subagents/` directory and 4 subagent configuration files:

1. **frontend-agent.md**: Next.js 16+ App Router specialist with TypeScript, Tailwind, and Server Components patterns. Includes coding patterns for Server/Client Components, Server Actions, API client, and protected routes.

2. **backend-agent.md**: FastAPI specialist with async/await patterns. Includes route definitions, Pydantic models, service layers, error handling, dependency injection, and authentication patterns.

3. **database-agent.md**: SQLModel and Neon PostgreSQL specialist. Includes model patterns, async queries, migration scripts with Alembic, complex queries with joins, and transaction patterns.

4. **auth-agent.md**: Authentication specialist with Better Auth and JWT. Includes password hashing (bcrypt), JWT token generation/verification, user registration/login patterns, and secure token storage.

All files include integration guidelines with other agents, file organization, common patterns, testing approaches, and best practices.

## Outcome

- ✅ Impact: Established specialized subagent configurations for Phase II development
- 🧪 Tests: N/A (configuration files only)
- 📁 Files: Created 4 subagent configuration files in .claude/subagents/
- 🔁 Next prompts: Ready to begin feature specification with /sp.specify
- 🧠 Reflection: Successfully created comprehensive subagent documentation covering all key domains (frontend, backend, database, auth) with detailed coding patterns and integration guidelines.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
