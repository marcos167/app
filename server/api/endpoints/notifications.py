from typing import List
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime

from server.db import get_session
from server.api.deps import get_current_active_user
from server.models.user import User

router = APIRouter()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

manager = ConnectionManager()

# Models
class Notification(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    message: str
    link: str | None
    is_read: bool
    created_at: datetime

class CreateNotification(BaseModel):
    user_id: int
    type: str
    title: str
    message: str
    link: str | None = None

@router.get("/notifications", response_model=List[Notification])
async def get_notifications(
    limit: int = 50,
    unread_only: bool = False,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_active_user)
):
    """Get user notifications"""
    user_id = current_user['id']
    
    try:
        # Query notifications using text() for SQLAlchemy 2.0 compatibility
        from sqlalchemy import text
        from server.db import engine
        
        query = text(f"""
            SELECT id, user_id, type, title, message, link, is_read, created_at
            FROM notifications
            WHERE user_id = :user_id
            {' AND is_read = FALSE' if unread_only else ''}
            ORDER BY created_at DESC
            LIMIT :limit
        """)
        
        with engine.connect() as conn:
            result = conn.execute(query, {"user_id": user_id, "limit": limit})
            notifications = []
            for row in result:
                notifications.append(Notification(
                    id=row[0],
                    user_id=row[1],
                    type=row[2],
                    title=row[3],
                    message=row[4],
                    link=row[5],
                    is_read=row[6],
                    created_at=row[7]
                ))
        
        return notifications
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        # Return empty list instead of crashing
        return []

@router.patch("/notifications/{notification_id}/read")
async def mark_as_read(
    notification_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_active_user)
):
    """Mark notification as read"""
    user_id = current_user['id']
    
    try:
        from sqlalchemy import text
        from server.db import engine
        with engine.connect() as conn:
            conn.execute(text("""
                UPDATE notifications
                SET is_read = TRUE
                WHERE id = :notification_id AND user_id = :user_id
            """), {"notification_id": notification_id, "user_id": user_id})
            conn.commit()
        
        return {"success": True}
    except Exception as e:
        print(f"Error marking notification as read: {e}")
        return {"success": False, "error": str(e)}

@router.post("/notifications/create")
async def create_notification(
    notification: CreateNotification,
    session: Session = Depends(get_session)
):
    """Create a new notification (internal use)"""
    
    try:
        from sqlalchemy import text
        from server.db import engine
        with engine.connect() as conn:
            result = conn.execute(text("""
                INSERT INTO notifications (user_id, type, title, message, link)
                VALUES (:user_id, :type, :title, :message, :link)
                RETURNING id
            """), {
                "user_id": notification.user_id,
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "link": notification.link
            })
            conn.commit()
            notification_id = result.fetchone()[0]
        
        # Send via WebSocket if user is connected
        await manager.send_personal_message({
            "type": notification.type,
            "title": notification.title,
            "message": notification.message,
            "link": notification.link
        }, notification.user_id)
        
        return {"id": notification_id, "success": True}
    except Exception as e:
        print(f"Error creating notification: {e}")
        return {"success": False, "error": str(e)}

@router.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """WebSocket endpoint for real-time notifications"""
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Echo back for ping/pong
            await websocket.send_text(f"pong: {data}")
    except WebSocketDisconnect:
        manager.disconnect(user_id)
