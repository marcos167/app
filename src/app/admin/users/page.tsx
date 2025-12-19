'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Ban, Check, RefreshCw, Search, AlertTriangle, Clock, User as UserIcon, ArrowLeft, Activity } from 'lucide-react';
import { auth } from '@/lib/auth';
import Link from 'next/link';

interface UserData {
    id: number;
    email: string;
    name: string | null;
    role: 'user' | 'admin';
    disabled: boolean;
    provider: 'local' | 'google';
    created_at: string;
    last_activity?: string;
    recent_action?: string;
}

interface AuditLog {
    id: number;
    admin_id: number;
    action: string;
    target_user_id: number;
    details: string | null;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        if (auth.isAuthenticated()) {
            fetchUsers();
            fetchLogs();
        }
    }, []);

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${auth.getToken()}`,
        'Content-Type': 'application/json'
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, { headers: getAuthHeaders() });
            if (!res.ok) {
                if (res.status === 403) throw new Error('Acesso negado. Você não é administrador.');
                throw new Error('Erro ao carregar usuários');
            }
            const data = await res.json();

            // Mock recent activities (em produção, viriam do backend)
            const usersWithActivity = data.map((user: UserData) => ({
                ...user,
                last_activity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                recent_action: ['publicou uma receita', 'curtiu um post', 'comentou', 'seguiu alguém', 'salvou receita'][Math.floor(Math.random() * 5)]
            }));

            setUsers(usersWithActivity);
            setError(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/logs`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error('Erro ao carregar logs:', err);
        }
    };

    const handleBan = async (userId: number) => {
        if (!confirm('Tem certeza que deseja banir este usuário?')) return;
        setActionLoading(userId);
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ reason: 'Banido pelo painel admin' })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Erro ao banir');
            }
            await fetchUsers();
            await fetchLogs();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Erro ao banir usuário');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnban = async (userId: number) => {
        setActionLoading(userId);
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Erro ao desbanir');
            }
            await fetchUsers();
            await fetchLogs();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Erro ao desbanir usuário');
        } finally {
            setActionLoading(null);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'agora';
        if (minutes < 60) return `${minutes}min atrás`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`;
        return `${Math.floor(hours / 24)}d atrás`;
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <button className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Users size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
                        <p className="text-stone-400 text-sm">Visualizar atividades e moderar contas</p>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3">
                    <AlertTriangle className="text-red-400" size={20} />
                    <p className="text-red-300">{error}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'users'
                        ? 'bg-blue-500 text-white'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                        }`}
                >
                    <Users size={16} className="inline mr-2" />
                    Usuários ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'logs'
                        ? 'bg-blue-500 text-white'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                        }`}
                >
                    <Clock size={16} className="inline mr-2" />
                    Logs de Auditoria ({logs.length})
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por email ou nome..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    {/* Users Grid */}
                    <div className="grid gap-4">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <RefreshCw className="animate-spin text-blue-500" size={32} />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-stone-500">Nenhum usuário encontrado.</div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user.id} className={`bg-[#1A1A1A] border ${user.disabled ? 'border-red-500/30' : 'border-[#2A2A2A]'} rounded-2xl p-6 hover:border-stone-600 transition-colors`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-stone-700'}`}>
                                                {user.role === 'admin' ? (
                                                    <Shield size={20} className="text-white" />
                                                ) : (
                                                    <UserIcon size={20} className="text-stone-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white">{user.name || 'Sem nome'}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-700/50 text-stone-400'}`}>
                                                        {user.role}
                                                    </span>
                                                    {user.disabled && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">BANIDO</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-stone-400 mb-3">{user.email}</p>

                                                {/* Recent Activity */}
                                                {user.recent_action && user.last_activity && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Activity size={12} className="text-green-400" />
                                                        <span className="text-stone-500">
                                                            {user.recent_action} • {getTimeAgo(user.last_activity)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {user.role !== 'admin' && (
                                                user.disabled ? (
                                                    <button
                                                        onClick={() => handleUnban(user.id)}
                                                        disabled={actionLoading === user.id}
                                                        className="inline-flex items-center gap-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === user.id ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                                                        Desbanir
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBan(user.id)}
                                                        disabled={actionLoading === user.id}
                                                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                                    >
                                                        {actionLoading === user.id ? <RefreshCw size={14} className="animate-spin" /> : <Ban size={14} />}
                                                        Banir
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                    {logs.length === 0 ? (
                        <div className="text-center py-12 text-stone-500">
                            Nenhum log de auditoria registrado.
                        </div>
                    ) : (
                        <table className="w-full text-left text-stone-400 text-sm">
                            <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-5">Ação</th>
                                    <th className="p-5">Admin</th>
                                    <th className="p-5">Usuário Alvo</th>
                                    <th className="p-5">Detalhes</th>
                                    <th className="p-5">Data/Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A]">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-[#252525] transition-colors">
                                        <td className="p-5">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${log.action === 'ban' ? 'bg-red-500/20 text-red-400' :
                                                log.action === 'unban' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-5">#{log.admin_id}</td>
                                        <td className="p-5">#{log.target_user_id}</td>
                                        <td className="p-5 text-stone-500">{log.details || '-'}</td>
                                        <td className="p-5 font-mono text-xs">
                                            {new Date(log.created_at).toLocaleString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
