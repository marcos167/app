import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logAdminAction } from '@/lib/logger';
import { verifyJWT, COOKIE_NAME } from '@/lib/security';
import { cookies } from 'next/headers';

async function getAdminUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token) return null;

    const payload = await verifyJWT(token.value);
    if (!payload || payload.role !== 'ADMIN') return null;
    return payload;
}

// Next.js 15+ needs params to be awaited
export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const admin = await getAdminUser();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();

        // SECURITY: Block attempts to set role to ADMIN via API
        if (body.role === 'ADMIN') {
            return NextResponse.json({ error: 'Cannot promote to ADMIN via this endpoint' }, { status: 403 });
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: body
        });

        // Log
        await logAdminAction(admin.sub as string, 'UPDATE_USER_ROLE', {
            targetUserId: user.id,
            changes: body
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const admin = await getAdminUser();
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await prisma.user.delete({
            where: { id: params.id }
        });

        // Log
        await logAdminAction(admin.sub as string, 'DELETE_USER', {
            targetUserId: params.id
        });

        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
}
