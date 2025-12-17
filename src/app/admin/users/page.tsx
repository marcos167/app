'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string; // 'ADMIN', 'EDITOR', 'MODERATOR', 'USER'
    plan: string;
    image?: string;
    createdAt: string;
    status?: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePlanChange = async (userId: string, newPlan: string) => {
        // Optimistic update
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));

        try {
            await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: newPlan })
            });
        } catch (e) {
            console.error('Failed to update plan', e);
            fetchUsers(); // Revert on failure
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (newRole === 'ADMIN') {
            alert('A promoção para ADMIN só pode ser feita manualmente pelo Super Admin no código.');
            return;
        }

        // Optimistic update
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));

        try {
            await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
        } catch (e) {
            console.error('Failed to update role', e);
            alert('Erro ao atualizar papel');
            fetchUsers();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este usuário permanentemente?')) return;
        try {
            await fetch(`/api/users/${id}`, { method: 'DELETE' });
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            alert('Erro ao excluir usuário');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Usuários & Planos</h1>
                    <p className="text-stone-400">Gerencie contas e assinaturas.</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-stone-400 text-sm">
                        <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-5">Usuário</th>
                                <th className="p-5">Email</th>
                                <th className="p-5">Papel (Role)</th>
                                <th className="p-5">Plano Atual</th>
                                <th className="p-5">Data Cadastro</th>
                                <th className="p-5 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center">Carregando usuários...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center">Nenhum usuário encontrado.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#252525] transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-700 overflow-hidden">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white font-bold">{user.name?.[0]}</div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-stone-400">{user.email}</td>

                                        {/* Role Selector */}
                                        <td className="p-5">
                                            <select
                                                value={user.role || 'USER'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={user.role === 'ADMIN'} // Cannot downgrade admins via UI here easily to prevent lockouts, optional
                                                className={`bg-[#333] text-xs font-bold px-3 py-1.5 rounded-lg outline-none border border-transparent focus:border-[var(--color-primary)] cursor-pointer
                                                    ${user.role === 'ADMIN' ? 'text-red-400 bg-red-500/10' :
                                                        user.role === 'EDITOR' ? 'text-blue-400 bg-blue-500/10' :
                                                            user.role === 'MODERATOR' ? 'text-green-400 bg-green-500/10' :
                                                                'text-stone-400'}`}
                                            >
                                                {user.role === 'ADMIN' && <option value="ADMIN">ADMIN</option>}
                                                <option value="USER">User</option>
                                                <option value="EDITOR">Editor</option>
                                                <option value="MODERATOR">Moderator</option>
                                            </select>
                                        </td>

                                        <td className="p-5">
                                            <select
                                                value={user.plan || 'Free'}
                                                onChange={(e) => handlePlanChange(user.id, e.target.value)}
                                                className={`bg-[#333] text-xs font-bold px-3 py-1.5 rounded-lg outline-none border border-transparent focus:border-[var(--color-primary)] cursor-pointer
                                                    ${user.plan === 'Premium' ? 'text-purple-400 bg-purple-500/10' :
                                                        user.plan === 'Chef Pro' ? 'text-orange-400 bg-orange-500/10' : 'text-stone-400'}`}
                                            >
                                                <option value="Free">Free</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Chef Pro">Chef Pro</option>
                                            </select>
                                        </td>
                                        <td className="p-5 font-mono text-xs">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all inline-flex items-center justify-center"
                                                title="Excluir Usuário"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
