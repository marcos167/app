'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { Moon, Globe, Bell, Mail, Lock, Info, FileText, LogOut, ChevronRight, Share2 } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";

export default function SettingsPage() {
    const router = useRouter();
    const { showToast } = useToast();

    // Preferences State
    const [notifications, setNotifications] = useState({
        push: true,
        email: false,
        marketing: false
    });

    const [privacy, setPrivacy] = useState({
        publicProfile: true,
        showActivity: true
    });

    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        auth.logout();
        showToast('Você saiu da conta', 'info');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-[#0E0F10] pb-20 font-sans selection:bg-[var(--color-primary)] selection:text-white">
            {/* Immersive Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="fixed top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[var(--color-secondary)]/10 to-transparent pointer-events-none z-0"></div>

            <Navbar />

            <div className="p-4 space-y-8 max-w-md mx-auto pt-8 relative z-10">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-stone-800 dark:text-white tracking-tight">Configurações ⚙️</h1>
                    <p className="text-stone-500 text-sm dark:text-stone-400 font-medium">Personalize sua experiência.</p>
                </div>

                {/* Section: Preferences */}
                <section>
                    <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferências</h2>
                    <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 dark:border-stone-800 overflow-hidden">

                        {/* Dark Mode */}
                        <div className="p-5 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 group hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-800 dark:text-white leading-tight mb-0.5">Modo Escuro</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Economiza bateria e descansa a vista</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                                <div className="w-12 h-7 bg-stone-200 dark:bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] shadow-inner"></div>
                            </label>
                        </div>

                        {/* Language */}
                        <div className="p-5 flex items-center justify-between group hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-800 dark:text-white leading-tight mb-0.5">Idioma</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Português (Brasil)</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-stone-400" />
                        </div>
                    </div>
                </section>

                {/* Section: Notifications */}
                <section>
                    <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 ml-2">Notificações</h2>
                    <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 dark:border-stone-800 overflow-hidden">

                        <div className="p-5 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                                    <Bell size={20} />
                                </div>
                                <span className="font-bold text-sm text-stone-700 dark:text-stone-200">Push Notifications</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications.push} onChange={() => setNotifications(prev => ({ ...prev, push: !prev.push }))} className="sr-only peer" />
                                <div className="w-10 h-6 bg-stone-200 dark:bg-stone-800 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
                            </label>
                        </div>
                        <div className="p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                                    <Mail size={20} />
                                </div>
                                <span className="font-bold text-sm text-stone-700 dark:text-stone-200">Emails de Novidades</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications.email} onChange={() => setNotifications(prev => ({ ...prev, email: !prev.email }))} className="sr-only peer" />
                                <div className="w-10 h-6 bg-stone-200 dark:bg-stone-800 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
                            </label>
                        </div>

                    </div>
                </section>

                {/* Section: Privacy & Security */}
                <section>
                    <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 ml-2">Privacidade</h2>
                    <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 dark:border-stone-800 overflow-hidden">
                        <div className="p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-800 dark:text-white leading-tight mb-0.5">Perfil Público</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Outros podem ver suas receitas salvas</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={privacy.publicProfile} onChange={() => setPrivacy(prev => ({ ...prev, publicProfile: !prev.publicProfile }))} className="sr-only peer" />
                                <div className="w-12 h-7 bg-stone-200 dark:bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] shadow-inner"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Section: Support */}
                <section>
                    <h2 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 ml-2">Geral</h2>
                    <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 dark:border-stone-800 overflow-hidden">
                        <Link href="/about" className="p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors border-b border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
                                    <Info size={20} />
                                </div>
                                <span className="text-sm font-bold text-stone-700 dark:text-stone-200">Sobre o App</span>
                            </div>
                            <span className="text-xs font-bold text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-md">v2.0</span>
                        </Link>
                        <Link href="/terms" className="p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-stone-800/40 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <span className="text-sm font-bold text-stone-700 dark:text-stone-200">Termos e Condições</span>
                            </div>
                            <ChevronRight size={18} className="text-stone-400" />
                        </Link>
                    </div>
                </section>

                {/* Section: Danger Zone (Logout) */}
                <section className="pt-4 pb-8">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-50 dark:bg-red-900/10 text-red-500 font-bold py-4 rounded-[2rem] border border-red-100 dark:border-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-500/5 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Sair da Conta
                    </button>
                    <p className="text-center text-[10px] text-stone-300 dark:text-stone-600 mt-6 font-mono tracking-widest uppercase">
                        CookApp ID: {auth.getUser()?.username || 'user-123'}
                    </p>
                </section>

            </div>

            <BottomNavigation />
        </div>
    );
}
