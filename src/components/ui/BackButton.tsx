'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full shadow-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all group"
            aria-label="Voltar"
        >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
    );
}
