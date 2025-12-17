'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Check, ShoppingBag, ArrowLeft, Download, Upload, FileSpreadsheet, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from "@/components/layout/BottomNav";

export default function ShoppingListPage() {
    const [items, setItems] = useState<any[]>([]);
    const [newItem, setNewItem] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('shoppingList');
        if (saved) {
            setItems(JSON.parse(saved));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('shoppingList', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const handleExport = () => {
        const dataStr = JSON.stringify(items, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lista-de-compras-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportCSV = () => {
        // Headers
        const headers = ['Ingrediente', 'Receita', 'Preço (R$)', 'Data Adição', 'Status'];

        // Rows
        const rows = items.map(item => {
            const isObject = typeof item === 'object';
            return [
                isObject ? item.name : item,
                isObject ? item.recipeTitle : 'Outros',
                isObject ? (item.price || 0).toFixed(2).replace('.', ',') : '0,00',
                isObject ? new Date(item.addedAt).toLocaleDateString('pt-BR') : '-',
                isObject && item.checked ? 'Comprado' : 'Pendente'
            ].map(field => `"${field}"`).join(';'); // Semicolon for Excel BR
        });

        const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `lista-compras-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedItems = JSON.parse(event.target?.result as string);
                if (Array.isArray(importedItems)) {
                    if (confirm('Deseja substituir sua lista atual ou mesclar? (OK = Substituir, Cancelar = Mesclar)')) {
                        setItems(importedItems);
                    } else {
                        setItems(prev => [...prev, ...importedItems]);
                    }
                    alert('Lista importada com sucesso!');
                } else {
                    alert('Arquivo inválido.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao ler o arquivo.');
            }
        };
        reader.readAsText(file);
    };

    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const item = {
            id: crypto.randomUUID(),
            name: newItem,
            recipeTitle: 'Itens Avulsos',
            addedAt: new Date().toISOString(),
            checked: false,
            price: 0
        };

        setItems([...items, item]);
        setNewItem('');
    };

    const toggleCheck = (index: number) => {
        const newItems = [...items];
        if (typeof newItems[index] === 'object') {
            newItems[index].checked = !newItems[index].checked;
        } else {
            newItems[index] = {
                id: crypto.randomUUID(),
                name: newItems[index],
                recipeTitle: 'Antigos',
                addedAt: new Date().toISOString(),
                checked: true,
                price: 0
            };
        }
        setItems(newItems);
    };

    const updatePrice = (index: number, newPrice: string) => {
        const newItems = [...items];
        const numericPrice = parseFloat(newPrice.replace(',', '.')) || 0;

        if (typeof newItems[index] === 'object') {
            newItems[index].price = numericPrice;
        } else {
            // Upgrade legacy item
            newItems[index] = {
                id: crypto.randomUUID(),
                name: newItems[index],
                recipeTitle: 'Antigos',
                addedAt: new Date().toISOString(),
                checked: false,
                price: numericPrice
            };
        }
        setItems(newItems);
    };

    const removeItem = (itemToRemove: any) => {
        setItems(items.filter(i => i !== itemToRemove));
    };

    // Calculations
    const totalValue = items.reduce((acc, item) => {
        const price = typeof item === 'object' ? (item.price || 0) : 0;
        return acc + price;
    }, 0);

    const groupedItems = items.reduce((acc, item) => {
        const key = typeof item === 'object' ? (item.recipeTitle || 'Outros') : 'Outros';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-[#0c0c0c] pb-32">
            {/* Extended Header */}
            <div className="bg-white dark:bg-[#1A1A1A] sticky top-0 z-50 border-b border-stone-100 dark:border-stone-800 shadow-sm">
                <div className="max-w-md mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Compras</h1>
                                <p className="text-xs text-stone-500 font-medium">
                                    {items.filter(i => !i.checked && (typeof i !== 'object' || !i.checked)).length} itens pendentes
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-full">
                                <label className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:bg-white hover:text-[var(--color-primary)] hover:shadow-sm transition-all cursor-pointer" title="Importar">
                                    <Upload size={16} />
                                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                                </label>
                                <button onClick={handleExportCSV} className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:bg-white hover:text-green-600 hover:shadow-sm transition-all" title="Excel">
                                    <FileSpreadsheet size={16} />
                                </button>
                                <button onClick={handleExport} className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:bg-white hover:text-blue-500 hover:shadow-sm transition-all" title="Backup">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Total Widget */}
                    <div className="bg-gradient-to-r from-stone-800 to-stone-900 dark:from-stone-800 dark:to-black text-white p-5 rounded-2xl flex items-center justify-between shadow-lg">
                        <div className="flex flex-col">
                            <span className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-1">Total Estimado</span>
                            <span className="text-3xl font-bold text-green-400">
                                {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white/80">
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-6 mt-8 space-y-8">

                {/* Visual Add Input */}
                <form onSubmit={addItem} className="relative group">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Adicionar item rápido..."
                        className="w-full bg-white dark:bg-[#1A1A1A] border-0 rounded-2xl py-4 pl-12 pr-4 shadow-sm text-[var(--color-foreground)] placeholder-stone-400 focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    />
                    <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
                    <button
                        type="submit"
                        disabled={!newItem.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white p-2 rounded-xl opacity-0 group-focus-within:opacity-100 disabled:opacity-0 transition-opacity scale-90 hover:scale-100"
                    >
                        <Plus size={16} />
                    </button>
                </form>

                {/* Lists */}
                <AnimatePresence>
                    {Object.entries(groupedItems).length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center opacity-50"
                        >
                            <div className="w-24 h-24 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                                <span className="text-4xl">🥦</span>
                            </div>
                            <h3 className="text-lg font-bold text-stone-400">Tudo limpo!</h3>
                            <p className="text-sm text-stone-500 max-w-[200px]">Adicione ingredientes das receitas ou crie itens avulsos.</p>
                        </motion.div>
                    ) : (
                        Object.entries(groupedItems).map(([title, groupItems], groupIndex) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: groupIndex * 0.1 }}
                                className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-5 shadow-sm border border-stone-100 dark:border-stone-800"
                            >
                                {/* Group Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="font-bold text-lg text-[var(--color-foreground)]">{title}</h2>
                                        {groupItems[0]?.addedAt && (
                                            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                                                {new Date(groupItems[0].addedAt).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-stone-100 dark:border-stone-700 flex items-center justify-center text-xs font-bold text-stone-500">
                                        {groupItems.length}
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    {groupItems.map((item, idx) => {
                                        const originalIndex = items.indexOf(item);
                                        const name = typeof item === 'object' ? item.name : item;
                                        const isChecked = typeof item === 'object' ? item.checked : false;
                                        const price = typeof item === 'object' ? (item.price || 0) : 0;

                                        return (
                                            <motion.div
                                                layout
                                                key={typeof item === 'object' ? item.id : idx}
                                                className={`group flex flex-col gap-3 p-4 rounded-2xl transition-all border ${isChecked
                                                    ? 'bg-stone-50 dark:bg-black/20 border-transparent'
                                                    : 'bg-white dark:bg-[#1A1A1A] border-stone-100 dark:border-stone-800 hover:border-[var(--color-primary)]/30'
                                                    }`}
                                            >
                                                {/* Top Row: Check & Name */}
                                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCheck(originalIndex)}>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isChecked
                                                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                                                        : 'border-stone-300 dark:border-stone-600'
                                                        }`}>
                                                        {isChecked && <Check size={14} className="text-white" />}
                                                    </div>

                                                    <span className={`flex-1 font-medium text-lg transition-colors ${isChecked
                                                        ? 'text-stone-400 line-through'
                                                        : 'text-stone-700 dark:text-stone-300'
                                                        }`}>
                                                        {name}
                                                    </span>

                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${isChecked
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                        }`}>
                                                        {isChecked ? 'Comprado' : 'Pendente'}
                                                    </span>
                                                </div>

                                                {/* Bottom Row: Price Input & Actions */}
                                                <div className="flex items-center pl-9 gap-3">
                                                    <div className="flex items-center gap-2 flex-1 bg-stone-100 dark:bg-stone-900 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 transition-all">
                                                        <span className="text-stone-400 text-xs">R$</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={price || ''}
                                                            onChange={(e) => updatePrice(originalIndex, e.target.value)}
                                                            className="bg-transparent border-0 p-0 w-full text-sm font-semibold text-stone-700 dark:text-stone-300 focus:ring-0"
                                                            placeholder="0,00"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeItem(item);
                                                        }}
                                                        className="p-1.5 text-stone-300 hover:text-red-500 transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
            <BottomNav />
        </div>
    );
}
