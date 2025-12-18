'use client';

import { colors, radius, shadows } from '@/theme/chefex-theme';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
}

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export function PrimaryButton({
    children,
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
                inline-flex items-center justify-center gap-2 font-bold rounded-2xl
                transition-all duration-200 active:scale-95
                ${sizeStyles[size]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}
                ${className}
            `}
            style={{
                backgroundColor: colors.primary.green,
                color: colors.neutral.offWhite,
                boxShadow: shadows.glow.green,
            }}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
}

export function SecondaryButton({
    children,
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
                inline-flex items-center justify-center gap-2 font-bold rounded-2xl
                transition-all duration-200 active:scale-95
                ${sizeStyles[size]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}
                ${className}
            `}
            style={{
                backgroundColor: colors.secondary.orange,
                color: colors.neutral.offWhite,
                boxShadow: shadows.glow.orange,
            }}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
}

export function OutlineButton({
    children,
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
                inline-flex items-center justify-center gap-2 font-bold rounded-2xl
                border-2 transition-all duration-200 active:scale-95
                ${sizeStyles[size]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/5'}
                ${className}
            `}
            style={{
                borderColor: colors.primary.green,
                color: colors.primary.green,
                backgroundColor: 'transparent',
            }}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div
                    className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin"
                    style={{ borderTopColor: colors.primary.green }}
                />
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
}

export function GhostButton({
    children,
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
                inline-flex items-center justify-center gap-2 font-medium rounded-xl
                transition-all duration-200
                hover:bg-white/10
                ${sizeStyles[size]}
                ${fullWidth ? 'w-full' : ''}
                ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
                ${className}
            `}
            style={{
                color: colors.neutral.lightGray,
                backgroundColor: 'transparent',
            }}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
}
