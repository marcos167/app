'use client';

import { useState } from 'react';

interface Props {
    onClose: () => void;
}

export default function PlansModal({ onClose }: Props) {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

    const handleSubscribe = (plan: string) => {
        // Here we would integrate with Stripe/Payment Gateway
        alert(`Iniciando assinatura do plano: ${plan}`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-6 md:p-8 text-center relative border-b border-stone-100 dark:border-stone-800">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                        ✕
                    </button>
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-white mb-2">
                        Escolha o plano ideal para você
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400">
                        Desbloqueie todo o potencial do suas receitas e cozinhe sem limites.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex justify-center mt-6">
                        <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex relative">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 ${billingCycle === 'monthly' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all z-10 flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                            >
                                Anual
                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    -25%
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">

                    {/* FREE PLAN */}
                    <div className="border border-stone-200 dark:border-stone-700 rounded-2xl p-6 flex flex-col hover:border-stone-300 transition-colors">
                        <div className="mb-4">
                            <h3 className="font-bold text-xl text-stone-700 dark:text-stone-200">Gratuito</h3>
                            <div className="mt-2 text-3xl font-bold text-stone-900 dark:text-white">
                                R$ 0,00
                            </div>
                            <p className="text-sm text-stone-400 mt-1">Para sempre</p>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-green-500 mt-0.5">✓</span>
                                Salvar até 20 receitas
                            </li>
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-stone-300 mt-0.5">✓</span>
                                <span className="text-stone-400 dark:text-stone-500">Acesso limitado a filtros</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-stone-300 mt-0.5">✓</span>
                                <span className="text-stone-400 dark:text-stone-500">Histórico simples</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-stone-300 mt-0.5">✓</span>
                                <span className="text-stone-400 dark:text-stone-500">Com anúncios</span>
                            </li>
                        </ul>
                        <button className="w-full py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                            Plano Atual
                        </button>
                    </div>

                    {/* PREMIUM PLAN (Highlight) */}
                    <div className="relative border-2 border-[var(--color-primary)] rounded-2xl p-6 flex flex-col shadow-xl shadow-orange-900/5 bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10">
                        {/* Best Value Badge if annual */}
                        {billingCycle === 'annual' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Mais Popular
                            </div>
                        )}

                        <div className="mb-4">
                            <h3 className="font-bold text-xl text-[var(--color-primary)]">Premium</h3>
                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-stone-900 dark:text-white">
                                    {billingCycle === 'annual' ? 'R$ 14,99' : 'R$ 19,90'}
                                </span>
                                <span className="text-sm text-stone-500">/mês</span>
                            </div>
                            {billingCycle === 'annual' && (
                                <p className="text-xs text-[var(--color-primary)] font-medium mt-1">
                                    Cobrado R$ 179,90 anualmente
                                </p>
                            )}
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-start gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                <span className="text-[var(--color-primary)] mt-0.5">✓</span>
                                Receitas salvas ilimitadas
                            </li>
                            <li className="flex items-start gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                <span className="text-[var(--color-primary)] mt-0.5">✓</span>
                                Filtros avançados completos
                            </li>
                            <li className="flex items-start gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                <span className="text-[var(--color-primary)] mt-0.5">✓</span>
                                Histórico completo
                            </li>
                            <li className="flex items-start gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                <span className="text-[var(--color-primary)] mt-0.5">✓</span>
                                Sem anúncios
                            </li>
                            <li className="flex items-start gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                                <span className="text-[var(--color-primary)] mt-0.5">✓</span>
                                Suporte prioritário
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSubscribe('Premium')}
                            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-500/30 active:scale-[0.98] transition-all"
                        >
                            Assinar Premium
                        </button>
                    </div>

                    {/* PRO / CHEF PLAN (Upsell) */}
                    <div className="border border-stone-200 dark:border-stone-700 rounded-2xl p-6 flex flex-col hover:border-stone-300 transition-colors opacity-75 hover:opacity-100">
                        <div className="mb-4">
                            <h3 className="font-bold text-xl text-stone-700 dark:text-stone-200">Chef</h3>
                            <div className="mt-2 text-3xl font-bold text-stone-900 dark:text-white">
                                R$ 29,90
                            </div>
                            <p className="text-sm text-stone-500 mt-1">/mês</p>
                        </div>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-purple-500 mt-0.5">✦</span>
                                Tudo do Premium
                            </li>
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-purple-500 mt-0.5">✦</span>
                                Selo Chef visível
                            </li>
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-purple-500 mt-0.5">✦</span>
                                Destaque nos comentários
                            </li>
                            <li className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
                                <span className="text-purple-500 mt-0.5">✦</span>
                                Acesso antecipado (Beta)
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSubscribe('Chef')}
                            className="w-full py-3 rounded-xl bg-stone-800 dark:bg-stone-700 text-white font-bold hover:bg-stone-900 dark:hover:bg-stone-600 transition-colors"
                        >
                            Assinar Chef
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 text-center border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 rounded-b-3xl">
                    <p className="text-xs text-stone-400">
                        A cobrança será feita automaticamente de acordo com o ciclo escolhido.
                        Você pode cancelar a qualquer momento nas configurações da sua conta.
                        <br />
                        <a href="#" className="underline hover:text-stone-500">Termos de Serviço</a> e <a href="#" className="underline hover:text-stone-500">Política de Privacidade</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
