import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input = ({
    label,
    error,
    fullWidth = true,
    className = '',
    id,
    ...props
}: InputProps) => {
    const generatedId = React.useId();
    const inputId = id || props.name || generatedId;
    const widthClass = fullWidth ? "w-full" : "";

    return (
        <div className={`flex flex-col gap-1.5 ${widthClass}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-semibold text-foreground/80 ml-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
                    px-4 py-3 rounded-xl border-2 bg-background transition-all duration-200
                    placeholder:text-muted-foreground/60
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/20
                    ${error
                        ? 'border-danger text-danger focus:border-danger'
                        : 'border-muted hover:border-primary/50 focus:border-primary text-foreground'
                    }
                    ${className}
                `}
                {...props}
            />
            {error && (
                <span className="text-xs font-medium text-danger ml-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </span>
            )}
        </div>
    );
};
