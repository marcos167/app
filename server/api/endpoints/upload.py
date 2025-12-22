import os
import uuid
import subprocess
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed file types
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}
ALLOWED_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS

# Size limits
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50MB
MAX_VIDEO_DURATION = 60  # 60 seconds


def get_video_duration(file_path: str) -> float:
    """
    Get video duration in seconds using ffprobe.
    Returns 0 if ffprobe is not available or fails.
    """
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                file_path
            ],
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0 and result.stdout.strip():
            return float(result.stdout.strip())
    except (subprocess.TimeoutExpired, FileNotFoundError, ValueError) as e:
        print(f"ffprobe error: {e}")
    return 0


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload images or videos.
    - Images: max 5MB
    - Videos: max 50MB, max 60 seconds duration
    """
    filename = file.filename.lower()
    ext = os.path.splitext(filename)[1]
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Extensão inválida. Permitido: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    content = await file.read()
    is_video = ext in VIDEO_EXTENSIONS
    
    # Size validation
    if is_video:
        if len(content) > MAX_VIDEO_SIZE:
            raise HTTPException(status_code=400, detail="Vídeo muito grande (máximo 50MB)")
    else:
        if len(content) > MAX_IMAGE_SIZE:
            raise HTTPException(status_code=400, detail="Imagem muito grande (máximo 5MB)")

    # Video duration validation
    if is_video:
        # Save to temp file for ffprobe analysis
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            duration = get_video_duration(tmp_path)
            if duration > MAX_VIDEO_DURATION:
                os.unlink(tmp_path)
                raise HTTPException(
                    status_code=400, 
                    detail=f"Vídeo muito longo ({duration:.1f}s). Máximo permitido: {MAX_VIDEO_DURATION} segundos."
                )
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    # Sanitize and save
    secure_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, secure_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
            
        return {
            "url": f"/uploads/{secure_filename}",
            "type": "video" if is_video else "image",
            "size": len(content)
        }
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Erro ao salvar arquivo")

