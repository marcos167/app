import os

class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_secreta_super_segura")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "1019372792734-k6s58dq78pov4ktnhoiv9ddf3mkbjrf3.apps.googleusercontent.com")

settings = Settings()
