# 🍳 Chefex

**Seu Assistente na Cozinha** — Desenvolvido por **Axis Software**

## Sobre

Chefex é um aplicativo moderno de receitas com recursos premium como:
- 🔍 Busca inteligente de receitas
- 📱 PWA (funciona offline)
- 👨‍🍳 Perfis de usuário personalizados
- ⭐ Favoritos e histórico
- 📊 Painel administrativo completo

## Tecnologias

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: FastAPI, SQLModel, PostgreSQL (Supabase)
- **Auth**: Google OAuth, Email/Senha (Argon2)

## Instalação

```bash
# Frontend
npm install
npm run dev

# Backend
cd server
pip install -r requirements.txt
uvicorn server.main:app --reload
```

## Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
DATABASE_URL=postgresql://...
```

---

**© 2024 Axis Software. Todos os direitos reservados.**
