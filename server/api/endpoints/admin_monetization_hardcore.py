"""
Hardcore Monetization - Admin Review Endpoints
Manual approval system for monetization applications
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List

from server.db import get_session
from server.api.deps import get_current_user, check_admin_permission
from server.models.user import User
from server.models.monetization_hardcore import (
    MonetizationApplication,
    ApplicationStatus,
    MonetizationEligibilityCriteria
)

router = APIRouter()


# ============================================================================
# SCHEMAS
# ============================================================================

class ApplicationListItem(BaseModel):
    """Application summary for list view"""
    id: int
    user_id: int
    user_name: str
    user_email: str
    status: str
    applied_at: datetime
    eligibility_summary: dict


class ApplicationDetailResponse(BaseModel):
    """Full application details for review"""
    id: int
    user_id: int
    user_name: str
    user_email: str
    status: str
    applied_at: datetime
    eligibility_snapshot: dict
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


class ApproveApplicationRequest(BaseModel):
    """Approval with payout limits"""
    monthly_cap_brl: float = 500.0  # Default low cap
    payment_schedule: str = "quarterly"
    retention_percentage: float = 15.0  # 15% retention for security
    admin_notes: Optional[str] = None


class RejectApplicationRequest(BaseModel):
    """Rejection with blocking period"""
    rejection_reason: str
    block_reapplication_days: int = 30
    admin_notes: Optional[str] = None


class RevokeMonetizationRequest(BaseModel):
    """Revoke approved monetization"""
    revocation_reason: str
    admin_notes: Optional[str] = None


# ============================================================================
# APPLICATION REVIEW ENDPOINTS
# ============================================================================

@router.get("/admin/monetization/applications", response_model=List[ApplicationListItem])
async def list_applications(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    List all monetization applications.
    
    Admin can filter by status: pending, under_review, approved, rejected, revoked
    """
    check_admin_permission(current_user)
    
    query = db.query(MonetizationApplication)
    
    if status_filter:
        try:
            status_enum = ApplicationStatus(status_filter)
            query = query.filter(MonetizationApplication.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Status inválido: {status_filter}"
            )
    
    applications = query.order_by(MonetizationApplication.applied_at.desc()).all()
    
    result = []
    for app in applications:
        user = db.query(User).filter(User.id == app.user_id).first()
        
        # Create eligibility summary
        snapshot = app.eligibility_snapshot
        summary = {
            "all_met": snapshot.get("is_eligible", False),
            "account_age": snapshot.get("criteria", {}).get("time", {}).get("account_age_days", 0),
            "recipes": snapshot.get("criteria", {}).get("content", {}).get("recipes", 0),
            "followers": snapshot.get("criteria", {}).get("community", {}).get("followers", 0),
            "executions": snapshot.get("criteria", {}).get("impact", {}).get("executions", 0)
        }
        
        result.append(ApplicationListItem(
            id=app.id,
            user_id=app.user_id,
            user_name=user.name if user else "Unknown",
            user_email=user.email if user else "Unknown",
            status=app.status.value,
            applied_at=app.applied_at,
            eligibility_summary=summary
        ))
    
    return result


@router.get("/admin/monetization/applications/{application_id}", response_model=ApplicationDetailResponse)
async def get_application_detail(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get full details of a specific application for review.
    """
    check_admin_permission(current_user)
    
    app = db.query(MonetizationApplication).filter(
        MonetizationApplication.id == application_id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicação não encontrada"
        )
    
    user = db.query(User).filter(User.id == app.user_id).first()
    
    return ApplicationDetailResponse(
        id=app.id,
        user_id=app.user_id,
        user_name=user.name if user else "Unknown",
        user_email=user.email if user else "Unknown",
        status=app.status.value,
        applied_at=app.applied_at,
        eligibility_snapshot=app.eligibility_snapshot,
        reviewed_by=app.reviewed_by,
        reviewed_at=app.reviewed_at,
        admin_notes=app.admin_notes,
        rejection_reason=app.rejection_reason
    )


@router.post("/admin/monetization/applications/{application_id}/approve")
async def approve_application(
    application_id: int,
    request: ApproveApplicationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Approve monetization application.
    
    Sets payout limits and enables quarterly payments.
    """
    check_admin_permission(current_user)
    
    app = db.query(MonetizationApplication).filter(
        MonetizationApplication.id == application_id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicação não encontrada"
        )
    
    if app.status not in [ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aplicação já foi revisada"
        )
    
    # Validate limits
    if request.monthly_cap_brl < 100 or request.monthly_cap_brl > 5000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Teto mensal deve estar entre R$ 100 e R$ 5.000"
        )
    
    if request.retention_percentage < 0 or request.retention_percentage > 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Retenção deve estar entre 0% e 30%"
        )
    
    # Approve application
    app.status = ApplicationStatus.APPROVED
    app.reviewed_by = current_user.id
    app.reviewed_at = datetime.utcnow()
    app.approved_at = datetime.utcnow()
    app.monthly_cap_brl = request.monthly_cap_brl
    app.payment_schedule = request.payment_schedule
    app.retention_percentage = request.retention_percentage
    app.admin_notes = request.admin_notes
    app.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(app)
    
    return {
        "message": "Aplicação aprovada com sucesso",
        "application_id": app.id,
        "user_id": app.user_id,
        "monthly_cap_brl": app.monthly_cap_brl,
        "payment_schedule": app.payment_schedule,
        "retention_percentage": app.retention_percentage
    }


