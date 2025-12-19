"""
Simple migration script for hardcore monetization
Run directly with: python create_hardcore_tables_simple.py
"""

import psycopg2
import os

# Get database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres")

# Parse URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print("🔗 Connecting to Supabase...")

# Connect
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

print("📦 Creating tables...")

# Table 1: Eligibility
cur.execute("""
CREATE TABLE IF NOT EXISTS monetization_eligibility (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES "user"(id),
    account_created_at TIMESTAMP DEFAULT NOW(),
    account_age_days INTEGER DEFAULT 0,
    posts_distributed BOOLEAN DEFAULT FALSE,
    original_recipes_count INTEGER DEFAULT 0,
    videos_count INTEGER DEFAULT 0,
    moderation_violations INTEGER DEFAULT 0,
    real_followers_count INTEGER DEFAULT 0,
    engagement_rate FLOAT DEFAULT 0.0,
    validated_helpful_comments INTEGER DEFAULT 0,
    recipe_executions_by_others INTEGER DEFAULT 0,
    average_rating FLOAT DEFAULT 0.0,
    accessible_content_ratio FLOAT DEFAULT 0.0,
    fraud_score FLOAT DEFAULT 0.0,
    last_suspicious_event TIMESTAMP,
    days_since_suspicious INTEGER DEFAULT 999,
    challenges_completed JSONB DEFAULT '[]'::jsonb,
    is_eligible BOOLEAN DEFAULT FALSE,
    eligibility_checked_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
""")

# Table 2: Applications
cur.execute("""
CREATE TABLE IF NOT EXISTS monetization_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    status VARCHAR(50) DEFAULT 'pending',
    eligibility_snapshot JSONB NOT NULL,
    reviewed_by INTEGER REFERENCES "user"(id),
    reviewed_at TIMESTAMP,
    admin_notes TEXT,
    rejection_reason TEXT,
    monthly_cap_brl FLOAT,
    payment_schedule VARCHAR(50),
    retention_percentage FLOAT,
    approved_at TIMESTAMP,
    can_reapply_after TIMESTAMP,
    revoked_at TIMESTAMP,
    revocation_reason TEXT,
    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
""")

# Table 3: Challenges
cur.execute("""
CREATE TABLE IF NOT EXISTS monetization_challenges (
    id SERIAL PRIMARY KEY,
    challenge_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
""")

# Table 4: Progress
cur.execute("""
CREATE TABLE IF NOT EXISTS user_challenge_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    challenge_id INTEGER NOT NULL REFERENCES monetization_challenges(id),
    progress JSONB DEFAULT '{}'::jsonb,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    started_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
""")

conn.commit()
print("✅ Tables created!")

# Seed challenges
print("🌱 Seeding challenges...")
cur.execute("""
INSERT INTO monetization_challenges (challenge_type, title, description, requirements)
VALUES 
('impact_real', 'Desafio Impacto Real', 
 'Crie uma receita acessível que seja feita por pelo menos 50 pessoas com alta avaliação',
 '{"min_executions": 50, "max_cost_brl": 20.0, "min_rating": 4.5}'::jsonb),

('education', 'Desafio Educação',
 'Crie uma série educativa explicando como vender comida de forma legal e segura',
 '{"min_videos": 3, "topic": "selling_food_legally", "min_views": 100}'::jsonb),

('community', 'Desafio Comunidade',
 'Ajude outros usuários com comentários úteis validados pela comunidade',
 '{"min_helpful_comments": 30, "min_upvotes_per_comment": 3}'::jsonb)
ON CONFLICT DO NOTHING
""")

conn.commit()
cur.close()
conn.close()

print("✅ Done!")
print("\n" + "="*60)
print("🎉 HARDCORE MONETIZATION READY!")
print("="*60)
