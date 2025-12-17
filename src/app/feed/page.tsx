'use client';

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import RecipeCard from "@/components/ui/RecipeCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import BottomNav from "@/components/layout/BottomNav";

export default function Home() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Populares');

  useEffect(() => {
    // Authenticated check check removed to allow Guest Mode
    // if (!auth.isAuthenticated()) {
    //   router.push("/login");
    //   return;
    // }

    const fetchRecipes = async () => {
      try {
        const data = await api.get<any[]>('/api/recipes?status=published');
        // Filter out seed logic or malformed data if needed
        if (Array.isArray(data)) {
          setRecipes(data);
        }
      } catch (error) {
        console.error("Failed to fetch recipes", error);
        // Fallback or Toast here
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [router]);

  // Mock Text-to-Speech
  const handleTTS = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert("Iniciando leitura da receita por voz...");
  };

  // Determine Featured Recipe (Use first one or fallback)
  const featuredRecipe = recipes.length > 0 ? recipes[0] : null;

  // Filter Logic
  const filteredRecipes = activeCategory === 'Populares'
    ? recipes
    : recipes.filter(r => r.category === activeCategory);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--color-primary)]">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF5] dark:bg-stone-950 font-sans pb-24 transition-colors duration-300">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      {/* Immersive Background */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-[var(--color-primary)]/10 via-transparent to-transparent pointer-events-none z-0"></div>

      <Navbar />

      <main className="max-w-md mx-auto px-5 pt-6 pb-8 relative z-10">

        {/* Welcome Header */}
        <header className="mb-8 relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-secondary)]/20 rounded-full blur-3xl animate-pulse"></div>

          <p className="text-stone-500 dark:text-stone-400 font-bold text-xs mb-2 tracking-widest uppercase ml-1">Bom dia, Chef</p>
          <h1 className="text-4xl font-black text-stone-800 dark:text-white leading-[1.1] tracking-tight">
            Descubra novos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">sabores únicos.</span>
          </h1>
        </header>

        {/* Featured Section (Glassmorphism) */}
        {featuredRecipe && (
          <section className="mb-10 group relative">
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-2xl rounded-[3rem] transform scale-90 group-hover:scale-100 transition-transform duration-700"></div>

            <Link href={`/recipes/${featuredRecipe.id}`} className="block relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-900/20">
              <img
                src={featuredRecipe.image}
                alt={featuredRecipe.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Destaque do Dia
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h2 className="text-3xl font-black text-white leading-none mb-3 drop-shadow-lg">{featuredRecipe.title}</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/90 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <span>⏱️</span> {featuredRecipe.time}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Categories (Pills) */}
        <section className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar snap-x">
            {['Populares', 'Pratos Brasileiros', 'Sobremesas', 'Saudáveis', 'Rápidas'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 border ${activeCategory === category
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-purple-500/25 scale-105'
                  : 'bg-white/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 text-stone-500 backdrop-blur-sm hover:bg-white'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Recipe Grid (Premium Glass Cards) */}
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="font-bold text-xl text-stone-800 dark:text-white tracking-tight">Receitas Select</h2>
            <span className="text-xs font-bold text-[var(--color-primary)]">Ver todas</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredRecipes.map((recipe, i) => (
              <Link
                href={`/recipes/${recipe.id}`}
                key={recipe.id}
                className="group relative bg-white dark:bg-stone-900 rounded-[2rem] p-3 shadow-lg shadow-stone-200/50 dark:shadow-none border border-white/50 dark:border-stone-800 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-3 relative">
                  <img
                    src={recipe.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    alt={recipe.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <button className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-[var(--color-primary)] transition-colors">
                    ❤️
                  </button>
                  <div className="absolute bottom-3 left-3 text-white text-[10px] font-bold bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                    {recipe.time}
                  </div>
                </div>

                <h3 className="font-bold text-stone-800 dark:text-white text-sm leading-tight mb-1 line-clamp-2 px-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {recipe.title}
                </h3>
              </Link>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-4xl mb-4 opacity-50">🍳</div>
              <p className="text-stone-400 font-medium">Nenhuma receita encontrada.</p>
            </div>
          )}
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
