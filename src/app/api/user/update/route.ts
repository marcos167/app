import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        // email is the value in the form (potentially new), originalEmail is the identifier
        const { originalEmail, ...updates } = body;

        // The identifier is originalEmail if present, otherwise fall back to email if it was sent as the ID
        const userEmail = originalEmail || updates.email;

        if (!userEmail) {
            return NextResponse.json({ message: 'Email required for update' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { email: userEmail },
            data: updates,
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json(
            { message: 'Erro ao atualizar perfil' },
            { status: 500 }
        );
    }
}
