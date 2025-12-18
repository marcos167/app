'use client';

import Link from 'next/link';
import { Crown, Sparkles, CheckCircle } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

/**
 * 📊 PlanStatusCard - Exibe status do plano no perfil
 */
export function PlanStatusCard() {
    const { plan, planName, status, endDate, canCreate } = useSubscription();

    const isMasterChef = plan === 'master' && (status === 'active' || status === 'cancelled');
    const isCancelled = status === 'cancelled';

    if (isMasterChef) {
        // Card para Master Chef
        return (
            <Link href="/plans" className="block mt-6 group">
                <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                    <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-[calc(1.5rem-1px)] p-5 overflow-hidden">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl blur-lg opacity-60" />
                                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center shadow-xl">
                                        <Crown size={26} className="text-stone-900" fill="currentColor" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-amber-100 font-semibold text-xs tracking-widest uppercase mb-0.5">Seu Plano</p>
                                    <p className="text-white font-black text-lg tracking-tight">{planName}</p>
                                    <p className="text-stone-400 text-xs font-medium">
                                        {isCancelled ? 'Cancelado' : 'Ativo'} até {endDate?.toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-2 rounded-xl text-xs font-bold border border-green-500/30">
                                <CheckCircle size={14} />
                                Ativo
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Card para Free - CTA de upgrade
    return (
        <Link href="/plans" className="block mt-6 group">
            <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-[calc(1.5rem-1px)] p-5 overflow-hidden">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {/* Gold Particles */}
                    <div className="absolute top-2 right-4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
                    <div className="absolute top-6 right-8 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-ping" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl blur-lg opacity-60" />
                                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center shadow-xl">
                                    <Crown size={26} className="text-stone-900" fill="currentColor" />
                                </div>
                            </div>
                            <div>
                                <p className="text-amber-100 font-semibold text-xs tracking-widest uppercase mb-0.5">Seu Plano</p>
                                <p className="text-white font-black text-lg tracking-tight">{planName}</p>
                                <p className="text-stone-400 text-xs font-medium">Acesso básico</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-900 px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 group-hover:scale-105 transition-all">
                                <Sparkles size={14} />
                                <span>Upgrade</span>
                            </div>
                            <span className="text-stone-500 text-[10px] font-medium">7 dias grátis</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PlanStatusCard;
