'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Trophy, Medal, Star, X, Sparkles } from 'lucide-react';

/**
 * 🎉 Achievement Toast - Notificação de Conquista
 */

interface AchievementNotification {
    id: string;
    type: 'badge' | 'achievement' | 'level';
    title: string;
    description: string;
    icon: string;
    xpReward?: number;
}

interface AchievementToastContextType {
    showAchievement: (notification: Omit<AchievementNotification, 'id'>) => void;
}

const AchievementToastContext = createContext<AchievementToastContextType | undefined>(undefined);

export function AchievementToastProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<AchievementNotification[]>([]);
    const [current, setCurrent] = useState<AchievementNotification | null>(null);

    const showAchievement = (notification: Omit<AchievementNotification, 'id'>) => {
        const newNotification = { ...notification, id: Date.now().toString() };
        setNotifications(prev => [...prev, newNotification]);
    };

    // Process queue
    useEffect(() => {
        if (!current && notifications.length > 0) {
            setCurrent(notifications[0]);
            setNotifications(prev => prev.slice(1));
        }
    }, [notifications, current]);

    // Auto dismiss
    useEffect(() => {
        if (current) {
            const timer = setTimeout(() => setCurrent(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [current]);

    const dismiss = () => setCurrent(null);

    return (
        <AchievementToastContext.Provider value={{ showAchievement }}>
            {children}

            {/* Toast Notification */}
            {current && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border border-yellow-500/30 rounded-3xl p-5 min-w-[320px] max-w-[90vw] shadow-2xl shadow-yellow-500/20">

                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 rounded-3xl blur-xl" />

                        {/* Close Button */}
                        <button
                            onClick={dismiss}
                            className="absolute top-3 right-3 text-stone-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="relative flex items-center gap-4">
                            {/* Icon */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-50 animate-pulse" />
                                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-3xl shadow-lg">
                                    {current.icon}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {current.type === 'badge' && <Medal size={14} className="text-yellow-400" />}
                                    {current.type === 'achievement' && <Trophy size={14} className="text-[var(--color-primary)]" />}
                                    {current.type === 'level' && <Star size={14} className="text-purple-400" />}
                                    <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                                        {current.type === 'badge' ? 'Novo Selo!' :
                                            current.type === 'achievement' ? 'Conquista!' : 'Level Up!'}
                                    </span>
                                </div>

                                <p className="text-white font-bold text-lg">{current.title}</p>
                                <p className="text-stone-400 text-sm">{current.description}</p>

                                {current.xpReward && (
                                    <div className="flex items-center gap-1 mt-2">
                                        <Sparkles size={12} className="text-[var(--color-primary)]" />
                                        <span className="text-[var(--color-primary)] text-xs font-bold">+{current.xpReward} XP</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress bar animation */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800 rounded-b-3xl overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 animate-shrink"
                                style={{ animation: 'shrink 5s linear forwards' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </AchievementToastContext.Provider>
    );
}

export function useAchievementToast() {
    const context = useContext(AchievementToastContext);
    if (!context) {
        throw new Error('useAchievementToast must be used within AchievementToastProvider');
    }
    return context;
}
