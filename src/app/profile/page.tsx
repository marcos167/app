'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { recipes } from "@/lib/data";
import Link from 'next/link';
import { Edit3, Settings, Grid, Heart, Clock, Award, Crown, Sparkles, Lock, Users, Trophy, Medal, Play } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PlanStatusCard } from '@/components/subscription/PlanStatusCard';
import { LevelProgressCard, BadgesGrid, GamificationStats } from '@/components/gamification/GamificationComponents';

// Initial Mock Data
const INITIAL_PROFILE = {
    name: "Maria Silva",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    username: "@mariacozinha",
    level: "Chef Amador",
    bio: "Apaixonada por sabores e texturas. Transformando ingredientes simples em memórias inesquecíveis.",
    stats: {
        recipes: 12,
        saved: 45,
        following: 128
    }
};

// Componente Minhas Receitas com verificação de plano
function MyRecipesSection() {
    const { canCreate, planName } = useSubscription();

    // 🔒 Usuário sem Master Chef - mostrar bloqueio
    if (!canCreate) {
        return (
            <div className="bg-white/80 dark:bg-[#1B1E22] backdrop-blur-sm rounded-3xl border border-stone-100 dark:border-stone-800 shadow-lg p-8 text-center">
                {/* Lock Icon */}
                <div className="relative mx-auto w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl blur-lg opacity-40" />
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center">
                        <Lock size={32} className="text-stone-900" />
                    </div>
                </div>

                <h3 className="font-bold text-xl text-white mb-2">Recurso Master Chef</h3>
                <p className="text-stone-400 mb-6 text-sm max-w-xs mx-auto">
                    Criar e publicar receitas é exclusivo para assinantes Master Chef.
                </p>

                {/* Current Plan Badge */}
                <div className="inline-flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-full mb-6">
                    <span className="text-stone-400 text-xs">Seu plano:</span>
                    <span className="text-white text-xs font-bold">{planName}</span>
                </div>

                <div className="space-y-3">
                    <Link href="/plans" className="block">
                        <button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-900 font-bold py-4 px-8 rounded-2xl shadow-lg shadow-yellow-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <Crown size={18} />
                            Tornar-se Master Chef
                        </button>
                    </Link>
                    <Link href="/community" className="block">
                        <button className="w-full bg-stone-800 text-stone-300 font-bold py-3 px-8 rounded-2xl border border-stone-700 hover:bg-stone-700 transition-all flex items-center justify-center gap-2">
                            <Users size={16} />
                            Ver Comunidade
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ Usuário Master Chef - mostrar botão de criar
    return (
        <div className="space-y-6">
            <div className="bg-white/80 dark:bg-[#1B1E22] backdrop-blur-sm rounded-3xl border border-stone-100 dark:border-stone-800 shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">
                    👨‍🍳
                </div>
                <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-2">Seu livro de receitas</h3>
                <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm max-w-xs mx-auto">
                    Crie, organize e compartilhe suas criações culinárias com a comunidade.
                </p>
                <Link href="/recipes/create">
                    <button className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto">
                        <Edit3 size={18} />
                        Nova Receita
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'my_recipes' | 'posts' | 'reels'>('saved');
    const [userProfile, setUserProfile] = useState(INITIAL_PROFILE);
    const [stats, setStats] = useState(INITIAL_PROFILE.stats);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const loggedUser = auth.getUser();
        if (loggedUser) {
            setUserProfile(prev => ({ ...prev, ...loggedUser }));
        }

        setTimeout(() => {
            setStats(prev => ({ ...prev, recipes: 14, saved: 48 }));
        }, 800);

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-[#0E0F10] pb-28 selection:bg-[var(--color-primary)] selection:text-white">
            <Navbar />

            {/* Premium Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#1A1D20_0%,transparent_60%)] pointer-events-none z-0"></div>

            {/* Immersive Background Header */}
            <div className="relative w-full h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A1D20] to-transparent z-0"></div>
                {/* Decorative Circles */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-[100px] animate-soft-pulse"></div>
                <div className="absolute top-20 -left-20 w-72 h-72 bg-[var(--color-primary)]/10 rounded-full blur-[80px]"></div>
            </div>

            <main className="max-w-md mx-auto px-5 relative z-10 -mt-60">

                {/* Profile Card */}
                <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/5 rounded-[2.5rem] shadow-2xl shadow-stone-900/10 p-6 mb-8 text-center relative overflow-hidden group">
                    {/* Glossy Reflection */}
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

                    {/* Avatar */}
                    <div className="relative mx-auto w-32 h-32 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)]">
                            <img
                                src={userProfile.image}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-stone-900 bg-white"
                            />
                            <Link href="/profile/edit">
                                <button className="absolute bottom-0 right-0 bg-stone-900 dark:bg-white text-white dark:text-stone-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <Edit3 size={16} />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Info */}
                    <h1 className="text-3xl font-black text-stone-800 dark:text-white mb-1 tracking-tight">{userProfile.name}</h1>
                    <p className="text-[var(--color-primary)] font-bold text-sm mb-4 tracking-wide uppercase">{userProfile.username}</p>

                    <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6 px-4">
                        {userProfile.bio}
                    </p>

                    {/* Stats Row - Refined */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: stats.recipes, label: 'Receitas', icon: '🍳' },
                            { value: stats.saved, label: 'Salvas', icon: '❤️' },
                            { value: stats.following, label: 'Seguindo', icon: '👥' },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-stone-50/80 dark:bg-stone-800/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-stone-100 dark:border-white/5 hover:scale-105 transition-transform cursor-default"
                            >
                                <span className="text-lg block mb-1">{stat.icon}</span>
                                <div className="text-2xl font-black text-stone-800 dark:text-white tabular-nums">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Premium Membership Card - Dynamic */}
                    <PlanStatusCard />

                    {/* Gamification Section */}
                    <div className="mt-6 space-y-4">
                        <LevelProgressCard />
                        <BadgesGrid limit={8} />
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="flex p-1 bg-stone-200/50 dark:bg-stone-800/50 backdrop-blur-md rounded-2xl mb-6 relative">
                    {/* Animated Background Pill */}
                    <div
                        className={`absolute top-1 bottom-1 w-1/3 bg-white dark:bg-stone-700 rounded-xl shadow-sm transition-all duration-300 ease-spring`}
                        style={{
                            left: activeTab === 'saved' ? '4px' :
                                activeTab === 'my_recipes' ? 'calc(20% + 2px)' :
                                    activeTab === 'history' ? 'calc(40% + 2px)' :
                                        activeTab === 'posts' ? 'calc(60% + 2px)' : 'calc(80% + 2px)',
                            width: 'calc(20% - 4px)'
                        }}
                    ></div>

                    {[
                        { id: 'saved', icon: Heart, label: 'Salvas' },
                        { id: 'my_recipes', icon: Grid, label: 'Minhas' },
                        { id: 'history', icon: Clock, label: 'Histórico' },
                        { id: 'posts', icon: Sparkles, label: 'Posts' },
                        { id: 'reels', icon: Play, label: 'Reels' },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 relative z-10 flex flex-col items-center justify-center py-3 gap-1 transition-colors duration-200 ${isActive ? 'text-[var(--color-primary)]' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'}`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Grid Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* SAVED RECIPES */}
                    {activeTab === 'saved' && (
                        <div className="grid grid-cols-2 gap-4">
                            {recipes.map((recipe, i) => (
                                <Link href={`/recipes/${recipe.id}`} key={recipe.id} style={{ animationDelay: `${i * 100}ms` }} className="animate-in fade-in zoom-in-50 duration-500">
                                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-1">{recipe.title}</h3>
                                            <div className="flex items-center gap-1 text-[10px] text-white/80 font-medium">
                                                <span>⏱️ {recipe.time}</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                                            <Heart size={14} fill="currentColor" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* MY RECIPES */}
                    {activeTab === 'my_recipes' && (
                        <MyRecipesSection />
                    )}

                    {/* HISTORY */}
                    {activeTab === 'history' && (
                        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
                            {recipes.slice(0, 4).map((recipe, i) => (
                                <div key={i} className="relative group">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[21px] top-6 w-3 h-3 bg-[var(--color-primary)] rounded-full ring-4 ring-white dark:ring-stone-950"></div>

                                    <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex gap-4 transition-all hover:scale-[1.02]">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                                            <img src={recipe.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                        <div className="py-1">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 block">Visto hoje às 14:00</span>
                                            <h4 className="font-bold text-lg text-stone-800 dark:text-white leading-tight mb-2">{recipe.title}</h4>
                                            <Link href={`/recipe/${recipe.id}`} className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 hover:gap-2 transition-all">
                                                Ver receita <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* POSTS GRID */}
                    {activeTab === 'posts' && (
                        <div className="grid grid-cols-3 gap-1">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="relative aspect-square bg-stone-800 overflow-hidden group cursor-pointer">
                                    <img
                                        src={`https://source.unsplash.com/random/400x400?food&sig=${i}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Heart className="text-white fill-white" size={20} />
                                        <span className="text-white font-bold text-sm ml-1">{100 + i * 20}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* REELS GRID */}
                    {activeTab === 'reels' && (
                        <div className="grid grid-cols-3 gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="relative aspect-[9/16] bg-stone-800 overflow-hidden group cursor-pointer rounded-lg">
                                    <img
                                        src={`https://source.unsplash.com/random/400x700?cooking&sig=${i}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                                        <Play className="text-white fill-white" size={12} />
                                        <span className="text-white font-bold text-xs">10k</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
            <BottomNavigation />
        </div>
    );
}

