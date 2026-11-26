@echo off
title SKM POS - PC Desktop App (Instant Mode)
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Please install Node.js LTS from https://nodejs.org first!
    pause
    exit /b 1
)
echo Starting SKM POS Local Server + Silent Print Bridge...
start /b "" node instant_server.js
timeout /t 2 /nobreak >nul
set URL=http://127.0.0.1:4580/welcome.html?branch=branch_1
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=%URL% --kiosk-printing --start-maximized
    exit /b 0
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=%URL% --kiosk-printing --start-maximized
    exit /b 0
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=%URL% --kiosk-printing --start-maximized
    exit /b 0
)
start "" %URL%
