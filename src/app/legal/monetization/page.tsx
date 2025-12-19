'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Coins, Trophy, Award, Wallet, DollarSign, ShieldAlert, Ban } from "lucide-react";

export default function MonetizationPage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24 font-sans text-stone-300">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 pt-12 relative z-10">
                <header className="mb-12 text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Coins size={32} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Política de Monetização</h1>
                    <p className="text-stone-400">Transforme sua paixão culinária em recompensas.</p>
                </header>

                <div className="space-y-10 mb-12">
                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                            Visão Geral
                        </h2>
                        <p className="leading-relaxed">
                            O Chefex permite que usuários sejam remunerados por suas atividades culinárias e contribuição social na plataforma.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                            Formas de Monetização
                        </h2>
                        <p className="mb-4">Os usuários poderão receber ganhos por:</p>
                        <ul className="space-y-3 list-disc pl-5 leading-relaxed">
                            <li>Engajamento qualificado em receitas</li>
                            <li>Conteúdo educacional</li>
                            <li>Participação em programas de incentivo</li>
                            <li>Recompensas por impacto social</li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Wallet size={20} className="text-purple-400" />
                            3. Carteira Digital (Wallet)
                        </h2>
                        <p className="leading-relaxed">
                            Os valores acumulados são registrados em uma carteira interna, <strong>não configurando pagamento imediato</strong>.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <DollarSign size={20} className="text-green-400" />
                            4. Resgate de Valores
                        </h2>
                        <ul className="space-y-3 list-disc pl-5 leading-relaxed">
                            <li>O resgate está sujeito a verificação de identidade</li>
                            <li>Pode exigir emissão de nota fiscal ou dados fiscais</li>
                            <li>Valores mínimos e prazos poderão ser definidos</li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Award size={20} className="text-amber-400" />
                            5. Retenções e Taxas
                        </h2>
                        <p className="leading-relaxed">
                            O Chefex poderá reter taxas operacionais, impostos ou valores em análise antifraude.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldAlert size={20} className="text-red-400" />
                            6. Prevenção a Fraudes
                        </h2>
                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                            <p className="text-red-200 text-sm font-medium flex items-center gap-2">
                                <Ban size={16} />
                                <strong>Importante:</strong> Atividades suspeitas poderão resultar em bloqueio temporário ou permanente de monetização.
                            </p>
                        </div>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4">7. Natureza da Remuneração</h2>
                        <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                            <p className="text-amber-200 font-medium">
                                Os ganhos <strong>não caracterizam vínculo empregatício</strong>. São recompensas por desempenho e contribuição à comunidade.
                            </p>
                        </div>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4">8. Alterações</h2>
                        <p className="leading-relaxed">
                            Esta política pode ser alterada conforme evolução do modelo de negócio e legislação vigente.
                        </p>
                    </section>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
