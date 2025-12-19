from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from pydantic import BaseModel
from server.db import get_session
from server.models.user import User, Recipe
from server.api.deps import get_current_active_user, check_admin_permission

router = APIRouter()

# Response Models
class GrowthMetrics(BaseModel):
    date: str
    new_users: int
    total_users: int
    active_users: int

class TopRecipe(BaseModel):
    id: int
    title: str
    author: str
    views: int
    likes: int
    rating: float

class ConversionMetrics(BaseModel):
    visitors: int
    signups: int
    active_users: int
    conversion_rate: float

class HeatmapData(BaseModel):
    hour: int
    day: int
    activity_count: int

@router.get("/analytics/growth", response_model=List[GrowthMetrics])
async def get_growth_metrics(
    days: int = 30,
    session: Session = Depends(get_session),
    current_user: dict = Depends(check_admin_permission)
):
    """Get user growth metrics for the last N days"""
    
    growth_data = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Get daily user counts
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        next_date = current_date + timedelta(days=1)
        
        # New users on this day
        new_users_query = select(func.count(User.id)).where(
            User.created_at >= current_date,
            User.created_at < next_date
        )
        new_users = session.exec(new_users_query).first() or 0
        
        # Total users up to this day
        total_users_query = select(func.count(User.id)).where(
            User.created_at <= next_date
        )
        total_users = session.exec(total_users_query).first() or 0
        
        # Active users (mock for now - would need session tracking)
        active_users = int(total_users * 0.3)  # 30% active rate
        
        growth_data.append(GrowthMetrics(
            date=current_date.strftime("%Y-%m-%d"),
            new_users=new_users,
            total_users=total_users,
            active_users=active_users
        ))
    
    return growth_data

@router.get("/analytics/top-recipes", response_model=List[TopRecipe])
async def get_top_recipes(
    limit: int = 10,
    session: Session = Depends(get_session),
    current_user: dict = Depends(check_admin_permission)
):
    """Get top recipes by engagement (views, likes, rating)"""
    
    # Get top recipes by rating and reviews
    query = select(Recipe).where(
        Recipe.status == "published"
    ).order_by(
        Recipe.rating.desc(),
        Recipe.reviews.desc()
    ).limit(limit)
    
    recipes = session.exec(query).all()
    
    top_recipes = []
    for recipe in recipes:
        # Calculate engagement score
        views = recipe.reviews * 10  # Estimate views from reviews
        likes = recipe.reactions_love + recipe.reactions_like
        
        top_recipes.append(TopRecipe(
            id=recipe.id,
            title=recipe.title,
            author=recipe.author or "Unknown",
            views=views,
            likes=likes,
            rating=recipe.rating
        ))
    
    return top_recipes

@router.get("/analytics/conversion", response_model=ConversionMetrics)
async def get_conversion_metrics(
    session: Session = Depends(get_session),
    current_user: dict = Depends(check_admin_permission)
):
    """Get conversion funnel metrics"""
    
    # Total users (signups)
    total_users_query = select(func.count(User.id))
    signups = session.exec(total_users_query).first() or 0
    
    # Active users (users who created at least one recipe)
    active_users_query = select(func.count(func.distinct(Recipe.author))).where(
        Recipe.status == "published"
    )
    active_users = session.exec(active_users_query).first() or 0
    
    # Estimate visitors (3x signups)
    visitors = signups * 3
    
    # Calculate conversion rate
    conversion_rate = (signups / visitors * 100) if visitors > 0 else 0
    
    return ConversionMetrics(
        visitors=visitors,
        signups=signups,
        active_users=active_users,
        conversion_rate=round(conversion_rate, 2)
    )

@router.get("/analytics/heatmap", response_model=List[HeatmapData])
async def get_activity_heatmap(
    session: Session = Depends(get_session),
    current_user: dict = Depends(check_admin_permission)
):
    """Get activity heatmap data (hour x day of week)"""
    
    # Mock heatmap data for now
    # In production, this would query analytics_events table
    heatmap_data = []
    
    for day in range(7):  # 0 = Monday, 6 = Sunday
        for hour in range(24):
            # Generate mock activity count
            # Peak hours: 12-14 (lunch) and 19-21 (dinner)
            base_activity = 10
            if hour in [12, 13, 14, 19, 20, 21]:
                activity_count = base_activity * 3
            elif hour in [8, 9, 10, 17, 18]:
                activity_count = base_activity * 2
            else:
                activity_count = base_activity
            
            # Weekend boost
            if day in [5, 6]:  # Saturday, Sunday
                activity_count = int(activity_count * 1.5)
            
            heatmap_data.append(HeatmapData(
                hour=hour,
                day=day,
                activity_count=activity_count
            ))
    
    return heatmap_data
