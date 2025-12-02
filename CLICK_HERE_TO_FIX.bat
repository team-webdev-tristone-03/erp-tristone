@echo off
color 0C
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              LOGIN ERROR: Cannot connect to server           ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
color 0E
echo DIAGNOSIS: Backend server is not running
echo CAUSE: MongoDB is not installed
echo.
echo ════════════════════════════════════════════════════════════════
echo.
color 0F

sc query MongoDB 2>nul | find "RUNNING" >nul
if %errorlevel% equ 0 (
    color 0A
    echo [✓] MongoDB is installed and running!
    echo.
    color 0F
    echo Starting backend server...
    echo.
    start "Backend Server" cmd /k "cd /d %~dp0 && SIMPLE_FIX.bat"
    timeout /t 5 /nobreak >nul
    echo.
    echo Starting frontend...
    echo.
    start "Frontend App" cmd /k "cd /d %~dp0 && START_FRONTEND_ONLY.bat"
    echo.
    color 0A
    echo ════════════════════════════════════════════════════════════════
    echo.
    echo [✓] SERVERS STARTING!
    echo.
    echo Wait 10 seconds, then open: http://localhost:3000
    echo.
    echo Login with:
    echo   Admin: admin@school.com / admin123
    echo.
    echo ════════════════════════════════════════════════════════════════
    echo.
    timeout /t 15 /nobreak
    start http://localhost:3000
    exit
) else (
    color 0C
    echo [✗] MongoDB is NOT installed!
    echo.
    color 0E
    echo ════════════════════════════════════════════════════════════════
    echo.
    echo YOU NEED TO INSTALL MONGODB FIRST
    echo.
    echo Option 1: Download MongoDB Community Server
    echo   https://www.mongodb.com/try/download/community
    echo.
    echo Option 2: Use MongoDB Atlas (Cloud - Free)
    echo   https://www.mongodb.com/cloud/atlas/register
    echo.
    echo ════════════════════════════════════════════════════════════════
    echo.
    color 0F
    echo Opening MongoDB download page...
    timeout /t 3 /nobreak >nul
    start https://www.mongodb.com/try/download/community
    echo.
    echo After installing MongoDB:
    echo   1. Restart your computer
    echo   2. Run this file again
    echo.
    echo Or read: INSTALL_MONGODB.txt for detailed instructions
    echo.
    pause
)
