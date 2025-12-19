'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Phase = 'community' | 'active' | 'partnerships';

interface PlatformStatus {
    phase: Phase;
    monetization_enabled: boolean;
    message: string;
}

const PHASE_CONFIG = {
    community: {
        emoji: '🟡',
        label: 'Fase Comunidade',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        tooltip: 'Acumule pontos e impacto agora!'
    },
    active: {
        emoji: '🟢',
        label: 'Monetização Ativa',
        color: 'bg-green-500/20 text-green-300 border-green-500/30',
        tooltip: 'Converta seus pontos em saldo real'
    },
    partnerships: {
        emoji: '🔵',
        label: 'Parcerias & Fundos',
        color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        tooltip: 'Ganhe através de colaborações'
    }
};

export function PlatformPhaseIndicator({ showTooltip = true }: { showTooltip?: boolean }) {
    const [status, setStatus] = useState<PlatformStatus | null>(null);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        fetch('/api/platform/status')
            .then(res => res.json())
            .then(data => setStatus(data))
            .catch(err => console.error('Failed to fetch platform status:', err));
    }, []);

    if (!status) return null;

    const config = PHASE_CONFIG[status.phase];

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold cursor-pointer transition-all hover:scale-105 ${config.color}`}
                onClick={() => showTooltip && setShowMessage(!showMessage)}
            >
                <span className="text-base">{config.emoji}</span>
                <span>{config.label}</span>
            </motion.div>

            {showTooltip && showMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-[#1C1917] border border-white/10 rounded-xl p-4 shadow-2xl z-50"
                >
                    <p className="text-xs text-stone-300 leading-relaxed">{status.message}</p>
                    <div className="mt-2 pt-2 border-t border-white/5">
                        <a href="/how-to-earn" className="text-xs text-amber-400 hover:underline font-bold">
                            Como ganhar no Chefex →
                        </a>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
