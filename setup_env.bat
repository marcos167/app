@echo off
REM Setup Production Environment for Chefex

echo Creating .env file with production credentials...

(
echo # Database
echo DATABASE_URL=postgresql://chefex_user:...@ep-cool-name.neon.tech/chefex_prod?sslmode=require
echo.
echo # Security
echo SECRET_KEY=***REMOVED_SECRET***
echo ALGORITHM=HS256
echo ACCESS_TOKEN_EXPIRE_MINUTES=30
echo REFRESH_TOKEN_EXPIRE_DAYS=7
echo.
echo # External APIs
echo GOOGLE_CLIENT_ID=1019372792734-k6s58dq78pov4ktnhoiv9ddf3mkbjrf3.apps.googleusercontent.com
echo OPENAI_API_KEY=***REMOVED_OPENAI_KEY***
echo STRIPE_SECRET_KEY=***REMOVED_STRIPE_KEY***
echo.
echo # CORS
echo ALLOWED_ORIGINS=https://chefex.vercel.app,http://localhost:3000
echo.
echo # App Config
echo DEBUG=false
echo LOG_LEVEL=INFO
echo PORT=8000
echo HOST=0.0.0.0
echo.
echo # App Info
echo APP_NAME=Chefex API
echo APP_VERSION=1.0.0
) > .env

echo.
echo ✅ .env file created successfully!
echo.
echo Next steps:
echo 1. Run: npx prisma migrate dev --name add_performance_indexes
echo 2. Run: python scripts\test_backend.py
echo 3. Run: uvicorn server.main:app --reload
echo.
pause
