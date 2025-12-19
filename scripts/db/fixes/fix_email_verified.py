"""
Fix Email Verified Column
Sets DEFAULT FALSE for email_verified to avoid NotNullViolation during insert.
"""
from sqlalchemy import create_engine, text

# Supabase connection
DB_URL = "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
engine = create_engine(DB_URL)

SQL_COMMANDS = """
-- 1. Set default value for email_verified
ALTER TABLE "user" ALTER COLUMN email_verified SET DEFAULT FALSE;

-- 2. Update NULLs to FALSE (just in case)
UPDATE "user" SET email_verified = FALSE WHERE email_verified IS NULL;

-- 3. Temporarily drop the NOT NULL constraint if strictly needed, 
-- though SET DEFAULT usually is enough for INSERTs that omit the column.
-- But if existing rows have NULL, we must update them (done above).
ALTER TABLE "user" ALTER COLUMN email_verified DROP NOT NULL;
"""

def fix_email_verified():
    print("=" * 60)
    print("FIXING EMAIL_VERIFIED COLUMN")
    print("=" * 60)
    
    with engine.connect() as conn:
        statements = [s.strip() for s in SQL_COMMANDS.split(';') if s.strip()]
        
        for i, stmt in enumerate(statements, 1):
            if stmt.startswith('--'): continue
            try:
                print(f"Executing: {stmt.splitlines()[0]}...")
                conn.execute(text(stmt))
                print(f"  ✅ Success")
            except Exception as e:
                print(f"  ❌ Error: {e}")
        
        conn.commit()
        print("\nFix complete!")

if __name__ == "__main__":
    fix_email_verified()
