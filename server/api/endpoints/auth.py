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
        # Try as ID Token first (fast, JWT check)
        try:
            print(f"DEBUG: Attempting ID Token verification with GOOGLE_CLIENT_ID: {settings.GOOGLE_CLIENT_ID[:20]}...")
            id_info = id_token.verify_oauth2_token(token_id, requests.Request(), settings.GOOGLE_CLIENT_ID)
            print(f"DEBUG: ID Token verification successful. Email: {id_info.get('email')}")
            return id_info
        except Exception as id_token_error:
            print(f"DEBUG: ID Token verification failed: {str(id_token_error)}")
            # Fallback: Try as Access Token (fetch userinfo)
            import requests as req
            print(f"DEBUG: Trying Access Token fallback...")
            resp = req.get(
                "https://www.googleapis.com/oauth2/v3/userinfo", 
                headers={"Authorization": f"Bearer {token_id}"}
            )
            print(f"DEBUG: Userinfo API response status: {resp.status_code}")
            if resp.status_code != 200:
                print(f"DEBUG: Userinfo API failed with: {resp.text}")
                return None
            user_data = resp.json()
            print(f"DEBUG: Access Token verification successful. Email: {user_data.get('email')}")
            return user_data
    except Exception as e:
        print(f"ERROR: Token validation completely failed: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return None

@router.post("/auth/google", response_model=Token)
async def google_login(request: GoogleAuthRequest, session: Session = Depends(get_session)):
    print(f"DEBUG: Google Login Request - Token len: {len(request.id_token)}")
    print(f"DEBUG: Token preview: {request.id_token[:50]}...")
    try:
        google_user_data = await verify_google_token(request.id_token)
        
        if not google_user_data:
            print("ERROR: Token verification returned None")
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
                provider="google",
                role="user",
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        else:
            if user.provider == "local" and not user.google_id:
                user.google_id = google_id
                user.provider = "google"
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
    except Exception as e:
        import traceback
        error_msg = f"Server Error: {str(e)} | {traceback.format_exc()}"
        print(error_msg)
        # Return 400 instead of 500 so the frontend alert() can show the message
        raise HTTPException(status_code=400, detail=str(e))

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

# ============== EMAIL/PASSWORD AUTH ==============

from server.models import SignupRequest, LoginRequest
from server.core.security import get_password_hash, verify_password

@router.post("/auth/signup", response_model=Token)
async def signup(request: SignupRequest, session: Session = Depends(get_session)):
    """
    Create a new account with email and password.
    """
    print(f"DEBUG: Signup Request - Email: {request.email}, Name: {request.name}")
    try:
        # 1. Check if email already exists
        existing_user = session.exec(select(User).where(User.email == request.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este email já está cadastrado"
            )
        
        # 2. Validate password
        if len(request.password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A senha deve ter pelo menos 6 caracteres"
            )
        
        # 3. Create user
        hashed_password = get_password_hash(request.password)
        user = User(
            email=request.email,
            full_name=request.name,
            hashed_password=hashed_password,
            provider="local",
            role="user",
            plan_tier="free"
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # 4. Generate tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=access_token_expires
        )
        
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
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Signup Error: {str(e)} | {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/auth/login", response_model=Token)
async def login(request: LoginRequest, session: Session = Depends(get_session)):
    """
    Login with email and password.
    """
    try:
        # 1. Find user by email
        user = session.exec(select(User).where(User.email == request.email)).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        # 2. Check if user has a password (might be Google-only account)
        if not user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Esta conta usa login pelo Google. Use o botão Google para entrar."
            )
        
        # 3. Verify password
        if not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        # 4. Check if disabled
        if user.disabled:
            raise HTTPException(status_code=403, detail="Conta desativada")
        
        # 5. Generate tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=access_token_expires
        )
        
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
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Login Error: {str(e)} | {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=str(e))
@router.put("/users/{user_id}")
async def update_user(user_id: int, user_data: dict, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Não permitido")
    
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if "image" in user_data:
        user.avatar_url = user_data["image"]
    if "full_name" in user_data:
        user.full_name = user_data["full_name"]
        
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
