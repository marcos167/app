// Tipos globais da aplicação Chefex - Axis Software

export interface Recipe {
    id: number | string;
    title: string;
    description: string;
    image: string;
    time: string;
    calories: string;
    servings: number;
    category: string;
    rating: number;
    reviews: number;
    is_premium: boolean;
    video_url?: string;
    status: string;
    ingredients?: string[];
    steps?: string[];
    created_at?: string;
}

export interface User {
    id?: string;
    name: string;
    email: string;
    image?: string;
    username?: string;
    bio?: string;
    role?: 'USER' | 'ADMIN';
    plan?: 'Free' | 'Masterchef';
    token?: string;
    refresh_token?: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
