import os
from dotenv import load_dotenv
load_dotenv()

from sqlmodel import Session, text
from server.db import engine

def update_schema():
    print(f"Updating schema on: {engine.url}")
    
    with Session(engine) as session:
        # Check if we are on PostgreSQL or SQLite
        is_postgres = "postgresql" in str(engine.url)
        
        # Missing columns to add
        columns = [
            ("email_verified", "BOOLEAN", "FALSE"),
            ("email_verification_token", "VARCHAR", "NULL"),
            ("email_verification_expires", "TIMESTAMP", "NULL"),
            ("password_reset_token", "VARCHAR", "NULL"),
            ("password_reset_expires", "TIMESTAMP", "NULL"),
            ("failed_login_attempts", "INTEGER", "0"),
            ("locked_until", "TIMESTAMP", "NULL"),
            ("stripe_customer_id", "VARCHAR", "NULL"),
            ("stripe_subscription_id", "VARCHAR", "NULL"),
            ("plan_status", "VARCHAR", "'active'"),
            ("plan_current_period_end", "TIMESTAMP", "NULL")
        ]
        
        for col_name, col_type, default_val in columns:
            try:
                print(f"Attempting to add column {col_name}...")
                session.execute(text(f"ALTER TABLE \"user\" ADD COLUMN {col_name} {col_type} DEFAULT {default_val}"))
                session.commit()
                print(f"✅ Added {col_name}")
            except Exception as e:
                session.rollback()
                if "already exists" in str(e).lower() or "duplicate column name" in str(e).lower():
                    print(f"ℹ️ {col_name} already exists.")
                else:
                    print(f"❌ Error adding {col_name}: {e}")

    print("Schema update completed!")

if __name__ == "__main__":
    update_schema()
