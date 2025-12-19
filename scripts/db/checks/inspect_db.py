from sqlalchemy import create_engine, text

DB_URL = "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
engine = create_engine(DB_URL)

def inspect_db():
    print("=" * 60)
    print("DATABASE INSPECTION")
    print("=" * 60)
    
    with engine.connect() as conn:
        # 1. Check User Table Columns and Types
        print("\n[1] Table 'user' columns:")
        result = conn.execute(text("""
            SELECT column_name, data_type, udt_name 
            FROM information_schema.columns 
            WHERE table_name = 'user';
        """))
        for row in result:
            print(f"  - {row.column_name}: {row.data_type} ({row.udt_name})")
            
        # 2. Check Enum Types if any
        print("\n[2] Enum Types in Database:")
        result = conn.execute(text("""
            SELECT t.typname, e.enumlabel
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid
            ORDER BY t.typname, e.enumlabel;
        """))
        for row in result:
            print(f"  - Type '{row.typname}' allows: {row.enumlabel}")

if __name__ == "__main__":
    import sys
    sys.stdout = open("db_info.txt", "w", encoding="utf-8")
    inspect_db()
    sys.stdout.close()
