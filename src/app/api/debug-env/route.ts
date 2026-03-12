import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// DEBUG temporal: expone qué Supabase URL/proyecto usa el servidor en Vercel
// BORRAR DESPUÉS DE DIAGNOSTICAR
export async function GET() {
    return NextResponse.json({
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NO CONFIGURADO',
        SUPABASE_SERVICE_ROLE_KEY_PRESENT: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        SUPABASE_SERVICE_ROLE_KEY_PREFIX: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30) + '...',
        NODE_ENV: process.env.NODE_ENV,
    });
}
