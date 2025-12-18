'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { useGamification, BADGES } from "@/contexts/GamificationContext";
import { Medal, ChevronLeft, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

const RARITY_COLORS = {
    common: { bg: 'bg-stone-500/10', border: 'border-stone-500/30', text: 'text-stone-400', label: 'Comum' },
    rare: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', label: 'Raro' },
    epic: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', label: 'Épico' },
    legendary: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Lendário' },
};

export default function BadgesPage() {
    const { badges, unlockedBadges } = useGamification();

    // Group by rarity
    const badgesByRarity = {
        legendary: badges.filter(b => b.rarity === 'legendary'),
        epic: badges.filter(b => b.rarity === 'epic'),
        rare: badges.filter(b => b.rarity === 'rare'),
        common: badges.filter(b => b.rarity === 'common'),
    };

    return (
        <div className="min-h-screen bg-[#0E0F10] pb-24 font-sans text-white">
            {/* Premium Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#1A1D20_0%,transparent_60%)] pointer-events-none z-0"></div>

            <Navbar />

            <main className="relative z-10 px-4 pt-6 max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-2 bg-stone-800 rounded-xl hover:bg-stone-700 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black">Meus Selos</h1>
                        <p className="text-stone-400 text-sm">{unlockedBadges.length} de {badges.length} desbloqueados</p>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="bg-[#1B1E22] rounded-3xl border border-stone-800 p-5 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                                <Medal size={28} className="text-stone-900" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">Colecionador de Selos</p>
                                <p className="text-stone-400 text-sm">Continue conquistando!</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all"
                            style={{ width: `${(unlockedBadges.length / badges.length) * 100}%` }}
                        />
                    </div>
                    <p className="text-stone-500 text-xs mt-2 text-right">{Math.round((unlockedBadges.length / badges.length) * 100)}% completo</p>
                </div>

                {/* Badges by Rarity */}
                {(['legendary', 'epic', 'rare', 'common'] as const).map((rarity) => {
                    const rarityBadges = badgesByRarity[rarity];
                    if (rarityBadges.length === 0) return null;

                    const colors = RARITY_COLORS[rarity];
                    const unlockedCount = rarityBadges.filter(b => b.isUnlocked).length;

                    return (
                        <div key={rarity} className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className={colors.text} />
                                    <h2 className={`font-bold ${colors.text}`}>{colors.label}</h2>
                                </div>
                                <span className="text-stone-500 text-sm">{unlockedCount}/{rarityBadges.length}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {rarityBadges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`${colors.bg} ${colors.border} border rounded-2xl p-4 ${!badge.isUnlocked ? 'opacity-50 grayscale' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-stone-900/50 flex items-center justify-center text-2xl relative">
                                                {badge.icon}
                                                {!badge.isUnlocked && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                                                        <Lock size={16} className="text-stone-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-bold text-sm truncate">{badge.name}</p>
                                                <p className="text-stone-400 text-xs line-clamp-2">{badge.description}</p>
                                            </div>
                                        </div>

                                        {badge.isUnlocked && badge.unlockedAt && (
                                            <p className="text-stone-500 text-[10px] mt-3 text-right">
                                                ✓ {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </main>

            <BottomNavigation />
        </div>
    );
}
