import { NextResponse } from 'next/server';
import { recipes } from '@/lib/data';

// GET /api/recipes - List all recipes with pagination
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredRecipes = [...recipes];

    // Filter by category/tag
    if (category) {
        filteredRecipes = filteredRecipes.filter(r =>
            r.tags.some(t => t.toLowerCase() === category.toLowerCase())
        );
    }

    // Filter by search query
    if (search) {
        const lowerSearch = search.toLowerCase();
        filteredRecipes = filteredRecipes.filter(r =>
            r.title.toLowerCase().includes(lowerSearch) ||
            r.description.toLowerCase().includes(lowerSearch) ||
            r.tags.some(t => t.toLowerCase().includes(lowerSearch))
        );
    }

    // Apply pagination
    const total = filteredRecipes.length;
    const paginatedRecipes = filteredRecipes.slice(offset, offset + limit);

    return NextResponse.json({
        recipes: paginatedRecipes,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
    });
}
