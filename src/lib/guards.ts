import prisma from '@/lib/prisma';

/**
 * Checks if a user is the owner of a resource.
 * @param resourceId The ID of the resource (comment, recipe, etc.)
 * @param userId The ID of the user attempting the action
 * @param model The Prisma model name (e.g., 'comment', 'recipe')
 * @returns boolean
 */
export async function isResourceOwner(resourceId: string, userId: string, model: 'comment' | 'recipe'): Promise<boolean> {
    try {
        // @ts-ignore - Dynamic access is tricky in TS without generic wrapper, keeping simple for prototype
        const resource = await prisma[model].findUnique({
            where: { id: resourceId },
            select: { userId: true, authorId: true } // Handle both userId (comments) and authorId (recipes)
        });

        if (!resource) return false;

        const ownerId = resource.userId || resource.authorId;
        return ownerId === userId;
    } catch (e) {
        console.error('Ownership check failed', e);
        return false;
    }
}

/**
 * Checks if user is Owner OR Admin.
 */
export async function isOwnerOrAdmin(resourceId: string, userId: string, userRole: string, model: 'comment' | 'recipe'): Promise<boolean> {
    if (userRole === 'ADMIN') return true;
    return await isResourceOwner(resourceId, userId, model);
}
