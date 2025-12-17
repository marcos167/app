'use client';

import { useState } from 'react';

interface RecipeHeroImageProps {
    src: string;
    alt: string;
}

export default function RecipeHeroImage({ src, alt }: RecipeHeroImageProps) {
    const [imgSrc, setImgSrc] = useState(src || '/placeholder-food.jpg');

    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-stone-200 animate-pulse" /> {/* Loading background */}
            <img
                src={imgSrc}
                alt={alt}
                className="w-full h-full object-cover relative z-0"
                onError={() => {
                    setImgSrc('https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=2687&auto=format&fit=crop');
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
        </div>
    );
}
