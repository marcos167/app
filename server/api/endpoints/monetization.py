"""
Sustainable Monetization System - API Endpoints
Public platform status and user earnings management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

from server.db import get_session
from server.models.monetization import (
    PlatformSettings,
    UserContributionPoints,
    PointsLedger,
    FinancialLedger,
    MonetizationPhase,
    PointsActionType
)
from server.api.deps import get_current_user
from server.models.user import User

router = APIRouter()


# ============================================================================
# SCHEMAS
# ============================================================================

class PlatformStatusResponse(BaseModel):
    """Public platform monetization status"""
    phase: MonetizationPhase
    monetization_enabled: bool
    message: str
    features: Dict[str, bool]


class PointsInfo(BaseModel):
    """User points and gamification data"""
    total: int
    available: int
    level: int
    xp_current: int
    xp_next_level: int
    badges: List[str]


class ImpactInfo(BaseModel):
    """User social impact metrics"""
    recipes_shared: int
    reels_posted: int
    people_helped: int
    community_rank: Optional[int]


class FinancialInfo(BaseModel):
    """User financial data (only if monetization enabled)"""
    balance_brl: float
    lifetime_earnings_brl: float
    can_withdraw: bool
    kyc_verified: bool


class UserEarningsResponse(BaseModel):
    """Complete user earnings and impact data"""
    points: PointsInfo
    impact: ImpactInfo
    financial: Optional[FinancialInfo]


class PointsHistoryItem(BaseModel):
    """Single point transaction"""
    id: int
    points_delta: int
    action_type: PointsActionType
    description: str
    created_at: datetime


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_platform_settings(db: Session) -> PlatformSettings:
    """Get or create platform settings (singleton)"""
    settings = db.query(PlatformSettings).first()
    if not settings:
        settings = PlatformSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def get_or_create_user_points(db: Session, user_id: int) -> UserContributionPoints:
    """Get or create user contribution points record"""
    points = db.query(UserContributionPoints).filter(
        UserContributionPoints.user_id == user_id
    ).first()
    
    if not points:
        points = UserContributionPoints(user_id=user_id)
        db.add(points)
        db.commit()
        db.refresh(points)
    
    return points


def get_phase_message(phase: MonetizationPhase) -> str:
    """Get user-friendly message for current phase"""
    messages = {
        MonetizationPhase.COMMUNITY: (
            "Estamos na fase de construção da comunidade! "
            "Acumule pontos agora e esteja na frente quando a monetização ativar."
        ),
        MonetizationPhase.ACTIVE: (
            "A monetização está ativa! "
            "Converta seus pontos acumulados em saldo real e participe dos ganhos."
        ),
        MonetizationPhase.PARTNERSHIPS: (
            "Fase de parcerias ativa! "
            "Ganhe ainda mais através de colaborações com marcas e fundos de criadores."
        )
    }
    return messages.get(phase, "")


def get_phase_features(phase: MonetizationPhase) -> Dict[str, bool]:
    """Get enabled features for current phase"""
    return {
        "points_earning": True,  # Always enabled
        "levels_badges": True,  # Always enabled
        "financial_conversion": phase in [MonetizationPhase.ACTIVE, MonetizationPhase.PARTNERSHIPS],
        "withdrawals": phase in [MonetizationPhase.ACTIVE, MonetizationPhase.PARTNERSHIPS],
        "partnerships": phase == MonetizationPhase.PARTNERSHIPS,
    }


# ============================================================================
# PUBLIC ENDPOINTS
# ============================================================================

@router.get("/platform/status", response_model=PlatformStatusResponse)
async def get_platform_status(db: Session = Depends(get_session)):
    """
    Get current platform monetization status (PUBLIC)
    
    Returns phase, monetization status, and user-friendly message
    """
    settings = get_platform_settings(db)
    
    return PlatformStatusResponse(
        phase=settings.current_phase,
        monetization_enabled=settings.monetization_enabled,
        message=get_phase_message(settings.current_phase),
        features=get_phase_features(settings.current_phase)
    )


# ============================================================================
# PROTECTED ENDPOINTS (Require Authentication)
# ============================================================================

@router.get("/users/me/earnings", response_model=UserEarningsResponse)
async def get_my_earnings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get current user's earnings, points, and impact data
    
    Returns:
    - Points and gamification data (always)
    - Financial data (only if monetization enabled)
    """
    settings = get_platform_settings(db)
    user_points = get_or_create_user_points(db, current_user.id)
    
    # Always return points and impact
    response_data = {
        "points": PointsInfo(
            total=user_points.total_points,
            available=user_points.available_points,
            level=user_points.current_level,
            xp_current=user_points.xp_current,
            xp_next_level=user_points.xp_next_level,
            badges=user_points.badges or []
        ),
        "impact": ImpactInfo(
            recipes_shared=user_points.recipes_shared,
            reels_posted=user_points.reels_posted,
            people_helped=user_points.people_helped,
            community_rank=user_points.community_rank
        ),
        "financial": None
    }
    
    # Only include financial data if monetization is enabled
    if settings.monetization_enabled:
        financial_ledger = db.query(FinancialLedger).filter(
            FinancialLedger.user_id == current_user.id
        ).first()
        
        if not financial_ledger:
            # Create initial ledger when user first checks after activation
            financial_ledger = FinancialLedger(user_id=current_user.id)
            db.add(financial_ledger)
            db.commit()
            db.refresh(financial_ledger)
        
        response_data["financial"] = FinancialInfo(
            balance_brl=float(financial_ledger.balance_brl),
            lifetime_earnings_brl=float(financial_ledger.lifetime_earnings_brl),
            can_withdraw=(
                financial_ledger.kyc_verified and 
                financial_ledger.payout_enabled and
                financial_ledger.balance_brl >= settings.min_withdrawal_amount
            ),
            kyc_verified=financial_ledger.kyc_verified
        )
    
    return UserEarningsResponse(**response_data)


