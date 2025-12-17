import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        // 1. Validate Size
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB.' }, { status: 400 });
        }

        // 2. Validate Type (Basic MIME)
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Formato inválido. Apenas JPG, PNG e WEBP.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3. Security & Optimization (Sharp)
        // Attempt to parse metadata to verify it's a real image
        try {
            const metadata = await sharp(buffer).metadata();
            if (!metadata) throw new Error('Imagem inválida');
        } catch (e) {
            return NextResponse.json({ error: 'Arquivo corrompido ou inválido.' }, { status: 400 });
        }

        // 4. Secure Filename (UUID)
        const filename = `${crypto.randomUUID()}.webp`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Check if it exists
        }

        const filepath = path.join(uploadDir, filename);

        // 5. Process & Sanitize (Convert to WebP, Strip Metadata, Resize if huge)
        await sharp(buffer)
            .resize(1200, 1200, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(filepath);

        // Return the public URL
        const imageUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: imageUrl });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
    }
}
