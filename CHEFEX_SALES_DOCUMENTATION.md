# 🍳 CHEFEX - Documentação Completa do Produto

## Documentação Técnica e Comercial para Apresentação Empresarial

---

## 📋 Índice

1. [Visão Geral Executiva](#visão-geral-executiva)
2. [Proposta de Valor](#proposta-de-valor)
3. [Arquitetura Técnica](#arquitetura-técnica)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Funcionalidades do Produto](#funcionalidades-do-produto)
6. [Sistema de Monetização](#sistema-de-monetização)
7. [Painel Administrativo](#painel-administrativo)
8. [Segurança e Compliance](#segurança-e-compliance)
9. [Infraestrutura de Deploy](#infraestrutura-de-deploy)
10. [Métricas e Analytics](#métricas-e-analytics)
11. [Roadmap e Escalabilidade](#roadmap-e-escalabilidade)
12. [Informações de Acesso](#informações-de-acesso)

---

## 📊 Visão Geral Executiva

### O que é o Chefex?

**Chefex** é uma **plataforma completa de receitas e comunidade culinária** desenvolvida como Progressive Web App (PWA), oferecendo uma experiência mobile-first com funcionalidades avançadas de gamificação, monetização de criadores e inteligência artificial.

### Destaques do Produto

| Métrica | Valor |
|---------|-------|
| **Versão** | 1.0.0 |
| **Tipo** | PWA (Progressive Web App) |
| **Plataformas** | Web, Android (via PWA), iOS (via PWA) |
| **Status** | ✅ Produção (Live) |
| **Frontend** | https://chefex.vercel.app |
| **Backend API** | https://chefex-api.onrender.com |

---

## 💎 Proposta de Valor

### Para Usuários

- 🍽️ **Descoberta de Receitas** - Feed personalizado com receitas categorizadas
- 📱 **Experiência Mobile Premium** - Interface fluida com animações suaves
- 🛒 **Lista de Compras Inteligente** - Gestão de ingredientes integrada
- 📅 **Planejamento Semanal** - Organização de refeições por dia
- 🏆 **Gamificação** - Sistema de XP, níveis e conquistas
- 💰 **Monetização** - Criadores podem ganhar com suas receitas

### Para a Empresa

- 📈 **Modelo de Receita Duplo** - Assinaturas + Marketplace de criadores
- 🔒 **Moderação IA** - Conteúdo automaticamente filtrado
- 📊 **Analytics Completo** - Dashboards de métricas em tempo real
- 🎯 **Engajamento Alto** - Sistema de gamificação aumenta retenção
- 🌐 **Escalável** - Arquitetura cloud-ready

---

## 🏗️ Arquitetura Técnica

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vercel)                        │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│   │   Next.js    │  │   React 19   │  │   Tailwind CSS v4    │ │
│   │    v16.0     │  │              │  │   Framer Motion      │ │
│   └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                              │                                  │
│                    ┌─────────▼─────────┐                        │
│                    │   API Rewrites    │                        │
│                    │   (Proxy /api/*)  │                        │
│                    └─────────┬─────────┘                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND (Render)                          │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│   │   FastAPI    │  │   SQLModel   │  │   Uvicorn (ASGI)     │ │
│   │   Python     │  │   SQLAlchemy │  │   WebSockets         │ │
│   └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE (Supabase)                       │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐ │
│   │              PostgreSQL + Connection Pooler               │ │
│   │                     (Oregon, US)                          │ │
│   └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Usuário** acessa o PWA via browser/app instalado
2. **Next.js** renderiza a interface e faz chamadas para `/api/*`
3. **Vercel Rewrites** redireciona para o backend no Render
4. **FastAPI** processa a requisição com autenticação JWT
5. **SQLModel** interage com o PostgreSQL no Supabase
6. **Resposta** retorna pelo mesmo caminho

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 16.0.10 | Framework React com SSR/SSG |
| **React** | 19.2.1 | Biblioteca de UI |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 4.x | Estilização utility-first |
| **Framer Motion** | 12.x | Animações premium |
| **React OAuth Google** | 0.12.2 | Autenticação social |
| **Recharts** | 3.6.0 | Gráficos e visualizações |
| **Lucide React** | 0.561.0 | Ícones SVG |
| **next-pwa** | 10.2.9 | Progressive Web App |

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Python** | 3.14 | Linguagem principal |
| **FastAPI** | 0.125.0 | Framework web async |
| **SQLModel** | 0.0.27 | ORM com Pydantic |
| **SQLAlchemy** | 2.0.45 | Database toolkit |
| **Uvicorn** | 0.38.0 | Servidor ASGI |
| **Pydantic** | 2.12.5 | Validação de dados |
| **Python-Jose** | 3.5.0 | JWT tokens |
| **Passlib** | 1.7.4 | Hashing de senhas |
| **OpenAI** | 2.14.0 | Integração IA |
| **Stripe** | 14.1.0 | Pagamentos |
| **psycopg2** | 2.9.11 | Driver PostgreSQL |

### Infraestrutura

| Serviço | Propósito |
|---------|-----------|
| **Vercel** | Hosting do frontend |
| **Render** | Hosting do backend |
| **Supabase** | Banco de dados PostgreSQL |
| **Google Cloud** | OAuth e autenticação |
| **Stripe** | Processamento de pagamentos |

---

## 🎯 Funcionalidades do Produto

### 1. Páginas do Usuário (24 rotas)

| Página | Funcionalidade |
|--------|----------------|
| `/feed` | Feed principal de receitas |
| `/explore` | Exploração e busca |
| `/recipes/[id]` | Detalhes da receita |
| `/create` | Criação de receitas |
| `/profile` | Perfil do usuário |
| `/profile/edit` | Edição de perfil |
| `/profile/followers` | Lista de seguidores |
| `/saved` | Receitas salvas |
| `/shopping-list` | Lista de compras |
| `/meal-planning` | Planejamento semanal |
| `/community` | Comunidade e social |
| `/history` | Histórico de visualizações |
| `/reviews` | Avaliações |
| `/settings` | Configurações |
| `/plans` | Planos de assinatura |
| `/upgrade` | Upgrade para premium |
| `/monetization/*` | Sistema de monetização |
| `/how-to-earn` | Guia de monetização |
| `/login` | Login |
| `/signup` | Cadastro |
| `/legal/*` | Páginas legais |

### 2. API Endpoints (21 módulos)

| Endpoint | Funcionalidade |
|----------|----------------|
| `/api/auth/*` | Autenticação (Google, Email) |
| `/api/recipes/*` | CRUD de receitas |
| `/api/comments/*` | Sistema de comentários |
| `/api/likes/*` | Curtidas e reações |
| `/api/saved/*` | Receitas salvas |
| `/api/social/*` | Seguir/deixar de seguir |
| `/api/profile/*` | Perfil do usuário |
| `/api/feed/*` | Feed personalizado |
| `/api/notifications/*` | Notificações real-time |
| `/api/support/*` | Suporte com chatbot |
| `/api/gamification/*` | XP, níveis, conquistas |
| `/api/monetization/*` | Sistema de monetização |
| `/api/payment/*` | Integração Stripe |
| `/api/analytics/*` | Métricas e relatórios |
| `/api/reports/*` | Denúncias e moderação |
| `/api/upload/*` | Upload de imagens |
| `/api/ai-assistant/*` | Assistente IA |
| `/api/admin/*` | Endpoints administrativos |

### 3. Recursos Premium

| Recurso | Descrição |
|---------|-----------|
| **Receitas Premium** | Conteúdo exclusivo para assinantes |
| **Vídeos** | Tutoriais em vídeo |
| **Planejamento Ilimitado** | Sem limites de refeições |
| **Sem Anúncios** | Experiência limpa |
| **Suporte Prioritário** | Atendimento VIP |

---

## 💰 Sistema de Monetização

### Modelo de Negócio

```
                    ┌─────────────────────────────┐
                    │      RECEITA TOTAL          │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │   ASSINATURAS   │ │   MARKETPLACE   │ │    ANÚNCIOS     │
    │   (MasterChef)  │ │   (Criadores)   │ │    (Futuro)     │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Planos de Assinatura

| Plano | Preço | Recursos |
|-------|-------|----------|
| **Free** | R$ 0 | Básico, com anúncios |
| **MasterChef** | R$ 19,90/mês | Premium completo |

### Sistema de Pontos para Criadores

| Ação | Pontos |
|------|--------|
| Receita publicada | +50 XP |
| Curtida recebida | +5 XP |
| Comentário recebido | +10 XP |
| Seguidor ganho | +20 XP |
| Receita salva | +8 XP |

### Fases da Monetização

| Fase | Status | Descrição |
|------|--------|-----------|
| **Fase 1: Seed** | ✅ Atual | Construção de comunidade |
| **Fase 2: Growth** | ⏳ Futuro | Ativação de monetização |
| **Fase 3: Scale** | ⏳ Futuro | Marketplace completo |

---

## 👨‍💼 Painel Administrativo

### Acesso

- **URL**: https://chefex.vercel.app/admin
- **Requisito**: Role `admin` ou `moderator`

### Módulos Disponíveis

| Módulo | Funcionalidade |
|--------|----------------|
| **Dashboard** | KPIs e métricas gerais |
| **Receitas** | CRUD completo de receitas |
| **Usuários** | Gestão de usuários |
| **Comentários** | Moderação de comentários |
| **Categorias** | Gestão de categorias |
| **Analytics** | Gráficos e relatórios |
| **Monetização** | Gestão do sistema de pontos |
| **Moderação** | Logs de moderação IA |
| **Configurações** | Settings gerais |
| **Logs** | Auditoria de ações |

### Funcionalidades Administrativas

- ✅ Publicar/despublicar receitas
- ✅ Banir/desbanir usuários
- ✅ Aprovar/rejeitar conteúdo
- ✅ Exportar dados (CSV/Excel)
- ✅ Visualizar logs de ação
- ✅ Gerenciar monetização

---

## 🔒 Segurança e Compliance

### Autenticação

| Método | Implementação |
|--------|---------------|
| **OAuth 2.0** | Google Sign-In |
| **Email/Senha** | bcrypt + salt |
| **JWT Tokens** | Access + Refresh tokens |
| **Token Rotation** | Refresh automático |

### Proteções Implementadas

| Proteção | Descrição |
|----------|-----------|
| **Rate Limiting** | slowapi com limites por IP |
| **CORS** | Origins permitidas configuradas |
| **SQL Injection** | Queries parametrizadas |
| **XSS** | Sanitização de inputs |
| **CSRF** | Tokens de proteção |
| **Password Hashing** | bcrypt com rounds adequados |

### Moderação IA

| Recurso | Descrição |
|---------|-----------|
| **Filtro de Conteúdo** | OpenAI moderation API |
| **Detecção de Spam** | Padrões automatizados |
| **Logs de Moderação** | Auditoria completa |
| **Ações Automáticas** | Bloqueio preventivo |

### Páginas Legais

- ✅ Termos de Uso (`/terms`)
- ✅ Política de Privacidade (`/privacy`)
- ✅ Política Anti-Fraude (`/legal/antifraud`)

---

## 🌐 Infraestrutura de Deploy

### Ambientes

| Ambiente | URL | Plataforma |
|----------|-----|------------|
| **Frontend** | chefex.vercel.app | Vercel |
| **Backend** | chefex-api.onrender.com | Render |
| **Database** | Supabase (Oregon) | PostgreSQL |

### Variáveis de Ambiente

#### Backend (Render)

| Variável | Descrição |
|----------|-----------|
| `SECRET_KEY` | Chave JWT |
| `GOOGLE_CLIENT_ID` | OAuth Google |
| `OPENAI_API_KEY` | Moderação IA |
| `STRIPE_SECRET_KEY` | Pagamentos |
| `DATABASE_URL` | Conexão PostgreSQL |
| `ALLOWED_ORIGINS` | CORS origins |

#### Frontend (Vercel)

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL do backend |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | OAuth Google |

### CI/CD

- **Frontend**: Deploy automático via GitHub → Vercel
- **Backend**: Deploy automático via GitHub → Render
- **Database**: Migrations manuais via scripts

---

## 📈 Métricas e Analytics

### Endpoints de Analytics

| Endpoint | Dados |
|----------|-------|
| `/api/analytics/growth` | Crescimento diário |
| `/api/analytics/top-recipes` | Receitas mais populares |
| `/api/analytics/conversion` | Taxas de conversão |

### Métricas Rastreadas

| Categoria | Métricas |
|-----------|----------|
| **Usuários** | Cadastros, ativos, retenção |
| **Engajamento** | Visualizações, curtidas, comentários |
| **Receitas** | Criadas, publicadas, salvas |
| **Conversão** | Free → Premium |
| **Monetização** | Pontos distribuídos, pagamentos |

---

## 🚀 Roadmap e Escalabilidade

### Recursos Atuais (v1.0.0)

- ✅ Autenticação Google + Email
- ✅ CRUD completo de receitas
- ✅ Sistema de comentários e avaliações
- ✅ Lista de compras
- ✅ Planejamento semanal
- ✅ Sistema social (seguir/seguidores)
- ✅ Gamificação (XP, níveis)
- ✅ Painel administrativo
- ✅ Moderação IA
- ✅ Pagamentos Stripe
- ✅ Notificações real-time
- ✅ Suporte com chatbot
- ✅ PWA instalável

### Roadmap Futuro

| Versão | Recursos Planejados |
|--------|---------------------|
| **v1.1** | Reconhecimento de ingredientes por foto |
| **v1.2** | Geração de receitas por IA |
| **v1.3** | Marketplace de ingredientes |
| **v2.0** | App nativo (React Native) |

### Escalabilidade

| Aspecto | Capacidade |
|---------|------------|
| **Banco de Dados** | Supabase escala automaticamente |
| **Backend** | Render suporta auto-scaling |
| **Frontend** | Vercel CDN global |
| **Arquitetura** | Stateless, pronto para containers |

---

## 🔑 Informações de Acesso

### URLs de Produção

| Recurso | URL |
|---------|-----|
| **Aplicação** | https://chefex.vercel.app |
| **API** | https://chefex-api.onrender.com |
| **Health Check** | https://chefex-api.onrender.com/health |

### Repositório

| Plataforma | URL |
|------------|-----|
| **GitHub** | https://github.com/marcos167/app |

---

## 📄 Anexos

### A. Modelo de Dados (Principais Entidades)

```
User
├── id (PK)
├── email (unique)
├── full_name
├── avatar_url
├── google_id
├── provider (local/google)
├── role (user/admin/moderator)
├── plan_tier (free/masterchef)
├── stripe_customer_id
└── created_at

Recipe
├── id (PK)
├── title
├── description
├── image
├── time
├── calories
├── servings
├── difficulty
├── category
├── ingredients (JSON)
├── instructions (JSON)
├── tags (JSON)
├── rating
├── reviews
├── reactions (love/like/dislike)
├── is_premium
├── video_url
├── author
├── status (published/draft)
└── created_at

Comment
├── id (PK)
├── recipe_id (FK)
├── user_id (FK)
├── content
├── rating
├── images (JSON)
└── created_at

WeeklyPlan
├── id (PK)
├── user_id (FK)
├── week_start_date
└── [day]_recipe_ids (JSON) x7

SupportTicket
├── id (PK)
├── user_id (FK)
├── status (bot/in_queue/resolved)
├── created_at
└── updated_at

SupportMessage
├── id (PK)
├── ticket_id (FK)
├── sender (user/bot/support)
└── content

Follower
├── id (PK)
├── follower_id (FK)
├── following_id (FK)
└── created_at

ModerationLog
├── id (PK)
├── user_id (FK)
├── content_type
├── content_id
├── flagged_reason
├── ai_score
├── status
└── created_at
```

### B. Dependências Completas

#### Frontend (package.json)
- @ducanh2912/next-pwa
- @react-oauth/google
- @supabase/supabase-js
- bcryptjs
- date-fns
- framer-motion
- jose
- lucide-react
- next (16.0.10)
- react (19.2.1)
- react-beautiful-dnd
- react-dropzone
- recharts
- sharp
- zod

#### Backend (requirements.txt)
- 60+ dependências Python
- FastAPI, SQLModel, SQLAlchemy
- OpenAI, Stripe, Google Auth
- Pydantic, Uvicorn, Passlib

---

**Documento gerado em**: 22 de Dezembro de 2024  
**Versão da Documentação**: 1.0  
**Versão do Produto**: 1.0.0

---

*© 2024 Chefex. Todos os direitos reservados.*
