@echo off
echo ==========================================
echo      INICIANDO CHEFEX (AXIS SOFTWARE)
echo ==========================================

if not exist .venv (
    echo ERRO: Ambiente virtual nao encontrado.
    echo Por favor, execute 'setup_all.bat' primeiro.
    pause
    exit /b
)

echo Iniciando Backend na porta 8000...
start "Chefex Backend" cmd /k "call .venv\Scripts\activate && uvicorn server.main:app --reload --host 0.0.0.0 --port 8000"

echo Aguardando 5 segundos para o backend subir...
timeout /t 5

echo Iniciando Frontend na porta 3000...
start "Chefex Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo      SISTEMA INICIADO
echo ==========================================
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar este launcher (as janelas do servidor continuarao abertas).
pause
