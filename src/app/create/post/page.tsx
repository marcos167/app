'use client';

import { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { ArrowLeft, Image, Upload } from "lucide-react";
import Link from 'next/link';
import { CameraCapture } from "@/components/camera/CameraCapture";
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
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
                mode="photo"
                onCapture={handleCapture}
                onClose={() => router.back()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0C0A09] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-sm w-full bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 shadow-2xl">
                {capturedFile ? (
                    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 border border-stone-800">
                        <img src={URL.createObjectURL(capturedFile)} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold mb-6">Criar Post</h1>
                )}

                <textarea
                    placeholder="Escreva uma legenda..."
                    className="w-full bg-black/40 border border-stone-800 rounded-xl p-4 text-sm text-white placeholder-stone-500 mb-6 focus:outline-none focus:border-blue-500/50 min-h-[100px]"
                />

                <div className="flex gap-3">
                    <button onClick={() => setShowCamera(true)} className="flex-1 py-3 rounded-xl border border-white/10 text-stone-400 hover:text-white transition-colors text-sm font-bold">
                        Tirar Outra
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20">
                        Compartilhar
                    </button>
                </div>
            </div>
        </div>
    );
}
