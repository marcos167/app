"""
Fix Enum Types
Converts 'provider' and 'role' columns from ENUM to VARCHAR to avoid case sensitivity issues.
"""
from sqlalchemy import create_engine, text

# Supabase connection
DB_URL = "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
engine = create_engine(DB_URL)

SQL_COMMANDS = """
-- 1. Alter columns to VARCHAR (casting properly)
ALTER TABLE "user" ALTER COLUMN provider TYPE VARCHAR(50) USING provider::text;
ALTER TABLE "user" ALTER COLUMN role TYPE VARCHAR(50) USING role::text;

-- 2. Drop the enum types (if no longer used, optional, but cleaner)
DROP TYPE IF EXISTS provider CASCADE;
DROP TYPE IF EXISTS role CASCADE;

-- 3. Ensure values are lowercase (standardize)
UPDATE "user" SET provider = LOWER(provider);
UPDATE "user" SET role = LOWER(role);
"""

def fix_enums():
    print("=" * 60)
    print("FIXING ENUM TYPES")
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
        print("\nEnum fix complete!")

if __name__ == "__main__":
    fix_enums()
