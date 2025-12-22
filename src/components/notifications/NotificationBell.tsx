'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { auth } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [ws, setWs] = useState<WebSocket | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchNotifications();
        setupWebSocket();

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = auth.getToken();
            if (!token) return;

            const res = await fetch(`${API_URL}/api/notifications?limit=20`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                // Ensure data is an array before using array methods
                if (Array.isArray(data)) {
                    setNotifications(data);
                    setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
                } else {
                    console.warn('Notifications API returned non-array:', data);
                    setNotifications([]);
                    setUnreadCount(0);
                }
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const setupWebSocket = () => {
        const token = auth.getToken();
        const user = auth.getUser();
        if (!token || !user) return;

        const wsUrl = API_URL.replace('http', 'ws');
        const socket = new WebSocket(`${wsUrl}/api/ws/notifications/${user.id}`);

        socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        setWs(socket);
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const token = auth.getToken();
            await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like': return '❤️';
            case 'comment': return '💬';
            case 'follow': return '👤';
            case 'recipe': return '🍜';
            default: return '🔔';
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'agora';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
        return `${Math.floor(seconds / 86400)}d atrás`;
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-stone-800 transition-colors"
            >
                <Bell size={20} className="text-stone-400" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-96 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
                            <h3 className="font-bold text-white">Notificações</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-stone-800 rounded-lg transition-colors"
                            >
                                <X size={16} className="text-stone-400" />
                            </button>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-stone-500">
                                    <Bell size={48} className="mx-auto mb-2 opacity-20" />
                                    <p>Nenhuma notificação</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            if (notification.link) {
                                                window.location.href = notification.link;
                                            }
                                        }}
                                        className={`p-4 border-b border-[#2A2A2A] hover:bg-stone-900 transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-500/5' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white text-sm mb-1">
                                                    {notification.title}
                                                </p>
                                                <p className="text-stone-400 text-xs mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-stone-600 text-xs">
                                                    {getTimeAgo(notification.created_at)}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-[#2A2A2A] text-center">
                                <button
                                    onClick={() => {
                                        // Mark all as read
                                        notifications.forEach(n => {
                                            if (!n.is_read) markAsRead(n.id);
                                        });
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                                >
                                    Marcar todas como lidas
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
