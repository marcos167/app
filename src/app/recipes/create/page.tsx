'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { ArrowLeft, Plus, X, Upload, Clock, ChefHat, BarChart3, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserCreateRecipe() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        time: '',
        difficulty: 'Médio',
        ingredients: [''],
        status: 'published', // User recipes default to published or pending? Let's say published for now
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

    const removeIngredient = (index: number) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: newIngredients });
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
                // Success animation/toast could go here
                router.push('/profile?tab=my_recipes'); // Redirect back to profile
            } else {
                alert('Erro ao criar receita. Tente novamente.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-stone-950 pb-24 selection:bg-[var(--color-primary)] selection:text-white">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 pt-6">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/profile" className="p-3 bg-white dark:bg-stone-900 rounded-full shadow-sm hover:scale-105 transition-transform text-stone-600 dark:text-stone-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-stone-800 dark:text-white tracking-tight">Nova Receita</h1>
                        <p className="text-stone-500 text-sm dark:text-stone-400">Compartilhe sua arte culinária com o mundo.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Main Card: Image & Title */}
                    <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none border border-white/50 dark:border-stone-800">

                        {/* Image Upload Area */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 ml-1">Foto do Prato</label>
                            <div className="relative group cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const form = new FormData();
                                        form.append('file', file);
                                        const res = await fetch('/api/upload', { method: 'POST', body: form });
                                        if (res.ok) {
                                            const data = await res.json();
                                            setFormData(prev => ({ ...prev, image: data.url }));
                                        }
                                    }}
                                />
                                <div className={`aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-stone-200 dark:border-stone-800 transition-all ${!formData.image ? 'hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5' : ''}`}>
                                    {formData.image ? (
                                        <div className="relative h-full w-full">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-white font-bold flex items-center gap-2"><Upload size={18} /> Alterar Foto</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-stone-400">
                                            <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                                <Upload size={24} />
                                            </div>
                                            <span className="font-bold text-sm">Clique para enviar foto</span>
                                            <span className="text-xs opacity-60">Recomendado: Horizontal</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title Input */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 ml-1">Nome da Receita</label>
                            <input
                                type="text"
                                placeholder="Ex: Risoto de Cogumelos Selvagens"
                                className="w-full text-2xl font-bold bg-transparent border-b-2 border-stone-100 dark:border-stone-800 focus:border-[var(--color-primary)] px-2 py-2 outline-none transition-colors placeholder:text-stone-300 dark:text-white"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 ml-1">Descrição / História</label>
                            <textarea
                                placeholder="Conte um pouco sobre esse prato..."
                                className="w-full bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all resize-none h-24 dark:text-stone-200"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-stone-900 p-5 rounded-[2rem] shadow-sm border border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-2 mb-3 text-[var(--color-primary)]">
                                <Clock size={18} />
                                <span className="font-bold text-xs uppercase tracking-wider">Tempo</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Ex: 40 min"
                                className="w-full font-bold text-lg bg-transparent outline-none placeholder:text-stone-300 dark:text-white"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>

                        <div className="bg-white dark:bg-stone-900 p-5 rounded-[2rem] shadow-sm border border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-2 mb-3 text-[var(--color-secondary)]">
                                <ChefHat size={18} />
                                <span className="font-bold text-xs uppercase tracking-wider">Categoria</span>
                            </div>
                            <select
                                className="w-full font-bold text-sm bg-transparent outline-none dark:text-white cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                <option value="Pratos Principais">Pratos Principais</option>
                                <option value="Sobremesas">Sobremesas</option>
                                <option value="Lanches">Lanches</option>
                                <option value="Saudáveis">Saudáveis</option>
                                <option value="Drinks">Drinks</option>
                            </select>
                        </div>

                        <div className="col-span-2 bg-white dark:bg-stone-900 p-5 rounded-[2rem] shadow-sm border border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-2 mb-3 text-[var(--color-accent)]">
                                <BarChart3 size={18} />
                                <span className="font-bold text-xs uppercase tracking-wider">Dificuldade</span>
                            </div>
                            <div className="flex gap-2">
                                {['Fácil', 'Médio', 'Difícil'].map((diff) => (
                                    <button
                                        key={diff}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: diff })}
                                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${formData.difficulty === diff
                                                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-purple-500/20'
                                                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ingredients List */}
                    <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none border border-white/50 dark:border-stone-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-stone-800 dark:text-white">Ingredientes</h3>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="w-8 h-8 flex items-center justify-center bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.ingredients.map((ing, i) => (
                                <div key={i} className="flex gap-3 group">
                                    <div className="flex-1 bg-stone-50 dark:bg-stone-800/50 rounded-xl px-4 py-3 flex items-center border border-transparent focus-within:border-[var(--color-primary)] focus-within:bg-white dark:focus-within:bg-stone-800 transition-all">
                                        <span className="text-[var(--color-primary)] font-bold text-xs mr-3 select-none">{i + 1}.</span>
                                        <input
                                            type="text"
                                            className="flex-1 bg-transparent outline-none text-sm font-medium dark:text-white placeholder:text-stone-300"
                                            placeholder="Ex: 200g de Farinha"
                                            value={ing}
                                            onChange={(e) => handleIngredientChange(i, e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(i)}
                                        className="text-stone-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 pb-12">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-5 rounded-[2rem] shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Salvando...</span>
                            ) : (
                                <>
                                    <Save size={24} /> Publicar Receita
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>

            <BottomNav />
        </div>
    );
}
