import { createAdminClient } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Rellena todos los campos' }, { status: 400 });
        }

        const adminSupabase = createAdminClient();

        // Buscamos el usuario en la tabla admin_users
        // Usamos el cliente admin para saltar el RLS que bloquea la lectura pública
        const { data, error } = await adminSupabase
            .from('admin_users')
            .select('id, username')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Si es válido, generamos la cookie de sesión segura
        const response = NextResponse.json({ success: true });

        response.cookies.set('lorie_admin_session', data.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 semana de sesión
        });

        return response;

    } catch (e) {
        console.error('Login error:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
