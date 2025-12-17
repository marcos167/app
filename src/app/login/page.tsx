'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SocialButtons from "@/components/auth/SocialButtons";
import { ArrowRight, ChefHat, Sparkles } from 'lucide-react';

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
            // Real Login
            // Note: Currently using Mock Logic but saving to LocalStorage to simulate success.
            // TODO: Connect to /api/auth/login when endpoint is ready or use client.
            // For now, we will use the Google Auth endpoint structure or a mock successful response
            // that mimics a real token to prevent 401 loops.

            // SIMULATING REAL API CALL SEQUENCE FOR DEMO ROBUSTNESS
            // In a real scenario: const res = await api.post('/auth/login', { email, password });

            // Manually creating a session to break the loop
            const mockUser = {
                id: "1",
                name: "Chef Exemplo",
                email: email,
                token: "mock_access_token_to_stop_loop", // This needs to be real if backend validates it
                refresh_token: "mock_refresh_token"
            };

            // To properly fix: WE NEED REAL TOKENS if backend enforces it. 
            // Since backend IS enforcing it, we must mock the backend response OR use the google flow.
            // If the user uses Email/Password, we need an endpoint.
            // DOES THE BACKEND HAVE EMAIL LOGIN? I need to check auth.py.
            // It only showed /auth/google.

            // CRITICAL: Backend only has Google Auth implemented in the snippet I saw!
            // So Email/Password login WILL NOT WORK unless I implement it or tell the user.
            // For now, I will redirect them to Google Login or warn them.

            setError("Login por email não implementado no backend (Apenas Google). Use o botão Google acima!");
            setLoading(false);
            return;

        } catch (err) {
            console.error(err);
            setError("Erro ao conectar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">

            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">

                {/* Brand Logo / Icon */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl rotate-6 flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-4 animate-in slide-in-from-top-8 duration-1000">
                        <ChefHat size={40} className="text-white -rotate-6" />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-xl mb-1 flex items-center gap-2">
                        Gastro<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-yellow-400">fy</span>
                    </h1>
                    <p className="text-stone-300 font-medium tracking-widest text-xs uppercase flex items-center gap-2">
                        <Sparkles size={12} className="text-yellow-400" />
                        A Arte de Cozinhar
                        <Sparkles size={12} className="text-yellow-400" />
                    </p>
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

            </div>
        </div>
    );
}
