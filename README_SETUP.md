# 🚀 Guia de Setup do Chefex (Gastrofy)

Este guia ajuda você a configurar e rodar o projeto (Backend Python + Frontend Next.js).

## 📋 Pré-requisitos

1.  **Python 3.10+** instalado (e adicionado ao PATH).
2.  **Node.js 18+** instalado.
3.  **Git**.

## 🚀 Setup Rápido (Windows)

Simplesmente execute esse script na raiz do projeto:

```powershell
setup_all.bat
```

Isso vai:
1.  Criar um ambiente virtual Python (`.venv`).
2.  Instalar as dependências do Backend (`requirements.txt`).
3.  Instalar as dependências do Frontend (`package.json`).
4.  Gerar o cliente do Prisma (se necessário).

## ▶️ Como Rodar (Start)

Para iniciar tudo de uma vez:

```powershell
start_all.bat
```

Isso abrirá duas janelas:
1.  **Backend**: Rodando em `http://localhost:8000`
2.  **Frontend**: Rodando em `http://localhost:3000`

Acesse o app em: **[http://localhost:3000](http://localhost:3000)**

## ⚙️ Configuração Manual (.env)

Crie um arquivo `.env` na raiz (baseado no `env.example.txt`):

```ini
# Configuração do Backend
SECRET_KEY=chave_secreta_local
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## 🛠️ Solução de Problemas Comuns

### "ModuleNotFoundError: No module named 'argon2'"
Isso significa que as dependências do Python não foram instaladas corretamente.
**Solução**: Rode `setup_all.bat` novamente ou `pip install -r requirements.txt` manualmente.

### "Connection Refused 127.0.0.1:8000"
O Frontend não consegue falar com o Backend.
**Solução**: Verifique se a janela do Backend (Python) está aberta e não tem erros.

### Login não funciona
Verifique se o backend criou o arquivo `database.db` na raiz. Se não, verifique as permissões de pasta.
