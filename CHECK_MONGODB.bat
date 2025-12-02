@echo off
echo Checking MongoDB status...
echo.

sc query MongoDB | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB is RUNNING
) else (
    echo [ERROR] MongoDB is NOT running!
    echo.
    echo To start MongoDB, run:
    echo   net start MongoDB
    echo.
    echo Or install MongoDB from:
    echo   https://www.mongodb.com/try/download/community
)

echo.
pause
