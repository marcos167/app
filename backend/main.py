import os
import time
from typing import Optional
from datetime import datetime, timedelta
from enum import Enum

from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests

# =======================
# CONFIGURAÇÃO
# =======================

# Em produção, use variáveis de ambiente!
SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_secreta_super_segura")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
# Client ID fornecido pelo usuário
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "1019372792734-k6s58dq78pov4ktnhoiv9ddf3mkbjrf3.apps.googleusercontent.com")

# Banco de Dados (SQLite)
# Ajustado para navegar um nível acima (raiz do projeto)
sqlite_file_name = "database.db"
base_dir = os.path.dirname(os.path.abspath(__file__)) # c:/.../app
root_dir = os.path.dirname(base_dir) # c:/.../
sqlite_url = f"sqlite:///{os.path.join(root_dir, sqlite_file_name)}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

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
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    id_token: str


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


# =======================
# APLICAÇÃO
# =======================

app = FastAPI(title="Google OAuth API")

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
async def google_login(request: GoogleAuthRequest, session: Session = Depends(get_session)):
    """
    Recebe um ID Token do frontend, valida no Google e gera um JWT da aplicação.
    Cria o usuário se ele não existir.
    """
    
    # 1. Validar token com o Google
    google_user_data = await verify_google_token(request.id_token)
    
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
            role=Role.USER, # Padrão
            hashed_password=None # Sem senha para login social
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
    else:
        # USUÁRIO JÁ EXISTE
        
        # Se usuário existe mas foi criado via senha (LOCAL) e não tem google_id vinculado
        if user.provider == Provider.LOCAL and not user.google_id:
            # OPÇÃO A: Vincular automaticamente (Se confirmar email)
            # OPÇÃO B: Rejeitar e pedir para o usuário fazer login com senha e vincular nas configurações
            
            # Aqui vamos assumir VINCULAÇÃO AUTOMÁTICA por conveniência, 
            # já que o email foi validado pelo Google.
            print(f"Vinculando conta Local existente ao Google: {email}")
            user.google_id = google_id
            user.provider = Provider.GOOGLE # Opcional: Tornar Google o principal, ou manter híbrido
            if not user.avatar_url:
                user.avatar_url = picture
            session.add(user)
            session.commit()
            
        # Se usuário foi banido
        if user.disabled:
             raise HTTPException(status_code=403, detail="Conta desativada")

    # 4. Gerar Access Token da Aplicação
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


# --- ROTA PARA DADOS DO PERFIL (PROTEGIDA) ---
@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


# Se rodar diretamente como script
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
