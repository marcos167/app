from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.db import create_db_and_tables
from dotenv import load_dotenv
load_dotenv()
from server.api.endpoints import (
    auth, recipes, payment, debug, support, social, monetization, 
    admin_monetization, monetization_hardcore, admin_monetization_hardcore, 
    analytics, reports, notifications, ai_assistant, gamification, upload, comments
)

app = FastAPI(
    title="Chefex API",
    description="API oficial do Chefex — Axis Software",
    version="1.0.0"
)

# CORS Configuration - Permissive for Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:3000|http://127\.0\.0\.1:3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# ...

# Routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(recipes.router, prefix="/api", tags=["recipes"])
app.include_router(payment.router, prefix="/api", tags=["payment"])
app.include_router(debug.router, prefix="/api", tags=["debug"])
app.include_router(support.router, prefix="/api/support", tags=["support"])
app.include_router(social.router, prefix="/api", tags=["social"])
app.include_router(monetization.router, prefix="/api", tags=["monetization"])
app.include_router(admin_monetization.router, prefix="/api", tags=["admin"])
app.include_router(monetization_hardcore.router, prefix="/api", tags=["monetization_hardcore"])
app.include_router(admin_monetization_hardcore.router, prefix="/api", tags=["admin_hardcore"])
app.include_router(analytics.router, prefix="/api", tags=["analytics"])
app.include_router(reports.router, prefix="/api", tags=["reports"])
app.include_router(notifications.router, prefix="/api", tags=["notifications"])
app.include_router(ai_assistant.router, prefix="/api", tags=["ai"])
app.include_router(gamification.router, prefix="/api", tags=["gamification"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(comments.router, prefix="/api", tags=["comments"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
