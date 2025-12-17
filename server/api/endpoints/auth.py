from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from google.oauth2 import id_token
from google.auth.transport import requests

from server.db import get_session
from server.models import User, Token, GoogleAuthRequest, Provider, Role, RefreshToken, RefreshTokenRequest
from server.core.config import settings
from server.core.security import create_access_token, create_refresh_token
from server.api.deps import get_current_active_user

router = APIRouter()

async def verify_google_token(token_id: str):
    try:
        id_info = id_token.verify_oauth2_token(
            token_id, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Token com emissor inválido')
        return id_info
    except Exception as e:
        print(f"Falha na validação de ID Token: {e}")
        return None

@router.post("/auth/google", response_model=Token)
async def google_login(request: GoogleAuthRequest, session: Session = Depends(get_session)):
    google_user_data = await verify_google_token(request.id_token)
    
    if not google_user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token do Google inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = google_user_data.get('email')
    google_id = google_user_data.get('sub')
    name = google_user_data.get('name')
    picture = google_user_data.get('picture')
    
    if not email:
        raise HTTPException(status_code=400, detail="Email não encontrado no token Google")

    user = session.exec(select(User).where(User.email == email)).first()
    
    if not user:
        user = User(
            email=email,
            full_name=name,
            google_id=google_id,
            avatar_url=picture,
            provider=Provider.GOOGLE,
            role=Role.USER,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    else:
        if user.provider == Provider.LOCAL and not user.google_id:
            user.google_id = google_id
            user.provider = Provider.GOOGLE
            if not user.avatar_url:
                user.avatar_url = picture
            session.add(user)
            session.commit()
            
        if user.disabled:
             raise HTTPException(status_code=403, detail="Conta desativada")

    # Generate Access Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    # Generate Refresh Token (7 Days)
    refresh_token_str = create_refresh_token()
    refresh_token_expires = datetime.utcnow() + timedelta(days=7)
    
    db_refresh_token = RefreshToken(
        user_id=user.id,
        token=refresh_token_str,
        expires_at=refresh_token_expires
    )
    session.add(db_refresh_token)
    session.commit()
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "refresh_token": refresh_token_str,
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/auth/refresh", response_model=Token)
async def refresh_token(request: RefreshTokenRequest, session: Session = Depends(get_session)):
    # 1. Check if token exists in DB
    query = select(RefreshToken).where(RefreshToken.token == request.refresh_token)
    db_token = session.exec(query).first()
    
    if not db_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    # 2. Check Expiry and Revocation
    if db_token.revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Token expired or revoked")
        
    # 3. Get User
    user = session.get(User, db_token.user_id)
    if not user:
         raise HTTPException(status_code=401, detail="User not found")

    # 4. Generate NEW Access Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    # 5. Optional: Rotate Refresh Token (Create new one, revoke old one)
    # For now, we just return the new access token and keep the refresh token valid until expiry
    # to avoid race conditions in frontend parallel requests for this MVP.
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "refresh_token": db_token.token, # Return same refresh token
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
