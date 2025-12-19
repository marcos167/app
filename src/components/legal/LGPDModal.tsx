'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LGPDModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('chefex_lgpd_consent');
        if (!hasConsented) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('chefex_lgpd_consent', 'true');
        localStorage.setItem('chefex_lgpd_date', new Date().toISOString());
        setIsVisible(false);
    };

    const handleReject = () => {
        // In a real app, you might restrict access. Here we just close for demo/MVP.
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none p-4 pb-6">
                    {/* Backdrop (Optional, maybe too intrusive) */}
                    {/* <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" /> */}

                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-[#1C1917] border border-white/10 shadow-2xl rounded-3xl w-full max-w-lg pointer-events-auto overflow-hidden ring-1 ring-white/5"
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-amber-500/10 p-3 rounded-2xl flex-shrink-0">
                                    <Shield size={24} className="text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">Sua privacidade é nosso ingrediente principal 🔒</h3>
                                    <p className="text-stone-400 text-sm leading-relaxed mb-4">
                                        Para oferecer a melhor experiência culinária, o Chefex coleta alguns dados. Respeitamos a <strong>LGPD</strong> e garantimos transparência total.
                                    </p>

                                    {detailsOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="bg-black/20 rounded-xl p-4 mb-4 text-xs text-stone-300 space-y-2 border border-white/5"
                                        >
                                            <p className="font-bold text-white">Dados que coletamos:</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Nome e e-mail (para sua conta).</li>
                                                <li>Preferências culinárias (para personalizar o feed).</li>
                                                <li>Cookies técnicos (para manter você logado).</li>
                                            </ul>
                                            <p className="pt-2">Seus dados <span className="text-red-400 font-bold">nunca</span> são vendidos para terceiros.</p>
                                            <div className="flex gap-4 pt-2 font-bold underline">
                                                <Link href="/legal/privacy" className="hover:text-amber-400">Política de Privacidade</Link>
                                                <Link href="/legal/terms" className="hover:text-amber-400">Termos de Uso</Link>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleAccept}
                                            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                                        >
                                            <Check size={18} /> Aceitar Tudo
                                        </button>
                                        <button
                                            onClick={() => setDetailsOpen(!detailsOpen)}
                                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-xl transition-all border border-white/10"
                                        >
                                            {detailsOpen ? 'Menos Detalhes' : 'Personalizar'}
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleReject}
                                        className="mt-4 text-xs text-stone-500 hover:text-white w-full text-center transition-colors"
                                    >
                                        Continuar apenas com cookies essenciais
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
