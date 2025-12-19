'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ChefHat, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/auth';

interface AIRecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecipeGenerated?: (recipe: any) => void;
}

export default function AIRecipeModal({ isOpen, onClose, onRecipeGenerated }: AIRecipeModalProps) {
    const [ingredients, setIngredients] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const handleGenerate = async () => {
        if (!ingredients.trim()) {
            alert('Por favor, adicione alguns ingredientes');
            return;
        }

        setLoading(true);
        try {
            const token = auth.getToken();
            const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);

            const res = await fetch(`${API_URL}/api/ai/generate-recipe`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ingredients: ingredientList,
                    cuisine: cuisine || null,
                    difficulty: difficulty || null
                })
            });

            const data = await res.json();

            if (data.success && data.recipe) {
                setGeneratedRecipe(data.recipe);
                if (onRecipeGenerated) {
                    onRecipeGenerated(data.recipe);
                }
            } else {
                alert(data.error || 'Erro ao gerar receita');
            }
        } catch (err) {
            console.error('Failed to generate recipe:', err);
            alert('Erro ao gerar receita');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setIngredients('');
        setCuisine('');
        setDifficulty('');
        setGeneratedRecipe(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Assistente de Receitas IA</h2>
                                    <p className="text-xs text-stone-500">Powered by GPT-4</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-stone-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {!generatedRecipe ? (
                                <>
                                    {/* Input Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-white mb-2">
                                                Ingredientes disponíveis *
                                            </label>
                                            <textarea
                                                value={ingredients}
                                                onChange={(e) => setIngredients(e.target.value)}
                                                placeholder="Ex: frango, arroz, tomate, cebola, alho..."
                                                className="w-full bg-[#252525] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm resize-none"
                                                rows={3}
                                            />
                                            <p className="text-xs text-stone-600 mt-1">Separe os ingredientes por vírgula</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-white mb-2">
                                                    Tipo de Culinária
                                                </label>
                                                <select
                                                    value={cuisine}
                                                    onChange={(e) => setCuisine(e.target.value)}
                                                    className="w-full bg-[#252525] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm"
                                                >
                                                    <option value="">Qualquer</option>
                                                    <option value="Brasileira">Brasileira</option>
                                                    <option value="Italiana">Italiana</option>
                                                    <option value="Japonesa">Japonesa</option>
                                                    <option value="Mexicana">Mexicana</option>
                                                    <option value="Francesa">Francesa</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-white mb-2">
                                                    Dificuldade
                                                </label>
                                                <select
                                                    value={difficulty}
                                                    onChange={(e) => setDifficulty(e.target.value)}
                                                    className="w-full bg-[#252525] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm"
                                                >
                                                    <option value="">Qualquer</option>
                                                    <option value="Fácil">Fácil</option>
                                                    <option value="Médio">Médio</option>
                                                    <option value="Difícil">Difícil</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generate Button */}
                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Gerando receita mágica...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} />
                                                Gerar Receita com IA
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* Generated Recipe */}
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                                            <h3 className="text-2xl font-bold text-white mb-2">{generatedRecipe.title}</h3>
                                            <p className="text-stone-400 text-sm mb-3">{generatedRecipe.description}</p>
                                            <div className="flex gap-4 text-xs text-stone-500">
                                                <span>⏱️ {generatedRecipe.time}</span>
                                                <span>👨‍🍳 {generatedRecipe.difficulty}</span>
                                                <span>🍽️ {generatedRecipe.servings} porções</span>
                                            </div>
                                        </div>

                                        {/* Ingredients */}
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-2">Ingredientes:</h4>
                                            <ul className="space-y-1">
                                                {generatedRecipe.ingredients.map((ing: any, index: number) => (
                                                    <li key={index} className="text-sm text-stone-400">
                                                        • {ing.quantity} {ing.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Steps */}
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-2">Modo de Preparo:</h4>
                                            <ol className="space-y-2">
                                                {generatedRecipe.steps.map((step: string, index: number) => (
                                                    <li key={index} className="text-sm text-stone-400">
                                                        <span className="font-bold text-white">{index + 1}.</span> {step}
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>

                                        {/* Tips */}
                                        {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-bold text-white mb-2">💡 Dicas:</h4>
                                                <ul className="space-y-1">
                                                    {generatedRecipe.tips.map((tip: string, index: number) => (
                                                        <li key={index} className="text-sm text-stone-400">
                                                            • {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleReset}
                                                className="flex-1 bg-stone-800 hover:bg-stone-700 text-white font-bold py-2 rounded-xl transition-colors"
                                            >
                                                Gerar Outra
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold py-2 rounded-xl transition-colors"
                                            >
                                                Usar Esta Receita
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
