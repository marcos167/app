'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Trophy, TrendingUp, Gift, Zap, Award, Lock, CheckCircle2 } from "lucide-react";
import { PlatformPhaseIndicator } from "@/components/monetization/PlatformPhaseIndicator";

const EARNING_ACTIONS = [
    { action: 'Publicar uma Receita Completa', points: 100, icon: '📝' },
    { action: 'Postar um Reel Culinário', points: 50, icon: '🎥' },
    { action: 'Receber 10 curtidas genuínas', points: 20, icon: '❤️' },
    { action: 'Ter sua receita salva por alguém', points: 15, icon: '⭐' },
    { action: 'Login diário (streak)', points: 5, icon: '🔥' },
    { action: 'Completar perfil 100%', points: 50, icon: '✅' },
    { action: 'Primeiro seguidor', points: 25, icon: '👥' },
];

const LEVEL_BENEFITS = [
    { level: 1, label: 'Iniciante', multiplier: '1.0x', color: 'text-gray-400' },
    { level: 3, label: 'Chef Junior', multiplier: '1.2x', color: 'text-blue-400' },
    { level: 5, label: 'Chef Ouro', multiplier: '1.5x', color: 'text-amber-400' },
    { level: 7, label: 'Chef Elite', multiplier: '2.0x', color: 'text-purple-400' },
    { level: 10, label: 'Chef Supreme', multiplier: '2.5x', color: 'text-red-400' },
];

export default function HowToEarnPage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24 font-sans text-stone-300">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-12 relative z-10">
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                            <Trophy size={32} className="text-amber-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Como Ganhar no Chefex</h1>
                    <p className="text-stone-400 max-w-2xl mx-auto mb-6">
                        Transforme sua paixão culinária em impacto social e recompensas.
                        Construa sua reputação agora e esteja pronto para quando a monetização ativar.
                    </p>
                    <div className="flex justify-center">
                        <PlatformPhaseIndicator />
                    </div>
                </header>

                <div className="space-y-12 mb-12">
                    {/* Section 1: What are Contribution Points? */}
                    <section className="bg-[#1C1917] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                            <div className="bg-blue-500/10 p-2 rounded-lg">
                                <Zap size={24} className="text-blue-500" />
                            </div>
                            O que são Pontos de Contribuição?
                        </h2>
                        <p className="leading-relaxed mb-4">
                            Pontos de Contribuição medem o valor que você agrega à comunidade Chefex.
                            Cada ação positiva — publicar receitas, ajudar outros cozinheiros, gerar engajamento —
                            acumula pontos que <strong className="text-white">nunca expiram</strong>.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <p className="text-amber-200 text-sm font-medium">
                                💡 <strong>Importante:</strong> Seus pontos NÃO serão perdidos! Quando a monetização ativar,
                                eles se converterão em saldo real com multiplicadores baseados no seu nível.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: How to Earn Points */}
                    <section className="bg-[#1C1917] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="bg-green-500/10 p-2 rounded-lg">
                                <TrendingUp size={24} className="text-green-500" />
                            </div>
                            Como Ganhar Pontos
                        </h2>
                        <div className="space-y-3">
                            {EARNING_ACTIONS.map((item, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="font-medium text-white">{item.action}</span>
                                    </div>
                                    <span className="text-amber-400 font-black">+{item.points} pts</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Level System */}
                    <section className="bg-[#1C1917] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="bg-purple-500/10 p-2 rounded-lg">
                                <Award size={24} className="text-purple-500" />
                            </div>
                            Sistema de Níveis
                        </h2>
                        <p className="mb-6 leading-relaxed">
                            Conforme você acumula pontos, você sobe de nível (1-10).
                            Níveis mais altos garantem <strong className="text-white">multiplicadores maiores</strong>
                            quando a monetização financeira for ativada.
                        </p>
                        <div className="grid gap-3">
                            {LEVEL_BENEFITS.map((level) => (
                                <div key={level.level} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full ${level.color.replace('text', 'bg')}/20 flex items-center justify-center font-bold ${level.color}`}>
                                            {level.level}
                                        </div>
                                        <span className="font-bold text-white">{level.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-400">Multiplicador {level.multiplier}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 4: When Money? */}
                    <section className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-purple-500/20 rounded-3xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Lock size={24} className="text-purple-400" />
                            Quando Recebo Dinheiro?
                        </h2>
                        <p className="mb-6 leading-relaxed">
                            A monetização financeira será ativada quando o Chefex atingir marcos de sustentabilidade
                            (ex: 10.000 usuários ativos, parcerias confirmadas).
                        </p>

                        <div className="bg-white/5 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-green-400" />
                                Quando o Chefex entrar em Fase Ativa:
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>Seus pontos acumulados serão convertidos em saldo inicial</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>Multiplicadores aplicados conforme seu nível</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>Criadores fundadores terão prioridade em saques</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">✓</span>
                                    <span>Badges especiais "Pioneiro" para quem começou antes</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                            <p className="text-amber-200 text-sm font-bold">
                                🚀 Quanto antes você começar, maior será sua vantagem!
                            </p>
                        </div>
                    </section>

                    {/* Section 5: Benefits Before Money */}
                    <section className="bg-[#1C1917] border border-white/5 rounded-3xl p-8">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <div className="bg-amber-500/10 p-2 rounded-lg">
                                <Gift size={24} className="text-amber-500" />
                            </div>
                            Benefícios AGORA (Antes da Monetização)
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="font-bold text-white mb-2">🏆 Badge "Criador Fundador"</h4>
                                <p className="text-xs text-stone-400">Exclusivo para os primeiros 1000 usuários</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="font-bold text-white mb-2">⭐ Destaque no Feed</h4>
                                <p className="text-xs text-stone-400">Suas receitas aparecem primeiro</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="font-bold text-white mb-2">🔓 Acesso Antecipado</h4>
                                <p className="text-xs text-stone-400">Teste features beta antes de todos</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="font-bold text-white mb-2">🤝 Prioridade em Parcerias</h4>
                                <p className="text-xs text-stone-400">Primeiros em colaborações pagas</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="text-center pb-12">
                    <a href="/profile" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-amber-500/20">
                        Ver Meus Pontos & Impacto
                    </a>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
