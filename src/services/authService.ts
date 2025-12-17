import { api } from '@/lib/api';

export interface User {
    email: string;
    full_name?: string;
    avatar_url?: string;
    token: string;
    role?: string;
}

export const authService = {
    async googleLogin(idToken: string): Promise<User> {
        const response = await api.post<{ access_token: string, token_type: string }>('/auth/google', {
            id_token: idToken
        });

        // Fetch user details immediately after token
        // Usually you'd decode the JWT, but here we can just mock or fetch /users/me
        // For efficiency, we will trust the backend response or fetch profile

        return {
            email: 'user@google.com', // Placeholder, ideally fetch /users/me
            token: response.access_token,
        };
    },

    async fetchProfile(): Promise<User> {
        return api.get<User>('/users/me');
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user_session');
            window.location.href = '/login';
        }
    }
};
