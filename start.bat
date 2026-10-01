@echo off
cd /d "%~dp0"

echo Starting BreachGuard Backend...
start "BreachGuard Backend" cmd /k "cd backend && npm run dev"

echo Starting BreachGuard Frontend...
start "BreachGuard Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are starting in separate windows! You can close this window now.
pause
