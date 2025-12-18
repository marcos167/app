'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import SocialButtons from "@/components/auth/SocialButtons";
import { ChefexLogo } from "@/components/brand";
import { colors } from "@/theme/chefex-theme";
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
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

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

            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/40 to-black/90 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: `${colors.primary.green}20` }}></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" style={{ backgroundColor: `${colors.secondary.orange}20` }}></div>

            {/* Main Content */}
            <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-700">

                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-6">
                    <ChefexLogo size="lg" theme="dark" showTagline />
                </div>

                {/* Glass Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl shadow-black/50 overflow-hidden relative">
                    {/* Glass Glare */}
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Social Signup */}
                        <SocialButtons onError={setError} />

                        <div className="relative flex items-center py-3 mb-4">
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
                                    className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/50 focus:border-[var(--color-primary)]/50 transition-all font-medium text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                />
                            </div>

                            {/* Email & Password Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/50 focus:border-[var(--color-primary)]/50 transition-all font-medium text-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                </div>
                                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="password"
                                        placeholder="Senha"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-3 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:bg-black/50 focus:border-[var(--color-primary)]/50 transition-all font-medium text-sm"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Profile Selection */}
                            <div>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 ml-1">Seu nível</p>
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

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/20 text-red-200 text-xs font-bold py-3 px-4 rounded-xl border border-red-500/30 text-center">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
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
                <div className="mt-6 text-center space-y-3">
                    <Link href="/feed" className="block text-xs font-bold text-stone-500 hover:text-stone-300 uppercase tracking-widest transition-colors">
                        Continuar como Visitante
                    </Link>
                    <p className="text-stone-400 text-sm">
                        Já tem conta? <Link href="/login" className="font-bold text-white hover:text-[var(--color-secondary)] transition-colors">Fazer login</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
