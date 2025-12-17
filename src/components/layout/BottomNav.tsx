'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User, MessageCircle, Heart, Clock, Crown } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        { name: 'Início', href: '/feed', icon: Home },
        { name: 'Comunidade', href: '/community', icon: MessageCircle },
        { name: 'Planos', href: '/plans', icon: Crown }, // Added Plans
        { name: 'Salvos', href: '/saved', icon: Heart },
        // { name: 'Histórico', href: '/history', icon: Clock }, // Removed History to keep 5 items balanced or keep 6? User said "put in this area", 5 is standard layout. Let's make it 5 by removing History or just adding 6. 
        // 6 icons might be crowded on small screens. The user image shows 5. Let's keep 5 distinct slots.
        // Usually "Plans" replaces "History" or "Community" in importance.
        // Let's keep 5 items for symmetry: Home, Community, Plans (Center), Saved, Profile.
        // I will remove History from the nav bar as it's less critical than Plans for this "Millionaire" app.
        // Wait, the user image shows: Home, Chat(Community), Heart(Saved), Clock(History), User(Profile).
        // User wants "Plans" "nessa area" (in this area).
        // Maybe replace "History" (Clock) with Plans (Crown)? Or make it 6 items?
        // 6 items is risky for width. 
        // I will replace "History" with "Planos".
        { name: 'Perfil', href: '/profile', icon: User },
    ];

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/50 dark:border-stone-800/50 rounded-full shadow-2xl shadow-stone-900/20 pointer-events-auto flex items-center p-1.5 gap-1">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isActive
                                ? 'text-white'
                                : 'text-stone-400 hover:text-[var(--color-primary)] hover:bg-stone-100 dark:hover:bg-stone-800'
                                }`}
                        >
                            {/* Active Tab Background Circle */}
                            {isActive && (
                                <span className="absolute inset-0 bg-[var(--color-primary)] rounded-full shadow-lg shadow-orange-500/30 animate-in zoom-in-50 duration-200"></span>
                            )}

                            {/* Icon */}
                            <Icon size={20} className="relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
