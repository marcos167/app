'use client';

import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome & Date */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-stone-400">Bem Vindo Meu Mestre Oque vamos fazer hoje!</p>
                </div>
                <div className="flex gap-3">
                    <a href="/admin/recipes/create">
                        <button className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all text-sm flex items-center gap-2">
                            <span>✍️</span> Criar Nova Receita
                        </button>
                    </a>
                    <button
                        onClick={() => {
                            const data = [
                                ['ID', 'Nome', 'Status', 'Data'],
                                ['1', 'Receita Teste', 'Ativa', '2024-01-01'],
                                // Mock data for report
                            ];
                            const csvContent = "data:text/csv;charset=utf-8," +
                                data.map(e => e.join(",")).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", "relatorio_receitas.csv");
                            document.body.appendChild(link);
                            link.click();
                        }}
                        className="px-4 py-2 bg-[#252525] text-stone-300 font-medium rounded-lg hover:bg-[#333] transition-all text-sm"
                    >
                        Baixar Relatório ⬇️
                    </button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Total de Receitas', value: '1,284', trend: '+12%', icon: '🍜', color: 'blue' },
                    { title: 'Receitas Publicadas', value: '24', trend: '+5 Hoje', icon: '✅', color: 'green' },
                    { title: 'Comentários Pendentes', value: '18', trend: 'Ação Necessária', icon: '💬', color: 'orange' },
                    { title: 'Usuários Ativos', value: '8.4k', trend: '+18% Semanal', icon: '👥', color: 'purple' },
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-2xl shadow-sm hover:border-stone-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-${kpi.color}-500/10 text-${kpi.color}-500 text-2xl`}>
                                {kpi.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.trend.includes('+') ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {kpi.trend}
                            </span>
                        </div>
                        <h3 className="text-stone-500 text-sm font-medium mb-1">{kpi.title}</h3>
                        <p className="text-3xl font-bold text-white">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Chart (Mock) */}
                <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Engajamento Mensal</h3>
                        <select className="bg-[#252525] border-none text-xs text-stone-400 rounded-lg px-3 py-1 outline-none">
                            <option>Últimos 30 dias</option>
                            <option>Últimos 7 dias</option>
                        </select>
                    </div>
                    {/* Mock Bars */}
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[40, 65, 34, 78, 56, 45, 89, 23, 67, 78, 54, 88].map((h, i) => (
                            <div key={i} className="w-full bg-[#252525] hover:bg-[var(--color-primary)] rounded-t-sm transition-colors relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h * 10}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-stone-600 font-mono">
                        <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                        <span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Categorias Populares</h3>
                    <div className="space-y-5">
                        {[
                            { name: 'Pratos Brasileiros', count: 450, pct: '70%' },
                            { name: 'Sobremesas', count: 320, pct: '50%' },
                            { name: 'Saudáveis', count: 210, pct: '35%' },
                            { name: 'Rápidas', count: 180, pct: '28%' },
                        ].map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-stone-300">{cat.name}</span>
                                    <span className="text-stone-500">{cat.count} receitas</span>
                                </div>
                                <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" style={{ width: cat.pct }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/admin/categories">
                        <button className="w-full mt-8 py-3 rounded-xl border border-[#333] text-stone-400 text-sm hover:text-white hover:border-stone-500 transition-all">
                            Ver todas as categorias
                        </button>
                    </Link>
                </div>

            </div>

            {/* Recent Table */}
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Últimos Comentários</h3>
                    <Link href="/admin/comments">
                        <button className="text-[var(--color-primary)] text-sm font-bold hover:underline">Ver todos</button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-stone-400 text-sm">
                        <thead className="bg-[#202020] text-stone-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-4">Usuário</th>
                                <th className="p-4">Receita</th>
                                <th className="p-4">Comentário</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {[
                                { user: 'Ana Julia', recipe: 'Bolo de Fubá', comment: 'Receita maravilhosa! Adorei.', status: 'Pendente' },
                                { user: 'Carlos M.', recipe: 'Feijoada', comment: 'Faltou sal na minha...', status: 'Aprovado' },
                                { user: 'Mariana Silva', recipe: 'Pudim', comment: 'Posso substituir o leite?', status: 'Pendente' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-[#252525] transition-colors">
                                    <td className="p-4 font-bold text-white max-w-[150px] truncate">{row.user}</td>
                                    <td className="p-4 text-[var(--color-primary)]">{row.recipe}</td>
                                    <td className="p-4 max-w-xs truncate">{row.comment}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Pendente' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-stone-400 hover:text-white mr-3">✏️</button>
                                        <button className="text-stone-400 hover:text-red-500">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
