'use client';

import Image from 'next/image';
import { brand, colors } from '@/theme/chefex-theme';

interface ChefexLogoProps {
    variant?: 'full' | 'icon' | 'text';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    theme?: 'dark' | 'light' | 'auto';
    className?: string;
    showTagline?: boolean;
    showCompany?: boolean;
}

const sizes = {
    xs: { height: 20, iconSize: 16 },
    sm: { height: 28, iconSize: 24 },
    md: { height: 36, iconSize: 32 },
    lg: { height: 44, iconSize: 40 },
    xl: { height: 56, iconSize: 48 },
};

/**
 * 🎨 Componente oficial da Logo Chefex
 * 
 * Uso:
 * - full: Logo completa (ícone + texto)
 * - icon: Apenas o símbolo (chapéu + X)
 * - text: Apenas o texto "Chefex"
 */
export function ChefexLogo({
    variant = 'full',
    size = 'md',
    theme = 'dark',
    className = '',
    showTagline = false,
    showCompany = false,
}: ChefexLogoProps) {
    const { height, iconSize } = sizes[size];

    const logoSrc = theme === 'light'
        ? brand.logo.full.light
        : brand.logo.full.dark;

    // Renderizar apenas texto estilizado
    if (variant === 'text') {
        return (
            <div className={`flex flex-col items-center ${className}`}>
                <h1
                    className="font-black tracking-tight"
                    style={{ fontSize: height * 0.9 }}
                >
                    <span style={{ color: colors.primary.green }}>Chef</span>
                    <span style={{ color: colors.secondary.orange }}>ex</span>
                </h1>
                {showTagline && (
                    <p
                        className="tracking-widest uppercase mt-1"
                        style={{
                            color: colors.neutral.lightGray,
                            fontSize: height * 0.25
                        }}
                    >
                        {brand.tagline}
                    </p>
                )}
            </div>
        );
    }

    // Renderizar ícone (imagem real)
    if (variant === 'icon') {
        return (
            <Image
                src={brand.logo.icon}
                alt={brand.name}
                width={iconSize}
                height={iconSize}
                className={`object-contain ${className}`}
            />
        );
    }

    // Renderizar logo completa (imagem)
    return (
        <div className={`flex flex-col items-center ${className}`}>
            <Image
                src={logoSrc}
                alt={brand.name}
                width={height * 4}
                height={height}
                className="object-contain"
                priority
                style={{ height: `${height}px`, width: 'auto' }}
            />
            {showTagline && (
                <p
                    className="tracking-widest uppercase mt-1"
                    style={{
                        color: colors.neutral.lightGray,
                        fontSize: Math.max(10, height * 0.25)
                    }}
                >
                    {brand.tagline}
                </p>
            )}
            {showCompany && (
                <p
                    className="tracking-wider mt-1"
                    style={{
                        color: colors.neutral.mediumGray,
                        fontSize: Math.max(9, height * 0.2)
                    }}
                >
                    {brand.name} • by {brand.company}
                </p>
            )}
        </div>
    );
}

/**
 * 🎯 Ícone Chefex para uso em cards, loading states, etc.
 */
export function ChefexIcon({
    size = 24,
    className = ''
}: {
    size?: number;
    className?: string;
}) {
    return (
        <Image
            src={brand.logo.icon}
            alt={brand.name}
            width={size}
            height={size}
            className={`object-contain ${className}`}
        />
    );
}

// Re-export para compatibilidade com código existente
export default ChefexLogo;
