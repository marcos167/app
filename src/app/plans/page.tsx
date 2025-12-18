'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { Crown, Check, Star, Zap, Video, Lock, ChefHat, ArrowRight, Loader2, X } from 'lucide-react';
import { auth } from '@/lib/auth';

const FEATURES_FREE = [
    'Acesso a 10 receitas por dia',
    'Modo de cozinha básico',
    'Lista de compras',
    'Salvos limitados',
];

const FEATURES_MASTERCHEF = [
    'Receitas ilimitadas',
    'Vídeo-aulas exclusivas 4K',
    'Modo de cozinha avançado',
    'Planejamento semanal completo',
    'Receitas de chefs renomados',
    'Suporte prioritário',
    'Sem anúncios',
    'Acesso antecipado a novidades',
];

export default function PlansPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [currentPlan, setCurrentPlan] = useState('free');
    const [showCanceled, setShowCanceled] = useState(false);

    useEffect(() => {
        if (searchParams.get('canceled') === 'true') {
            setShowCanceled(true);
        }

        const fetchStatus = async () => {
            const token = auth.getToken();
            if (!token) return;

            try {
                const res = await fetch('/api/subscription-status', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setCurrentPlan(data.plan_tier);
                }
            } catch (e) {
                console.error('Failed to fetch subscription status');
            }
        };
        fetchStatus();
    }, [searchParams]);

    const handleSubscribe = async () => {
        const token = auth.getToken();
        if (!token) {
            router.push('/login?redirect=/plans');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Erro ao criar sessão de pagamento');
            }

            const data = await res.json();
            window.location.href = data.checkout_url;
        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        const token = auth.getToken();
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                window.location.href = data.portal_url;
            }
        } catch (error) {
            console.error('Failed to create portal session');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0E0F10] font-sans pb-24">
            <Navbar />

            <main className="max-w-lg mx-auto px-4 pt-6">
                {showCanceled && (
                    <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <X className="text-amber-500" size={20} />
                        <p className="text-amber-200 text-sm">Pagamento cancelado. Tente novamente quando quiser.</p>
                        <button onClick={() => setShowCanceled(false)} className="ml-auto text-amber-500">
                            <X size={16} />
                        </button>
                    </div>
                )}

                <header className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Crown size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">
                        Seja um <span className="text-amber-400">MasterChef</span>
                    </h1>
                    <p className="text-stone-400">Desbloqueie todo o potencial do Chefex</p>
                </header>

                <div className="space-y-4">
                    {/* Free Plan */}
                    <div className={`border rounded-2xl p-5 ${currentPlan === 'free' ? 'border-stone-600 bg-stone-900/50' : 'border-stone-800 bg-stone-900/30'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">Plano Grátis</h3>
                                <p className="text-stone-500 text-sm">Recursos básicos</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-white">R$ 0</span>
                                <span className="text-stone-500">/mês</span>
                            </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                            {FEATURES_FREE.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-stone-400 text-sm">
                                    <Check size={16} className="text-stone-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        {currentPlan === 'free' && (
                            <div className="py-2 text-center text-stone-500 text-sm font-medium">Plano atual</div>
                        )}
                    </div>

                    {/* MasterChef Plan */}
                    <div className="relative border-2 border-amber-500/50 rounded-2xl p-5 bg-gradient-to-br from-amber-900/20 to-orange-900/20 overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                            MAIS POPULAR
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                    <ChefHat size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">MasterChef</h3>
                                    <p className="text-amber-400/70 text-sm">Acesso completo</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-amber-400">R$ 19,90</span>
                                <span className="text-stone-400">/mês</span>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-6">
                            {FEATURES_MASTERCHEF.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-stone-200 text-sm">
                                    <Star size={14} className="text-amber-400 fill-current" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {currentPlan === 'masterchef' ? (
                            <button onClick={handleManageSubscription} disabled={loading}
                                className="w-full py-4 bg-stone-800 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Gerenciar Assinatura'}
                            </button>
                        ) : (
                            <button onClick={handleSubscribe} disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-amber-500/30">
                                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                    <>
                                        <Zap size={20} />
                                        Assinar Agora
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="flex items-center justify-center gap-4 text-stone-500 text-xs">
                        <div className="flex items-center gap-1"><Lock size={14} />Pagamento seguro</div>
                        <div>•</div>
                        <div>Cancele quando quiser</div>
                        <div>•</div>
                        <div>Garantia de 7 dias</div>
                    </div>
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}
