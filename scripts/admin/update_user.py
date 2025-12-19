from sqlalchemy import create_engine, text
from sqlmodel import Session, select
import sys

# Supabase connection
DB_URL = "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
engine = create_engine(DB_URL)

def check_users():
    print("="*50)
    print("CHECKING USERS IN DATABASE")
    print("="*50)
    
    with engine.connect() as conn:
        try:
            result = conn.execute(text("SELECT id, email, full_name, role, provider FROM \"user\""))
            users = result.fetchall()
            
            if not users:
                print("No users found in database.")
            else:
                for u in users:
                    print(f"ID: {u.id} | Email: {u.email} | Role: {u.role} | Provider: {u.provider}")
                    
        except Exception as e:
            print(f"Error querying users: {e}")

if __name__ == "__main__":
    check_users()
