"""
Analytics Database Tables Migration
Creates tables for tracking analytics events and user sessions
"""
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

def create_analytics_tables():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("📊 Creating analytics tables...")
        
        # Analytics Events Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS analytics_events (
                id SERIAL PRIMARY KEY,
                event_type VARCHAR(50) NOT NULL,
                user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        
        # User Sessions Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
                started_at TIMESTAMP DEFAULT NOW(),
                ended_at TIMESTAMP,
                duration INTEGER,
                ip_address VARCHAR(45),
                user_agent TEXT
            )
        """)
        
        # Create indexes for better performance
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id 
            ON analytics_events(user_id)
        """)
        
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at 
            ON analytics_events(created_at)
        """)
        
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id 
            ON user_sessions(user_id)
        """)
        
        conn.commit()
        print("✅ Analytics tables created successfully!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating analytics tables: {e}")
        raise

if __name__ == "__main__":
    create_analytics_tables()
