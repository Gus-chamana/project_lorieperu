import { createAdminClient } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getClientIp } from '@/lib/security';

export async function POST(req: Request) {
    try {
        // Rate limiting: máximo 10 intentos de login por IP cada 15 minutos
        const ip = getClientIp(req);
        if (!checkRateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000)) {
            return NextResponse.json({ error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' }, { status: 429 });
        }

        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Rellena todos los campos' }, { status: 400 });
        }

        const adminSupabase = createAdminClient();

        // Buscamos el usuario en la tabla admin_users por username únicamente
        // La contraseña se verifica con bcrypt.compare() contra el hash almacenado
        const { data, error } = await adminSupabase
            .from('admin_users')
            .select('id, username, password')
            .eq('username', username)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Verificar contraseña con bcrypt (compara texto plano vs hash almacenado)
        const passwordValid = await bcrypt.compare(password, data.password);
        if (!passwordValid) {
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
