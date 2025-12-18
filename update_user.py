from sqlalchemy import create_engine, text
from datetime import datetime

db_url = "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
engine = create_engine(db_url)

with engine.connect() as conn:
    # First try to update if exists
    result = conn.execute(text("""
        UPDATE "user" SET role = 'admin', plan_tier = 'free', plan_status = 'active'
        WHERE email = 'm22338294@gmail.com'
    """))
    
    if result.rowcount == 0:
        # User doesn't exist, insert new
        conn.execute(text("""
            INSERT INTO "user" (email, full_name, role, plan_tier, plan_status, provider, disabled, created_at)
            VALUES ('m22338294@gmail.com', 'Marcos Admin', 'admin', 'free', 'active', 'google', false, NOW())
        """))
        print("SUCCESS: Admin user CREATED!")
    else:
        print("SUCCESS: Admin user UPDATED!")
    
    conn.commit()
    
    # Verify
    result = conn.execute(text('SELECT email, role, plan_tier FROM "user"'))
    print("\nAll users:")
    for row in result:
        print(f"  - {row[0]} | role={row[1]} | plan={row[2]}")
