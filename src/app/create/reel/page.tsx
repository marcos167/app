'use client';

import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ArrowLeft, Film, Upload } from "lucide-react";
import Link from 'next/link';
import { CameraCapture } from "@/components/camera/CameraCapture";
import { useRouter } from 'next/navigation';

export default function CreateReelPage() {
    const router = useRouter();
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [showCamera, setShowCamera] = useState(true);

    const handleCapture = (file: File) => {
        setCapturedFile(file);
        setShowCamera(false);
    };

    if (showCamera) {
        return (
            <CameraCapture
                mode="video"
                onCapture={handleCapture}
                onClose={() => router.back()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0C0A09] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-sm w-full bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 shadow-2xl">
                {capturedFile ? (
                    <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden mb-6 border border-stone-800 relative bg-black">
                        <video
                            src={URL.createObjectURL(capturedFile)}
                            className="w-full h-full object-cover"
                            autoPlay loop muted
                        />
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold mb-6">Novo Reel</h1>
                )}

                <div className="mb-6 text-left">
                    <label className="text-xs font-bold text-stone-500 uppercase ml-1">Legenda</label>
                    <textarea
                        placeholder="Descreva seu vídeo..."
                        className="w-full bg-black/40 border border-stone-800 rounded-xl p-4 text-sm text-white placeholder-stone-500 mt-1 focus:outline-none focus:border-pink-500/50 min-h-[80px]"
                    />
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowCamera(true)} className="flex-1 py-3 rounded-xl border border-white/10 text-stone-400 hover:text-white transition-colors text-sm font-bold">
                        Gravar Outro
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/20">
                        Publicar Reel
                    </button>
                </div>
            </div>
        </div>
    );
}
