"""
Admin Panel - Monetization Control
Allows admins to manage platform phases and trigger retroactive conversion
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

from server.db import get_session
from server.models.monetization import (
    PlatformSettings,
    UserContributionPoints,
    FinancialLedger,
    FinancialTransaction,
    FinancialTransactionType,
    MonetizationPhase
)
from server.models.user import User
from server.api.deps import get_current_user

router = APIRouter()


# ============================================================================
# SCHEMAS
# ============================================================================

class PlatformSettingsUpdate(BaseModel):
    """Schema for updating platform settings"""
    monetization_enabled: Optional[bool] = None
    current_phase: Optional[MonetizationPhase] = None
    points_to_currency_rate: Optional[float] = None
    max_monthly_payout_per_user: Optional[float] = None
    min_withdrawal_amount: Optional[float] = None


class RetroactiveConversionStats(BaseModel):
    """Stats from retroactive conversion execution"""
    users_converted: int
    total_points_converted: int
    total_brl_distributed: float
    average_initial_balance: float


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def check_admin_permission(user: User):
    """Verify user has admin role"""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )


def get_level_multiplier(level: int, settings: PlatformSettings) -> float:
    """Get multiplier for a given level"""
    multipliers = settings.level_multipliers
    return multipliers.get(str(level), 1.0)


def calculate_initial_balance(
    points: int,
    level: int,
    settings: PlatformSettings
) -> Decimal:
    """
    Calculate initial balance based on accumulated points and level
    
    Formula: (Points / 100) × Multiplier
    """
    base_value = points * settings.points_to_currency_rate
    multiplier = get_level_multiplier(level, settings)
    return Decimal(str(base_value * multiplier)).quantize(Decimal('0.01'))


# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

@router.get("/admin/monetization/settings")
async def get_monetization_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get current platform monetization settings (admin only)"""
    check_admin_permission(current_user)
    
    settings = db.query(PlatformSettings).first()
    if not settings:
        settings = PlatformSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings


@router.patch("/admin/monetization/settings")
async def update_monetization_settings(
    updates: PlatformSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Update platform monetization settings (admin only)"""
    check_admin_permission(current_user)
    
    settings = db.query(PlatformSettings).first()
    if not settings:
        settings = PlatformSettings()
        db.add(settings)
    
    # Track if monetization is being enabled for the first time
    was_disabled = not settings.monetization_enabled
    
    # Update fields
    if updates.monetization_enabled is not None:
        settings.monetization_enabled = updates.monetization_enabled
        if was_disabled and updates.monetization_enabled:
            settings.phase_activated_at = datetime.utcnow()
    
    if updates.current_phase is not None:
        settings.current_phase = updates.current_phase
    
    if updates.points_to_currency_rate is not None:
        settings.points_to_currency_rate = updates.points_to_currency_rate
    
    if updates.max_monthly_payout_per_user is not None:
        settings.max_monthly_payout_per_user = updates.max_monthly_payout_per_user
    
    if updates.min_withdrawal_amount is not None:
        settings.min_withdrawal_amount = updates.min_withdrawal_amount
    
    settings.updated_by_admin_id = current_user.id
    
    db.commit()
    db.refresh(settings)
    
    return {
        "success": True,
        "message": "Settings updated successfully",
        "settings": settings,
        "trigger_conversion": was_disabled and updates.monetization_enabled
    }


@router.post("/admin/monetization/retroactive-conversion", response_model=RetroactiveConversionStats)
async def execute_retroactive_conversion(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """
    Execute retroactive conversion for all users
    
    Converts accumulated points to initial financial balance
    Should be run once when monetization is first activated
    """
    check_admin_permission(current_user)
    
    settings = db.query(PlatformSettings).first()
    if not settings or not settings.monetization_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Monetization must be enabled before running conversion"
        )
    
    # Get all users with points
    users_with_points = db.query(UserContributionPoints).filter(
        UserContributionPoints.total_points > 0
    ).all()
    
    stats = {
        "users_converted": 0,
        "total_points_converted": 0,
        "total_brl_distributed": 0.0,
        "balances": []
    }
    
    for user_points in users_with_points:
        # Calculate initial balance
        initial_balance = calculate_initial_balance(
            user_points.total_points,
            user_points.current_level,
            settings
        )
        
        if initial_balance <= 0:
            continue
        
        # Get or create financial ledger
        ledger = db.query(FinancialLedger).filter(
            FinancialLedger.user_id == user_points.user_id
        ).first()
        
        if not ledger:
            ledger = FinancialLedger(user_id=user_points.user_id)
            db.add(ledger)
        
        # Add initial balance
        ledger.balance_brl += initial_balance
        ledger.lifetime_earnings_brl += initial_balance
        
        # Create transaction record
        transaction = FinancialTransaction(
            financial_ledger_id=ledger.id if ledger.id else 0,  # Will update after commit
            user_id=user_points.user_id,
            amount_brl=initial_balance,
            transaction_type=FinancialTransactionType.RETROACTIVE_BONUS,
            description=f"Retroactive conversion: {user_points.total_points} points (Level {user_points.current_level}, {get_level_multiplier(user_points.current_level, settings)}x multiplier)",
            status="completed",
            processed_at=datetime.utcnow()
        )
        db.add(transaction)
        
        # Update stats
        stats["users_converted"] += 1
        stats["total_points_converted"] += user_points.total_points
        stats["total_brl_distributed"] += float(initial_balance)
        stats["balances"].append(float(initial_balance))
    
    db.commit()
    
    # Calculate average
    avg_balance = (
        stats["total_brl_distributed"] / stats["users_converted"]
        if stats["users_converted"] > 0
        else 0.0
    )
    
    return RetroactiveConversionStats(
        users_converted=stats["users_converted"],
        total_points_converted=stats["total_points_converted"],
        total_brl_distributed=round(stats["total_brl_distributed"], 2),
        average_initial_balance=round(avg_balance, 2)
    )


@router.get("/admin/monetization/stats")
async def get_monetization_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get global monetization statistics (admin only)"""
    check_admin_permission(current_user)
    
    stats = {
        "total_users_with_points": db.query(func.count(UserContributionPoints.id)).filter(
            UserContributionPoints.total_points > 0
        ).scalar(),
        "total_points_distributed": db.query(func.sum(UserContributionPoints.total_points)).scalar() or 0,
        "average_points_per_user": db.query(func.avg(UserContributionPoints.total_points)).scalar() or 0,
        "users_with_financial_accounts": db.query(func.count(FinancialLedger.id)).scalar(),
        "total_balance_brl": float(db.query(func.sum(FinancialLedger.balance_brl)).scalar() or 0),
        "total_withdrawn_brl": float(db.query(func.sum(FinancialLedger.total_withdrawn_brl)).scalar() or 0),
        "level_distribution": {}
    }
    
    # Level distribution
    level_counts = db.query(
        UserContributionPoints.current_level,
        func.count(UserContributionPoints.id)
    ).group_by(UserContributionPoints.current_level).all()
    
    stats["level_distribution"] = {
        f"level_{level}": count for level, count in level_counts
    }
    
    return stats
