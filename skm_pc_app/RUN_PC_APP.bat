@echo off
title SKM POS - Electron PC Desktop App
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Please install Node.js LTS from https://nodejs.org first!
    pause
    exit /b 1
)
if not exist "node_modules" (
    echo Installing Electron Desktop Runtime (First time only)...
    call npm install
)
echo Launching SKM POS Desktop App...
call npm start
