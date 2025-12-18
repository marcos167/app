'use client';

import { useState } from 'react';
import { X, Flag, AlertTriangle, Send, CheckCircle } from 'lucide-react';
import { useModeration, REPORT_REASONS, ReportReason, ContentType } from '@/contexts/ModerationContext';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: ContentType;
    contentId: string;
    contentTitle?: string;
    authorId: string;
    authorName: string;
}

export function ReportModal({
    isOpen,
    onClose,
    contentType,
    contentId,
    contentTitle,
    authorId,
    authorName,
}: ReportModalProps) {
    const { submitReport, hasUserReported } = useModeration();
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    // Mock current user ID (would come from auth context)
    const currentUserId = 'current_user';
    const currentUserName = 'Usuário Atual';

    const alreadyReported = hasUserReported(contentId, currentUserId);

    const handleSubmit = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);

        const response = await submitReport({
            contentType,
            contentId,
            contentTitle,
            reporterId: currentUserId,
            reporterName: currentUserName,
            reason: selectedReason,
            description,
            authorId,
            authorName,
        });

        setResult(response);
        setIsSubmitting(false);

        if (response.success) {
            setTimeout(() => {
                onClose();
                setResult(null);
                setSelectedReason(null);
                setDescription('');
            }, 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1B1E22] rounded-3xl max-w-md w-full border border-stone-800 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-stone-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <Flag size={20} className="text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold">Denunciar Conteúdo</h2>
                            <p className="text-stone-400 text-xs">Ajude a manter nossa comunidade segura</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors p-2">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    {alreadyReported ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-yellow-400" />
                            </div>
                            <h3 className="text-white font-bold mb-2">Já Denunciado</h3>
                            <p className="text-stone-400 text-sm">
                                Você já enviou uma denúncia para este conteúdo. Nossa equipe está analisando.
                            </p>
                        </div>
                    ) : result ? (
                        <div className="text-center py-8">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${result.success ? 'bg-green-500/20' : 'bg-red-500/20'
                                }`}>
                                {result.success
                                    ? <CheckCircle size={32} className="text-green-400" />
                                    : <AlertTriangle size={32} className="text-red-400" />
                                }
                            </div>
                            <h3 className="text-white font-bold mb-2">
                                {result.success ? 'Denúncia Enviada' : 'Erro'}
                            </h3>
                            <p className="text-stone-400 text-sm">{result.message}</p>
                        </div>
                    ) : (
                        <>
                            {/* Content Info */}
                            {contentTitle && (
                                <div className="bg-stone-800/50 rounded-xl p-3 mb-4">
                                    <p className="text-stone-400 text-xs mb-1">Denunciando:</p>
                                    <p className="text-white text-sm font-medium truncate">{contentTitle}</p>
                                    <p className="text-stone-500 text-xs">por {authorName}</p>
                                </div>
                            )}

                            {/* Reason Selection */}
                            <div className="mb-4">
                                <label className="text-white text-sm font-medium mb-3 block">
                                    Motivo da denúncia *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {REPORT_REASONS.map((reason) => (
                                        <button
                                            key={reason.value}
                                            onClick={() => setSelectedReason(reason.value)}
                                            className={`p-3 rounded-xl text-left transition-all ${selectedReason === reason.value
                                                    ? 'bg-red-500/20 border-red-500/50 border'
                                                    : 'bg-stone-800/50 border border-stone-700 hover:border-stone-600'
                                                }`}
                                        >
                                            <span className="text-lg block mb-1">{reason.icon}</span>
                                            <span className={`text-xs font-medium ${selectedReason === reason.value ? 'text-red-400' : 'text-stone-300'
                                                }`}>
                                                {reason.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className="text-white text-sm font-medium mb-2 block">
                                    Detalhes (opcional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descreva o problema com mais detalhes..."
                                    className="w-full bg-stone-800/50 border border-stone-700 rounded-xl p-3 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-red-500/50 resize-none h-24"
                                />
                            </div>

                            {/* Privacy Notice */}
                            <div className="flex items-start gap-2 text-stone-500 text-xs mb-4">
                                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                                <p>
                                    Sua denúncia é privada e anônima. O autor do conteúdo não saberá quem denunciou.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedReason || isSubmitting}
                                className="w-full py-4 rounded-xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Enviar Denúncia
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Quick Report Button Component
interface ReportButtonProps {
    contentType: ContentType;
    contentId: string;
    contentTitle?: string;
    authorId: string;
    authorName: string;
    variant?: 'icon' | 'text' | 'full';
}

export function ReportButton({
    contentType,
    contentId,
    contentTitle,
    authorId,
    authorName,
    variant = 'icon',
}: ReportButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { hasUserReported } = useModeration();

    const currentUserId = 'current_user';
    const alreadyReported = hasUserReported(contentId, currentUserId);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`transition-colors ${alreadyReported
                        ? 'text-yellow-500 cursor-default'
                        : 'text-stone-400 hover:text-red-400'
                    }`}
                title={alreadyReported ? 'Já denunciado' : 'Denunciar'}
            >
                {variant === 'icon' && <Flag size={16} />}
                {variant === 'text' && (
                    <span className="text-xs font-medium">
                        {alreadyReported ? 'Denunciado' : 'Denunciar'}
                    </span>
                )}
                {variant === 'full' && (
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                        <Flag size={14} />
                        {alreadyReported ? 'Denunciado' : 'Denunciar'}
                    </span>
                )}
            </button>

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contentType={contentType}
                contentId={contentId}
                contentTitle={contentTitle}
                authorId={authorId}
                authorName={authorName}
            />
        </>
    );
}
