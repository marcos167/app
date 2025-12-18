'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SocialButtons from "@/components/auth/SocialButtons";
import { ChefexLogo } from "@/components/brand";
import { colors } from "@/theme/chefex-theme";
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Fetch user info
                const userResponse = await fetch('/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });

                let userName = 'Usuário';
                let userEmail = email;
                let userAvatar = '';

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    userName = userData.full_name || 'Usuário';
                    userEmail = userData.email || email;
                    userAvatar = userData.avatar_url || '';
                }

                // Save session
                const { auth } = await import('@/lib/auth');
                auth.login({
                    name: userName,
                    email: userEmail,
                    image: userAvatar,
                    token: data.access_token,
                    refresh_token: data.refresh_token
                });

                router.push("/feed");
            } else {
                setError(data.detail || "Email ou senha incorretos.");
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">



            {/* Login Card */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">

                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-12 animate-in slide-in-from-top-8 duration-1000">
                    {/* Logo Unificado */}
                    <div className="flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-500">
                        {/* Ícone (Maior e Centralizado) */}
                        <div className="relative w-44 h-44 -mb-12 drop-shadow-[0_0_40px_rgba(74,157,91,0.6)] z-10">
                            <img
                                src="/brand/logo-icon-final.png"
                                alt="Chefex Logo"
                                className="w-full h-full object-contain filter brightness-110"
                            />
                        </div>

                        {/* Texto (Ajustado e Próximo) */}
                        <img
                            src="/brand/logo-text-final.png"
                            alt="Chefex"
                            className="h-16 w-auto object-contain drop-shadow-2xl opacity-100 relative z-20"
                        />
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl shadow-black/50 overflow-hidden relative group">
                    {/* Glass Glare Effect */}
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Bem-vindo de volta</h2>

                        {/* Social Buttons */}
                        <div className="mb-8">
                            <SocialButtons onError={setError} />
                        </div>

                        <div className="relative flex items-center py-2 mb-6">
                            <div className="flex-grow border-t border-white/20"></div>
                            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Ou use seu email</span>
                            <div className="flex-grow border-t border-white/20"></div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                <input
                                    type="email"
                                    placeholder="Seu email"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/40 focus:border-[var(--color-primary)]/50 transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>

                            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                                <input
                                    type="password"
                                    placeholder="Sua senha"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/40 focus:border-[var(--color-primary)]/50 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <a href="#" className="text-xs font-bold text-stone-400 hover:text-white transition-colors">Esqueceu a senha?</a>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 text-red-200 text-xs font-bold py-3 px-4 rounded-xl border border-red-500/30 text-center animate-pulse">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Entrar
                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-stone-400 text-sm">
                        Não tem uma conta? <Link href="/signup" className="font-bold text-white hover:text-[var(--color-secondary)] transition-colors">Criar conta grátis</Link>
                    </p>
                    <div className="mt-6">
                        <Link href="/feed" className="text-xs font-bold text-stone-500 hover:text-stone-300 uppercase tracking-widest border-b border-transparent hover:border-stone-300 transition-all">
                            Entrar como Visitante
                        </Link>
                    </div>
                </div>

                {/* Footer Institucional Axis Software */}
                <div className="mt-12 flex flex-col items-center opacity-100 select-none pointer-events-none">
                    <p className="text-[10px] text-stone-500 font-medium tracking-widest uppercase mb-2">Powered by</p>
                    <div className="h-14 flex items-center justify-center">
                        <img
                            src="/brand/axis-logo.png"
                            alt="Axis Software"
                            className="h-full w-auto object-contain drop-shadow-sm"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
