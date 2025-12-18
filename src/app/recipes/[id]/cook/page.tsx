'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, X, Clock, CheckCircle2, RotateCcw, Volume2, VolumeX, Scale } from 'lucide-react';
import { api } from '@/lib/api';
import { getRecipeById } from '@/lib/data';

// Measurement conversion utilities
const convertMeasurement = (text: string, toMetric: boolean): string => {
    const conversions: { [key: string]: { metric: string; imperial: string } } = {
        'xícara': { metric: '240ml', imperial: '1 cup' },
        'xícaras': { metric: 'x240ml', imperial: 'cups' },
        'colher (sopa)': { metric: '15ml', imperial: '1 tbsp' },
        'colher (chá)': { metric: '5ml', imperial: '1 tsp' },
        'colheres (sopa)': { metric: 'x15ml', imperial: 'tbsp' },
        'colheres (chá)': { metric: 'x5ml', imperial: 'tsp' },
    };

    let result = text;
    Object.entries(conversions).forEach(([key, value]) => {
        if (text.toLowerCase().includes(key)) {
            const replacement = toMetric ? value.metric : value.imperial;
            result = result.replace(new RegExp(key, 'gi'), `${key} (${replacement})`);
        }
    });
    return result;
};

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

    // Voice Reading State
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Measurement Conversion
    const [showMetric, setShowMetric] = useState(true);

    // Wake Lock
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return;
            try {
                const data = await api.get<any>(`/api/recipes/${id}`);
                setRecipe(data);
            } catch (error) {
                console.error("API failed, trying local data...", error);
                const localRecipe = getRecipeById(id as string);
                if (localRecipe) {
                    setRecipe(localRecipe);
                } else {
                    setRecipe({
                        id: id,
                        title: "Receita Desconhecida",
                        ingredients: ["Dados indisponíveis"],
                        instructions: [{ step: 1, text: "Não foi possível carregar os passos." }]
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
            // Play sound when timer ends
            if (typeof window !== 'undefined') {
                const audio = new Audio('/timer-end.mp3');
                audio.play().catch(() => { });
            }
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    // Voice reading effect
    useEffect(() => {
        if (voiceEnabled && recipe?.instructions?.[currentStep]?.text) {
            speakText(recipe.instructions[currentStep].text);
        }
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [currentStep, voiceEnabled]);

    // Wake Lock effect
    useEffect(() => {
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                } catch (err) {
                    console.log('Wake Lock failed:', err);
                }
            }
        };

        requestWakeLock();

        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release();
            }
        };
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = (minutes: number) => {
        setTimeLeft(minutes * 60);
        setTimerActive(true);
    };

    // Extract timer from instruction text
    const extractTimer = (text: string): number | null => {
        const match = text.match(/(\d+)\s*minutos?/i);
        return match ? parseInt(match[1]) : null;
    };

    const speakText = (text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const toggleVoice = () => {
        if (voiceEnabled) {
            window.speechSynthesis?.cancel();
            setIsSpeaking(false);
        }
        setVoiceEnabled(!voiceEnabled);
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
    if (!recipe) return null;

    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const progress = ((currentStep + 1) / instructions.length) * 100;
    const currentInstruction = instructions[currentStep];
    const detectedMinutes = currentInstruction?.timerMinutes || extractTimer(currentInstruction?.text || '');

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
                <div className="flex gap-2">
                    <button
                        onClick={toggleVoice}
                        className={`p-2 rounded-full transition-colors ${voiceEnabled ? 'bg-[var(--color-primary)] text-white' : 'bg-white/10 text-stone-400'}`}
                        title={voiceEnabled ? "Desativar voz" : "Ativar leitura por voz"}
                    >
                        {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button
                        onClick={() => setShowIngredients(!showIngredients)}
                        className={`p-2 rounded-full transition-colors ${showIngredients ? 'bg-[var(--color-primary)] text-white' : 'bg-white/10 text-stone-400'}`}
                    >
                        <span className="text-xs font-bold">Ingred.</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative">

                {/* Ingredients Overlay */}
                <div className={`absolute inset-0 bg-stone-900/95 backdrop-blur-xl z-10 transition-all duration-300 p-6 overflow-y-auto ${showIngredients ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Ingredientes</h2>
                        <button
                            onClick={() => setShowMetric(!showMetric)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-sm"
                        >
                            <Scale size={16} />
                            {showMetric ? 'Métrico' : 'Imperial'}
                        </button>
                    </div>
                    <ul className="space-y-4">
                        {ingredients.map((ing: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-lg text-stone-300 border-b border-white/10 pb-3">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                                {convertMeasurement(ing, showMetric)}
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
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-center animate-in fade-in duration-500">
                    <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase mb-4 text-sm">
                        Passo {currentStep + 1} de {instructions.length}
                    </span>

                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8 max-w-2xl">
                        {currentInstruction?.text || "Erro ao carregar passo."}
                    </h2>

                    {/* Speaking indicator */}
                    {isSpeaking && (
                        <div className="flex items-center gap-2 text-[var(--color-primary)] mb-4">
                            <Volume2 className="animate-pulse" size={20} />
                            <span className="text-sm">Lendo em voz alta...</span>
                        </div>
                    )}

                    {/* Timer - now uses detected minutes from instruction */}
                    {detectedMinutes && (
                        <div className="bg-stone-800/50 p-4 rounded-2xl flex items-center gap-4 border border-stone-700">
                            <Clock className="text-[var(--color-primary)]" />
                            <div className="text-left mr-4">
                                <div className="text-xs text-stone-400">Timer detectado</div>
                                <div className="text-xl font-bold font-mono">
                                    {timerActive ? formatTime(timeLeft) : `${detectedMinutes}:00`}
                                </div>
                            </div>
                            <button
                                onClick={timerActive ? () => setTimerActive(false) : () => startTimer(detectedMinutes)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm ${timerActive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                            >
                                {timerActive ? 'Pausar' : 'Iniciar'}
                            </button>
                            {timerActive && (
                                <button onClick={() => { setTimerActive(false); setTimeLeft(detectedMinutes * 60); }} className="p-2 text-stone-400">
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
