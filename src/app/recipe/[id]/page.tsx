import Link from "next/link";
import prisma from "@/lib/prisma"; // Changed import
import { notFound } from "next/navigation";
import CommentsSection from "@/components/recipes/CommentsSection";
import RecipeDetailsClient from "@/components/recipes/RecipeDetailsClient";
import BackButton from "@/components/ui/BackButton";
import RecipeHeroImage from "@/components/ui/RecipeHeroImage";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: PageProps) {
    const { id } = await params;

    // Fetch from Database
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: {
            author: { select: { name: true, image: true, username: true } }, // Get author info
            // reactions: true, // TODO: Implement reactions relation
        }
    });

    if (!recipe) {
        notFound();
    }

    // Default values for missing fields (backward compatibility)
    const reactions = { love: 0, like: 0, dislike: 0 }; // Placeholder until Real Reactions implemented


    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Header */}
            <div className="relative h-96 w-full">
                <RecipeHeroImage src={recipe.image} alt={recipe.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

                <BackButton />

                <div className="absolute bottom-0 left-0 p-8 text-white w-full z-20 pt-32">
                    <div className="flex gap-2 mb-3">
                        <span className="bg-[var(--color-primary)] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg">
                            {recipe.difficulty}
                        </span>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-white/10">
                            ⏱️ {recipe.time}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2 drop-shadow-lg">{recipe.title}</h1>
                    <p className="text-white/80 text-sm md:text-base line-clamp-2 max-w-lg mb-4">{recipe.description}</p>
                </div>
            </div>

            {/* Interactive Content */}
            <RecipeDetailsClient recipe={recipe} initialReactions={reactions} />

            {/* Comments Section (Kept server-side wrapper or passed down, but we kept it separate in page.tsx) */}
            <div className="max-w-md mx-auto px-6 mb-24">
                <CommentsSection recipeId={recipe.id} />
            </div>

            {/* Floating Kitchen Mode Button */}
            <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50">
                <Link
                    href={`/kitchen-mode/${recipe.id}`}
                    className="block w-full bg-[var(--color-primary)] text-white font-bold text-center py-4 rounded-2xl shadow-xl shadow-orange-900/40 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                    <span>👨‍🍳</span> Iniciar Modo Cozinha
                </Link>
            </div>
        </div>
    );
}
