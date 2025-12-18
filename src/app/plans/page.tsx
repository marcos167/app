'use client';

import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Check, Crown, Sparkles, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useRouter } from 'next/navigation';

export default function PlansPage() {
    const router = useRouter();
    const {
        plan,
        planName,
        status,
        endDate,
        isLoading,
        upgradeToMaster,
        cancelSubscription
    } = useSubscription();

    const [upgrading, setUpgrading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const isMasterChef = plan === 'master' && (status === 'active' || status === 'cancelled');
    const isCancelled = status === 'cancelled';

    const handleUpgrade = async () => {
        setUpgrading(true);
        setMessage(null);

        const result = await upgradeToMaster();

        setUpgrading(false);
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });

        if (result.success) {
            // Redirecionar após 2 segundos
            setTimeout(() => {
                router.push('/profile?tab=my_recipes');
            }, 2000);
        }
    };

    const handleCancel = async () => {
        const result = await cancelSubscription();
        setShowCancelModal(false);
        setMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        });
    };

    return (
        <div className="min-h-screen bg-[#0E0F10] pb-24 font-sans text-white overflow-x-hidden">
            {/* Premium Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#1A1D20_0%,transparent_60%)]"></div>
            </div>

            <Navbar />

            <main className="relative z-10 px-6 pt-8 max-w-md mx-auto">

                {/* Feedback Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success'
                            ? 'bg-green-500/20 border border-green-500/30'
                            : 'bg-red-500/20 border border-red-500/30'
                        }`}>
                        {message.type === 'success'
                            ? <CheckCircle2 className="text-green-400" size={20} />
                            : <AlertCircle className="text-red-400" size={20} />
                        }
                        <span className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                            {message.text}
                        </span>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-10 animate-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl shadow-lg shadow-purple-500/20 mb-4 rotate-3">
                        <Crown size={32} className="text-white" fill="currentColor" />
                    </div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">
                        {isMasterChef ? 'Você é ' : 'Seja '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            Master Chef
                        </span>
                    </h1>
                    <p className="text-stone-400 font-medium">
                        {isMasterChef
                            ? 'Aproveite todos os benefícios exclusivos!'
                            : 'Desbloqueie o potencial máximo da sua cozinha.'
                        }
                    </p>
                </div>

                {/* Current Plan Status (if Master Chef) */}
                {isMasterChef && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Crown className="text-yellow-400" size={24} />
                                <div>
                                    <p className="text-white font-bold">Master Chef</p>
                                    <p className="text-stone-400 text-xs">
                                        {isCancelled ? 'Cancelado' : 'Ativo'} até {endDate?.toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            {!isCancelled && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="text-stone-400 text-xs underline hover:text-white"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="space-y-6">

                    {/* Free Tier */}
                    <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 relative transition-all duration-500 ${!isMasterChef ? 'ring-2 ring-stone-600' : 'grayscale opacity-60'
                        }`}>
                        <h3 className="text-xl font-bold text-stone-300 mb-1">Cozinheiro</h3>
                        <div className="text-3xl font-black text-white mb-4">Grátis</div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3 text-sm text-stone-400">
                                <Check size={16} /> Acesso a receitas básicas
                            </li>
                            <li className="flex items-center gap-3 text-sm text-stone-400">
                                <Check size={16} /> Salvar favoritos
                            </li>
                            <li className="flex items-center gap-3 text-sm text-stone-400">
                                <Check size={16} /> Interagir na comunidade
                            </li>
                        </ul>
                        <button
                            className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/5"
                            disabled
                        >
                            {!isMasterChef ? 'Plano Atual' : 'Plano Básico'}
                        </button>
                    </div>

                    {/* Premium Tier (Featured) */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[2.2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className={`relative bg-stone-900/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 overflow-hidden ${isMasterChef ? 'ring-2 ring-yellow-500' : ''
                            }`}>

                            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                {isMasterChef ? 'Seu Plano' : 'Recomendado'}
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="text-yellow-400" size={20} />
                                <h3 className="text-2xl font-bold text-white">Master Chef</h3>
                            </div>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">R$ 29,90</span>
                                <span className="text-stone-500 font-medium text-sm">/mês</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "✅ Criar e publicar receitas",
                                    "✅ Acesso ilimitado a todas as receitas",
                                    "✅ Vídeos em 4K e modo 'Mãos Livres'",
                                    "✅ Badge Master Chef na comunidade",
                                    "✅ Suporte prioritário de Chefs"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-200">
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {isMasterChef ? (
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl bg-yellow-500/20 text-yellow-400 font-bold text-lg border border-yellow-500/30"
                                >
                                    <Crown className="inline mr-2" size={18} /> Você é Master Chef
                                </button>
                            ) : (
                                <button
                                    onClick={handleUpgrade}
                                    disabled={upgrading || isLoading}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold text-lg shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {upgrading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} />
                                            Assinar Agora
                                        </>
                                    )}
                                </button>
                            )}

                            <p className="text-center text-[10px] text-stone-500 mt-4 uppercase tracking-wider">
                                7 dias grátis • Cancele quando quiser
                            </p>
                        </div>
                    </div>

                </div>

                {/* Trust Signals */}
                <div className="mt-12 mb-8 text-center">
                    <div className="flex justify-center -space-x-3 mb-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-stone-950 bg-stone-800 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <p className="text-stone-400 text-xs">
                        Junte-se a <span className="text-white font-bold">+10.000</span> chefs caseiros felizes.
                    </p>
                </div>

            </main>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-[#1B1E22] rounded-3xl p-6 max-w-sm w-full border border-stone-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Cancelar assinatura?</h3>
                            <button onClick={() => setShowCancelModal(false)} className="text-stone-400">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-stone-400 text-sm mb-6">
                            Você continuará tendo acesso até <strong>{endDate?.toLocaleDateString('pt-BR')}</strong>.
                            Após essa data, voltará ao plano Cozinheiro.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3 rounded-xl bg-stone-800 text-white font-bold"
                            >
                                Manter
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-bold border border-red-500/30"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNavigation />
        </div>
    );
}
