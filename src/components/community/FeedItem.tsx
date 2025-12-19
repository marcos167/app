'use client';

import Link from "next/link";
import { Heart, MessageCircle, Bookmark, Share2, Play, Crown, Volume2, VolumeX } from "lucide-react";
import { FeedContent } from "@/lib/community-data";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedItemProps {
    item: FeedContent;
}

export function FeedItem({ item }: FeedItemProps) {
    const [liked, setLiked] = useState(item.liked || false);
    const [saved, setSaved] = useState(item.saved || false);
    const [likeCount, setLikeCount] = useState(item.likesCount);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    const handleSave = () => setSaved(!saved);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Render logic based on type
    const renderMedia = () => {
        if (item.type === 'reel') {
            return (
                <div className="relative aspect-[9/16] bg-black group" onClick={togglePlay}>
                    <video
                        ref={videoRef}
                        src={item.videoUrl}
                        poster={item.thumbnail}
                        className="w-full h-full object-cover"
                        loop
                        playsInline
                        muted={isMuted}
                    />

                    {/* Play Button Overlay */}
                    <AnimatePresence>
                        {!isPlaying && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                            >
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                                    <Play size={32} className="text-white fill-white ml-2" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Controls Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <div className="bg-black/60 px-2 py-1 rounded-md text-[10px] font-bold text-white backdrop-blur-sm">
                            {item.duration}
                        </div>
                        <button onClick={toggleMute} className="p-1.5 bg-black/60 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                    </div>
                </div>
            );
        }

        if (item.type === 'post') {
            return (
                <div className="relative aspect-square bg-[#1C1C1C]">
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
                <div className="relative aspect-[4/5] bg-[#1C1C1C]">
                    <img
                        src={item.image}
                        alt="Recipe image"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-1">
                        Ver Receita 🍳
                    </div>
                </div>
            </Link>
        );
    };

    const getTypeBadge = () => {
        switch (item.type) {
            case 'reel':
                return <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 flex items-center gap-1"><Play size={10} fill="currentColor" /> Reel</span>;
            case 'post':
                return <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Post</span>;
            case 'recipe':
            default:
                return <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Receita</span>;
        }
    };

    return (
        <article className="bg-[#1C1C1C] rounded-none md:rounded-3xl overflow-hidden border-b md:border border-white/5 mb-2 md:mb-6 shadow-2xl">
            {/* Header */}
            <div className="p-3 flex items-center justify-between bg-[#1C1C1C]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-9 h-9 rounded-full border border-white/10 p-[1px] bg-gradient-to-tr from-stone-800 to-stone-700"
                        />
                        {item.author.isMasterChef && (
                            <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-[2px] border border-black">
                                <Crown size={8} className="text-black fill-black" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h4 className="font-bold text-white text-sm tracking-tight">{item.author.name}</h4>
                        </div>
                        {getTypeBadge()}
                    </div>
                </div>
                <button className="text-stone-500 hover:text-white transition-colors p-2">
                    <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-current" />
                        <div className="w-1 h-1 rounded-full bg-current" />
                        <div className="w-1 h-1 rounded-full bg-current" />
                    </div>
                </button>
            </div>

            {/* Media */}
            <div className="w-full cursor-pointer bg-black" onDoubleClick={handleLike}>
                {renderMedia()}
            </div>

            {/* Actions Bar */}
            <div className="p-3 flex items-center justify-between pb-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`transition-all active:scale-95 ${liked ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'text-white hover:text-stone-300'}`}
                    >
                        <Heart size={26} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 2} />
                    </button>
                    <button className="text-white hover:text-stone-300 transition-transform active:scale-95">
                        <MessageCircle size={26} strokeWidth={2} />
                    </button>
                    <button className="text-white hover:text-stone-300 transition-transform active:scale-95">
                        <Share2 size={26} strokeWidth={2} />
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className={`transition-transform active:scale-95 ${saved ? 'text-amber-500' : 'text-white hover:text-stone-300'}`}
                >
                    <Bookmark size={26} fill={saved ? "currentColor" : "none"} strokeWidth={2} />
                </button>
            </div>

            {/* Content Info */}
            <div className="px-3 pb-4">
                <p className="font-bold text-white text-sm mb-1">{likeCount.toLocaleString()} curtidas</p>
                <div className="text-sm leading-relaxed">
                    <span className="font-bold text-white mr-2">{item.author.name}</span>
                    <span className="text-stone-300">
                        {(item as any).title || (item as any).caption}
                    </span>
                </div>

                {(item as any).commentsCount > 0 && (
                    <button className="text-stone-500 text-xs mt-2 font-medium hover:text-stone-400">
                        Ver todos os {(item as any).commentsCount} comentários
                    </button>
                )}
                <p className="text-[10px] text-stone-600 uppercase mt-1">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                </p>
            </div>
        </article>
    );
}
