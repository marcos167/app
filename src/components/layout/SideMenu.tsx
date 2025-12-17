'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { LogOut, ChevronRight, Settings, ShoppingBag, Bell, Star } from 'lucide-react';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeCategory, setActiveCategory] = useState('Pratos Brasileiros');

    useEffect(() => {
        setUser(auth.getUser());
    }, [isOpen]);

    const handleLogout = () => {
        auth.logout();
        router.refresh();
        window.location.href = '/login';
    };

    const categories = [
        { name: 'Pratos Brasileiros', icon: '🍛' },
        { name: 'Populares', icon: '🔥' },
        { name: 'Saudáveis', icon: '🥗' },
        { name: 'Sobremesas', icon: '🍰' },
        { name: 'Rápidas', icon: '⚡' },
        { name: 'Vegetarianas', icon: '🌱' },
        { name: 'Veganas', icon: '🌿' },
        { name: 'Receitas da Vó', icon: '👵' },
        { name: 'Datas Especiais', icon: '🎉' },
    ];

    const utilities = [
        { name: 'Receitas Salvas', icon: Star, link: '/saved' },
        { name: 'Lista de Compras', icon: ShoppingBag, link: '/shopping-list' },
        { name: 'Notificações', icon: Bell, link: '#' },
        { name: 'Configurações', icon: Settings, link: '/settings' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-[#0C0A09]/95 backdrop-blur-xl z-[70] shadow-2xl shadow-black transform transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1) flex flex-col border-r border-white/10 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-secondary)]/5 rounded-full blur-[80px] pointer-events-none"></div>

                {/* Header */}
                <div className="p-8 pb-6 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg shadow-purple-500/20">
                            <div className="w-full h-full rounded-full border-2 border-[#0C0A09] overflow-hidden bg-stone-800">
                                <img
                                    src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Chef"}
                                    alt="Chef"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-white font-black text-2xl leading-none mb-1">Chef!</h2>
                            <Link href="/profile" onClick={onClose} className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--color-secondary)] flex items-center gap-1 transition-colors">
                                Ver Perfil <ChevronRight size={12} />
                            </Link>
                        </div>
                    </div>
                    <p className="text-stone-400 text-sm font-medium leading-relaxed">Vamos cozinhar algo incrível hoje?</p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto py-2 px-4 relative z-10 no-scrollbar">

                    {/* Categories */}
                    <div className="mb-6">
                        <h3 className="text-stone-500 uppercase text-[10px] font-bold tracking-[0.2em] mb-4 px-2">Categorias</h3>
                        <div className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => { setActiveCategory(cat.name); onClose(); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                                        ${activeCategory === cat.name
                                            ? 'bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 text-white shadow-inner border border-[var(--color-primary)]/20'
                                            : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {activeCategory === cat.name && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)]"></div>}
                                    <span className={`text-xl ${activeCategory === cat.name ? 'scale-110' : 'grayscale group-hover:grayscale-0'} transition-transform duration-300`}>{cat.icon}</span>
                                    <span className={`font-bold text-sm tracking-wide ${activeCategory === cat.name ? 'text-[var(--color-primary)] bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-white' : ''}`}>{cat.name}</span>
                                    {activeCategory === cat.name && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="my-4 border-t border-white/5 mx-2"></div>

                    {/* Utilities */}
                    <div className="mb-6">
                        <div className="space-y-1">
                            {utilities.map((util) => {
                                const Icon = util.icon;
                                return (
                                    <Link
                                        key={util.name}
                                        href={util.link}
                                        onClick={onClose}
                                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-stone-400 hover:bg-white/5 hover:text-white transition-all group"
                                    >
                                        <Icon size={18} className="group-hover:text-[var(--color-primary)] transition-colors" />
                                        <span className="font-bold text-sm">{util.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0C0A09]/50 backdrop-blur-md relative z-10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-stone-500 hover:text-red-400 transition-all w-full px-4 py-3 rounded-2xl hover:bg-red-500/10 mb-2 group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Sair da Conta</span>
                    </button>
                    <p className="text-center text-[10px] text-stone-700 font-mono tracking-widest opacity-50">COOKAPP v2.0 • PREMIUM</p>
                </div>
            </div>
        </>
    );
}
