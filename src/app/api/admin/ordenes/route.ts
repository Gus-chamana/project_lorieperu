import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-admin';
import { verifyAdminSession } from '@/lib/security';

// Deshabilitar cache de Next.js/Vercel para que siempre devuelva datos frescos de Supabase
export const dynamic = 'force-dynamic';

// GET /api/admin/ordenes – Lista todas las órdenes (usa service role para bypassear RLS)
export async function GET() {
    try {
        // Verificar sesión administrativa contra la BD
        const cookieStore = cookies();
        const adminSession = cookieStore.get('lorie_admin_session');
        const isValid = await verifyAdminSession(adminSession?.value);
        if (!isValid) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('ordenes')
            .select(`
                *,
                cliente:clientes!cliente_id (*),
                direccion:direcciones!direccion_id (
                    *,
                    distrito:distritos!distrito_id ( nombre )
                ),
                metodo_envio:metodos_envio!metodo_envio_id ( nombre ),
                codigo_descuento:codigos_descuento!codigo_descuento_id ( codigo, valor, tipo_descuento ),
                orden_items (
                    id,
                    producto_id,
                    nombre_producto_snapshot,
                    precio_unitario_snapshot,
                    cantidad,
                    subtotal_linea,
                    producto:productos!producto_id ( nombre, producto_imagenes ( url_imagen ) )
                )
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
