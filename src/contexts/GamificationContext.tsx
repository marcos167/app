'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * 🎮 Gamification Context - Sistema de Selos, Conquistas e Níveis
 * 
 * Chefex - Axis Software
 */

// ==================== TYPES ====================

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlockedAt?: Date;
    isUnlocked: boolean;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    progress: number;
    target: number;
    isCompleted: boolean;
    completedAt?: Date;
    xpReward: number;
}

export interface Level {
    level: number;
    name: string;
    minXP: number;
    maxXP: number;
    icon: string;
}

export interface GamificationState {
    // XP & Level
    xp: number;
    level: Level;
    xpToNextLevel: number;
    levelProgress: number; // 0-100%

    // Badges & Achievements
    badges: Badge[];
    achievements: Achievement[];
    unlockedBadges: Badge[];
    completedAchievements: Achievement[];

    // Stats
    recipesPublished: number;
    totalLikes: number;
    totalSaves: number;
    totalRatings: number;
}

// ==================== CONSTANTS ====================

export const LEVELS: Level[] = [
    { level: 1, name: 'Iniciante', minXP: 0, maxXP: 100, icon: '🥄' },
    { level: 2, name: 'Cozinheiro Amador', minXP: 100, maxXP: 300, icon: '🍳' },
    { level: 3, name: 'Cozinheiro', minXP: 300, maxXP: 600, icon: '👨‍🍳' },
    { level: 4, name: 'Chef Júnior', minXP: 600, maxXP: 1000, icon: '🔪' },
    { level: 5, name: 'Chef', minXP: 1000, maxXP: 1500, icon: '⭐' },
    { level: 6, name: 'Chef Sênior', minXP: 1500, maxXP: 2200, icon: '🌟' },
    { level: 7, name: 'Sous Chef', minXP: 2200, maxXP: 3000, icon: '🏆' },
    { level: 8, name: 'Chef Executivo', minXP: 3000, maxXP: 4000, icon: '👑' },
    { level: 9, name: 'Master Chef', minXP: 4000, maxXP: 5500, icon: '💎' },
    { level: 10, name: 'Master Chef Elite', minXP: 5500, maxXP: Infinity, icon: '🌈' },
];

export const BADGES: Badge[] = [
    { id: 'first_recipe', name: 'Primeiro Prato', description: 'Publicou sua primeira receita', icon: '🍽️', rarity: 'common', isUnlocked: false },
    { id: 'recipes_10', name: 'Cozinheiro Produtivo', description: 'Publicou 10 receitas', icon: '📚', rarity: 'rare', isUnlocked: false },
    { id: 'recipes_50', name: 'Autor Prolífico', description: 'Publicou 50 receitas', icon: '📖', rarity: 'epic', isUnlocked: false },
    { id: 'top_10_weekly', name: 'Top 10 da Semana', description: 'Entrou no Top 10 semanal', icon: '🏅', rarity: 'rare', isUnlocked: false },
    { id: 'top_1_weekly', name: 'Campeão da Semana', description: 'Ficou em 1º lugar no ranking semanal', icon: '🥇', rarity: 'legendary', isUnlocked: false },
    { id: 'most_saved', name: 'Receita Favorita', description: 'Teve a receita mais salva do dia', icon: '❤️', rarity: 'epic', isUnlocked: false },
    { id: 'likes_100', name: 'Amado pela Comunidade', description: 'Recebeu 100 curtidas', icon: '💕', rarity: 'rare', isUnlocked: false },
    { id: 'likes_1000', name: 'Fenômeno', description: 'Recebeu 1000 curtidas', icon: '🔥', rarity: 'legendary', isUnlocked: false },
    { id: 'master_chef', name: 'Master Chef Ativo', description: 'Assinou o plano Master Chef', icon: '👑', rarity: 'epic', isUnlocked: false },
    { id: 'early_adopter', name: 'Pioneiro', description: 'Um dos primeiros usuários do Chefex', icon: '🚀', rarity: 'legendary', isUnlocked: false },
    { id: 'rating_5', name: 'Perfeição', description: 'Recebeu avaliação 5 estrelas', icon: '⭐', rarity: 'common', isUnlocked: false },
    { id: 'streak_7', name: 'Dedicação', description: 'Publicou por 7 dias seguidos', icon: '📆', rarity: 'rare', isUnlocked: false },
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'publish_first', name: 'Chef em Treinamento', description: 'Publique sua primeira receita', icon: '🍳', progress: 0, target: 1, isCompleted: false, xpReward: 50 },
    { id: 'publish_5', name: 'Coleção Crescente', description: 'Publique 5 receitas', icon: '📝', progress: 0, target: 5, isCompleted: false, xpReward: 100 },
    { id: 'publish_25', name: 'Escritor Culinário', description: 'Publique 25 receitas', icon: '📖', progress: 0, target: 25, isCompleted: false, xpReward: 300 },
    { id: 'likes_50', name: 'Popular', description: 'Receba 50 curtidas', icon: '❤️', progress: 0, target: 50, isCompleted: false, xpReward: 100 },
    { id: 'likes_500', name: 'Influenciador', description: 'Receba 500 curtidas', icon: '🌟', progress: 0, target: 500, isCompleted: false, xpReward: 500 },
    { id: 'saves_100', name: 'Inspiração', description: 'Tenha 100 salvamentos', icon: '💾', progress: 0, target: 100, isCompleted: false, xpReward: 200 },
    { id: 'rating_avg_4', name: 'Qualidade Garantida', description: 'Mantenha média de 4+ estrelas', icon: '⭐', progress: 0, target: 1, isCompleted: false, xpReward: 150 },
    { id: 'community_active', name: 'Membro Ativo', description: 'Interaja 30 dias na comunidade', icon: '🤝', progress: 0, target: 30, isCompleted: false, xpReward: 200 },
];

