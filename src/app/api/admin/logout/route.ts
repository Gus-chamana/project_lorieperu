import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Elimina la cookie de la sesión administrativa
    response.cookies.set('lorie_admin_session', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });

    return response;
}
