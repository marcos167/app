'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import SocialButtons from "@/components/auth/SocialButtons";

const PROFILES = [
    { id: 'chef', label: 'Chef Profissional', icon: '👨‍🍳' },
    { id: 'amador', label: 'Cozinheiro Amador', icon: '🍳' },
    { id: 'enthusiast', label: 'Entusiasta', icon: '😋' },
    { id: 'beginner', label: 'Iniciante', icon: '🐣' },
];

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile: "enthusiast"
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const user = await response.json();
                auth.login(user); // Save session
                router.push("/feed");
            } else {
                const data = await response.json();
                alert(data.message || "Erro ao criar conta.");
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">

                {/* Header / Slogan */}
                <div className="p-8 pb-4 text-center bg-[var(--color-secondary)]/30">
                    <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Descubra receitas do seu jeito</h1>
                    <p className="text-stone-500 text-sm">Crie sua conta e comece sua jornada culinária.</p>
                </div>

                <div className="p-8 pt-4">
                    {/* Social Signup */}
                    <SocialButtons />

                    <div className="relative flex py-2 items-center mb-4">
                        <div className="flex-grow border-t border-stone-200"></div>
                        <span className="flex-shrink-0 mx-4 text-stone-400 text-xs">OU</span>
                        <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">

                        {/* Basic Info */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-1 ml-1">Nome Completo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                                    placeholder="Joana da Silva"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1 ml-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                                        placeholder="exemplo@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1 ml-1">Senha</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Profile Selection */}
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">Qual seu nível na cozinha?</label>
                            <div className="grid grid-cols-2 gap-3">
                                {PROFILES.map((profile) => (
                                    <button
                                        key={profile.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, profile: profile.id })}
                                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1
                      ${formData.profile === profile.id
                                                ? 'border-[var(--color-primary)] bg-orange-50 ring-1 ring-[var(--color-primary)]'
                                                : 'border-stone-200 hover:bg-stone-50'}`}
                                    >
                                        <span className="text-2xl">{profile.icon}</span>
                                        <span className={`text-sm font-bold ${formData.profile === profile.id ? 'text-[var(--color-primary)]' : 'text-stone-600'}`}>
                                            {profile.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70"
                        >
                            {loading ? "Criando conta..." : "Criar Conta"}
                        </button>

                    </form>

                    {/* Links */}
                    <div className="mt-6 flex flex-col items-center gap-3">
                        <Link href="/feed" className="text-stone-400 text-sm font-medium hover:text-stone-600 transition-colors">
                            Continuar como convidado
                        </Link>
                        <p className="text-xs text-stone-400">
                            Já tem conta? <Link href="/login" className="font-bold text-[var(--color-primary)]">Fazer login</Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
