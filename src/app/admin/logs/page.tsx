'use client';

import { useState, useEffect } from 'react';

interface AdminLog {
    id: string;
    action: string;
    details: string;
    ip: string | null;
    createdAt: string;
    user: {
        name: string;
        image: string | null;
        email: string;
    };
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/logs')
            .then(res => res.json())
            .then(data => {
                setLogs(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const formatAction = (action: string) => {
        // Beautify action badges
        const colors: Record<string, string> = {
            'CREATE_RECIPE': 'bg-green-500/20 text-green-400',
            'UPDATE_RECIPE': 'bg-blue-500/20 text-blue-400',
            'DELETE_RECIPE': 'bg-red-500/20 text-red-400',
            'BAN_USER': 'bg-purple-500/20 text-purple-400',
            'UPDATE_USER_ROLE': 'bg-yellow-500/20 text-yellow-400',
            'DELETE_USER': 'bg-red-500/20 text-red-400',
        };
        const colorClass = colors[action] || 'bg-stone-700 text-stone-300';
        return (
            <span className={`px-2 py-1 rounded-md text-xs font-bold ${colorClass}`}>
                {action.replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Logs do Sistema</h1>
                    <p className="text-stone-400">Rastreamento de atividades administrativas.</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-stone-400 text-sm">
                        <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-5">Data/Hora</th>
                                <th className="p-5">Usuário (Admin)</th>
                                <th className="p-5">Ação</th>
                                <th className="p-5">Detalhes</th>
                                <th className="p-5">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center">Carregando logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center">Nenhum log encontrado.</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-[#252525] transition-colors">
                                        <td className="p-5 font-mono text-xs">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-700 overflow-hidden">
                                                    {log.user.image ? (
                                                        <img src={log.user.image} alt={log.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white font-bold">{log.user.name?.[0]}</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white text-xs">{log.user.name}</span>
                                                    <span className="text-[10px] text-stone-500">{log.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">{formatAction(log.action)}</td>
                                        <td className="p-5">
                                            <code className="bg-black/30 px-2 py-1 rounded text-xs text-stone-300 break-all block max-w-xs md:max-w-md">
                                                {log.details}
                                            </code>
                                        </td>
                                        <td className="p-5 text-xs text-stone-500">{log.ip || 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
