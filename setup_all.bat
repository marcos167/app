@echo off
echo ==========================================
echo      CONFIGURANDO AMBIENTE CHEFEX
echo ==========================================

echo [1/4] Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ERRO: Python nao encontrado. Instale Python 3.10+ e adicione ao PATH.
    pause
    exit /b
)

echo.
echo [2/4] Configurando Python Backend...
if not exist .venv (
    echo Criando ambiente virtual .venv ...
    python -m venv .venv
) else (
    echo Ambiente virtual encontrado.
)

call .venv\Scripts\activate
echo Instalando dependencias (requirements.txt)...
pip install -U pip
pip install -r requirements.txt

echo.
echo [3/4] Configurando Node.js Frontend...
echo Instalando pacotes npm...
call npm install --legacy-peer-deps

echo.
echo [4/4] Finalizando...
echo Gerando Prisma Client (opcional, mas recomendado para evitar erros de tipagem)
call npx -y prisma generate --no-engine

echo.
echo ==========================================
echo      SETUP CONCLUIDO COM SUCESSO!
echo ==========================================
echo Agora execute 'start_all.bat' para rodar.
pause
