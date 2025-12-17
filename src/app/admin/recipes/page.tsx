'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

interface Recipe {
    id: string;
    title: string;
    description?: string;
    category?: string;
    time?: string;
    difficulty?: string;
    image?: string;
    author?: { name: string };
    status?: string;
    deletedAt?: string | null;
}

export default function AdminRecipes() {
    const router = useRouter();
    const { showToast } = useToast();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showTrash, setShowTrash] = useState(false);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            // We assume API returns everything including deleted ones, or we might need a param.
            // Let's assume for now we fetch all and filter in UI, 
            // OR better, passing ?includeDeleted=true to API if we change API.
            // Given the previous step just added schema, standard GET likely returns all rows unless WHERE clause exists.
            // Let's check API later. For now, fetch.
            const res = await fetch('/api/recipes?includeDeleted=true');
            if (res.ok) {
                const data = await res.json();
                setRecipes(data);
            }
        } catch (error) {
            console.error(error);
            showToast('Erro ao carregar receitas.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleDelete = async (recipe: Recipe) => {
        const isSoftDelete = !recipe.deletedAt;

        if (isSoftDelete) {
            if (!confirm(`Mover "${recipe.title}" para a lixeira?`)) return;
        } else {
            const confirmation = prompt(`ATENÇÃO: Isso excluirá permanentemente "${recipe.title}". Digite DELETAR para confirmar.`);
            if (confirmation !== 'DELETAR') return;
        }

        try {
            // Append ?hard=true if it's already deleted (Hard Delete)
            const url = `/api/recipes/${recipe.id}${!isSoftDelete ? '?hard=true' : ''}`;
            const res = await fetch(url, { method: 'DELETE' });

            if (res.ok) {
                if (isSoftDelete) {
                    showToast('Receita movida para a lixeira.', 'success');
                    // Optimistic: set deletedAt
                    setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, deletedAt: new Date().toISOString() } : r));
                } else {
                    showToast('Receita excluída permanentemente.', 'success');
                    setRecipes(prev => prev.filter(r => r.id !== recipe.id));
                }
            } else {
                showToast('Erro ao excluir.', 'error');
            }
        } catch (e) {
            showToast('Erro na conexão.', 'error');
        }
    };

    const handleRestore = async (id: string) => {
        if (!confirm('Restaurar esta receita?')) return;
        try {
            const res = await fetch(`/api/recipes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ restore: true })
            });

            if (res.ok) {
                showToast('Receita restaurada!', 'success');
                setRecipes(prev => prev.map(r => r.id === id ? { ...r, deletedAt: null } : r));
            } else {
                showToast('Erro ao restaurar.', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Erro na conexão.', 'error');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        // Optimistic update
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

        try {
            const res = await fetch(`/api/recipes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                // Revert on failure
                setRecipes(prev => prev.map(r => r.id === id ? { ...r, status: newStatus === 'published' ? 'draft' : 'published' } : r));
                showToast('Erro ao atualizar status.', 'error');
            } else {
                showToast(newStatus === 'published' ? 'Receita publicada!' : 'Receita arquivada.', 'success');
            }
        } catch (e) {
            console.error(e);
            showToast('Erro de conexão.', 'error');
        }
    };

    // Filter logic
    const filteredRecipes = recipes.filter(r => {
        // Trash View: Show ONLY deleted
        // Normal View: Show ONLY not deleted
        if (showTrash && !r.deletedAt) return false;
        if (!showTrash && r.deletedAt) return false;

        return (
            (r.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (r.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Receitas</h1>
                    <p className="text-stone-400">
                        {showTrash ? 'Lixeira de Receitas' : 'Catálogo Ativo'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowTrash(!showTrash)}
                        className={`px-4 py-2 rounded-xl font-bold border transition-all flex items-center gap-2
                            ${showTrash
                                ? 'bg-stone-700 text-white border-stone-600'
                                : 'bg-transparent text-stone-400 border-stone-700 hover:text-white'}`}
                    >
                        {showTrash ? 'Voltar ao Catálogo' : '🗑️ Ver Lixeira'}
                    </button>
                    {!showTrash && (
                        <Link href="/admin/recipes/create">
                            <button className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
                                <span>✍️</span> Nova Receita
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#252525] border border-transparent focus:border-[var(--color-primary)] text-white text-sm rounded-lg pl-10 pr-4 py-2 outline-none transition-all placeholder:text-stone-600"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-stone-400 text-sm">
                        <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-5">Receita</th>
                                <th className="p-5">Categoria</th>
                                <th className="p-5">Autor</th>
                                <th className="p-5 text-center">Status</th>
                                <th className="p-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-stone-500">Carregando receitas...</td></tr>
                            ) : filteredRecipes.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-stone-500">Nenhuma receita encontrada.</td></tr>
                            ) : (
                                filteredRecipes.map((recipe) => (
                                    <tr key={recipe.id} className="hover:bg-[#252525] transition-colors group">
                                        <td className="p-5">
                                            <div className="font-bold text-white text-base mb-1">{recipe.title}</div>
                                            <div className="text-xs text-stone-600">ID: {recipe.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded text-xs font-medium border border-stone-700">
                                                {recipe.category || 'Geral'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-stone-400">{recipe.author?.name || 'Sistema'}</td>
                                        <td className="p-5 text-center">
                                            {recipe.deletedAt ? (
                                                <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded-full text-xs font-bold border border-red-500/20">
                                                    Excluída
                                                </span>
                                            ) : (
                                                <select
                                                    value={recipe.status || 'draft'}
                                                    onChange={(e) => handleStatusChange(recipe.id, e.target.value)}
                                                    className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer appearance-none text-center min-w-[100px] transition-colors
                                                        ${recipe.status === 'published'
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                                                            : 'bg-stone-500/10 text-stone-400 border-stone-500/20 hover:bg-stone-500/20'
                                                        }`}
                                                >
                                                    <option value="published" className="bg-[#202020] text-green-500 font-bold">Publicado</option>
                                                    <option value="draft" className="bg-[#202020] text-stone-500 font-bold">Rascunho (off)</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">

                                                {recipe.deletedAt ? (
                                                    // Trash Actions
                                                    <>
                                                        <button
                                                            onClick={() => handleRestore(recipe.id)}
                                                            title="Restaurar"
                                                            className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                                                        >
                                                            ♻️
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(recipe)}
                                                            title="Excluir Permanentemente"
                                                            className="w-8 h-8 rounded-lg bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center font-bold"
                                                        >
                                                            ✕
                                                        </button>
                                                    </>
                                                ) : (
                                                    // Active Actions
                                                    <>
                                                        <Link href={`/admin/recipes/edit/${recipe.id}`} title="Editar">
                                                            <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                                                                ✏️
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(recipe)}
                                                            title="Mover para Lixeira"
                                                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </>
                                                )}

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
