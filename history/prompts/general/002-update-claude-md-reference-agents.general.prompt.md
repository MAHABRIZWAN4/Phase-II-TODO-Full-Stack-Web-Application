---
id: 002
title: Update CLAUDE.md to reference AGENTS.md
stage: general
date: 2026-01-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: Update CLAUDE.md with AGENTS.md reference
labels: ["setup","configuration","monorepo"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - CLAUDE.md
tests:
---

## Prompt

Update the existing CLAUDE.md file in root directory.

Replace or append content with:
@AGENTS.md

This ensures Claude Code loads agent instructions from AGENTS.md for Phase II monorepo development.

## Response snapshot

Updated CLAUDE.md to include a prominent reference to AGENTS.md at the top of the file:
- Added "NOTE" banner pointing to @AGENTS.md for Phase II monorepo development
- Maintains all existing Spec-Driven Development guidelines
- Ensures Claude Code loads Phase II-specific agent instructions

## Outcome

- ✅ Impact: Configured Claude Code to use AGENTS.md as the primary instruction source for Phase II development
- 🧪 Tests: N/A (documentation only)
- 📁 Files: Updated CLAUDE.md (1 file modified)
- 🔁 Next prompts: Ready to begin feature development
- 🧠 Reflection: Successfully linked project documentation files to ensure consistent agent behavior

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
