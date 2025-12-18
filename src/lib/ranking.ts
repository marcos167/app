/**
 * 🏆 Ranking Algorithm - Chefex
 * 
 * Algoritmo avançado para ranking de receitas na comunidade.
 * Implementa score baseado em múltiplas variáveis com decay temporal.
 * 
 * Axis Software
 */

// ==================== TYPES ====================

export interface RecipeRankingData {
    id: string;
    title: string;
    image: string;
    author: {
        id: string;
        name: string;
        avatar: string;
        isMasterChef: boolean;
    };
    // Métricas
    avgRating: number;
    ratingCount: number;
    likesCount: number;
    savesCount: number;
    commentsCount: number;
    viewsCount: number;
    // Timestamps
    publishedAt: Date;
    lastInteractionAt: Date;
    // Moderação
    reportCount: number;
    isSpam: boolean;
    // Calculado
    score?: number;
    rank?: number;
    trend?: 'up' | 'down' | 'stable' | 'new';
    previousRank?: number;
}

export type RankingPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

// ==================== CONSTANTS ====================

const WEIGHTS = {
    // Quality (peso alto)
    AVG_RATING: 4.0,
    RATING_COUNT_LOG: 1.5,

    // Engagement
    LIKES: 0.3,
    SAVES: 0.5,   // Saves são mais valiosos
    COMMENTS: 0.4,
    VIEWS_LOG: 0.1,

    // Bonus
    MASTER_CHEF_BONUS: 0.2,
    VERIFIED_AUTHOR_BONUS: 0.1,

    // Penalties
    SPAM_PENALTY: -50,
    REPORT_PENALTY_PER: -2,

    // Time decay
    TIME_DECAY_HALF_LIFE_DAYS: 7, // Score decai pela metade a cada 7 dias
};

// ==================== ALGORITHM ====================

/**
 * Calcula o score de uma receita
 */
export function calculateRecipeScore(recipe: RecipeRankingData, period: RankingPeriod = 'weekly'): number {
    // Base: Qualidade
    const qualityScore = recipe.avgRating * WEIGHTS.AVG_RATING;

    // Credibilidade: log do número de avaliações (evita manipulação)
    const credibilityScore = Math.log(1 + recipe.ratingCount) * WEIGHTS.RATING_COUNT_LOG;

    // Engajamento
    const engagementScore =
        (recipe.likesCount * WEIGHTS.LIKES) +
        (recipe.savesCount * WEIGHTS.SAVES) +
        (recipe.commentsCount * WEIGHTS.COMMENTS) +
        (Math.log(1 + recipe.viewsCount) * WEIGHTS.VIEWS_LOG);

    // Bonus por Master Chef
    const authorBonus = recipe.author.isMasterChef ? WEIGHTS.MASTER_CHEF_BONUS : 0;

    // Penalidades
    let penalties = 0;
    if (recipe.isSpam) {
        penalties += WEIGHTS.SPAM_PENALTY;
    }
    penalties += recipe.reportCount * WEIGHTS.REPORT_PENALTY_PER;

    // Time Decay (decay exponencial)
    const timeFactor = calculateTimeFactor(recipe.publishedAt, period);

    // Score Final
    const rawScore = qualityScore + credibilityScore + engagementScore + authorBonus + penalties;
    const finalScore = rawScore * timeFactor;

    return Math.max(0, Math.round(finalScore * 100) / 100);
}

/**
 * Calcula o fator de tempo (decay)
 */
function calculateTimeFactor(publishedAt: Date, period: RankingPeriod): number {
    const now = new Date();
    const ageInMs = now.getTime() - new Date(publishedAt).getTime();
    const ageInDays = ageInMs / (1000 * 60 * 60 * 24);

    // Diferentes half-lives por período
    const halfLifeDays = {
        daily: 1,
        weekly: 7,
        monthly: 14,
        all_time: 30,
    }[period];

    // Decay exponencial: 0.5^(age/halfLife)
    return Math.pow(0.5, ageInDays / halfLifeDays);
}

/**
 * Filtra receitas por período
 */
function filterByPeriod(recipes: RecipeRankingData[], period: RankingPeriod): RecipeRankingData[] {
    const now = new Date();
    const cutoffDays = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        all_time: Infinity,
    }[period];

    if (cutoffDays === Infinity) return recipes;

    const cutoffDate = new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000);
    return recipes.filter(r => new Date(r.publishedAt) >= cutoffDate);
}

/**
 * Gera o ranking completo
 */
