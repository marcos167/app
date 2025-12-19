'use client';

import Link from 'next/link';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function AdminTopbar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await api.get<any>('/api/users/me'); // Correct endpoint
                if (data && !data.error) {
                    setUser(data);
                }
            } catch (error) {
                console.warn("Failed to fetch admin profile", error);
            }
        };
        fetchUser();
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !user) return;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            // 1. Upload Image
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const { url } = await uploadRes.json();

            if (url) {
                // 2. Update User Profile in DB
                await fetch(`/api/users/${user.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: url })
                });

                // 3. Update Local State
                setUser((prev: any) => ({ ...prev, image: url }));

                // Ideally trigger a context update if we had one, but local state works for this component
                alert('Foto de perfil atualizada!');
            }
        } catch (error) {
            console.error('Failed to update profile image', error);
            alert('Erro ao atualizar imagem');
        }
    };

    return (
        <header className="h-16 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#2A2A2A] sticky top-0 z-20 px-8 flex items-center justify-between">
            {/* Global Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-[var(--color-primary)] transition-colors">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar receitas, usuários ou comentários..."
                        className="w-full bg-[#252525] border border-transparent focus:border-[var(--color-primary)] text-white text-sm rounded-lg pl-10 pr-4 py-2 outline-none transition-all placeholder:text-stone-600"
                    />
                </div >
            </div >

            {/* Right Actions */}
            < div className="flex items-center gap-6" >
                <NotificationBell />

                <div className="flex items-center gap-3 pl-6 border-l border-[#2A2A2A]">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white leading-none">{user?.name || 'Administrador'}</p>
                        <p className="text-[10px] text-stone-500 font-mono mt-1">SUPER ADMIN</p>
                    </div>

                    {/* Image Upload Trigger */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-9 h-9 rounded-lg overflow-hidden border border-[#333] hover:border-[var(--color-primary)] transition-colors cursor-pointer relative group"
                        title="Alterar Foto de Perfil"
                    >
                        <img
                            src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                            alt="Admin"
                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-white text-[8px] font-bold">
                            EDITAR
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
            </div >
        </header >
    );
}
