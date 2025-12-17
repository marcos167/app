import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signJWT, signRefreshToken, verifyJWT, hashToken, COOKIE_NAME } from '@/lib/security';
import { cookies } from 'next/headers';

const REFRESH_COOKIE_NAME = 'refresh_token';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    try {
        // 1. Verify Signature (First line of defense)
        const payload = await verifyJWT(refreshToken);
        if (!payload) {
            return NextResponse.json({ message: 'Invalid token signature' }, { status: 401 });
        }

        const hashedToken = await hashToken(refreshToken);

        // 2. Find in DB
        const savedToken = await prisma.refreshToken.findUnique({
            where: { hashedToken },
            include: { user: true }
        });

        // 3. Reuse Detection (CRITICAL)
        if (!savedToken || savedToken.revoked) {
            // If token reuse detected, invalidate ALL tokens for this user
            if (savedToken) {
                await prisma.refreshToken.updateMany({
                    where: { userId: savedToken.userId },
                    data: { revoked: true }
                });
                console.warn(`Token reuse detected for user ${savedToken.userId}. All sessions revoked.`);
            }
            return NextResponse.json({ message: 'Token reuse detected' }, { status: 403 });
        }

        // 4. Token Rotation
        // Revoke the used token
        await prisma.refreshToken.update({
            where: { id: savedToken.id },
            data: { revoked: true }
        });

        // Issue NEW tokens
        const newAccessToken = await signJWT({
            userId: savedToken.user.id,
            role: savedToken.user.role,
            email: savedToken.user.email
        });

        const newRefreshToken = await signRefreshToken({
            userId: savedToken.user.id
        });

        // Save new refresh token hash
        await prisma.refreshToken.create({
            data: {
                userId: savedToken.user.id,
                hashedToken: await hashToken(newRefreshToken),
                revoked: false,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });

        // 5. Update Cookies
        const response = NextResponse.json({ message: 'Refreshed' });

        response.cookies.set({
            name: COOKIE_NAME,
            value: newAccessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes (Access Token)
            path: '/',
        });

        response.cookies.set({
            name: REFRESH_COOKIE_NAME,
            value: newRefreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/', // Accessible to refresh endpoint
        });

        return response;

    } catch (error) {
        console.error('Refresh error', error);
        return NextResponse.json({ message: 'Refresh failed' }, { status: 500 });
    }
}
