@echo off
echo ========================================
echo School ERP - Quick Fix and Start
echo ========================================
echo.

echo Checking if MongoDB is running...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo WARNING: MongoDB is not running!
    echo Please start MongoDB first:
    echo   net start MongoDB
    echo.
    pause
    exit /b 1
)
echo MongoDB is running!
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Backend installation failed!
        pause
        exit /b 1
    )
)
echo Backend ready!
echo.

echo [2/3] Installing Frontend Dependencies...
cd ..\frontend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Frontend installation failed!
        pause
        exit /b 1
    )
)
echo Frontend ready!
echo.

echo [3/3] Seeding Database...
cd ..\backend
call node seed.js
echo.

echo ========================================
echo Setup Complete! Starting servers...
echo ========================================
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Demo Credentials:
echo   Admin:   admin@school.com / admin123
echo   Staff:   staff@school.com / staff123
echo   Student: student@school.com / student123
echo.
echo Press Ctrl+C to stop servers
echo ========================================
echo.

start "School ERP Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul
start "School ERP Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Servers are starting in separate windows...
echo Wait 10 seconds, then open: http://localhost:3000
echo.
pause
