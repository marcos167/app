'use client';

import { useState } from 'react';
import { Plus, X, ChefHat, Video, FileText, Image } from 'lucide-react';
import Link from 'next/link';

interface CreateOption {
    href: string;
    icon: React.ElementType;
    label: string;
    color: string;
    description: string;
}

const createOptions: CreateOption[] = [
    {
        href: '/create/recipe',
        icon: ChefHat,
        label: 'Receita',
        color: '#22c55e',
        description: 'Compartilhe sua receita favorita',
    },
    {
        href: '/create/video',
        icon: Video,
        label: 'Vídeo',
        color: '#f97316',
        description: 'Grave um vídeo curto (até 60s)',
    },
    {
        href: '/create/post',
        icon: FileText,
        label: 'Postagem',
        color: '#3b82f6',
        description: 'Escreva uma dica ou história',
    },
    {
        href: '/create/photo',
        icon: Image,
        label: 'Foto',
        color: '#a855f7',
        description: 'Compartilhe uma foto do seu prato',
    },
];

/**
 * 🔘 Floating Action Button - Botão flutuante para criação de conteúdo
 * Usado em páginas de feed para acesso rápido à criação
 */
export function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Options Menu */}
            <div
                className={`fixed bottom-24 right-4 z-50 flex flex-col gap-3 transition-all duration-300 ${isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                {createOptions.map((option, index) => (
                    <Link
                        key={option.href}
                        href={option.href}
                        className="flex items-center gap-3 animate-slideUp"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Label */}
                        <div className="bg-[#1C1917] px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                            <p className="text-white font-medium text-sm">{option.label}</p>
                            <p className="text-stone-400 text-xs">{option.description}</p>
                        </div>

                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                            style={{
                                backgroundColor: option.color,
                                boxShadow: `0 4px 14px ${option.color}40`,
                            }}
                        >
                            <option.icon size={22} className="text-white" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen ? 'rotate-45 bg-stone-700' : 'rotate-0'
                    }`}
                style={{
                    background: isOpen
                        ? '#57534e'
                        : 'linear-gradient(135deg, #22c55e 0%, #f97316 100%)',
                    boxShadow: isOpen
                        ? '0 4px 20px rgba(0,0,0,0.3)'
                        : '0 4px 20px rgba(34, 197, 94, 0.4)',
                }}
                aria-label={isOpen ? 'Fechar menu' : 'Criar conteúdo'}
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <Plus size={24} className="text-white" />
                )}
            </button>

            {/* Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}

export default FloatingActionButton;