@router.post("/admin/monetization/applications/{application_id}/reject")
async def reject_application(
    application_id: int,
    request: RejectApplicationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Reject monetization application.
    
    Blocks reapplication for specified days.
    """
    check_admin_permission(current_user)
    
    app = db.query(MonetizationApplication).filter(
        MonetizationApplication.id == application_id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicação não encontrada"
        )
    
    if app.status not in [ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aplicação já foi revisada"
        )
    
    # Reject application
    app.status = ApplicationStatus.REJECTED
    app.reviewed_by = current_user.id
    app.reviewed_at = datetime.utcnow()
    app.rejection_reason = request.rejection_reason
    app.admin_notes = request.admin_notes
    app.can_reapply_after = datetime.utcnow() + timedelta(days=request.block_reapplication_days)
    app.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(app)
    
    return {
        "message": "Aplicação rejeitada",
        "application_id": app.id,
        "user_id": app.user_id,
        "rejection_reason": app.rejection_reason,
        "can_reapply_after": app.can_reapply_after
    }


@router.post("/admin/monetization/applications/{application_id}/revoke")
async def revoke_monetization(
    application_id: int,
    request: RevokeMonetizationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Revoke approved monetization.
    
    Used when user violates terms or engages in fraud.
    Maintains points but zeros financial access.
    """
    check_admin_permission(current_user)
    
    app = db.query(MonetizationApplication).filter(
        MonetizationApplication.id == application_id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicação não encontrada"
        )
    
    if app.status != ApplicationStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Apenas aplicações aprovadas podem ser revogadas"
        )
    
    # Revoke monetization
    app.status = ApplicationStatus.REVOKED
    app.revoked_at = datetime.utcnow()
    app.revocation_reason = request.revocation_reason
    app.admin_notes = request.admin_notes
    app.updated_at = datetime.utcnow()
    
    # TODO: Zero out financial ledger but maintain points
    
    db.commit()
    db.refresh(app)
    
    return {
        "message": "Monetização revogada",
        "application_id": app.id,
        "user_id": app.user_id,
        "revocation_reason": app.revocation_reason,
        "note": "Pontos mantidos, acesso financeiro zerado"
    }


# ============================================================================
# STATISTICS
# ============================================================================

@router.get("/admin/monetization/stats")
async def get_monetization_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get monetization system statistics.
    """
    check_admin_permission(current_user)
    
    total_applications = db.query(MonetizationApplication).count()
    pending = db.query(MonetizationApplication).filter(
        MonetizationApplication.status == ApplicationStatus.PENDING
    ).count()
    approved = db.query(MonetizationApplication).filter(
        MonetizationApplication.status == ApplicationStatus.APPROVED
    ).count()
    rejected = db.query(MonetizationApplication).filter(
        MonetizationApplication.status == ApplicationStatus.REJECTED
    ).count()
    revoked = db.query(MonetizationApplication).filter(
        MonetizationApplication.status == ApplicationStatus.REVOKED
    ).count()
    
    # Approval rate
    reviewed = approved + rejected
    approval_rate = (approved / reviewed * 100) if reviewed > 0 else 0
    
    # Eligible users
    eligible_users = db.query(MonetizationEligibilityCriteria).filter(
        MonetizationEligibilityCriteria.is_eligible == True
    ).count()
    
    return {
        "total_applications": total_applications,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "revoked": revoked,
        "approval_rate": round(approval_rate, 1),
        "eligible_users": eligible_users,
        "active_monetized_users": approved - revoked
    }
