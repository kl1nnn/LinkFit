@echo off
cd /d "%~dp0"
echo Iniciando o LinkFit...
echo.
echo O navegador vai abrir em:
echo http://127.0.0.1:5173
echo.
start "" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:5173"
npm.cmd run dev -- --host 127.0.0.1
pause
