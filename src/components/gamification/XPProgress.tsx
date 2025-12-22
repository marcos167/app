'use client';

import { useState, useEffect } from 'react';
import { Flame, Star, Trophy, Sparkles, Zap } from 'lucide-react';

interface LevelData {
    level: number;
    xp: number;
    xpToNextLevel: number;
    title: string;
    rank: string;
}

interface XPProgressProps {
    userId?: number;
    compact?: boolean;
}

// Level titles based on XP ranges
const LEVEL_CONFIG = [
    { level: 1, minXp: 0, title: "Cozinheiro Iniciante", rank: "bronze" },
    { level: 2, minXp: 100, title: "Sous Chef Aprendiz", rank: "bronze" },
    { level: 3, minXp: 300, title: "Chef de Partie", rank: "bronze" },
    { level: 4, minXp: 600, title: "Chef de Cozinha", rank: "silver" },
    { level: 5, minXp: 1000, title: "Chef Executivo", rank: "silver" },
    { level: 6, minXp: 1500, title: "Chef Especialista", rank: "silver" },
    { level: 7, minXp: 2200, title: "Mestre Culinário", rank: "gold" },
    { level: 8, minXp: 3000, title: "Chef Renomado", rank: "gold" },
    { level: 9, minXp: 4000, title: "Chef Estrela", rank: "gold" },
    { level: 10, minXp: 5500, title: "Chef Lendário", rank: "platinum" },
];

const RANK_COLORS = {
    bronze: { from: '#CD7F32', to: '#8B4513', glow: 'rgba(205, 127, 50, 0.3)' },
    silver: { from: '#C0C0C0', to: '#808080', glow: 'rgba(192, 192, 192, 0.3)' },
    gold: { from: '#FFD700', to: '#FFA500', glow: 'rgba(255, 215, 0, 0.4)' },
    platinum: { from: '#E5E4E2', to: '#7B68EE', glow: 'rgba(123, 104, 238, 0.4)' },
};

function calculateLevel(xp: number): LevelData {
    let currentLevel = LEVEL_CONFIG[0];
    let nextLevel = LEVEL_CONFIG[1];

    for (let i = 0; i < LEVEL_CONFIG.length; i++) {
        if (xp >= LEVEL_CONFIG[i].minXp) {
            currentLevel = LEVEL_CONFIG[i];
            nextLevel = LEVEL_CONFIG[i + 1] || LEVEL_CONFIG[i];
        }
    }

    const xpInLevel = xp - currentLevel.minXp;
    const xpNeeded = nextLevel.minXp - currentLevel.minXp;

    return {
        level: currentLevel.level,
        xp: xpInLevel,
        xpToNextLevel: xpNeeded,
        title: currentLevel.title,
        rank: currentLevel.rank,
    };
}

/**
 * 🎮 XP Progress Badge - Shows user level, XP, and progress
 */
export function XPProgress({ userId, compact = false }: XPProgressProps) {
    const [levelData, setLevelData] = useState<LevelData>({
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        title: "Cozinheiro Iniciante",
        rank: "bronze"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchXP = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gamification/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const totalXp = data.total_xp || data.xp || 0;
                    setLevelData(calculateLevel(totalXp));
                } else {
                    // Use mock data for demo
                    setLevelData(calculateLevel(850)); // Level 4-5
                }
            } catch (error) {
                console.error('Failed to fetch XP:', error);
                setLevelData(calculateLevel(850));
            } finally {
                setLoading(false);
            }
        };

        fetchXP();
    }, [userId]);

    const colors = RANK_COLORS[levelData.rank as keyof typeof RANK_COLORS];
    const progress = levelData.xpToNextLevel > 0
        ? (levelData.xp / levelData.xpToNextLevel) * 100
        : 100;

    if (loading) {
        return (
            <div className={`animate-pulse ${compact ? 'h-8' : 'h-24'} bg-stone-800/50 rounded-xl`} />
        );
    }

    // Compact version (for badge)
    if (compact) {
        return (
            <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg"
                style={{
                    background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)`,
                    borderColor: `${colors.from}30`,
                    boxShadow: `0 4px 15px ${colors.glow}`,
                }}
            >
                <Flame size={12} style={{ color: colors.from }} className="fill-current" />
                <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: colors.from }}
                >
                    Lv.{levelData.level}
                </span>
            </div>
        );
    }

    // Full version
    return (
        <div
            className="p-4 rounded-2xl border backdrop-blur-sm"
            style={{
                background: `linear-gradient(135deg, ${colors.from}10, ${colors.to}10)`,
                borderColor: `${colors.from}20`,
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                            boxShadow: `0 4px 15px ${colors.glow}`,
                        }}
                    >
                        <Trophy size={20} className="text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-white">Level {levelData.level}</span>
                            <Sparkles size={14} style={{ color: colors.from }} />
                        </div>
                        <span className="text-xs text-stone-400">{levelData.title}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-sm font-bold text-white">{levelData.xp} XP</span>
                    <span className="text-xs text-stone-500 block">/ {levelData.xpToNextLevel}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-stone-800 rounded-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                        boxShadow: `0 0 10px ${colors.glow}`,
                    }}
                />
                {/* Shimmer effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                    style={{
                        width: `${progress}%`,
                        animation: 'shimmer 2s infinite',
                    }}
                />
            </div>

            {/* XP to next level */}
            <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                    <Zap size={10} className="inline mr-1" style={{ color: colors.from }} />
                    {levelData.xpToNextLevel - levelData.xp} XP para o próximo nível
                </span>
                <span className="font-medium" style={{ color: colors.from }}>
                    {Math.round(progress)}%
                </span>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}

/**
 * 🏆 Level Badge - Small badge for avatar overlay
 */
export function LevelBadge({ level = 5, rank = 'silver' }: { level?: number; rank?: string }) {
    const colors = RANK_COLORS[rank as keyof typeof RANK_COLORS] || RANK_COLORS.bronze;

    return (
        <div
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-lg"
            style={{
                background: `linear-gradient(135deg, #1A1A1A, #0C0A09)`,
                borderColor: `${colors.from}40`,
                boxShadow: `0 4px 15px rgba(0,0,0,0.5), 0 0 10px ${colors.glow}`,
            }}
        >
            <Flame size={11} style={{ color: colors.from }} className="fill-current" />
            <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: colors.from }}
            >
                Chef Lv.{level}
            </span>
        </div>
    );
}

export default XPProgress;
