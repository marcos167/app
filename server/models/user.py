from typing import Optional
from datetime import datetime
from enum import Enum
from sqlmodel import Field, SQLModel
from pydantic import BaseModel

# Enum constants (for reference, but we use strings in DB for compatibility)
class Provider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"

class Role(str, Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"

class PlanTier(str, Enum):
    FREE = "free"
    MASTERCHEF = "masterchef"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: Optional[str] = None
    
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Google Fields - Using str instead of Enum for SQLite/PostgreSQL compatibility
    google_id: Optional[str] = Field(default=None, unique=True, index=True)
    provider: str = Field(default="google")  # "local" or "google"
    
    role: str = Field(default="user")  # "user" or "admin"
    plan_tier: str = Field(default="free")  # "free" or "masterchef"
    disabled: bool = False
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Auth & Security Fields
    email_verified: bool = False
    email_verification_token: Optional[str] = None
    email_verification_expires: Optional[datetime] = None
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None

    # Stripe Fields
    stripe_customer_id: Optional[str] = Field(default=None, index=True)
    stripe_subscription_id: Optional[str] = None
    plan_status: str = "active" # active, past_due, canceled, incomplete
    plan_current_period_end: Optional[datetime] = None

class Recipe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str = ""
    image: str = ""
    time: str = ""  # "30 min"
    calories: str = ""  # "350 kcal"
    servings: str = ""  # "4 porções"
    difficulty: str = "Fácil"  # Fácil, Médio, Difícil
    category: str = ""
    
    # JSON fields stored as strings
    ingredients: str = "[]"  # JSON array of strings
    instructions: str = "[]"  # JSON array of {step, text, timerMinutes?}
    tags: str = "[]"  # JSON array of strings
    
    # Ratings and reactions
    rating: float = 0.0
    reviews: int = 0
    reactions_love: int = 0
    reactions_like: int = 0
    reactions_dislike: int = 0
    
    # Premium Features
    is_premium: bool = False
    video_url: Optional[str] = None
    
    # Metadata
    author: Optional[str] = None
    source: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "published"

class WeeklyPlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    week_start_date: datetime
    monday_recipe_ids: str = "[]" 
    tuesday_recipe_ids: str = "[]"
    wednesday_recipe_ids: str = "[]"
    thursday_recipe_ids: str = "[]"
    friday_recipe_ids: str = "[]"
    saturday_recipe_ids: str = "[]"
    sunday_recipe_ids: str = "[]"

class RefreshToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    token: str = Field(index=True)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked: bool = False

class SupportTicket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    status: str = Field(default="bot") # bot, in_queue, resolved
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SupportMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="supportticket.id", index=True)
    sender: str = "user" # user, bot, support
    content: str

class Follower(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    follower_id: int = Field(foreign_key="user.id", index=True)
    following_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Pydantic Schemas (Non-DB)
class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None
    expires_in: int = 3600 # seconds

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    id_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    profile: Optional[str] = "enthusiast"  # chef, amador, enthusiast, beginner

class LoginRequest(BaseModel):
    email: str
    password: str
class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    recipe_id: int = Field(foreign_key="recipe.id", index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    content: str
    rating: int = 5
    images: str = "[]"  # JSON array of strings
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ModerationLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    content_type: str = Field(index=True)  # "recipe", "comment", "user_bio"
    content_id: Optional[int] = Field(default=None, index=True)
    flagged_reason: str = ""
    ai_score: float = 0.0
    status: str = Field(default="flagged")  # "flagged", "cleared", "removed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
