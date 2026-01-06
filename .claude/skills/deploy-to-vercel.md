# Deploy to Vercel

**Description**: Automated deployment workflow for Next.js frontend and FastAPI backend to Vercel

---

## Skill Purpose

Deploy both frontend and backend to Vercel with proper environment variables and configuration.

---

## Steps

### 1. Verify Deployment Configuration
Ensure `vercel.json` exists in both `frontend/` and `backend/` folders with proper configuration.

**Frontend vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**Backend vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/main.py"
    }
  ]
}
```

### 2. Configure Environment Variables

Set environment variables in Vercel dashboard or via CLI:

**Frontend Environment Variables:**
- `NEXT_PUBLIC_API_URL` - The deployed backend URL (e.g., https://backend-app.vercel.app)
- `BETTER_AUTH_SECRET` - Shared secret for Better Auth

**Backend Environment Variables:**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Shared secret for Better Auth (same as frontend)

### 3. Deploy Frontend
```bash
cd frontend
vercel --prod
```
Copy the deployed frontend URL from the output.

### 4. Deploy Backend
```bash
cd backend
vercel --prod
```
Copy the deployed backend URL from the output.

### 5. Link Frontend API Calls

Update frontend API calls to point to the deployed backend URL:
- Update `NEXT_PUBLIC_API_URL` in Vercel frontend environment variables
- Update any hardcoded API endpoints to use `process.env.NEXT_PUBLIC_API_URL`

### 6. Test Deployed Endpoints

Verify both deployments are working:
- Test frontend: Open the deployed URL in a browser
- Test backend API: Hit `https://backend-url.vercel.app/docs` to view Swagger UI
- Run smoke tests on critical endpoints (auth, todos CRUD, etc.)

---

## Prerequisites

- **Vercel CLI** installed: `npm i -g vercel`
- **Vercel account** logged in: `vercel login`
- **Environment variables** configured in Vercel dashboard or CLI
- Both `frontend/` and `backend/` directories are initialized as Vercel projects (have `.vercel/` folder)

---

## Usage

Any agent can invoke this skill when deployment is needed after code changes. Example scenarios:
- After completing a feature implementation
- Before releasing to production
- After environment variable changes
- After dependency updates

---

## Verification Checklist

- [ ] `vercel.json` exists in both `frontend/` and `backend/`
- [ ] All environment variables are set in Vercel dashboard
- [ ] Frontend deploys successfully
- [ ] Backend deploys successfully
- [ ] Frontend `NEXT_PUBLIC_API_URL` is updated to backend URL
- [ ] Both deployments are accessible and functional
- [ ] API endpoints return correct responses
- [ ] Authentication flow works end-to-end

---

## Troubleshooting

**Build fails:**
- Check build logs for dependency issues
- Ensure all required environment variables are set
- Verify `package.json` scripts are correct

**Runtime errors:**
- Check runtime logs in Vercel dashboard
- Verify database connection string is correct
- Ensure `BETTER_AUTH_SECRET` matches between frontend and backend

**API calls fail:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend deployment URL is reachable
