'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Heart, Clock, Users, Flame, ChefHat, CheckCircle2, Share2, PlayCircle, Lock, Crown, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { LoadingState, ErrorState } from '@/components/ui';
import { api } from '@/lib/api';
import { getRecipeById } from '@/lib/data';

export default function RecipeDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    // States
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [recipe, setRecipe] = useState<any>(null);
    const [addedToList, setAddedToList] = useState(false);

    // Mock User Premium Status (In real app, comes from AuthContext)
    // Change this to true to test unlocked view
    const isUserPremium = false;

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return;
            try {
                const data = await api.get<any>(`/api/recipes/${id}`);
                setRecipe(data);
                setError(false);
            } catch (error) {
                console.error("API failed, trying local data...", error);
                // Fallback: try local data directly
                const localRecipe = getRecipeById(id as string);
                if (localRecipe) {
                    console.log("Using local recipe data");
                    setRecipe(localRecipe);
                    setError(false);
                } else {
                    console.error("Recipe not found in local data either");
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const toggleIngredient = (ing: string) => {
        const next = new Set(checkedIngredients);
        if (next.has(ing)) next.delete(ing);
        else next.add(ing);
        setCheckedIngredients(next);
    };

    const addToShoppingList = () => {
        if (!recipe || ingredientsList.length === 0) return;

        const existingList = JSON.parse(localStorage.getItem('shoppingList') || '[]');
        const newItems = ingredientsList.map((ing: string) => ({
            id: crypto.randomUUID(),
            name: ing,
            recipeTitle: recipe.title,
            addedAt: new Date().toISOString(),
            checked: false,
            price: 0
        }));

        localStorage.setItem('shoppingList', JSON.stringify([...existingList, ...newItems]));
        setAddedToList(true);

        // Reset after 3 seconds
        setTimeout(() => setAddedToList(false), 3000);
    };

    // Loading State Premium
    if (loading) {
        return (
            <div className="min-h-screen bg-stone-950 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingState title="Carregando receita..." size="lg" />
                </div>
                <BottomNavigation />
            </div>
        );
    }

    // Error State Premium
    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-stone-950 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center px-6">
                    <ErrorState
                        title="Receita não encontrada"
                        description="Não foi possível carregar esta receita. Verifique sua conexão."
                        action={{
                            label: 'Tentar novamente',
                            onClick: () => window.location.reload()
                        }}
                    />
                </div>
                <BottomNavigation />
            </div>
        );
    }

    // Parse ingredients/instructions if they are strings (from DB they might be)
    // For MVP we just handle the mock structure or simple array
    const ingredientsList = Array.isArray(recipe.ingredients) ? recipe.ingredients : ["Ingrediente 1", "Ingrediente 2 (Dados reais em breve)"];
    const instructionsList = Array.isArray(recipe.instructions) ? recipe.instructions : [{ step: 1, text: "Instrução vinda do banco de dados em breve." }];

    const isLocked = recipe.is_premium && !isUserPremium;

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-stone-950 font-sans pb-24 selection:bg-[var(--color-primary)] selection:text-white">

            {/* Immersive Hero Image */}
            <div className="fixed top-0 left-0 w-full h-[55vh] z-0">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>

                <div className="absolute top-0 left-0 w-full p-4 pt-6 flex justify-between items-center z-10">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/10 active:scale-95"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/10 active:scale-95">
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={() => setIsSaved(!isSaved)}
                            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all border border-white/10 active:scale-95 ${isSaved ? 'bg-[var(--color-primary)] text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                        >
                            <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>

                {/* Hero Content or Lock Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {isLocked ? (
                        <div className="text-center pointer-events-auto bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 animate-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/40">
                                <Lock size={32} className="text-white" />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-1">Conteúdo Premium</h3>
                            <p className="text-stone-300 text-sm mb-4 max-w-[200px] mx-auto">Esta receita é exclusiva para assinantes MasterChef.</p>
                            <Link href="/plans" className="inline-flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-stone-200 transition-colors">
                                <Crown size={16} className="text-[var(--color-primary)]" />
                                Desbloquear
                            </Link>
                        </div>
                    ) : (
                        recipe.video_url && (
                            <a href={recipe.video_url} target="_blank" rel="noreferrer" className="pointer-events-auto w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer border border-white/30 group">
                                <PlayCircle size={48} fill="white" className="opacity-90 group-hover:opacity-100" />
                            </a>
                        )
                    )}
                </div>
            </div>

            {/* Scrollable Content Sheet */}
            <div className={`relative z-10 mt-[45vh] bg-[#FDFCF5] dark:bg-stone-950 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] min-h-screen overflow-hidden ${isLocked ? 'blur-sm select-none pointer-events-none opacity-50' : ''}`}>

                {/* Handle Bar */}
                <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full opacity-50"></div>
                </div>

                <div className="px-6 pt-4 pb-8">
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            {recipe.is_premium && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-[10px] font-bold uppercase tracking-wider mb-2 shadow-sm">
                                    <Crown size={10} /> Premium
                                </span>
                            )}
                            <h1 className="text-2xl font-black text-stone-800 dark:text-white leading-tight mb-2">
                                {recipe.title}
                            </h1>
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-400 text-sm">★</span>
                                <span className="text-stone-800 dark:text-white font-bold text-sm">{recipe.rating || 4.5}</span>
                                <span className="text-stone-400 text-xs">({recipe.reviews || 0} avaliações)</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-between items-center py-4 border-y border-stone-100 dark:border-stone-800 mb-6">
                        <div className="flex flex-col items-center gap-1 flex-1 border-r border-stone-100 dark:border-stone-800">
                            <Clock size={20} className="text-stone-400" />
                            <span className="font-bold text-stone-700 dark:text-stone-200 text-sm">{recipe.time}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 flex-1 border-r border-stone-100 dark:border-stone-800">
                            <Flame size={20} className="text-stone-400" />
                            <span className="font-bold text-stone-700 dark:text-stone-200 text-sm">{recipe.calories}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <Users size={20} className="text-stone-400" />
                            <span className="font-bold text-stone-700 dark:text-stone-200 text-sm">{recipe.servings} p.</span>
                        </div>
                    </div>

                    {/* Liquid Tabs */}
                    <div className="bg-stone-100 dark:bg-stone-900 p-1 rounded-2xl flex mb-6 relative">
                        <div className={`absolute top-1 bottom-1 w-1/2 bg-white dark:bg-stone-800 rounded-xl shadow-sm transition-all duration-300 ${activeTab === 'ingredients' ? 'left-1' : 'left-1/2 ml-[-4px]'}`} style={{ width: 'calc(50% - 4px)', left: activeTab === 'ingredients' ? '4px' : 'calc(50%)' }}></div>
                        <button onClick={() => setActiveTab('ingredients')} className={`flex-1 relative z-10 py-3 text-sm font-bold transition-colors text-center ${activeTab === 'ingredients' ? 'text-[var(--color-primary)]' : 'text-stone-400'}`}>Ingredientes</button>
                        <button onClick={() => setActiveTab('instructions')} className={`flex-1 relative z-10 py-3 text-sm font-bold transition-colors text-center ${activeTab === 'instructions' ? 'text-[var(--color-primary)]' : 'text-stone-400'}`}>Modo de Preparo</button>
                    </div>

                    {/* Content Section */}
                    <div className="min-h-[300px]">
                        {activeTab === 'ingredients' ? (
                            <div className="space-y-3">
                                {ingredientsList.map((ing: string, i: number) => (
                                    <div key={i} onClick={() => toggleIngredient(ing)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${checkedIngredients.has(ing) ? 'bg-stone-50 dark:bg-stone-900/50 border-stone-100 dark:border-stone-800 opacity-60' : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 shadow-sm'}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${checkedIngredients.has(ing) ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-stone-300'}`}>
                                            {checkedIngredients.has(ing) && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-sm font-medium ${checkedIngredients.has(ing) ? 'text-stone-400 line-through' : 'text-stone-700 dark:text-stone-200'}`}>{ing}</span>
                                    </div>
                                ))}

                                {/* Add to Shopping List Button */}
                                <button
                                    onClick={addToShoppingList}
                                    disabled={addedToList}
                                    className={`w-full mt-4 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${addedToList
                                        ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/20'
                                        }`}
                                >
                                    {addedToList ? (
                                        <><CheckCircle2 size={18} /> Adicionado à Lista!</>
                                    ) : (
                                        <><ShoppingCart size={18} /> Adicionar à Lista de Compras</>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {instructionsList.map((inst: any, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{inst.step}</div>
                                        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-100 dark:border-stone-800 flex-1">{inst.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!isLocked && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <Link href={`/recipes/${id}/cook`}>
                        <button className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-purple-500/30 transition-all active:scale-95">
                            <ChefHat size={20} />
                            <span>Começar a Cozinhar</span>
                        </button>
                    </Link>
                </div>
            )}

            <BottomNavigation />
        </div>
    );
}
