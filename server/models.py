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

    # Stripe Fields
    stripe_customer_id: Optional[str] = Field(default=None, index=True)
    stripe_subscription_id: Optional[str] = None
    plan_status: str = "active" # active, past_due, canceled, incomplete
    plan_current_period_end: Optional[datetime] = None

class Recipe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    image: str
    time: str
    calories: str
    servings: int
    category: str
    rating: float = 0.0
    reviews: int = 0
    
    # Premium Features
    is_premium: bool = False
    video_url: Optional[str] = None
    
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