export function generateRanking(
    recipes: RecipeRankingData[],
    period: RankingPeriod = 'weekly',
    previousRanking?: Map<string, number>
): RecipeRankingData[] {
    // Filtrar por período
    const filteredRecipes = filterByPeriod(recipes, period);

    // Calcular scores
    const scoredRecipes = filteredRecipes.map(recipe => ({
        ...recipe,
        score: calculateRecipeScore(recipe, period),
    }));

    // Ordenar por score (desc)
    scoredRecipes.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Atribuir ranks e tendências
    return scoredRecipes.map((recipe, index) => {
        const rank = index + 1;
        const prevRank = previousRanking?.get(recipe.id);

        let trend: RecipeRankingData['trend'] = 'new';
        if (prevRank !== undefined) {
            if (rank < prevRank) trend = 'up';
            else if (rank > prevRank) trend = 'down';
            else trend = 'stable';
        }

        return {
            ...recipe,
            rank,
            trend,
            previousRank: prevRank,
        };
    });
}

/**
 * Obtém top N receitas
 */
export function getTopRecipes(
    recipes: RecipeRankingData[],
    limit: number = 10,
    period: RankingPeriod = 'weekly'
): RecipeRankingData[] {
    return generateRanking(recipes, period).slice(0, limit);
}

/**
 * Obtém receitas em alta (maior crescimento)
 */
export function getTrendingRecipes(
    recipes: RecipeRankingData[],
    limit: number = 5
): RecipeRankingData[] {
    // Simular tendência baseada em interações recentes
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return recipes
        .filter(r => new Date(r.lastInteractionAt) >= oneDayAgo)
        .sort((a, b) => {
            // Score de tendência = engajamento recente / idade
            const ageA = (now.getTime() - new Date(a.publishedAt).getTime()) / (1000 * 60 * 60);
            const ageB = (now.getTime() - new Date(b.publishedAt).getTime()) / (1000 * 60 * 60);
            const trendA = (a.likesCount + a.savesCount * 2) / Math.max(1, ageA);
            const trendB = (b.likesCount + b.savesCount * 2) / Math.max(1, ageB);
            return trendB - trendA;
        })
        .slice(0, limit);
}

// ==================== MOCK DATA ====================

export function generateMockRankingData(): RecipeRankingData[] {
    const mockRecipes: RecipeRankingData[] = [
        {
            id: '1',
            title: 'Risoto de Cogumelos Trufados',
            image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800',
            author: { id: '1', name: 'Chef Marco', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco', isMasterChef: true },
            avgRating: 4.9, ratingCount: 156, likesCount: 234, savesCount: 89, commentsCount: 45, viewsCount: 1200,
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
        {
            id: '2',
            title: 'Salmão Grelhado com Aspargos',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=800',
            author: { id: '2', name: 'Ana Cozinha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', isMasterChef: true },
            avgRating: 4.7, ratingCount: 98, likesCount: 189, savesCount: 67, commentsCount: 28, viewsCount: 890,
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
        {
            id: '3',
            title: 'Brownie de Chocolate Belga',
            image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800',
            author: { id: '3', name: 'Doce Maria', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', isMasterChef: true },
            avgRating: 4.8, ratingCount: 234, likesCount: 456, savesCount: 203, commentsCount: 92, viewsCount: 2100,
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
        {
            id: '4',
            title: 'Tacos Mexicanos Autênticos',
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800',
            author: { id: '4', name: 'Carlos Chef', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', isMasterChef: true },
            avgRating: 4.6, ratingCount: 178, likesCount: 312, savesCount: 145, commentsCount: 67, viewsCount: 1500,
            publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 30 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
        {
            id: '5',
            title: 'Pad Thai Tradicional',
            image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=800',
            author: { id: '5', name: 'Thai Chef', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thai', isMasterChef: true },
            avgRating: 4.5, ratingCount: 87, likesCount: 145, savesCount: 56, commentsCount: 23, viewsCount: 670,
            publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
        {
            id: '6',
            title: 'Carbonara Romana Original',
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=800',
            author: { id: '6', name: 'Mario Italiano', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mario', isMasterChef: true },
            avgRating: 4.9, ratingCount: 312, likesCount: 567, savesCount: 234, commentsCount: 156, viewsCount: 3200,
            publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
        {
            id: '7',
            title: 'Cheesecake de Frutas Vermelhas',
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800',
            author: { id: '7', name: 'Patissier Paula', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paula', isMasterChef: true },
            avgRating: 4.7, ratingCount: 145, likesCount: 289, savesCount: 178, commentsCount: 45, viewsCount: 1100,
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
        {
            id: '8',
            title: 'Ramen Japonês Caseiro',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800',
            author: { id: '8', name: 'Yuki San', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki', isMasterChef: true },
            avgRating: 4.8, ratingCount: 201, likesCount: 378, savesCount: 189, commentsCount: 78, viewsCount: 1800,
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            lastInteractionAt: new Date(Date.now() - 15 * 60 * 1000),
            reportCount: 0, isSpam: false,
        },
    ];

    return generateRanking(mockRecipes, 'weekly');
}
