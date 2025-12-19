'use client';

import { useState } from 'react';
import { AlertTriangle, Lock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [ack1, setAck1] = useState(false);
    const [ack2, setAck2] = useState(false);

    const handleSubmit = async () => {
        if (!ack1 || !ack2) {
            alert('Você deve aceitar todos os termos');
            return;
        }

        setLoading(true);

        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) {
                router.push('/login');
                return;
            }

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch('/api/monetization/apply', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    acknowledge_no_guarantee: ack1,
                    acknowledge_manual_review: ack2
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Aplicação enviada! Aguarde análise do administrador.');
                router.push('/profile');
            } else {
                alert(`❌ Erro: ${data.detail}`);
            }
        } catch (err) {
            alert('Erro ao enviar aplicação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0908] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gradient-to-br from-stone-900 to-black border border-stone-700 rounded-3xl p-8">
                <div className="text-center mb-8">
                    <div className="bg-amber-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={40} className="text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Aplicar para Monetização</h1>
                    <p className="text-stone-400">Leia atentamente antes de continuar</p>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Lock size={20} className="text-red-500" />
                            Avisos Críticos
                        </h3>
                        <ul className="space-y-2 text-sm text-stone-300">
                            <li>⚠️ Não há garantia de aprovação</li>
                            <li>⚠️ Análise pode levar até 30 dias</li>
                            <li>⚠️ Aprovação pode ser negada sem justificativa pública</li>
                            <li>⚠️ Monetização pode ser revogada a qualquer momento</li>
                            <li>⚠️ Pontos NÃO garantem dinheiro</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={ack1}
                                onChange={(e) => setAck1(e.target.checked)}
                                className="mt-1 w-5 h-5"
                            />
                            <span className="text-sm text-stone-300">
                                Eu entendo que <strong className="text-white">não há garantia de aprovação</strong> mesmo atendendo todos os critérios de elegibilidade.
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={ack2}
                                onChange={(e) => setAck2(e.target.checked)}
                                className="mt-1 w-5 h-5"
                            />
                            <span className="text-sm text-stone-300">
                                Eu entendo que a análise é <strong className="text-white">manual</strong> e pode levar até 30 dias, e que a decisão é final.
                            </span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 py-4 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!ack1 || !ack2 || loading}
                        className={`flex-1 py-4 font-bold rounded-xl transition-all ${ack1 && ack2 && !loading
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 text-black'
                                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            }`}
                    >
                        {loading ? 'Enviando...' : 'Enviar Aplicação'}
                    </button>
                </div>
            </div>
        </div>
    );
}
