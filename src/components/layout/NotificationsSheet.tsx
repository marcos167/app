'use client';

interface NotificationsSheetProps {
    onClose: () => void;
}

export default function NotificationsSheet({ onClose }: NotificationsSheetProps) {
    const notifications = [
        { id: 1, title: 'Nova Receita da Vó!', desc: 'Aprenda a fazer o clássico Bolo de Fubá.', time: '2 min', icon: '👵', unread: true },
        { id: 2, title: 'Dica do Chef', desc: 'Como cortar cebola sem chorar? Veja agora.', time: '1h', icon: '🔪', unread: true },
        { id: 3, title: 'Você tem curtidas', desc: 'Sua foto do Risoto recebeu 5 novos corações.', time: '3h', icon: '❤️', unread: false },
    ];

    return (
        <div className="fixed inset-0 z-[60]" onClick={onClose}>
            <div className="absolute top-[70px] right-4 w-96 max-w-[calc(100vw-32px)]">
                <div
                    className="bg-[#1C1917]/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/60 border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 ring-1 ring-white/5"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-5 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                        <h3 className="font-bold text-lg text-white relative z-10 tracking-tight">Notificações</h3>
                        <span className="bg-[#FF4D6D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20 relative z-10">
                            2 Novas
                        </span>
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-4 border-t border-white/5 hover:bg-white/5 transition-all cursor-pointer group relative ${notif.unread ? 'bg-white/[0.02]' : ''}`}
                            >
                                {notif.unread && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                )}
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#2A2725] border border-white/5 flex items-center justify-center text-2xl shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        {notif.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm ${notif.unread ? 'font-bold text-white' : 'font-medium text-stone-400'} mb-1 group-hover:text-[var(--color-primary)] transition-colors`}>
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mix-blend-screen">
                                            {notif.desc}
                                        </p>
                                        <span className="text-[10px] text-stone-600 font-bold mt-2 block tracking-wider uppercase">
                                            {notif.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-sm">
                        <button className="w-full py-3 rounded-xl text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-secondary)] transition-all uppercase tracking-widest border border-transparent hover:border-[var(--color-primary)]/20">
                            Marcar todas como lidas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
