"""
Hardcore Monetization - User API Endpoints
Restrictive monetization where users can only VIEW eligibility and APPLY (no guarantees)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from server.db import get_session
from server.api.deps import get_current_user
from server.models.user import User
from server.models.monetization_hardcore import (
    MonetizationApplication,
    ApplicationStatus,
    MonetizationChallenge,
    UserChallengeProgress
)
from server.services.eligibility_checker import EligibilityChecker

router = APIRouter()


# ============================================================================
# SCHEMAS
# ============================================================================

class EligibilityStatusResponse(BaseModel):
    """Detailed eligibility status (NO money amounts shown)"""
    is_eligible: bool
    criteria: Dict[str, Any]
    can_apply: bool
    next_milestone: str


class ApplicationSubmitRequest(BaseModel):
    """Application submission (user acknowledges no guarantee)"""
    acknowledge_no_guarantee: bool = False
    acknowledge_manual_review: bool = False


class ApplicationStatusResponse(BaseModel):
    """Current application status"""
    has_application: bool
    status: Optional[str] = None
    applied_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    can_reapply_after: Optional[datetime] = None
    
    # If approved
    monthly_cap_brl: Optional[float] = None
    payment_schedule: Optional[str] = None


class ChallengeResponse(BaseModel):
    """Challenge information"""
    id: int
    challenge_type: str
    title: str
    description: str
    requirements: Dict[str, Any]
    user_progress: Optional[Dict[str, Any]] = None
    completed: bool = False


# ============================================================================
# ELIGIBILITY ENDPOINTS
# ============================================================================

@router.get("/monetization/eligibility", response_model=EligibilityStatusResponse)
async def get_eligibility_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get current user's monetization eligibility status.
    
    Shows progress on all criteria WITHOUT showing money amounts.
    Emphasizes "eligibility to apply" not "guaranteed earnings".
    """
    checker = EligibilityChecker(db, current_user.id)
    status = checker.get_detailed_status()
    
    return EligibilityStatusResponse(**status)


# ============================================================================
# APPLICATION ENDPOINTS
# ============================================================================

