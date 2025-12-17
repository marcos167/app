import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Crown, ArrowRight, Loader2 } from 'lucide-react';

interface SearchModalProps {
    onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [allRecipes, setAllRecipes] = useState<any[]>([]);

    useEffect(() => {
        // Fetch recipes on mount to have them ready for client-side filtering
        // For larger apps, we would debounce and fetch from server on change
        const fetchRecipes = async () => {
            try {
                const data = await api.get<any[]>('/api/recipes?status=published');
                if (data) {
                    setAllRecipes(data);
                }
            } catch (e) {
                console.error("Search fetch failed", e);
            }
        };
        fetchRecipes();
    }, []);

    const filteredRecipes = searchTerm.length > 0
        ? allRecipes.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-[#FDFCF5] dark:bg-stone-900 w-full max-w-lg mx-4 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-bottom-10 duration-300 border border-stone-100 dark:border-stone-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-stone-200/50 dark:border-stone-800 flex items-center gap-4">
                    <span className="text-xl">🔍</span>
                    <input
                        type="text"
                        placeholder="O que você quer cozinhar?"
                        className="flex-1 bg-transparent border-none outline-none text-xl text-stone-800 dark:text-stone-100 font-bold placeholder:text-stone-300 dark:placeholder:text-stone-600 placeholder:font-normal"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {/* Empty / Suggestions State */}
                    {searchTerm.length === 0 && (
                        <div className="p-4">
                            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Sugestões do Chef</h3>
                            <div className="flex flex-col gap-2">
                                {allRecipes.slice(0, 3).map(recipe => (
                                    <Link
                                        href={`/recipes/${recipe.id}`}
                                        key={recipe.id}
                                        onClick={onClose}
                                        className="flex items-center gap-3 p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                                            <img src={recipe.image} className="w-full h-full object-cover" alt={recipe.title} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-stone-800 dark:text-stone-200 font-bold text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{recipe.title}</h4>
                                            <span className="text-stone-400 text-xs">{recipe.category}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-stone-300 group-hover:text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results list */}
                    {filteredRecipes.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <h3 className="px-4 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">Resultados</h3>
                            {filteredRecipes.map((recipe) => (
                                <Link
                                    href={`/recipes/${recipe.id}`}
                                    key={recipe.id}
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-4 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-all group"
                                >
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                                        <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={recipe.title} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-stone-800 dark:text-stone-200 font-bold text-base group-hover:text-[var(--color-primary)] transition-colors">{recipe.title}</h4>
                                            {recipe.is_premium && (
                                                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                    <Crown size={8} fill="currentColor" /> Premium
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-stone-500 text-sm line-clamp-1">{recipe.description}</p>
                                    </div>
                                    <ArrowRight size={20} className="text-stone-300 group-hover:text-[var(--color-primary)] transition-colors" />
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {searchTerm.length > 0 && filteredRecipes.length === 0 && (
                        <div className="p-10 text-center">
                            <div className="text-4xl mb-2 opacity-50">🥗</div>
                            <p className="text-stone-500 font-medium">Nenhuma receita encontrada para "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
