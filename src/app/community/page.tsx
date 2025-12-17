'use client';

import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { Send, User, MoreVertical, Search, Phone, Video } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function CommunityPage() {
    const [messages, setMessages] = useState([
        { id: 1, user: 'Maria Chef', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', text: 'Alguém tem uma dica para o molho não talhar? 🥘', time: '10:00', isMe: false },
        { id: 2, user: 'João Cook', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao', text: 'Tente adicionar o creme de leite com o fogo desligado! Funciona sempre.', time: '10:02', isMe: false },
        { id: 3, user: 'Você', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', text: 'Obrigado João! Vou testar agora mesmo.', time: '10:05', isMe: true },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            user: 'Você',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        }]);
        setInput('');
    };

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-stone-950 pb-24 font-sans overflow-hidden">
            {/* Immersive Background */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-secondary)]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <Navbar />

            <main className="max-w-md mx-auto w-full h-[calc(100vh-140px)] flex flex-col pt-4 px-2 relative z-10">

                {/* Active Chefs Header */}
                <div className="mb-4">
                    <h2 className="px-4 text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Chefs Online</h2>
                    <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar snap-x">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer group snap-start">
                                <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)]">
                                    <div className="w-full h-full rounded-full border-2 border-white dark:border-stone-950 overflow-hidden bg-stone-200">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-stone-950 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-[10px] font-bold text-stone-600 dark:text-stone-300 truncate w-full text-center">Chef {i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Container */}
                <div className="flex-grow bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-xl border border-white/50 dark:border-stone-800 flex flex-col overflow-hidden relative">

                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white/40 dark:bg-stone-800/40">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                                <h1 className="font-bold text-stone-800 dark:text-white leading-tight">Comunidade VIP</h1>
                                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">128 Online</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-[var(--color-primary)]">
                            <Search size={20} className="stroke-[2.5] opacity-60 hover:opacity-100 cursor-pointer" />
                            <MoreVertical size={20} className="stroke-[2.5] opacity-60 hover:opacity-100 cursor-pointer" />
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-6 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                                <img src={msg.avatar} className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 shadow-sm self-end mb-1" />

                                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                    {!msg.isMe && <span className="text-[10px] font-bold text-stone-400 ml-3 mb-1">{msg.user}</span>}

                                    <div className={`p-4 rounded-3xl relative shadow-sm ${msg.isMe
                                        ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-br-none shadow-[var(--color-primary)]/20'
                                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 rounded-bl-none border border-stone-100 dark:border-stone-700'
                                        }`}>
                                        <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                                    </div>
                                    <span className="text-[9px] font-bold text-stone-300 mt-1 px-1 opacity-60">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/80 dark:bg-stone-900/80 border-t border-stone-100 dark:border-stone-800 backdrop-blur-md">
                        <div className="flex gap-2 items-center bg-stone-100 dark:bg-stone-950/50 p-1.5 rounded-[1.5rem] border border-stone-200 dark:border-stone-800 focus-within:ring-2 ring-[var(--color-primary)]/20 transition-all shadow-inner">
                            <button className="p-2.5 bg-white dark:bg-stone-800 text-stone-400 rounded-full hover:text-[var(--color-primary)] transition-colors shadow-sm">
                                <User size={18} />
                            </button>

                            <input
                                placeholder="Digite sua mensagem..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-grow bg-transparent border-none outline-none text-sm font-medium px-2 dark:text-white placeholder:text-stone-400"
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />

                            <button
                                onClick={handleSend}
                                className={`p-2.5 rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${input.trim() ? 'bg-[var(--color-primary)]' : 'bg-stone-300 dark:bg-stone-800'}`}
                            >
                                <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            <BottomNav />
        </div>
    );
}
