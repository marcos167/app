'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, Award, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserEarnings {
    points: {
        total: number;
        available: number;
        level: number;
        xp_current: number;
        xp_next_level: number;
        badges: string[];
    };
    impact: {
        recipes_shared: number;
        reels_posted: number;
        people_helped: number;
        community_rank: number | null;
    };
    financial: {
        balance_brl: number;
        lifetime_earnings_brl: number;
        can_withdraw: boolean;
        kyc_verified: boolean;
    } | null;
}

const LEVEL_LABELS = [
    '', 'Iniciante', 'Aprendiz', 'Chef Junior', 'Chef Pleno',
    'Chef Ouro', 'Chef Mestre', 'Chef Elite', 'Chef Master',
    'Chef Legend', 'Chef Supreme'
];

const BADGE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
    'fundador': { label: 'Criador Fundador', icon: '🏆', color: 'text-amber-400' },
    'chef_ouro': { label: 'Chef de Ouro', icon: '⭐', color: 'text-yellow-400' },
    'influencer': { label: 'Influencer Chefex', icon: '🔥', color: 'text-orange-400' },
    'nivel_5': { label: 'Nível 5 Alcançado', icon: '🎖️', color: 'text-blue-400' },
    'nivel_10': { label: 'Nível Máximo', icon: '👑', color: 'text-purple-400' },
};

export function EarningsImpactTab() {
    const [earnings, setEarnings] = useState<UserEarnings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get token from the correct localStorage key
        const userDataStr = localStorage.getItem('app_receitas_user');
        if (!userDataStr) {
            setLoading(false);
            return;
        }

        let token: string;
        try {
            const userData = JSON.parse(userDataStr);
            token = userData.token;
            if (!token) {
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error('Failed to parse user data:', err);
            setLoading(false);
            return;
        }

        fetch('/api/users/me/earnings', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setEarnings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch earnings:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!earnings) {
        return (
            <div className="text-center py-12 text-stone-400">
                Erro ao carregar dados. Tente novamente.
            </div>
        );
    }

    const xpPercentage = (earnings.points.xp_current / earnings.points.xp_next_level) * 100;

    return (
        <div className="space-y-6 pb-8">
            {/* Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                <p className="text-xs text-amber-200 leading-relaxed">
                    ⚠️ <strong>Pontos não garantem renda financeira.</strong> Eles representam sua contribuição para a comunidade.
                    Monetização é excepcional e requer aprovação manual.
                </p>
            </div>

            {/* Points & Level Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-3xl p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-500/20 p-3 rounded-2xl">
                        <Trophy size={24} className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white">Score de Contribuição</h3>
                        <p className="text-xs text-stone-400">Seu impacto na comunidade</p>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-center py-4">
                        <p className="text-4xl font-black text-white mb-1">
                            {earnings.points.total.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-stone-400 uppercase tracking-wide">Pontos Acumulados</p>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="bg-black/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                            <Award size={16} className="text-amber-500" />
                            {LEVEL_LABELS[earnings.points.level]} (Nível {earnings.points.level})
                        </span>
                        <span className="text-xs text-stone-400">
                            {earnings.points.xp_current} / {earnings.points.xp_next_level} XP
                        </span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${xpPercentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Impact Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1C1917] border border-white/5 rounded-3xl p-6"
            >
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-500" />
                    Seu Impacto Social
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-black text-white">{earnings.impact.recipes_shared}</p>
                        <p className="text-xs text-stone-400 mt-1">Receitas Compartilhadas</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-black text-white">{earnings.impact.people_helped.toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-stone-400 mt-1">Pessoas Ajudadas</p>
                    </div>
                </div>

                {earnings.impact.community_rank && (
                    <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                        <p className="text-xs text-stone-400 mb-1">Ranking da Comunidade</p>
                        <p className="text-xl font-black text-white">#{earnings.impact.community_rank}</p>
                    </div>
                )}
            </motion.div>

            {/* Badges */}
            {earnings.points.badges.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1C1917] border border-white/5 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-amber-500" />
                        Conquistas Desbloqueadas
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {earnings.points.badges.map((badge) => {
                            const config = BADGE_LABELS[badge] || { label: badge, icon: '🏅', color: 'text-gray-400' };
                            return (
                                <div key={badge} className="bg-white/5 rounded-xl px-4 py-2 flex items-center gap-2">
                                    <span className="text-lg">{config.icon}</span>
                                    <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Eligibility CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-purple-500/20 rounded-3xl p-6"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Lock size={28} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">Quer Monetizar?</h3>
                        <p className="text-sm text-stone-400">
                            Verifique sua elegibilidade e veja os requisitos
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/monetization/eligibility'}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    Ver Meus Pontos & Impacto
                    <ArrowRight size={20} />
                </button>

                <p className="text-xs text-stone-500 text-center mt-3">
                    Sem garantia de aprovação • Análise manual • Critérios rigorosos
                </p>
            </motion.div>

            {/* Financial Section (Only if approved) */}
            {earnings.financial && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20 rounded-3xl p-6"
                >
                    <h3 className="text-lg font-black text-white mb-4">Monetização Aprovada ✓</h3>

                    <div className="text-center mb-4">
                        <p className="text-4xl font-black text-white mb-1">
                            R$ {earnings.financial.balance_brl.toFixed(2)}
                        </p>
                        <p className="text-xs text-stone-400">Saldo Disponível</p>
                    </div>

                    <div className="text-center mb-4">
                        <p className="text-sm text-stone-400">Ganhos Totais</p>
                        <p className="text-xl font-bold text-white">R$ {earnings.financial.lifetime_earnings_brl.toFixed(2)}</p>
                    </div>

                    <button
                        disabled={!earnings.financial.can_withdraw}
                        className={`w-full py-3 rounded-xl font-bold transition-all ${earnings.financial.can_withdraw
                                ? 'bg-green-500 hover:bg-green-400 text-white'
                                : 'bg-white/5 text-stone-500 cursor-not-allowed'
                            }`}
                    >
                        {earnings.financial.can_withdraw ? 'Solicitar Saque' : 'Saque Indisponível (mín. R$ 50)'}
                    </button>
                </motion.div>
            )}
        </div>
    );
}
