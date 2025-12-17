from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from server.db import get_session
from server.models import Recipe

router = APIRouter()

@router.get("/recipes", response_model=List[Recipe])
def get_recipes(
    status: str = "published", 
    skip: int = 0, 
    limit: int = 20, 
    session: Session = Depends(get_session)
):
    """
    Get recipes with pagination.
    skip: number of items to skip (offset)
    limit: max number of items to return (default 20)
    """
    query = select(Recipe).where(Recipe.status == status).offset(skip).limit(limit)
    recipes = session.exec(query).all()
    
    # SEED DATA Logic (kept for MVP convenience)
    if not recipes and skip == 0:
        # Check if table is truly empty or just this query
        all_count = session.exec(select(Recipe)).first()
        if not all_count:
             seed_recipes = [
                Recipe(title="Salmão Grelhado com Aspargos", description="Leve e sofisticado.", image="https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=1287&auto=format&fit=crop", time="25 min", calories="320 kcal", servings=2, category="Frutos do Mar", rating=4.8, reviews=124, is_premium=False),
                Recipe(title="Risoto de Funghi", description="Cremoso e saboroso.", image="https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop", time="30 min", calories="450 kcal", servings=2, category="Jantar", rating=4.5, reviews=89, is_premium=False),
                Recipe(title="Bolo de Cenoura", description="Clássico brasileiro.", image="https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?q=80&w=1000&auto=format&fit=crop", time="45 min", calories="500 kcal", servings=8, category="Sobremesas", rating=4.9, reviews=210, is_premium=False),
                Recipe(title="Smoothie Tropical", description="Refrescante.", image="https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=1000&auto=format&fit=crop", time="10 min", calories="150 kcal", servings=1, category="Bebidas", rating=4.7, reviews=45, is_premium=False),
                Recipe(title="Lagosta Thermidor", description="Apenas para mestres. Vídeo aula exclusiva 4K inclusa.", image="https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1000&auto=format&fit=crop", time="60 min", calories="800 kcal", servings=2, category="Frutos do Mar", rating=5.0, reviews=32, is_premium=True, video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
            ]
             for r in seed_recipes:
                session.add(r)
             session.commit()
             # Re-query
             recipes = session.exec(query).all()
        
    return recipes

@router.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(recipe_id: str, session: Session = Depends(get_session)):
    # Verify if ID is integer (Real DB) or String (Mock)
    if not recipe_id.isdigit():
        # If it's a string ID (like from mock data), we return 404
        # This allows frontend to use its fallback mock data
        raise HTTPException(status_code=404, detail="Receita (Mock) não encontrada no banco real")
    
    recipe = session.get(Recipe, int(recipe_id))
    if not recipe:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return recipe

@router.post("/recipes", response_model=Recipe)
def create_recipe(recipe: Recipe, session: Session = Depends(get_session)):
    session.add(recipe)
    session.commit()
    session.refresh(recipe)
    return recipe
