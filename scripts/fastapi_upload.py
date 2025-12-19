import os
import io
import uuid
import shutil
from typing import List
from enum import Enum

# Third-party imports (install via: pip install fastapi python-multipart Pillow uvicorn)
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError

app = FastAPI()

# Configurações
UPLOAD_DIR = "uploads"
THUMBNAIL_DIR = "uploads/thumbnails"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Criar diretórios se não existirem
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(THUMBNAIL_DIR, exist_ok=True)

# Montar diretório estático para servir imagens (opcional)
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

@app.post("/upload/image/")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload seguro de imagem:
    - Valida extensão e Content-Type
    - Valida Magic Bytes (via Pillow)
    - Limita tamanho (5MB)
    - Sanitiza nome (UUID)
    - Gera Thumbnail
    - Remove metadados (strip)
    """
    
    # 1. Validação Básica de Extensão e Content-Type
    filename = file.filename.lower()
    ext = os.path.splitext(filename)[1]
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Extensão de arquivo inválida. Permitido: jpg, png, webp")
    
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de arquivo inválido.")

    # 2. Ler arquivo e validar tamanho
    # Note: Para arquivos muito grandes, ler tudo em memória pode ser perigoso.
    # Mas como limitamos a 5MB, é aceitável ler em bytes.
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo muito grande. Máximo 5MB.")

    # 3. Validação Profunda e Segurança (Pillow)
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()  # Verifica se é uma imagem válida de fato (decodificação básica)
        
        # Reabrir para processamento (verify consome o objeto)
        image = Image.open(io.BytesIO(content))
    except (UnidentifiedImageError, IOError):
        raise HTTPException(status_code=400, detail="Arquivo de imagem corrompido ou inválido.")

    # 4. Gerar Nome Seguro (UUID)
    secure_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, secure_filename)
    thumb_path = os.path.join(THUMBNAIL_DIR, secure_filename)

    # 5. Salvar e Sanitizar (Recriar a imagem remove EXIF/Scripts injetados)
    try:
        # Converter para RGB se for RGBA e vamos salvar como JPEG (opcional)
        # Manter formato original para simplicidade ou converter tudo para WebP
        
        # Salvar Original (Sanitizado pelo Pillow ao salvar)
        image.save(file_path, format=image.format, optimize=True, quality=90)
        
        # 6. Gerar Thumbnail
        image.thumbnail((300, 300))  # Max 300x300 aspect ratio preserved
        image.save(thumb_path, format=image.format, optimize=True, quality=80)
        
    except Exception as e:
        print(f"Erro ao processar imagem: {e}")
        raise HTTPException(status_code=500, detail="Erro no processamento da imagem.")

    return {
        "filename": secure_filename,
        "url": f"/static/{secure_filename}",
        "thumbnail_url": f"/static/thumbnails/{secure_filename}",
        "size_bytes": len(content),
        "content_type": file.content_type
    }

if __name__ == "__main__":
    import uvicorn
    print(f"Servidor rodando em http://localhost:8000")
    print(f"Docs em http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
