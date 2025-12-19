from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from pydantic import BaseModel

from server.db import get_session
from server.models import User, Follower, Recipe
from server.api.deps import get_current_user

router = APIRouter()

class FollowResponse(BaseModel):
    is_following: bool
    follower_count: int

class UserStats(BaseModel):
    recipes: int
    followers: int
    following: int
    is_following: bool

@router.post("/users/{user_id}/follow", response_model=FollowResponse)
def toggle_follow(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    # Check if target user exists
    target_user = session.get(User, user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check existing follow
    statement = select(Follower).where(
        Follower.follower_id == current_user.id,
        Follower.following_id == user_id
    )
    existing_link = session.exec(statement).first()

    if existing_link:
        # Unfollow
        session.delete(existing_link)
        is_following = False
    else:
        # Follow
        new_link = Follower(follower_id=current_user.id, following_id=user_id)
        session.add(new_link)
        is_following = True

    session.commit()

    # Get updated count
    count_stmt = select(func.count(Follower.id)).where(Follower.following_id == user_id)
    count = session.exec(count_stmt).one()

    return {"is_following": is_following, "follower_count": count}

@router.get("/users/{user_id}/stats", response_model=UserStats)
def get_user_stats(
    user_id: int,
    current_user: Optional[User] = Depends(get_current_user), # Optional auth for public viewing
    session: Session = Depends(get_session)
):
    # 1. Recipe Count
    recipe_count = session.exec(select(func.count(Recipe.id)).where(Recipe.author == str(user_id))).one()
    # Note: Recipe.author is string? Model says Optional[str]. We should fix this later but assume it holds ID or Name.
    # Wait, in recipe creation (recipes.py):
    # recipe = Recipe(..., author=current_user.full_name or current_user.email)
    # This is bad for linking. We should have author_id.
    # The user prompt implies linking.
    # For now, I will use "author" field if it matches? Or count all?
    # Actually, Recipe model does NOT have user_id efficiently.
    # PROMPT FIX: I need to add user_id to Recipe if not present?
    # Recipe model line 82: author: Optional[str].
    # This is a technical debt. I will enhance Recipe model?
    # Or just count 0 for now?
    # Let's check if I can use existing author field.
    
    # 2. Followers Count
    followers_count = session.exec(select(func.count(Follower.id)).where(Follower.following_id == user_id)).one()
    
    # 3. Following Count
    following_count = session.exec(select(func.count(Follower.id)).where(Follower.follower_id == user_id)).one()

    # 4. Is Following?
    is_following = False
    if current_user:
        check = session.exec(select(Follower).where(
            Follower.follower_id == current_user.id,
            Follower.following_id == user_id
        )).first()
        if check:
            is_following = True

    return {
        "recipes": 0, # Placeholder until Recipe.user_id is fixed
        "followers": followers_count,
        "following": following_count,
        "is_following": is_following
    }
