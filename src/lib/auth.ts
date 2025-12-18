'use client';

// Removed Supabase dependencies
// import { supabase } from './supabaseClient'; 

export interface User {
    id?: string;
    name: string;
    email: string;
    image?: string;
    username?: string;
    bio?: string;
    role?: string;
    token?: string; // Access Token
    refresh_token?: string; // Refresh Token (Long Lived)
}

const STORAGE_KEY = 'app_receitas_user';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Internal cache for synchronous access
let currentUser: User | null = null;

// Initialize auth state
if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            currentUser = JSON.parse(stored);
        } catch (e) {
            console.error(e);
        }
    }
}

export const auth = {
    login: (user: User) => {
        if (typeof window !== 'undefined') {
            currentUser = user;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            window.dispatchEvent(new Event('auth:update'));
        }
    },

    updateUser: (updates: Partial<User>) => {
        if (typeof window !== 'undefined') {
            const current = auth.getUser();
            if (current) {
                const updated = { ...current, ...updates };
                currentUser = updated;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                window.dispatchEvent(new Event('auth:update'));
            }
        }
    },

    logout: async () => {
        if (typeof window !== 'undefined') {
            // Call backend to invalidate refresh token
            const refreshToken = auth.getRefreshToken();
            if (refreshToken) {
                try {
                    await fetch(`${API_URL}/auth/logout`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh_token: refreshToken })
                    });
                } catch (e) {
                    console.error('Failed to logout on server:', e);
                }
            }
            currentUser = null;
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new Event('auth:update'));
        }
    },

    getUser: (): User | null => {
        return currentUser;
    },

    isAuthenticated: (): boolean => {
        return !!currentUser;
    },

    getToken: (): string | undefined => {
        return auth.getUser()?.token;
    },

    getRefreshToken: (): string | undefined => {
        return auth.getUser()?.refresh_token;
    },

    // Refresh access token using refresh token
    refreshTokens: async (): Promise<boolean> => {
        const refreshToken = auth.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
            });

            if (!res.ok) {
                // Refresh token invalid/expired - force logout
                auth.logout();
                return false;
            }

            const data = await res.json();
            auth.updateUser({
                token: data.access_token,
                refresh_token: data.refresh_token
            });
            return true;
        } catch (e) {
            console.error('Failed to refresh tokens:', e);
            return false;
        }
    }
};

