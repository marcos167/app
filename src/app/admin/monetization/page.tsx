'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Shield, TrendingUp, Users, DollarSign, Zap, AlertTriangle } from 'lucide-react';

type Phase = 'community' | 'active' | 'partnerships';

interface PlatformSettings {
    id: number;
    monetization_enabled: boolean;
    current_phase: Phase;
    points_to_currency_rate: number;
    max_monthly_payout_per_user: number;
    min_withdrawal_amount: number;
}

interface Stats {
    total_users_with_points: number;
    total_points_distributed: number;
    average_points_per_user: number;
    users_with_financial_accounts: number;
    total_balance_brl: number;
    total_withdrawn_brl: number;
    level_distribution: Record<string, number>;
}

export default function AdminMonetizationPanel() {
    const [settings, setSettings] = useState<PlatformSettings | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    const loadData = async () => {
        const token = localStorage.getItem('chefex_token');
        if (!token) return;

        try {
            const [settingsRes, statsRes] = await Promise.all([
                fetch('/api/admin/monetization/settings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('/api/admin/monetization/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (settingsRes.ok && statsRes.ok) {
                setSettings(await settingsRes.json());
                setStats(await statsRes.json());
            }
        } catch (err) {
            console.error('Failed to load admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const updatePhase = async (newPhase: Phase) => {
        const token = localStorage.getItem('chefex_token');
        setUpdateLoading(true);

        try {
            const res = await fetch('/api/admin/monetization/settings', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ current_phase: newPhase })
            });

            if (res.ok) {
                await loadData();
                alert(`Fase alterada para: ${newPhase}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdateLoading(false);
        }
    };

    const toggleMonetization = async () => {
        const token = localStorage.getItem('chefex_token');
        setUpdateLoading(true);

        try {
            const res = await fetch('/api/admin/monetization/settings', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    monetization_enabled: !settings?.monetization_enabled
                })
            });

            if (res.ok) {
                const data = await res.json();
                await loadData();

                if (data.trigger_conversion) {
                    if (confirm('Monetização ativada! Deseja executar conversão retroativa agora?')) {
                        await runRetroactiveConversion();
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdateLoading(false);
        }
    };

    const runRetroactiveConversion = async () => {
        const token = localStorage.getItem('chefex_token');

        try {
            const res = await fetch('/api/admin/monetization/retroactive-conversion', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const result = await res.json();
                alert(`Conversão completa!\n\nUsuários: ${result.users_converted}\nPontos: ${result.total_points_converted}\nTotal distribuído: R$ ${result.total_brl_distributed}\nMédia: R$ ${result.average_initial_balance}`);
                await loadData();
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao executar conversão');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24 font-sans text-stone-300">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 pt-12 relative z-10">
                <header className="mb-12 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield size={32} className="text-red-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white">Painel de Monetização</h1>
                    <p className="text-stone-400">Controle de fases e conversão retroativa</p>
                </header>

                <div className="space-y-6 mb-12">
                    {/* Phase Control */}
                    <section className="bg-[#1C1917] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Controle de Fase</h2>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            {[
                                { id: 'community', label: '🟡 Comunidade', color: 'bg-amber-500/20 border-amber-500/30' },
                                { id: 'active', label: '🟢 Ativa', color: 'bg-green-500/20 border-green-500/30' },
                                { id: 'partnerships', label: '🔵 Parcerias', color: 'bg-blue-500/20 border-blue-500/30' }
                            ].map((phase) => (
                                <button
                                    key={phase.id}
                                    onClick={() => updatePhase(phase.id as Phase)}
                                    disabled={updateLoading || settings?.current_phase === phase.id}
                                    className={`p-4 rounded-xl border font-bold transition-all ${settings?.current_phase === phase.id
                                            ? `${phase.color} text-white`
                                            : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'
                                        }`}
                                >
                                    {phase.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={toggleMonetization}
                            disabled={updateLoading}
                            className={`w-full py-4 rounded-xl font-bold transition-all ${settings?.monetization_enabled
                                    ? 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30'
                                    : 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30'
                                } border`}
                        >
                            {settings?.monetization_enabled ? '🔴 DESATIVAR Monetização' : '🟢 ATIVAR Monetização'}
                        </button>

                        {settings?.monetization_enabled && (
                            <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                                <p className="text-green-200 font-bold text-sm">✓ Monetização está ATIVA</p>
                            </div>
                        )}
                    </section>

                    {/* Stats */}
                    {stats && (
                        <section className="bg-[#1C1917] border border-white/5 rounded-3xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUp size={20} />
                                Estatísticas Globais
                            </h2>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-white">{stats.total_users_with_points.toLocaleString()}</p>
                                    <p className="text-xs text-stone-400 mt-1">Usuários com Pontos</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-white">{stats.total_points_distributed.toLocaleString()}</p>
                                    <p className="text-xs text-stone-400 mt-1">Pontos Distribuídos</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-white">{Math.round(stats.average_points_per_user).toLocaleString()}</p>
                                    <p className="text-xs text-stone-400 mt-1">Média por Usuário</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-green-400">R$ {stats.total_balance_brl.toFixed(2)}</p>
                                    <p className="text-xs text-stone-400 mt-1">Saldo Total (BRL)</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-red-400">R$ {stats.total_withdrawn_brl.toFixed(2)}</p>
                                    <p className="text-xs text-stone-400 mt-1">Total Sacado</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-blue-400">{stats.users_with_financial_accounts}</p>
                                    <p className="text-xs text-stone-400 mt-1">Contas Financeiras</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Retroactive Conversion */}
                    <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-purple-400" />
                            Conversão Retroativa
                        </h2>
                        <p className="text-sm text-stone-300 mb-6">
                            Converte todos os pontos acumulados em saldo financeiro inicial.
                            Execute apenas UMA VEZ quando ativar a monetização pela primeira vez.
                        </p>

                        <button
                            onClick={runRetroactiveConversion}
                            disabled={!settings?.monetization_enabled}
                            className={`w-full py-4 rounded-xl font-bold transition-all ${settings?.monetization_enabled
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105'
                                    : 'bg-white/5 text-stone-500 cursor-not-allowed'
                                }`}
                        >
                            ⚡ Executar Conversão Retroativa
                        </button>

                        <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                            <p className="text-amber-200 text-xs font-medium flex items-center gap-2">
                                <AlertTriangle size={14} />
                                <strong>Atenção:</strong> Esta ação distribui saldo real para todos os usuários. Confirme antes de executar.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
