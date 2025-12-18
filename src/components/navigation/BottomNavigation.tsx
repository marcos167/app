'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, User, Users } from 'lucide-react';
import { colors } from '@/theme/chefex-theme';

const navItems = [
    { href: '/feed', icon: Home, label: 'Home' },
    { href: '/explore', icon: Search, label: 'Explorar' },
    { href: '/community', icon: Users, label: 'Comunidade', isMain: true },
    { href: '/saved', icon: Heart, label: 'Salvos' },
    { href: '/profile', icon: User, label: 'Perfil' },
];

/**
 * 📱 Bottom Navigation - Navegação mobile premium
 */
export function BottomNavigation() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
                backgroundColor: 'rgba(14, 15, 16, 0.8)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Premium Glass effect */}
            <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-t from-[#0E0F10] to-transparent" />

            <div className="relative flex items-center justify-around h-16 px-2 max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href !== '/feed' && pathname?.startsWith(item.href));

                    // Main action button (center)
                    if (item.isMain) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative -mt-6 flex items-center justify-center"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-90"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.primary.green} 0%, ${colors.secondary.orange} 100%)`,
                                        boxShadow: `0 4px 20px ${colors.primary.green}40`,
                                    }}
                                >
                                    <Icon size={26} color={colors.neutral.offWhite} />
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all active:scale-90"
                            style={{
                                color: isActive ? colors.primary.green : colors.neutral.lightGray,
                            }}
                        >
                            <div className="relative">
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {isActive && (
                                    <div
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                        style={{ backgroundColor: colors.primary.green }}
                                    />
                                )}
                            </div>
                            <span
                                className="text-[10px] font-medium"
                                style={{
                                    opacity: isActive ? 1 : 0.7,
                                }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Safe area for iOS */}
            <div className="h-[env(safe-area-inset-bottom)]" style={{ backgroundColor: colors.neutral.graphite }} />
        </nav>
    );
}

export default BottomNavigation;
