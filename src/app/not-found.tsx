import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-32 h-32 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <span className="text-6xl">🍲</span>
            </div>

            <h2 className="text-4xl font-bold text-[var(--color-foreground)] mb-2">Ops! Página não encontrada</h2>
            <p className="text-stone-500 mb-8 max-w-md">
                Parece que a receita ou página que você procura não existe ou foi removida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                <Link
                    href="/"
                    className="flex-1 bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                    <Home size={20} />
                    Ir para o Início
                </Link>
                <Link
                    href="/reviews"
                    className="flex-1 bg-white dark:bg-stone-800 text-[var(--color-foreground)] font-bold py-3 px-6 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                >
                    <Search size={20} />
                    Ver Avaliações
                </Link>
            </div>
        </div>
    );
}
