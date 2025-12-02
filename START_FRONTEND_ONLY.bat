@echo off
cls
echo ============================================
echo   SCHOOL ERP - STARTING FRONTEND
echo ============================================
echo.

cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install --silent
)

echo Starting frontend...
echo.
echo Frontend will open at: http://localhost:3000
echo.
echo Keep this window open!
echo Press Ctrl+C to stop
echo.
echo ============================================
echo.
call npm run dev
