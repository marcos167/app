from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel

from server.db import get_session
from server.models import User, SupportTicket, SupportMessage
from server.api.deps import get_current_user

router = APIRouter()

class MessageRequest(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    sender: str
    content: str
    created_at: datetime

class HistoryResponse(BaseModel):
    ticket_id: int
    status: str
    messages: List[MessageResponse]

# Knowledge Base
FAQ = {
    "preço": "O plano MasterChef custa R$ 19,90/mês e te dá acesso ilimitado a todas as receitas e vídeos.",
    "custo": "O plano MasterChef custa R$ 19,90/mês e te dá acesso ilimitado a todas as receitas e vídeos.",
    "valor": "O plano MasterChef custa R$ 19,90/mês e te dá acesso ilimitado a todas as receitas e vídeos.",
    "plano": "Temos o plano Grátis (receitas básicas) e o MasterChef (tudo liberado + vídeos 4K).",
    "grátis": "O plano Grátis permite ver receitas simples e salvar favoritos.",
    "cancelar": "Você pode cancelar sua assinatura a qualquer momento na página de Perfil > Gerenciar Assinatura.",
    "pagamento": "Aceitamos Cartão de Crédito via Stripe. O Pix estará disponível em breve.",
    "cartão": "Aceitamos as principais bandeiras de cartão de crédito via Stripe.",
    "erro": "Se encontrou um erro, tente recarregar a página. Se persistir, posso chamar um humano.",
    "humano": "human_handoff",
    "atendente": "human_handoff",
    "suporte": "human_handoff"
}

def analyze_intent(content: str) -> str:
    content_lower = content.lower()
    for key, answer in FAQ.items():
        if key in content_lower:
            return answer
    return "Desculpe, não entendi muito bem. Poderia reformular ou ser mais específico?"

@router.post("/message", response_model=List[MessageResponse])
def send_message(
    body: MessageRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # 1. Get or Create Active Ticket
    statement = select(SupportTicket).where(
        SupportTicket.user_id == current_user.id,
        SupportTicket.status != "resolved"
    )
    ticket = session.exec(statement).first()
    
    if not ticket:
        ticket = SupportTicket(user_id=current_user.id, status="bot")
        session.add(ticket)
        session.commit()
        session.refresh(ticket)
    
    # 2. Save User Message
    user_msg = SupportMessage(
        ticket_id=ticket.id,
        sender="user",
        content=body.content
    )
    session.add(user_msg)
    
    # 3. Analyze and Generate Bot Response
    # Check if already in queue
    if ticket.status == "in_queue":
        bot_content = "Um atendente humano responderá em breve. Por favor, aguarde."
    else:
        # Check escalation threshold - Last 7 messages from user
        history = session.exec(select(SupportMessage).where(SupportMessage.ticket_id == ticket.id).order_by(SupportMessage.created_at.desc()).limit(14)).all()
        user_msgs_count = sum(1 for m in history if m.sender == "user")
        
        bot_content = analyze_intent(body.content)
        
        # Explicit request for human
        if bot_content == "human_handoff":
            ticket.status = "in_queue"
            session.add(ticket)
            bot_content = "Entendido. Estou transferindo você para um de nossos especialistas humanos. Aguarde um momento."
        
        # Automatic escalation (7 attempts)
        elif user_msgs_count >= 7 and ticket.status == "bot":
             ticket.status = "in_queue"
             session.add(ticket)
             bot_content += "\n\n(Notei que não conseguimos resolver. Transferi para um humano para te ajudar melhor.)"

    # 4. Save Bot Message
    bot_msg = SupportMessage(
        ticket_id=ticket.id,
        sender="bot",
        content=bot_content
    )
    session.add(bot_msg)
    session.commit()
    session.refresh(user_msg)
    session.refresh(bot_msg)
    
    return [user_msg, bot_msg]

@router.get("/history", response_model=HistoryResponse)
def get_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get active or last ticket
    statement = select(SupportTicket).where(SupportTicket.user_id == current_user.id).order_by(SupportTicket.created_at.desc())
    ticket = session.exec(statement).first()
    
    if not ticket:
        return {"ticket_id": 0, "status": "new", "messages": []}
        
    messages = session.exec(select(SupportMessage).where(SupportMessage.ticket_id == ticket.id).order_by(SupportMessage.created_at)).all()
    
    return {
        "ticket_id": ticket.id,
        "status": ticket.status,
        "messages": messages
    }
