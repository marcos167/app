import React from 'react';

export const Card = ({
    children,
    className = "",
    padding = "p-6",
    hover = false
}: {
    children: React.ReactNode;
    className?: string;
    padding?: string;
    hover?: boolean;
}) => {
    return (
        <div className={`
            bg-background rounded-2xl border border-muted/40 shadow-sm
            ${hover ? 'hover:shadow-md hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1' : ''}
            ${padding}
            ${className}
        `}>
            {children}
        </div>
    );
};
