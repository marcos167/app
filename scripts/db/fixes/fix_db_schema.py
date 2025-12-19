"""
Fix Database Schema
Adds missing columns to the 'user' table without dropping it.
"""
from sqlalchemy import create_engine, text

# Supabase connection
DB_URL = "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
engine = create_engine(DB_URL)

SQL_COMMANDS = """
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS plan_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS plan_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS plan_current_period_end TIMESTAMP;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS disabled BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;

-- Update existing rows to have default values (just in case)
UPDATE "user" SET plan_tier = 'free' WHERE plan_tier IS NULL;
UPDATE "user" SET plan_status = 'active' WHERE plan_status IS NULL;
UPDATE "user" SET disabled = FALSE WHERE disabled IS NULL;
"""

def fix_schema():
    print("=" * 60)
    print("FIXING DATABASE SCHEMA")
    print("=" * 60)
    
    with engine.connect() as conn:
        statements = [s.strip() for s in SQL_COMMANDS.split(';') if s.strip()]
        
        for i, stmt in enumerate(statements, 1):
            try:
                print(f"Executing: {stmt.splitlines()[0]}...")
                conn.execute(text(stmt))
                print(f"  ✅ Success")
            except Exception as e:
                print(f"  ❌ Error: {e}")
        
        conn.commit()
        print("\nSchema update complete!")

if __name__ == "__main__":
    fix_schema()
