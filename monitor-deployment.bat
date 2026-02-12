@echo off
REM Windows batch script to monitor Hugging Face Space deployment status

:loop
cls
echo ============================================
echo Hugging Face Space Deployment Monitor
echo ============================================
echo.
echo Checking backend status...
echo.

curl -s https://radiya345-todo-app.hf.space/health
echo.
echo.

echo Testing bcrypt fix...
echo.

curl -s -X POST https://radiya345-todo-app.hf.space/api/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"monitor@test.com\",\"password\":\"test12345\",\"name\":\"Monitor\"}"
echo.
echo.

echo ============================================
echo.
echo If you see "password cannot be longer than 72 bytes":
echo   ^> Space NOT updated yet - needs manual update
echo.
echo If you see "Email already registered" or user data:
echo   ^> Space IS UPDATED - bcrypt fixed!
echo.
echo ============================================
echo.
echo Press Ctrl+C to stop monitoring
echo Checking again in 30 seconds...
echo.

timeout /t 30 /nobreak > nul
goto loop
