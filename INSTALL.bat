@echo off
echo ========================================
echo School ERP System - Installation Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Seeding Database...
cd ..\backend
call node seed.js
if %errorlevel% neq 0 (
    echo ERROR: Database seeding failed! Make sure MongoDB is running.
    pause
    exit /b 1
)
echo Database seeded successfully!
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Demo Credentials:
echo   Admin:   admin@school.com / admin123
echo   Staff:   staff@school.com / staff123
echo   Student: student@school.com / student123
echo.
echo To start the application:
echo   1. Run START_BACKEND.bat
echo   2. Run START_FRONTEND.bat
echo   3. Open http://localhost:3000
echo.
pause
