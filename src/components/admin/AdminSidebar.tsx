'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoChefex from '@/components/brand/LogoChefex';

export default function AdminSidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: '📊', path: '/admin' },
        { name: 'Criar Receita', icon: '✍️', path: '/admin/recipes/create' },
        { name: 'Receitas', icon: '🍜', path: '/admin/recipes' },
        { name: 'Categorias', icon: '🏷️', path: '/admin/categories' },
        { name: 'Comentários', icon: '💬', path: '/admin/comments' },
        { name: 'Estatísticas', icon: '📈', path: '/admin/stats' },
        { name: 'Usuários', icon: '👥', path: '/admin/users' },
        { name: 'Logs', icon: '📝', path: '/admin/logs' },
        { name: 'Configurações', icon: '⚙️', path: '/admin/settings' },
    ];

    return (
        <aside className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] hidden md:flex flex-col fixed h-full z-10">
            <div className="p-6 border-b border-[#2A2A2A] flex items-center gap-3">
                <LogoChefex size="sm" theme="dark" />
                <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Admin</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {menuItems.map((item) => {
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
