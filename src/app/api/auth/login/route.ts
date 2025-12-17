import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signJWT, comparePassword, COOKIE_NAME } from '@/lib/security';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. Fetch User
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Credenciais inválidas' }, // Generic message for security
                { status: 401 }
            );
        }

        // 2. Hash Verification
        const isValid = await comparePassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { message: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        // 3. Generate JWT
        const token = await signJWT({
            userId: user.id,
            role: user.role,
            email: user.email
        });

        // 4. Create Response with HTTPOnly Cookie
        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json(userWithoutPassword);

        response.cookies.set({
            name: COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
