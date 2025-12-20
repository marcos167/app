"""
Database configuration for Chefex
Production: Supabase PostgreSQL
"""
from sqlmodel import SQLModel, create_engine, Session
from server.core.config import get_settings

settings = get_settings()

# PostgreSQL engine with production-ready configuration
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,      # Check connection health before using
    pool_size=10,            # Number of connections to keep open
    max_overflow=20,         # Extra connections when pool is full
    pool_recycle=3600,       # Recycle connections after 1 hour
    echo=settings.DEBUG      # Log SQL in debug mode
)

def create_db_and_tables():
    """
    Create database tables
    Note: Tables are created via Prisma/Supabase SQL
    This function is kept for compatibility
    """
    # Uncomment if you want to auto-create tables:
    # from server import models
    # SQLModel.metadata.create_all(engine)
    pass

def get_session():
    """Get database session for dependency injection"""
    with Session(engine) as session:
        yield session
