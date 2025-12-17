'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';

export default function CookingModePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [showIngredients, setShowIngredients] = useState(false);

    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return;
            try {
                const data = await api.get<any>(`/api/recipes/${id}`);
                setRecipe(data);
            } catch (error) {
                console.error("Failed to fetch recipe", error);
                // Fallback Mock
                setRecipe({
                    id: id,
                    title: "Receita Desconhecida",
                    ingredients: ["Dados indisponíveis"],
                    instructions: [{ step: 1, text: "Não foi possível carregar os passos." }]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = (minutes: number) => {
        setTimeLeft(minutes * 60);
        setTimerActive(true);
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
    if (!recipe) return null;

    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const progress = ((currentStep + 1) / instructions.length) * 100;

    return (
        <div className="min-h-screen bg-stone-950 text-white font-sans flex flex-col relative overflow-hidden">
            {/* Minimal Header */}
            <header className="p-4 flex justify-between items-center z-20 bg-stone-900/50 backdrop-blur-md">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={24} />
                </button>
                <div className="flex-1 px-4 text-center">
                    <h1 className="text-sm font-bold opacity-70 truncate">{recipe.title}</h1>
                    <div className="w-full h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <button
                    onClick={() => setShowIngredients(!showIngredients)}
                    className={`p-2 rounded-full transition-colors ${showIngredients ? 'bg-[var(--color-primary)] text-white' : 'bg-white/10 text-stone-400'}`}
                >
                    <span className="text-xs font-bold">Ingred.</span>
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative">

                {/* Ingredients Overlay */}
                <div className={`absolute inset-0 bg-stone-900/95 backdrop-blur-xl z-10 transition-all duration-300 p-6 overflow-y-auto ${showIngredients ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                    <h2 className="text-2xl font-bold mb-6">Ingredientes</h2>
                    <ul className="space-y-4">
                        {ingredients.map((ing: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-lg text-stone-300 border-b border-white/10 pb-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                                {ing}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setShowIngredients(false)}
                        className="mt-8 w-full py-4 bg-white text-black rounded-xl font-bold"
                    >
                        Voltar para o Modo de Preparo
                    </button>
                </div>

                {/* Step Display */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-center animate-in fade-in duration-500 key={currentStep}">
                    <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase mb-4 text-sm">
                        Passo {currentStep + 1} de {instructions.length}
                    </span>

                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8 max-w-2xl">
                        {instructions[currentStep]?.text || "Erro ao carregar passo."}
                    </h2>

                    {/* Auto-detected Timer (Mock Feature) */}
                    {instructions[currentStep]?.text.toLowerCase().includes('minutos') && (
                        <div className="bg-stone-800/50 p-4 rounded-2xl flex items-center gap-4 border border-stone-700">
                            <Clock className="text-[var(--color-primary)]" />
                            <div className="text-left mr-4">
                                <div className="text-xs text-stone-400">Sugestão de Tempo</div>
                                <div className="text-xl font-bold font-mono">
                                    {timerActive ? formatTime(timeLeft) : "05:00"}
                                </div>
                            </div>
                            <button
                                onClick={timerActive ? () => setTimerActive(false) : () => startTimer(5)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${timerActive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                            >
                                {timerActive ? 'Pausar' : 'Iniciar'}
                            </button>
                            {timerActive && (
                                <button onClick={() => { setTimerActive(false); setTimeLeft(5 * 60); }} className="p-2 text-stone-400">
                                    <RotateCcw size={20} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Controls */}
                <div className="p-6 pb-12 flex items-center gap-4 justify-between max-w-md mx-auto w-full">
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-700 transition-all active:scale-95"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {currentStep === instructions.length - 1 ? (
                        <button
                            onClick={() => router.push('/feed')}
                            className="flex-1 h-16 rounded-full bg-green-500 text-black font-black text-lg flex items-center justify-center gap-2 hover:bg-green-400 transition-all active:scale-95 shadow-lg shadow-green-900/20"
                        >
                            <CheckCircle2 size={24} />
                            Concluir
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(prev => Math.min(instructions.length - 1, prev + 1))}
                            className="flex-1 h-16 rounded-full bg-[var(--color-primary)] text-white font-black text-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                        >
                            Próximo
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
