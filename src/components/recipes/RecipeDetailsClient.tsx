'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface RecipeDetailsClientProps {
    recipe: any; // Using any for simplicity with complex Prisma types, ideally define interface
    initialReactions: { love: number; like: number; dislike: number };
}

export default function RecipeDetailsClient({ recipe, initialReactions }: RecipeDetailsClientProps) {
    const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
    const [reactions, setReactions] = useState(initialReactions);
    const [userReaction, setUserReaction] = useState<'love' | 'like' | 'dislike' | null>(null);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

    const toggleIngredient = (index: number) => {
        if (checkedIngredients.includes(index)) {
            setCheckedIngredients(prev => prev.filter(i => i !== index));
        } else {
            setCheckedIngredients(prev => [...prev, index]);
        }
    };

    const handleReaction = (type: 'love' | 'like' | 'dislike') => {
        if (userReaction === type) {
            // Remove reaction
            setReactions(prev => ({ ...prev, [type]: prev[type] - 1 }));
            setUserReaction(null);
        } else {
            // Add new reaction (and remove old if exists)
            setReactions(prev => {
                const newReactions = { ...prev };
                if (userReaction) newReactions[userReaction]--;
                newReactions[type]++;
                return newReactions;
            });
            setUserReaction(type);
        }
    };

    const addToShoppingList = () => {
        if (checkedIngredients.length === 0) {
            alert("Selecione pelo menos um ingrediente para adicionar!");
            return;
        }

        const newItems = checkedIngredients.map(index => ({
            id: crypto.randomUUID(),
            name: recipe.ingredients[index],
            recipeTitle: recipe.title,
            addedAt: new Date().toISOString(),
            checked: false
        }));

        const existingList = JSON.parse(localStorage.getItem('shoppingList') || '[]');

        // Handle legacy string items (optional cleanup)
        const cleanList = existingList.filter((i: any) => typeof i === 'object');

        const updatedList = [...cleanList, ...newItems];

        localStorage.setItem('shoppingList', JSON.stringify(updatedList));

        setIsAddedToCart(true);
        setTimeout(() => setIsAddedToCart(false), 3000);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-md mx-auto px-6 -mt-10 relative z-10 bg-[var(--color-background)] rounded-t-3xl pt-8 pb-32 animate-slide-up shadow-2xl">

            {/* Header / Title (Mobile overlay style handled in parent, this is content body) */}

            {/* Action Buttons & Reactions */}
            <div className="flex justify-between items-center mb-8 border-b border-stone-200/10 pb-6">
                <div className="flex gap-3">
                    <ReactionButton
                        emoji="❤️"
                        count={reactions.love}
                        label="Amei"
                        active={userReaction === 'love'}
                        onClick={() => handleReaction('love')}
                    />
                    <ReactionButton
                        emoji="🔥"
                        count={reactions.like}
                        label="Curti"
                        active={userReaction === 'like'}
                        onClick={() => handleReaction('like')}
                    />
                    <ReactionButton
                        emoji="🤔"
                        count={reactions.dislike}
                        label="Meh"
                        active={userReaction === 'dislike'}
                        onClick={() => handleReaction('dislike')}
                    />
                </div>

                <button className="bg-[var(--color-primary)] text-white p-3 rounded-full shadow-lg hover:shadow-orange-500/30 hover:scale-105 transition-all active:scale-95">
                    <span className="sr-only">Salvar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                </button>
            </div>

            {/* Ingredients Checklist */}
            <section className="mb-10">
                <h2 className="font-bold text-2xl text-[var(--color-foreground)] mb-6 flex items-center gap-2">
                    🥬 Ingredientes
                    <span className="text-xs font-normal text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-full">
                        {checkedIngredients.length}/{recipe.ingredients.length}
                    </span>
                </h2>

                <motion.ul
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                >
                    {recipe.ingredients.map((ing: string, i: number) => (
                        <motion.li
                            key={i}
                            variants={item}
                            onClick={() => toggleIngredient(i)}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border shadow-sm group ${checkedIngredients.includes(i)
                                ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20 shadow-none'
                                : 'bg-white dark:bg-stone-800 border-stone-100 dark:border-stone-700 hover:shadow-md hover:border-[var(--color-primary)]/30 hover:-translate-y-0.5'
                                }`}
                        >
                            {/* Custom Checkbox */}
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${checkedIngredients.includes(i)
                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)] scale-110'
                                : 'border-stone-300 dark:border-stone-600 group-hover:border-[var(--color-primary)] bg-white dark:bg-stone-900'
                                }`}>
                                <AnimatePresence>
                                    {checkedIngredients.includes(i) && (
                                        <motion.svg
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-3.5 h-3.5"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Text */}
                            <span className={`flex-1 text-base font-medium transition-all duration-300 ${checkedIngredients.includes(i)
                                ? 'text-stone-400 line-through decoration-2 decoration-[var(--color-primary)]/30'
                                : 'text-stone-700 dark:text-stone-200'
                                }`}>
                                {ing}
                            </span>
                        </motion.li>
                    ))}
                </motion.ul>

                <button
                    onClick={addToShoppingList}
                    className="mt-6 w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-98 flex items-center justify-center gap-2 overflow-hidden relative"
                    style={{
                        backgroundColor: isAddedToCart ? '#22c55e' : 'var(--color-secondary)',
                        color: isAddedToCart ? 'white' : 'var(--color-primary)'
                    }}
                >
                    <AnimatePresence mode='wait'>
                        {isAddedToCart ? (
                            <motion.span
                                key="added"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                ✓ Adicionado à Lista
                            </motion.span>
                        ) : (
                            <motion.span
                                key="add"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                🛒 Adicionar à Lista de Compras
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </section>

            {/* Preparation Steps */}
            <section className="mb-20">
                <h2 className="font-bold text-2xl text-[var(--color-foreground)] mb-8">🔥 Modo de Preparo</h2>

                <div className="relative">
                    {/* Continuous Timeline Line */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[var(--color-primary)] via-stone-200 to-transparent dark:via-stone-700 opacity-30" />

                    <div className="space-y-8">
                        {recipe.steps.map((step: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-12"
                            >
                                {/* Floating Number Badge */}
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[var(--color-background)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold flex items-center justify-center shadow-sm z-10 text-sm">
                                    {i + 1}
                                </div>

                                {/* Card Content */}
                                <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 hover:shadow-md transition-shadow">
                                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium text-lg">
                                        {step}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ReactionButton({ emoji, count, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all active:scale-95 ${active
                ? 'bg-orange-500/10 text-orange-600'
                : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500'
                }`}
        >
            <span className={`text-2xl transition-transform ${active ? 'scale-110' : ''}`}>{emoji}</span>
            <span className="text-[10px] font-bold">{count}</span>
        </button>
    );
}
