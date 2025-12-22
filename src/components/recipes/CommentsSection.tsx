'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Star, Image as ImageIcon, X, UploadCloud, Filter, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
    id: string;
    content: string;
    rating: number;
    images?: string[];
    createdAt: string;
    user: {
        name: string;
        image: string | null;
    };
}

export default function CommentsSection({ recipeId, userId }: { recipeId: string, userId?: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all'); // all, 5, 4, 3, 2, 1, media
    const [showForm, setShowForm] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    const fetchComments = async () => {
        const res = await fetch(`/api/comments?recipeId=${recipeId}`);
        if (res.ok) setComments(await res.json());
    };

    // Derived Statistics
    const stats = useMemo(() => {
        const total = comments.length;
        if (total === 0) return { average: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, media: 0 };

        const sum = comments.reduce((acc, c) => acc + c.rating, 0);
        const counts = comments.reduce((acc, c) => {
            acc[c.rating as keyof typeof acc] = (acc[c.rating as keyof typeof acc] || 0) + 1;
            if (c.images && c.images.length > 0) acc.media++;
            return acc;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, media: 0 });

        return {
            average: (sum / total).toFixed(1),
            ...counts
        };
    }, [comments]);

    const filteredComments = useMemo(() => {
        return comments.filter(c => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'media') return c.images && c.images.length > 0;
            return c.rating === Number(activeFilter);
        });
    }, [comments, activeFilter]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setImages(prev => [...prev, data.url]);
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Erro no upload da imagem');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return alert('Faça login para comentar');

        setLoading(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipeId,
                    userId,
                    content: newComment,
                    rating,
                    images
                })
            });

            if (res.ok) {
                setNewComment('');
                setRating(0);
                setImages([]);
                setShowForm(false);
                fetchComments();
                alert('Avaliação enviada com sucesso! 🌟');
            } else {
                const errorData = await res.json().catch(() => ({ detail: 'Erro ao enviar comentário' }));
                alert(errorData.detail || 'Erro ao enviar comentário');
            }
        } catch (error) {
            console.error(error);
            alert('Falha na conexão com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 bg-white dark:bg-stone-900 rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 p-6">
            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-6">Avaliações da Receita</h3>

            {/* Compact Header & Filters */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[var(--color-foreground)]">
                        Avaliações <span className="text-stone-400 font-normal text-sm">({stats.average} ★)</span>
                    </h3>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="text-[var(--color-primary)] text-sm font-bold hover:underline"
                    >
                        {showForm ? 'Cancelar' : 'Escrever Avaliação'}
                    </button>
                </div>

                {/* Horizontal Scrollable Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
                    <FilterPill
                        label="Tudo"
                        active={activeFilter === 'all'}
                        onClick={() => setActiveFilter('all')}
                    />
                    {[5, 4, 3, 2, 1].map(star => (
                        <FilterPill
                            key={star}
                            label={`${star} ★`}
                            count={stats[star as 1 | 2 | 3 | 4 | 5]}
                            active={activeFilter === String(star)}
                            onClick={() => setActiveFilter(String(star))}
                        />
                    ))}
                    <FilterPill
                        label="Com Fotos"
                        count={stats.media}
                        active={activeFilter === 'media'}
                        onClick={() => setActiveFilter('media')}
                    />
                </div>
            </div>

            {/* Form Container (Controlled by Header Button) */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="overflow-hidden mb-8"
                    >
                        <div className="bg-stone-50 dark:bg-stone-800 p-6 rounded-xl border border-stone-200 dark:border-stone-700">
                            {/* ... form content ... */}
                            {/* We need to re-insert the form content here since we are only replacing the wrapper/button area */}
                            <div className="space-y-4">
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-bold text-stone-600 mb-2">Sua Nota</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`transition-colors text-2xl ${star <= rating ? 'text-[var(--color-primary)]' : 'text-stone-300'}`}
                                            >
                                                <Star fill={star <= rating ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="O que achou da receita?"
                                    className="w-full bg-white dark:bg-stone-900 rounded-lg p-3 outline-none border border-stone-300 dark:border-stone-600 focus:border-[var(--color-primary)]"
                                    rows={4}
                                />

                                {/* Media Upload */}
                                <div className="flex gap-4 items-center flex-wrap">
                                    <div className="flex gap-2">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-300">
                                                <img src={img} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-black/50 text-white p-0.5"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="px-4 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-lg text-sm text-stone-600 flex items-center gap-2 hover:bg-stone-50"
                                    >
                                        <UploadCloud size={16} /> Adicionar Foto
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                                </div>

                                <button disabled={loading} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:brightness-110 w-full md:w-auto">
                                    {loading ? 'Enviando...' : 'Enviar Comentário'}
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Comments List */}
            <div className="space-y-8">
                {filteredComments.map((comment) => (
                    <div key={comment.id} className="border-b border-stone-100 dark:border-stone-800 pb-8 last:border-0">
                        <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 flex-shrink-0">
                                {comment.user.image ? (
                                    <img src={comment.user.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-500 font-bold bg-stone-100 uppercase text-xs">
                                        {comment.user.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                {/* Name and Rating */}
                                <div className="flex flex-col mb-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-[var(--color-foreground)]">{comment.user.name}</span>
                                        <span className="text-[10px] text-stone-400">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex text-[var(--color-primary)] text-[10px]">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star key={i} size={10} fill={i < comment.rating ? "currentColor" : "none"} strokeWidth={i < comment.rating ? 0 : 2} className={i >= comment.rating ? "text-stone-300" : ""} />
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-3">
                                    {comment.content}
                                </p>

                                {/* Media Grid */}
                                {comment.images && comment.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {comment.images.map((img, idx) => (
                                            <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer hover:opacity-90 transition-opacity">
                                                <img src={img} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Seller Response (Mock for now) */}
                                <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg relative mt-2 text-xs">
                                    <p className="font-bold text-[var(--color-primary)] mb-0.5">Resposta do Chef:</p>
                                    <p className="text-stone-500">Obrigado pelo feedback, {comment.user.name}! Que bom que gostou. 👨‍🍳✨</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredComments.length === 0 && (
                    <div className="text-center py-8 text-stone-400 text-sm">
                        <p>Nenhuma avaliação encontrada com este filtro.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterPill({ label, count, active, onClick }: { label: string, count?: number, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${active
                ? 'bg-stone-900 text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
        >
            {label}
            {count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20' : 'bg-stone-200 dark:bg-stone-900'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}
