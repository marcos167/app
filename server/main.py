from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.db import create_db_and_tables
from server.api.endpoints import auth, recipes, payment, debug

app = FastAPI(title="Gastrofy API")

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
    try:
        create_db_and_tables()
        print("Startup: DB Tables created/verified.")
    except Exception as e:
        print(f"Startup Error (DB): {e}")
        # We generally don't want to kill the app here, purely so /debug can still work.
        pass

@app.get("/")
def read_root():
    return {"message": "Gastrofy API rodando! 🚀"}

# Routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
# Recipes router usually has its own prefix in the file, or we add one here if needed.
# Checking recipes.py, it usually has @router.get("/api/recipes").
# To be safe and consistent with previous "clean" delete, we should standardise.
# But for now, let's just register them safely.
app.include_router(recipes.router, prefix="/api", tags=["recipes"])
app.include_router(payment.router, prefix="/api", tags=["payment"])
app.include_router(debug.router, prefix="/api", tags=["debug"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
