from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.db import create_db_and_tables
from server.api.endpoints import auth, recipes

app = FastAPI(title="Receitas Premium API")

# Configuração de CORS
origins = ["*"]

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
    return {"message": "API Modularizada e Segura rodando! 🚀"}

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(recipes.router, tags=["recipes"])
app.include_router(payment.router, prefix="/api/payment", tags=["payment"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
