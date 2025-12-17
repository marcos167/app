'use client';

export default function AdminSettings() {
    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
            <p className="text-stone-400">Ajustes gerais do sistema administrativo.</p>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Geral</h2>
                <div className="space-y-4 max-w-md">
                    <div className="flex items-center justify-between">
                        <span className="text-stone-400">Modo Manutenção</span>
                        <div className="w-12 h-6 bg-[#333] rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-stone-500 rounded-full transition-all"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
