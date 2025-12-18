'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * 🎯 Subscription Context - Sistema de Assinatura Chefex
 * 
 * Planos:
 * - free: Cozinheiro (padrão)
 * - master: Master Chef (premium - criação de receitas)
 * 
 * Empresa: Axis Software
 */

export type PlanType = 'free' | 'master';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'none';

export interface SubscriptionData {
    plan: PlanType;
    planName: string;
    status: SubscriptionStatus;
    startDate: Date | null;
    endDate: Date | null;
    canCreate: boolean;
    canAccessPremium: boolean;
    isTrialing: boolean;
    trialDaysLeft: number;
}

interface SubscriptionContextType extends SubscriptionData {
    isLoading: boolean;
    upgradeToMaster: () => Promise<{ success: boolean; message: string }>;
    cancelSubscription: () => Promise<{ success: boolean; message: string }>;
    restoreSubscription: () => Promise<{ success: boolean; message: string }>;
    refreshSubscription: () => Promise<void>;
}

const PLAN_DETAILS = {
    free: {
        planName: 'Cozinheiro',
        canCreate: false,
        canAccessPremium: false,
    },
    master: {
        planName: 'Master Chef',
        canCreate: true,
        canAccessPremium: true,
    },
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Simula armazenamento local (em produção seria API + backend)
const STORAGE_KEY = 'chefex_subscription';

function getStoredSubscription(): Partial<SubscriptionData> | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
        const data = JSON.parse(stored);
        return {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
        };
    } catch {
        return null;
    }
}

function storeSubscription(data: Partial<SubscriptionData>) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
    }));
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [plan, setPlan] = useState<PlanType>('free');
    const [status, setStatus] = useState<SubscriptionStatus>('none');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrialing, setIsTrialing] = useState(false);

    // Carregar assinatura do storage
    useEffect(() => {
        const stored = getStoredSubscription();
        if (stored) {
            setPlan(stored.plan || 'free');
            setStatus(stored.status || 'none');
            setStartDate(stored.startDate || null);
            setEndDate(stored.endDate || null);
            setIsTrialing(stored.isTrialing || false);

            // Verificar se expirou
            if (stored.endDate && new Date(stored.endDate) < new Date()) {
                setPlan('free');
                setStatus('expired');
            }
        }
        setIsLoading(false);
    }, []);

    // Calcular dias restantes de trial
    const trialDaysLeft = endDate && isTrialing
        ? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

    const details = PLAN_DETAILS[plan];

    /**
     * 🚀 Upgrade para Master Chef
     */
    const upgradeToMaster = async (): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);

        try {
            // MOCK: Simula chamada para App Store / Play Store
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Em produção:
            // 1. Abrir popup de pagamento (Stripe, App Store, Play Store)
            // 2. Aguardar confirmação
            // 3. Validar recibo no backend
            // 4. Backend atualiza banco de dados
            // 5. Frontend recebe confirmação

            const now = new Date();
            const endDateNew = new Date(now);
            endDateNew.setDate(endDateNew.getDate() + 30); // 30 dias

            setPlan('master');
            setStatus('active');
            setStartDate(now);
            setEndDate(endDateNew);
            setIsTrialing(false);

            storeSubscription({
                plan: 'master',
                status: 'active',
                startDate: now,
                endDate: endDateNew,
                isTrialing: false,
            });

            setIsLoading(false);
            return { success: true, message: 'Bem-vindo ao Master Chef! 🎉' };

        } catch (error) {
            setIsLoading(false);
            return { success: false, message: 'Erro ao processar pagamento. Tente novamente.' };
        }
    };

    /**
     * ❌ Cancelar assinatura
     */
    const cancelSubscription = async (): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mantém benefícios até o fim do ciclo
            setStatus('cancelled');

            storeSubscription({
                plan,
                status: 'cancelled',
                startDate,
                endDate,
                isTrialing,
            });

            setIsLoading(false);
            return {
                success: true,
                message: `Assinatura cancelada. Você ainda tem acesso até ${endDate?.toLocaleDateString('pt-BR')}.`
            };

        } catch (error) {
            setIsLoading(false);
            return { success: false, message: 'Erro ao cancelar. Tente novamente.' };
        }
    };

    /**
     * 🔄 Restaurar assinatura (reativar)
     */
    const restoreSubscription = async (): Promise<{ success: boolean; message: string }> => {
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // MOCK: Verificar com App Store / Play Store
            if (status === 'cancelled' && endDate && endDate > new Date()) {
                setStatus('active');
                storeSubscription({
                    plan,
                    status: 'active',
                    startDate,
                    endDate,
                    isTrialing,
                });
                setIsLoading(false);
                return { success: true, message: 'Assinatura reativada! 🎉' };
            }

            setIsLoading(false);
            return { success: false, message: 'Nenhuma assinatura encontrada para restaurar.' };

        } catch (error) {
            setIsLoading(false);
            return { success: false, message: 'Erro ao restaurar. Tente novamente.' };
        }
    };

    /**
     * 🔄 Atualizar status da assinatura
     */
    const refreshSubscription = async (): Promise<void> => {
        // Em produção: buscar status atual do backend
        const stored = getStoredSubscription();
        if (stored) {
            setPlan(stored.plan || 'free');
            setStatus(stored.status || 'none');
        }
    };

    return (
        <SubscriptionContext.Provider
            value={{
                plan,
                planName: details.planName,
                status,
                startDate,
                endDate,
                canCreate: plan === 'master' && (status === 'active' || status === 'cancelled'),
                canAccessPremium: plan === 'master' && (status === 'active' || status === 'cancelled'),
                isTrialing,
                trialDaysLeft,
                isLoading,
                upgradeToMaster,
                cancelSubscription,
                restoreSubscription,
                refreshSubscription,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within SubscriptionProvider');
    }
    return context;
}

/**
 * Hook simplificado para verificar Master Chef
 */
export function useMasterChef() {
    const { canCreate, planName, plan } = useSubscription();
    return {
        isMasterChef: canCreate,
        planName,
        isFree: plan === 'free',
    };
}
