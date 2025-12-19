from typing import List, Optional
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from pydantic import BaseModel
from server.db import get_session
from server.models import Recipe, User
from server.api.deps import get_current_moderator, get_current_active_user
from server.api.endpoints.ai_assistant import check_and_moderate

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
async def create_recipe(
    recipe_data: dict, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new recipe with AI moderation"""
    # AI Moderation Check
    content_to_scan = f"{recipe_data.get('title', '')} {recipe_data.get('description', '')}"
    is_blocked, message = await check_and_moderate(
        content_to_scan, 
        "recipe", 
        current_user.id, 
        session
    )
    
    if is_blocked:
        raise HTTPException(status_code=400, detail=message)

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

@router.delete("/recipes/{recipe_id}")
def delete_recipe(
    recipe_id: int, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_moderator) # Requires Admin or Moderator
):
    """Delete a recipe (Moderator/Admin only)"""
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    session.delete(recipe)
    session.commit()
    
    return {"status": "success", "message": "Receita removida com sucesso"}

@router.patch("/recipes/{recipe_id}/status")
def toggle_recipe_status(
    recipe_id: int,
    status_data: dict,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_moderator)
):
    """Toggle recipe status between published and draft"""
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    new_status = status_data.get("status", "published")
    if new_status not in ["published", "draft"]:
        raise HTTPException(status_code=400, detail="Status inválido. Use 'published' ou 'draft'")
    
    recipe.status = new_status
    session.add(recipe)
    session.commit()
    session.refresh(recipe)
    
    return {"status": "success", "message": f"Status alterado para {new_status}", "recipe": parse_recipe(recipe)}

@router.post("/recipes/{recipe_id}/duplicate")
def duplicate_recipe(
    recipe_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_moderator)
):
    """Duplicate an existing recipe"""
    original = session.get(Recipe, recipe_id)
    if not original:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    # Create a copy
    duplicate = Recipe(
        title=f"{original.title} (Cópia)",
        description=original.description,
        image=original.image,
        time=original.time,
        calories=original.calories,
        servings=original.servings,
        difficulty=original.difficulty,
        category=original.category,
        ingredients=original.ingredients,
        instructions=original.instructions,
        tags=original.tags,
        rating=0.0,  # Reset rating
        reviews=0,   # Reset reviews
        reactions_love=0,
        reactions_like=0,
        reactions_dislike=0,
        is_premium=original.is_premium,
        video_url=original.video_url,
        author=original.author,
        source=original.source,
        status="draft"  # Start as draft
    )
    
    session.add(duplicate)
    session.commit()
    session.refresh(duplicate)
    
    return {"status": "success", "message": "Receita duplicada com sucesso", "recipe": parse_recipe(duplicate)}

@router.put("/recipes/{recipe_id}")
def update_recipe(
    recipe_id: int,
    recipe_data: dict,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_moderator)
):
    """Update an existing recipe"""
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    # Update fields
    if "title" in recipe_data:
        recipe.title = recipe_data["title"]
    if "description" in recipe_data:
        recipe.description = recipe_data["description"]
    if "image" in recipe_data:
        recipe.image = recipe_data["image"]
    if "time" in recipe_data:
        recipe.time = recipe_data["time"]
    if "calories" in recipe_data:
        recipe.calories = recipe_data["calories"]
    if "servings" in recipe_data:
        recipe.servings = recipe_data["servings"]
    if "difficulty" in recipe_data:
        recipe.difficulty = recipe_data["difficulty"]
    if "category" in recipe_data:
        recipe.category = recipe_data["category"]
    if "ingredients" in recipe_data:
        recipe.ingredients = json.dumps(recipe_data["ingredients"], ensure_ascii=False)
    if "instructions" in recipe_data:
        recipe.instructions = json.dumps(recipe_data["instructions"], ensure_ascii=False)
    if "tags" in recipe_data:
        recipe.tags = json.dumps(recipe_data["tags"], ensure_ascii=False)
    if "is_premium" in recipe_data:
        recipe.is_premium = recipe_data["is_premium"]
    if "video_url" in recipe_data:
        recipe.video_url = recipe_data["video_url"]
    if "status" in recipe_data:
        recipe.status = recipe_data["status"]
    
    session.add(recipe)
    session.commit()
    session.refresh(recipe)
    
    return {"status": "success", "message": "Receita atualizada com sucesso", "recipe": parse_recipe(recipe)}
