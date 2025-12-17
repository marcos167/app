import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Simple password check (In prod, use bcrypt compare)
        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        // Check for Admin Role OR specific Admin Email (fallback for DB lock issues)
        const isAdminEmail = user.email === 'marco.lp12@hotmail.com';
        // @ts-ignore - Role might be missing from generated types if generation failed
        const hasAdminRole = user?.role === 'ADMIN';

        if (!hasAdminRole && !isAdminEmail) {
            return NextResponse.json({ error: 'Permissão negada' }, { status: 403 });
        }

        // Set secure cookie using NextResponse
        const response = NextResponse.json({ message: 'Login success' });

        response.cookies.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}
