"""
Check Supabase schema to find user table name
"""

import psycopg2
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

print("📋 Listing all tables in database:\n")
cur.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
""")

tables = cur.fetchall()
for table in tables:
    print(f"  - {table[0]}")

cur.close()
conn.close()
