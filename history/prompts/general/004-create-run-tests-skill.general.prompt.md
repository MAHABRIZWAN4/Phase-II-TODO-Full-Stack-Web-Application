---
id: 004
title: create run tests skill
stage: general
date: 2026-01-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: unknown
command: Create a new skill in .claude/skills/ folder: run-tests
labels: ["skill-creation","testing"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/run-tests.md
tests:
 - None
---

## Prompt

Create a new skill in .claude/skills/ folder:

Name: run-tests
Description: Automated testing workflow for frontend components and backend API endpoints

SKILL PURPOSE:
Execute comprehensive tests to ensure code quality, catch bugs early, and validate functionality before deployment.

TESTING STRATEGY:

FRONTEND TESTS (Jest + React Testing Library):
1. Component rendering tests
2. User interaction tests
3. Form validation tests
4. API integration tests (mocked)
```bash
# Run frontend tests
cd frontend
npm test
npm run test:coverage
```

BACKEND TESTS (Pytest):
1. API endpoint tests
2. Database operation tests
3. Authentication/authorization tests
4. Input validation tests
```bash
# Run backend tests
cd backend
pytest
pytest --cov=.
```

TEST CHECKLIST:
Frontend:
- [ ] All components render without errors
- [ ] Button clicks trigger correct actions
- [ ] Forms validate input properly
- [ ] Loading and error states display correctly
- [ ] API calls are mocked correctly

Backend:
- [ ] All endpoints return correct status codes
- [ ] Authentication middleware works
- [ ] User isolation is enforced
- [ ] Database queries return expected data
- [ ] Error handling returns proper messages
- [ ] Input validation rejects invalid data

CONTINUOUS TESTING:
- Run tests after every implementation
- Run full test suite before deployment
- Maintain 80%+ code coverage
- Fix failing tests immediately

USAGE:
Any agent can invoke this skill after implementing features to ensure quality.

## Response snapshot

Created the `run-tests.md` skill file in `.claude/skills/` following the project's skill template format. The skill includes:

1. **Testing strategy** covering:
   - Frontend tests (Jest + React Testing Library)
   - Backend tests (Pytest)
   - Command examples for running tests

2. **Comprehensive checklists** for:
   - Frontend testing (rendering, interactions, forms, API mocking)
   - Backend testing (endpoints, auth, user isolation, validation)

3. **Test examples** with:
   - Frontend component test using React Testing Library
   - Backend API test using Pytest with fixtures
   - Covers rendering, interactions, validation, and edge cases

4. **Configuration files** including:
   - Jest configuration for frontend
   - Pytest configuration for backend
   - Coverage reporting settings

5. **Troubleshooting guide** for common issues

6. **Best practices** for writing maintainable tests

File created: `.claude/skills/run-tests.md`

## Outcome

- ✅ Impact: New skill created to standardize testing workflow across the monorepo, enabling consistent test execution for frontend and backend components
- 🧪 Tests: None (skill creation task)
- 📁 Files: Created `.claude/skills/run-tests.md`
- 🔁 Next prompts: Consider creating test files for existing features using this skill
- 🧠 Reflection: Skill follows existing project patterns and provides comprehensive testing guidance for both frontend (Next.js) and backend (FastAPI) stacks

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
