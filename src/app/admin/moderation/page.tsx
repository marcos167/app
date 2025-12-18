'use client';

import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import { useModeration, Report, ReportStatus, ModerationAction, REPORT_REASONS } from "@/contexts/ModerationContext";
import {
    Shield, AlertTriangle, Clock, CheckCircle, XCircle, Eye,
    EyeOff, Ban, UserX, MessageSquareWarning, ChevronRight,
    Filter, Search, MoreVertical
} from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pendente', color: 'yellow', icon: Clock },
    under_review: { label: 'Em Análise', color: 'blue', icon: Eye },
    approved: { label: 'Aprovado', color: 'green', icon: CheckCircle },
    rejected: { label: 'Rejeitado', color: 'stone', icon: XCircle },
    actioned: { label: 'Ação Tomada', color: 'purple', icon: Shield },
};

const ACTION_CONFIG: Record<ModerationAction, { label: string; icon: any; severity: 'low' | 'medium' | 'high' }> = {
    warn: { label: 'Advertir Usuário', icon: MessageSquareWarning, severity: 'low' },
    hide_content: { label: 'Ocultar Conteúdo', icon: EyeOff, severity: 'medium' },
    remove_content: { label: 'Remover Conteúdo', icon: XCircle, severity: 'medium' },
    suspend_user: { label: 'Suspender Usuário (7 dias)', icon: UserX, severity: 'high' },
    ban_user: { label: 'Banir Usuário', icon: Ban, severity: 'high' },
};

export default function AdminModerationPage() {
    const { reports, stats, updateReportStatus, takeAction } = useModeration();
    const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const filteredReports = reports
        .filter(r => filterStatus === 'all' || r.status === filterStatus)
        .filter(r =>
            searchQuery === '' ||
            r.contentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.authorName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleAction = (reportId: string, action: ModerationAction) => {
        takeAction(reportId, action);
        setSelectedReport(null);
    };

    return (
        <div className="min-h-screen bg-[#0E0F10] text-white">
            {/* Premium Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>

            {/* Header */}
            <div className="border-b border-stone-800 bg-[#0E0F10]/80 backdrop-blur-xl sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="text-stone-400 hover:text-white">
                                ← Admin
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <Shield size={20} className="text-red-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">Moderação</h1>
                                    <p className="text-stone-400 text-xs">Gerenciar denúncias e conteúdo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#1B1E22] rounded-2xl p-4 border border-stone-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock size={18} className="text-yellow-400" />
                            <span className="text-stone-400 text-sm">Pendentes</span>
                        </div>
                        <p className="text-3xl font-black text-yellow-400">{stats.pendingReports}</p>
                    </div>
                    <div className="bg-[#1B1E22] rounded-2xl p-4 border border-stone-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Eye size={18} className="text-blue-400" />
                            <span className="text-stone-400 text-sm">Em Análise</span>
                        </div>
                        <p className="text-3xl font-black text-blue-400">{stats.underReviewReports}</p>
                    </div>
                    <div className="bg-[#1B1E22] rounded-2xl p-4 border border-stone-800">
                        <div className="flex items-center gap-3 mb-2">
                            <EyeOff size={18} className="text-orange-400" />
                            <span className="text-stone-400 text-sm">Conteúdo Oculto</span>
                        </div>
                        <p className="text-3xl font-black text-orange-400">{stats.contentHidden}</p>
                    </div>
                    <div className="bg-[#1B1E22] rounded-2xl p-4 border border-stone-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Ban size={18} className="text-red-400" />
                            <span className="text-stone-400 text-sm">Usuários Banidos</span>
                        </div>
                        <p className="text-3xl font-black text-red-400">{stats.usersBanned}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                            <input
                                type="text"
                                placeholder="Buscar por conteúdo ou autor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1B1E22] border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-600"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'pending', 'under_review', 'actioned'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[#1B1E22] text-stone-400 border border-stone-800 hover:border-stone-600'
                                    }`}
                            >
                                {status === 'all' ? 'Todos' : STATUS_CONFIG[status].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reports List */}
                <div className="space-y-3">
                    {filteredReports.length === 0 ? (
                        <div className="bg-[#1B1E22] rounded-2xl p-12 text-center border border-stone-800">
                            <Shield size={48} className="text-stone-600 mx-auto mb-4" />
                            <h3 className="text-white font-bold mb-2">Nenhuma denúncia encontrada</h3>
                            <p className="text-stone-400 text-sm">A comunidade está limpa! 🎉</p>
                        </div>
                    ) : (
                        filteredReports.map((report) => {
                            const statusConfig = STATUS_CONFIG[report.status];
                            const StatusIcon = statusConfig.icon;
                            const reasonConfig = REPORT_REASONS.find(r => r.value === report.reason);

                            return (
                                <div
                                    key={report.id}
                                    className="bg-[#1B1E22] rounded-2xl border border-stone-800 hover:border-stone-700 transition-colors"
                                >
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Status Icon */}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${statusConfig.color}-500/20`}>
                                                <StatusIcon size={20} className={`text-${statusConfig.color}-400`} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{reasonConfig?.icon}</span>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded bg-${statusConfig.color}-500/20 text-${statusConfig.color}-400`}>
                                                        {statusConfig.label}
                                                    </span>
                                                    <span className="text-stone-500 text-xs">
                                                        {new Date(report.createdAt).toLocaleString('pt-BR')}
                                                    </span>
                                                </div>

                                                <h3 className="text-white font-bold mb-1 truncate">
                                                    {report.contentTitle || `${report.contentType} #${report.contentId}`}
                                                </h3>

                                                <p className="text-stone-400 text-sm mb-2">
                                                    <span className="text-stone-500">Autor:</span> {report.authorName} •
                                                    <span className="text-stone-500"> Motivo:</span> {reasonConfig?.label}
                                                </p>

                                                {report.description && (
                                                    <p className="text-stone-500 text-xs italic">
                                                        "{report.description}"
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {report.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateReportStatus(report.id, 'under_review')}
                                                            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-colors"
                                                        >
                                                            Analisar
                                                        </button>
                                                        <button
                                                            onClick={() => updateReportStatus(report.id, 'rejected')}
                                                            className="px-3 py-2 bg-stone-800 text-stone-400 rounded-lg text-xs font-medium hover:bg-stone-700 transition-colors"
                                                        >
                                                            Rejeitar
                                                        </button>
                                                    </>
                                                )}
                                                {report.status === 'under_review' && (
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors flex items-center gap-1"
                                                    >
                                                        Tomar Ação <ChevronRight size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Action Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1B1E22] rounded-3xl max-w-md w-full border border-stone-800 p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Tomar Ação</h2>
                        <p className="text-stone-400 text-sm mb-6">
                            Selecione a ação para: {selectedReport.contentTitle}
                        </p>

                        <div className="space-y-2 mb-6">
                            {(Object.entries(ACTION_CONFIG) as [ModerationAction, typeof ACTION_CONFIG[ModerationAction]][]).map(([action, config]) => {
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={action}
                                        onClick={() => handleAction(selectedReport.id, action)}
                                        className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all hover:scale-[1.02] ${config.severity === 'high'
                                                ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                                                : config.severity === 'medium'
                                                    ? 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
                                                    : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                                            }`}
                                    >
                                        <Icon size={20} className={
                                            config.severity === 'high' ? 'text-red-400' :
                                                config.severity === 'medium' ? 'text-orange-400' : 'text-yellow-400'
                                        } />
                                        <span className="text-white font-medium">{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setSelectedReport(null)}
                            className="w-full py-3 rounded-xl bg-stone-800 text-stone-300 font-medium hover:bg-stone-700 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
