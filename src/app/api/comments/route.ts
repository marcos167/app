import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/ratelimit';

// GET: Fetch all comments (for Admin) or filtered by recipeId
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get('recipeId');

    try {
        const where = recipeId ? { recipeId } : {};

        const comments = await prisma.comment.findMany({
            where,
            include: {
                user: {
                    select: { name: true, image: true }
                },
                recipe: {
                    select: { title: true, image: true, id: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
    }
}

// POST: Create a new comment
export async function POST(req: Request) {
    try {
        const { recipeId, userId, content, rating, images } = await req.json();

        // Validate
        if (!content || !recipeId || !userId) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        // Rate Limit: 5 comments per minute per user
        const rateLimitKey = `comment:${userId}`;
        const limitResult = await checkRateLimit(rateLimitKey, 5, 60);

        if (!limitResult.success) {
            return NextResponse.json(
                { error: 'Você está comentando muito rápido. Aguarde um momento.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': limitResult.reset.toString(),
                        'X-RateLimit-Limit': limitResult.limit.toString(),
                        'X-RateLimit-Remaining': limitResult.remaining.toString(),
                        'X-RateLimit-Reset': limitResult.reset.toString()
                    }
                }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                rating: rating || 0,
                images: images || [], // Save images
                recipeId,
                userId,
                status: 'pending' // Default moderation status
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Comment Error:", error);
        return NextResponse.json({ error: 'Erro ao criar comentário' }, { status: 500 });
    }
}