@router.get("/users/me/points/history", response_model=List[PointsHistoryItem])
async def get_points_history(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Get user's points transaction history
    
    Returns chronological list of point transactions
    """
    transactions = db.query(PointsLedger).filter(
        PointsLedger.user_id == current_user.id
    ).order_by(
        PointsLedger.created_at.desc()
    ).limit(limit).offset(offset).all()
    
    return [
        PointsHistoryItem(
            id=t.id,
            points_delta=t.points_delta,
            action_type=t.action_type,
            description=t.description,
            created_at=t.created_at
        )
        for t in transactions
    ]


# ============================================================================
# UTILITY FUNCTIONS (Internal use by other endpoints)
# ============================================================================

def award_points(
    db: Session,
    user_id: int,
    points: int,
    action_type: PointsActionType,
    description: str,
    related_entity_type: Optional[str] = None,
    related_entity_id: Optional[int] = None,
    ip_address: Optional[str] = None
) -> UserContributionPoints:
    """
    Award points to a user and create audit log
    
    Args:
        db: Database session
        user_id: User receiving points
        points: Number of points to award
        action_type: Type of action
        description: Human-readable description
        related_entity_type: Optional entity type (recipe, reel, post)
        related_entity_id: Optional entity ID
        ip_address: Optional IP for fraud detection
    
    Returns:
        Updated UserContributionPoints record
    """
    # Get or create user points
    user_points = get_or_create_user_points(db, user_id)
    
    # Update points
    user_points.total_points += points
    user_points.available_points += points
    
    # Check for level up
    user_points.xp_current += points
    while user_points.xp_current >= user_points.xp_next_level and user_points.current_level < 10:
        user_points.current_level += 1
        user_points.xp_current -= user_points.xp_next_level
        user_points.xp_next_level = int(user_points.xp_next_level * 1.5)  # Exponential growth
        
        # Award level-up badge
        level_badge = f"nivel_{user_points.current_level}"
        if level_badge not in user_points.badges:
            user_points.badges.append(level_badge)
    
    # Create audit log
    ledger_entry = PointsLedger(
        user_id=user_id,
        points_delta=points,
        action_type=action_type,
        description=description,
        related_entity_type=related_entity_type,
        related_entity_id=related_entity_id,
        ip_address=ip_address,
        fraud_score=0.0  # TODO: Implement fraud detection algorithm
    )
    
    db.add(ledger_entry)
    db.commit()
    db.refresh(user_points)
    
    return user_points
