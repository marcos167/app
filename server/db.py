from sqlmodel import SQLModel, create_engine, Session

# Use SQLite for persistence in dev, or switch to Postgres url in .env
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    from server import models # Ensure models are registered
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
