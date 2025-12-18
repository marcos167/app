import os
import time
import secrets
import uuid
from typing import Optional, List
from datetime import datetime, timedelta
from enum import Enum

from fastapi import FastAPI, Depends, HTTPException, status, Body, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests

# Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# =======================
# CONFIGURAÇÃO
# =======================

# Em produção, use variáveis de ambiente!
SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_secreta_super_segura")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY", "refresh_chave_secreta_diferente")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Short-lived access token
REFRESH_TOKEN_EXPIRE_DAYS = 7     # Long-lived refresh token
# Client ID fornecido pelo usuário
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "1019372792734-k6s58dq78pov4ktnhoiv9ddf3mkbjrf3.apps.googleusercontent.com")

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Banco de Dados (PostgreSQL - Supabase)
# Note: @ in password must be URL-encoded as %40
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:MgDs%4022338294@db.zgypmhtyizwdkmwnkygg.supabase.co:5432/postgres"
)

# Criar engine para PostgreSQL
engine = create_engine(DATABASE_URL, echo=False)

# Autenticação
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# =======================
# MODELOS (SQLModel)
# =======================

class Provider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"

class Role(str, Enum):
    USER = "user"
    CREATOR = "creator"  # Content creators - can publish recipes
    ADMIN = "admin"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    # Senha pode ser nula se o usuário vier do Google
    hashed_password: Optional[str] = None
    
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Campos Google
    google_id: Optional[str] = Field(default=None, unique=True, index=True)
    provider: Provider = Field(default=Provider.LOCAL)
    
    role: Role = Field(default=Role.USER)
    disabled: bool = False
    
    # Email Verification
    email_verified: bool = False
    email_verification_token: Optional[str] = None
    email_verification_expires: Optional[datetime] = None
    
    # Password Reset
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None
    
    # Security
    failed_login_attempts: int = 0
    locked_until: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Refresh Token Model
class RefreshToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    token: str = Field(unique=True, index=True)
    user_id: int = Field(foreign_key="user.id")
    expires_at: datetime
    revoked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    id_token: str

# Modelo para log de auditoria de admins
class AdminAuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    admin_id: int = Field(foreign_key="user.id")
    action: str  # ban, unban, role_change, etc.
    target_user_id: int = Field(foreign_key="user.id")
    details: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Modelos de Request/Response para Admin
class UserBanRequest(BaseModel):
    reason: Optional[str] = None

class RoleChangeRequest(BaseModel):
    new_role: Role


