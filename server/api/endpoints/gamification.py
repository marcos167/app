from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select, func
from datetime import datetime

from server.db import get_session
from server.models.user import User, Recipe
from server.api.deps import get_current_active_user

router = APIRouter()

class Badge(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    earned: bool = False
    earned_at: datetime | None = None

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    score: int
    avatar: str | None

@router.get("/gamification/badges", response_model=List[Badge])
async def get_user_badges(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_active_user)
):
    """Get all badges and user's earned badges"""
    
    user_id = current_user['id']
    
    from server.db import engine
    with engine.connect() as conn:
        # Get all badges
        badges_result = conn.execute("SELECT id, name, description, icon FROM badges ORDER BY id")
        
        # Get user's earned badges
        earned_result = conn.execute(f"""
            SELECT badge_id, earned_at 
            FROM user_achievements 
            WHERE user_id = {user_id}
        """)
        
        earned_badges = {row[0]: row[1] for row in earned_result}
        
        badges = []
        for row in badges_result:
            badges.append(Badge(
                id=row[0],
                name=row[1],
                description=row[2],
                icon=row[3],
                earned=row[0] in earned_badges,
                earned_at=earned_badges.get(row[0])
            ))
    
    return badges

@router.get("/gamification/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    period: str = "all_time",
    limit: int = 50,
    session: Session = Depends(get_session)
):
    """Get leaderboard rankings"""
    
    from server.db import engine
    with engine.connect() as conn:
        result = conn.execute(f"""
            SELECT l.rank, l.user_id, u.name, l.score, u.image
            FROM leaderboard l
            JOIN "user" u ON l.user_id = u.id
            WHERE l.period = '{period}'
            ORDER BY l.rank
            LIMIT {limit}
        """)
        
        leaderboard = []
        for row in result:
            leaderboard.append(LeaderboardEntry(
                rank=row[0],
                user_id=row[1],
                username=row[2] or "Usuário",
                score=row[3],
                avatar=row[4]
            ))
    
    return leaderboard

@router.post("/gamification/check-achievements")
async def check_achievements(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_active_user)
):
    """Check and award new achievements"""
    
    user_id = current_user['id']
    new_badges = []
    
    # Count user's published recipes
    recipes_count = session.exec(
        select(func.count(Recipe.id)).where(
            Recipe.author == current_user['email'],
            Recipe.status == "published"
        )
    ).first() or 0
    
    # Check badge criteria
    badge_criteria = {
        1: recipes_count >= 1,   # Primeira Receita
        2: recipes_count >= 10,  # Chef Iniciante
        3: recipes_count >= 50,  # Chef Experiente
        4: recipes_count >= 100, # Chef Master
    }
    
    from server.db import engine
    with engine.connect() as conn:
        for badge_id, earned in badge_criteria.items():
            if earned:
                # Check if already earned
                check = conn.execute(f"""
                    SELECT id FROM user_achievements 
                    WHERE user_id = {user_id} AND badge_id = {badge_id}
                """).fetchone()
                
                if not check:
                    # Award badge
                    conn.execute(f"""
                        INSERT INTO user_achievements (user_id, badge_id)
                        VALUES ({user_id}, {badge_id})
                    """)
                    
                    # Get badge info
                    badge = conn.execute(f"""
                        SELECT name, icon FROM badges WHERE id = {badge_id}
                    """).fetchone()
                    
                    new_badges.append({
                        "id": badge_id,
                        "name": badge[0],
                        "icon": badge[1]
                    })
        
        conn.commit()
    
    return {
        "new_badges": new_badges,
        "total_badges": len(new_badges)
    }

@router.post("/gamification/update-score")
async def update_leaderboard_score(
    points: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_active_user)
):
    """Update user's leaderboard score"""
    
    user_id = current_user['id']
    
    from server.db import engine
    with engine.connect() as conn:
        # Update or insert score
        conn.execute(f"""
            INSERT INTO leaderboard (user_id, score, period)
            VALUES ({user_id}, {points}, 'all_time')
            ON CONFLICT (user_id, period)
            DO UPDATE SET score = leaderboard.score + {points}, updated_at = NOW()
        """)
        
        # Recalculate ranks
        conn.execute("""
            UPDATE leaderboard l1
            SET rank = (
                SELECT COUNT(*) + 1
                FROM leaderboard l2
                WHERE l2.period = l1.period AND l2.score > l1.score
            )
            WHERE period = 'all_time'
        """)
        
        conn.commit()
    
    return {"success": True}
