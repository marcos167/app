from fastapi import APIRouter
from sqlmodel import Session, select, text
from server.db import engine
import os
import sys

router = APIRouter()

@router.get("/debug")
def debug_status():
    status = {
        "python_version": sys.version,
        "env_vars_check": {
            "DATABASE_URL": "PRESENT" if os.getenv("DATABASE_URL") else "MISSING",
            "GOOGLE_CLIENT_ID": "PRESENT" if os.getenv("GOOGLE_CLIENT_ID") else "MISSING",
        },
        "db_connection": "UNKNOWN",
        "error": None
    }
    
    try:
        with Session(engine) as session:
            # Try a simple query
            result = session.exec(text("SELECT 1")).first()
            status["db_connection"] = f"SUCCESS (Result: {result})"
    except Exception as e:
        status["db_connection"] = "FAILED"
        status["error"] = str(e)
        
    return status
