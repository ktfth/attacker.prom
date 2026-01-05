@echo off
chcp 65001 > nul
cls
echo ========================================================
echo      MESTRE DIGITAL - SEU ALIADO DE NEGOCIOS
echo ========================================================
echo.
echo Iniciando o sistema...
echo.
cd agentes
bun run agent.ts
pause
