'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import {
    ArrowLeft, ChefHat, Clock, Users, Flame, Plus, Trash2,
    Image as ImageIcon, Upload, Loader2, Check
} from "lucide-react";
import Link from 'next/link';

interface Ingredient {
    id: string;
    text: string;
}

interface Step {
    id: string;
    text: string;
    timer?: number;
}

const categories = [
    'Café da Manhã', 'Almoço', 'Jantar', 'Sobremesas', 'Lanches',
    'Bebidas', 'Saladas', 'Sopas', 'Massas', 'Carnes', 'Peixes',
    'Vegano', 'Vegetariano', 'Low Carb', 'Fitness'
];

const difficulties = ['Fácil', 'Médio', 'Difícil'];

export default function CreateRecipePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [time, setTime] = useState('');
    const [servings, setServings] = useState('');
    const [difficulty, setDifficulty] = useState('Fácil');
    const [category, setCategory] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: '1', text: '' }
    ]);
    const [steps, setSteps] = useState<Step[]>([
        { id: '1', text: '' }
    ]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { id: Date.now().toString(), text: '' }]);
    };

    const removeIngredient = (id: string) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter(i => i.id !== id));
        }
    };

    const updateIngredient = (id: string, text: string) => {
        setIngredients(ingredients.map(i => i.id === id ? { ...i, text } : i));
    };

    const addStep = () => {
        setSteps([...steps, { id: Date.now().toString(), text: '' }]);
    };

    const removeStep = (id: string) => {
        if (steps.length > 1) {
            setSteps(steps.filter(s => s.id !== id));
        }
    };

    const updateStep = (id: string, text: string) => {
        setSteps(steps.map(s => s.id === id ? { ...s, text } : s));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.push('/login');
                return;
            }

            // Prepare data
            const recipeData = {
                title,
                description,
                image: image || '/brand/logo-icon-final.png',
                time: time ? `${time} min` : '30 min',
                servings: servings ? `${servings} porções` : '4 porções',
                difficulty,
                category,
                ingredients: ingredients.filter(i => i.text.trim()).map(i => i.text),
                instructions: steps.filter(s => s.text.trim()).map((s, idx) => ({
                    step: idx + 1,
                    text: s.text,
                    timerMinutes: s.timer || null
                })),
                tags: [category, difficulty].filter(Boolean),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(recipeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao criar receita');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/feed');
            }, 1500);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Receita Criada!</h2>
                    <p className="text-stone-400">Redirecionando para o feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>

            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#0C0A09]/90 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <h1 className="text-lg font-bold text-white">Nova Receita</h1>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !title.trim()}
                        className="px-4 py-2 bg-green-500 hover:bg-green-400 disabled:bg-stone-700 disabled:text-stone-500 rounded-xl text-white font-bold text-sm transition-colors"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Publicar'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Error */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {/* Image Upload */}
                <div className="relative">
                    <label className="block">
                        <div
                            className={`aspect-video rounded-2xl border-2 border-dashed ${image ? 'border-transparent' : 'border-stone-700 hover:border-stone-600'
                                } flex items-center justify-center cursor-pointer overflow-hidden transition-colors`}
                        >
                            {image ? (
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-8">
                                    <ImageIcon size={48} className="text-stone-600 mx-auto mb-4" />
                                    <p className="text-stone-400 font-medium">Adicionar foto da receita</p>
                                    <p className="text-stone-500 text-sm mt-1">Clique ou arraste uma imagem</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Title */}
                <div>
                    <input
                        type="text"
                        placeholder="Nome da receita *"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/50 text-lg font-medium"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <textarea
                        placeholder="Descrição da receita..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/50 resize-none"
                    />
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#1C1917] border border-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-stone-400 text-xs mb-2">
                            <Clock size={14} />
                            <span>Tempo</span>
                        </div>
                        <input
                            type="number"
                            placeholder="30"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-transparent text-white font-bold focus:outline-none"
                        />
                        <span className="text-stone-500 text-xs">minutos</span>
                    </div>
                    <div className="bg-[#1C1917] border border-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-stone-400 text-xs mb-2">
                            <Users size={14} />
                            <span>Porções</span>
                        </div>
                        <input
                            type="number"
                            placeholder="4"
                            value={servings}
                            onChange={(e) => setServings(e.target.value)}
                            className="w-full bg-transparent text-white font-bold focus:outline-none"
                        />
                        <span className="text-stone-500 text-xs">pessoas</span>
                    </div>
                    <div className="bg-[#1C1917] border border-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-stone-400 text-xs mb-2">
                            <Flame size={14} />
                            <span>Dificuldade</span>
                        </div>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                        >
                            {difficulties.map(d => (
                                <option key={d} value={d} className="bg-[#1C1917]">{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-stone-400 text-sm mb-2">Categoria</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/5 text-stone-400 hover:bg-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ingredients */}
                <div>
                    <label className="block text-white font-bold mb-3">Ingredientes</label>
                    <div className="space-y-2">
                        {ingredients.map((ingredient, idx) => (
                            <div key={ingredient.id} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`Ingrediente ${idx + 1}`}
                                    value={ingredient.text}
                                    onChange={(e) => updateIngredient(ingredient.id, e.target.value)}
                                    className="flex-1 bg-[#1C1917] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/50"
                                />
                                {ingredients.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(ingredient.id)}
                                        className="p-2.5 text-stone-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="mt-2 flex items-center gap-2 text-green-500 hover:text-green-400 text-sm font-medium"
                    >
                        <Plus size={16} />
                        Adicionar ingrediente
                    </button>
                </div>

                {/* Steps */}
                <div>
                    <label className="block text-white font-bold mb-3">Modo de Preparo</label>
                    <div className="space-y-3">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-2">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        placeholder={`Passo ${idx + 1}`}
                                        value={step.text}
                                        onChange={(e) => updateStep(step.id, e.target.value)}
                                        rows={2}
                                        className="w-full bg-[#1C1917] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-green-500/50 resize-none"
                                    />
                                </div>
                                {steps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(step.id)}
                                        className="p-2.5 text-stone-500 hover:text-red-400 transition-colors self-start mt-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addStep}
                        className="mt-2 flex items-center gap-2 text-green-500 hover:text-green-400 text-sm font-medium"
                    >
                        <Plus size={16} />
                        Adicionar passo
                    </button>
                </div>
            </form>

            <BottomNavigation />
        </div>
    );
}
