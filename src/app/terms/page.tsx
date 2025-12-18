'use client';

import Navbar from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { FileText, Check, AlertTriangle, Ban, Gavel, MessageCircle, RefreshCcw } from 'lucide-react';

export default function TermsOfUsePage() {
    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-[#0E0F10] font-sans pb-24">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
                {/* Header */}
                <header className="text-center mb-8">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-[var(--color-primary)]" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-stone-800 dark:text-white">
                        Termos de Uso
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-2">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-8 text-stone-600 dark:text-stone-300">
                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Check size={20} className="text-green-500" />
                            1. Aceitação dos Termos
                        </h2>
                        <p className="pl-7">
                            Ao acessar e usar o Chefex, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não use nosso aplicativo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-[var(--color-primary)]" />
                            2. Descrição do Serviço
                        </h2>
                        <p className="pl-7">
                            O Chefex é uma plataforma de receitas culinárias que permite aos usuários descobrir, salvar e compartilhar receitas. Oferecemos funcionalidades como modo de cozinha, planejamento de refeições e lista de compras.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Check size={20} className="text-green-500" />
                            3. Uso Aceitável
                        </h2>
                        <ul className="space-y-2 pl-7 list-disc">
                            <li>Usar o app para fins pessoais e não comerciais</li>
                            <li>Compartilhar receitas originais ou devidamente creditadas</li>
                            <li>Tratar outros usuários com respeito</li>
                            <li>Manter suas credenciais de acesso seguras</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Ban size={20} className="text-red-500" />
                            4. Condutas Proibidas
                        </h2>
                        <ul className="space-y-2 pl-7 list-disc">
                            <li>Publicar conteúdo ofensivo, ilegal ou prejudicial</li>
                            <li>Copiar receitas de terceiros sem autorização</li>
                            <li>Usar o app para spam ou propaganda não autorizada</li>
                            <li>Tentar hackear ou comprometer a segurança</li>
                            <li>Criar contas falsas ou usar identidade de terceiros</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-[var(--color-primary)]" />
                            5. Conteúdo do Usuário
                        </h2>
                        <p className="pl-7">
                            Você mantém os direitos sobre o conteúdo que publica. Ao publicar, você nos concede uma licença não exclusiva para exibir, distribuir e promover seu conteúdo na plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <AlertTriangle size={20} className="text-amber-500" />
                            6. Isenção de Responsabilidade
                        </h2>
                        <p className="pl-7">
                            As receitas são fornecidas "como estão". Não garantimos resultados específicos. Pessoas com alergias alimentares devem verificar ingredientes. Não nos responsabilizamos por reações adversas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Gavel size={20} className="text-[var(--color-primary)]" />
                            7. Violações e Penalidades
                        </h2>
                        <p className="pl-7">
                            Violações podem resultar em advertência, suspensão ou banimento permanente. Reservamo-nos o direito de remover conteúdo que viole estes termos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <RefreshCcw size={20} className="text-[var(--color-primary)]" />
                            8. Alterações nos Termos
                        </h2>
                        <p className="pl-7">
                            Podemos atualizar estes termos periodicamente. Notificaremos sobre mudanças significativas. O uso continuado após alterações constitui aceitação.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <MessageCircle size={20} className="text-[var(--color-primary)]" />
                            9. Contato
                        </h2>
                        <p className="pl-7">
                            Para dúvidas sobre estes termos: <br />
                            <a href="mailto:axissoftware025@gmail.com" className="text-[var(--color-primary)] font-bold">
                                axissoftware025@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}