// XP Rewards
export const XP_REWARDS = {
    PUBLISH_RECIPE: 25,
    RECEIVE_LIKE: 2,
    RECEIVE_SAVE: 5,
    RECEIVE_RATING: 10,
    RECEIVE_5_STAR: 20,
    DAILY_LOGIN: 5,
    COMPLETE_ACHIEVEMENT: 50,
};

// ==================== CONTEXT ====================

interface GamificationContextType extends GamificationState {
    addXP: (amount: number, reason?: string) => void;
    unlockBadge: (badgeId: string) => void;
    updateAchievementProgress: (achievementId: string, progress: number) => void;
    checkAndUnlockBadges: () => void;
    getRecentUnlocks: () => (Badge | Achievement)[];
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = 'chefex_gamification';

function getLevelFromXP(xp: number): Level {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].minXP) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

export function GamificationProvider({ children }: { children: ReactNode }) {
    const [xp, setXP] = useState(150); // Mock starting XP
    const [badges, setBadges] = useState<Badge[]>(BADGES);
    const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
    const [recentUnlocks, setRecentUnlocks] = useState<(Badge | Achievement)[]>([]);

    // Stats (mock)
    const [stats, setStats] = useState({
        recipesPublished: 3,
        totalLikes: 45,
        totalSaves: 12,
        totalRatings: 8,
    });

    // Load from storage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setXP(data.xp || 150);
                if (data.badges) setBadges(data.badges);
                if (data.achievements) setAchievements(data.achievements);
                if (data.stats) setStats(data.stats);
            } catch { }
        }
    }, []);

    // Save to storage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp, badges, achievements, stats }));
    }, [xp, badges, achievements, stats]);

    const level = getLevelFromXP(xp);
    const nextLevel = LEVELS.find(l => l.level === level.level + 1) || level;
    const xpInCurrentLevel = xp - level.minXP;
    const xpNeededForLevel = nextLevel.minXP - level.minXP;
    const levelProgress = Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);

    const addXP = (amount: number, reason?: string) => {
        setXP(prev => prev + amount);
        console.log(`+${amount} XP: ${reason || 'unknown'}`);
    };

    const unlockBadge = (badgeId: string) => {
        setBadges(prev => prev.map(b =>
            b.id === badgeId && !b.isUnlocked
                ? { ...b, isUnlocked: true, unlockedAt: new Date() }
                : b
        ));
        const badge = badges.find(b => b.id === badgeId);
        if (badge && !badge.isUnlocked) {
            setRecentUnlocks(prev => [...prev, { ...badge, isUnlocked: true, unlockedAt: new Date() }]);
        }
    };

    const updateAchievementProgress = (achievementId: string, progress: number) => {
        setAchievements(prev => prev.map(a => {
            if (a.id !== achievementId) return a;
            const newProgress = Math.min(progress, a.target);
            const isCompleted = newProgress >= a.target;

            if (isCompleted && !a.isCompleted) {
                addXP(a.xpReward, `Achievement: ${a.name}`);
                setRecentUnlocks(prev => [...prev, { ...a, progress: newProgress, isCompleted: true, completedAt: new Date() }]);
            }

            return {
                ...a,
                progress: newProgress,
                isCompleted,
                completedAt: isCompleted && !a.isCompleted ? new Date() : a.completedAt,
            };
        }));
    };

    const checkAndUnlockBadges = () => {
        // Auto-check based on stats
        if (stats.recipesPublished >= 1) unlockBadge('first_recipe');
        if (stats.recipesPublished >= 10) unlockBadge('recipes_10');
        if (stats.totalLikes >= 100) unlockBadge('likes_100');
    };

    const getRecentUnlocks = () => recentUnlocks;

    const unlockedBadges = badges.filter(b => b.isUnlocked);
    const completedAchievements = achievements.filter(a => a.isCompleted);

    return (
        <GamificationContext.Provider
            value={{
                xp,
                level,
                xpToNextLevel: nextLevel.minXP - xp,
                levelProgress,
                badges,
                achievements,
                unlockedBadges,
                completedAchievements,
                ...stats,
                addXP,
                unlockBadge,
                updateAchievementProgress,
                checkAndUnlockBadges,
                getRecentUnlocks,
            }}
        >
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within GamificationProvider');
    }
    return context;
}
