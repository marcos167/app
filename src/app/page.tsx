'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        if (auth.isAuthenticated()) {
            router.replace("/feed");
        } else {
            router.replace("/login");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
            <div className="animate-pulse">
                <span className="text-4xl">🥘</span>
            </div>
        </div>
    );
}
