'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
    recipe: {
        id: string;
        title: string;
        image: string;
    };
}

export default function GlobalReviewsClient() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/comments'); // Fetches all
                if (res.ok) setComments(await res.json());
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pb-20">
            {/* Hero Section */}
            <div className="bg-[var(--color-primary)] text-white py-20 px-6 text-center rounded-b-[3rem] shadow-xl mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490818387583-1baba5e6d453?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Mural da Comunidade</h1>
                    <p className="text-white/90 text-lg font-medium">Veja o que os nossos chefs estão cozinhando e achando das receitas!</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comments.map((comment, index) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-lg shadow-stone-200/50 dark:shadow-stone-950/50 border border-stone-100 dark:border-stone-700 hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full"
                        >
                            {/* Recipe Header */}
                            <Link href={`/recipe/${comment.recipe?.id}`} className="group flex items-center gap-4 mb-4 pb-4 border-b border-stone-100 dark:border-stone-700 hover:opacity-80 transition-opacity">
                                <img
                                    src={comment.recipe?.image || '/placeholder-recipe.jpg'}
                                    className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                                    alt={comment.recipe?.title}
                                />
                                <div>
                                    <p className="text-xs text-stone-400 font-bold uppercase mb-1">Avaliou a receita</p>
                                    <h3 className="font-bold text-[var(--color-foreground)] line-clamp-1">{comment.recipe?.title || 'Receita Desconhecida'}</h3>
                                </div>
                            </Link>

                            {/* User Info & Rating */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                        {comment.user.image ? (
                                            <img src={comment.user.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-stone-500 text-xs">
                                                {comment.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[var(--color-foreground)] leading-none mb-1">{comment.user.name}</p>
                                        <p className="text-xs text-stone-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex bg-yellow-400/10 px-2 py-1 rounded-lg">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} size={12} fill={i <= comment.rating ? "#facc15" : "none"} className={i <= comment.rating ? "text-yellow-400" : "text-stone-300"} strokeWidth={i <= comment.rating ? 0 : 2} />
                                    ))}
                                </div>
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-4">
                                    "{comment.content}"
                                </p>

                                {/* Media Grid */}
                                {comment.images && comment.images.length > 0 && (
                                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {comment.images.map((img, i) => (
                                            <img key={i} src={img} className="w-full h-32 object-cover rounded-xl shadow-sm border border-stone-100" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer Link */}
                            <Link href={`/recipe/${comment.recipe?.id}`} className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between text-xs font-bold text-[var(--color-primary)] hover:underline">
                                Ver Receita Completa <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {comments.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <MessageSquare size={48} className="mx-auto text-stone-300 mb-4" />
                        <h2 className="text-2xl font-bold text-stone-500">Ainda não há avaliações</h2>
                        <p className="text-stone-400">Seja o primeiro a avaliar uma receita!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
