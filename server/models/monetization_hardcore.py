"""
Hardcore Monetization System - Database Models
Restrictive, merit-based monetization where financial payouts are exceptional
"""

from sqlmodel import SQLModel, Field, Column, JSON
from sqlalchemy import Enum as SQLEnum
from datetime import datetime
from enum import Enum
from typing import Optional


# ============================================================================
# ENUMS
# ============================================================================

class ApplicationStatus(str, Enum):
    """Application review status"""
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVOKED = "revoked"


class ChallengeType(str, Enum):
    """Types of monetization challenges"""
    IMPACT_REAL = "impact_real"  # Recipe made by 50 people, <R$20, 4.5+ rating
    EDUCATION = "education"  # Educational series on selling food legally
    COMMUNITY = "community"  # 30 validated helpful comments


# ============================================================================
# ELIGIBILITY TRACKING
# ============================================================================

class MonetizationEligibilityCriteria(SQLModel, table=True):
    """
    Tracks user's progress toward monetization eligibility.
    All criteria must be met before user can apply.
    """
    __tablename__ = "monetization_eligibility"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", unique=True, index=True)
    
    # ===== TIME BARRIERS =====
    account_created_at: datetime = Field(default_factory=datetime.utcnow)
    account_age_days: int = Field(default=0)  # Calculated field
    posts_distributed: bool = Field(default=False)  # Anti-spike detection
    
    # ===== CONTENT BARRIERS =====
    original_recipes_count: int = Field(default=0)
    videos_count: int = Field(default=0)
    moderation_violations: int = Field(default=0)
    
    # ===== COMMUNITY BARRIERS =====
    real_followers_count: int = Field(default=0)  # Excluding bots/suspicious
    engagement_rate: float = Field(default=0.0)  # Likes+comments / followers
    validated_helpful_comments: int = Field(default=0)
    
    # ===== IMPACT BARRIERS =====
    recipe_executions_by_others: int = Field(default=0)  # Others made your recipes
    average_rating: float = Field(default=0.0)
    accessible_content_ratio: float = Field(default=0.0)  # % recipes under R$20
    
    # ===== TRUST BARRIERS =====
    fraud_score: float = Field(default=0.0)  # 0-100, must be < 20
    last_suspicious_event: Optional[datetime] = None
    days_since_suspicious: int = Field(default=999)  # Calculated
    
    # ===== CHALLENGES =====
    challenges_completed: list = Field(default=[], sa_column=Column(JSON))
    
    # ===== COMPUTED STATUS =====
    is_eligible: bool = Field(default=False)
    eligibility_checked_at: datetime = Field(default_factory=datetime.utcnow)
    
    # ===== METADATA =====
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# APPLICATION SYSTEM
# ============================================================================

class MonetizationApplication(SQLModel, table=True):
    """
    User applications for monetization approval.
    Requires manual admin review - NO automatic approvals.
    """
    __tablename__ = "monetization_applications"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    
    # ===== STATUS =====
    status: ApplicationStatus = Field(
        default=ApplicationStatus.PENDING,
        sa_column=Column(SQLEnum(ApplicationStatus))
    )
    
    # ===== ELIGIBILITY SNAPSHOT =====
    # Frozen snapshot of user's eligibility at application time
    eligibility_snapshot: dict = Field(sa_column=Column(JSON))
    
    # ===== ADMIN REVIEW =====
    reviewed_by: Optional[int] = Field(default=None, foreign_key="users.id")
    reviewed_at: Optional[datetime] = None
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    
    # ===== APPROVAL DETAILS (if approved) =====
    monthly_cap_brl: Optional[float] = None  # Max payout per month
    payment_schedule: Optional[str] = None  # "quarterly"
    retention_percentage: Optional[float] = None  # % retained for security
    approved_at: Optional[datetime] = None
    
    # ===== REAPPLICATION RULES =====
    can_reapply_after: Optional[datetime] = None  # Block reapplication for 30 days
    
    # ===== REVOCATION =====
    revoked_at: Optional[datetime] = None
    revocation_reason: Optional[str] = None
    
    # ===== METADATA =====
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# CHALLENGE SYSTEM
# ============================================================================

class MonetizationChallenge(SQLModel, table=True):
    """
    Defines official Chefex challenges that users must complete.
    Challenges are required for monetization eligibility.
    """
    __tablename__ = "monetization_challenges"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    challenge_type: ChallengeType = Field(sa_column=Column(SQLEnum(ChallengeType)))
    
    # ===== CHALLENGE DETAILS =====
    title: str
    description: str
    requirements: dict = Field(sa_column=Column(JSON))
    # Example requirements:
    # {
    #   "recipe_executions": 50,
    #   "max_cost_brl": 20,
    #   "min_rating": 4.5
    # }
    
    # ===== STATUS =====
    is_active: bool = Field(default=True)
    
    # ===== METADATA =====
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserChallengeProgress(SQLModel, table=True):
    """
    Tracks individual user progress on specific challenges.
    """
    __tablename__ = "user_challenge_progress"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    challenge_id: int = Field(foreign_key="monetization_challenges.id")
    
    # ===== PROGRESS TRACKING =====
    progress: dict = Field(sa_column=Column(JSON))
    # Example progress:
    # {
    #   "recipe_executions": 23,
    #   "current_cost": 18.50,
    #   "current_rating": 4.3
    # }
    
    # ===== COMPLETION =====
    completed: bool = Field(default=False)
    completed_at: Optional[datetime] = None
    
    # ===== METADATA =====
    started_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# ELIGIBILITY REQUIREMENTS (CONSTANTS)
# ============================================================================

ELIGIBILITY_REQUIREMENTS = {
    "time": {
        "min_account_age_days": 90,
        "posts_must_be_distributed": True
    },
    "content": {
        "min_recipes": 30,
        "min_videos": 10,
        "max_violations": 0
    },
    "community": {
        "min_followers": 1000,
        "min_engagement_rate": 0.05,  # 5%
        "min_helpful_comments": 30
    },
    "impact": {
        "min_executions": 100,
        "min_avg_rating": 4.5,
        "min_accessible_ratio": 0.3  # 30% recipes under R$20
    },
    "trust": {
        "max_fraud_score": 20,
        "min_clean_days": 60
    },
    "challenges": {
        "required_challenges": [
            ChallengeType.IMPACT_REAL,
            ChallengeType.EDUCATION,
            ChallengeType.COMMUNITY
        ]
    }
}
