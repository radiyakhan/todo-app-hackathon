@echo off
echo ================================================
echo Quick Switch to Local Backend
echo ================================================
echo.
echo This will configure your frontend to use the local backend
echo so you can test login immediately while waiting for
echo Hugging Face Space to update.
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Updating frontend/.env.local...
cd frontend
echo # Backend API URL (adjust for your environment) > .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8000 >> .env.local
echo. >> .env.local
echo # Auth Secret (must match backend JWT_SECRET for token verification) >> .env.local
echo # This is used for any client-side auth operations >> .env.local
echo NEXT_PUBLIC_APP_URL=http://localhost:3000 >> .env.local

echo.
echo ✅ Frontend configured to use local backend
echo.
echo Now starting services...
echo.

echo Starting backend on port 8000...
start "Backend Server" cmd /k "cd ..\backend && python -m uvicorn src.main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo Starting frontend on port 3000...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ================================================
echo ✅ Both servers starting!
echo ================================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo You can now test login at: http://localhost:3000/signin
echo.
echo To switch back to deployed backend later:
echo   Edit frontend/.env.local
echo   Change: NEXT_PUBLIC_API_URL=https://radiya345-todo-app.hf.space
echo.
pause
