'use client';

import { useState, useEffect } from 'react';
import { Target, CheckCircle, Lock } from 'lucide-react';

interface Challenge {
    id: number;
    challenge_type: string;
    title: string;
    description: string;
    requirements: any;
    user_progress: any;
    completed: boolean;
}

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const userDataStr = localStorage.getItem('app_receitas_user');
            if (!userDataStr) {
                window.location.href = '/login';
                return;
            }

            const userData = JSON.parse(userDataStr);
            const token = userData.token;

            const res = await fetch('/api/monetization/challenges', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setChallenges(data);
            }
        } catch (err) {
            console.error('Failed to fetch challenges:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0908] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0908] pb-24">
            <div className="bg-gradient-to-b from-purple-500/10 to-transparent border-b border-purple-500/20 p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-black text-white mb-2">Desafios de Monetização</h1>
                    <p className="text-stone-400 text-sm">
                        Complete os 3 desafios para se tornar elegível à monetização
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 space-y-4">
                {challenges.map((challenge) => (
                    <div
                        key={challenge.id}
                        className={`bg-gradient-to-br ${challenge.completed
                                ? 'from-green-500/20 to-emerald-500/10 border-green-500/40'
                                : 'from-stone-800/50 to-stone-900/30 border-stone-700/30'
                            } border rounded-3xl p-6`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl ${challenge.completed ? 'bg-green-500/20' : 'bg-stone-700/30'
                                }`}>
                                {challenge.completed ? (
                                    <CheckCircle size={32} className="text-green-500" />
                                ) : (
                                    <Lock size={32} className="text-stone-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-white mb-2">{challenge.title}</h3>
                                <p className="text-sm text-stone-300 mb-4">{challenge.description}</p>

                                <div className="bg-black/20 rounded-xl p-4">
                                    <h4 className="text-sm font-bold text-white mb-2">Requisitos:</h4>
                                    <ul className="text-xs text-stone-400 space-y-1">
                                        {Object.entries(challenge.requirements).map(([key, value]) => (
                                            <li key={key}>• {key}: {JSON.stringify(value)}</li>
                                        ))}
                                    </ul>
                                </div>

                                {challenge.completed && (
                                    <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-bold">
                                        <CheckCircle size={16} />
                                        Desafio Completo!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
                    <p className="text-sm text-amber-200">
                        Complete todos os desafios + atenda os outros critérios para aplicar à monetização
                    </p>
                    <button
                        onClick={() => window.location.href = '/monetization/eligibility'}
                        className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
                    >
                        Ver Elegibilidade Completa
                    </button>
                </div>
            </div>
        </div>
    );
}
