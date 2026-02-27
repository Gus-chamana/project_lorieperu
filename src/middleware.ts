import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Solo aplicar al path /admin y sus rutas hijas
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Permitir acceso a la ruta de login
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Verificar si existe la cookie de sesión del administrador
        const adminSession = request.cookies.get('lorie_admin_session');

        if (!adminSession?.value) {
            // Si no existe, redirigir al login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
