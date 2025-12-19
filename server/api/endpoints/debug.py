from fastapi import APIRouter
import stripe

router = APIRouter()

@router.get("/debug_ping")
def debug_ping():
    return {"message": "pong"}

@router.get("/debug/test")
def test_endpoint():
    return {"status": "ok", "message": "API is working"}

@router.get("/debug/cors-test")
def cors_test():
    """Test endpoint to verify CORS is working"""
    return {
        "status": "success",
        "message": "If you can see this, CORS is configured correctly!",
        "cors": "enabled"
    }
