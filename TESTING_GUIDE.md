# Chefex v1.0.0 - Guia de Testes e Publicação

## 🧪 Executando Lighthouse Audit

### Usando Google Chrome DevTools

1. Abra o Chrome e navegue para `https://chefex.vercel.app`
2. Pressione `F12` para abrir DevTools
3. Vá para a aba **Lighthouse**
4. Marque todas as categorias:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
   - PWA
5. Selecione "Mobile" como dispositivo
6. Clique em "Analyze page load"
7. Screenshot do resultado deve mostrar pontuação 90+

### Usando CLI (Local)

```powershell
# Com servidor local rodando
npm run dev

# Em outro terminal
npx lighthouse http://localhost:3000 --view --output-path=./lighthouse-report.html
```

### Usando CLI (Produção)

```powershell
npx lighthouse https://chefex.vercel.app --view --output-path=./lighthouse-report.html
```

---

## 📸 Gerando Screenshots para Play Store

### Requisitos do Play Store

| Tipo | Dimensões | Quantidade |
|------|-----------|------------|
| Phone | 1080x1920 (9:16) | 2-8 |
| Tablet 7" | 1080x1920 | 1-8 |
| Tablet 10" | 1920x1200 | 1-8 |

### Páginas Recomendadas para Screenshots

1. **Feed Principal** (`/feed`)
   - Mostra receitas em destaque, categorias, cards
   
2. **Detalhes da Receita** (`/recipes/1`)
   - Hero image, ingredientes, modo de preparo
   
3. **Perfil do Usuário** (`/profile`)
   - Avatar, XP/nível, estatísticas, receitas
   
4. **Criar Receita** (`/create/recipe`)
   - Formulário de criação de conteúdo

### Como Capturar no Chrome

1. `F12` → DevTools
2. `Ctrl+Shift+M` → Toggle device toolbar
3. Selecione "Pixel 5" ou "iPhone 12 Pro"
4. Defina resolução personalizada: 1080x1920
5. Navegue para cada página
6. `Ctrl+Shift+P` → "Capture full size screenshot"

### Nomenclatura dos Arquivos

```
public/screenshots/
├── screenshot-1.png  (Feed)
├── screenshot-2.png  (Receita)
├── screenshot-3.png  (Perfil)
└── screenshot-4.png  (Criar)
```

---

## 🚀 Checklist de Publicação PWA

### Pré-requisitos

- [ ] Lighthouse PWA score > 90
- [ ] Manifest.json válido
- [ ] Service Worker funcionando
- [ ] HTTPS ativo
- [ ] Ícones em todos os tamanhos
- [ ] Screenshots capturados

### Bubblewrap (TWA para Play Store)

```bash
# Instalar Bubblewrap
npm install -g @anthropic-ai/anthropic-sdk

# Inicializar projeto TWA
mkdir chefex-twa && cd chefex-twa
bubblewrap init --manifest https://chefex.vercel.app/manifest.json

# Configurar assinatura
bubblewrap build

# Gerar APK/AAB
bubblewrap build --skipPwaValidation
```

### PWABuilder (Alternativa)

1. Vá para https://www.pwabuilder.com
2. Cole a URL: `https://chefex.vercel.app`
3. Clique "Start"
4. Revise os scores
5. Clique em "Package for stores"
6. Baixe o Android package

---

## 📋 Validação Final

### URLs para Testar

| Página | URL | Status |
|--------|-----|--------|
| Feed | `/feed` | ✅ |
| Explore | `/explore` | ✅ |
| Receita | `/recipes/1` | ✅ |
| Perfil | `/profile` | ✅ |
| Criar Receita | `/create/recipe` | ✅ NEW |
| Login | `/login` | ✅ |
| Signup | `/signup` | ✅ |
| Termos | `/legal/terms` | ✅ |
| Privacidade | `/legal/privacy` | ✅ |
| Monetização | `/legal/monetization` | ✅ |
| Antifraude | `/legal/antifraud` | ✅ NEW |
| Admin | `/admin` | ✅ (CEO only) |

### API Endpoints para Testar

```bash
# Health check
curl https://chefex-backend.onrender.com/health

# Listar receitas
curl https://chefex-backend.onrender.com/api/recipes

# Feed
curl https://chefex-backend.onrender.com/api/feed
```

---

## 🏷️ Criando Release v1.0.0

```bash
# Adicionar todas as alterações
git add .

# Commit com mensagem descritiva
git commit -m "chore: finalize v1.0.0 for production release

- Add rate limiting to auth endpoints
- Add feed, likes, saved, profile APIs
- Add XP/Level system to profile
- Add FloatingActionButton and ShareButton
- Add antifraud policy page
- Enhance PWA manifest and service worker
- Add offline page
- Remove hardcoded API keys
- Create CHANGELOG.md"

# Criar tag
git tag -a v1.0.0 -m "Chefex v1.0.0 - First Production Release"

# Push com tags
git push origin main --tags
```

---

## ✅ Conclusão

O Chefex v1.0.0 está pronto para publicação. Siga os passos acima para:

1. ✅ Rodar Lighthouse e atingir 90+
2. ✅ Capturar screenshots para Play Store
3. ✅ Gerar pacote TWA/AAB
4. ✅ Publicar no Google Play Console
