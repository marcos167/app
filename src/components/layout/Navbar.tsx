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

                        <Link href="/" className="font-bold text-2xl text-[var(--color-primary)] tracking-tight">
                            Receitas
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
                                <div className="absolute right-0 top-10 w-56 bg-white dark:bg-stone-900 shadow-xl rounded-xl border border-stone-100 dark:border-stone-800 py-1 overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95 origin-top-right">
                                    <div className="px-4 py-3 border-b border-stone-50 dark:border-stone-800 bg-stone-50/50">
                                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Logado como</p>
                                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">{auth.getUser()?.name || 'Chef'}</p>
                                        <p className="text-xs text-stone-500 truncate">{auth.getUser()?.email}</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setShowMenu(false)}
                                        className="block w-full text-left px-4 py-2.5 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-medium transition-colors flex items-center gap-2"
                                    >
                                        👨‍🍳 Meu Perfil
                                    </Link>
                                    <Link
                                        href="/settings"
                                        onClick={() => setShowMenu(false)}
                                        className="block w-full text-left px-4 py-2.5 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-medium transition-colors flex items-center gap-2"
                                    >
                                        ⚙️ Configurações
                                    </Link>
                                    <div className="border-t border-stone-50 dark:border-stone-800 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-stone-800 font-medium transition-colors flex items-center gap-2"
                                    >
                                        🚪 Sair
                                    </button>
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
