'use client';

import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { Clock, Trash2, X, Calendar } from "lucide-react";
import { useState } from "react";
import Link from 'next/link';

// Mock Data
const INITIAL_HISTORY = [
    { id: 1, title: 'Lasanha Bolonhesa', time: '14:30', date: 'Hoje', image: '🥘', category: 'Massas' },
    { id: 2, title: 'Bolo de Cenoura', time: '09:15', date: 'Hoje', image: '🍰', category: 'Sobremesas' },
    { id: 3, title: 'Suco Verde Detox', time: 'Ontem', date: 'Ontem', image: '🥤', category: 'Bebidas' },
    { id: 4, title: 'Risoto de Camarão', time: '12/12', date: '12 Dez', image: '🍤', category: 'Jantar' },
];

export default function HistoryPage() {
    const [history, setHistory] = useState(INITIAL_HISTORY);

    const removeId = (id: number) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const clearAll = () => {
        if (confirm('Tem certeza que deseja apagar todo o histórico?')) {
            setHistory([]);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-stone-950 pb-24 font-sans overflow-hidden">
            {/* Immersive Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <Navbar />

            <main className="max-w-md mx-auto px-5 pt-6 relative z-10 min-h-[80vh]">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className="text-3xl font-black text-stone-800 dark:text-white tracking-tight flex items-center gap-2">
                            Histórico <Clock size={24} className="text-[var(--color-primary)] opacity-50" />
                        </h1>
                        <p className="text-stone-500 text-sm dark:text-stone-400">Suas últimas aventuras culinárias.</p>
                    </div>

                    {history.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-xs font-bold text-stone-500 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                        >
                            <Trash2 size={14} className="group-hover:animate-bounce" />
                            <span className="hidden sm:inline">Limpar</span>
                        </button>
                    )}
                </div>

                {/* Timeline List */}
                <div className="relative space-y-6">
                    {/* Vertical Line */}
                    {history.length > 0 && (
                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[var(--color-primary)]/20 to-transparent"></div>
                    )}

                    {history.length > 0 ? (
                        history.map((item, index) => (
                            <div
                                key={item.id}
                                style={{ animationDelay: `${index * 100}ms` }}
                                className="relative flex items-center gap-4 animate-in slide-in-from-right-8 fade-in fill-mode-backwards duration-500"
                            >
                                {/* Timeline Dot */}
                                <div className="w-12 h-12 shrink-0 z-10 flex items-center justify-center bg-white dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 rounded-2xl shadow-sm text-2xl relative group cursor-pointer hover:scale-110 transition-transform hover:border-[var(--color-primary)]">
                                    {item.image}
                                    <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-grow bg-white/60 dark:bg-stone-900/60 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/50 dark:border-stone-800 shadow-sm hover:shadow-lg transition-all group flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-wider">{item.category}</span>
                                            <span className="text-[10px] font-bold text-stone-400 flex items-center gap-1">
                                                <Calendar size={10} /> {item.date} • {item.time}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-stone-800 dark:text-white leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                                            {item.title}
                                        </h4>
                                    </div>

                                    <button
                                        onClick={() => removeId(item.id)}
                                        className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                                        title="Remover"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-50 duration-500">
                            <div className="w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mb-6">
                                <Clock size={40} className="text-stone-300 dark:text-stone-700" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-2">Nada por aqui...</h3>
                            <p className="text-stone-500 max-w-[200px]">Você ainda não visualizou nenhuma receita recentemente.</p>
                            <Link href="/feed" className="mt-6 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm shadow-xl shadow-purple-500/20 hover:scale-105 transition-transform">
                                Explorar Receitas
                            </Link>
                        </div>
                    )}
                </div>

            </main>
            <BottomNav />
        </div>
    );
}
