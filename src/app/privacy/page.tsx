'use client';

import Navbar from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { Shield, Lock, Eye, Database, Cookie, Mail, MapPin, Clock, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-[#0E0F10] font-sans pb-24">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
                {/* Header */}
                <header className="text-center mb-8">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-[var(--color-primary)]" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-stone-800 dark:text-white">
                        Política de Privacidade
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 mt-2">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-8 text-stone-600 dark:text-stone-300">
                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Eye size={20} className="text-[var(--color-primary)]" />
                            1. Informações que Coletamos
                        </h2>
                        <div className="space-y-4 pl-7">
                            <p>
                                <strong>Dados de Conta:</strong> Quando você cria uma conta, coletamos seu nome, endereço de e-mail e foto de perfil (se fornecida via Google).
                            </p>
                            <p>
                                <strong>Dados de Uso:</strong> Coletamos informações sobre como você usa o aplicativo, incluindo receitas visualizadas, tempo de uso e preferências.
                            </p>
                            <p>
                                <strong>Conteúdo do Usuário:</strong> Receitas, comentários e outros conteúdos que você publica.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Database size={20} className="text-[var(--color-primary)]" />
                            2. Como Usamos suas Informações
                        </h2>
                        <ul className="space-y-2 pl-7 list-disc">
                            <li>Fornecer, manter e melhorar nossos serviços</li>
                            <li>Personalizar sua experiência com recomendações</li>
                            <li>Enviar notificações sobre atualizações importantes</li>
                            <li>Garantir a segurança da plataforma</li>
                            <li>Cumprir obrigações legais</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Lock size={20} className="text-[var(--color-primary)]" />
                            3. Segurança dos Dados
                        </h2>
                        <p className="pl-7">
                            Utilizamos medidas de segurança padrão da indústria, incluindo criptografia SSL/TLS, hash de senhas com bcrypt, e autenticação JWT com tokens de acesso e refresh. Seus dados são armazenados em servidores seguros com backup regular.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Cookie size={20} className="text-[var(--color-primary)]" />
                            4. Cookies e Tecnologias Similares
                        </h2>
                        <p className="pl-7">
                            Usamos cookies e localStorage para manter sua sessão, lembrar preferências e melhorar a experiência. Você pode gerenciar cookies nas configurações do seu navegador.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <FileText size={20} className="text-[var(--color-primary)]" />
                            5. Seus Direitos (LGPD)
                        </h2>
                        <ul className="space-y-2 pl-7 list-disc">
                            <li>Acessar e corrigir seus dados pessoais</li>
                            <li>Solicitar exclusão de sua conta e dados</li>
                            <li>Revogar consentimento a qualquer momento</li>
                            <li>Portabilidade de dados</li>
                            <li>Oposição ao tratamento de dados</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Clock size={20} className="text-[var(--color-primary)]" />
                            6. Retenção de Dados
                        </h2>
                        <p className="pl-7">
                            Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, os dados são removidos em até 30 dias, exceto quando exigido por lei.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-white flex items-center gap-2 mb-4">
                            <Mail size={20} className="text-[var(--color-primary)]" />
                            7. Contato
                        </h2>
                        <p className="pl-7">
                            Para questões sobre privacidade, entre em contato: <br />
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
