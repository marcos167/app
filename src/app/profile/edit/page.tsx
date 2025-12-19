'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { Upload, Camera, ChevronLeft } from 'lucide-react';

export default function ProfileEditPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial State
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        email: '',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    });

    useEffect(() => {
        const user = auth.getUser();
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                bio: (user as any).bio || '',
                email: user.email || '',
                image: user.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations
        if (file.size > 5 * 1024 * 1024) {
            showToast('A imagem deve ter no máximo 5MB.', 'error');
            return;
        }

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });

            if (!res.ok) throw new Error('Falha no upload');

            const data = await res.json();

            // Update state immediately (optimistic UI feedback handled by using the new URL)
            setFormData(prev => ({ ...prev, image: data.url }));
            showToast('Foto atualizada!', 'success');

        } catch (error) {
            console.error(error);
            showToast('Erro ao enviar imagem. Tente novamente.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API latency
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update global auth state
            auth.updateUser(formData);

            // In a real app, you would PUT to /api/user/me here too

            showToast('Perfil atualizado com sucesso!', 'success');
            router.push('/profile');
        } catch (error) {
            showToast('Erro ao atualizar perfil.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">
            {/* Header */}
            <div className="bg-[#1A1A1A]/80 backdrop-blur-md px-4 py-4 border-b border-[#2A2A2A] flex items-center justify-between sticky top-0 z-50">
                <Link href="/profile" className="p-2 -ml-2 text-stone-400 hover:text-white transition-colors flex items-center gap-1">
                    <ChevronLeft size={20} />
                    <span>Cancelar</span>
                </Link>
                <h1 className="text-base font-bold">Editar Perfil</h1>
                <button
                    onClick={handleSave}
                    disabled={isLoading || isUploading}
                    className="text-[var(--color-primary)] font-bold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1"
                >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>

            <div className="p-6 max-w-md mx-auto animate-fade-in space-y-8">

                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 py-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileSelect}
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative group cursor-pointer"
                    >
                        <div className={`w-32 h-32 rounded-full p-1 border-2 border-dashed border-[#333] group-hover:border-[var(--color-primary)] transition-colors ${isUploading ? 'animate-pulse' : ''}`}>
                            <img
                                src={formData.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover bg-[#1A1A1A]"
                            />
                        </div>

                        {/* Overlay Icon */}
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                            <Camera className="text-white w-8 h-8" />
                        </div>

                        {/* Loading Spinner */}
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 z-10">
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}

                        <div className="absolute -bottom-1 -right-1 bg-[#252525] p-2 rounded-full border border-[#333] shadow-lg group-hover:scale-110 transition-transform">
                            <Upload size={14} className="text-[var(--color-primary)]" />
                        </div>
                    </div>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="text-[var(--color-primary)] font-bold text-sm hover:underline"
                    >
                        {isUploading ? 'Enviando...' : 'Alterar Foto de Perfil'}
                    </button>
                </div>

                {/* Form Fields */}
                <form className="space-y-5" onSubmit={handleSave}>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-1">Nome</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-xl px-4 py-3.5 outline-none focus:border-[var(--color-primary)] focus:bg-[#202020] transition-all placeholder:text-stone-600 font-medium"
                            placeholder="Seu nome completo"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-1">Nome de Usuário</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">@</span>
                            <input
                                name="username"
                                value={formData.username.replace('@', '')}
                                onChange={(e) => setFormData(p => ({ ...p, username: `@${e.target.value}` }))}
                                className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-xl pl-8 pr-4 py-3.5 outline-none focus:border-[var(--color-primary)] focus:bg-[#202020] transition-all placeholder:text-stone-600"
                                placeholder="usuario"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-1">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={150}
                            rows={3}
                            className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-xl px-4 py-3.5 outline-none focus:border-[var(--color-primary)] focus:bg-[#202020] transition-all text-sm resize-none placeholder:text-stone-600 leading-relaxed"
                            placeholder="Conte um pouco sobre sua relação com a cozinha..."
                        />
                        <div className="text-right text-[10px] text-stone-500 pr-1">
                            {formData.bio.length}/150
                        </div>
                    </div>

                    {/* Read Only Section */}
                    <div className="pt-2 opacity-70">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-1">Email (Privado)</label>
                        <div className="mt-1.5 w-full bg-[#151515] border border-[#252525] rounded-xl px-4 py-3.5 text-stone-400 flex items-center gap-2 cursor-not-allowed">
                            <span>🔒</span>
                            <span>{formData.email}</span>
                        </div>
                    </div>
                </form>

                {/* Danger Zone */}
                <div className="pt-8 mt-8 border-t border-[#252525]">
                    <button className="w-full py-4 text-red-500 font-bold text-sm bg-red-500/5 rounded-xl border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center gap-2">
                        Excluir Minha Conta
                    </button>
                    <p className="text-center text-[10px] text-stone-600 mt-3">
                        Ao excluir sua conta, todos os seus dados serão removidos permanentemente.
                    </p>
                </div>

            </div>
        </div>
    );
}
