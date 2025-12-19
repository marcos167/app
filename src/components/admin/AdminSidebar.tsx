'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LogoChefex from '@/components/brand/LogoChefex';

import { auth } from '@/lib/auth';

export default function AdminSidebar() {
    const pathname = usePathname();
    const user = auth.getUser();

    // Role Badge mapping
    // Role Badge mapping - CEO Override
    const isCEO = user?.email?.toLowerCase() === 'm22338294@gmail.com';
    const roleBadge = isCEO ? 'CEO' : (user?.role === 'admin' ? 'Administrador' : 'Moderador');
    const roleColor = isCEO ? 'text-yellow-500' : (user?.role === 'admin' ? 'text-red-500' : 'text-blue-500');

    const menuItems = [
        // ... (omitted for brevity)
    ];

    const visibleItems = menuItems.filter(item =>
        isCEO || user?.role === 'admin' || (user?.role && item.roles.includes(user.role))
    );

    return (
        <aside className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] hidden md:flex flex-col fixed h-full z-10">
            <div className="p-6 border-b border-[#2A2A2A] flex items-center gap-3">
                <Image
                    src="/logo-chefex.png"
                    alt="Chefex Admin"
                    width={120}
                    height={30}
                    className="object-contain"
                />
                <span className={`text-xs font-bold uppercase tracking-wider ${roleColor} border border-white/10 px-2 py-0.5 rounded ml-auto`}>
                    {roleBadge}
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {visibleItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                    : 'text-stone-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                                {item.icon}
                            </span>
                            <span className={`font-medium ${isActive ? 'font-bold' : ''}`}>
                                {item.name}
                            </span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#2A2A2A]">
                <div className="bg-[#252525] rounded-xl p-4">
                    <p className="text-xs text-stone-500 uppercase font-bold mb-2">Status do Sistema</p>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs text-stone-300 font-medium">Online v1.0.0</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
