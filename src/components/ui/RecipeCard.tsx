import Link from 'next/link';
import { Recipe } from '@/lib/data';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <Link
            href={`/recipe/${recipe.id}`}
            className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-stone-100"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-stone-600 shadow-sm">
                    {recipe.time}
                </div>
            </div>

            <div className="p-4">
                <div className="flex gap-2 mb-2">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold 
            ${recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                            recipe.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'}`}>
                        {recipe.difficulty}
                    </span>
                </div>

                <h3 className="font-bold text-lg text-[var(--color-primary)] leading-tight mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                    {recipe.title}
                </h3>

                <p className="text-stone-500 text-sm line-clamp-2 mb-3">
                    {recipe.description}
                </p>

                <div className="flex items-center justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-1">
                        <span>❤️ {recipe.reactions?.love || 0}</span>
                    </div>
                    <span>{recipe.servings}</span>
                </div>
            </div>
        </Link>
    );
}
