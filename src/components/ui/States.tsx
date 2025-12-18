'use client';

import { ChefexIcon } from '@/components/brand';
import { colors } from '@/theme/chefex-theme';

interface StateProps {
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: { icon: 32, title: 'text-sm', desc: 'text-xs' },
    md: { icon: 48, title: 'text-lg', desc: 'text-sm' },
    lg: { icon: 64, title: 'text-2xl', desc: 'text-base' },
};

/**
 * 🔄 Loading State - Animação premium de carregamento
 */
export function LoadingState({
    title = 'Carregando...',
    size = 'md'
}: Omit<StateProps, 'action' | 'description'>) {
    const s = sizes[size];

    return (
        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
            {/* Animated Logo */}
            <div className="relative">
                <div
                    className="absolute inset-0 rounded-full blur-xl animate-pulse"
                    style={{ backgroundColor: `${colors.primary.green}30` }}
                />
                <div className="relative animate-bounce">
                    <ChefexIcon size={s.icon} />
                </div>
            </div>

            {/* Animated Dots */}
            <div className="flex gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{
                            backgroundColor: colors.primary.green,
                            animationDelay: `${i * 150}ms`,
                        }}
                    />
                ))}
            </div>

            <p
                className={`${s.title} font-medium mt-4`}
                style={{ color: colors.neutral.lightGray }}
            >
                {title}
            </p>
        </div>
    );
}

/**
 * 📭 Empty State - Para listas vazias
 */
export function EmptyState({
    title = 'Nada por aqui',
    description = 'Ainda não há conteúdo para exibir.',
    action,
    size = 'md'
}: StateProps) {
    const s = sizes[size];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Icon with glow */}
            <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{
                    backgroundColor: colors.neutral.darkGray,
                    boxShadow: `0 0 40px ${colors.primary.green}20`
                }}
            >
                <span className="text-4xl opacity-60">📭</span>
            </div>

            <h3
                className={`${s.title} font-bold mb-2`}
                style={{ color: colors.neutral.offWhite }}
            >
                {title}
            </h3>

            <p
                className={`${s.desc} max-w-xs`}
                style={{ color: colors.neutral.lightGray }}
            >
                {description}
            </p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-6 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                    style={{
                        backgroundColor: colors.primary.green,
                        color: colors.neutral.offWhite,
                    }}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

/**
 * ❌ Error State - Para erros de carregamento
 */
export function ErrorState({
    title = 'Algo deu errado',
    description = 'Não foi possível carregar o conteúdo.',
    action,
    size = 'md'
}: StateProps) {
    const s = sizes[size];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Error Icon */}
            <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                style={{
                    backgroundColor: `${colors.state.error}20`,
                    border: `2px solid ${colors.state.error}40`
                }}
            >
                <span className="text-4xl">😵</span>
            </div>

            <h3
                className={`${s.title} font-bold mb-2`}
                style={{ color: colors.neutral.offWhite }}
            >
                {title}
            </h3>

            <p
                className={`${s.desc} max-w-xs`}
                style={{ color: colors.neutral.lightGray }}
            >
                {description}
            </p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-6 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    style={{
                        backgroundColor: colors.state.error,
                        color: colors.neutral.offWhite,
                    }}
                >
                    🔄 {action.label}
                </button>
            )}
        </div>
    );
}

/**
 * ✅ Success State - Para confirmações
 */
export function SuccessState({
    title = 'Sucesso!',
    description = 'Operação realizada com sucesso.',
    action,
    size = 'md'
}: StateProps) {
    const s = sizes[size];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
            {/* Success Icon with pulse */}
            <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 relative"
                style={{
                    backgroundColor: `${colors.primary.green}20`,
                    border: `2px solid ${colors.primary.green}40`
                }}
            >
                <div
                    className="absolute inset-0 rounded-3xl animate-ping opacity-20"
                    style={{ backgroundColor: colors.primary.green }}
                />
                <span className="text-4xl relative">✅</span>
            </div>

            <h3
                className={`${s.title} font-bold mb-2`}
                style={{ color: colors.neutral.offWhite }}
            >
                {title}
            </h3>

            <p
                className={`${s.desc} max-w-xs`}
                style={{ color: colors.neutral.lightGray }}
            >
                {description}
            </p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-6 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                    style={{
                        backgroundColor: colors.primary.green,
                        color: colors.neutral.offWhite,
                    }}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
