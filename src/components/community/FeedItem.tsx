import Link from "next/link";
import { Heart, MessageCircle, Bookmark, Share2, Play, Crown } from "lucide-react";
import { FeedContent } from "@/lib/community-data";
import { useState } from "react";

interface FeedItemProps {
    item: FeedContent;
}

export function FeedItem({ item }: FeedItemProps) {
    const [liked, setLiked] = useState(item.liked || false);
    const [saved, setSaved] = useState(item.saved || false);
    const [likeCount, setLikeCount] = useState(item.likesCount);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    const handleSave = () => setSaved(!saved);

    // Render logic based on type
    const renderMedia = () => {
        if (item.type === 'reel') {
            return (
                <div className="relative aspect-[9/16] bg-black">
                    <img
                        src={item.thumbnail}
                        alt="Reel thumbnail"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <Play size={24} className="text-white fill-white ml-1" />
                        </div>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-md text-[10px] font-bold text-white">
                        {item.duration}
                    </div>
                </div>
            );
        }

        if (item.type === 'post') {
            return (
                <div className="relative aspect-square bg-[#2A2725]">
                    <img
                        src={item.image}
                        alt="Post image"
                        className="w-full h-full object-cover"
                    />
                </div>
            );
        }

        // Recipe (default)
        return (
            <Link href={`/recipes/${item.id}`}>
                <div className="relative aspect-[4/3] bg-[#2A2725]">
                    <img
                        src={item.image}
                        alt="Recipe image"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1">
                        🍳 Ver Receita
                    </div>
                </div>
            </Link>
        );
    };

    const getTypeBadge = () => {
        switch (item.type) {
            case 'reel':
                return <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Reel</span>;
            case 'post':
                return <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Post</span>;
            case 'recipe':
            default:
                return <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Receita</span>;
        }
    };

    return (
        <article className="bg-[#1C1917] rounded-3xl overflow-hidden border border-white/5 mb-6 shadow-xl">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="w-10 h-10 rounded-full border border-white/10"
                    />
                    <div>
                        <div className="flex items-center gap-1">
                            <h4 className="font-bold text-white text-sm">{item.author.name}</h4>
                            {item.author.isMasterChef && <Crown size={12} className="text-yellow-400" />}
                        </div>
                        {getTypeBadge()}
                    </div>
                </div>
                <button className="text-stone-500 hover:text-white transition-colors">
                    <span className="sr-only">Opções</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-current" />
                        <div className="w-1 h-1 rounded-full bg-current" />
                        <div className="w-1 h-1 rounded-full bg-current" />
                    </div>
                </button>
            </div>

            {/* Media */}
            <div className="w-full cursor-pointer" onDoubleClick={handleLike}>
                {renderMedia()}
            </div>

            {/* Actions */}
            <div className="p-3 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`transition-transform active:scale-95 ${liked ? 'text-red-500' : 'text-stone-300 hover:text-white'}`}
                    >
                        <Heart size={24} fill={liked ? "currentColor" : "none"} />
                    </button>
                    <button className="text-stone-300 hover:text-white transition-transform active:scale-95">
                        <MessageCircle size={24} />
                    </button>
                    <button className="text-stone-300 hover:text-white transition-transform active:scale-95">
                        <Share2 size={24} />
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className={`transition-transform active:scale-95 ${saved ? 'text-orange-400' : 'text-stone-300 hover:text-white'}`}
                >
                    <Bookmark size={24} fill={saved ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Content Info */}
            <div className="p-4 pt-2">
                <p className="font-bold text-white text-sm mb-1">{likeCount} curtidas</p>
                <div className="flex gap-2 text-sm">
                    <span className="font-bold text-white">{item.author.name}</span>
                    <span className="text-stone-300 line-clamp-2">
                        {/* Specific field for recipe is title, for others caption */}
                        {(item as any).title || (item as any).caption}
                    </span>
                </div>
                {(item as any).commentsCount > 0 && (
                    <button className="text-stone-500 text-xs mt-2 font-medium">
                        Ver todos os {(item as any).commentsCount} comentários
                    </button>
                )}
            </div>
        </article>
    );
}
