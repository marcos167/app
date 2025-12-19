"""
Gamification System Migration
Creates tables for badges, achievements, and leaderboard
"""
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

def create_gamification_tables():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("🎮 Creating gamification tables...")
        
        # Badges Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS badges (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                icon VARCHAR(255),
                criteria JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        
        # User Achievements Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_achievements (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
                badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
                earned_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, badge_id)
            )
        """)
        
        # Leaderboard Table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS leaderboard (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
                score INTEGER DEFAULT 0,
                rank INTEGER,
                period VARCHAR(20),
                updated_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, period)
            )
        """)
        
        # Seed initial badges
        cur.execute("""
            INSERT INTO badges (name, description, icon, criteria) VALUES
            ('Primeira Receita', 'Publicou sua primeira receita', '🎉', '{"recipes_published": 1}'),
            ('Chef Iniciante', 'Publicou 10 receitas', '👨‍🍳', '{"recipes_published": 10}'),
            ('Chef Experiente', 'Publicou 50 receitas', '⭐', '{"recipes_published": 50}'),
            ('Chef Master', 'Publicou 100 receitas', '🏆', '{"recipes_published": 100}'),
            ('Popular', 'Recebeu 100 curtidas', '❤️', '{"likes_received": 100}'),
            ('Influenciador', 'Tem 50 seguidores', '👥', '{"followers": 50}'),
            ('Avaliador', 'Avaliou 20 receitas', '⭐', '{"reviews_given": 20}')
            ON CONFLICT DO NOTHING
        """)
        
        # Create indexes
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id 
            ON user_achievements(user_id)
        """)
        
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_leaderboard_period 
            ON leaderboard(period, rank)
        """)
        
        conn.commit()
        print("✅ Gamification tables created successfully!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating gamification tables: {e}")
        raise

if __name__ == "__main__":
    create_gamification_tables()
