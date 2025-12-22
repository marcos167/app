"""
Saved Recipes API Endpoints
Save/unsave recipes for later viewing
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from pydantic import BaseModel

from server.db import get_session
from server.models import Recipe, SavedRecipe, User
from server.api.deps import get_current_user

router = APIRouter()


class SaveResponse(BaseModel):
    """Response for save toggle"""
    saved: bool
    count: int


class SavedRecipeItem(BaseModel):
    """Saved recipe with metadata"""
    id: int
    title: str
    image: str
    time: str
    difficulty: str
    category: str
    saved_at: str


class SavedRecipesResponse(BaseModel):
    """List of saved recipes"""
    recipes: List[SavedRecipeItem]
    total: int


@router.post("/recipes/{recipe_id}/save", response_model=SaveResponse)
async def toggle_save(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle save on a recipe.
    If already saved, removes from saved.
    If not saved, adds to saved.
    """
    # Verify recipe exists
    recipe = session.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    
    # Check if already saved
    existing = session.exec(
        select(SavedRecipe).where(
            SavedRecipe.user_id == current_user.id,
            SavedRecipe.recipe_id == recipe_id
        )
    ).first()
    
    if existing:
        # Unsave
        session.delete(existing)
        saved = False
    else:
        # Save
        save = SavedRecipe(user_id=current_user.id, recipe_id=recipe_id)
        session.add(save)
        saved = True
    
    session.commit()
    
    # Get user's total saved count
    count = session.exec(
        select(func.count(SavedRecipe.id)).where(SavedRecipe.user_id == current_user.id)
    ).one()
    
    return SaveResponse(saved=saved, count=count)


@router.get("/recipes/{recipe_id}/save")
async def get_save_status(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Check if current user has saved a recipe.
    """
    existing = session.exec(
        select(SavedRecipe).where(
            SavedRecipe.user_id == current_user.id,
            SavedRecipe.recipe_id == recipe_id
        )
    ).first()
    
    return {"is_saved": existing is not None}


@router.get("/users/me/saved", response_model=SavedRecipesResponse)
async def get_saved_recipes(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all recipes saved by the current user.
    """
    saved_items = session.exec(
        select(SavedRecipe).where(SavedRecipe.user_id == current_user.id)
    ).all()
    
    if not saved_items:
        return SavedRecipesResponse(recipes=[], total=0)
    
    # Get recipe details
    recipe_ids = [s.recipe_id for s in saved_items]
    recipes = session.exec(
        select(Recipe).where(Recipe.id.in_(recipe_ids))
    ).all()
    
    # Map saved_at dates
    saved_dates = {s.recipe_id: s.created_at for s in saved_items}
    
    items = []
    for recipe in recipes:
        items.append(SavedRecipeItem(
            id=recipe.id,
            title=recipe.title,
            image=recipe.image,
            time=recipe.time,
            difficulty=recipe.difficulty,
            category=recipe.category,
            saved_at=saved_dates[recipe.id].isoformat() if recipe.id in saved_dates else ""
        ))
    
    return SavedRecipesResponse(recipes=items, total=len(items))


@router.delete("/users/me/saved")
async def clear_saved_recipes(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Clear all saved recipes for the current user.
    """
    saved_items = session.exec(
        select(SavedRecipe).where(SavedRecipe.user_id == current_user.id)
    ).all()
    
    count = len(saved_items)
    
    for item in saved_items:
        session.delete(item)
    
    session.commit()
    
    return {"message": f"{count} receitas removidas dos salvos", "cleared": count}
