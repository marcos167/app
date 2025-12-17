'use client';

import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpRight, Heart, Crown } from 'lucide-react';
import { api } from "@/lib/api";

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // Fetch from real API using dynamic base URL
                const data = await api.get<any[]>('/api/recipes?status=published');
                if (data) {
                    setRecipes(data);
                }
            } catch (error) {
                console.error("Failed to fetch recipes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-stone-950 pb-24 font-sans transition-colors duration-300">
            {/* Ambient Background Noise & Gradients */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="fixed top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[var(--color-primary)]/5 via-transparent to-transparent pointer-events-none z-0"></div>

            <Navbar />

            <main className="max-w-md mx-auto px-5 pt-6 relative z-10">
                {/* Header */}
                <header className="mb-8 animate-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-black text-stone-800 dark:text-white mb-2 tracking-tight">
                        Explorar
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
                        O que vamos <span className="text-[var(--color-secondary)] font-bold">cozinhar</span> hoje?
                    </p>
                </header>

                {/* Glass Search Bar */}
                <div className={`
                    relative mb-8 group transition-all duration-300 
                    ${isSearchFocused ? 'scale-105' : 'scale-100'}
                `}>
                    <div className="absolute inset-0 bg-[var(--color-primary)]/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className={`
                        relative flex items-center bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border rounded-2xl shadow-lg transition-all duration-300
                        ${isSearchFocused
                            ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10 shadow-purple-500/20'
                            : 'border-white/50 dark:border-stone-800 shadow-stone-200/50 dark:shadow-none'}
                    `}>
                        <Search className={`ml-4 w-5 h-5 transition-colors ${isSearchFocused ? 'text-[var(--color-primary)]' : 'text-stone-400'}`} />
                        <input
                            type="text"
                            placeholder="Buscar receitas, chefs ou ingredientes..."
                            className="w-full bg-transparent border-none py-4 px-3 text-stone-800 dark:text-white placeholder:text-stone-400 focus:ring-0 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <button className="mr-2 p-2 rounded-xl text-stone-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors">
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {loading ? (
                        // Premium Skeletons
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-white dark:bg-stone-900 rounded-[2rem] p-3 border border-stone-100 dark:border-stone-800 shadow-sm animate-pulse">
                                <div className="w-full h-2/3 bg-stone-200 dark:bg-stone-800 rounded-2xl mb-3"></div>
                                <div className="w-3/4 h-4 bg-stone-200 dark:bg-stone-800 rounded-md mb-2"></div>
                                <div className="w-1/2 h-3 bg-stone-200 dark:bg-stone-800 rounded-md"></div>
                            </div>
                        ))
                    ) : (
                        // Recipe Cards
                        filteredRecipes.map((recipe, index) => (
                            <Link
                                href={`/recipes/${recipe.id}`}
                                key={recipe.id}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className="group relative bg-white dark:bg-stone-900 rounded-[2rem] p-3 shadow-lg shadow-stone-200/50 dark:shadow-none border border-white/50 dark:border-stone-800 hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                            >
                                {/* Image Container */}
                                <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-3 relative">
                                    <img
                                        src={recipe.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                        alt={recipe.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                    {/* Floating Action Button */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); /* Like logic */ }}
                                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-[var(--color-primary)] transition-all active:scale-90"
                                    >
                                        <Heart size={14} />
                                    </button>

                                    {/* Premium Badge */}
                                    {recipe.is_premium && (
                                        <div className="absolute top-2 left-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                            <Crown size={10} fill="currentColor" />
                                            <span>Premium</span>
                                        </div>
                                    )}

                                    {/* Time Badge */}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-[10px] font-bold bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                                        <span>⏱️</span>
                                        {recipe.time}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-1">
                                    <h3 className="font-bold text-stone-800 dark:text-white text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5em] group-hover:text-[var(--color-primary)] transition-colors">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                                {recipe.category || 'Geral'}
                                            </span>
                                        </div>
                                        <ArrowUpRight size={16} className="text-stone-300 group-hover:text-[var(--color-primary)] transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Empty State */}
                {!loading && filteredRecipes.length === 0 && (
                    <div className="mt-20 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                            🤔
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-2">Nada encontrado</h3>
                        <p className="text-stone-400 max-w-[200px] mx-auto text-sm">
                            Tente buscar por "Frango", "Massas" ou "Sobremesas".
                        </p>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
