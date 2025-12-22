"""
Production-ready configuration for Chefex Backend
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    """Application settings"""
    
    # App
    APP_NAME: str = "Chefex API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    ALLOWED_ORIGINS: str = "https://chefex.vercel.app,http://localhost:3000"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # External APIs
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str | None = None
    OPENAI_API_KEY: str
    STRIPE_SECRET_KEY: str | None = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

# Create a settings instance for backward compatibility
# This allows imports like: from server.core.config import settings
settings = get_settings()

