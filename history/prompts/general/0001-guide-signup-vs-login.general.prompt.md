---
id: 0001
title: Guide signup vs login
stage: general
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: MAHABRIZWAN4 <mahabrizwan@gmail.com>
command: /sp.phr
labels: ["auth","frontend","how-to"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - none
tests:
 - none
---

## Prompt

--stage general --title "Guide signup vs login on localhost:3000" --labels "auth,frontend,how-to" --surface agent --prompt "Frontend http://localhost:3000 per hai mera abb batao me sign up karun ya login" --response "Recommended: signup first since user is new. Provided step-by-step instructions for /signup and what to do if backend not reachable."

## Response snapshot

Recommended: since the user is new, open `http://localhost:3000/signup`, enter email + password (min 8 chars) (name optional), submit, and expect redirect to `/dashboard`. If the backend/API isn’t running or `NEXT_PUBLIC_API_URL` is wrong, login/signup will fail with a network error—start backend or fix env.

## Outcome

- ✅ Impact: User got a clear decision (signup first) plus concrete URLs and steps to authenticate on the local frontend.
- 🧪 Tests: none
- 📁 Files: none
- 🔁 Next prompts: "If signup fails, confirm backend is reachable at NEXT_PUBLIC_API_URL and share the exact error message."
- 🧠 Reflection: A quick decision tree (existing account vs new user) prevents wasted attempts and reduces confusion.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Capture the exact error toast/screenshot from the auth page to quickly diagnose backend URL or CORS issues.
