import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/ratelimit';
import { verifyJWT, COOKIE_NAME } from '@/lib/security';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        const user = token ? await verifyJWT(token) : null;

        if (!user) {
            return NextResponse.json({ error: 'Você precisa estar logado para curtir.' }, { status: 401 });
        }

        const { recipeId } = await req.json();

        if (!recipeId) {
            return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
        }

        // Rate Limit: 10 reactions per minute per user
        // Protects against "click spamming" on a single recipe
        const rateLimitKey = `reaction:${user.userId}:${recipeId}`;
        const limitResult = await checkRateLimit(rateLimitKey, 10, 60);

        if (!limitResult.success) {
            return NextResponse.json(
                { error: 'Muitas reações. Acalme-se!' },
                {
                    status: 429,
                    headers: { 'Retry-After': limitResult.reset.toString() }
                }
            );
        }

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_recipeId: {
                    userId: user.userId as string,
                    recipeId: recipeId
                }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId: user.userId as string,
                    recipeId: recipeId
                }
            });
            return NextResponse.json({ liked: true });
        }

    } catch (error) {
        console.error('Like error', error);
        return NextResponse.json({ error: 'Falha ao processar reação' }, { status: 500 });
    }
}
