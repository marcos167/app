import { X, Utensils, Video, Image as ImageIcon } from "lucide-react";
import { colors } from "@/theme/chefex-theme";

interface CreateContentSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateContentSheet({ isOpen, onClose }: CreateContentSheetProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`relative w-full max-w-md bg-[#1C1917] border-t sm:border border-white/10 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden pointer-events-auto transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white">Criar novo</h3>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-stone-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Options Grid */}
                <div className="p-6 grid gap-4">
                    {/* Recipe Option */}
                    <button className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all active:scale-[0.98]">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Utensils size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">Receita</h4>
                            <p className="text-xs text-stone-400">Compartilhe seus pratos</p>
                        </div>
                    </button>

                    {/* Reel Option */}
                    <button className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all active:scale-[0.98]">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Video size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">Reel</h4>
                            <p className="text-xs text-stone-400">Vídeo curto de até 60s</p>
                        </div>
                    </button>

                    {/* Post Option */}
                    <button className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl transition-all active:scale-[0.98]">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <ImageIcon size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">Post</h4>
                            <p className="text-xs text-stone-400">Foto e legenda rápida</p>
                        </div>
                    </button>
                </div>

                {/* Footer Safe Area */}
                <div className="pb-8" />
            </div>
        </div>
    );
}
