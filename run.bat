@echo off
cd /d "%~dp0"

echo Checking for Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed! Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b
)

echo.
echo Checking Backend dependencies...
IF NOT EXIST "backend\node_modules\" (
    echo Backend dependencies not found. Installing...
    cd backend
    call npm install
    cd ..
) ELSE (
    echo Backend dependencies are already installed.
)

echo.
echo Checking Frontend dependencies...
IF NOT EXIST "frontend\node_modules\" (
    echo Frontend dependencies not found. Installing...
    cd frontend
    call npm install
    cd ..
) ELSE (
    echo Frontend dependencies are already installed.
)

echo.
echo Starting BreachGuard Backend...
start "BreachGuard Backend" cmd /k "cd backend && npm run dev"

echo Starting BreachGuard Frontend...
start "BreachGuard Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Setup complete! Both servers are starting in separate windows.
pause
