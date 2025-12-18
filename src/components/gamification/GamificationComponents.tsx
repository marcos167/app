'use client';

import { useGamification, Badge, Achievement, Level } from '@/contexts/GamificationContext';
import { Star, Trophy, Medal, Award, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

// ==================== LEVEL PROGRESS ====================

export function LevelProgressCard() {
    const { level, xp, xpToNextLevel, levelProgress } = useGamification();

    return (
        <div className="bg-white/80 dark:bg-[#1B1E22] backdrop-blur-sm rounded-3xl border border-stone-100 dark:border-stone-800 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-2xl shadow-lg">
                        {level.icon}
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Nível {level.level}</p>
                        <p className="text-white font-bold text-lg">{level.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[var(--color-primary)] font-black text-xl">{xp}</p>
                    <p className="text-stone-500 text-xs">XP Total</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
                <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-500"
                        style={{ width: `${levelProgress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-stone-400">
                    <span>Nível {level.level}</span>
                    <span className="font-bold">{xpToNextLevel} XP para próximo nível</span>
                </div>
            </div>
        </div>
    );
}

// ==================== BADGES SHOWCASE ====================

const RARITY_COLORS = {
    common: 'from-stone-400 to-stone-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-amber-500',
};

const RARITY_BG = {
    common: 'bg-stone-500/10 border-stone-500/20',
    rare: 'bg-blue-500/10 border-blue-500/20',
    epic: 'bg-purple-500/10 border-purple-500/20',
    legendary: 'bg-yellow-500/10 border-yellow-500/20',
};

export function BadgeItem({ badge, size = 'md', showName = false }: { badge: Badge; size?: 'sm' | 'md' | 'lg'; showName?: boolean }) {
    const sizes = {
        sm: 'w-12 h-12 text-xl',
        md: 'w-14 h-14 text-2xl',
        lg: 'w-20 h-20 text-4xl',
    };

    return (
        <div className={`flex flex-col items-center gap-1 ${badge.isUnlocked ? '' : 'grayscale opacity-40'}`}>
            <div className={`${sizes[size]} rounded-2xl flex items-center justify-center border transition-transform hover:scale-110 ${badge.isUnlocked ? RARITY_BG[badge.rarity] : 'bg-stone-800 border-stone-700'
                }`}>
                <span className={badge.isUnlocked ? '' : 'filter brightness-50'}>{badge.icon}</span>

                {/* Locked Indicator */}
                {!badge.isUnlocked && (
                    <span className="absolute text-stone-600 text-[10px]">🔒</span>
                )}
            </div>

            {/* Badge Name - Optional */}
            {showName && (
                <span className="text-[9px] text-stone-400 font-medium text-center max-w-[60px] truncate">
                    {badge.name}
                </span>
            )}
        </div>
    );
}

export function BadgesGrid({ limit }: { limit?: number }) {
    const { badges, unlockedBadges } = useGamification();
    const displayBadges = limit ? badges.slice(0, limit) : badges;

    return (
        <div className="bg-white/80 dark:bg-[#1B1E22] backdrop-blur-sm rounded-3xl border border-stone-100 dark:border-stone-800 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Medal className="text-yellow-400" size={20} />
                    <h3 className="text-white font-bold">Selos</h3>
                </div>
                <span className="text-stone-400 text-sm">{unlockedBadges.length}/{badges.length}</span>
            </div>

            <div className="flex flex-wrap gap-3">
                {displayBadges.map(badge => (
                    <BadgeItem key={badge.id} badge={badge} size="sm" />
                ))}
            </div>

            {limit && badges.length > limit && (
                <Link href="/profile/badges" className="flex items-center justify-center gap-1 mt-4 text-[var(--color-primary)] text-sm font-bold hover:gap-2 transition-all">
                    Ver todos <ChevronRight size={16} />
                </Link>
            )}
        </div>
    );
}

// ==================== ACHIEVEMENTS ====================

export function AchievementItem({ achievement }: { achievement: Achievement }) {
    const progressPercent = (achievement.progress / achievement.target) * 100;

    return (
        <div className={`p-4 rounded-2xl border ${achievement.isCompleted
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-stone-800/50 border-stone-700'
            }`}>
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${achievement.isCompleted ? 'bg-green-500/20' : 'bg-stone-700'
                    }`}>
                    {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm truncate">{achievement.name}</h4>
                        {achievement.isCompleted && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                    <p className="text-stone-400 text-xs">{achievement.description}</p>

                    {/* Progress */}
                    {!achievement.isCompleted && (
                        <div className="mt-2">
                            <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-stone-500 text-[10px] mt-1">{achievement.progress}/{achievement.target}</p>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <span className="text-yellow-400 text-xs font-bold">+{achievement.xpReward} XP</span>
                </div>
            </div>
        </div>
    );
}

export function AchievementsList({ limit }: { limit?: number }) {
    const { achievements, completedAchievements } = useGamification();
    const displayAchievements = limit ? achievements.slice(0, limit) : achievements;

    return (
        <div className="bg-white/80 dark:bg-[#1B1E22] backdrop-blur-sm rounded-3xl border border-stone-100 dark:border-stone-800 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Trophy className="text-[var(--color-primary)]" size={20} />
                    <h3 className="text-white font-bold">Conquistas</h3>
                </div>
                <span className="text-stone-400 text-sm">{completedAchievements.length}/{achievements.length}</span>
            </div>

            <div className="space-y-3">
                {displayAchievements.map(achievement => (
                    <AchievementItem key={achievement.id} achievement={achievement} />
                ))}
            </div>
        </div>
    );
}

// ==================== MINI STATS ====================

export function GamificationStats() {
    const { level, unlockedBadges, completedAchievements, xp } = useGamification();

    return (
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-2 bg-stone-800/50 px-3 py-2 rounded-xl">
                <span className="text-lg">{level.icon}</span>
                <span className="text-white text-sm font-bold">Nv. {level.level}</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-800/50 px-3 py-2 rounded-xl">
                <Medal size={16} className="text-yellow-400" />
                <span className="text-white text-sm font-bold">{unlockedBadges.length}</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-800/50 px-3 py-2 rounded-xl">
                <Trophy size={16} className="text-[var(--color-primary)]" />
                <span className="text-white text-sm font-bold">{completedAchievements.length}</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 px-3 py-2 rounded-xl border border-[var(--color-primary)]/20">
                <Sparkles size={16} className="text-[var(--color-secondary)]" />
                <span className="text-white text-sm font-bold">{xp} XP</span>
            </div>
        </div>
    );
}

export default { LevelProgressCard, BadgesGrid, AchievementsList, GamificationStats };
