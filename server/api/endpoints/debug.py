
from fastapi import APIRouter
import stripe

router = APIRouter()

@router.get("/debug_ping")
def debug_ping():
    return {"message": "pong"}