# =======================
# UTILITÁRIOS
# =======================

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(user_id: int, session: Session) -> str:
    """Creates a new refresh token and stores it in the database."""
    token = secrets.token_urlsafe(64)
    expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    refresh_token = RefreshToken(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    session.add(refresh_token)
    session.commit()
    
    return token

def revoke_refresh_token(token: str, session: Session):
    """Revokes a refresh token."""
    db_token = session.exec(select(RefreshToken).where(RefreshToken.token == token)).first()
    if db_token:
        db_token.revoked = True
        session.add(db_token)
        session.commit()

def validate_refresh_token(token: str, session: Session) -> Optional[User]:
    """Validates a refresh token and returns the associated user."""
    db_token = session.exec(select(RefreshToken).where(RefreshToken.token == token)).first()
    
    if not db_token:
        return None
    if db_token.revoked:
        return None
    if db_token.expires_at < datetime.utcnow():
        return None
    
    user = session.get(User, db_token.user_id)
    return user

def generate_email_verification_token() -> str:
    """Generates a secure token for email verification."""
    return secrets.token_urlsafe(32)

def generate_password_reset_token() -> str:
    """Generates a secure token for password reset."""
    return secrets.token_urlsafe(32)

async def verify_google_token(token_id: str):
    """
    Valida o token. Tenta primeiro como ID Token (JWT), depois como Access Token.
    """
    # TENTATIVA 1: ID Token (JWT Assinado)
    try:
        id_info = id_token.verify_oauth2_token(
            token_id, 
            requests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Token com emissor inválido')
        return id_info
    except Exception as e:
        print(f"Falha na validação de ID Token: {e}. Tentando como Access Token...")

    # TENTATIVA 2: Access Token (UserInfo Endpoint)
    try:
        # Usamos requests síncrono aqui por simplicidade no exemplo, 
        # mas em produção use aiohttp ou httpx
        import requests as req
        resp = req.get('https://www.googleapis.com/oauth2/v3/userinfo', headers={'Authorization': f'Bearer {token_id}'})
        if resp.status_code == 200:
            user_info = resp.json()
            # Mapeia para o formato esperado (sub, email, picture, name)
            return user_info
    except Exception as e:
        print(f"Falha na validação de Access Token: {e}")
        return None
    
    return None

# =======================
# DEPENDÊNCIAS
# =======================

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
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
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Usuário inativo")
    return current_user

# Dependency para verificar se é admin
async def get_current_admin_user(current_user: User = Depends(get_current_active_user)):
    if current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Requer privilégios de administrador."
        )
    return current_user

# RoleChecker para proteção de rotas por role
from typing import List

class RoleChecker:
    def __init__(self, allowed_roles: List[Role]):
        self.allowed_roles = allowed_roles

    async def __call__(self, user: User = Depends(get_current_active_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operação não permitida. Requer papéis: {[r.value for r in self.allowed_roles]}"
            )
        return user

# Helper para logar ações de admin
def log_admin_action(session: Session, admin_id: int, action: str, target_user_id: int, details: str = None):
    log = AdminAuditLog(
        admin_id=admin_id,
        action=action,
        target_user_id=target_user_id,
        details=details
    )
    session.add(log)
    session.commit()


# =======================
# APLICAÇÃO
# =======================

app = FastAPI(title="Google OAuth API")

# Rate Limiting State
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configuração de CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "API de Autenticação Google está rodando!"}

# --- ROTA PRINCIPAL DE LOGIN COM GOOGLE ---
@app.post("/auth/google", response_model=Token)
@limiter.limit("5/minute")
async def google_login(request: Request, auth_request: GoogleAuthRequest, session: Session = Depends(get_session)):
    """
    Recebe um ID Token do frontend, valida no Google e gera um JWT da aplicação.
    Cria o usuário se ele não existir.
    """
    
    # 1. Validar token com o Google
    google_user_data = await verify_google_token(auth_request.id_token)
    
    if not google_user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token do Google inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 2. Extrair dados do token
    email = google_user_data.get('email')
    google_id = google_user_data.get('sub')
    name = google_user_data.get('name')
    picture = google_user_data.get('picture')
    
    if not email:
        raise HTTPException(status_code=400, detail="Email não encontrado no token Google")

    # 3. Verificar usuário no banco
    user = session.exec(select(User).where(User.email == email)).first()
    
    if not user:
        # CRIAR NOVO USUÁRIO
        print(f"Criando novo usuário via Google: {email}")
        user = User(
            email=email,
            full_name=name,
            google_id=google_id,
            avatar_url=picture,
            provider=Provider.GOOGLE,
            role=Role.USER,
            hashed_password=None,
            email_verified=True  # Google email is already verified
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
    else:
        # USUÁRIO JÁ EXISTE
        
        # Se usuário existe mas foi criado via senha (LOCAL) e não tem google_id vinculado
        if user.provider == Provider.LOCAL and not user.google_id:
            print(f"Vinculando conta Local existente ao Google: {email}")
            user.google_id = google_id
            user.provider = Provider.GOOGLE
            user.email_verified = True  # Mark as verified since Google validated
            if not user.avatar_url:
                user.avatar_url = picture
            session.add(user)
            session.commit()
            
        # Se usuário foi banido
        if user.disabled:
             raise HTTPException(status_code=403, detail="Conta desativada")

    # 4. Gerar Access Token e Refresh Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(user.id, session)
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


# --- REFRESH TOKEN ---
@app.post("/auth/refresh", response_model=Token)
@limiter.limit("10/minute")
async def refresh_access_token(request: Request, token_request: RefreshTokenRequest, session: Session = Depends(get_session)):
    """
    Renova o access token usando um refresh token válido.
    Implementa rotação de tokens (revoga o antigo e gera novo).
    """
    user = validate_refresh_token(token_request.refresh_token, session)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido ou expirado"
        )
    
    if user.disabled:
        raise HTTPException(status_code=403, detail="Conta desativada")
    
    # Revogar token antigo (rotação)
    revoke_refresh_token(token_request.refresh_token, session)
    
    # Gerar novos tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    new_refresh_token = create_refresh_token(user.id, session)
    
    return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}


