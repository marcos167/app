'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Edit, Trash2, Eye, EyeOff, Search, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';

interface Recipe {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    difficulty: string;
    time: string;
    status: 'published' | 'draft';
    author: string;
    created_at: string;
}

export default function AdminRecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            console.log('🔍 Buscando receitas...');
            console.log('🌐 API_URL:', API_URL);

            // Fetch all recipes (published + draft)
            const publishedUrl = `${API_URL}/api/recipes?status=published&limit=1000`;
            const draftUrl = `${API_URL}/api/recipes?status=draft&limit=1000`;

            console.log('📡 Fazendo requisições para:', { publishedUrl, draftUrl });

            const [publishedRes, draftRes] = await Promise.all([
                fetch(publishedUrl),
                fetch(draftUrl)
            ]);

            console.log('📡 Status das respostas:', {
                published: publishedRes.status,
                draft: draftRes.status
            });

            let publishedData = { recipes: [] };
            let draftData = { recipes: [] };

            if (publishedRes.ok) {
                publishedData = await publishedRes.json();
            } else {
                console.error('❌ Erro ao buscar publicadas:', publishedRes.status, await publishedRes.text());
            }

            if (draftRes.ok) {
                draftData = await draftRes.json();
            } else {
                console.error('❌ Erro ao buscar rascunhos:', draftRes.status, await draftRes.text());
            }

            console.log('📊 Dados recebidos:', {
                published: publishedData.recipes?.length || 0,
                draft: draftData.recipes?.length || 0,
                publishedSample: publishedData.recipes?.[0],
                draftSample: draftData.recipes?.[0]
            });

            // Combine both arrays
            const allRecipes = [
                ...(publishedData.recipes || []).map((r: any) => ({ ...r, status: 'published' })),
                ...(draftData.recipes || []).map((r: any) => ({ ...r, status: 'draft' }))
            ];

            console.log('✅ Total de receitas:', allRecipes.length);
            setRecipes(allRecipes);
        } catch (err) {
            console.error('❌ Erro ao buscar receitas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicate = async (recipeId: number) => {
        if (!confirm('Duplicar esta receita?')) return;
        setActionLoading(recipeId);
        try {
            const res = await fetch(`${API_URL}/api/recipes/${recipeId}/duplicate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                await fetchRecipes();
                alert('✅ Receita duplicada com sucesso!');
            } else {
                const error = await res.json();
                alert(`❌ Erro: ${error.detail || 'Falha ao duplicar'}`);
            }
        } catch (err) {
            alert('❌ Erro ao duplicar receita');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (recipeId: number) => {
        if (!confirm('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')) return;
        setActionLoading(recipeId);
        try {
            const res = await fetch(`${API_URL}/api/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });
            if (res.ok) {
                await fetchRecipes();
                alert('✅ Receita excluída com sucesso!');
            } else {
                const error = await res.json();
                alert(`❌ Erro: ${error.detail || 'Falha ao excluir'}`);
            }
        } catch (err) {
            alert('❌ Erro ao excluir receita');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleStatus = async (recipeId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        setActionLoading(recipeId);
        try {
            const res = await fetch(`${API_URL}/api/recipes/${recipeId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                await fetchRecipes();
                alert(`✅ Status alterado para ${newStatus === 'published' ? 'Publicado' : 'Rascunho'}!`);
            } else {
                const error = await res.json();
                alert(`❌ Erro: ${error.detail || 'Falha ao alterar status'}`);
            }
        } catch (err) {
            alert('❌ Erro ao alterar status');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredRecipes = recipes.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <span className="text-2xl">🍜</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gerenciar Receitas</h1>
                        <p className="text-stone-400 text-sm">Editar, duplicar e moderar receitas</p>
                    </div>
                </div>
                <Link href="/admin/recipes/create">
                    <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl hover:scale-105 transition-transform">
                        + Nova Receita
                    </button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar receitas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'published', 'draft'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === status
                                ? 'bg-purple-500 text-white'
                                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                                }`}
                        >
                            {status === 'all' ? 'Todas' : status === 'published' ? 'Publicadas' : 'Rascunhos'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipes Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <RefreshCw className="animate-spin text-purple-500" size={32} />
                </div>
            ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-12 text-stone-500">Nenhuma receita encontrada.</div>
            ) : (
                <div className="grid gap-4">
                    {filteredRecipes.map((recipe) => (
                        <div key={recipe.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 hover:border-stone-600 transition-colors">
                            <div className="flex gap-4">
                                {/* Image */}
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-24 h-24 rounded-xl object-cover"
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{recipe.title}</h3>
                                            <p className="text-sm text-stone-400 line-clamp-2">{recipe.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${recipe.status === 'published'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {recipe.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                                        <span>⏱️ {recipe.time}</span>
                                        <span>📊 {recipe.difficulty}</span>
                                        <span>🏷️ {recipe.category}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(recipe.id, recipe.status)}
                                            disabled={actionLoading === recipe.id}
                                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${recipe.status === 'published'
                                                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                                                }`}
                                        >
                                            {actionLoading === recipe.id ? (
                                                <RefreshCw size={12} className="animate-spin" />
                                            ) : recipe.status === 'published' ? (
                                                <EyeOff size={12} />
                                            ) : (
                                                <Eye size={12} />
                                            )}
                                            {recipe.status === 'published' ? 'Rascunho' : 'Publicar'}
                                        </button>

                                        <Link href={`/admin/recipes/edit/${recipe.id}`}>
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-bold transition-all">
                                                <Edit size={12} />
                                                Editar
                                            </button>
                                        </Link>

                                        <button
                                            onClick={() => handleDuplicate(recipe.id)}
                                            disabled={actionLoading === recipe.id}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-xs font-bold transition-all"
                                        >
                                            <Copy size={12} />
                                            Duplicar
                                        </button>

                                        <button
                                            onClick={() => handleDelete(recipe.id)}
                                            disabled={actionLoading === recipe.id}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-bold transition-all"
                                        >
                                            <Trash2 size={12} />
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
