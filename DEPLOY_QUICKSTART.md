# 🚀 Quick Start - Deploy to Production

## Prerequisites
- GitHub account
- Vercel account
- Railway account  
- Neon account (PostgreSQL)

---

## Step 1: Database (5 minutes)

```bash
# 1. Create database at neon.tech
# 2. Copy connection string
# 3. Apply migrations

DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

## Step 2: Backend - Railway (10 minutes)

```bash
# 1. Connect GitHub repo
# 2. Set environment variables:

DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key-32-chars-min
GOOGLE_CLIENT_ID=...
OPENAI_API_KEY=...
ALLOWED_ORIGINS=https://chefex.vercel.app
DEBUG=false
LOG_LEVEL=INFO

# 3. Deploy automatically
# 4. Copy URL: https://chefex-api.railway.app
```

---

## Step 3: Frontend - Vercel (5 minutes)

```bash
# 1. Connect GitHub repo
# 2. Set environment variables:

NEXT_PUBLIC_API_URL=https://chefex-api.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...

# 3. Deploy automatically
# 4. Visit: https://chefex.vercel.app
```

---

## Step 4: Configure Google OAuth (3 minutes)

```bash
# 1. Go to: https://console.cloud.google.com/apis/credentials
# 2. Add to "Authorized JavaScript origins":
#    - https://chefex.vercel.app
# 3. Save
```

---

## Step 5: Test (5 minutes)

```bash
# Backend health check
curl https://chefex-api.railway.app/health

# Frontend
# Visit: https://chefex.vercel.app
# Test Google Login
```

---

## Total Time: ~30 minutes

**Done! Your app is live! 🎉**

---

## Troubleshooting

### "Cannot connect to database"
- Verify `DATABASE_URL` in Railway
- Check Neon database is running

### "CORS error"
- Add Vercel URL to `ALLOWED_ORIGINS` in Railway
- Redeploy backend

### "Google Login fails"
- Verify `GOOGLE_CLIENT_ID` in both Railway and Vercel
- Check "Authorized JavaScript origins" in Google Console

---

For detailed instructions, see: [step_by_step_deploy.md](file:///C:/Users/--/.gemini/antigravity/brain/dde36443-486d-4a5a-a76d-3e3ab976d63d/step_by_step_deploy.md)
