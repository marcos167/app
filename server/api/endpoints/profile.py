"""
Profile API Endpoints
Public profiles with stats, followers, and activity
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from pydantic import BaseModel
from datetime import datetime

from server.db import get_session
from server.models import User, Recipe, Follower, RecipeLike
from server.api.deps import get_current_user

router = APIRouter()


class ProfileStats(BaseModel):
    """User statistics for profile"""
    recipes_count: int
    followers_count: int
    following_count: int
    total_likes_received: int


class PublicProfile(BaseModel):
    """Public profile response"""
    id: int
    name: Optional[str]
    avatar: Optional[str]
    bio: Optional[str]
    role: str
    plan: str
    created_at: str
    stats: ProfileStats
    is_following: bool
    is_own_profile: bool


class ProfileRecipe(BaseModel):
    """Recipe summary for profile"""
    id: int
    title: str
    image: str
    likes_count: int
    created_at: str


@router.get("/users/{user_id}/profile", response_model=PublicProfile)
async def get_profile(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Get public profile of a user.
    Includes stats and follow status if authenticated.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Count recipes by this user
    # Note: Recipe.author stores name, not ID - using a workaround
    recipes_count = session.exec(
        select(func.count(Recipe.id)).where(Recipe.author == user.full_name)
    ).one() if user.full_name else 0
    
    # Followers count
    followers_count = session.exec(
        select(func.count(Follower.id)).where(Follower.following_id == user_id)
    ).one()
    
    # Following count
    following_count = session.exec(
        select(func.count(Follower.id)).where(Follower.follower_id == user_id)
    ).one()
    
    # Total likes received (on user's recipes)
    # This would need author_id in Recipe for accuracy, simplified for now
    total_likes_received = 0
    
    # Check if current user follows this user
    is_following = False
    is_own_profile = False
    
    if current_user:
        is_own_profile = current_user.id == user_id
        
        if not is_own_profile:
            check = session.exec(
                select(Follower).where(
                    Follower.follower_id == current_user.id,
                    Follower.following_id == user_id
                )
            ).first()
            is_following = check is not None
    
    return PublicProfile(
        id=user.id,
        name=user.full_name,
        avatar=user.avatar_url,
        bio=None,  # Add bio field to User model if needed
        role=user.role,
        plan=user.plan_tier,
        created_at=user.created_at.isoformat() if user.created_at else "",
        stats=ProfileStats(
            recipes_count=recipes_count,
            followers_count=followers_count,
            following_count=following_count,
            total_likes_received=total_likes_received
        ),
        is_following=is_following,
        is_own_profile=is_own_profile
    )


@router.get("/users/{user_id}/recipes")
async def get_user_recipes(
    user_id: int,
    page: int = 1,
    limit: int = 20,
    session: Session = Depends(get_session)
):
    """
    Get recipes created by a specific user.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    offset = (page - 1) * limit
    
    # Note: Recipe.author stores name, not ID
    recipes = session.exec(
        select(Recipe)
        .where(Recipe.author == user.full_name)
        .where(Recipe.status == "published")
        .offset(offset)
        .limit(limit)
    ).all() if user.full_name else []
    
    return {
        "recipes": [r.dict() for r in recipes],
        "page": page,
        "limit": limit,
        "total": len(recipes)
    }


@router.get("/users/{user_id}/followers")
async def get_user_followers(
    user_id: int,
    page: int = 1,
    limit: int = 50,
    session: Session = Depends(get_session)
):
    """
    Get list of users who follow this user.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    offset = (page - 1) * limit
    
    followers = session.exec(
        select(Follower)
        .where(Follower.following_id == user_id)
        .offset(offset)
        .limit(limit)
    ).all()
    
    follower_ids = [f.follower_id for f in followers]
    
    users = session.exec(
        select(User).where(User.id.in_(follower_ids))
    ).all() if follower_ids else []
    
    return {
        "followers": [
            {
                "id": u.id,
                "name": u.full_name,
                "avatar": u.avatar_url
            }
            for u in users
        ],
        "total": len(users)
    }


@router.get("/users/{user_id}/following")
async def get_user_following(
    user_id: int,
    page: int = 1,
    limit: int = 50,
    session: Session = Depends(get_session)
):
    """
    Get list of users this user follows.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    offset = (page - 1) * limit
    
    following = session.exec(
        select(Follower)
        .where(Follower.follower_id == user_id)
        .offset(offset)
        .limit(limit)
    ).all()
    
    following_ids = [f.following_id for f in following]
    
    users = session.exec(
        select(User).where(User.id.in_(following_ids))
    ).all() if following_ids else []
    
    return {
        "following": [
            {
                "id": u.id,
                "name": u.full_name,
                "avatar": u.avatar_url
            }
            for u in users
        ],
        "total": len(users)
    }
