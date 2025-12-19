"""
Database Migration Script - Sustainable Monetization System
Creates all tables for the phase-based monetization system

Run with: python -m server.migrations.create_monetization_tables
"""

import os
import sys
from sqlalchemy import create_engine, text

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/chefex")

# SQL para criar as tabelas
CREATE_TABLES_SQL = """
-- ============================================================================
-- Platform Settings (Singleton)
-- ============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
    id SERIAL PRIMARY KEY,
    monetization_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    current_phase VARCHAR(20) DEFAULT 'community' NOT NULL,
    points_to_currency_rate FLOAT DEFAULT 0.001 NOT NULL,
    max_monthly_payout_per_user FLOAT DEFAULT 500.0 NOT NULL,
    min_withdrawal_amount FLOAT DEFAULT 50.0 NOT NULL,
    level_multipliers JSONB DEFAULT '{"1": 1.0, "2": 1.0, "3": 1.2, "4": 1.2, "5": 1.5, "6": 1.5, "7": 2.0, "8": 2.0, "9": 2.5, "10": 2.5}'::jsonb NOT NULL,
    phase_activated_at TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_by_admin_id INTEGER
);

-- ============================================================================
-- User Contribution Points
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_contribution_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    total_points INTEGER DEFAULT 0 NOT NULL,
    available_points INTEGER DEFAULT 0 NOT NULL,
    current_level INTEGER DEFAULT 1 NOT NULL,
    xp_current INTEGER DEFAULT 0 NOT NULL,
    xp_next_level INTEGER DEFAULT 100 NOT NULL,
    recipes_shared INTEGER DEFAULT 0 NOT NULL,
    reels_posted INTEGER DEFAULT 0 NOT NULL,
    people_helped INTEGER DEFAULT 0 NOT NULL,
    community_rank INTEGER,
    badges JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_contrib_user_id ON user_contribution_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_contrib_level ON user_contribution_points(current_level);
CREATE INDEX IF NOT EXISTS idx_user_contrib_points ON user_contribution_points(total_points DESC);

-- ============================================================================
-- Points Ledger (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS points_ledger (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    points_delta INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id INTEGER,
    fraud_score FLOAT DEFAULT 0.0 NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by_admin BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT fk_points_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_points_ledger_user ON points_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_points_ledger_created ON points_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_points_ledger_action ON points_ledger(action_type);

-- ============================================================================
-- Financial Ledger
-- ============================================================================
CREATE TABLE IF NOT EXISTS financial_ledger (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    balance_brl NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    lifetime_earnings_brl NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total_withdrawn_brl NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    kyc_verified BOOLEAN DEFAULT FALSE NOT NULL,
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    tax_id VARCHAR(20),
    payout_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    payout_method VARCHAR(50),
    payout_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_financial_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_financial_ledger_user ON financial_ledger(user_id);

-- ============================================================================
-- Financial Transactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS financial_transactions (
    id SERIAL PRIMARY KEY,
    financial_ledger_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount_brl NUMERIC(10, 2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    points_ledger_id INTEGER,
    status VARCHAR(20) DEFAULT 'completed' NOT NULL,
    external_transaction_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_fin_trans_ledger FOREIGN KEY (financial_ledger_id) REFERENCES financial_ledger(id) ON DELETE CASCADE,
    CONSTRAINT fk_fin_trans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fin_trans_points FOREIGN KEY (points_ledger_id) REFERENCES points_ledger(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_fin_trans_ledger ON financial_transactions(financial_ledger_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_user ON financial_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_fin_trans_created ON financial_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fin_trans_type ON financial_transactions(transaction_type);

-- ============================================================================
-- Insert Default Platform Settings
-- ============================================================================
INSERT INTO platform_settings (id, monetization_enabled, current_phase)
VALUES (1, FALSE, 'community')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Create trigger for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_platform_settings_updated_at
    BEFORE UPDATE ON platform_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_contrib_updated_at
    BEFORE UPDATE ON user_contribution_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_ledger_updated_at
    BEFORE UPDATE ON financial_ledger
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
"""

def run_migration():
    """Execute migration"""
    print("🚀 Creating Monetization System Tables...")
    
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Execute SQL
            statements = [s.strip() for s in CREATE_TABLES_SQL.split(';') if s.strip()]
            
            for i, statement in enumerate(statements, 1):
                try:
                    conn.execute(text(statement))
                    print(f"  ✓ Executed statement {i}/{len(statements)}")
                except Exception as e:
                    print(f"  ⚠ Warning on statement {i}: {e}")
            
            conn.commit()
            print("\n✅ Migration completed successfully!")
            print("\n📊 Tables created:")
            print("  - platform_settings")
            print("  - user_contribution_points")
            print("  - points_ledger")
            print("  - financial_ledger")
            print("  - financial_transactions")
            
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        raise

if __name__ == "__main__":
    run_migration()
