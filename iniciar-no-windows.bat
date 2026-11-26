@echo off
cd /d "%~dp0"
echo Instalando dependencias do Mr. Construcao...
call npm install
if errorlevel 1 (
  echo Nao foi possivel instalar as dependencias. Confira sua internet e o Node.js.
  pause
  exit /b 1
)
echo Iniciando o projeto...
call npm run dev
pause
