from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import logging

from server.db import create_db_and_tables
from server.core.config import get_settings
from server.core.logging import setup_logging
from dotenv import load_dotenv

load_dotenv()

from server.api.endpoints import (
    auth, recipes, payment, debug, support, social, monetization, 
    admin_monetization, monetization_hardcore, admin_monetization_hardcore, 
    analytics, reports, notifications, ai_assistant, gamification, upload, comments,
    admin_logs
)

# Initialize settings and logging
settings = get_settings()
setup_logging(settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="API oficial do Chefex — Axis Software",
    version=settings.APP_VERSION,
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
)

# Middleware - GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Middleware - CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "app": settings.APP_NAME
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Chefex API",
        "version": settings.APP_VERSION,
        "docs": "/api/docs" if settings.DEBUG else "disabled"
    }

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
app.include_router(admin_logs.router, prefix="/api", tags=["admin_logs"])

# Startup event
@app.on_event("startup")
async def startup():
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Allowed origins: {settings.allowed_origins_list}")
    create_db_and_tables()

# Shutdown event
@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down application")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
