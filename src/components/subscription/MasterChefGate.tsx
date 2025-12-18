'use client';

import Link from 'next/link';
import { Crown, Users, Lock, Sparkles } from 'lucide-react';

interface MasterChefGateProps {
    title?: string;
    description?: string;
}

/**
 * 🔒 MasterChefGate - Tela de bloqueio elegante
 * 
 * Exibida quando usuário sem plano Master Chef tenta criar receitas
 */
export function MasterChefGate({
    title = "Recurso Exclusivo",
    description = "Criar e publicar receitas é um recurso exclusivo do plano Master Chef."
}: MasterChefGateProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="max-w-sm w-full text-center">

                {/* Icon with Glow */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
                    <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl">
                        <Lock size={40} className="text-stone-900" />
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
                    {title}
                </h2>
                <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                    {description}
                </p>

                {/* Master Chef Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-8">
                    <Crown size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Master Chef</span>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                    <Link href="/plans" className="block">
                        <button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-900 font-bold py-4 px-8 rounded-2xl shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2">
                            <Sparkles size={18} />
                            Tornar-se Master Chef
                        </button>
                    </Link>

                    <Link href="/community" className="block">
                        <button className="w-full bg-[#1B1E22] text-stone-300 font-bold py-4 px-8 rounded-2xl border border-stone-800 hover:bg-[#24272C] transition-all flex items-center justify-center gap-2">
                            <Users size={18} />
                            Ver Comunidade
                        </button>
                    </Link>
                </div>

                {/* Benefits Preview */}
                <div className="mt-8 pt-6 border-t border-stone-800">
                    <p className="text-stone-500 text-xs mb-4 uppercase tracking-wider font-bold">Benefícios Master Chef</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {[
                            { icon: '📝', label: 'Criar' },
                            { icon: '📤', label: 'Publicar' },
                            { icon: '⭐', label: 'Destaque' },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#1B1E22] rounded-xl p-3">
                                <span className="text-xl block mb-1">{item.icon}</span>
                                <span className="text-[10px] text-stone-400 font-bold uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MasterChefGate;
