@echo off
cls
echo ============================================
echo   SCHOOL ERP - SIMPLE FIX
echo ============================================
echo.

echo Step 1: Checking MongoDB...
sc query MongoDB 2>nul | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo [X] MongoDB is NOT running!
    echo.
    echo Starting MongoDB...
    net start MongoDB 2>nul
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Could not start MongoDB!
        echo.
        echo Please install MongoDB from:
        echo https://www.mongodb.com/try/download/community
        echo.
        echo Or start it manually with: net start MongoDB
        echo.
        pause
        exit /b 1
    )
    echo [OK] MongoDB started!
) else (
    echo [OK] MongoDB is running!
)
echo.

echo Step 2: Installing backend...
cd backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install --silent
)
echo [OK] Backend ready!
echo.

echo Step 3: Seeding database...
call node seed.js
echo.

echo Step 4: Starting backend server...
echo.
echo Backend will start on: http://localhost:5000
echo.
echo Keep this window open!
echo Press Ctrl+C to stop the server
echo.
echo ============================================
echo.
call npm run dev
