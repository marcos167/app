'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
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
                // 1. Send Access Token to Backend for Verification & Account Creation
                // Use dynamic hostname to work on LAN (172.x.x.x) or localhost
                const apiHost = window.location.hostname;
                const res = await fetch(`http://${apiHost}:8000/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_token: tokenResponse.access_token
                    })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.detail || 'Falha no login com Google');
                }

                const data = await res.json(); // { access_token: "...", token_type: "bearer" }

                // 2. Login in Frontend (Store Token)
                auth.login({
                    name: 'Google User', // We could fetch real name from backend /users/me if we want perfection
                    email: 'google@user.com', // Placeholder or fetch real info
                    token: data.access_token
                });

                // 3. Redirect
                router.push('/feed');

            } catch (e: any) {
                console.error(e);
                setIsConnecting(null);
                if (onError) onError(e.message || 'Falha na conexão com o servidor.');
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
