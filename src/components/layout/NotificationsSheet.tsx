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
        <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div
                className="absolute top-[70px] right-4 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-stone-50 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-900">
                    <h3 className="font-bold text-stone-800 dark:text-stone-200">Notificações</h3>
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">2 Novas</span>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 border-b border-stone-50 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer ${notif.unread ? 'bg-orange-50/30' : ''}`}
                        >
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xl shrink-0">
                                    {notif.icon}
                                </div>
                                <div>
                                    <h4 className={`text-sm ${notif.unread ? 'font-bold text-stone-900 dark:text-stone-100' : 'font-medium text-stone-700 dark:text-stone-300'}`}>
                                        {notif.title}
                                    </h4>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-0.5">
                                        {notif.desc}
                                    </p>
                                    <span className="text-[10px] text-stone-400 font-medium mt-1 block">{notif.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-3 text-center border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
                    <button className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                        Marcar todas como lidas
                    </button>
                </div>
            </div>
        </div>
    );
}
