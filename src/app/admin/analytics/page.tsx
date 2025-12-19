'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, Eye, Target, Activity } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { auth } from '@/lib/auth';

interface GrowthMetric {
    date: string;
    new_users: number;
    total_users: number;
    active_users: number;
}

interface TopRecipe {
    id: number;
    title: string;
    author: string;
    views: number;
    likes: number;
    rating: number;
}

interface ConversionMetrics {
    visitors: number;
    signups: number;
    active_users: number;
    conversion_rate: number;
}

export default function AnalyticsPage() {
    const [growthData, setGrowthData] = useState<GrowthMetric[]>([]);
    const [topRecipes, setTopRecipes] = useState<TopRecipe[]>([]);
    const [conversion, setConversion] = useState<ConversionMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = auth.getToken();
            const headers = { 'Authorization': `Bearer ${token}` };

            const [growthRes, recipesRes, conversionRes] = await Promise.all([
                fetch(`${API_URL}/api/analytics/growth?days=30`, { headers }),
                fetch(`${API_URL}/api/analytics/top-recipes?limit=10`, { headers }),
                fetch(`${API_URL}/api/analytics/conversion`, { headers })
            ]);

            if (growthRes.ok) setGrowthData(await growthRes.json());
            if (recipesRes.ok) setTopRecipes(await recipesRes.json());
            if (conversionRes.ok) setConversion(await conversionRes.json());
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type: 'users' | 'recipes', format: 'csv' | 'xlsx') => {
        try {
            const token = auth.getToken();
            const response = await fetch(`${API_URL}/api/reports/${type}/export?format=${format}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error('Export failed:', err);
            alert('Erro ao exportar dados');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <button className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Activity size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                        <p className="text-stone-400 text-sm">Métricas e insights do Chefex</p>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport('users', 'csv')}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-bold text-sm transition-all"
                    >
                        📊 Exportar Usuários (CSV)
                    </button>
                    <button
                        onClick={() => handleExport('users', 'xlsx')}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-bold text-sm transition-all"
                    >
                        📊 Exportar Usuários (Excel)
                    </button>
                    <button
                        onClick={() => handleExport('recipes', 'csv')}
                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl font-bold text-sm transition-all"
                    >
                        🍜 Exportar Receitas (CSV)
                    </button>
                    <button
                        onClick={() => handleExport('recipes', 'xlsx')}
                        className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-xl font-bold text-sm transition-all"
                    >
                        🍜 Exportar Receitas (Excel)
                    </button>
                </div>
            </div>


            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* Conversion Metrics */}
                    {conversion && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Eye size={20} className="text-purple-400" />
                                    <span className="text-xs text-stone-400 uppercase font-bold">Visitantes</span>
                                </div>
                                <p className="text-3xl font-black text-white">{conversion.visitors.toLocaleString()}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Users size={20} className="text-blue-400" />
                                    <span className="text-xs text-stone-400 uppercase font-bold">Cadastros</span>
                                </div>
                                <p className="text-3xl font-black text-white">{conversion.signups.toLocaleString()}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp size={20} className="text-green-400" />
                                    <span className="text-xs text-stone-400 uppercase font-bold">Usuários Ativos</span>
                                </div>
                                <p className="text-3xl font-black text-white">{conversion.active_users.toLocaleString()}</p>
                            </div>

                            <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Target size={20} className="text-amber-400" />
                                    <span className="text-xs text-stone-400 uppercase font-bold">Taxa de Conversão</span>
                                </div>
                                <p className="text-3xl font-black text-white">{conversion.conversion_rate}%</p>
                            </div>
                        </div>
                    )}

                    {/* Growth Chart */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Crescimento de Usuários (30 dias)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="total_users" stroke="#3b82f6" name="Total" strokeWidth={2} />
                                <Line type="monotone" dataKey="active_users" stroke="#10b981" name="Ativos" strokeWidth={2} />
                                <Line type="monotone" dataKey="new_users" stroke="#f59e0b" name="Novos" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Recipes */}
                    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Top 10 Receitas</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="p-4">#</th>
                                        <th className="p-4">Receita</th>
                                        <th className="p-4">Autor</th>
                                        <th className="p-4">Visualizações</th>
                                        <th className="p-4">Curtidas</th>
                                        <th className="p-4">Avaliação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2A2A2A]">
                                    {topRecipes.map((recipe, index) => (
                                        <tr key={recipe.id} className="hover:bg-[#252525] transition-colors">
                                            <td className="p-4 font-bold text-amber-400">#{index + 1}</td>
                                            <td className="p-4 text-white font-medium">{recipe.title}</td>
                                            <td className="p-4 text-stone-400">{recipe.author}</td>
                                            <td className="p-4 text-blue-400">{recipe.views.toLocaleString()}</td>
                                            <td className="p-4 text-pink-400">{recipe.likes.toLocaleString()}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">
                                                    ⭐ {recipe.rating.toFixed(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
