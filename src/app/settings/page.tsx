'use client';

import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Bell, Lock, Eye, EyeOff, Globe, Trash2, ChevronRight, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    return (
        <div className="min-h-screen bg-[#0C0A09] pb-24 font-sans text-stone-300">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            <Navbar />

            <main className="max-w-2xl mx-auto px-6 pt-12 relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Configurações</h1>
                    <p className="text-stone-400 text-sm">Personalize sua experiência no Chefex</p>
                </header>

                <div className="space-y-6 mb-12">
                    {/* Notifications */}
                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/10 p-2 rounded-lg">
                                    <Bell size={20} className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Notificações</h3>
                                    <p className="text-xs text-stone-500">Receba atualizações sobre suas receitas</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-green-500' : 'bg-stone-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                    </section>

                    {/* Theme */}
                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-500/10 p-2 rounded-lg">
                                    {theme === 'dark' ? <Moon size={20} className="text-purple-500" /> : <Sun size={20} className="text-amber-500" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Tema</h3>
                                    <p className="text-xs text-stone-500">Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white text-black' : 'bg-white/5 text-stone-400 hover:bg-white/10'}`}
                            >
                                Escuro
                            </button>
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-black' : 'bg-white/5 text-stone-400 hover:bg-white/10'}`}
                            >
                                Claro
                            </button>
                        </div>
                    </section>

                    {/* Privacy */}
                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold text-white mb-4">Privacidade</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Lock size={18} className="text-stone-400" />
                                    <span className="text-sm">Conta Privada</span>
                                </div>
                                <ChevronRight size={18} className="text-stone-600" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Eye size={18} className="text-stone-400" />
                                    <span className="text-sm">Quem pode ver minhas receitas</span>
                                </div>
                                <ChevronRight size={18} className="text-stone-600" />
                            </button>
                        </div>
                    </section>

                    {/* Data & Legal */}
                    <section className="bg-[#1C1917] p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold text-white mb-4">Dados e Legal</h3>
                        <div className="space-y-3">
                            <a href="/legal/privacy" className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-stone-400" />
                                    <span className="text-sm">Política de Privacidade</span>
                                </div>
                                <ChevronRight size={18} className="text-stone-600" />
                            </a>
                            <a href="/legal/terms" className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-stone-400" />
                                    <span className="text-sm">Termos de Uso</span>
                                </div>
                                <ChevronRight size={18} className="text-stone-600" />
                            </a>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                        <h3 className="font-bold text-red-400 mb-4">Zona de Perigo</h3>
                        <button className="w-full p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-red-400 font-bold text-sm">
                            <Trash2 size={18} />
                            Excluir Minha Conta
                        </button>
                    </section>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
