'use client';

import { useState, useRef } from 'react';

interface Props {
    currentImage: string;
    onSave: (newImage: string) => void;
    onClose: () => void;
}

export default function AvatarEditor({ currentImage, onSave, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLoading(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Simulate network delay then save
                setTimeout(() => {
                    onSave(base64String);
                    setLoading(false);
                    onClose();
                }, 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = () => {
        if (confirm("Tem certeza que deseja remover a foto atual?")) {
            setLoading(true);
            setTimeout(() => {
                // Reset to default seed
                onSave("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix");
                setLoading(false);
                onClose();
            }, 800);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg text-[var(--color-primary)]">Foto de Perfil</h2>
                    <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">✕</button>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <button
                        onClick={handleUploadClick}
                        disabled={loading}
                        className="w-full bg-[var(--color-primary)] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "Carregando..." : (
                            <>
                                <span>📸</span> Carregar Foto
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span>🗑️</span> Excluir Foto
                    </button>
                </div>
            </div>
        </div>
    );
}
