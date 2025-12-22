'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useGoogleLogin } from '@react-oauth/google';

interface SocialButtonsProps {
    onStart?: () => void;
    onError?: (msg: string) => void;
}

export default function SocialButtons({ onStart, onError }: SocialButtonsProps) {
    const router = useRouter();
    const [isConnecting, setIsConnecting] = useState<null | 'google' | 'apple'>(null);
    const [status, setStatus] = useState('');

    const loginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setStatus('Autenticando...');

            try {
                // 1. Send Access Token to Backend (Proxy handles URL)
                const data = await api.post<{
                    access_token: string;
                    refresh_token?: string;
                }>('/api/auth/google', {
                    id_token: tokenResponse.access_token
                });

                // 2. Fetch real user data from backend
                const userResponse = await fetch('/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });

                let userName = 'Usuário';
                let userEmail = '';
                let userAvatar = '';
                let userRole = 'user';

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    userName = userData.full_name || userData.name || 'Usuário';
                    userEmail = userData.email || '';
                    userAvatar = userData.avatar_url || '';
                    userRole = userData.role || 'user';
                }

                // 3. Login in Frontend (Store Token with real data)
                auth.login({
                    name: userName,
                    email: userEmail,
                    image: userAvatar,
                    role: userRole,
                    token: data.access_token,
                    refresh_token: data.refresh_token
                });

                // 4. Redirect
                router.push('/feed');

            } catch (e: any) {
                console.error('Google Login Error:', e);
                setIsConnecting(null);

                // Extract error message from different possible sources
                let errorMsg = 'Erro desconhecido';
                if (e.message) {
                    errorMsg = e.message;
                }
                if (e.detail) {
                    errorMsg = e.detail;
                }

                alert("Erro no Login: " + errorMsg);
                if (onError) onError(errorMsg);
            }
        },
        onError: () => {
            setIsConnecting(null);
            if (onError) onError('Falha no Google Login (Popup fechado ou erro)');
        },
    });

    // Custom handler to bridge the UI
    const handleGoogleClick = () => {
        console.log('--- DEBUG INFO ---');
        console.log('Browser Origin:', window.location.origin);
        console.log('If this does not match "Authorized JavaScript origins" in Google Console exactly, it will fail.');
        console.log('------------------');

        if (onStart) onStart();
        setIsConnecting('google');
        loginGoogle();
    };

    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            <button
                type="button"
                onClick={handleGoogleClick}
                className="flex items-center justify-center gap-2 py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-sm font-medium text-stone-600 active:scale-95"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Google
            </button>
            <button
                type="button"
                // onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center gap-2 py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-sm font-medium text-stone-600 active:scale-95 opacity-50 cursor-not-allowed"
            >
                <img src="https://www.svgrepo.com/show/475633/apple-color.svg" className="w-5 h-5" alt="Apple" />
                Apple
            </button>
        </div>
    );
}
