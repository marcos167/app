'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { EmptyState } from "@/components/ui";
import Link from 'next/link';
import { ArrowRight, Trash2 } from "lucide-react";
import { useState } from 'react';

export default function SavedPage() {
    // Mock Data for "Saved" - in a real app this would come from an API/Context
    const savedRecipes = [
        { id: 'cmj7asplt0006mbricq4jyqby', title: 'Bolo de Cenoura', time: '45 min', image: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?q=80&w=1000&auto=format&fit=crop', category: 'Sobremesas' },
        { id: '2', title: 'Risoto de Funghi', time: '30 min', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop', category: 'Jantar' },
        { id: '3', title: 'Smoothie Tropical', time: '10 min', image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=1000&auto=format&fit=crop', category: 'Bebidas' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-[#0E0F10] pb-24 font-sans selection:bg-[var(--color-primary)] selection:text-white">
            {/* Premium Noise Texture */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            {/* Premium Radial Gradient */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#1A1D20_0%,transparent_60%)] pointer-events-none z-0 dark:block hidden"></div>

            <Navbar />

            <main className="max-w-md mx-auto px-5 pt-6 relative z-10">

                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-stone-800 dark:text-white tracking-tight flex items-center gap-2">
                            Salvos <span className="text-red-500 animate-pulse">❤️</span>
                        </h1>
                        <p className="text-stone-500 text-sm dark:text-stone-400">Seus pratos favoritos, guardados com carinho.</p>
                    </div>
                    <span className="px-3 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-xs font-bold text-stone-500">
                        {savedRecipes.length} itens
                    </span>
                </header>

                {/* Saved Grid */}
                <div className="grid gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    {savedRecipes.map((recipe, index) => (
                        <Link
                            href={`/recipes/${recipe.id}`}
                            key={recipe.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="group relative bg-white dark:bg-stone-900 rounded-[2rem] p-3 shadow-lg shadow-stone-200/50 dark:shadow-none border border-white/50 dark:border-stone-800 hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 animate-in fade-in fill-mode-backwards"
                        >
                            {/* Image */}
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                                <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={recipe.title} />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider bg-[var(--color-primary)]/5 px-2 py-0.5 rounded-full mb-1 inline-block">
                                    {recipe.category}
                                </span>
                                <h3 className="font-bold text-lg text-stone-800 dark:text-white leading-tight mb-1 truncate pr-2">
                                    {recipe.title}
                                </h3>
                                <p className="text-xs text-stone-400 font-medium flex items-center gap-1">
                                    ⏱️ {recipe.time} • Salvo hoje
                                </p>
                            </div>

                            {/* Action Arrow */}
                            <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors mr-1">
                                <ArrowRight size={18} />
                            </div>
                        </Link>
                    ))}

                    {savedRecipes.length === 0 && (
                        <EmptyState
                            title="Nenhuma receita salva"
                            description="Você ainda não salvou nenhuma receita. Explore e salve suas favoritas!"
                            action={{
                                label: 'Explorar Receitas',
                                onClick: () => window.location.href = '/feed'
                            }}
                        />
                    )}
                </div>

                {/* Decorative Bottom */}
                <div className="mt-12 text-center opacity-30">
                    <p className="text-xs font-serif italic text-stone-500">"Cozinhar é uma forma de amar."</p>
                </div>

            </main>

            <BottomNavigation />
        </div>
    );
}
