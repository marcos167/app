'use client';

import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { Check, Crown, Sparkles, Star } from "lucide-react";
import { api } from "@/lib/api";

export default function PlansPage() {
    return (
        <div className="min-h-screen bg-stone-950 pb-24 font-sans text-white overflow-x-hidden">
            {/* Immersive Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--color-primary)]/20 via-transparent to-transparent blur-3xl animate-pulse-slow"></div>
            </div>

            <Navbar />

            <main className="relative z-10 px-6 pt-8 max-w-md mx-auto">

                {/* Header */}
                <div className="text-center mb-10 animate-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl shadow-lg shadow-purple-500/20 mb-4 rotate-3">
                        <Crown size={32} className="text-white" fill="currentColor" />
                    </div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">
                        Seja <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Premium</span>
                    </h1>
                    <p className="text-stone-400 font-medium">
                        Desbloqueie o potencial máximo da sua cozinha.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="space-y-6">

                    {/* Free Tier */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <h3 className="text-xl font-bold text-stone-300 mb-1">Cozinheiro</h3>
                        <div className="text-3xl font-black text-white mb-4">Grátis</div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3 text-sm text-stone-400">
                                <Check size={16} /> Acesso a receitas básicas
                            </li>
                            <li className="flex items-center gap-3 text-sm text-stone-400">
                                <Check size={16} /> Salvar favoritos
                            </li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/5 hover:bg-white/20 transition-colors">
                            Plano Atual
                        </button>
                    </div>

                    {/* Premium Tier (Featured) */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[2.2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative bg-stone-900/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 overflow-hidden">

                            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                Recomendado
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="text-yellow-400" size={20} />
                                <h3 className="text-2xl font-bold text-white">MasterChef</h3>
                            </div>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">R$ 29,90</span>
                                <span className="text-stone-500 font-medium text-sm">/mês</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Acesso ilimitado a todas as receitas",
                                    "Vídeos em 4K e modo 'Mãos Livres'",
                                    "Planejamento semanal de refeições",
                                    "Sem anúncios",
                                    "Suporte prioritário de Chefs"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-200">
                                        <div className="mt-0.5 bg-[var(--color-primary)]/20 p-1 rounded-full">
                                            <Check size={12} className="text-[var(--color-primary)]" strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={async () => {
                                    try {
                                        const res = await api.post<{ checkout_url: string }>('/api/payment/create-checkout-session');
                                        if (res.checkout_url) {
                                            window.location.href = res.checkout_url;
                                        }
                                    } catch (err) {
                                        alert("Erro ao iniciar pagamento. Verifique se você está logado.");
                                        console.error(err);
                                    }
                                }}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold text-lg shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.02] transition-all active:scale-95">
                                Assinar Agora
                            </button>

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

            <BottomNav />
        </div>
    );
}
