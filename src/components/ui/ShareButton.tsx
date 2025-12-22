'use client';

import { Share2, Copy, MessageCircle, Send, Twitter, Facebook, Link2 } from 'lucide-react';
import { useState } from 'react';

interface ShareData {
    title: string;
    text?: string;
    url: string;
}

interface ShareButtonProps {
    data: ShareData;
    className?: string;
    variant?: 'icon' | 'button' | 'full';
}

/**
 * 📤 Share Button - Botão de compartilhamento com Web Share API
 * Fallback para modal com opções manuais
 */
export function ShareButton({ data, className = '', variant = 'icon' }: ShareButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Try native Web Share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: data.title,
                    text: data.text || `Confira: ${data.title}`,
                    url: data.url,
                });
                return;
            } catch (err) {
                // User cancelled or error, fall through to modal
                if ((err as Error).name === 'AbortError') return;
            }
        }

        // Fallback to custom modal
        setShowModal(true);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(data.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = data.url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(`${data.title}\n${data.url}`)}`,
        },
        {
            name: 'Telegram',
            icon: Send,
            color: '#0088cc',
            url: `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`,
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: '#1DA1F2',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}`,
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: '#4267B2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
        },
    ];

    const buttonContent = () => {
        switch (variant) {
            case 'icon':
                return <Share2 size={20} />;
            case 'button':
                return (
                    <>
                        <Share2 size={18} />
                        <span>Compartilhar</span>
                    </>
                );
            case 'full':
                return (
                    <>
                        <Share2 size={20} />
                        <span>Compartilhar receita</span>
                    </>
                );
        }
    };

    const buttonClass = () => {
        const base = 'flex items-center gap-2 transition-all active:scale-95';
        switch (variant) {
            case 'icon':
                return `${base} p-2 rounded-full hover:bg-white/10`;
            case 'button':
                return `${base} px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium`;
            case 'full':
                return `${base} w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-orange-500/20 border border-white/10 justify-center font-medium`;
        }
    };

    return (
        <>
            <button
                onClick={handleShare}
                className={`${buttonClass()} text-white ${className}`}
                aria-label="Compartilhar"
            >
                {buttonContent()}
            </button>

            {/* Share Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="w-full max-w-md bg-[#1C1917] rounded-t-3xl p-6 animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-1 bg-stone-600 rounded-full mx-auto mb-6" />

                        <h3 className="text-white text-lg font-bold mb-2">Compartilhar</h3>
                        <p className="text-stone-400 text-sm mb-6 truncate">{data.title}</p>

                        {/* Share Options */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {shareOptions.map((option) => (
                                <a
                                    key={option.name}
                                    href={option.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${option.color}20` }}
                                    >
                                        <option.icon size={24} style={{ color: option.color }} />
                                    </div>
                                    <span className="text-xs text-stone-300">{option.name}</span>
                                </a>
                            ))}
                        </div>

                        {/* Copy Link */}
                        <button
                            onClick={copyToClipboard}
                            className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center">
                                    {copied ? (
                                        <span className="text-green-400 text-lg">✓</span>
                                    ) : (
                                        <Link2 size={18} className="text-stone-300" />
                                    )}
                                </div>
                                <span className="text-white font-medium">
                                    {copied ? 'Link copiado!' : 'Copiar link'}
                                </span>
                            </div>
                            <Copy size={18} className="text-stone-400" />
                        </button>

                        {/* Cancel */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full mt-4 py-3 text-stone-400 font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default ShareButton;