@router.post("/monetization/apply", status_code=status.HTTP_201_CREATED)
async def submit_application(
    request: ApplicationSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Submit application for monetization.
    
    STRICT RULES:
    - User must meet ALL eligibility criteria
    - User must acknowledge no guarantee of approval
    - User must acknowledge manual review process
    - Only ONE active application allowed
    - If rejected, must wait before reapplying
    """
    
    # Validate acknowledgments
    if not request.acknowledge_no_guarantee or not request.acknowledge_manual_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você deve reconhecer que não há garantia de aprovação e que a análise é manual"
        )
    
    # Check eligibility
    checker = EligibilityChecker(db, current_user.id)
    checker.update_criteria()
    
    if not checker.criteria.is_eligible:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não atende todos os critérios de elegibilidade"
        )
    
    # Check for existing application
    existing = db.query(MonetizationApplication).filter(
        MonetizationApplication.user_id == current_user.id,
        MonetizationApplication.status.in_([
            ApplicationStatus.PENDING,
            ApplicationStatus.UNDER_REVIEW,
            ApplicationStatus.APPROVED
        ])
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Você já possui uma aplicação ativa"
        )
    
    # Check if user can reapply (if previously rejected)
    rejected = db.query(MonetizationApplication).filter(
        MonetizationApplication.user_id == current_user.id,
        MonetizationApplication.status == ApplicationStatus.REJECTED,
        MonetizationApplication.can_reapply_after > datetime.utcnow()
    ).first()
    
    if rejected:
        days_left = (rejected.can_reapply_after - datetime.utcnow()).days
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Você pode reaplicar em {days_left} dias"
        )
    
    # Create eligibility snapshot
    snapshot = checker.get_detailed_status()
    
    # Create application
    application = MonetizationApplication(
        user_id=current_user.id,
        status=ApplicationStatus.PENDING,
        eligibility_snapshot=snapshot
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return {
        "message": "Aplicação enviada com sucesso. Aguarde análise manual do administrador.",
        "application_id": application.id,
        "status": "pending",
        "disclaimer": "Não há garantia de aprovação. A análise pode levar até 30 dias."
    }


@router.get("/monetization/application/status", response_model=ApplicationStatusResponse)
async def get_application_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get status of user's monetization application.
    
    Returns current status, admin notes if rejected, reapplication date.
    """
    application = db.query(MonetizationApplication).filter(
        MonetizationApplication.user_id == current_user.id
    ).order_by(MonetizationApplication.applied_at.desc()).first()
    
    if not application:
        return ApplicationStatusResponse(has_application=False)
    
    return ApplicationStatusResponse(
        has_application=True,
        status=application.status.value,
        applied_at=application.applied_at,
        reviewed_at=application.reviewed_at,
        admin_notes=application.admin_notes if application.status == ApplicationStatus.REJECTED else None,
        rejection_reason=application.rejection_reason,
        can_reapply_after=application.can_reapply_after,
        monthly_cap_brl=application.monthly_cap_brl if application.status == ApplicationStatus.APPROVED else None,
        payment_schedule=application.payment_schedule if application.status == ApplicationStatus.APPROVED else None
    )


# ============================================================================
# CHALLENGE ENDPOINTS
# ============================================================================

@router.get("/monetization/challenges", response_model=list[ChallengeResponse])
async def get_challenges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get all active challenges with user's progress.
    
    Challenges are REQUIRED for monetization eligibility.
    """
    challenges = db.query(MonetizationChallenge).filter(
        MonetizationChallenge.is_active == True
    ).all()
    
    result = []
    for challenge in challenges:
        # Get user progress
        progress = db.query(UserChallengeProgress).filter(
            UserChallengeProgress.user_id == current_user.id,
            UserChallengeProgress.challenge_id == challenge.id
        ).first()
        
        result.append(ChallengeResponse(
            id=challenge.id,
            challenge_type=challenge.challenge_type.value,
            title=challenge.title,
            description=challenge.description,
            requirements=challenge.requirements,
            user_progress=progress.progress if progress else None,
            completed=progress.completed if progress else False
        ))
    
    return result


# ============================================================================
# EDUCATIONAL ENDPOINT
# ============================================================================

@router.get("/monetization/info")
async def get_monetization_info():
    """
    Get information about monetization system.
    
    CRITICAL: This endpoint NEVER promises income.
    It explains the restrictive, merit-based system.
    """
    return {
        "philosophy": "Dinheiro no Chefex não é recompensa. É consequência de impacto comprovado.",
        "requirements": {
            "time": "Conta ativa há 90 dias com publicações distribuídas",
            "content": "30 receitas originais + 10 vídeos sem violações",
            "community": "1.000 seguidores reais com engajamento orgânico",
            "impact": "100 pessoas fizeram suas receitas com avaliação 4.5+",
            "trust": "Score antifraude baixo e sem eventos suspeitos",
            "challenges": "Completar 3 desafios oficiais Chefex"
        },
        "process": [
            "1. Atender TODOS os critérios de elegibilidade",
            "2. Completar os 3 desafios obrigatórios",
            "3. Aplicar para monetização (sem garantia)",
            "4. Aguardar análise manual do administrador",
            "5. Se aprovado: pagamentos trimestrais com teto mensal"
        ],
        "warnings": [
            "⚠️ Não há garantia de aprovação",
            "⚠️ Análise pode levar até 30 dias",
            "⚠️ Aprovação pode ser negada sem justificativa pública",
            "⚠️ Monetização pode ser revogada a qualquer momento",
            "⚠️ Pontos NÃO garantem dinheiro"
        ],
        "similar_to": [
            "YouTube Partner Program",
            "TikTok Creator Fund (modo hard)",
            "Plataformas educacionais sérias"
        ]
    }
