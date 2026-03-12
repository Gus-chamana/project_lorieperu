import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

// Deshabilitar cache de Next.js/Vercel para que siempre devuelva datos frescos de Supabase
export const dynamic = 'force-dynamic';

// GET /api/admin/ordenes – Lista todas las órdenes (usa service role para bypassear RLS)
export async function GET() {
    try {
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('ordenes')
            .select(`
                *,
                cliente:clientes!cliente_id (*),
                direccion:direcciones!direccion_id (*)
            `)
            .order('creado_en', { ascending: false });

        if (error) {
            console.error('Error al obtener órdenes:', error);
            return NextResponse.json({ error: 'Error al cargar órdenes', detalle: error.message }, { status: 500 });
        }

        return NextResponse.json(data || [], { status: 200 });
    } catch (e) {
        console.error('Excepción en GET /api/admin/ordenes:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
