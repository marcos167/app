'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { EmptyState } from "@/components/ui";
import { Heart, MessageCircle, Bookmark, TrendingUp, Flame, Crown, Star, Trophy, Clock, Award, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { generateMockRankingData, getTopRecipes, getTrendingRecipes, RankingPeriod, RecipeRankingData } from "@/lib/ranking";

// Trend Indicator Component
function TrendIndicator({ trend, previousRank }: { trend?: RecipeRankingData['trend']; previousRank?: number }) {
    if (!trend || trend === 'new') {
        return <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-bold">NOVO</span>;
    }
    if (trend === 'up') {
        return (
            <span className="text-green-400 flex items-center text-xs font-bold">
                <ChevronUp size={14} />
                {previousRank && previousRank - (previousRank || 0)}
            </span>
        );
    }
    if (trend === 'down') {
        return (
            <span className="text-red-400 flex items-center text-xs">
                <ChevronDown size={14} />
            </span>
        );
    }
    return <Minus size={14} className="text-stone-500" />;
}

// Rank Badge Component
function RankBadge({ rank }: { rank: number }) {
    const styles = {
        1: 'from-yellow-400 to-amber-500 text-stone-900',
        2: 'from-stone-300 to-stone-400 text-stone-800',
        3: 'from-amber-600 to-orange-700 text-white',
    };
    const bgColor = styles[rank as keyof typeof styles] || 'from-stone-600 to-stone-700 text-white';

    return (
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${bgColor} flex items-center justify-center font-black text-sm shadow-lg`}>
            {rank}
        </div>
    );
}

// Star Rating Component
function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" fill="currentColor" />
            <span className="text-white font-bold text-xs">{rating.toFixed(1)}</span>
            <span className="text-stone-500 text-[10px]">({count})</span>
        </div>
    );
}

// Period Filter Pills
const PERIODS: { id: RankingPeriod; label: string; icon: any }[] = [
    { id: 'daily', label: 'Hoje', icon: Flame },
    { id: 'weekly', label: 'Semana', icon: TrendingUp },
    { id: 'monthly', label: 'Mês', icon: Award },
    { id: 'all_time', label: 'Geral', icon: Trophy },
];

export default function CommunityPage() {
    const [activePeriod, setActivePeriod] = useState<RankingPeriod>('weekly');
    const [likedRecipes, setLikedRecipes] = useState<Set<string>>(new Set());
    const [savedRecipes, setSavedRecipes] = useState<Set<string>>(new Set(['2']));

    // Generate ranked recipes
    const allRecipes = useMemo(() => generateMockRankingData(), []);
    const rankedRecipes = useMemo(() => getTopRecipes(allRecipes, 10, activePeriod), [allRecipes, activePeriod]);
    const trendingRecipes = useMemo(() => getTrendingRecipes(allRecipes, 3), [allRecipes]);

    const toggleLike = (id: string) => {
        setLikedRecipes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSave = (id: string) => {
        setSavedRecipes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-[#0E0F10] pb-24 font-sans">
            {/* Premium Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#1A1D20_0%,transparent_60%)] pointer-events-none z-0"></div>

            <Navbar />

            <main className="max-w-md mx-auto px-4 pt-6 relative z-10">

                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-3xl font-black text-white tracking-tight mb-1">
                        Comunidade
                    </h1>
                    <p className="text-stone-400 text-sm">
                        Ranking de receitas mais bem avaliadas
                    </p>
                </header>

                {/* 🔥 Trending Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Flame size={18} className="text-orange-400" />
                        <h2 className="text-lg font-bold text-white">Em Alta Agora</h2>
                    </div>

                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        {trendingRecipes.map((recipe) => (
                            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="flex-shrink-0 w-32">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                    {/* Fire badge */}
                                    <div className="absolute top-2 left-2 bg-orange-500/90 p-1.5 rounded-lg">
                                        <Flame size={12} className="text-white" />
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3">
                                        <StarRating rating={recipe.avgRating} count={recipe.ratingCount} />
                                        <p className="text-white font-bold text-xs mt-1 line-clamp-2">{recipe.title}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 🏆 Ranking Section */}
                <section className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-400" />
                            <h2 className="text-lg font-bold text-white">Ranking</h2>
                        </div>
                    </div>

                    {/* Period Pills */}
                    <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                        {PERIODS.map((period) => {
                            const Icon = period.icon;
                            const isActive = activePeriod === period.id;
                            return (
                                <button
                                    key={period.id}
                                    onClick={() => setActivePeriod(period.id)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${isActive
                                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-900 shadow-lg shadow-yellow-500/20'
                                            : 'bg-[#1B1E22] text-stone-400 border border-stone-800 hover:border-stone-700'
                                        }`}
                                >
                                    <Icon size={14} />
                                    {period.label}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Recipe List */}
                <div className="space-y-4">
                    {rankedRecipes.map((recipe) => {
                        const isLiked = likedRecipes.has(recipe.id);
                        const isSaved = savedRecipes.has(recipe.id);

                        return (
                            <div
                                key={recipe.id}
                                className="bg-[#1B1E22] rounded-2xl overflow-hidden border border-stone-800/50 hover:border-stone-700 transition-colors"
                            >
                                <div className="flex gap-4 p-4">
                                    {/* Rank & Image */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <RankBadge rank={recipe.rank || 0} />
                                            <TrendIndicator trend={recipe.trend} previousRank={recipe.previousRank} />
                                        </div>

                                        <Link href={`/recipes/${recipe.id}`}>
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={recipe.image}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Author */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <img
                                                src={recipe.author.avatar}
                                                alt={recipe.author.name}
                                                className="w-5 h-5 rounded-full"
                                            />
                                            <span className="text-stone-400 text-xs truncate">{recipe.author.name}</span>
                                            {recipe.author.isMasterChef && (
                                                <Crown size={10} className="text-yellow-400" />
                                            )}
                                        </div>

                                        {/* Title */}
                                        <Link href={`/recipes/${recipe.id}`}>
                                            <h3 className="font-bold text-white text-sm line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                                                {recipe.title}
                                            </h3>
                                        </Link>

                                        {/* Stats */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <StarRating rating={recipe.avgRating} count={recipe.ratingCount} />
                                            <span className="text-stone-500 text-[10px]">
                                                Score: {recipe.score?.toFixed(1)}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 mt-3">
                                            <button
                                                onClick={() => toggleLike(recipe.id)}
                                                className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-red-500' : 'text-stone-500 hover:text-red-500'
                                                    }`}
                                            >
                                                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                                                {recipe.likesCount + (isLiked ? 1 : 0)}
                                            </button>

                                            <span className="flex items-center gap-1 text-xs text-stone-500">
                                                <MessageCircle size={14} />
                                                {recipe.commentsCount}
                                            </span>

                                            <button
                                                onClick={() => toggleSave(recipe.id)}
                                                className={`flex items-center gap-1 text-xs transition-colors ${isSaved ? 'text-[var(--color-primary)]' : 'text-stone-500 hover:text-[var(--color-primary)]'
                                                    }`}
                                            >
                                                <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                                                {recipe.savesCount + (isSaved ? 1 : 0)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {rankedRecipes.length === 0 && (
                    <EmptyState
                        title="Nenhuma receita no ranking"
                        description="Publique receitas para aparecer aqui!"
                    />
                )}

            </main>

            <BottomNavigation />
        </div>
    );
}
