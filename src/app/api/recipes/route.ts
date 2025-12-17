import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/ratelimit';
import { logAdminAction } from '@/lib/logger';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get('includeDeleted') === 'true';
        const status = searchParams.get('status');

        const whereClause: any = {
            deletedAt: includeDeleted ? undefined : null,
        };

        if (status) {
            whereClause.status = status;
        }

        const recipes = await prisma.recipe.findMany({
            where: whereClause,
            include: {
                author: {
                    select: { name: true, image: true, username: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json(
            { message: 'Erro ao buscar receitas' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, category, time, difficulty, ingredients, image, steps } = body;

        // In a real app, we get the user from the session.
        // For now, we'll find the admin user we created or fallback to the first user.
        const author = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        }) || await prisma.user.findFirst();

        if (!author) {
            return NextResponse.json({ error: 'Nenhum autor encontrado' }, { status: 400 });
        }

        const recipe = await prisma.recipe.create({
            data: {
                title,
                description,
                image: image || "",
                time,
                difficulty,
                category,
                ingredients: ingredients || [],
                steps: steps || [],
                authorId: author.id
            }
        });

        // Admin Log
        await logAdminAction(author.id, 'CREATE_RECIPE', {
            recipeId: recipe.id,
            title: recipe.title
        });

        return NextResponse.json(recipe);

    } catch (error) {
        console.error('Error creating recipe:', error);
        return NextResponse.json(
            { message: 'Erro ao criar receita' },
            { status: 500 }
        );
    }
}
