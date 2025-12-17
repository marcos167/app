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

    logout: () => {
        if (typeof window !== 'undefined') {
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
    }
};
