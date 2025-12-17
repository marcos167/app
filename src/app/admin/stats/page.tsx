'use client';

export default function AdminStats() {
    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Estatísticas</h1>
            <p className="text-stone-400">Análise detalhada do crescimento do app.</p>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-12 text-center text-stone-500">
                <p className="text-4xl mb-4">📈</p>
                <p>Módulo em desenvolvimento.</p>
                <p className="text-sm">Gráficos avançados estarão disponíveis na v2.</p>
            </div>
        </div>
    );
}
