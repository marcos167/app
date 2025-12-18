'use client';

import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { colors, radius } from '@/theme/chefex-theme';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    success?: boolean;
    hint?: string;
    icon?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg',
};

/**
 * 📝 Input - Campo de entrada padronizado Chefex
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    success,
    hint,
    icon,
    size = 'md',
    type = 'text',
    className = '',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Determine border color based on state
    const getBorderColor = () => {
        if (error) return colors.state.error;
        if (success) return colors.primary.green;
        if (isFocused) return colors.secondary.orange;
        return 'transparent';
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
                <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.neutral.lightGray }}
                >
                    {label}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Icon */}
                {icon && (
                    <div
                        className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: isFocused ? colors.secondary.orange : colors.neutral.lightGray }}
                    >
                        {icon}
                    </div>
                )}

                {/* Input */}
                <input
                    ref={ref}
                    type={inputType}
                    className={`
                        w-full rounded-2xl outline-none transition-all duration-200
                        ${sizes[size]}
                        ${icon ? 'pl-12' : ''}
                        ${isPassword || error || success ? 'pr-12' : ''}
                    `}
                    style={{
                        backgroundColor: colors.neutral.darkGray,
                        color: colors.neutral.offWhite,
                        border: `2px solid ${getBorderColor()}`,
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {/* Right Icon (password toggle or state) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            style={{ color: colors.neutral.lightGray }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                    {!isPassword && success && (
                        <Check size={18} style={{ color: colors.primary.green }} />
                    )}
                    {!isPassword && error && (
                        <AlertCircle size={18} style={{ color: colors.state.error }} />
                    )}
                </div>
            </div>

            {/* Error / Hint */}
            {(error || hint) && (
                <p
                    className="text-xs mt-2 ml-1"
                    style={{ color: error ? colors.state.error : colors.neutral.lightGray }}
                >
                    {error || hint}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

interface TextAreaProps {
    label?: string;
    error?: string;
    hint?: string;
    size?: 'sm' | 'md' | 'lg';
    rows?: number;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    label,
    error,
    hint,
    size = 'md',
    rows = 4,
    className = '',
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return colors.state.error;
        if (isFocused) return colors.secondary.orange;
        return 'transparent';
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.neutral.lightGray }}
                >
                    {label}
                </label>
            )}

            <textarea
                ref={ref}
                rows={rows}
                className={`
                    w-full rounded-2xl outline-none transition-all duration-200 resize-none
                    ${sizes[size]}
                `}
                style={{
                    backgroundColor: colors.neutral.darkGray,
                    color: colors.neutral.offWhite,
                    border: `2px solid ${getBorderColor()}`,
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={props.placeholder}
                disabled={props.disabled}
                required={props.required}
                name={props.name}
                id={props.id}
                value={props.value}
                defaultValue={props.defaultValue}
                onChange={props.onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            />

            {(error || hint) && (
                <p
                    className="text-xs mt-2 ml-1"
                    style={{ color: error ? colors.state.error : colors.neutral.lightGray }}
                >
                    {error || hint}
                </p>
            )}
        </div>
    );
});

TextArea.displayName = 'TextArea';

export default Input;
