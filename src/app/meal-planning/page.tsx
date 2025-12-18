'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { Calendar, Plus, Trash2, ChefHat, Coffee, Sun, Moon, Cookie, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { recipes } from '@/lib/data';

interface MealPlanItem {
    id: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeId: string;
    recipe?: typeof recipes[0];
}

const MEAL_TYPES = [
    { id: 'breakfast', label: 'Café da Manhã', icon: Coffee, color: 'bg-amber-500' },
    { id: 'lunch', label: 'Almoço', icon: Sun, color: 'bg-orange-500' },
    { id: 'dinner', label: 'Jantar', icon: Moon, color: 'bg-indigo-500' },
    { id: 'snack', label: 'Lanche', icon: Cookie, color: 'bg-pink-500' },
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function MealPlanningPage() {
    const router = useRouter();
    const [mealPlans, setMealPlans] = useState<MealPlanItem[]>([]);
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<string>('lunch');
    const [searchQuery, setSearchQuery] = useState('');

    // Get the start of the week (Sunday)
    function getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        return d;
    }

    // Format date as YYYY-MM-DD
    function formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    // Get days of current week
    function getWeekDays(): Date[] {
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(currentWeekStart.getDate() + i);
            days.push(day);
        }
        return days;
    }

    // Navigate weeks
    const previousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const nextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    // Add meal to plan
    const addMeal = (recipeId: string) => {
        const newMeal: MealPlanItem = {
            id: `${Date.now()}`,
            date: selectedDate,
            mealType: selectedMealType as any,
            recipeId,
            recipe: recipes.find(r => r.id === recipeId)
        };
        setMealPlans([...mealPlans, newMeal]);
        setShowRecipeModal(false);
    };

    // Remove meal from plan
    const removeMeal = (mealId: string) => {
        setMealPlans(mealPlans.filter(m => m.id !== mealId));
    };

    // Get meals for a specific date
    const getMealsForDate = (date: string) => {
        return mealPlans.filter(m => m.date === date);
    };

    // Generate shopping list
    const generateShoppingList = () => {
        const ingredientCount: { [key: string]: number } = {};
        mealPlans.forEach(meal => {
            meal.recipe?.ingredients.forEach(ing => {
                ingredientCount[ing] = (ingredientCount[ing] || 0) + 1;
            });
        });

        // Store in localStorage for shopping list page
        localStorage.setItem('generatedShoppingList', JSON.stringify(
            Object.entries(ingredientCount).map(([name, count]) => ({
                name,
                quantity: count > 1 ? `${count}x` : undefined
            }))
        ));

        router.push('/shopping-list');
    };

    // Filter recipes based on search
    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const weekDays = getWeekDays();

    return (
        <div className="min-h-screen bg-[#FDFCF5] dark:bg-[#0E0F10] font-sans pb-24">
            <Navbar />

            <main className="max-w-md mx-auto px-4 pt-4">
                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-2xl font-black text-stone-800 dark:text-white flex items-center gap-2">
                        <Calendar className="text-[var(--color-primary)]" />
                        Planejamento Semanal
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                        Organize suas refeições da semana
                    </p>
                </header>

                {/* Week Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={previousWeek} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-bold text-stone-700 dark:text-stone-300">
                        {weekDays[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                    </span>
                    <button onClick={nextWeek} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Week Calendar */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                    {weekDays.map((day, i) => {
                        const dateStr = formatDate(day);
                        const isToday = dateStr === formatDate(new Date());
                        const isSelected = dateStr === selectedDate;
                        const mealsCount = getMealsForDate(dateStr).length;

                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`p-2 rounded-xl flex flex-col items-center transition-all ${isSelected
                                        ? 'bg-[var(--color-primary)] text-white scale-105'
                                        : isToday
                                            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                                    }`}
                            >
                                <span className="text-xs font-medium">{WEEKDAYS[i]}</span>
                                <span className="text-lg font-bold">{day.getDate()}</span>
                                {mealsCount > 0 && (
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-[var(--color-primary)]'}`}></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Selected Day Meals */}
                <div className="space-y-4 mb-6">
                    <h2 className="font-bold text-stone-700 dark:text-stone-300">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h2>

                    {MEAL_TYPES.map(mealType => {
                        const meals = mealPlans.filter(m => m.date === selectedDate && m.mealType === mealType.id);
                        const Icon = mealType.icon;

                        return (
                            <div key={mealType.id} className="bg-white dark:bg-stone-900 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${mealType.color}`}>
                                            <Icon size={18} className="text-white" />
                                        </div>
                                        <span className="font-bold text-stone-700 dark:text-white">{mealType.label}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedMealType(mealType.id);
                                            setShowRecipeModal(true);
                                        }}
                                        className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {meals.length > 0 ? (
                                    <div className="space-y-2">
                                        {meals.map(meal => (
                                            <div key={meal.id} className="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
                                                <img
                                                    src={meal.recipe?.image}
                                                    alt={meal.recipe?.title}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-stone-800 dark:text-white truncate">
                                                        {meal.recipe?.title}
                                                    </p>
                                                    <p className="text-xs text-stone-500">{meal.recipe?.time}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeMeal(meal.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-stone-400 italic">Nenhuma refeição planejada</p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Generate Shopping List Button */}
                {mealPlans.length > 0 && (
                    <button
                        onClick={generateShoppingList}
                        className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        <ShoppingCart size={20} />
                        Gerar Lista de Compras
                    </button>
                )}
            </main>

            {/* Recipe Selection Modal */}
            {showRecipeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
                    <div className="bg-white dark:bg-stone-900 w-full max-h-[80vh] rounded-t-3xl p-6 overflow-y-auto animate-in slide-in-from-bottom">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-stone-800 dark:text-white">Escolher Receita</h3>
                            <button onClick={() => setShowRecipeModal(false)} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800">
                                ✕
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Buscar receita..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 rounded-xl bg-stone-100 dark:bg-stone-800 mb-4 outline-none"
                        />

                        <div className="space-y-3">
                            {filteredRecipes.slice(0, 10).map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => addMeal(recipe.id)}
                                    className="w-full flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-left"
                                >
                                    <img src={recipe.image} alt={recipe.title} className="w-16 h-16 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-stone-800 dark:text-white">{recipe.title}</p>
                                        <p className="text-sm text-stone-500">{recipe.time} • {recipe.difficulty}</p>
                                    </div>
                                    <ChefHat className="text-stone-400" size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <BottomNavigation />
        </div>
    );
}
