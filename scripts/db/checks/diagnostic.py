import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def diagnostic():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL not set in .env")
        return

    print(f"Connecting to: {db_url.split('@')[-1]}") # Log host part only for security
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # List tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [row[0] for row in cur.fetchall()]
        print(f"Tables: {', '.join(tables)}")
        
        # List columns for 'user' table
        if 'user' in tables:
            print("\nColumns for 'user' table:")
            cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'user'")
            for row in cur.fetchall():
                print(f" - {row[0]}: {row[1]}")
        else:
            print("\n'user' table not found!")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diagnostic()
