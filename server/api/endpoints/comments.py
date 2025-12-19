import json
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func
from pydantic import BaseModel

from server.db import get_session
from server.models.user import User, Comment, Recipe
from server.api.deps import get_current_active_user
from server.api.endpoints.ai_assistant import check_and_moderate

router = APIRouter()

class CommentRequest(BaseModel):
    recipeId: int
    userId: int
    content: str
    rating: int
    images: Optional[List[str]] = []

@router.get("/comments")
def get_comments(
    recipeId: Optional[int] = None,
    session: Session = Depends(get_session)
):
    query = select(Comment)
    if recipeId:
        query = query.where(Comment.recipe_id == recipeId)
    
    comments = session.exec(query).all()
    
    # Enrich with user info
    enriched = []
    for c in comments:
        user = session.get(User, c.user_id)
        enriched.append({
            "id": str(c.id),
            "content": c.content,
            "rating": c.rating,
            "images": json.loads(c.images) if c.images else [],
            "createdAt": c.created_at.isoformat(),
            "user": {
                "name": user.full_name if user else "Usuário",
                "image": user.avatar_url if user else None
            }
        })
    return enriched

@router.post("/comments")
async def create_comment(
    comment_data: CommentRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    # AI Moderation Check
    is_blocked, message = await check_and_moderate(
        comment_data.content,
        "comment",
        current_user.id,
        session
    )
    
    if is_blocked:
        raise HTTPException(status_code=400, detail=message)

    comment = Comment(
        recipe_id=comment_data.recipeId,
        user_id=current_user.id,
        content=comment_data.content,
        rating=comment_data.rating,
        images=json.dumps(comment_data.images or [])
    )
    
    session.add(comment)
    
    # Update Recipe rating/reviews count
    recipe = session.get(Recipe, comment_data.recipeId)
    if recipe:
        # Avoid division by zero and handle initial rating
        current_count = recipe.reviews or 0
        current_avg = recipe.rating or 0.0
        
        new_count = current_count + 1
        new_avg = ((current_avg * current_count) + comment_data.rating) / new_count
        
        recipe.reviews = new_count
        recipe.rating = round(new_avg, 1)
        session.add(recipe)
    
    session.commit()
    session.refresh(comment)
    
    return {"status": "success", "id": comment.id}
