'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // The supabase client (if configured with autoRefreshToken: true)
        // automatically detects the code/hash in the URL and exchanges it.
        // We just need to wait a moment or verify session.

        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Callback Auth Error:', error);
                router.push('/login?error=oauth_failed');
                return;
            }

            if (session) {
                router.push('/feed');
            } else {
                // If no session yet, maybe we need to listen for the event
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN') {
                        router.push('/feed');
                    }
                });

                // Fallback timeout
                setTimeout(() => {
                    // If still no session, go to login
                    // Check one last time
                    supabase.auth.getSession().then(({ data }) => {
                        if (data.session) router.push('/feed');
                        else router.push('/login');
                    })
                }, 3000);

                return () => subscription.unsubscribe();
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-stone-500 font-medium animate-pulse">Autenticando...</p>
            </div>
        </div>
    );
}