# --- LOGOUT ---
@app.post("/auth/logout")
async def logout(token_request: RefreshTokenRequest, session: Session = Depends(get_session)):
    """
    Invalida o refresh token (logout).
    """
    revoke_refresh_token(token_request.refresh_token, session)
    return {"message": "Logout realizado com sucesso"}


# --- EMAIL VERIFICATION ---
@app.get("/auth/verify-email/{token}")
async def verify_email(token: str, session: Session = Depends(get_session)):
    """
    Verifica o email do usuário usando o token enviado por email.
    """
    user = session.exec(select(User).where(User.email_verification_token == token)).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Token de verificação inválido")
    
    if user.email_verification_expires and user.email_verification_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token de verificação expirado")
    
    user.email_verified = True
    user.email_verification_token = None
    user.email_verification_expires = None
    session.add(user)
    session.commit()
    
    return {"message": "Email verificado com sucesso!"}



# --- ROTA PARA DADOS DO PERFIL (PROTEGIDA) ---
@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


# =======================
# ROTAS ADMIN
# =======================

@app.get("/admin/users")
async def admin_list_users(
    current_admin: User = Depends(get_current_admin_user),
    session: Session = Depends(get_session)
):
    """Lista todos os usuários (apenas admins)"""
    users = session.exec(select(User)).all()
    return [{"id": u.id, "email": u.email, "name": u.full_name, "role": u.role, "disabled": u.disabled, "provider": u.provider, "created_at": u.created_at} for u in users]

@app.post("/admin/users/{user_id}/ban")
async def admin_ban_user(
    user_id: int,
    request: UserBanRequest = None,
    current_admin: User = Depends(get_current_admin_user),
    session: Session = Depends(get_session)
):
    """Bane um usuário (apenas admins)"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Você não pode banir a si mesmo")
    
    if user.role == Role.ADMIN:
        raise HTTPException(status_code=400, detail="Não é possível banir outro administrador")
    
    user.disabled = True
    session.add(user)
    
    # Log da ação
    reason = request.reason if request else "Sem motivo especificado"
    log_admin_action(session, current_admin.id, "ban", user_id, reason)
    
    session.commit()
    
    return {"message": f"Usuário {user.email} foi banido", "reason": reason}

@app.post("/admin/users/{user_id}/unban")
async def admin_unban_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    session: Session = Depends(get_session)
):
    """Desbane um usuário (apenas admins)"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if not user.disabled:
        raise HTTPException(status_code=400, detail="Usuário não está banido")
    
    user.disabled = False
    session.add(user)
    
    log_admin_action(session, current_admin.id, "unban", user_id)
    
    session.commit()
    
    return {"message": f"Usuário {user.email} foi desbanido"}

