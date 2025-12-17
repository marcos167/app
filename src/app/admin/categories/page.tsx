'use client';

import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    icon?: string;
    isActive: boolean;
    _count?: { recipes: number };
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', icon: '' });
    const [isSaving, setIsSaving] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to load categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });
            if (res.ok) {
                setShowModal(false);
                setNewCategory({ name: '', icon: '' });
                fetchCategories();
                alert('Categoria criada com sucesso!');
            } else {
                alert('Erro ao criar categoria.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (category: Category) => {
        // Optimistic update
        const updatedStatus = !category.isActive;
        setCategories(prev => prev.map(c => c.id === category.id ? { ...c, isActive: updatedStatus } : c));

        try {
            await fetch(`/api/categories/${category.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: updatedStatus })
            });
        } catch (e) {
            console.error(e);
            // Revert on error would go here
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir esta categoria permanentemente?')) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== id));
            } else {
                alert('Erro ao excluir (verifique se não há receitas vinculadas).');
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Categorias</h1>
                    <p className="text-stone-400">Gerencie as categorias exibidas no app.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
                >
                    <span>➕</span> Nova Categoria
                </button>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-stone-400 text-sm">
                        <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-5">Ícone</th>
                                <th className="p-5">Nome</th>
                                <th className="p-5 text-center">Receitas Vinculadas</th>
                                <th className="p-5 text-center">Status</th>
                                <th className="p-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-8 text-center">Carregando...</td></tr>
                            ) : categories.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center">Nenhuma categoria encontrada.</td></tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-[#252525] transition-colors group">
                                        <td className="p-5 text-2xl">{cat.icon || '📦'}</td>
                                        <td className="p-5 font-bold text-white text-base">{cat.name}</td>
                                        <td className="p-5 text-center font-mono">{cat._count?.recipes || 0}</td>
                                        <td className="p-5 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(cat)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${cat.isActive
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-stone-500/10 text-stone-400 border-stone-500/20'
                                                    }`}
                                            >
                                                {cat.isActive ? 'Ativa' : 'Inativa'}
                                            </button>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                >
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

            {/* Create Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1E1E1E] border border-[#333] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                        <h2 className="text-xl font-bold text-white mb-4">Nova Categoria</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-stone-400 text-sm font-bold mb-2">Nome</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full bg-[#252525] border border-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:border-[var(--color-primary)]"
                                    placeholder="Ex: Massas"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-stone-400 text-sm font-bold mb-2">Ícone (Emoji)</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#252525] border border-stone-700 text-white rounded-lg px-4 py-2 outline-none focus:border-[var(--color-primary)]"
                                    placeholder="Ex: 🍝"
                                    maxLength={2}
                                    value={newCategory.icon}
                                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-stone-400 font-bold hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-[var(--color-primary)] text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? 'Salvando...' : 'Criar Categoria'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
