@echo off
title SKM POS - Build Windows Installer (.exe)
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Please install Node.js LTS from https://nodejs.org first!
    pause
    exit /b 1
)
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)
echo Building Windows Installer (.exe) and Portable (.exe)...
call npm run build:win
echo.
echo ======================================================
echo DONE! Your Windows .exe files are inside: skm_pc_app\dist\
echo ======================================================
explorer dist
pause
