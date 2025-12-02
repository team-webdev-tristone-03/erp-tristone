@echo off
echo Starting School ERP Backend Server...
echo.
cd backend
start "School ERP Backend" cmd /k "npm run dev"
echo Backend starting on http://localhost:5000
echo.
echo Wait 5 seconds for backend to start...
timeout /t 5 /nobreak >nul
echo.
echo Starting Frontend...
cd ..\frontend
start "School ERP Frontend" cmd /k "npm run dev"
echo.
echo ============================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ============================================
echo.
echo Keep both windows open!
echo Browser will open in 10 seconds...
timeout /t 10 /nobreak >nul
start http://localhost:3000
