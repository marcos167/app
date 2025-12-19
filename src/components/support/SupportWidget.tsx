'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { auth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

type Message = {
    id: number;
    sender: 'user' | 'bot' | 'support';
    content: string;
    created_at: string;
};

export default function SupportWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ticketStatus, setTicketStatus] = useState('bot');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    const initialMessage: Message = {
        id: 0,
        sender: 'bot',
        content: 'Olá! Sou seu assistente virtual do Chefex. Como posso ajudar hoje? (Dica: Pergunte sobre preços, receitas ou problemas)',
        created_at: new Date().toISOString()
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        const token = auth.getToken();
        if (!token) {
            setMessages([initialMessage]);
            return;
        }

        try {
            const res = await fetch('/api/support/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTicketStatus(data.status);
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages);
                } else {
                    setMessages([initialMessage]);
                }
            }
        } catch (error) {
            console.error(error);
            setMessages([initialMessage]);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const token = auth.getToken();
        if (!token) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'bot',
                content: 'Por favor, faça login para usar o suporte.',
                created_at: new Date().toISOString()
            }]);
            return;
        }

        // Optimistic Update
        const tempId = Date.now();
        const userMsg: Message = {
            id: tempId,
            sender: 'user',
            content: inputText,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/support/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: userMsg.content })
            });

            if (res.ok) {
                const newMessages = await res.json();
                // Replace optimistic or append (API returns [user_msg, bot_msg])
                // We actually just append the bot response because user msg is already there?
                // API returns both. Let's filter or just specific handling.
                // Actually safer to reload or append ONLY Bot message if we trust ID.
                const botMsg = newMessages.find((m: Message) => m.sender !== 'user');
                if (botMsg) {
                    setMessages(prev => [...prev, botMsg]);
                }

                // Check if escalated
                // We could check status from ticket refresh but let's infer from content or next load
            } else {
                throw new Error('Falha ao enviar');
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                content: 'Desculpe, tive um erro de conexão. Tente novamente.',
                created_at: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const pathname = usePathname();
    const isCommunity = pathname === '/community';
    const isAdminPanel = pathname?.startsWith('/admin');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleToggle = (e: CustomEvent) => {
            setIsMenuOpen(e.detail.isOpen);
        };
        window.addEventListener('creation-menu-toggle' as any, handleToggle);
        return () => window.removeEventListener('creation-menu-toggle' as any, handleToggle);
    }, []);

    const bottomClass = isCommunity && isMenuOpen ? 'bottom-96' :
        isCommunity ? 'bottom-36' :
            'bottom-24';

    // Don't render in admin panel
    if (isAdminPanel) return null;

    return (
        <div className={`fixed right-4 z-50 flex flex-col items-end transition-all duration-300 ${bottomClass}`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[350px] h-[500px] mb-4 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-stone-800 to-stone-900 border-b border-stone-700 flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                    <Bot size={18} className="text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Suporte Chefex</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${ticketStatus === 'in_queue' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                        <span className="text-[10px] text-stone-400 capitalize">
                                            {ticketStatus === 'in_queue' ? 'Aguardando Humano' : '24/7 Online'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white p-1">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/50 scrollbar-thin scrollbar-thumb-stone-800">
                            {messages.map((msg, idx) => {
                                const isUser = msg.sender === 'user';
                                return (
                                    <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
                                            ? 'bg-amber-600 text-white rounded-br-none'
                                            : 'bg-stone-800 text-stone-200 rounded-bl-none border border-stone-700'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-stone-800 p-3 rounded-2xl rounded-bl-none border border-stone-700 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-stone-900 border-t border-stone-700">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-full px-4 py-2 focus-within:border-amber-500/50 transition-colors"
                            >
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Digite sua dúvida..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder-stone-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="text-amber-500 hover:text-amber-400 disabled:opacity-50 transition-colors p-1"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-amber-500 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.4)] flex items-center justify-center text-black font-bold z-50 border-2 border-white/10"
            >
                {isOpen ? <X size={24} /> : (
                    <div className="relative">
                        <MessageCircle size={26} className="stroke-[2.5]" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    </div>
                )}
            </motion.button>
        </div>
    );
}
