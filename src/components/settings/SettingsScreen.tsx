'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { auth } from '@/lib/auth';
import PlansModal from '@/components/profile/PlansModal';
import PersonalDataForm from '@/components/profile/PersonalDataForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';

export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme(); // Assuming toggle links to light/dark
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('pt');
    const [isPremium, setIsPremium] = useState(false); // Mock premium status

    // Theme logic handling 'system' could be added to ThemeContext later
    // For now we map visual selection to our binary theme or mock the 'system' UI
    const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('light');

    // Modal States
    const [showPlans, setShowPlans] = useState(false);
    const [showPersonalData, setShowPersonalData] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Sync local state with actual theme context on mount/change
        setSelectedTheme(theme === 'dark' ? 'dark' : 'light');
    }, [theme]);

    const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
        setSelectedTheme(mode);
        if (mode === 'system') {
            // Logic for system would go here. For now defaulting to light or current system.
            // Just for UI demo:
            console.log("System theme selected");
        } else {
            if (theme !== mode) toggleTheme();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Premium Card */}
            <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl transition-all duration-300
                ${isPremium
                    ? 'bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700'
                    : 'bg-gradient-to-br from-[var(--color-primary)] to-orange-600'}`}
            >
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <span className="text-2xl">👑</span>
                        </div>
                        {isPremium && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">Ativo</span>}
                    </div>

                    <h3 className="text-2xl font-bold mb-1">
                        {isPremium ? 'Receitas Premium' : 'Seja Premium'}
                    </h3>
                    <p className="text-white/80 text-sm mb-6 max-w-[80%]">
                        {isPremium
                            ? 'Você tem acesso ilimitado a todas as receitas e recursos exclusivos.'
                            : 'Desbloqueie receitas exclusivas, remova anúncios e acesse estatísticas avançadas.'}
                    </p>

                    <button
                        onClick={() => setShowPlans(true)}
                        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-transform active:scale-[0.98] shadow-lg
                            ${isPremium
                                ? 'bg-stone-700 text-stone-200 hover:bg-stone-600'
                                : 'bg-white text-[var(--color-primary)] hover:bg-orange-50'}`}
                    >
                        {isPremium ? 'Gerenciar Assinatura' : 'Ver Planos'}
                    </button>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            {/* Account Settings */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-2">Conta</h4>

                <div className="bg-white dark:bg-stone-800 rounded-2xl p-2 shadow-sm border border-stone-100 dark:border-stone-700">
                    <button
                        onClick={() => setShowPersonalData(true)}
                        className="w-full flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-700/50 rounded-xl transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-stone-100 dark:bg-stone-700 p-2 rounded-lg text-stone-600 dark:text-stone-300 group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-colors">
                                👤
                            </div>
                            <span className="text-stone-600 dark:text-stone-200 font-medium text-sm">Dados Pessoais</span>
                        </div>
                        <span className="text-stone-400 text-lg">›</span>
                    </button>

                    <div className="h-px bg-stone-100 dark:bg-stone-700 mx-3 my-1"></div>

                    <button
                        onClick={() => setShowPassword(true)}
                        className="w-full flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-700/50 rounded-xl transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-stone-100 dark:bg-stone-700 p-2 rounded-lg text-stone-600 dark:text-stone-300 group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-colors">
                                🔒
                            </div>
                            <span className="text-stone-600 dark:text-stone-200 font-medium text-sm">Alterar Senha</span>
                        </div>
                        <span className="text-stone-400 text-lg">›</span>
                    </button>

                    <div className="h-px bg-stone-100 dark:bg-stone-700 mx-3 my-1"></div>

                    <button className="w-full flex items-center justify-between p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-red-500 transition-colors">
                                🚪
                            </div>
                            <span className="text-red-500 font-medium text-sm">Sair da Conta</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* General Settings */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-2">Geral</h4>

                {/* Theme Selector */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-sm border border-stone-100 dark:border-stone-700">
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-200 mb-4">Aparência</label>
                    <div className="grid grid-cols-3 gap-2 bg-stone-100 dark:bg-stone-900 p-1.5 rounded-xl">
                        {[
                            { id: 'light', label: 'Claro', icon: '☀️' },
                            { id: 'dark', label: 'Escuro', icon: '🌙' },
                            { id: 'system', label: 'Auto', icon: '💻' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleThemeChange(item.id as any)}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                    ${selectedTheme === item.id
                                        ? 'bg-white dark:bg-stone-700 text-[var(--color-primary)] shadow-sm'
                                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="hidden sm:inline">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Selector */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-sm border border-stone-100 dark:border-stone-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-xl">
                            🌐
                        </div>
                        <div>
                            <p className="text-sm font-bold text-stone-700 dark:text-stone-200">Idioma</p>
                            <p className="text-xs text-stone-400">Idioma do aplicativo</p>
                        </div>
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-stone-50 dark:bg-stone-900 border-none text-stone-600 dark:text-stone-300 text-sm font-medium rounded-lg py-2 pl-3 pr-8 cursor-pointer focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    >
                        <option value="pt">Português (BR)</option>
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-2">Notificações</h4>

                <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-sm border border-stone-100 dark:border-stone-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl">
                            🔔
                        </div>
                        <div>
                            <p className="text-sm font-bold text-stone-700 dark:text-stone-200">Push Notifications</p>
                            <p className="text-xs text-stone-400">Receba novidades e alertas</p>
                        </div>
                    </div>

                    {/* IOS Style Toggle */}
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-[var(--color-primary)]' : 'bg-stone-200 dark:bg-stone-600'}`}
                    >
                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                </div>
            </div>

            {/* Links/Footer */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <button className="w-full py-3 text-stone-400 text-xs font-medium hover:text-[var(--color-primary)] transition-colors">
                    Termos de Uso • Política de Privacidade
                </button>
                <p className="text-center text-[10px] text-stone-300 mt-2">Versão 1.1.0 (Build 305)</p>
            </div>

            {/* GLOBAL MODALS */}
            {showPlans && <PlansModal onClose={() => setShowPlans(false)} />}
            {showPersonalData && (
                <PersonalDataForm
                    onClose={() => setShowPersonalData(false)}
                    currentUser={auth.getUser() || {}}
                    onSave={(newData) => {
                        auth.updateUser(newData);
                        // Trigger re-render or toast if needed
                    }}
                />
            )}
            {showPassword && <ChangePasswordForm onClose={() => setShowPassword(false)} />}

        </div>
    );
}
