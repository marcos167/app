'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import SocialButtons from "@/components/auth/SocialButtons";
import { ArrowRight, User, Mail, Lock, Check } from 'lucide-react';

const PROFILES = [
    { id: 'chef', label: 'Chef Pro', icon: '👨‍🍳', desc: 'Cozinho profissionalmente' },
    { id: 'amador', label: 'Amador', icon: '🍳', desc: 'Cozinho como hobby' },
    { id: 'enthusiast', label: 'Entusiasta', icon: '😋', desc: 'Amo experimentar' },
    { id: 'beginner', label: 'Iniciante', icon: '🐣', desc: 'Começando agora' },
];

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile: "enthusiast"
    });
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!termsAccepted) {
            setError("Você deve aceitar os Termos de Uso e Política de Privacidade para criar uma conta.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                auth.login({
                    name: formData.name,
                    email: formData.email,
                    role: 'user', // New signups are always users
                    token: data.access_token,
                    refresh_token: data.refresh_token
                });
                router.push("/feed");
            } else {
                setError(data.detail || "Erro ao criar conta.");
            }
        } catch (err) {
            console.error(err);
            setError("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">

            {/* Login Card - Matching Login Page Style */}
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">

                {/* Brand Logo - Same as Login */}
                <div className="flex flex-col items-center mb-12 animate-in slide-in-from-top-8 duration-1000">
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

                {/* Glass Card - Same Style as Login */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl shadow-black/50 overflow-hidden relative group">
                    {/* Glass Glare Effect */}
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Criar sua conta</h2>

                        {/* Social Buttons */}
                        <div className="mb-8">
                            <SocialButtons onError={setError} />
                        </div>

                        <div className="relative flex items-center py-2 mb-6">
                            <div className="flex-grow border-t border-white/20"></div>
                            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Ou cadastre-se</span>
                            <div className="flex-grow border-t border-white/20"></div>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            {/* Name Input */}
                            <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Seu nome completo"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/40 focus:border-[var(--color-primary)]/50 transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Seu email"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/40 focus:border-[var(--color-primary)]/50 transition-all font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="password"
                                    placeholder="Sua senha"
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/40 focus:border-[var(--color-primary)]/50 transition-all font-medium"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>

                            {/* Profile Selection */}
                            <div>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3 ml-1">Seu nível</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {PROFILES.map((profile) => (
                                        <button
                                            key={profile.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, profile: profile.id })}
                                            className={`relative p-3 rounded-xl border text-center transition-all duration-300 group
                                                ${formData.profile === profile.id
                                                    ? 'bg-gradient-to-br from-[var(--color-primary)]/30 to-[var(--color-secondary)]/30 border-[var(--color-primary)]/50 scale-105'
                                                    : 'bg-black/20 border-white/10 hover:bg-black/40 hover:border-white/20'}`}
                                        >
                                            {formData.profile === profile.id && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                    <Check size={10} className="text-white" />
                                                </div>
                                            )}
                                            <span className="text-2xl block mb-1">{profile.icon}</span>
                                            <span className={`text-[10px] font-bold block ${formData.profile === profile.id ? 'text-white' : 'text-white/60'}`}>
                                                {profile.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Terms and Privacy Acceptance (MANDATORY) */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-2 border-amber-500/50 bg-black/20 checked:bg-amber-500 checked:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
                                        required
                                    />
                                    <span className="text-xs text-amber-200 leading-relaxed">
                                        Li e aceito os <a href="/legal/terms" target="_blank" className="font-bold underline hover:text-amber-100">Termos de Uso</a>, <a href="/legal/privacy" target="_blank" className="font-bold underline hover:text-amber-100">Política de Privacidade</a> e <a href="/legal/monetization" target="_blank" className="font-bold underline hover:text-amber-100">Política de Monetização</a> do Chefex.
                                    </span>
                                </label>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/20 text-red-200 text-xs font-bold py-3 px-4 rounded-xl border border-red-500/30 text-center animate-pulse">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !termsAccepted}
                                className={`w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group/btn ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : 'shadow-purple-900/40 hover:shadow-purple-900/60'
                                    }`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Criar Conta
                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <p className="text-stone-400 text-sm">
                        Já tem conta? <Link href="/login" className="font-bold text-white hover:text-[var(--color-secondary)] transition-colors">Fazer login</Link>
                    </p>
                    <div className="mt-6">
                        <Link href="/feed" className="text-xs font-bold text-stone-500 hover:text-stone-300 uppercase tracking-widest border-b border-transparent hover:border-stone-300 transition-all">
                            Continuar como Visitante
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
