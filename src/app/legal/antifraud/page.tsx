'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ShieldAlert, AlertTriangle, Ban, Eye, Scale, Fingerprint, Search, Shield } from "lucide-react";

export default function AntiFraudPage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24 font-sans text-stone-300">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 pt-12 relative z-10">
                <header className="mb-12 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert size={32} className="text-red-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Política Antifraude</h1>
                    <p className="text-stone-400">Proteção da comunidade e integridade da plataforma</p>
                </header>

                <div className="space-y-8 mb-12">
                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Eye size={20} className="text-blue-400" />
                            1. Monitoramento Contínuo
                        </h2>
                        <p className="leading-relaxed mb-4">
                            O Chefex utiliza sistemas automatizados e revisão humana para detectar atividades suspeitas, incluindo:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Criação massiva de contas a partir do mesmo dispositivo ou IP</li>
                            <li>Padrões de engajamento artificiais (likes/comentários em massa)</li>
                            <li>Tentativas de manipulação de métricas de monetização</li>
                            <li>Uso de bots, scripts ou automação não autorizada</li>
                            <li>Comportamento suspeito em transações financeiras</li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Ban size={20} className="text-red-400" />
                            2. Condutas Proibidas
                        </h2>
                        <p className="mb-4">As seguintes atividades são expressamente proibidas:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Criar múltiplas contas para benefício próprio ou manipulação</li>
                            <li>Comprar, vender ou trocar seguidores, likes ou comentários</li>
                            <li>Manipular o sistema de monetização de qualquer forma</li>
                            <li>Publicar conteúdo plagiado como se fosse original</li>
                            <li>Usar identidade falsa ou se passar por outra pessoa</li>
                            <li>Participar de esquemas de "follow por follow" ou "like por like"</li>
                            <li>Usar VPNs ou proxies para contornar restrições geográficas</li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Search size={20} className="text-purple-400" />
                            3. Detecção e Análise
                        </h2>
                        <p className="leading-relaxed mb-4">
                            Nossos sistemas analisam diversos indicadores para identificar fraudes:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 p-3 rounded-xl text-sm">
                                <span className="text-purple-400 font-bold">Dispositivo</span>
                                <p className="text-stone-400 mt-1">Fingerprint único</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl text-sm">
                                <span className="text-purple-400 font-bold">Localização</span>
                                <p className="text-stone-400 mt-1">Padrões geográficos</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl text-sm">
                                <span className="text-purple-400 font-bold">Comportamento</span>
                                <p className="text-stone-400 mt-1">Ações por segundo</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl text-sm">
                                <span className="text-purple-400 font-bold">Conexões</span>
                                <p className="text-stone-400 mt-1">Redes de contas</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-amber-400" />
                            4. Consequências
                        </h2>
                        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-4">
                            <p className="text-red-200 font-medium mb-3">
                                Violações podem resultar em:
                            </p>
                            <ul className="space-y-2 text-red-200/80">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    Suspensão temporária da conta (7-30 dias)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    Banimento permanente sem aviso prévio
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    Perda total do saldo de monetização
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    Ação judicial em casos graves
                                </li>
                            </ul>
                        </div>
                        <p className="text-sm text-stone-400">
                            Decisões são finais e podem ser tomadas sem notificação prévia em casos de fraude evidente.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Fingerprint size={20} className="text-green-400" />
                            5. Verificação de Identidade
                        </h2>
                        <p className="leading-relaxed mb-4">
                            Para participar do programa de monetização, podemos solicitar:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Documento Oficial</span>
                                <span className="text-sm text-stone-400">RG, CNH ou Passaporte</span>
                            </li>
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Selfie de Confirmação</span>
                                <span className="text-sm text-stone-400">Segurando o documento</span>
                            </li>
                            <li className="flex gap-3 bg-white/5 p-3 rounded-xl items-center">
                                <span className="font-bold text-white">Comprovante de Residência</span>
                                <span className="text-sm text-stone-400">Últimos 3 meses</span>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-blue-400" />
                            6. Retenção de Pagamentos
                        </h2>
                        <p className="leading-relaxed">
                            O Chefex pode reter pagamentos por até <strong className="text-white">90 dias</strong> em casos de:
                        </p>
                        <ul className="list-disc pl-5 mt-3 space-y-2">
                            <li>Investigação de atividade suspeita</li>
                            <li>Verificação de identidade pendente</li>
                            <li>Disputa de conteúdo ou direitos autorais</li>
                            <li>Análise de conformidade fiscal</li>
                        </ul>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Scale size={20} className="text-amber-400" />
                            7. Direito de Defesa
                        </h2>
                        <p className="leading-relaxed mb-4">
                            Usuários penalizados podem recorrer da decisão através do email oficial:
                        </p>
                        <a
                            href="mailto:axissoftware025@gmail.com"
                            className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-xl font-bold hover:bg-amber-500/30 transition-colors"
                        >
                            axissoftware025@gmail.com
                        </a>
                        <p className="mt-4 text-sm text-stone-400">
                            Recursos serão analisados em até 15 dias úteis. A decisão final é irrecorrível.
                        </p>
                    </section>

                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4">8. Atualizações</h2>
                        <p className="leading-relaxed">
                            Esta política pode ser atualizada a qualquer momento. O uso contínuo da plataforma após alterações implica aceitação dos novos termos.
                        </p>
                        <p className="mt-4 text-sm text-stone-500">
                            Última atualização: Dezembro de 2024
                        </p>
                    </section>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
