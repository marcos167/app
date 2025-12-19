# Manual de Resolução - Prisma Migration

## Problema
O Prisma não está conseguindo ler o DATABASE_URL do arquivo `.env`.

## Solução Manual

### Opção 1: Definir variável de ambiente manualmente

```powershell
# Execute estes comandos no PowerShell:

$env:DATABASE_URL="postgresql://chefex_user:***REMOVED_DB_PASSWORD***@ep-cool-name.neon.tech/chefex_prod?sslmode=require"

npx prisma migrate dev --name add_performance_indexes
```

### Opção 2: Criar arquivo .env manualmente

1. Abra o Notepad
2. Cole o conteúdo abaixo:

```
DATABASE_URL=postgresql://chefex_user:***REMOVED_DB_PASSWORD***@ep-cool-name.neon.tech/chefex_prod?sslmode=require
SECRET_KEY=***REMOVED_SECRET***
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
GOOGLE_CLIENT_ID=1019372792734-k6s58dq78pov4ktnhoiv9ddf3mkbjrf3.apps.googleusercontent.com
OPENAI_API_KEY=***REMOVED_OPENAI_KEY***
STRIPE_SECRET_KEY=***REMOVED_STRIPE_KEY***
ALLOWED_ORIGINS=https://chefex.vercel.app,http://localhost:3000
DEBUG=false
LOG_LEVEL=INFO
PORT=8000
HOST=0.0.0.0
APP_NAME=Chefex API
APP_VERSION=1.0.0
```

3. Salve como `.env` na raiz do projeto (c:\Users\--\Documents\Dev\Project2\)
4. **IMPORTANTE:** Salve com encoding UTF-8 (sem BOM)

### Opção 3: Usar dotenv-cli

```bash
npm install -g dotenv-cli
dotenv -e .env -- npx prisma migrate dev --name add_performance_indexes
```

## Depois da Migration

```bash
# 1. Testar backend
python scripts\test_backend.py

# 2. Iniciar backend
uvicorn server.main:app --reload

# 3. Testar health check
# Visite: http://localhost:8000/health
```

## Se ainda não funcionar

Execute a migration diretamente no Neon:

1. Acesse: https://console.neon.tech
2. Vá em "SQL Editor"
3. Execute o SQL da migration manualmente

Ou me avise que eu crio o SQL para você executar!
