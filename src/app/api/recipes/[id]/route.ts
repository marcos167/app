import { NextResponse } from 'next/server';
import { recipes, getRecipeById } from '@/lib/data';

// GET /api/recipes/[id] - Get single recipe by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Debug: log what we're looking for
    console.log(`[API] Looking for recipe with id: "${id}"`);
    console.log(`[API] Total recipes available: ${recipes.length}`);
    console.log(`[API] Recipe IDs: ${recipes.slice(0, 5).map(r => r.id).join(', ')}...`);

    // Try both methods to find the recipe
    let recipe = getRecipeById(id);

    // Fallback: try finding directly
    if (!recipe) {
        recipe = recipes.find(r => r.id === id);
    }

    if (!recipe) {
        console.log(`[API] Recipe not found for id: "${id}"`);
        return NextResponse.json(
            { detail: 'Receita não encontrada' },
            { status: 404 }
        );
    }

    console.log(`[API] Found recipe: "${recipe.title}"`);
    return NextResponse.json(recipe);
}

