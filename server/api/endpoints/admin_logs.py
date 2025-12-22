"""
Admin Logs Endpoint - Audit trail for administrative actions
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, Field, SQLModel, select
from pydantic import BaseModel

from server.db import get_session
from server.api.deps import get_current_admin, get_current_active_user
from server.models import User

router = APIRouter()

# ============== MODEL ==============

class AdminLog(SQLModel, table=True):
    """Stores all administrative actions for audit purposes"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    action: str = Field(index=True)  # CREATE_RECIPE, DELETE_USER, BAN_USER, etc.
    details: str = ""  # JSON or text description of what was done
    target_type: Optional[str] = None  # "recipe", "user", "comment", etc.
    target_id: Optional[int] = None  # ID of affected entity
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============== SCHEMAS ==============

class AdminLogResponse(BaseModel):
    id: int
    action: str
    details: str
    ip: Optional[str]
    createdAt: str
    user: dict

class CreateLogRequest(BaseModel):
    action: str
    details: str
    target_type: Optional[str] = None
    target_id: Optional[int] = None

# ============== HELPER FUNCTION ==============

async def log_admin_action(
    session: Session,
    user_id: int,
    action: str,
    details: str,
    target_type: Optional[str] = None,
    target_id: Optional[int] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
):
    """
    Helper function to log admin actions.
    Call this from any admin endpoint to track actions.
    """
    log = AdminLog(
        user_id=user_id,
        action=action,
        details=details,
        target_type=target_type,
        target_id=target_id,
        ip_address=ip_address,
        user_agent=user_agent
    )
    session.add(log)
    session.commit()
    return log

# ============== ENDPOINTS ==============

@router.get("/admin/logs", response_model=List[AdminLogResponse])
async def get_admin_logs(
    limit: int = 100,
    offset: int = 0,
    action_filter: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin)
):
    """
    Get all admin logs (Admin only).
    Returns audit trail of administrative actions.
    """
    query = select(AdminLog).order_by(AdminLog.created_at.desc())
    
    if action_filter:
        query = query.where(AdminLog.action == action_filter)
    
    query = query.offset(offset).limit(limit)
    logs = session.exec(query).all()
    
    # Format response with user info
    result = []
    for log in logs:
        user = session.get(User, log.user_id)
        result.append(AdminLogResponse(
            id=log.id,
            action=log.action,
            details=log.details,
            ip=log.ip_address,
            createdAt=log.created_at.isoformat(),
            user={
                "name": user.full_name if user else "Unknown",
                "email": user.email if user else "unknown@example.com",
                "image": user.avatar_url if user else None
            }
        ))
    
    return result

@router.post("/admin/logs")
async def create_admin_log(
    request: Request,
    log_data: CreateLogRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin)
):
    """
    Manually create an admin log entry.
    Usually called automatically by other admin endpoints.
    """
    ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    
    log = await log_admin_action(
        session=session,
        user_id=current_user.id,
        action=log_data.action,
        details=log_data.details,
        target_type=log_data.target_type,
        target_id=log_data.target_id,
        ip_address=ip,
        user_agent=user_agent
    )
    
    return {"success": True, "log_id": log.id}

@router.get("/admin/logs/actions")
async def get_log_action_types(
    current_user: User = Depends(get_current_admin)
):
    """
    Get available action types for filtering.
    """
    return {
        "actions": [
            "CREATE_RECIPE",
            "UPDATE_RECIPE",
            "DELETE_RECIPE",
            "PUBLISH_RECIPE",
            "UNPUBLISH_RECIPE",
            "CREATE_USER",
            "UPDATE_USER",
            "DELETE_USER",
            "BAN_USER",
            "UNBAN_USER",
            "UPDATE_USER_ROLE",
            "DELETE_COMMENT",
            "APPROVE_MONETIZATION",
            "REJECT_MONETIZATION",
            "SYSTEM_CONFIG_CHANGE",
            "EXPORT_DATA",
            "LOGIN_ADMIN"
        ]
    }
