import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/ratelimit';
import { verifyJWT, COOKIE_NAME } from '@/lib/security';
import { cookies } from 'next/headers';

// Helper to check admin role
async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token) return false;

    const payload = await verifyJWT(token.value);
    return payload && payload.role === 'ADMIN';
}

// PATCH: Update comment status (Admin only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { status } = await req.json(); // 'approved' | 'rejected'

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const comment = await prisma.comment.update({
            where: { id: params.id },
            data: { status }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json({ error: 'Error updating comment' }, { status: 500 });
    }
}

// DELETE: Delete a comment (Admin or Owner)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    // For now, let's strictly restrict DELETE to Admin for the moderation page context.
    // In a real app, we'd check owner via guards, but here we are focusing on the Admin panel.
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await prisma.comment.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Error deleting comment' }, { status: 500 });
    }
}
