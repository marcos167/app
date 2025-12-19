'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { Crown, Check, Zap, Flame, ShieldCheck, Star, ChefHat } from 'lucide-react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { PayPalButton } from '@/components/subscription/PayPalButton';

export default function PlansPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

    const handleSubscribe = async () => {
        const token = auth.getToken();
        if (!token) {
            router.push('/login?redirect=/plans');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const error = await res.json();
                if (res.status === 401) {
                    alert("Sessão Expirada: Por favor, faça login novamente.");
                    router.push('/login?redirect=/plans');
                    return;
                }
                throw new Error(error.detail || 'Erro ao criar sessão');
            }

            const data = await res.json();
            window.location.href = data.checkout_url;
        } catch (error: any) {
            alert(`Erro no Pagamento: ${error.message}`);
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-black font-sans pb-24 selection:bg-amber-500/30 overflow-hidden relative">
            <Navbar />

            {/* Animated Background Gradient */}
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-[#0A0A0A] to-black animate-pulse-slow pointer-events-none z-0"></div>

            <main className="max-w-6xl mx-auto px-4 pt-8 relative z-10 perspective-1000">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                        <Flame size={12} className="fill-amber-500 animate-pulse" />
                        Escolha o Seu Nível
                    </motion.div>

                    <h1 className="text-5xl font-black text-white italic tracking-tighter mb-4 drop-shadow-2xl">
                        EVOLUA <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-400 to-white">SUA COZINHA</span>
                    </h1>
                    <p className="text-stone-400 font-medium text-lg">
                        Começe grátis ou desbloqueie o poder total.
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 mx-auto max-w-5xl">

                    {/* Free Plan Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative w-full max-w-sm"
                    >
                        <div className="relative bg-[#0A0A0A]/50 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Cozinheiro</h3>
                                    <div className="text-stone-500 font-bold text-xs uppercase tracking-wider">Básico</div>
                                </div>
                                <div className="bg-stone-800/50 p-3 rounded-2xl">
                                    <ChefHat size={32} className="text-stone-400" />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-white tracking-tighter">Grátis</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    "Acesso a Receitas Básicas",
                                    "Salvar Favoritos",
                                    "Comunidade Básica",
                                    "Lista de Compras Simples"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center shrink-0">
                                            <Check size={12} className="text-stone-400" />
                                        </div>
                                        <span className="text-stone-400 font-medium text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                disabled
                                className="w-full h-14 bg-stone-800/50 rounded-xl font-bold text-stone-500 text-sm uppercase tracking-wide cursor-default border border-stone-700/50"
                            >
                                Plano Atual
                            </button>
                        </div>
                    </motion.div>


                    {/* MasterChef Card */}
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => { x.set(0); y.set(0); }}
                        className="relative group w-full max-w-sm"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-700"></div>

                        <div className="relative bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 overflow-hidden shadow-2xl transform-gpu">
                            {/* Background Decoration */}
                            <div className="absolute -right-10 -top-10 text-[140px] font-black text-white/[0.03] rotate-12 pointer-events-none select-none">
                                X
                            </div>

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">MasterChef</h3>
                                    <div className="text-amber-500 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                                        <Star size={10} className="fill-amber-500" /> Acesso Total
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-3 rounded-2xl shadow-lg shadow-amber-500/20">
                                    <Crown size={32} className="text-white fill-white" />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">19<span className="text-3xl">,90</span></span>
                                <span className="text-stone-500 font-bold">/mês</span>
                            </div>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="space-y-4 mb-8"
                            >
                                {[
                                    "Receitas Ilimitadas",
                                    "Vídeos 4K Exclusivos",
                                    "Inteligência Artificial Chef",
                                    "Zero Anúncios",
                                    "Conteúdo de Chefs Renomados",
                                    "Suporte VIP 24/7"
                                ].map((item, i) => (
                                    <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 group/item">
                                        <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover/item:bg-amber-500 group-hover/item:border-amber-500 transition-colors duration-300">
                                            <Check size={14} className="text-amber-500 group-hover/item:text-black stroke-[3] transition-colors duration-300" />
                                        </div>
                                        <span className="text-stone-300 font-medium text-sm group-hover/item:text-white transition-colors">{item}</span>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <button
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="relative w-full h-16 rounded-xl font-black text-white text-xl uppercase tracking-wide overflow-hidden group/btn hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"></div>

                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover/btn:animate-shimmer"></div>

                                <div className="absolute inset-0 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Assinar Agora <Zap size={22} className="fill-white" />
                                        </>
                                    )}
                                </div>
                            </button>

                            <div className="relative flex items-center gap-4 mb-4">
                                <div className="flex-1 h-px bg-white/5"></div>
                                <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest bg-[#0A0A0A] px-2">Ou</span>
                                <div className="flex-1 h-px bg-white/5"></div>
                            </div>

                            <PayPalButton planId="P-80439400W77468732NFCPTTY" />
                        </div>
                    </motion.div>

                </div>

                {/* Footer Trust */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 flex flex-col items-center gap-4 text-center opacity-60 hover:opacity-100 transition-opacity"
                >
                    <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Processado por Stripe & PayPal
                    </div>
                </motion.div>
            </main>

            <BottomNavigation />
        </div>
    );
}
