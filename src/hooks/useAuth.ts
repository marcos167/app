'use client';

import { useState, useEffect } from 'react';
import { auth, User } from '@/lib/auth';

/**
 * Hook para acessar o usuário autenticado com reatividade
 * Escuta mudanças no estado de autenticação
 */
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial load
        setUser(auth.getUser());
        setLoading(false);

        // Listen for auth changes
        const handleAuthUpdate = () => {
            setUser(auth.getUser());
        };

        window.addEventListener('auth:update', handleAuthUpdate);

        return () => {
            window.removeEventListener('auth:update', handleAuthUpdate);
        };
    }, []);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login: auth.login,
        logout: auth.logout,
        updateUser: auth.updateUser,
    };
}
