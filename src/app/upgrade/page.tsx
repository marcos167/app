'use client';

import { useState } from 'react';
import { Crown, Check, Sparkles, ArrowRight, Star, Trophy, Medal, Zap, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/SubscriptionContext';

const BENEFITS = [
    { icon: '✏️', text: 'Criar receitas ilimitadas' },
    { icon: '🏆', text: 'Aparecer no ranking da comunidade' },
    { icon: '⭐', text: 'Receber avaliações e feedback' },
    { icon: '🎖️', text: 'Selos exclusivos de Master Chef' },
    { icon: '✨', text: 'Destaque no perfil' },
];

export default function UpgradePage() {
    const router = useRouter();
    const { upgradeToMaster, plan } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Already Master Chef
    if (plan === 'master') {
        router.push('/profile');
        return null;
    }

    const handleUpgrade = async () => {
        setIsLoading(true);
        const success = await upgradeToMaster();
        setIsLoading(false);

        if (success) {
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/profile');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#0E0F10] text-white overflow-hidden relative">
            {/* Premium Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,200,50,0.15),transparent_60%)] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(255,200,50,0.1),transparent_50%)] pointer-events-none z-0" />

            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-pulse" />
                <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-amber-400/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute bottom-40 left-20 w-1 h-1 bg-yellow-300/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-60 right-10 w-2 h-2 bg-amber-300/30 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/profile" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                    <span className="text-sm font-medium">Voltar</span>
                </Link>
            </div>

            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">

                {/* Success State */}
                {showSuccess ? (
                    <div className="text-center animate-in zoom-in-50 fade-in duration-500">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <Check size={48} className="text-stone-900" strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl font-black mb-3">Bem-vindo, Master Chef!</h1>
                        <p className="text-stone-400">Redirecionando para seu perfil...</p>
                    </div>
                ) : (
                    <>
                        {/* Crown Icon */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-3xl opacity-30 animate-pulse" />
                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
                                <Crown size={56} className="text-stone-900" fill="currentColor" />
                            </div>
                            {/* Sparkles */}
                            <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
                            <Star className="absolute -bottom-1 -left-3 text-amber-400 animate-pulse" size={20} style={{ animationDelay: '0.5s' }} />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black text-center mb-4 leading-tight">
                            Torne-se um{' '}
                            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                                Master Chef
                            </span>
                            {' '}no Chefex
                        </h1>

                        {/* Subtitle */}
                        <p className="text-stone-400 text-center text-lg max-w-md mb-10">
                            Crie, publique e tenha suas receitas reconhecidas pela comunidade.
                        </p>

                        {/* Benefits */}
                        <div className="w-full max-w-sm space-y-4 mb-10">
                            {BENEFITS.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 bg-[#1B1E22]/80 backdrop-blur-sm border border-stone-800/50 rounded-2xl p-4 animate-in fade-in slide-in-from-left-4"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-500/20 flex items-center justify-center text-xl">
                                        {benefit.icon}
                                    </div>
                                    <span className="text-white font-medium">{benefit.text}</span>
                                    <Check size={18} className="text-green-400 ml-auto" />
                                </div>
                            ))}
                        </div>

                        {/* Price Badge */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-baseline gap-1 mb-2">
                                <span className="text-stone-500 text-sm line-through">R$ 29,90</span>
                                <span className="text-yellow-400 text-4xl font-black">R$ 19,90</span>
                                <span className="text-stone-400 text-sm">/mês</span>
                            </div>
                            <p className="text-green-400 text-sm font-medium flex items-center justify-center gap-1">
                                <Zap size={14} />
                                7 dias grátis para experimentar
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="w-full max-w-sm space-y-3">
                            {/* Primary CTA */}
                            <button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-900 font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Crown size={22} />
                                        Quero ser Master Chef
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            {/* Secondary CTA */}
                            <Link href="/community" className="block">
                                <button className="w-full py-4 rounded-2xl bg-transparent border border-stone-700 text-stone-400 font-medium hover:bg-stone-800/50 hover:text-white hover:border-stone-600 transition-all">
                                    Continuar explorando
                                </button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 mt-10 text-stone-500 text-xs">
                            <div className="flex items-center gap-1.5">
                                <Shield size={14} />
                                <span>Pagamento seguro</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <RefreshCcw size={14} />
                                <span>Cancele quando quiser</span>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

// Icons for trust badges
function Shield({ size, className }: { size: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

function RefreshCcw({ size, className }: { size: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    );
}
