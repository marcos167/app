'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreateRecipe() {
    const [isLoading, setIsLoading] = useState(false);

    // Mock Form Data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        time: '',
        difficulty: 'Médio',
        ingredients: [''],
        status: 'draft',
        image: ''
    });

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = value;
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const addIngredient = () => {
        setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Receita criada com sucesso!');
                // Reset form or redirect
                setFormData({
                    title: '',
                    description: '',
                    category: '',
                    time: '',
                    difficulty: 'Médio',
                    ingredients: [''],
                    status: 'draft',
                    image: ''
                });
            } else {
                alert('Erro ao criar receita.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
                        <Link href="/admin/recipes" className="hover:text-white transition-colors">Receitas</Link>
                        <span>›</span>
                        <span className="text-stone-300">Nova Receita</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Criar Receita</h1>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#252525] text-stone-300 font-bold rounded-lg hover:bg-[#333] transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2 bg-[var(--color-primary)] text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Salvando...' : '💾 Salvar Receita'}
                    </button>
                </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
                        <h2 className="text-white font-bold text-lg mb-4">Informações Básicas</h2>

                        <div>
                            <label className="block text-stone-400 text-sm font-bold mb-2">Título da Receita</label>
                            <input
                                type="text"
                                className="w-full bg-[#252525] border border-stone-700 focus:border-[var(--color-primary)] text-white rounded-lg px-4 py-3 outline-none transition-colors"
                                placeholder="Ex: Bolo de Cenoura com Chocolate"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-stone-400 text-sm font-bold mb-2">Descrição Curta</label>
                            <textarea
                                className="w-full bg-[#252525] border border-stone-700 focus:border-[var(--color-primary)] text-white rounded-lg px-4 py-3 outline-none transition-colors h-24 resize-none"
                                placeholder="Uma breve descrição que aparece nos cards..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    {/* Ingredients Card */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white font-bold text-lg">Ingredientes</h2>
                            <button type="button" onClick={addIngredient} className="text-[var(--color-primary)] text-sm font-bold hover:underline">+ Adicionar Item</button>
                        </div>
                        <div className="space-y-3">
                            {formData.ingredients.map((ing, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="p-3 bg-[#252525] text-stone-500 rounded-lg font-mono text-sm select-none">::{idx + 1}</span>
                                    <input
                                        type="text"
                                        className="flex-1 bg-[#252525] border border-stone-700 focus:border-[var(--color-primary)] text-white rounded-lg px-4 py-2 outline-none transition-colors"
                                        placeholder="Ex: 2 xícaras de farinha de trigo"
                                        value={ing}
                                        onChange={(e) => handleIngredientChange(idx, e.target.value)}
                                    />
                                    <button type="button" className="p-2 text-stone-500 hover:text-red-500 transition-colors">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status & Visibility */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
                        <h2 className="text-white font-bold text-lg mb-2">Visibilidade</h2>
                        <div className="flex items-center justify-between p-3 bg-[#252525] rounded-xl border border-stone-700">
                            <span className="text-stone-300 text-sm font-medium">Status</span>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="bg-[#333] text-white text-xs font-bold px-2 py-1 rounded outline-none border border-stone-600"
                            >
                                <option value="published">Publicado</option>
                                <option value="draft">Rascunho</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                        <h2 className="text-white font-bold text-lg mb-4">Imagem de Capa</h2>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="cover-upload"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Upload logic
                                    const formData = new FormData();
                                    formData.append('file', file);

                                    try {
                                        // Show temporary loading state if needed
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formData
                                        });
                                        if (res.ok) {
                                            const data = await res.json();
                                            setFormData(prev => ({ ...prev, image: data.url })); // You'll need to add 'image' to initial state
                                        } else {
                                            alert('Erro no upload');
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert('Erro ao enviar imagem');
                                    }
                                }}
                            />

                            {/* Preview or Placeholder */}
                            {/* Note: We need to add 'image' to formData state definition first! */}
                            <label
                                htmlFor="cover-upload"
                                className={`border-2 border-dashed border-stone-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center hover:bg-[#252525] transition-all cursor-pointer group overflow-hidden relative ${
                                    // @ts-ignore - Assuming image field exists
                                    formData.image ? 'border-none p-0 h-64' : ''
                                    }`}
                            >
                                {/* @ts-ignore */}
                                {formData.image ? (
                                    <>
                                        {/* @ts-ignore */}
                                        <img src={formData.image} alt="Capa" className="w-full h-full object-cover rounded-xl" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <p className="text-white font-bold">Alterar Imagem</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-[#333] group-hover:bg-[#444] flex items-center justify-center text-2xl transition-colors">
                                            📸
                                        </div>
                                        <div>
                                            <p className="text-stone-300 font-bold text-sm">Clique para upload</p>
                                            <p className="text-stone-600 text-xs mt-1">PNG, JPG até 5MB</p>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
                        <h2 className="text-white font-bold text-lg mb-2">Detalhes</h2>

                        <div>
                            <label className="block text-stone-400 text-xs font-bold mb-1 uppercase">Categoria</label>
                            <select
                                className="w-full bg-[#252525] border border-stone-700 text-white rounded-lg px-3 py-2 outline-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                <option value="Pratos Brasileiros">Pratos Brasileiros</option>
                                <option value="Sobremesas">Sobremesas</option>
                                <option value="Saudáveis">Saudáveis</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-stone-400 text-xs font-bold mb-1 uppercase">Tempo de Preparo</label>
                            <input
                                type="text"
                                placeholder="Ex: 45 min"
                                className="w-full bg-[#252525] border border-stone-700 text-white rounded-lg px-3 py-2 outline-none"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-stone-400 text-xs font-bold mb-1 uppercase">Dificuldade</label>
                            <div className="flex gap-2">
                                {['Fácil', 'Médio', 'Difícil'].map(diff => (
                                    <button
                                        key={diff}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: diff })}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${formData.difficulty === diff
                                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                                            : 'border-stone-700 text-stone-400 hover:border-stone-500'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
