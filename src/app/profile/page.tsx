'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { recipes } from "@/lib/data";
import Link from 'next/link';
import {
    Edit3, Settings, Grid, Heart, Clock, Award, Crown, Sparkles, Lock, Users, Trophy, Medal, Play,
    ChevronRight, Shield, Menu, MoreHorizontal, UserPlus, Flame, ChefHat, LogOut, DollarSign
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PlanStatusCard } from '@/components/subscription/PlanStatusCard';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { EarningsImpactTab } from '@/components/monetization/EarningsImpactTab';

const INITIAL_PROFILE = {
    name: "Usuário",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
    username: "@usuario",
    level: "Iniciante",
    role: "user",
    email: "",
    bio: "Sem bio ainda.",
};

export default function ProfilePage() {
    const [userProfile, setUserProfile] = useState(INITIAL_PROFILE);
    const [activeTab, setActiveTab] = useState<'recipes' | 'reels' | 'saved' | 'earnings'>('recipes');
    const [stats, setStats] = useState({ recipes: 0, followers: 0, following: 0 });
    const { planName } = useSubscription();

    useEffect(() => {
        const loadProfile = async () => {
            const loggedUser = auth.getUser();
            if (loggedUser) {
                setUserProfile(prev => ({ ...prev, ...loggedUser }));
                // Fetch Stats
                try {
                    const token = auth.getToken();
                    if (token) {
                        const res = await fetch(`/api/users/${loggedUser.id}/stats`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                            const data = await res.json();
                            setStats(data);
                        }
                    }
                } catch (error) { console.error(error); }
            }
        };
        loadProfile();
    }, []);

    const handleLogout = () => {
        auth.logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#0C0A09] text-white font-sans pb-24 relative overflow-x-hidden selection:bg-amber-500/30">
            {/* Ambient Lighting Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            {/* Custom Chefex Top Bar */}
            <header className="sticky top-0 z-50 bg-[#0C0A09]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-5 transition-all duration-300">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-0.5">Perfil</span>
                    <h1 className="font-bold text-lg leading-none tracking-tight flex items-center gap-2">
                        {userProfile.username}
                        {planName === 'Master Chef' && <Crown size={14} className="text-amber-400 fill-amber-400/20" />}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/settings">
                        <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-stone-400 hover:text-white">
                            <Settings size={20} />
                        </button>
                    </Link>
                    <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/5 transition-colors text-red-400 hover:text-red-300">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="relative z-10 px-5 pt-8">

                {/* 1. Identity Section (Chef Card) */}
                <div className="flex flex-col items-center mb-8 relative">
                    {/* Glowing Avatar Ring */}
                    <div className="relative w-28 h-28 mb-4 group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
                        <div className="absolute inset-0.5 bg-[#0C0A09] rounded-full z-10"></div>
                        <img
                            src={userProfile.image}
                            alt={userProfile.name}
                            className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full object-cover z-20"
                        />
                        {/* Level Badge Floating */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 bg-[#1A1A1A] border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-black/50">
                            <Flame size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Chef Lv.5</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-white text-center mb-1">{userProfile.name}</h2>
                    <p className="text-stone-400 text-sm text-center max-w-xs leading-relaxed mb-4">
                        {userProfile.bio || "Explorando sabores e criando experiências."}
                    </p>

                    {/* Stats Cards (Glassmorphism row) */}
                    <div className="flex items-center gap-3 w-full max-w-sm justify-center mb-6">
                        {[
                            { label: 'Receitas', value: stats.recipes, bg: 'bg-orange-500/10', tab: 'recipes' },
                            { label: 'Seguidores', value: stats.followers, bg: 'bg-amber-500/10', tab: null },
                            { label: 'Seguindo', value: stats.following, bg: 'bg-stone-800/50', tab: null }
                        ].map((stat, i) => (
                            <button
                                key={i}
                                onClick={() => stat.tab && setActiveTab(stat.tab as any)}
                                className={`flex-1 py-3 px-2 rounded-2xl border border-white/5 backdrop-blur-sm flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${stat.bg}`}
                            >
                                <span className="text-lg font-black text-white">{stat.value}</span>
                                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">{stat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons (Full Width) */}
                    <div className="flex flex-col w-full gap-3 max-w-sm">
                        <Link href="/profile/edit" className="w-full">
                            <button className="w-full h-10 bg-white text-black font-bold text-sm rounded-xl hover:bg-stone-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                Editar Perfil
                            </button>
                        </Link>

                        {/* CEO ONLY - Admin Panel Access */}
                        {userProfile.email?.toLowerCase() === 'm22338294@gmail.com' && (
                            <Link href="/admin" className="w-full">
                                <button className="w-full h-10 bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-sm rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2">
                                    <Shield size={18} />
                                    Painel Administrativo
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 2. Premium Features Preview */}
                <div className="mb-8">
                    <PlanStatusCard />
                </div>

                {/* 3. Content Tabs (Custom Chefex Style) */}
                <div className="sticky top-16 z-40 bg-[#0C0A09]/95 backdrop-blur-md pt-2 pb-0 -mx-5 px-5 border-b border-white/5">
                    <div className="flex items-center justify-between relative">
                        {/* Animated Indicator */}
                        <motion.div
                            className="absolute bottom-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] z-10"
                            initial={false}
                            animate={{
                                width: '25%',
                                x: activeTab === 'recipes' ? '0%' : activeTab === 'reels' ? '100%' : activeTab === 'saved' ? '200%' : '300%'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        {[
                            { id: 'recipes', icon: Grid, label: 'Minhas' },
                            { id: 'reels', icon: Play, label: 'Reels' },
                            { id: 'saved', icon: Heart, label: 'Salvas' },
                            { id: 'earnings', icon: DollarSign, label: 'Ganhos' }
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors duration-300 relative group`}
                                >
                                    <Icon
                                        size={20}
                                        className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'}`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {isActive && (
                                        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-50"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Content Grid */}
                <div className="py-4 min-h-[50vh]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'recipes' && (
                            <motion.div
                                key="recipes"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-2 gap-3"
                            >
                                {recipes.map((recipe, i) => (
                                    <Link href={`/recipes/${recipe.id}`} key={recipe.id} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-white/5 group">
                                        <img
                                            src={recipe.image}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            alt={recipe.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                        {recipe.is_premium && (
                                            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-amber-500/30">
                                                <Crown size={12} className="text-amber-500 fill-amber-500" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-xs font-bold text-white line-clamp-1 truncate">{recipe.title}</p>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'reels' && (
                            <motion.div
                                key="reels"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center py-20 text-stone-500 space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center border border-stone-800">
                                    <Play size={24} className="ml-1 opacity-50" />
                                </div>
                                <p className="text-sm">Nenhum Reel publicado ainda.</p>
                                <button className="text-amber-500 text-xs font-bold uppercase tracking-widest hover:text-amber-400">Criar Agora</button>
                            </motion.div>
                        )}

                        {activeTab === 'saved' && (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-3 gap-1"
                            >
                                {recipes.slice(0, 6).map((recipe, i) => (
                                    <Link href={`/recipes/${recipe.id}`} key={recipe.id} className="relative aspect-square bg-stone-900 group overflow-hidden">
                                        <img
                                            src={recipe.image}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale-[0.3] group-hover:grayscale-0"
                                            alt={recipe.title}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </Link>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'earnings' && (
                            <motion.div
                                key="earnings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <EarningsImpactTab />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>
            <BottomNavigation />
        </div>
    );
}
