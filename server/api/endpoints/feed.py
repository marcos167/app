"""
Feed API Endpoints
Unified feed for recipes, with pagination and filtering
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select, desc, func
from pydantic import BaseModel

from server.db import get_session
from server.models import Recipe, User, RecipeLike, SavedRecipe
from server.api.deps import get_current_user

router = APIRouter()


class FeedItem(BaseModel):
    """Response model for feed items"""
    id: int
    title: str
    description: str
    image: str
    time: str
    difficulty: str
    category: str
    author: Optional[str]
    rating: float
    likes_count: int
    is_liked: bool
    is_saved: bool
    created_at: str


class FeedResponse(BaseModel):
    """Paginated feed response"""
    items: List[FeedItem]
    page: int
    limit: int
    total: int
    has_more: bool


@router.get("/feed", response_model=FeedResponse)
async def get_feed(
    page: int = Query(1, ge=1, description="Página atual"),
    limit: int = Query(20, ge=1, le=50, description="Itens por página"),
    category: Optional[str] = Query(None, description="Filtrar por categoria"),
    search: Optional[str] = Query(None, description="Buscar por título"),
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Get unified feed of published recipes.
    Supports pagination, category filtering, and search.
    """
    offset = (page - 1) * limit
    
    # Base query for published recipes
    query = select(Recipe).where(Recipe.status == "published")
    
    # Apply category filter
    if category:
        query = query.where(Recipe.category == category)
    
    # Apply search filter
    if search:
        query = query.where(Recipe.title.ilike(f"%{search}%"))
    
    # Get total count for pagination
    count_query = select(func.count(Recipe.id)).where(Recipe.status == "published")
    if category:
        count_query = count_query.where(Recipe.category == category)
    if search:
        count_query = count_query.where(Recipe.title.ilike(f"%{search}%"))
    
    total = session.exec(count_query).one()
    
    # Get recipes with ordering and pagination
    query = query.order_by(desc(Recipe.created_at)).offset(offset).limit(limit)
    recipes = session.exec(query).all()
    
    # Get user's likes and saves if authenticated
    user_likes = set()
    user_saves = set()
    
    if current_user:
        likes = session.exec(
            select(RecipeLike.recipe_id).where(RecipeLike.user_id == current_user.id)
        ).all()
        user_likes = set(likes)
        
        saves = session.exec(
            select(SavedRecipe.recipe_id).where(SavedRecipe.user_id == current_user.id)
        ).all()
        user_saves = set(saves)
    
    # Build response items
    items = []
    for recipe in recipes:
        # Count likes for this recipe
        likes_count = session.exec(
            select(func.count(RecipeLike.id)).where(RecipeLike.recipe_id == recipe.id)
        ).one()
        
        items.append(FeedItem(
            id=recipe.id,
            title=recipe.title,
            description=recipe.description[:200] if recipe.description else "",
            image=recipe.image,
            time=recipe.time,
            difficulty=recipe.difficulty,
            category=recipe.category,
            author=recipe.author,
            rating=recipe.rating,
            likes_count=likes_count,
            is_liked=recipe.id in user_likes,
            is_saved=recipe.id in user_saves,
            created_at=recipe.created_at.isoformat() if recipe.created_at else ""
        ))
    
    return FeedResponse(
        items=items,
        page=page,
        limit=limit,
        total=total,
        has_more=(offset + limit) < total
    )


@router.get("/feed/following")
async def get_following_feed(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Get feed from users the current user follows.
    Requires authentication.
    """
    from server.models import Follower
    
    offset = (page - 1) * limit
    
    # Get IDs of users the current user follows
    following_ids = session.exec(
        select(Follower.following_id).where(Follower.follower_id == current_user.id)
    ).all()
    
    if not following_ids:
        return {
            "items": [],
            "page": page,
            "limit": limit,
            "total": 0,
            "has_more": False,
            "message": "Você ainda não segue ninguém"
        }
    
    # Get recipes from followed users
    # Note: Recipe.author stores user name, not ID - this is a limitation
    # For now, return all recipes (need to add author_id to Recipe model later)
    query = select(Recipe).where(
        Recipe.status == "published"
    ).order_by(desc(Recipe.created_at)).offset(offset).limit(limit)
    
    recipes = session.exec(query).all()
    
    return {
        "items": [r.dict() for r in recipes],
        "page": page,
        "limit": limit,
        "total": len(recipes),
        "has_more": len(recipes) == limit
    }


@router.get("/feed/trending")
async def get_trending_feed(
    limit: int = Query(10, ge=1, le=30),
    session: Session = Depends(get_session)
):
    """
    Get trending recipes based on likes in the last 7 days.
    """
    from datetime import datetime, timedelta
    
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # Get recipes with most likes in the last week
    trending = session.exec(
        select(Recipe.id, func.count(RecipeLike.id).label("likes"))
        .join(RecipeLike, RecipeLike.recipe_id == Recipe.id, isouter=True)
        .where(Recipe.status == "published")
        .where(RecipeLike.created_at >= week_ago)
        .group_by(Recipe.id)
        .order_by(desc("likes"))
        .limit(limit)
    ).all()
    
    recipe_ids = [r[0] for r in trending]
    
    if not recipe_ids:
        # Fallback to recent recipes if no trending
        recipes = session.exec(
            select(Recipe)
            .where(Recipe.status == "published")
            .order_by(desc(Recipe.created_at))
            .limit(limit)
        ).all()
    else:
        recipes = session.exec(
            select(Recipe).where(Recipe.id.in_(recipe_ids))
        ).all()
    
    return {
        "items": [r.dict() for r in recipes],
        "total": len(recipes)
    }
