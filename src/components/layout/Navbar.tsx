'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import SearchModal from './SearchModal';
import NotificationsSheet from './NotificationsSheet';
import SideMenu from './SideMenu';

export default function Navbar() {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [userImage, setUserImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"); // Default

    useEffect(() => {
        const updateAuth = () => {
            const user = auth.getUser();
            if (user?.image) { // Check if user has image
                setUserImage(user.image);
            }
        };

        // Initial load
        updateAuth();

        // Listen for updates
        window.addEventListener('auth:update', updateAuth);
        return () => window.removeEventListener('auth:update', updateAuth);
    }, []);

    const handleLogout = () => {
        auth.logout();
        router.refresh();
        window.location.href = '/login';
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-[#FDFCF5]/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSideMenu(true)}
                            className="p-1 -ml-2 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>

                        <Link href="/" className="block">
                            <img
                                src="/brand/logo-full.png"
                                alt="Chefex"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setShowSearch(true); setShowNotifications(false); setShowMenu(false); }}
                            className="p-2 text-stone-600 dark:text-stone-400 hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-stone-50 dark:hover:bg-stone-800"
                        >
                            <span className="sr-only">Buscar</span>
                            🔍
                        </button>

                        <button
                            onClick={() => { setShowNotifications(!showNotifications); setShowSearch(false); setShowMenu(false); }}
                            className={`p-2 relative text-stone-600 dark:text-stone-400 hover:text-[var(--color-primary)] transition-colors rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 ${showNotifications ? 'text-[var(--color-primary)] bg-stone-50 dark:bg-stone-800' : ''}`}
                        >
                            <span className="sr-only">Notificações</span>
                            🔔
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-stone-900 rounded-full animate-pulse"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); setShowSearch(false); }}
                                className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden border border-stone-100 dark:border-stone-700 block transition-transform active:scale-95"
                            >
                                <img
                                    src={userImage}
                                    alt="Perfil"
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-12 w-64 bg-[#0C0A09]/90 backdrop-blur-2xl shadow-2xl shadow-black/50 rounded-3xl border border-white/10 overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-top-2 origin-top-right ring-1 ring-white/5">
                                    {/* Glass Highlight */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                                    <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)]">
                                                <div className="w-full h-full rounded-full overflow-hidden border border-black bg-black">
                                                    <img src={userImage} alt="User" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest mb-0.5">Chef</p>
                                                <p className="text-sm font-bold text-white truncate leading-tight">{auth.getUser()?.name || 'Visitante'}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-stone-500 truncate pl-1">{auth.getUser()?.email}</p>
                                    </div>

                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/profile"
                                            onClick={() => setShowMenu(false)}
                                            className="group flex items-center gap-3 px-4 py-3 text-sm text-stone-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200"
                                        >
                                            <span className="p-2 rounded-xl bg-white/5 group-hover:bg-[var(--color-primary)]/20 text-stone-300 group-hover:text-[var(--color-primary)] transition-colors">
                                                👨‍🍳
                                            </span>
                                            <span className="font-bold">Meu Perfil</span>
                                        </Link>

                                        <Link
                                            href="/settings"
                                            onClick={() => setShowMenu(false)}
                                            className="group flex items-center gap-3 px-4 py-3 text-sm text-stone-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200"
                                        >
                                            <span className="p-2 rounded-xl bg-white/5 group-hover:bg-blue-500/20 text-stone-300 group-hover:text-blue-400 transition-colors">
                                                ⚙️
                                            </span>
                                            <span className="font-bold">Configurações</span>
                                        </Link>
                                    </div>

                                    <div className="p-2 border-t border-white/5 bg-black/20">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full group flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all duration-200"
                                        >
                                            <span className="p-2 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 text-red-400 transition-colors">
                                                🚪
                                            </span>
                                            <span className="font-bold">Sair da Conta</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modals & Side Drawer */}
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
            {showNotifications && <NotificationsSheet onClose={() => setShowNotifications(false)} />}
        </>
    );
}
