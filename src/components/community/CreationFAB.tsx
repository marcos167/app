'use client';

import { useState } from "react";
import { Plus, Video, Image, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function CreationFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const menuItems = [
        {
            id: 'reel',
            label: 'Reel',
            icon: Video,
            color: 'bg-gradient-to-tr from-pink-500 to-rose-500',
            onClick: () => router.push('/create/reel')
        },
        {
            id: 'post',
            label: 'Post',
            icon: Image,
            color: 'bg-gradient-to-tr from-blue-500 to-cyan-500',
            onClick: () => router.push('/create/post')
        },
        {
            id: 'recipe',
            label: 'Receita',
            icon: ChefHat,
            color: 'bg-gradient-to-tr from-amber-500 to-orange-500',
            onClick: () => router.push('/recipes/create') // Direct link
        }
    ];

    return (
        <>
            <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 pointer-events-none">
                <AnimatePresence>
                    {isOpen && (
                        <div className="flex flex-col gap-3 pb-3 pointer-events-auto">
                            {menuItems.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                    transition={{ delay: index * 0.05, type: 'spring' }}
                                    onClick={() => {
                                        item.onClick();
                                        setIsOpen(false);
                                        window.dispatchEvent(new CustomEvent('creation-menu-toggle', { detail: { isOpen: false } }));
                                    }}
                                    className="flex items-center gap-3 self-end group"
                                >
                                    <span className="bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                        {item.label}
                                    </span>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${item.color} border border-white/20 relative overflow-hidden group-hover:scale-110 transition-transform`}>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <item.icon size={20} />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                <motion.button
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    onClick={() => {
                        const newState = !isOpen;
                        setIsOpen(newState);
                        window.dispatchEvent(new CustomEvent('creation-menu-toggle', { detail: { isOpen: newState } }));
                    }}
                    className="pointer-events-auto relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-black/50 overflow-hidden group z-50"
                    style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Ripple Effect Container */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity"></div>

                    {/* Icon Transition */}
                    <div className="relative z-10">
                        <motion.div
                            variants={{
                                open: { rotate: 135 },
                                closed: { rotate: 0 }
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Plus size={28} className="text-white font-bold stroke-[3]" />
                        </motion.div>
                    </div>
                </motion.button>
            </div>


        </>
    );
}
