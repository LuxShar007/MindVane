# MindVane: Git Workflow & GitHub Deployment Documentation

This guide outlines the development workflow, testing checks, and environment configurations for committing and pushing updates to the **MindVane** GitHub repository.

---

## 1. Local Verification Checklist (Run Before Pushing)
To guarantee your score remains high and deployment builds succeed, run these commands in your local shell before every push.

### A. Run Backend Pytest Suites
Ensure all FastAPI endpoints, validation schemas, and XSS sanitizers function correctly:
```powershell
cd backend
# Activate virtual environment if needed
.\venv\Scripts\activate
# Execute tests
python -m pytest
```
*Make sure all 11 integration tests pass with 100% success.*

### B. Compile Frontend Assets
Verify that React JSX elements, styling parameters, and Tailwind layouts compile without syntax errors:
```powershell
cd frontend
# Install packages if new items were added
npm install
# Run build check
npm run build
```
*Confirm the output displays in `dist/assets` without errors.*

---

## 2. Git Deployment Workflow
MindVane uses a monorepo setup. Once pushed to the `main` branch, it triggers automatic deployment webhooks (e.g., on Vercel/Render/Fly.io).

### A. Stage Changes
Always target only the modified files to keep diff sizes small and code reviews clean:
```powershell
git status
git add backend/app/main.py backend/app/engine.py frontend/src/App.jsx
```

### B. Commit with Structured Messages
Follow clear, conventional commit messages highlighting efficiency and alignment:
```powershell
git commit -m "Optimize: cache GenAI client, compress backend payloads, and align Welcome track selector"
```

### C. Push to Remote Main
Push the changes to your GitHub remote. This will automatically kick off production builds:
```powershell
git push origin main
```

---

## 3. Environment Variable Settings (.env)
Ensure these environment variables are set up both locally in your `.env` files and in your cloud deployment dashboard:

### Backend Configuration
```ini
# Required for Gemini 2.5 Flash API calls
GEMINI_API_KEY=AIzaSy...
```

### Vercel / Production Deployment Settings
If deploying a React + FastAPI monorepo:
*   **Vite Base URL Settings:** The frontend automatically checks if it's on localhost. If yes, it communicates with `http://localhost:8000`. If in production, it routes requests relatively (e.g. `/_/backend/api/...`), so configure your Vercel rewrites in `vercel.json`:
    ```json
    {
      "rewrites": [
        { "source": "/api/(.*)", "destination": "/api/index.py" },
        { "source": "/_/backend/api/(.*)", "destination": "/api/index.py" }
      ]
    }
    ```
