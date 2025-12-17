'use client';

import { useState, useEffect } from 'react';

export default function AdminComments() {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const res = await fetch('/api/comments');
            const data = await res.json();
            if (Array.isArray(data)) {
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to fetch comments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Optimistic update
                setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Erro ao atualizar status');
        }
    };

    const deleteComment = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setComments(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete comment', error);
            alert('Erro ao excluir comentário');
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-stone-500">
                Carregando comentários...
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Comentários</h1>
            <p className="text-stone-400">Moderação de comentários e avaliações.</p>

            {/* Comment Table */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-stone-400 text-sm">
                        <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-5">Usuário</th>
                                <th className="p-5">Receita</th>
                                <th className="p-5">Comentário</th>
                                <th className="p-5">Data</th>
                                <th className="p-5 text-center">Status</th>
                                <th className="p-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {comments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-stone-600">
                                        Nenhum comentário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                comments.map((comment) => (
                                    <tr key={comment.id} className="hover:bg-[#252525] transition-colors group">
                                        <td className="p-5 font-bold text-white">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={comment.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + comment.userId}
                                                    className="w-8 h-8 rounded-full bg-stone-800"
                                                    alt=""
                                                />
                                                {comment.user?.name || 'Usuário'}
                                            </div>
                                        </td>
                                        <td className="p-5 text-[var(--color-primary)]">{comment.recipe?.title || 'Receita Desconhecida'}</td>
                                        <td className="p-5 max-w-xs truncate" title={comment.content}>
                                            {comment.content}
                                        </td>
                                        <td className="p-5 text-xs text-stone-600">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${comment.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                comment.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                {comment.status === 'approved' ? 'Aprovado' :
                                                    comment.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {comment.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(comment.id, 'approved')}
                                                            title="Aprovar"
                                                            className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center">
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(comment.id, 'rejected')}
                                                            title="Rejeitar"
                                                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                                            ✕
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    title="Excluir"
                                                    className="w-8 h-8 rounded-lg text-stone-600 hover:text-stone-300 transition-all flex items-center justify-center">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
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
