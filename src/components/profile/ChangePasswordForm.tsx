'use client';

import { useState } from 'react';

interface Props {
    onClose: () => void;
}

export default function ChangePasswordForm({ onClose }: Props) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API Call
        setTimeout(() => {
            setLoading(false);
            alert("Senha alterada com sucesso!");
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg text-[var(--color-primary)]">Alterar Senha</h2>
                    <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1 ml-1">Senha Atual</label>
                        <input type="password" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1 ml-1">Nova Senha</label>
                        <input type="password" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1 ml-1">Confirmar Nova Senha</label>
                        <input type="password" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 active:scale-[0.98] transition-all"
                    >
                        {loading ? "Atualizando..." : "Atualizar Senha"}
                    </button>
                </form>
            </div>
        </div>
    );
}
