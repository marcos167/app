import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT, COOKIE_NAME } from '@/lib/security';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyJWT(token.value);

    if (!payload || !payload.userId) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch full user data from DB to ensure it's fresh
    const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
        select: {
            id: true,
            name: true,
            email: true,
            username: true,
            image: true,
            role: true,
            plan: true,
            level: true
        }
    });

    return NextResponse.json(user);
}
