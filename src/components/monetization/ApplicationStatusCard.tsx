'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Ban, AlertTriangle } from 'lucide-react';

interface ApplicationStatus {
    has_application: boolean;
    status?: string;
    applied_at?: string;
    reviewed_at?: string;
    admin_notes?: string;
    rejection_reason?: string;
    can_reapply_after?: string;
    monthly_cap_brl?: number;
    payment_schedule?: string;
}

export function ApplicationStatusCard() {
    const [status, setStatus] = useState<ApplicationStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) {
                setLoading(false);
                return;
            }

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch('/api/monetization/application/status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch (err) {
            console.error('Failed to fetch status:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!status || !status.has_application) {
        return null; // No application to show
    }

    const getStatusConfig = () => {
        switch (status.status) {
            case 'pending':
            case 'under_review':
                return {
                    icon: Clock,
                    color: 'yellow',
                    title: 'Aplicação em Análise',
                    message: 'Sua aplicação está sendo revisada por nossa equipe. Isso pode levar até 30 dias.'
                };
            case 'approved':
                return {
                    icon: CheckCircle,
                    color: 'green',
                    title: 'Monetização Aprovada! 🎉',
                    message: 'Parabéns! Sua aplicação foi aprovada. Você agora pode acumular ganhos financeiros.'
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    color: 'red',
                    title: 'Aplicação Rejeitada',
                    message: 'Sua aplicação não foi aprovada desta vez. Veja os detalhes abaixo.'
                };
            case 'revoked':
                return {
                    icon: Ban,
                    color: 'red',
                    title: 'Monetização Revogada',
                    message: 'Sua monetização foi revogada devido a violações dos termos.'
                };
            default:
                return {
                    icon: AlertTriangle,
                    color: 'gray',
                    title: 'Status Desconhecido',
                    message: ''
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div className={`bg-gradient-to-br ${config.color === 'yellow' ? 'from-yellow-500/10 to-orange-500/5 border-yellow-500/30' :
                config.color === 'green' ? 'from-green-500/10 to-emerald-500/5 border-green-500/30' :
                    config.color === 'red' ? 'from-red-500/10 to-pink-500/5 border-red-500/30' :
                        'from-stone-800/50 to-stone-900/30 border-stone-700/30'
            } border rounded-3xl p-6`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${config.color === 'yellow' ? 'bg-yellow-500/20' :
                        config.color === 'green' ? 'bg-green-500/20' :
                            config.color === 'red' ? 'bg-red-500/20' :
                                'bg-stone-700/30'
                    }`}>
                    <Icon size={32} className={
                        config.color === 'yellow' ? 'text-yellow-500' :
                            config.color === 'green' ? 'text-green-500' :
                                config.color === 'red' ? 'text-red-500' :
                                    'text-stone-400'
                    } />
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-black text-white mb-2">{config.title}</h3>
                    <p className="text-sm text-stone-300 mb-4">{config.message}</p>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-stone-400">Aplicado em:</span>
                            <span className="text-white font-bold">
                                {new Date(status.applied_at!).toLocaleDateString('pt-BR')}
                            </span>
                        </div>

                        {status.reviewed_at && (
                            <div className="flex items-center justify-between">
                                <span className="text-stone-400">Revisado em:</span>
                                <span className="text-white font-bold">
                                    {new Date(status.reviewed_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        )}

                        {/* Approved Details */}
                        {status.status === 'approved' && (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="text-stone-400">Teto Mensal:</span>
                                    <span className="text-green-400 font-bold">
                                        R$ {status.monthly_cap_brl?.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-stone-400">Pagamentos:</span>
                                    <span className="text-white font-bold">
                                        {status.payment_schedule === 'quarterly' ? 'Trimestrais' : status.payment_schedule}
                                    </span>
                                </div>
                            </>
                        )}

                        {/* Rejection Details */}
                        {status.status === 'rejected' && (
                            <>
                                {status.rejection_reason && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-3">
                                        <p className="text-xs text-stone-400 mb-1">Motivo da Rejeição:</p>
                                        <p className="text-sm text-red-300">{status.rejection_reason}</p>
                                    </div>
                                )}

                                {status.can_reapply_after && (
                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-3">
                                        <p className="text-xs text-stone-400 mb-1">Pode reaplicar após:</p>
                                        <p className="text-sm text-amber-300 font-bold">
                                            {new Date(status.can_reapply_after).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Admin Notes */}
                        {status.admin_notes && (
                            <div className="bg-black/20 rounded-xl p-3 mt-3">
                                <p className="text-xs text-stone-400 mb-1">Notas do Administrador:</p>
                                <p className="text-sm text-stone-300">{status.admin_notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {status.status === 'approved' && (
                        <button
                            onClick={() => window.location.href = '/profile'}
                            className="w-full mt-4 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-colors"
                        >
                            Ver Meus Ganhos
                        </button>
                    )}

                    {status.status === 'rejected' && status.can_reapply_after && new Date(status.can_reapply_after) < new Date() && (
                        <button
                            onClick={() => window.location.href = '/monetization/eligibility'}
                            className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
                        >
                            Verificar Elegibilidade Novamente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
