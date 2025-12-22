"""
Likes API Endpoints
Like/unlike recipes with real-time counting
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from pydantic import BaseModel

from server.db import get_session
from server.models import Recipe, RecipeLike, User
from server.api.deps import get_current_user
from server.core.rate_limit import rate_limiter

router = APIRouter()


class LikeResponse(BaseModel):
    """Response for like toggle"""
    liked: bool
    count: int


class LikeStatus(BaseModel):
    """Response for like status check"""
    is_liked: bool
    count: int


@router.post("/recipes/{recipe_id}/like", response_model=LikeResponse)
async def toggle_like(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle like on a recipe.
    If already liked, removes the like.
    If not liked, adds a like.
    """
    # Rate limiting
    rate_limiter.check(str(current_user.id), "like")
    
    # Verify recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    # Check if already liked
    existing = session.exec(
        select(RecipeLike).where(
            RecipeLike.user_id == current_user.id,
            RecipeLike.recipe_id == recipe_id
        )
    ).first()
    
    if existing:
        # Unlike
        session.delete(existing)
        liked = False
    else:
        # Like
        like = RecipeLike(user_id=current_user.id, recipe_id=recipe_id)
        session.add(like)
        liked = True
    
    session.commit()
    
    # Get updated count
    count = session.exec(
        select(func.count(RecipeLike.id)).where(RecipeLike.recipe_id == recipe_id)
    ).one()
    
    return LikeResponse(liked=liked, count=count)


@router.get("/recipes/{recipe_id}/like", response_model=LikeStatus)
async def get_like_status(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Check if current user has liked a recipe.
    """
    # Verify recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    # Check if liked
    existing = session.exec(
        select(RecipeLike).where(
            RecipeLike.user_id == current_user.id,
            RecipeLike.recipe_id == recipe_id
        )
    ).first()
    
    # Get count
    count = session.exec(
        select(func.count(RecipeLike.id)).where(RecipeLike.recipe_id == recipe_id)
    ).one()
    
    return LikeStatus(is_liked=existing is not None, count=count)


@router.get("/users/me/likes")
async def get_my_liked_recipes(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all recipes liked by the current user.
    """
    likes = session.exec(
        select(RecipeLike).where(RecipeLike.user_id == current_user.id)
    ).all()
    
    recipe_ids = [like.recipe_id for like in likes]
    
    if not recipe_ids:
        return {"recipes": [], "total": 0}
    
    recipes = session.exec(
        select(Recipe).where(Recipe.id.in_(recipe_ids))
    ).all()
    
    return {
        "recipes": [r.dict() for r in recipes],
        "total": len(recipes)
    }
