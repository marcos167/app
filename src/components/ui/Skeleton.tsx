'use client';

import { colors } from '@/theme/chefex-theme';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

/**
 * 💀 Skeleton - Placeholder animado para loading
 */
export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
}: SkeletonProps) {
    const baseStyles: React.CSSProperties = {
        backgroundColor: colors.neutral.darkGray,
        width: width ?? '100%',
        height: height ?? (variant === 'text' ? '1em' : variant === 'circular' ? width : '100%'),
    };

    const variantStyles = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: '',
        rounded: 'rounded-xl',
    };

    const animationStyles = {
        pulse: 'animate-pulse',
        wave: 'skeleton-wave',
        none: '',
    };

    return (
        <div
            className={`${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
            style={baseStyles}
        />
    );
}

/**
 * 🍳 Recipe Card Skeleton - Skeleton específico para cards de receita
 */
export function RecipeCardSkeleton() {
    return (
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: colors.neutral.darkGray }}>
            {/* Image placeholder */}
            <Skeleton variant="rectangular" height={180} />

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <Skeleton variant="text" width="80%" height={20} />

                {/* Description */}
                <Skeleton variant="text" width="100%" height={14} />
                <Skeleton variant="text" width="60%" height={14} />

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width={60} height={12} />
                    </div>
                    <Skeleton variant="rounded" width={50} height={24} />
                </div>
            </div>
        </div>
    );
}

/**
 * 📋 List Skeleton - Skeleton para listas
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ backgroundColor: colors.neutral.darkGray }}
                >
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="70%" height={16} />
                        <Skeleton variant="text" width="40%" height={12} />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * 📊 Stats Skeleton - Skeleton para números/estatísticas
 */
export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="p-4 rounded-2xl text-center"
                    style={{ backgroundColor: colors.neutral.darkGray }}
                >
                    <Skeleton variant="text" width="60%" height={32} className="mx-auto" />
                    <Skeleton variant="text" width="80%" height={12} className="mx-auto mt-2" />
                </div>
            ))}
        </div>
    );
}
