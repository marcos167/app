'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle, Clock, Activity, Zap } from 'lucide-react';

interface DashboardStats {
    users: { total: number; active_today: number; new_this_week: number };
    recipes: { total: number; published: number; pending_moderation: number };
    monetization: { pending_applications: number; approved_users: number; total_payouts: number };
    system: { uptime: string; api_health: string; db_health: string };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch real stats from API
        fetchStats();

        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            // TODO: Implement real API call
            // For now, mock data
            setStats({
                users: { total: 8432, active_today: 1247, new_this_week: 156 },
                recipes: { total: 1284, published: 1266, pending_moderation: 18 },
                monetization: { pending_applications: 3, approved_users: 12, total_payouts: 4250.50 },
                system: { uptime: '99.9%', api_health: 'healthy', db_health: 'healthy' }
            });
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Dashboard Administrativo</h1>
                    <p className="text-stone-400">Visão geral completa do Chefex</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/recipes/create">
                        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
                            ✍️ Nova Receita
                        </button>
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl transition-colors"
                    >
                        🔄 Atualizar
                    </button>
                </div>
            </div>

            {/* System Health Bar */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-bold">Sistema Operacional</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-green-400" />
                            <span className="text-stone-300">API: <strong className="text-green-400">{stats?.system.api_health}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-green-400" />
                            <span className="text-stone-300">DB: <strong className="text-green-400">{stats?.system.db_health}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-400" />
                            <span className="text-stone-300">Uptime: <strong className="text-green-400">{stats?.system.uptime}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Users */}
                <Link href="/admin/users">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-3xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-500/20 p-3 rounded-2xl">
                                <Users size={24} className="text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-stone-400 uppercase font-bold">Usuários</p>
                                <p className="text-2xl font-black text-white">{stats?.users.total.toLocaleString('pt-BR')}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Ativos hoje</span>
                                <span className="text-blue-400 font-bold">{stats?.users.active_today}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Novos (7d)</span>
                                <span className="text-green-400 font-bold">+{stats?.users.new_this_week}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Recipes */}
                <Link href="/admin/recipes">
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-3xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-500/20 p-3 rounded-2xl">
                                <span className="text-2xl">🍜</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-stone-400 uppercase font-bold">Receitas</p>
                                <p className="text-2xl font-black text-white">{stats?.recipes.total.toLocaleString('pt-BR')}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Publicadas</span>
                                <span className="text-green-400 font-bold">{stats?.recipes.published}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Moderação</span>
                                <span className="text-orange-400 font-bold">{stats?.recipes.pending_moderation}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Monetization */}
                <Link href="/admin/monetization-review">
                    <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-3xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-amber-500/20 p-3 rounded-2xl">
                                <DollarSign size={24} className="text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-stone-400 uppercase font-bold">Monetização</p>
                                <p className="text-2xl font-black text-white">{stats?.monetization.approved_users}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Pendentes</span>
                                <span className="text-yellow-400 font-bold">{stats?.monetization.pending_applications}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Pagamentos</span>
                                <span className="text-green-400 font-bold">R$ {stats?.monetization.total_payouts.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Moderation */}
                <Link href="/admin/moderation">
                    <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-3xl p-6 hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-500/20 p-3 rounded-2xl">
                                <AlertTriangle size={24} className="text-red-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-stone-400 uppercase font-bold">Moderação</p>
                                <p className="text-2xl font-black text-white">{stats?.recipes.pending_moderation}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Ação necessária</span>
                                <span className="text-red-400 font-bold">Revisar</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/monetization-review">
                    <div className="bg-[#1A1A1A] border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-500/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                                <DollarSign size={32} className="text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Revisar Aplicações</h3>
                                <p className="text-sm text-stone-400">{stats?.monetization.pending_applications} aplicações aguardando</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/moderation">
                    <div className="bg-[#1A1A1A] border border-red-500/30 rounded-2xl p-6 hover:border-red-500 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-500/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Moderar Conteúdo</h3>
                                <p className="text-sm text-stone-400">{stats?.recipes.pending_moderation} itens pendentes</p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/users">
                    <div className="bg-[#1A1A1A] border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                                <Users size={32} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Gerenciar Usuários</h3>
                                <p className="text-sm text-stone-400">{stats?.users.active_today} ativos hoje</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Atividade Recente</h3>
                        <Link href="/admin/logs">
                            <button className="text-amber-500 text-sm font-bold hover:underline">Ver todos</button>
                        </Link>
                    </div>
                    <div className="p-6 space-y-4">
                        {[
                            { user: 'Ana Julia', action: 'publicou uma receita', time: '2 min atrás', icon: '✅', color: 'green' },
                            { user: 'Carlos M.', action: 'aplicou para monetização', time: '15 min atrás', icon: '💰', color: 'yellow' },
                            { user: 'Mariana S.', action: 'reportou conteúdo', time: '1h atrás', icon: '⚠️', color: 'red' },
                            { user: 'Pedro L.', action: 'criou nova conta', time: '2h atrás', icon: '👤', color: 'blue' },
                        ].map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-[#252525] rounded-xl hover:bg-[#2A2A2A] transition-colors">
                                <span className="text-2xl">{activity.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">
                                        <strong>{activity.user}</strong> {activity.action}
                                    </p>
                                    <p className="text-xs text-stone-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Logs */}
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Logs do Sistema</h3>
                        <Link href="/admin/logs">
                            <button className="text-amber-500 text-sm font-bold hover:underline">Ver completo</button>
                        </Link>
                    </div>
                    <div className="p-6 space-y-3 font-mono text-xs">
                        {[
                            { level: 'INFO', message: 'Database backup completed successfully', time: '01:29' },
                            { level: 'WARN', message: 'High memory usage detected (85%)', time: '01:15' },
                            { level: 'INFO', message: 'Monetization application #127 approved', time: '00:45' },
                            { level: 'ERROR', message: 'Failed to send email notification', time: '00:30' },
                        ].map((log, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-2 bg-[#252525] rounded-lg">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                                    log.level === 'WARN' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-green-500/20 text-green-400'
                                    }`}>
                                    {log.level}
                                </span>
                                <div className="flex-1">
                                    <p className="text-stone-300">{log.message}</p>
                                    <p className="text-stone-600 text-[10px] mt-1">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Engajamento dos Últimos 7 Dias</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                    {[65, 78, 56, 89, 45, 92, 73].map((height, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-lg hover:opacity-80 transition-opacity relative group" style={{ height: `${height}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {height * 10} usuários
                                </div>
                            </div>
                            <span className="text-xs text-stone-500 font-mono">
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][idx]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
