import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import KitchenModeClient from "@/components/kitchen/KitchenModeClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function KitchenModePage({ params }: PageProps) {
    const { id } = await params;

    const recipe = await prisma.recipe.findUnique({
        where: { id }
    });

    if (!recipe) {
        notFound();
    }

    return <KitchenModeClient recipe={recipe} />;
}
