'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Scale, ShieldCheck, AlertOctagon, FileText, Users, Ban } from "lucide-react";

export default function TermsOfUsePage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24 font-sans text-stone-300">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 pt-12 relative z-10">
                <header className="mb-12 text-center">
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Scale size={32} className="text-amber-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Termos de Uso</h1>
                    <p className="text-stone-400">Chefex — Plataforma de Culinária Social</p>
                </header>

                <div className="space-y-10 mb-12 prose prose-invert max-w-none">
                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                            Aceitação dos Termos
                        </h2>
                        <p className="leading-relaxed">
                            Ao acessar ou utilizar o aplicativo <strong>Chefex</strong>, o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde, não deverá utilizar a plataforma.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                            Descrição do Serviço
                        </h2>
                        <p className="leading-relaxed">
                            O Chefex é uma plataforma digital de compartilhamento de receitas, interação social e monetização por atividades culinárias, permitindo que usuários criem, publiquem, compartilhem e interajam com conteúdos gastronômicos.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                            Cadastro e Conta
                        </h2>
                        <ul className="space-y-3 leading-relaxed list-disc pl-5">
                            <li>O usuário é responsável pelas informações fornecidas no cadastro.</li>
                            <li>É proibida a criação de contas falsas ou o uso indevido de identidade.</li>
                            <li>Contas podem ser suspensas ou excluídas em caso de violação destes termos.</li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                            Conteúdo do Usuário
                        </h2>
                        <ul className="space-y-3 leading-relaxed list-disc pl-5">
                            <li>O usuário mantém a titularidade do conteúdo publicado.</li>
                            <li>Ao publicar, concede ao Chefex licença não exclusiva para exibição, distribuição e promoção dentro da plataforma.</li>
                            <li>Conteúdos ilegais, ofensivos, plagiados ou fraudulentos serão removidos.</li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                            Moderação e Penalidades
                        </h2>
                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-4">
                            <p className="text-red-200 text-sm font-medium flex items-center gap-2">
                                <Ban size={16} />
                                <strong>Importante:</strong> O Chefex reserva-se o direito de moderar conteúdos, suspender contas, limitar funcionalidades ou banir usuários que violem regras, sem aviso prévio.
                            </p>
                        </div>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">6</span>
                            Monetização
                        </h2>
                        <p className="leading-relaxed">
                            A monetização está sujeita à <a href="/legal/monetization" className="text-amber-400 hover:underline font-bold">Política de Monetização</a> específica, podendo variar conforme critérios técnicos, legais e de desempenho.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">7</span>
                            Limitação de Responsabilidade
                        </h2>
                        <p className="leading-relaxed">
                            O Chefex não se responsabiliza por prejuízos decorrentes de uso indevido da plataforma ou conteúdos publicados por terceiros.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">8</span>
                            Alterações
                        </h2>
                        <p className="leading-relaxed">
                            Os Termos poderão ser atualizados a qualquer momento. O uso contínuo implica aceitação das alterações.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-sm">9</span>
                            Foro
                        </h2>
                        <p className="leading-relaxed">
                            Fica eleito o foro da comarca do domicílio do usuário, conforme legislação brasileira.
                        </p>
                    </section>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
