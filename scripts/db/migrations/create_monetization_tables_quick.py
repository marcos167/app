"""
Quick script to create monetization tables using SQLModel
Run this to create the tables if migration didn't work
"""

from sqlmodel import SQLModel, create_engine
import os

# Get database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/chefex")

# Fix postgres:// to postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"🔗 Connecting to: {DATABASE_URL}")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Import all models to register them with SQLModel
from server.models.user import User, Recipe, WeeklyPlan, RefreshToken, SupportTicket, SupportMessage, Follower
from server.models.monetization import (
    PlatformSettings,
    UserContributionPoints,
    PointsLedger,
    FinancialLedger,
    FinancialTransaction
)

print("📦 Imported all models")

# Create all tables
print("🚀 Creating tables...")
SQLModel.metadata.create_all(engine)

print("✅ All tables created successfully!")
print("\nCreated tables:")
print("  - platform_settings")
print("  - user_contribution_points")
print("  - points_ledger")
print("  - financial_ledger")
print("  - financial_transactions")
