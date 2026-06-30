@echo off
set PATH=C:\Users\mraje\nodejs;%PATH%
set MAVEN_PATH=C:\Users\mraje\.maven\maven-3.9.14\bin\mvn.cmd

echo ==========================================
echo   Smart Mutual Fund Tracker - Starter
echo ==========================================

echo [1/2] Starting Backend...
start "Backend Server" cmd /k "cd backend && %MAVEN_PATH% spring-boot:run"

echo [2/2] Starting Frontend...
start "Frontend Server" cmd /k "cd frontend && if not exist node_modules npm install && npm run dev"

echo.
echo ==========================================
echo Both servers are starting in separate windows.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8080
echo ==========================================
echo.
pause
