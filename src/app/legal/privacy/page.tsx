'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Lock, Eye, Database, UserX, FileText, Shield } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24 font-sans text-stone-300">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 pt-12 relative z-10">
                <header className="mb-12 text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} className="text-blue-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Política de Privacidade</h1>
                    <p className="text-stone-400">Em conformidade com a LGPD (Lei Geral de Proteção de Dados)</p>
                </header>

                <div className="space-y-8 mb-12">
                    <div className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Database size={20} className="text-blue-400" />
                            1. Coleta de Dados
                        </h2>
                        <p className="mb-3">Coletamos dados fornecidos diretamente pelo usuário, como:</p>
                        <ul className="list-disc pl-5 space-y-2 text-stone-300">
                            <li>Nome, e-mail, foto de perfil</li>
                            <li>Dados de navegação e interações dentro do app</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Eye size={20} className="text-green-400" />
                            2. Uso dos Dados
                        </h2>
                        <p className="mb-4">Os dados são utilizados exclusivamente para:</p>
                        <ul className="list-disc pl-5 space-y-2 text-stone-300 leading-relaxed">
                            <li>Funcionamento da plataforma</li>
                            <li>Personalização da experiência</li>
                            <li>Processamento de pagamentos</li>
                            <li>Segurança, antifraude e moderação</li>
                        </ul>
                        <div className="mt-4 bg-blue-500/10 p-3 rounded-lg text-blue-300 text-sm font-bold">
                            Nós NÃO vendemos seus dados para terceiros.
                        </div>
                    </div>

                    <div className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-purple-400" />
                            3. Compartilhamento
                        </h2>
                        <p className="mb-3">Os dados podem ser compartilhados apenas com:</p>
                        <ul className="list-disc pl-5 space-y-2 text-stone-300">
                            <li>Processadores de pagamento (Stripe)</li>
                            <li>Serviços de hospedagem e analytics</li>
                            <li>Autoridades legais quando exigido por lei</li>
                        </ul>
                    </div>

                    <div className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-amber-400" />
                            4. Armazenamento e Segurança
                        </h2>
                        <p className="leading-relaxed">
                            Os dados são armazenados em ambientes seguros, com controle de acesso, criptografia e logs de auditoria.
                        </p>
                    </div>

                    <div className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <UserX size={20} className="text-red-400" />
                            5. Direitos do Titular (LGPD)
                        </h2>
                        <p className="mb-4">O usuário pode solicitar:</p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Acesso:</span>
                                <span className="text-sm">Ver todos os dados que temos sobre você.</span>
                            </li>
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Correção:</span>
                                <span className="text-sm">Editar seu perfil a qualquer momento nas Configurações.</span>
                            </li>
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Exclusão:</span>
                                <span className="text-sm">Você pode excluir sua conta permanentemente a qualquer momento.</span>
                            </li>
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Portabilidade:</span>
                                <span className="text-sm">Solicitar uma cópia de todos os seus dados (formato JSON).</span>
                            </li>
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Revogação de consentimento:</span>
                                <span className="text-sm">Revogar autorizações a qualquer momento.</span>
                            </li>
                        </ul>
                        <p className="mt-4 text-sm text-stone-400">
                            Solicitações devem ser feitas pelo canal oficial do Chefex: <a href="mailto:axissoftware025@gmail.com" className="text-blue-400 hover:underline font-bold">axissoftware025@gmail.com</a>
                        </p>
                    </div>

                    <div className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4">6. Cookies e Tecnologias</h2>
                        <p className="leading-relaxed">
                            Utilizamos cookies e tecnologias similares para melhorar a experiência e métricas internas.
                        </p>
                    </div>

                    <div className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4">7. Alterações</h2>
                        <p className="leading-relaxed">
                            Esta política pode ser atualizada periodicamente. O uso contínuo da plataforma após alterações implica aceitação.
                        </p>
                    </div>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