@app.post("/admin/users/{user_id}/role")
async def admin_change_role(
    user_id: int,
    request: RoleChangeRequest,
    current_admin: User = Depends(get_current_admin_user),
    session: Session = Depends(get_session)
):
    """Altera o papel de um usuário (apenas admins)"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Você não pode alterar seu próprio papel")
    
    old_role = user.role
    user.role = request.new_role
    session.add(user)
    
    log_admin_action(session, current_admin.id, "role_change", user_id, f"{old_role} -> {request.new_role}")
    
    session.commit()
    
    return {"message": f"Papel de {user.email} alterado de {old_role} para {request.new_role}"}

@app.get("/admin/logs")
async def admin_get_logs(
    current_admin: User = Depends(get_current_admin_user),
    session: Session = Depends(get_session),
    limit: int = 50
):
    """Retorna logs de auditoria (apenas admins)"""
    logs = session.exec(select(AdminAuditLog).order_by(AdminAuditLog.created_at.desc()).limit(limit)).all()
    return logs


# =======================
# UPLOAD SEGURO DE IMAGENS
# =======================

import io
from fastapi import UploadFile, File
from fastapi.staticfiles import StaticFiles

UPLOAD_DIR = "uploads"
THUMBNAIL_DIR = "uploads/thumbnails"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Create dirs if not exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(THUMBNAIL_DIR, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

@app.post("/api/upload/image")
@limiter.limit("10/minute")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Secure image upload:
    - Validates extension and Content-Type
    - Validates Magic Bytes (via Pillow)
    - Limits size (5MB)
    - Sanitizes filename (UUID)
    - Generates Thumbnail
    - Removes metadata (strip)
    """
    try:
        from PIL import Image, UnidentifiedImageError
    except ImportError:
        raise HTTPException(status_code=500, detail="Pillow not installed")
    
    # 1. Basic validation
    filename = file.filename.lower()
    ext = os.path.splitext(filename)[1]
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Extensão inválida. Permitido: jpg, png, webp")
    
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de arquivo inválido.")

    # 2. Read and validate size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo muito grande. Máximo 5MB.")

    # 3. Deep validation with Pillow
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()
        image = Image.open(io.BytesIO(content))
    except (UnidentifiedImageError, IOError):
        raise HTTPException(status_code=400, detail="Imagem corrompida ou inválida.")

    # 4. Generate secure filename
    secure_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, secure_filename)
    thumb_path = os.path.join(THUMBNAIL_DIR, secure_filename)

    # 5. Save sanitized image
    try:
        image.save(file_path, format=image.format, optimize=True, quality=90)
        image.thumbnail((300, 300))
        image.save(thumb_path, format=image.format, optimize=True, quality=80)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erro ao processar imagem.")

    return {
        "filename": secure_filename,
        "url": f"/static/{secure_filename}",
        "thumbnail_url": f"/static/thumbnails/{secure_filename}",
        "size_bytes": len(content)
    }


# =======================
# SISTEMA DE SEGUIDORES
# =======================

class Follower(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    follower_id: int = Field(foreign_key="user.id", index=True)
    following_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

@app.post("/api/users/{user_id}/follow")
async def follow_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Follow a user"""
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Você não pode seguir a si mesmo")
    
    target = session.get(User, user_id)
    if not target:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    existing = session.exec(
        select(Follower).where(
            Follower.follower_id == current_user.id,
            Follower.following_id == user_id
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Você já segue este usuário")
    
    follow = Follower(follower_id=current_user.id, following_id=user_id)
    session.add(follow)
    session.commit()
    
    return {"message": f"Agora você segue {target.full_name or target.email}"}

@app.delete("/api/users/{user_id}/follow")
async def unfollow_user(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Unfollow a user"""
    follow = session.exec(
        select(Follower).where(
            Follower.follower_id == current_user.id,
            Follower.following_id == user_id
        )
    ).first()
    
    if not follow:
        raise HTTPException(status_code=400, detail="Você não segue este usuário")
    
    session.delete(follow)
    session.commit()
    
    return {"message": "Deixou de seguir"}

@app.get("/api/users/{user_id}/followers")
async def get_followers(user_id: int, session: Session = Depends(get_session)):
    """Get user's followers"""
    followers = session.exec(
        select(Follower).where(Follower.following_id == user_id)
    ).all()
    return {"count": len(followers), "followers": followers}

@app.get("/api/users/{user_id}/following")
async def get_following(user_id: int, session: Session = Depends(get_session)):
    """Get who user is following"""
    following = session.exec(
        select(Follower).where(Follower.follower_id == user_id)
    ).all()
    return {"count": len(following), "following": following}


# =======================
# SISTEMA DE COMENTÁRIOS
# =======================

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    content_type: str  # "recipe", "post", "reel"
    content_id: str = Field(index=True)
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CommentCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)

