from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
import openai
import os

from server.db import get_session
from server.api.deps import get_current_active_user

router = APIRouter()

# Initialize OpenAI (will use environment variable OPENAI_API_KEY)
openai.api_key = os.getenv("OPENAI_API_KEY", "")

class GenerateRecipeRequest(BaseModel):
    ingredients: List[str]
    cuisine: str | None = None
    difficulty: str | None = None

class SubstitutionRequest(BaseModel):
    ingredient: str
    reason: str | None = None

class NutritionRequest(BaseModel):
    ingredients: List[str]
    servings: int = 1

@router.post("/ai/generate-recipe")
async def generate_recipe(
    request: GenerateRecipeRequest,
    current_user: dict = Depends(get_current_active_user)
):
    """Generate a recipe using AI based on available ingredients"""
    
    if not openai.api_key:
        return {
            "error": "OpenAI API key not configured",
            "recipe": None
        }
    
    try:
        ingredients_list = ", ".join(request.ingredients)
        cuisine_text = f" de culinária {request.cuisine}" if request.cuisine else ""
        difficulty_text = f" com dificuldade {request.difficulty}" if request.difficulty else ""
        
        prompt = f"""Crie uma receita deliciosa{cuisine_text}{difficulty_text} usando os seguintes ingredientes: {ingredients_list}.

Retorne no seguinte formato JSON:
{{
    "title": "Nome da Receita",
    "description": "Descrição breve e apetitosa",
    "time": "Tempo de preparo (ex: 30 min)",
    "difficulty": "Fácil/Médio/Difícil",
    "servings": "Número de porções",
    "ingredients": [
        {{"quantity": "quantidade", "name": "ingrediente"}}
    ],
    "steps": [
        "Passo 1",
        "Passo 2"
    ],
    "tips": ["Dica 1", "Dica 2"]
}}"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um chef experiente que cria receitas incríveis e detalhadas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=1500
        )
        
        import json
        recipe_data = json.loads(response.choices[0].message.content)
        
        return {
            "success": True,
            "recipe": recipe_data
        }
        
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return {
            "error": str(e),
            "recipe": None
        }

@router.post("/ai/suggest-substitutions")
async def suggest_substitutions(
    request: SubstitutionRequest,
    current_user: dict = Depends(get_current_active_user)
):
    """Suggest ingredient substitutions using AI"""
    
    if not openai.api_key:
        return {
            "error": "OpenAI API key not configured",
            "substitutions": []
        }
    
    try:
        reason_text = f" (motivo: {request.reason})" if request.reason else ""
        prompt = f"""Sugira 3-5 substituições para o ingrediente "{request.ingredient}"{reason_text}.

Para cada substituição, forneça:
1. O ingrediente substituto
2. A proporção de substituição
3. Como isso afeta o sabor/textura

Retorne em formato JSON:
[
    {{
        "substitute": "nome do substituto",
        "ratio": "proporção (ex: 1:1)",
        "notes": "notas sobre sabor/textura"
    }}
]"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um especialista em culinária que conhece substituições de ingredientes."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        import json
        substitutions = json.loads(response.choices[0].message.content)
        
        return {
            "success": True,
            "substitutions": substitutions
        }
        
    except Exception as e:
        print(f"AI Substitution Error: {e}")
        return {
            "error": str(e),
            "substitutions": []
        }

@router.post("/ai/calculate-nutrition")
async def calculate_nutrition(
    request: NutritionRequest,
    current_user: dict = Depends(get_current_active_user)
):
    """Calculate nutritional information using AI"""
    
    if not openai.api_key:
        return {
            "error": "OpenAI API key not configured",
            "nutrition": None
        }
    
    try:
        ingredients_list = ", ".join(request.ingredients)
        prompt = f"""Calcule as informações nutricionais aproximadas para uma receita com os seguintes ingredientes: {ingredients_list}
        
Considere {request.servings} porção(ões).

Retorne em formato JSON:
{{
    "per_serving": {{
        "calories": número,
        "protein": "Xg",
        "carbs": "Xg",
        "fat": "Xg",
        "fiber": "Xg"
    }},
    "total": {{
        "calories": número,
        "protein": "Xg",
        "carbs": "Xg",
        "fat": "Xg",
        "fiber": "Xg"
    }},
    "notes": "Observações importantes sobre a nutrição"
}}"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um nutricionista que calcula informações nutricionais de receitas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=600
        )
        
        import json
        nutrition = json.loads(response.choices[0].message.content)
        
        return {
            "success": True,
            "nutrition": nutrition
        }
        
    except Exception as e:
        print(f"AI Nutrition Error: {e}")
        return {
            "error": str(e),
            "nutrition": None
        }
