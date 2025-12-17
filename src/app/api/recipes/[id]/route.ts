import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logAdminAction } from '@/lib/logger';
import { verifyJWT, COOKIE_NAME } from '@/lib/security';
import { cookies } from 'next/headers';

async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token) return null;
    return await verifyJWT(token.value);
}

// Next.js 15+ needs params to be awaited
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: { name: true, image: true, username: true }
                }
            }
        });

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        return NextResponse.json(recipe);
    } catch (error) {
        return NextResponse.json(
            { message: 'Error fetching recipe' },
            { status: 500 }
        );
    }
}

// Next.js 15+ needs params to be awaited
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const id = params.id;
        const { title, description, category, time, difficulty, ingredients, steps, image, status } = await request.json();

        // Optional: Check ownership or Admin role here if not done elsewhere
        // For now, allow and log.

        const updatedRecipe = await prisma.recipe.update({
            where: { id: id },
            data: {
                title,
                description,
                category,
                time,
                difficulty,
                ingredients,
                steps,
                image,
                status
            },
        });

        // Log
        await logAdminAction(user.sub as string, 'UPDATE_RECIPE', {
            recipeId: id,
            title: updatedRecipe.title,
            changes: ['updated'] // Simplified log
        });

        return NextResponse.json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error); // Critical for debugging
        return NextResponse.json(
            { message: 'Error updating recipe' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const id = params.id;
        const { searchParams } = new URL(request.url);
        const isHardDelete = searchParams.get('hard') === 'true';

        // Fetch title for log
        const recipe = await prisma.recipe.findUnique({
            where: { id },
            select: { title: true }
        });

        if (isHardDelete) {
            await prisma.recipe.delete({
                where: { id: id },
            });
            await logAdminAction(user.sub as string, 'DELETE_RECIPE', {
                recipeId: id,
                title: recipe?.title,
                type: 'HARD_DELETE'
            });
        } else {
            await prisma.recipe.update({
                where: { id: id },
                data: { deletedAt: new Date() }
            });
            await logAdminAction(user.sub as string, 'SOFT_DELETE_RECIPE', {
                recipeId: id,
                title: recipe?.title
            });
        }

        return NextResponse.json({ message: isHardDelete ? 'Recipe permanently deleted' : 'Recipe moved to trash' });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error deleting recipe' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const id = params.id;
        const body = await request.json();

        // Check if this is a restore action
        if (body.restore) {
            const recipe = await prisma.recipe.update({
                where: { id },
                data: { deletedAt: null }
            });

            await logAdminAction(user.sub as string, 'RESTORE_RECIPE', {
                recipeId: id,
                title: recipe.title
            });
            return NextResponse.json(recipe);
        }

        // Generic fallback for other PATCH ops
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });

    } catch (error) {
        return NextResponse.json(
            { message: 'Error updating recipe' },
            { status: 500 }
        );
    }
}
