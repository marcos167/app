'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Video, X, RotateCcw, Check, Aperture, Square, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraCaptureProps {
    mode: 'photo' | 'video';
    onCapture: (file: File) => void;
    onClose: () => void;
}

export function CameraCapture({ mode, onCapture, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [timer, setTimer] = useState(0);

    // Initial Camera Start
    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [facingMode]);

    const startCamera = async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode, height: { ideal: 1920 } }, // High res
                audio: mode === 'video'
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            alert("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    // --- PHOTO LOGIC ---
    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const { videoWidth, videoHeight } = videoRef.current;
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
                // Flip if user facing
                if (facingMode === 'user') {
                    context.translate(videoWidth, 0);
                    context.scale(-1, 1);
                }
                context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);
            }
        }
    };

    const confirmPhoto = () => {
        if (capturedImage) {
            fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
                    onCapture(file);
                });
        }
    };

    // --- VIDEO LOGIC ---
    const startRecording = () => {
        if (stream) {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                setRecordedChunks(chunks);
                const blob = new Blob(chunks, { type: 'video/webm' });
                const file = new File([blob], "video.webm", { type: 'video/webm' });
                onCapture(file); // Auto finish for now, or preview?
                // For simplicity, just auto-finish
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTimer(0);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Timer Effect
    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
                if (timer >= 60) stopRecording(); // 60s limit
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // --- RENDER ---
    if (capturedImage) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
                <img src={capturedImage} className="flex-1 object-contain" />
                <div className="p-6 flex justify-between items-center bg-black">
                    <button onClick={() => setCapturedImage(null)} className="p-3 bg-stone-800 rounded-full text-white">
                        <RotateCcw />
                    </button>
                    <button onClick={confirmPhoto} className="px-8 py-3 bg-blue-500 rounded-full text-white font-bold flex items-center gap-2">
                        Próximo <Check />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="relative flex-1 overflow-hidden bg-stone-900 rounded-b-3xl">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                <canvas ref={canvasRef} className="hidden" />

                <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-md">
                    <X />
                </button>

                <button onClick={switchCamera} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-md">
                    <RefreshCcw size={20} />
                </button>

                {isRecording && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/80 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-white text-xs font-mono font-bold">{formatTime(timer)}</span>
                    </div>
                )}
            </div>

            <div className="h-32 bg-black flex items-center justify-center relative">
                {mode === 'photo' ? (
                    <button
                        onClick={takePhoto}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform"
                    >
                        <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                    </button>
                ) : (
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${isRecording ? 'border-red-500' : 'border-white'}`}
                    >
                        {isRecording ? (
                            <div className="w-8 h-8 bg-red-500 rounded-sm"></div>
                        ) : (
                            <div className="w-16 h-16 bg-red-500 rounded-full"></div>
                        )}
                    </button>
                )}

                <div className="absolute bottom-4 text-stone-500 text-[10px] uppercase font-bold tracking-widest">
                    {mode === 'photo' ? 'FOTO' : 'VÍDEO'}
                </div>
            </div>
        </div>
    );
}
