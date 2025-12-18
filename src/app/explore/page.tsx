'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { Hash, TrendingUp, Crown, Star, Users, ChefHat, ArrowRight, Search } from 'lucide-react';
import { recipes } from '@/lib/data';

// Mock trending hashtags
const TRENDING_HASHTAGS = [
    { tag: 'ReceitaDaVovó', count: 245, trend: '+12%' },
    { tag: 'DocesCaseiros', count: 189, trend: '+8%' },
    { tag: 'Tradicional', count: 156, trend: '+5%' },
    { tag: 'Salgados', count: 134, trend: '+3%' },
    { tag: 'FestJunina', count: 98, trend: 'Novo' },
    { tag: 'SemGlúten', count: 87, trend: '+2%' },
    { tag: 'Vegano', count: 76, trend: '+4%' },
    { tag: 'Rápido', count: 234, trend: '+15%' },
];

// Mock featured creators
const FEATURED_CREATORS = [
    {
        id: '1',
        name: 'Maria Cozinha',
        username: '@mariacozinha',
        avatar: 'https://i.pravatar.cc/150?img=1',
        specialty: 'Doces Brasileiros',
        followers: 12500,
        recipes: 45,
        verified: true,
    },
    {
        id: '2',
        name: 'Chef João',
        username: '@chefjpro',
        avatar: 'https://i.pravatar.cc/150?img=3',
        specialty: 'Culinária Nordestina',
        followers: 8700,
        recipes: 32,
        verified: true,
    },
    {
        id: '3',
        name: 'Ana Paula',
        username: '@anapaulafood',
        avatar: 'https://i.pravatar.cc/150?img=5',
        specialty: 'Confeitaria',
        followers: 6200,
        recipes: 28,
        verified: false,
    },
];

// Mock editorial curations
const CURATIONS = [
    {
        id: '1',
        title: 'Receitas da Vovó',
        subtitle: 'Tradição que atravessa gerações',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
        recipeCount: 15,
        color: 'from-amber-600 to-orange-500',
    },
    {
        id: '2',
        title: 'Festa Junina',
        subtitle: 'Arraial na cozinha',
        image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800',
        recipeCount: 8,
        color: 'from-pink-600 to-rose-500',
    },
    {
        id: '3',
        title: 'Sopas & Caldos',
        subtitle: 'Conforto em uma tigela',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
        recipeCount: 12,
        color: 'from-green-600 to-emerald-500',
    },
];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // Get recipes by hashtag
    const getRecipesByTag = (tag: string) => {
        return recipes.filter(r =>
            r.tags.some(t => t.toLowerCase().replace(/\s+/g, '') === tag.toLowerCase())
        );
    };

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-[#0E0F10] font-sans pb-24">
            <Navbar />

            <main className="max-w-md mx-auto px-4 pt-4 space-y-8">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar receitas, criadores, hashtags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-stone-900 shadow-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                </div>

                {/* Trending Hashtags */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-stone-800 dark:text-white flex items-center gap-2">
                            <Hash className="text-[var(--color-primary)]" size={24} />
                            Hashtags em Alta
                        </h2>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {TRENDING_HASHTAGS.map((item) => (
                            <Link
                                key={item.tag}
                                href={`/explore?tag=${item.tag}`}
                                className="px-4 py-2 bg-white dark:bg-stone-900 rounded-full shadow-sm flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <span className="text-[var(--color-primary)] font-bold">#{item.tag}</span>
                                <span className="text-xs text-stone-400">{item.count}</span>
                                <span className={`text-xs font-bold ${item.trend.includes('+') ? 'text-green-500' : 'text-purple-500'}`}>
                                    {item.trend}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Creators */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-stone-800 dark:text-white flex items-center gap-2">
                            <Crown className="text-amber-500" size={24} />
                            Criadores em Destaque
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {FEATURED_CREATORS.map((creator, index) => (
                            <div
                                key={creator.id}
                                className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm flex items-center gap-4"
                            >
                                <div className="relative">
                                    <img
                                        src={creator.avatar}
                                        alt={creator.name}
                                        className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--color-primary)]/20"
                                    />
                                    {index === 0 && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                            <Crown size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-stone-800 dark:text-white">{creator.name}</h3>
                                        {creator.verified && (
                                            <Star size={14} className="text-[var(--color-primary)] fill-current" />
                                        )}
                                    </div>
                                    <p className="text-sm text-stone-500">{creator.username}</p>
                                    <p className="text-xs text-[var(--color-primary)] font-medium mt-1">
                                        {creator.specialty}
                                    </p>
                                </div>
                                <div className="text-right text-sm">
                                    <div className="flex items-center gap-1 text-stone-500">
                                        <Users size={14} />
                                        {(creator.followers / 1000).toFixed(1)}k
                                    </div>
                                    <div className="flex items-center gap-1 text-stone-400 mt-1">
                                        <ChefHat size={14} />
                                        {creator.recipes}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Editorial Curations */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-stone-800 dark:text-white flex items-center gap-2">
                            <ChefHat className="text-[var(--color-primary)]" size={24} />
                            Curadoria Editorial
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {CURATIONS.map((curation) => (
                            <Link
                                key={curation.id}
                                href={`/explore?curation=${curation.id}`}
                                className="block relative h-40 rounded-2xl overflow-hidden group"
                            >
                                <img
                                    src={curation.image}
                                    alt={curation.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${curation.color} opacity-80`}></div>
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    <h3 className="text-2xl font-black">{curation.title}</h3>
                                    <p className="text-white/80 text-sm">{curation.subtitle}</p>
                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                        <span className="px-2 py-1 bg-white/20 rounded-full">{curation.recipeCount} receitas</span>
                                        <ArrowRight size={16} className="ml-auto group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recipe Suggestions Based on Tags */}
                <section>
                    <h2 className="text-xl font-black text-stone-800 dark:text-white mb-4">
                        Receitas Populares
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                        {recipes.slice(0, 6).map((recipe) => (
                            <Link
                                key={recipe.id}
                                href={`/recipes/${recipe.id}`}
                                className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-24 object-cover"
                                />
                                <div className="p-3">
                                    <h3 className="font-bold text-sm text-stone-800 dark:text-white truncate">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                                        <Star size={12} className="text-amber-500 fill-current" />
                                        {recipe.rating}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <BottomNavigation />
        </div>
    );
}
