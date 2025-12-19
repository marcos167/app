'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Ban, Eye, TrendingUp } from 'lucide-react';

interface Application {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    status: string;
    applied_at: string;
    eligibility_summary: {
        all_met: boolean;
        account_age: number;
        recipes: number;
        followers: number;
        executions: number;
    };
}

interface ApplicationDetail {
    id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    status: string;
    applied_at: string;
    eligibility_snapshot: any;
    reviewed_at?: string;
    admin_notes?: string;
    rejection_reason?: string;
}

export default function AdminMonetizationPanel() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedApp, setSelectedApp] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    const [approveData, setApproveData] = useState({
        monthly_cap_brl: 500,
        payment_schedule: 'quarterly',
        retention_percentage: 15,
        admin_notes: ''
    });

    const [rejectData, setRejectData] = useState({
        rejection_reason: '',
        block_reapplication_days: 30,
        admin_notes: ''
    });

    useEffect(() => {
        fetchApplications();
    }, [filter]);

    const fetchApplications = async () => {
        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) return;

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch(`/api/admin/monetization/applications?status_filter=${filter}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (appId: number) => {
        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) return;

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch(`/api/admin/monetization/applications/${appId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setSelectedApp(data);
            }
        } catch (err) {
            console.error('Failed to fetch details:', err);
        }
    };

    const handleApprove = async () => {
        if (!selectedApp) return;

        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) return;

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch(`/api/admin/monetization/applications/${selectedApp.id}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(approveData)
            });

            if (res.ok) {
                alert('✅ Aplicação aprovada!');
                setSelectedApp(null);
                fetchApplications();
            } else {
                const error = await res.json();
                alert(`❌ Erro: ${error.detail}`);
            }
        } catch (err) {
            alert('Erro ao aprovar');
        }
    };

    const handleReject = async () => {
        if (!selectedApp || !rejectData.rejection_reason) {
            alert('Motivo da rejeição é obrigatório');
            return;
        }

        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) return;

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch(`/api/admin/monetization/applications/${selectedApp.id}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rejectData)
            });

            if (res.ok) {
                alert('✅ Aplicação rejeitada');
                setSelectedApp(null);
                fetchApplications();
            } else {
                const error = await res.json();
                alert(`❌ Erro: ${error.detail}`);
            }
        } catch (err) {
            alert('Erro ao rejeitar');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0908] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0908] p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-white mb-6">Painel de Monetização - Admin</h1>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {['pending', 'approved', 'rejected', 'revoked'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl font-bold transition-colors ${filter === status
                                    ? 'bg-amber-500 text-black'
                                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Applications List */}
                <div className="grid gap-4 mb-6">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-stone-900 border border-stone-700 rounded-2xl p-6 hover:border-amber-500/50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{app.user_name}</h3>
                                    <p className="text-sm text-stone-400 mb-3">{app.user_email}</p>

                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-stone-500">Idade</p>
                                            <p className="text-white font-bold">{app.eligibility_summary.account_age}d</p>
                                        </div>
                                        <div>
                                            <p className="text-stone-500">Receitas</p>
                                            <p className="text-white font-bold">{app.eligibility_summary.recipes}</p>
                                        </div>
                                        <div>
                                            <p className="text-stone-500">Seguidores</p>
                                            <p className="text-white font-bold">{app.eligibility_summary.followers}</p>
                                        </div>
                                        <div>
                                            <p className="text-stone-500">Execuções</p>
                                            <p className="text-white font-bold">{app.eligibility_summary.executions}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold ${app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {app.status}
                                    </div>

                                    <button
                                        onClick={() => viewDetails(app.id)}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        <Eye size={16} />
                                        Revisar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {applications.length === 0 && (
                        <div className="text-center py-12 text-stone-400">
                            Nenhuma aplicação encontrada
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {selectedApp && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <div className="bg-stone-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-white">Revisar Aplicação #{selectedApp.id}</h2>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="text-stone-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* User Info */}
                                <div className="bg-stone-800 rounded-2xl p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">Usuário</h3>
                                    <p className="text-stone-300">{selectedApp.user_name}</p>
                                    <p className="text-sm text-stone-400">{selectedApp.user_email}</p>
                                </div>

                                {/* Eligibility Snapshot */}
                                <div className="bg-stone-800 rounded-2xl p-4">
                                    <h3 className="text-lg font-bold text-white mb-4">Critérios de Elegibilidade</h3>
                                    <pre className="text-xs text-stone-300 overflow-x-auto">
                                        {JSON.stringify(selectedApp.eligibility_snapshot, null, 2)}
                                    </pre>
                                </div>

                                {/* Actions */}
                                {selectedApp.status === 'pending' && (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Approve */}
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                <CheckCircle size={20} className="text-green-500" />
                                                Aprovar
                                            </h3>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm text-stone-300 block mb-1">Teto Mensal (R$)</label>
                                                    <input
                                                        type="number"
                                                        value={approveData.monthly_cap_brl}
                                                        onChange={(e) => setApproveData({ ...approveData, monthly_cap_brl: Number(e.target.value) })}
                                                        className="w-full px-3 py-2 bg-stone-900 text-white rounded-lg"
                                                        min="100"
                                                        max="5000"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm text-stone-300 block mb-1">Retenção (%)</label>
                                                    <input
                                                        type="number"
                                                        value={approveData.retention_percentage}
                                                        onChange={(e) => setApproveData({ ...approveData, retention_percentage: Number(e.target.value) })}
                                                        className="w-full px-3 py-2 bg-stone-900 text-white rounded-lg"
                                                        min="0"
                                                        max="30"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm text-stone-300 block mb-1">Notas (opcional)</label>
                                                    <textarea
                                                        value={approveData.admin_notes}
                                                        onChange={(e) => setApproveData({ ...approveData, admin_notes: e.target.value })}
                                                        className="w-full px-3 py-2 bg-stone-900 text-white rounded-lg"
                                                        rows={3}
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleApprove}
                                                    className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors"
                                                >
                                                    Aprovar Aplicação
                                                </button>
                                            </div>
                                        </div>

                                        {/* Reject */}
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                <XCircle size={20} className="text-red-500" />
                                                Rejeitar
                                            </h3>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm text-stone-300 block mb-1">Motivo *</label>
                                                    <textarea
                                                        value={rejectData.rejection_reason}
                                                        onChange={(e) => setRejectData({ ...rejectData, rejection_reason: e.target.value })}
                                                        className="w-full px-3 py-2 bg-stone-900 text-white rounded-lg"
                                                        rows={3}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm text-stone-300 block mb-1">Bloqueio (dias)</label>
                                                    <input
                                                        type="number"
                                                        value={rejectData.block_reapplication_days}
                                                        onChange={(e) => setRejectData({ ...rejectData, block_reapplication_days: Number(e.target.value) })}
                                                        className="w-full px-3 py-2 bg-stone-900 text-white rounded-lg"
                                                        min="1"
                                                        max="365"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm text-stone-300 block mb-1">Notas (opcional)</label>
                                                    <textarea
                                                        value={rejectData.admin_notes}
                                                        onChange={(e) => setRejectData({ ...rejectData, admin_notes: e.target.value })}
                                                        className="w-full px-3 py-2 bg-stone-900 text-white rounded-lg"
                                                        rows={2}
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleReject}
                                                    className="w-full py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-colors"
                                                >
                                                    Rejeitar Aplicação
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedApp.status !== 'pending' && (
                                    <div className="bg-stone-800 rounded-2xl p-4">
                                        <p className="text-stone-400">
                                            Esta aplicação já foi revisada em {new Date(selectedApp.reviewed_at!).toLocaleString('pt-BR')}
                                        </p>
                                        {selectedApp.rejection_reason && (
                                            <p className="text-red-400 mt-2">Motivo: {selectedApp.rejection_reason}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
