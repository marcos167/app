'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const user = auth.getUser();

        if (!auth.isAuthenticated() || !user) {
            router.replace('/login');
            return;
        }

        // Check for admin or moderator role
        const allowedRoles = ['admin', 'moderator'];
        const userRole = user.role?.toLowerCase();

        // CEO Bypass (backup) + Role Check
        const isOwner = user.email?.toLowerCase() === 'm22338294@gmail.com';
        const hasAdminRole = userRole && allowedRoles.includes(userRole);

        if (!isOwner && !hasAdminRole) {
            router.replace('/');
            return;
        }

        setAuthorized(true);
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center text-stone-500">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-medium uppercase tracking-widest">Verificando Acesso</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

