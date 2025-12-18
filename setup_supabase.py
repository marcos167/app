"""
Raw SQL to setup Supabase - Drop and recreate all tables
"""
from sqlalchemy import create_engine, text

DB_URL = "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
engine = create_engine(DB_URL)

SQL_COMMANDS = """
-- Drop existing tables (if any)
DROP TABLE IF EXISTS refreshtoken CASCADE;
DROP TABLE IF EXISTS weeklyplan CASCADE;
DROP TABLE IF EXISTS recipe CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Create User table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    google_id VARCHAR(255) UNIQUE,
    provider VARCHAR(50) DEFAULT 'google',
    role VARCHAR(50) DEFAULT 'user',
    plan_tier VARCHAR(50) DEFAULT 'free',
    plan_status VARCHAR(50) DEFAULT 'active',
    disabled BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    plan_current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on user
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_google_id ON "user"(google_id);

-- Create RefreshToken table
CREATE TABLE refreshtoken (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_refreshtoken_token ON refreshtoken(token);

-- Create Recipe table
CREATE TABLE recipe (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT DEFAULT '',
    image VARCHAR(500) DEFAULT '',
    time VARCHAR(100) DEFAULT '',
    calories VARCHAR(100) DEFAULT '',
    servings VARCHAR(100) DEFAULT '',
    difficulty VARCHAR(50) DEFAULT 'Fácil',
    category VARCHAR(100) DEFAULT '',
    ingredients TEXT DEFAULT '[]',
    instructions TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    rating FLOAT DEFAULT 0.0,
    reviews INTEGER DEFAULT 0,
    reactions_love INTEGER DEFAULT 0,
    reactions_like INTEGER DEFAULT 0,
    reactions_dislike INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    video_url VARCHAR(500),
    author VARCHAR(255),
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'published'
);

CREATE INDEX idx_recipe_title ON recipe(title);
CREATE INDEX idx_recipe_category ON recipe(category);

-- Create WeeklyPlan table
CREATE TABLE weeklyplan (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    week_start_date TIMESTAMP,
    monday_recipe_ids TEXT DEFAULT '[]',
    tuesday_recipe_ids TEXT DEFAULT '[]',
    wednesday_recipe_ids TEXT DEFAULT '[]',
    thursday_recipe_ids TEXT DEFAULT '[]',
    friday_recipe_ids TEXT DEFAULT '[]',
    saturday_recipe_ids TEXT DEFAULT '[]',
    sunday_recipe_ids TEXT DEFAULT '[]'
);

-- Insert Admin User
INSERT INTO "user" (email, full_name, role, plan_tier, plan_status, provider, disabled)
VALUES ('m22338294@gmail.com', 'Marcos Admin', 'admin', 'free', 'active', 'google', false);

SELECT 'SUCCESS: All tables created!' as result;
"""

def setup():
    print("=" * 60)
    print("SUPABASE RAW SQL SETUP")
    print("=" * 60)
    
    with engine.connect() as conn:
        # Execute each statement separately
        statements = [s.strip() for s in SQL_COMMANDS.split(';') if s.strip()]
        
        for i, stmt in enumerate(statements, 1):
            if not stmt or stmt.startswith('--'):
                continue
            try:
                conn.execute(text(stmt))
                # Print just the first line of each statement
                first_line = stmt.split('\n')[0][:50]
                print(f"  [{i}/{len(statements)}] {first_line}...")
            except Exception as e:
                print(f"  [{i}] ERROR: {str(e)[:60]}")
        
        conn.commit()
        print("\n✅ Database setup complete!")
        
        # Verify
        result = conn.execute(text('SELECT COUNT(*) FROM "user"'))
        users = result.fetchone()[0]
        result = conn.execute(text("SELECT COUNT(*) FROM recipe"))
        recipes = result.fetchone()[0]
        print(f"\n  Users:   {users}")
        print(f"  Recipes: {recipes}")

if __name__ == "__main__":
    setup()
