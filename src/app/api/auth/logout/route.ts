import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/security';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out' });

    // Clear the cookie
    response.cookies.set({
        name: COOKIE_NAME,
        value: '',
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}
