import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io

router = APIRouter()

UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename.lower()
    ext = os.path.splitext(filename)[1]
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Extensão de arquivo inválida")
    
    content = await file.read()
    
    # 5MB limit
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Arquivo muito grande (máximo 5MB)")

    # Sanitize and save
    secure_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, secure_filename)
    
    try:
        # Save file to public/uploads
        with open(file_path, "wb") as buffer:
            buffer.write(content)
            
        # Return the public URL
        return {"url": f"/uploads/{secure_filename}"}
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Erro ao salvar arquivo")
