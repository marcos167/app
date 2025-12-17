from enum import Enum
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from pydantic import BaseModel

# 1. Enum de Roles
class Role(str, Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    USER = "user"

# Mock de User do Banco de Dados/Token
class User(BaseModel):
    username: str
    role: Role

# Mock de função para pegar usuário atual (substitua pela sua lógica de JWT real)
def get_current_user(token: str = "seu_token_jwt"):
    # Simulação: Em produção, decodifique o JWT aqui
    return User(username="usuario_exemplo", role=Role.EDITOR)

# 2. Dependency para verificar permissões
class RoleChecker:
    def __init__(self, allowed_roles: List[Role]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            # Regra: Admin sempre tem acesso (opcional, mas comum)
            if user.role == Role.ADMIN:
                return user
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operação não permitida. Requer papéis: {[r.value for r in self.allowed_roles]}"
            )
        return user

app = FastAPI()

# 3. Exemplos de Rotas Protegidas

# Rota Pública
@app.get("/public")
def public_route():
    return {"message": "Acesso liberado"}

# Rota Admin: Tudo
@app.get("/admin", dependencies=[Depends(RoleChecker([Role.ADMIN]))])
def admin_route():
    return {"message": "Bem-vindo, Admin!"}

# Rota Editor: Criar/Editar
@app.post("/recipes", dependencies=[Depends(RoleChecker([Role.ADMIN, Role.EDITOR]))])
def create_recipe():
    return {"message": "Receita criada com sucesso"}

@app.put("/recipes/{id}", dependencies=[Depends(RoleChecker([Role.ADMIN, Role.EDITOR]))])
def edit_recipe(id: int):
    return {"message": f"Receita {id} editada"}

# Rota User: Consumir
@app.get("/recipes", dependencies=[Depends(RoleChecker([Role.ADMIN, Role.EDITOR, Role.USER]))])
def list_recipes():
    return {"message": "Listando receitas..."}

# Decorator Style (Alternativa mais limpa se preferir criar um wrapper)
# Mas o Depends na rota é o padrão "FastAPI Way".
