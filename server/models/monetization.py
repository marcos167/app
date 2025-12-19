"""
Sustainable Monetization System - Database Models
Phase-based monetization with contribution points and retroactive conversion
"""

from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlmodel import Field, SQLModel, Column, JSON
from decimal import Decimal


class MonetizationPhase(str, Enum):
    """Global platform monetization phases"""
    COMMUNITY = "community"  # 🟡 Pontos + Impacto
    ACTIVE = "active"  # 🟢 Pagamentos Liberados
    PARTNERSHIPS = "partnerships"  # 🔵 Parcerias & Fundos


class PlatformSettings(SQLModel, table=True):
    """
    Global platform configuration (singleton table)
    Controls monetization activation and conversion rates
    """
    __tablename__ = "platform_settings"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Monetization Control
    monetization_enabled: bool = Field(default=False)
    current_phase: str = Field(default="community")
    
    # Conversion Rates
    points_to_currency_rate: float = Field(default=0.001)  # 1000 pontos = R$ 1.00
    
    # Safety Limits
    max_monthly_payout_per_user: float = Field(default=500.0)
    min_withdrawal_amount: float = Field(default=50.0)
    
    # Level Multipliers (JSON)
    level_multipliers: dict = Field(default={
        "1": 1.0, "2": 1.0, "3": 1.2, "4": 1.2,
        "5": 1.5, "6": 1.5, "7": 2.0, "8": 2.0,
        "9": 2.5, "10": 2.5
    }, sa_column=Column(JSON))
    
    # Metadata
    phase_activated_at: Optional[datetime] = None
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    updated_by_admin_id: Optional[int] = None


class UserContributionPoints(SQLModel, table=True):
    """
    User contribution points and gamification data
    Tracks points, levels, XP, and social impact
    """
    __tablename__ = "user_contribution_points"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(unique=True, index=True)
    
    # Points
    total_points: int = Field(default=0)
    available_points: int = Field(default=0)
    
    # Levels & XP
    current_level: int = Field(default=1)
    xp_current: int = Field(default=0)
    xp_next_level: int = Field(default=100)
    
    # Social Impact Metrics
    recipes_shared: int = Field(default=0)
    reels_posted: int = Field(default=0)
    people_helped: int = Field(default=0)
    community_rank: Optional[int] = None
    
    # Badges (JSON array)
    badges: List[str] = Field(default=[], sa_column=Column(JSON))
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PointsActionType(str, Enum):
    """Types of point-earning actions"""
    RECIPE_PUBLISHED = "recipe_published"
    REEL_POSTED = "reel_posted"
    POST_CREATED = "post_created"
    ENGAGEMENT_RECEIVED = "engagement_received"
    DAILY_LOGIN = "daily_login"
    PROFILE_COMPLETED = "profile_completed"
    FIRST_FOLLOWER = "first_follower"
    MILESTONE_REACHED = "milestone_reached"
    CONVERSION_TO_CURRENCY = "conversion_to_currency"
    ADMIN_AWARD = "admin_award"
    ADMIN_PENALTY = "admin_penalty"


class PointsLedger(SQLModel, table=True):
    """
    Immutable audit log of all point transactions
    Enables fraud detection and transparency
    """
    __tablename__ = "points_ledger"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    
    # Transaction Details
    points_delta: int
    action_type: str
    description: str = Field(max_length=500)
    
    # Related Entity (optional)
    related_entity_type: Optional[str] = Field(default=None, max_length=50)
    related_entity_id: Optional[int] = None
    
    # Fraud Detection
    fraud_score: float = Field(default=0.0)
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)
    
    # Audit
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by_admin: bool = Field(default=False)


class FinancialLedger(SQLModel, table=True):
    """
    Financial ledger activated when monetization is enabled
    Tracks actual money balances and payouts
    """
    __tablename__ = "financial_ledger"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(unique=True, index=True)
    
    # Balances (in BRL)
    balance_brl: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    lifetime_earnings_brl: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    total_withdrawn_brl: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    
    # KYC & Compliance
    kyc_verified: bool = Field(default=False)
    kyc_verified_at: Optional[datetime] = None
    tax_id: Optional[str] = Field(default=None, max_length=20)
    
    # Payout Settings
    payout_enabled: bool = Field(default=False)
    payout_method: Optional[str] = Field(default=None, max_length=50)
    payout_details: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class FinancialTransactionType(str, Enum):
    """Types of financial transactions"""
    POINTS_CONVERSION = "points_conversion"
    RETROACTIVE_BONUS = "retroactive_bonus"
    PARTNERSHIP_EARNING = "partnership_earning"
    WITHDRAWAL = "withdrawal"
    REFUND = "refund"
    ADMIN_ADJUSTMENT = "admin_adjustment"


class FinancialTransaction(SQLModel, table=True):
    """
    Individual financial transaction records
    Immutable audit trail of all money movements
    """
    __tablename__ = "financial_transactions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    financial_ledger_id: int = Field(index=True)
    user_id: int = Field(index=True)
    
    # Transaction
    amount_brl: Decimal = Field(max_digits=10, decimal_places=2)
    transaction_type: str
    description: str = Field(max_length=500)
    
    # Related Points Transaction (if applicable)
    points_ledger_id: Optional[int] = None
    
    # Status
    status: str = Field(default="completed", max_length=20)
    
    # External Reference (for withdrawals)
    external_transaction_id: Optional[str] = Field(default=None, max_length=100)
    
    # Audit
    created_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
