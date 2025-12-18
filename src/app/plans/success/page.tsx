'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Crown, PartyPopper, ArrowRight, Loader2 } from 'lucide-react';

export default function SubscriptionSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        // Simulate verification delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0E0F10] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Confirmando seu pagamento...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0E0F10] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Success Animation */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-amber-500/30">
                        <Crown size={48} className="text-white" />
                    </div>
                    <PartyPopper className="absolute top-0 left-1/4 text-amber-400 animate-pulse" size={32} />
                    <PartyPopper className="absolute top-0 right-1/4 text-orange-400 animate-pulse" size={32} style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Message */}
                <h1 className="text-4xl font-black text-white mb-4">
                    Parabéns, <span className="text-amber-400">MasterChef!</span>
                </h1>

                <p className="text-stone-400 text-lg mb-8">
                    Sua assinatura foi ativada com sucesso. Agora você tem acesso a todas as receitas exclusivas e vídeo-aulas em 4K!
                </p>

                {/* Benefits Recap */}
                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 mb-8">
                    <h3 className="text-white font-bold mb-4">O que você desbloqueou:</h3>
                    <ul className="space-y-3 text-left">
                        {[
                            'Receitas ilimitadas',
                            'Vídeo-aulas exclusivas 4K',
                            'Receitas de chefs renomados',
                            'Planejamento semanal completo',
                            'Sem anúncios'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-stone-300">
                                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <Link
                    href="/feed"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl hover:brightness-110 transition-all shadow-lg shadow-amber-500/30"
                >
                    Explorar Receitas Premium
                    <ArrowRight size={20} />
                </Link>

                <p className="mt-6 text-stone-500 text-sm">
                    Você receberá um e-mail de confirmação em breve.
                </p>
            </div>
        </div>
    );
}
