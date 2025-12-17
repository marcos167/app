from sqlmodel import SQLModel, create_engine, Session

import os

# Use SQLite for persistence in dev, or switch to Postgres url in .env
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# Check for DATABASE_URL (Supabase/Vercel)
database_url = os.getenv("DATABASE_URL")

# If DATABASE_URL is present, we use it. 
# Note: SQLModel (SQLAlchemy) requires 'postgresql://' but some providers give 'postgres://'
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

connection_string = database_url if database_url else sqlite_url

connect_args = {"check_same_thread": False} if "sqlite" in connection_string else {}

engine = create_engine(connection_string, connect_args=connect_args)

def create_db_and_tables():
    from server import models # Ensure models are registered
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
