from typing import List, Optional
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from pydantic import BaseModel
from server.db import get_session
from server.models import Recipe

router = APIRouter()

# Response model for parsed recipe
class RecipeResponse(BaseModel):
    id: int
    title: str
    description: str
    image: str
    time: str
    calories: str
    servings: str
    difficulty: str
    category: str
    ingredients: List[str]
    instructions: List[dict]
    tags: List[str]
    rating: float
    reviews: int
    reactions: dict
    is_premium: bool
    video_url: Optional[str]
    author: Optional[str]
    source: Optional[str]

class RecipeListResponse(BaseModel):
    recipes: List[RecipeResponse]
    total: int
    limit: int
    offset: int
    hasMore: bool

def parse_recipe(recipe: Recipe) -> dict:
    """Parse JSON fields from database strings to Python objects"""
    return {
        "id": recipe.id,
        "title": recipe.title,
        "description": recipe.description,
        "image": recipe.image,
        "time": recipe.time,
        "calories": recipe.calories,
        "servings": recipe.servings,
        "difficulty": recipe.difficulty,
        "category": recipe.category,
        "ingredients": json.loads(recipe.ingredients) if recipe.ingredients else [],
        "instructions": json.loads(recipe.instructions) if recipe.instructions else [],
        "tags": json.loads(recipe.tags) if recipe.tags else [],
        "rating": recipe.rating,
        "reviews": recipe.reviews,
        "reactions": {
            "love": recipe.reactions_love,
            "like": recipe.reactions_like,
            "dislike": recipe.reactions_dislike
        },
        "is_premium": recipe.is_premium,
        "video_url": recipe.video_url,
        "author": recipe.author,
        "source": recipe.source
    }

@router.get("/recipes", response_model=RecipeListResponse)
def get_recipes(
    status: str = "published", 
    category: Optional[str] = None,
    search: Optional[str] = None,
    offset: int = 0, 
    limit: int = 20, 
    session: Session = Depends(get_session)
):
    """
    Get recipes with pagination.
    offset: number of items to skip
    limit: max number of items to return (default 20)
    """
    # Base query
    query = select(Recipe).where(Recipe.status == status)
    
    # Category filter
    if category:
        query = query.where(Recipe.category == category)
    
    # Search filter (title)
    if search:
        query = query.where(Recipe.title.ilike(f"%{search}%"))
    
    # Get total count
    total_query = select(Recipe).where(Recipe.status == status)
    if category:
        total_query = total_query.where(Recipe.category == category)
    if search:
        total_query = total_query.where(Recipe.title.ilike(f"%{search}%"))
    all_recipes = session.exec(total_query).all()
    total = len(all_recipes)
    
    # Apply pagination
    query = query.offset(offset).limit(limit)
    recipes = session.exec(query).all()
    
    # Parse JSON fields
    parsed_recipes = [parse_recipe(r) for r in recipes]
    
    return {
        "recipes": parsed_recipes,
        "total": total,
        "limit": limit,
        "offset": offset,
        "hasMore": offset + limit < total
    }

@router.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: str, session: Session = Depends(get_session)):
    """Get single recipe by ID"""
    # Verify if ID is integer
    if not recipe_id.isdigit():
        raise HTTPException(status_code=404, detail="ID de receita inválido")
    
    recipe = session.get(Recipe, int(recipe_id))
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    return parse_recipe(recipe)

@router.post("/recipes")
def create_recipe(recipe_data: dict, session: Session = Depends(get_session)):
    """Create a new recipe"""
    # Convert list fields to JSON strings
    recipe = Recipe(
        title=recipe_data.get("title", ""),
        description=recipe_data.get("description", ""),
        image=recipe_data.get("image", ""),
        time=recipe_data.get("time", ""),
        calories=recipe_data.get("calories", ""),
        servings=recipe_data.get("servings", ""),
        difficulty=recipe_data.get("difficulty", "Fácil"),
        category=recipe_data.get("category", ""),
        ingredients=json.dumps(recipe_data.get("ingredients", []), ensure_ascii=False),
        instructions=json.dumps(recipe_data.get("instructions", []), ensure_ascii=False),
        tags=json.dumps(recipe_data.get("tags", []), ensure_ascii=False),
        rating=recipe_data.get("rating", 0.0),
        reviews=recipe_data.get("reviews", 0),
        reactions_love=recipe_data.get("reactions", {}).get("love", 0),
        reactions_like=recipe_data.get("reactions", {}).get("like", 0),
        reactions_dislike=recipe_data.get("reactions", {}).get("dislike", 0),
        is_premium=recipe_data.get("is_premium", False),
        video_url=recipe_data.get("video_url"),
        author=recipe_data.get("author"),
        source=recipe_data.get("source")
    )
    
    session.add(recipe)
    session.commit()
    session.refresh(recipe)
    
    return parse_recipe(recipe)
