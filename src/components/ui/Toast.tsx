'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        // Auto dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-[var(--color-primary)] text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-stone-800 text-white'
    };

    const icons = {
        success: '✅',
        error: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                } ${bgColors[type]}`}
        >
            <span className="text-xl">{icons[type]}</span>
            <p className="font-bold text-sm tracking-wide">{message}</p>
            <button onClick={() => setIsVisible(false)} className="ml-2 hover:opacity-70 transition-opacity">✕</button>
        </div>
    );
}
