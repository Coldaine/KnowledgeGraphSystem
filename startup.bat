@echo off
REM Knowledge Graph System - Startup Script for Windows
REM This script sets up and runs the Knowledge Graph application

echo ================================================
echo    Knowledge Graph System - Startup Script
echo ================================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo         Visit: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo.
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully
) else (
    echo [OK] Dependencies already installed
)

REM Check for .env.local
if not exist ".env.local" (
    echo.
    echo [WARNING] No .env.local file found
    echo Creating .env.local from .env.example...
    copy .env.example .env.local >nul
    echo.
    echo [ACTION] Please edit .env.local and add your Gemini API key:
    echo          NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
    echo.
    echo Get your API key from: https://makersuite.google.com/app/apikey
    echo.
    pause
)

REM Build the application
echo.
echo [INFO] Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Build completed successfully

REM Start the application
echo.
echo [INFO] Starting Knowledge Graph System...
echo.
echo ================================================
echo    Application will be available at:
echo    http://localhost:3000
echo ================================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run start