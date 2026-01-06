---
id: 001
title: Initialize AGENTS.md for Phase II
stage: general
date: 2026-01-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: AGENTS.md file creation
labels: ["setup","monorepo","workflow"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - AGENTS.md
tests:
---

## Prompt

I'm starting Phase II: Full-Stack Web Application (Monorepo with Frontend + Backend).

Create AGENTS.md file in root directory with:

1. Project Overview: Phase II Todo App - Full-stack with Next.js + FastAPI + Neon DB
2. Spec-Kit Structure: Explain /specs folder organization (features, api, database, ui)
3. Workflow Rules:
   - Specify → Plan → Tasks → Implement
   - No code without Task ID
   - Constitution > Specify > Plan > Tasks hierarchy
4. Subagents Section: We will use specialized subagents (frontend, backend, database, auth)
5. Skills Section: We will use reusable skills (deploy, api creation, migrations, testing)
6. Technology Stack:
   - Frontend: Next.js 16+, TypeScript, Tailwind, Better Auth
   - Backend: FastAPI, SQLModel
   - Database: Neon PostgreSQL
7. Monorepo Structure: frontend/ and backend/ folders

Create this file now.

## Response snapshot

Created AGENTS.md with complete project documentation including:
- Project Overview: Full-stack Todo App with Next.js + FastAPI + Neon DB
- Spec-Kit Structure: Organized specs/ folder with features, api, database, ui subdirectories
- Workflow Rules: Specify → Plan → Tasks → Implement flow with critical rules about Task IDs and hierarchy
- Subagents: Specialized agents for frontend, backend, database, and auth
- Skills: Reusable skills including specify, plan, tasks, implement, adr, phr, and taskstoissues
- Technology Stack: Detailed breakdown of frontend (Next.js 16+, TS, Tailwind, Better Auth), backend (FastAPI, SQLModel), database (Neon PostgreSQL)
- Monorepo Structure: Complete directory layout showing frontend/, backend/, specs/, .specify/, and history/ folders

## Outcome

- ✅ Impact: Established project guidelines and workflow documentation for Phase II development
- 🧪 Tests: N/A (documentation only)
- 📁 Files: Created AGENTS.md (1 file)
- 🔁 Next prompts: Ready to begin feature specification with /sp.specify
- 🧠 Reflection: Successfully initialized agent documentation for monorepo structure. PHR created as required.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
