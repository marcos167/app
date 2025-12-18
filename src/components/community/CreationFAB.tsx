'use client';

import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateContentSheet } from "./CreateContentSheet";
import { colors } from "@/theme/chefex-theme";

export function CreationFAB() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsSheetOpen(true)}
                className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-green-900/40 hover:scale-110 active:scale-95 transition-all duration-300 group"
                style={{
                    background: `linear-gradient(135deg, ${colors.primary.green} 0%, ${colors.primary.greenDark} 100%)`
                }}
            >
                {/* Ping Animation */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20 animate-ping group-hover:animate-none"></span>

                <Plus size={28} className="text-white transform group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
            </button>

            <CreateContentSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
            />
        </>
    );
}
