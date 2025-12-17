import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signJWT, COOKIE_NAME } from '@/lib/security';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, username } = body;

        if (!password || password.length < 6) {
            return NextResponse.json({ message: 'Senha muito curta' }, { status: 400 });
        }

        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email já cadastrado' },
                { status: 409 }
            );
        }

        // Check if username exists (if provided)
        if (username) {
            const existingUsername = await prisma.user.findUnique({
                where: { username },
            });
            if (existingUsername) {
                return NextResponse.json(
                    { message: 'Nome de usuário já existe' },
                    { status: 409 }
                );
            }
        }

        // 1. Hash Password
        const hashedPassword = await hashPassword(password);

        // 2. Create User
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                username: username || `@${name.toLowerCase().replace(/\s/g, '')}${Math.floor(Math.random() * 1000)}`,
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                level: 'Chef Iniciante',
                role: 'USER' // Ensure default role
            },
        });

        // 3. Generate JWT
        const token = await signJWT({
            userId: newUser.id,
            role: newUser.role,
            email: newUser.email
        });

        const { password: _, ...userWithoutPassword } = newUser;

        // 4. Return Response with Cookie
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
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'Erro ao criar conta' },
            { status: 500 }
        );
    }
}