@app.post("/api/{content_type}/{content_id}/comments")
@limiter.limit("20/minute")
async def create_comment(
    request: Request,
    content_type: str,
    content_id: str,
    comment: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Add a comment to content"""
    if content_type not in ["recipe", "post", "reel"]:
        raise HTTPException(status_code=400, detail="Tipo de conteúdo inválido")
    
    new_comment = Comment(
        user_id=current_user.id,
        content_type=content_type,
        content_id=content_id,
        text=comment.text
    )
    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)
    
    return new_comment

@app.get("/api/{content_type}/{content_id}/comments")
async def get_comments(
    content_type: str,
    content_id: str,
    session: Session = Depends(get_session),
    limit: int = 50,
    offset: int = 0
):
    """Get comments for content with pagination"""
    comments = session.exec(
        select(Comment)
        .where(Comment.content_type == content_type, Comment.content_id == content_id)
        .order_by(Comment.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    return {"comments": comments, "count": len(comments)}


# =======================
# PLANEJAMENTO SEMANAL
# =======================

class MealPlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    date: str = Field(index=True)  # YYYY-MM-DD
    meal_type: str  # breakfast, lunch, dinner, snack
    recipe_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MealPlanCreate(BaseModel):
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    meal_type: str = Field(..., pattern=r"^(breakfast|lunch|dinner|snack)$")
    recipe_id: str

@app.post("/api/meal-plans")
async def create_meal_plan(
    plan: MealPlanCreate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Add recipe to meal plan"""
    meal = MealPlan(
        user_id=current_user.id,
        date=plan.date,
        meal_type=plan.meal_type,
        recipe_id=plan.recipe_id
    )
    session.add(meal)
    session.commit()
    session.refresh(meal)
    return meal

@app.get("/api/meal-plans")
async def get_meal_plans(
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session),
    start_date: str = None,
    end_date: str = None
):
    """Get user's meal plans"""
    query = select(MealPlan).where(MealPlan.user_id == current_user.id)
    
    if start_date:
        query = query.where(MealPlan.date >= start_date)
    if end_date:
        query = query.where(MealPlan.date <= end_date)
    
    plans = session.exec(query.order_by(MealPlan.date)).all()
    return {"plans": plans}

@app.delete("/api/meal-plans/{plan_id}")
async def delete_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Delete meal plan entry"""
    plan = session.get(MealPlan, plan_id)
    if not plan or plan.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Plano não encontrado")
    
    session.delete(plan)
    session.commit()
    return {"message": "Plano removido"}


# =======================
# LISTA DE COMPRAS
# =======================

class ShoppingItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    name: str
    quantity: Optional[str] = None
    recipe_id: Optional[str] = None
    checked: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

@app.post("/api/shopping-list")
async def add_shopping_item(
    item: dict,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Add item to shopping list"""
    shopping_item = ShoppingItem(
        user_id=current_user.id,
        name=item.get("name"),
        quantity=item.get("quantity"),
        recipe_id=item.get("recipe_id")
    )
    session.add(shopping_item)
    session.commit()
    session.refresh(shopping_item)
    return shopping_item

@app.get("/api/shopping-list")
async def get_shopping_list(
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Get user's shopping list"""
    items = session.exec(
        select(ShoppingItem)
        .where(ShoppingItem.user_id == current_user.id)
        .order_by(ShoppingItem.created_at.desc())
    ).all()
    return {"items": items}

@app.patch("/api/shopping-list/{item_id}")
async def toggle_shopping_item(
    item_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Toggle item checked status"""
    item = session.get(ShoppingItem, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    
    item.checked = not item.checked
    session.add(item)
    session.commit()
    return item

@app.delete("/api/shopping-list/{item_id}")
async def delete_shopping_item(
    item_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Delete shopping list item"""
    item = session.get(ShoppingItem, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    
    session.delete(item)
    session.commit()
    return {"message": "Item removido"}


# Se rodar diretamente como script
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

