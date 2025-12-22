"""
Script para fazer upload de assets locais para Supabase Storage
"""
import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente do .env.local
load_dotenv('.env.local')

# Configuração Supabase
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
BUCKET_NAME = "chefex-assets"

# Validar variáveis
if not SUPABASE_URL:
    print("❌ ERRO: NEXT_PUBLIC_SUPABASE_URL não encontrado no .env.local")
    print("Por favor, adicione:")
    print("NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co")
    exit(1)

if not SUPABASE_KEY:
    print("❌ ERRO: SUPABASE_SERVICE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrado no .env.local")
    print("Por favor, adicione:")
    print("SUPABASE_SERVICE_KEY=eyJ...")
    exit(1)

print(f"✅ Supabase URL: {SUPABASE_URL}")
print(f"✅ Using key: {SUPABASE_KEY[:20]}...")

# Inicializar cliente
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Arquivos para upload
FILES_TO_UPLOAD = [
    # Brand assets
    ("public/brand/logo-icon-final.png", "brand/logo-icon-final.png"),
    ("public/brand/logo-text-final.png", "brand/logo-text-final.png"),
    ("public/brand/logo-full.png", "brand/logo-full.png"),
    ("public/brand/axis-logo.png", "brand/axis-logo.png"),
    
    # Outros
    ("public/admin-avatar.jpg", "avatars/admin-avatar.jpg"),
    ("public/logo-chefex.png", "misc/logo-chefex.png"),
]

def upload_file(local_path: str, remote_path: str):
    """Upload de um arquivo para Supabase Storage"""
    try:
        # Ler arquivo
        with open(local_path, 'rb') as f:
            file_data = f.read()
        
        # Determinar content type
        ext = Path(local_path).suffix.lower()
        content_type = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
        }.get(ext, 'application/octet-stream')
        
        # Upload
        response = supabase.storage.from_(BUCKET_NAME).upload(
            remote_path,
            file_data,
            {
                'content-type': content_type,
                'upsert': 'true'
            }
        )
        
        print(f"✅ Uploaded: {remote_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error uploading {local_path}: {str(e)}")
        return False

def main():
    """Upload de todos os arquivos"""
    print("🚀 Iniciando upload para Supabase Storage...")
    print(f"📦 Bucket: {BUCKET_NAME}")
    print(f"🌐 URL: {SUPABASE_URL}")
    print()
    
    success_count = 0
    fail_count = 0
    
    for local_path, remote_path in FILES_TO_UPLOAD:
        if os.path.exists(local_path):
            if upload_file(local_path, remote_path):
                success_count += 1
            else:
                fail_count += 1
        else:
            print(f"⚠️  File not found: {local_path}")
            fail_count += 1
    
    print()
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed: {fail_count}")
    print()
    print("🎉 Upload concluído!")

if __name__ == "__main__":
    main()
