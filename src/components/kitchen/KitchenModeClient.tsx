'use client';

import Link from "next/link";
import { useState, useEffect, useCallback } from 'react';

interface Recipe {
    id: string;
    title: string;
    steps: string[];
}

export default function KitchenModeClient({ recipe }: { recipe: Recipe }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [timer, setTimer] = useState<number | null>(null);
    const [isListening, setIsListening] = useState(false);

    // Helpers wrapped in useCallback for Voice
    const nextStep = useCallback(() => {
        if (currentStep < recipe.steps.length - 1) setCurrentStep(s => s + 1);
    }, [currentStep, recipe.steps.length]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) setCurrentStep(s => s - 1);
    }, [currentStep]);

    const markAsDone = useCallback(() => {
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps(prev => [...prev, currentStep]);
        }
        if (currentStep < recipe.steps.length - 1) {
            setTimeout(() => setCurrentStep(s => s + 1), 500);
        }
    }, [currentStep, completedSteps, recipe.steps.length]);

    const toggleTimer = useCallback(() => {
        if (timer === null) {
            setTimer(5 * 60);
        } else {
            setTimer(null);
        }
    }, [timer]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer !== null && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (timer === 0) {
            setTimer(null);
            const audio = new Audio('/timer-done.mp3'); // Try to play sound if exists, or alert
            audio.play().catch(() => alert("⏰ O TEMPO ACABOU!"));
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Voice Recognition Logic
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) return;

        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'pt-BR';

        recognition.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            console.log("Voice Command:", transcript);

            if (transcript.includes('próximo') || transcript.includes('pular') || transcript.includes('avançar')) {
                nextStep();
            } else if (transcript.includes('voltar') || transcript.includes('anterior')) {
                prevStep();
            } else if (transcript.includes('timer') || transcript.includes('tempo')) {
                toggleTimer();
            } else if (transcript.includes('feito') || transcript.includes('concluído') || transcript.includes('ok')) {
                markAsDone();
            }
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => recognition.stop();
    }, [isListening, nextStep, prevStep, markAsDone, toggleTimer]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-stone-900 text-white font-sans transition-colors duration-500">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-stone-900/90 backdrop-blur z-50 border-b border-stone-800">
                <Link href={`/recipe/${recipe.id}`} className="text-stone-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-1">
                    ✕ <span className="hidden sm:inline">Sair</span>
                </Link>
                <span className="font-bold text-stone-300 text-sm tracking-wider uppercase">Modo Cozinha</span>
                <button
                    onClick={() => setIsListening(!isListening)}
                    className={`font-bold text-sm px-4 py-2 rounded-full transition-all flex items-center gap-2 ${isListening
                            ? 'bg-red-500/20 text-red-500 border border-red-500 animate-pulse'
                            : 'bg-orange-500/10 text-[var(--color-primary)]'
                        }`}
                >
                    {isListening ? '🔴 Ouvindo...' : '🎤 Ativar Voz'}
                </button>
            </header>

            <main className="pt-24 px-6 pb-32 max-w-2xl mx-auto min-h-screen flex flex-col justify-center">
                <h1 className="text-3xl font-bold mb-12 text-center leading-tight">{recipe.title}</h1>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-800 rounded-full">
                        <div
                            className="bg-[var(--color-primary)] w-full rounded-full transition-all duration-500"
                            style={{ height: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="pl-8 space-y-8">
                        {/* Current Step */}
                        <div className="animate-fade-in relative">
                            <span className="text-[var(--color-primary)] font-bold text-sm uppercase tracking-widest mb-2 block">
                                Passo {currentStep + 1} de {recipe.steps.length}
                            </span>
                            <p className="text-3xl md:text-4xl font-medium leading-snug text-white">
                                {recipe.steps[currentStep]}
                            </p>

                            {/* Controls */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    onClick={markAsDone}
                                    className={`px-8 py-4 rounded-full font-bold shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${completedSteps.includes(currentStep)
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-white text-black hover:bg-stone-200'
                                        }`}
                                >
                                    {completedSteps.includes(currentStep) ? 'Concluído ✓' : 'Marcar como Feito'}
                                </button>

                                <button
                                    onClick={toggleTimer}
                                    className={`px-8 py-4 rounded-full font-bold border transition-all ${timer !== null
                                            ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
                                            : 'bg-stone-800 text-white border-stone-600 hover:bg-stone-700'
                                        }`}
                                >
                                    {timer !== null ? `⏱️ ${formatTime(timer)} (Parar)` : '⏱️ Timer 5m'}
                                </button>
                            </div>

                            {/* Voice Hint */}
                            {isListening && (
                                <p className="text-xs text-stone-500 mt-4 animate-bounce">
                                    Diga "Próximo", "Voltar", "Timer" ou "Feito"...
                                </p>
                            )}
                        </div>

                        {/* Next Preview */}
                        {currentStep < recipe.steps.length - 1 && (
                            <div
                                onClick={nextStep}
                                className="opacity-30 hover:opacity-100 cursor-pointer transition-opacity mt-12 pt-12 border-t border-stone-800"
                            >
                                <span className="text-xs uppercase font-bold text-stone-500">Próximo:</span>
                                <p className="text-lg text-stone-400 truncate">{recipe.steps[currentStep + 1]}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Navigation Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center gap-6 z-40">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-2xl text-white hover:bg-stone-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ←
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStep === recipe.steps.length - 1}
                    className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-4xl text-white shadow-xl shadow-orange-900/50 hover:scale-105 transition-transform disabled:opacity-50 disabled:bg-stone-700 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    →
                </button>
            </div>
        </div>
    );
}
