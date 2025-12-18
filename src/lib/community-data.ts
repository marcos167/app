import { RecipeRankingData } from "./ranking";

export type ContentType = 'recipe' | 'post' | 'reel';

export interface Author {
    id: string;
    name: string;
    avatar: string;
    isMasterChef?: boolean;
}

// Extends RecipeRankingData to fit into FeedContent
export interface FeedRecipe extends RecipeRankingData {
    type: 'recipe';
    createdAt: string; // Mapped from publishedAt
    liked?: boolean;
    saved?: boolean;
}

export interface BaseContent {
    id: string;
    type: ContentType;
    author: Author;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    savesCount: number;
    liked?: boolean;
    saved?: boolean;
}

export interface PostContent extends BaseContent {
    type: 'post';
    image: string;
    caption: string;
}

export interface ReelContent extends BaseContent {
    type: 'reel';
    thumbnail: string;
    videoUrl: string; // Mock url
    duration: string; // e.g. "0:45"
    caption: string;
    viewsCount: number;
}

// Union type for the feed
export type FeedContent = FeedRecipe | PostContent | ReelContent;

// MOCK DATA

const AUTHORS: Author[] = [
    { id: '1', name: 'Chef Paola', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paola', isMasterChef: true },
    { id: '2', name: 'João Curry', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' },
    { id: '3', name: 'Ana Massas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', isMasterChef: true },
    { id: '4', name: 'Luiz Burger', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luiz' },
];

export const MOCK_POSTS: PostContent[] = [
    {
        id: 'p1',
        type: 'post',
        author: AUTHORS[1],
        createdAt: '2025-12-18T10:00:00Z',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
        caption: 'Almoço saudável de hoje! Salada com quinoa e muito sabor. 🥗 #fitness #saudavel',
        likesCount: 124,
        commentsCount: 12,
        savesCount: 5
    },
    {
        id: 'p2',
        type: 'post',
        author: AUTHORS[3],
        createdAt: '2025-12-17T18:30:00Z',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
        caption: 'Testando o ponto do novo blend para o burger da semana. Suculência nível máximo! 🍔🔥',
        likesCount: 342,
        commentsCount: 45,
        savesCount: 20
    }
];

export const MOCK_REELS: ReelContent[] = [
    {
        id: 'r1',
        type: 'reel',
        author: AUTHORS[0],
        createdAt: '2025-12-18T14:20:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1000&auto=format&fit=crop',
        videoUrl: '#', // Placeholder
        duration: '0:59',
        caption: 'O segredo do molho perfeito em 1 minuto! 🍝✨',
        viewsCount: 15400,
        likesCount: 2100,
        commentsCount: 150,
        savesCount: 890
    },
    {
        id: 'r2',
        type: 'reel',
        author: AUTHORS[2],
        createdAt: '2025-12-16T09:15:00Z',
        thumbnail: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1000&auto=format&fit=crop',
        videoUrl: '#',
        duration: '0:30',
        caption: 'Carbonara tradicional sem creme de leite! Aprenda já. 🥚🥓',
        viewsCount: 8900,
        likesCount: 1200,
        commentsCount: 80,
        savesCount: 400
    }
];
