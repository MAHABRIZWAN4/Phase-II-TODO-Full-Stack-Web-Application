# AGENTS.md - Phase II Project Guide

## Project Overview

**Phase II Todo App** - A full-stack web application built as a monorepo with the following architecture:

- **Frontend**: Next.js 16+ with TypeScript, Tailwind CSS, and Better Auth
- **Backend**: FastAPI with SQLModel for type-safe database interactions
- **Database**: Neon PostgreSQL (managed Postgres service)
- **Architecture**: Monorepo with separate `frontend/` and `backend/` directories

## Spec-Kit Structure

The `/specs` folder contains all specification documents organized by domain:

```
specs/
├── features/          # User-facing features (auth, todos, lists)
├── api/              # API contracts and endpoints
├── database/         # Database schemas and migrations
└── ui/               # Component specifications and UX patterns
```

Each feature has four key artifacts:
- `spec.md` - Feature requirements and acceptance criteria
- `plan.md` - Architecture and design decisions
- `tasks.md` - Implementation tasks with test cases
- (Optional) `tests.md` - Detailed test specifications

## Workflow Rules

### Spec-Driven Development Flow

1. **Specify** (`/sp.specify`) - Create feature requirements
2. **Plan** (`/sp.plan`) - Design architecture and approach
3. **Tasks** (`/sp.tasks`) - Generate testable implementation tasks
4. **Implement** (`/sp.implement`) - Execute all tasks

### Critical Rules

- **No code without Task ID**: All code changes must reference a specific task from `tasks.md`
- **Constitution > Specify > Plan > Tasks**: Hierarchy must be strictly followed
  - Constitution sets overall principles
  - Specifications define what to build
  - Plans define how to build it
  - Tasks define implementation steps
- **Small, testable changes**: Each task should be independently verifiable
- **PHR Creation**: Every user interaction must be recorded as a Prompt History Record

### Decision Making

- Use `/sp.adr` for architecturally significant decisions
- Always reference code with file paths and line numbers (e.g., `src/main.ts:42`)
- Prefer smallest viable change over refactoring
- Ask clarifying questions when requirements are ambiguous

## Subagents

We use specialized subagents for focused development work:

- **Frontend Agent**: Next.js components, React state, Tailwind styling
- **Backend Agent**: FastAPI endpoints, business logic, validation
- **Database Agent**: SQLModel schemas, migrations, Neon DB operations
- **Auth Agent**: Better Auth integration, session management, security

Each subagent should only operate within its domain and cross-cut through the `/sp.*` skills.

## Skills

Reusable skills for common workflows:

- `/sp.specify` - Create or update feature specifications
- `/sp.plan` - Generate architectural design and implementation plans
- `/sp.tasks` - Convert plans into actionable task lists
- `/sp.implement` - Execute all tasks from tasks.md
- `/sp.adr` - Create Architecture Decision Records
- `/sp.phr` - Record Prompt History Records for traceability
- `/sp.taskstoissues` - Convert tasks to GitHub issues

## Technology Stack

### Frontend
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **State Management**: React Context / Server Components

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLModel (type-safe SQLAlchemy wrapper)
- **Validation**: Pydantic
- **API Documentation**: Auto-generated OpenAPI/Swagger

### Database
- **Provider**: Neon PostgreSQL
- **Connection**: Serverless, auto-scaling
- **ORM**: SQLModel with SQLAlchemy Core

## Monorepo Structure

```
phase-II/
├── frontend/              # Next.js application
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── public/           # Static assets
├── backend/              # FastAPI application
│   ├── app/              # Application modules
│   ├── models/           # SQLModel schemas
│   ├── api/              # API routes
│   └── tests/            # Backend tests
├── specs/                # Specification documents
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
├── .specify/            # SpecKit Plus configuration
│   ├── templates/       # Document templates
│   ├── memory/          # Constitution and shared context
│   └── scripts/         # Automation scripts
├── history/             # PHRs and ADRs
│   ├── prompts/         # Prompt History Records
│   └── adr/             # Architecture Decision Records
└── AGENTS.md           # This file

```

## Getting Started

1. **Initialize a feature**: `/sp.specify <feature-name>`
2. **Plan the architecture**: `/sp.plan`
3. **Generate tasks**: `/sp.tasks`
4. **Implement**: `/sp.implement`
5. **Commit and PR**: `/sp.git.commit_pr`

## Important Reminders

- Always read existing code before modifying
- Reference files with `path:line` format
- Create PHRs after every major interaction
- Suggest ADRs for significant architectural decisions
- Keep changes small and testable
- Never assume - verify with MCP tools or CLI commands
