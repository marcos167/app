'use client';

import { useState, useEffect } from 'react';
import { Lock, CheckCircle, XCircle, TrendingUp, Award, Users, Target, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface EligibilityStatus {
    is_eligible: boolean;
    criteria: {
        time: {
            account_age_days: number;
            required: number;
            posts_distributed: boolean;
            met: boolean;
        };
        content: {
            recipes: number;
            required_recipes: number;
            videos: number;
            required_videos: number;
            violations: number;
            max_violations: number;
            met: boolean;
        };
        community: {
            followers: number;
            required_followers: number;
            engagement_rate: number;
            required_engagement: number;
            helpful_comments: number;
            required_comments: number;
            met: boolean;
        };
        impact: {
            executions: number;
            required_executions: number;
            avg_rating: number;
            required_rating: number;
            accessible_ratio: number;
            required_ratio: number;
            met: boolean;
        };
        trust: {
            fraud_score: number;
            max_fraud_score: number;
            days_since_suspicious: number;
            required_clean_days: number;
            met: boolean;
        };
        challenges: {
            completed: string[];
            required: string[];
            met: boolean;
        };
    };
    can_apply: boolean;
    next_milestone: string;
}

export default function EligibilityPage() {
    const [status, setStatus] = useState<EligibilityStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEligibility();
    }, []);

    const fetchEligibility = async () => {
        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) {
                window.location.href = '/login';
                return;
            }

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch('/api/monetization/eligibility', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch (err) {
            console.error('Failed to fetch eligibility:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0908] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="min-h-screen bg-[#0A0908] flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-white text-lg">Erro ao carregar dados</p>
                    <button
                        onClick={fetchEligibility}
                        className="mt-4 px-6 py-2 bg-amber-500 text-black font-bold rounded-xl"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    const ProgressBar = ({ current, required, met }: { current: number; required: number; met: boolean }) => {
        const percentage = Math.min((current / required) * 100, 100);

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-400">{current} / {required}</span>
                    {met ? (
                        <CheckCircle size={16} className="text-green-500" />
                    ) : (
                        <XCircle size={16} className="text-red-500" />
                    )}
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${met ? 'bg-green-500' : 'bg-amber-500'}`}
                    />
                </div>
            </div>
        );
    };

    const CriteriaCard = ({
        icon: Icon,
        title,
        met,
        children
    }: {
        icon: any;
        title: string;
        met: boolean;
        children: React.ReactNode
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${met
                    ? 'from-green-500/10 to-emerald-500/5 border-green-500/30'
                    : 'from-stone-800/50 to-stone-900/30 border-stone-700/30'
                } border rounded-3xl p-6`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-2xl ${met ? 'bg-green-500/20' : 'bg-stone-700/30'}`}>
                    <Icon size={24} className={met ? 'text-green-500' : 'text-stone-400'} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-black text-white">{title}</h3>
                    {met && <p className="text-xs text-green-400">✓ Critério atendido</p>}
                </div>
                {!met && <Lock size={20} className="text-red-500" />}
            </div>
            {children}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#0A0908] pb-24">
            {/* Header */}
            <div className="bg-gradient-to-b from-amber-500/10 to-transparent border-b border-amber-500/20 p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-black text-white mb-2">Elegibilidade para Monetização</h1>
                    <p className="text-stone-400 text-sm leading-relaxed">
                        ⚠️ Monetização no Chefex é <strong className="text-white">excepcional</strong> e depende de <strong className="text-white">aprovação manual</strong>.
                        Não há garantia de renda.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Status Card */}
                <div className={`bg-gradient-to-br ${status.is_eligible
                        ? 'from-green-500/20 to-emerald-500/10 border-green-500/40'
                        : 'from-red-500/20 to-orange-500/10 border-red-500/40'
                    } border rounded-3xl p-6`}>
                    <div className="flex items-center gap-4">
                        {status.is_eligible ? (
                            <CheckCircle size={48} className="text-green-500" />
                        ) : (
                            <Lock size={48} className="text-red-500" />
                        )}
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-white mb-1">
                                {status.is_eligible ? 'Elegível para Aplicar' : 'Não Elegível'}
                            </h2>
                            <p className="text-sm text-stone-300">
                                {status.next_milestone}
                            </p>
                        </div>
                    </div>

                    {status.is_eligible && status.can_apply && (
                        <button
                            onClick={() => window.location.href = '/monetization/apply'}
                            className="w-full mt-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl hover:scale-105 transition-transform"
                        >
                            Aplicar para Monetização →
                        </button>
                    )}

                    {status.is_eligible && !status.can_apply && (
                        <div className="mt-4 p-4 bg-black/30 rounded-xl">
                            <p className="text-sm text-stone-400">
                                Você já possui uma aplicação ativa ou em análise.
                            </p>
                        </div>
                    )}
                </div>

                {/* Criteria */}
                <div className="space-y-4">
                    {/* Time */}
                    <CriteriaCard icon={TrendingUp} title="Barreiras de Tempo" met={status.criteria.time.met}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Idade da Conta</p>
                                <ProgressBar
                                    current={status.criteria.time.account_age_days}
                                    required={status.criteria.time.required}
                                    met={status.criteria.time.account_age_days >= status.criteria.time.required}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-stone-300">Publicações Distribuídas</p>
                                {status.criteria.time.posts_distributed ? (
                                    <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                    <XCircle size={16} className="text-red-500" />
                                )}
                            </div>
                        </div>
                    </CriteriaCard>

                    {/* Content */}
                    <CriteriaCard icon={Award} title="Barreiras de Conteúdo" met={status.criteria.content.met}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Receitas Originais</p>
                                <ProgressBar
                                    current={status.criteria.content.recipes}
                                    required={status.criteria.content.required_recipes}
                                    met={status.criteria.content.recipes >= status.criteria.content.required_recipes}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Vídeos Publicados</p>
                                <ProgressBar
                                    current={status.criteria.content.videos}
                                    required={status.criteria.content.required_videos}
                                    met={status.criteria.content.videos >= status.criteria.content.required_videos}
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-stone-300">Violações de Moderação</span>
                                <span className={status.criteria.content.violations === 0 ? 'text-green-500' : 'text-red-500'}>
                                    {status.criteria.content.violations} / {status.criteria.content.max_violations}
                                </span>
                            </div>
                        </div>
                    </CriteriaCard>

                    {/* Community */}
                    <CriteriaCard icon={Users} title="Barreiras de Comunidade" met={status.criteria.community.met}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Seguidores Reais</p>
                                <ProgressBar
                                    current={status.criteria.community.followers}
                                    required={status.criteria.community.required_followers}
                                    met={status.criteria.community.followers >= status.criteria.community.required_followers}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Taxa de Engajamento</p>
                                <ProgressBar
                                    current={Math.round(status.criteria.community.engagement_rate * 100)}
                                    required={Math.round(status.criteria.community.required_engagement * 100)}
                                    met={status.criteria.community.engagement_rate >= status.criteria.community.required_engagement}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Comentários Úteis Validados</p>
                                <ProgressBar
                                    current={status.criteria.community.helpful_comments}
                                    required={status.criteria.community.required_comments}
                                    met={status.criteria.community.helpful_comments >= status.criteria.community.required_comments}
                                />
                            </div>
                        </div>
                    </CriteriaCard>

                    {/* Impact */}
                    <CriteriaCard icon={Target} title="Barreiras de Impacto" met={status.criteria.impact.met}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Receitas Feitas por Outros</p>
                                <ProgressBar
                                    current={status.criteria.impact.executions}
                                    required={status.criteria.impact.required_executions}
                                    met={status.criteria.impact.executions >= status.criteria.impact.required_executions}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Avaliação Média</p>
                                <ProgressBar
                                    current={Math.round(status.criteria.impact.avg_rating * 10)}
                                    required={Math.round(status.criteria.impact.required_rating * 10)}
                                    met={status.criteria.impact.avg_rating >= status.criteria.impact.required_rating}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Conteúdo Acessível (&lt;R$20)</p>
                                <ProgressBar
                                    current={Math.round(status.criteria.impact.accessible_ratio * 100)}
                                    required={Math.round(status.criteria.impact.required_ratio * 100)}
                                    met={status.criteria.impact.accessible_ratio >= status.criteria.impact.required_ratio}
                                />
                            </div>
                        </div>
                    </CriteriaCard>

                    {/* Trust */}
                    <CriteriaCard icon={Shield} title="Barreiras de Confiança" met={status.criteria.trust.met}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Score Antifraude (menor é melhor)</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-stone-400">{status.criteria.trust.fraud_score} / {status.criteria.trust.max_fraud_score}</span>
                                    {status.criteria.trust.fraud_score <= status.criteria.trust.max_fraud_score ? (
                                        <CheckCircle size={16} className="text-green-500" />
                                    ) : (
                                        <XCircle size={16} className="text-red-500" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-stone-300 mb-2">Dias Sem Eventos Suspeitos</p>
                                <ProgressBar
                                    current={status.criteria.trust.days_since_suspicious}
                                    required={status.criteria.trust.required_clean_days}
                                    met={status.criteria.trust.days_since_suspicious >= status.criteria.trust.required_clean_days}
                                />
                            </div>
                        </div>
                    </CriteriaCard>

                    {/* Challenges */}
                    <CriteriaCard icon={Zap} title="Desafios Obrigatórios" met={status.criteria.challenges.met}>
                        <div className="space-y-3">
                            {status.criteria.challenges.required.map((challenge) => {
                                const completed = status.criteria.challenges.completed.includes(challenge);
                                return (
                                    <div key={challenge} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                                        <span className="text-sm text-white capitalize">{challenge.replace('_', ' ')}</span>
                                        {completed ? (
                                            <CheckCircle size={20} className="text-green-500" />
                                        ) : (
                                            <XCircle size={20} className="text-red-500" />
                                        )}
                                    </div>
                                );
                            })}
                            <button
                                onClick={() => window.location.href = '/monetization/challenges'}
                                className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold rounded-xl transition-colors"
                            >
                                Ver Desafios →
                            </button>
                        </div>
                    </CriteriaCard>
                </div>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6">
                    <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        <Lock size={20} className="text-red-500" />
                        Avisos Importantes
                    </h3>
                    <ul className="space-y-2 text-sm text-stone-300">
                        <li>⚠️ Não há garantia de aprovação mesmo atendendo todos os critérios</li>
                        <li>⚠️ Análise pode levar até 30 dias</li>
                        <li>⚠️ Aprovação pode ser negada sem justificativa pública</li>
                        <li>⚠️ Monetização pode ser revogada a qualquer momento por violações</li>
                        <li>⚠️ Pontos NÃO garantem dinheiro</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
