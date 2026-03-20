import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-admin';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    // 1. Verificar sesión de administrador
    const cookieStore = cookies();
    const adminSession = cookieStore.get('lorie_admin_session');

    if (!adminSession?.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const adminSupabase = createAdminClient();
        const id = params.id;
        const body = await req.json();

        // Extraer campos permitidos para actualizar
        const updateData: any = {};
        if (body.estado_pago) updateData.estado_pago = body.estado_pago;
        if (body.estado) updateData.estado = body.estado;
        if (body.envios_correo_count !== undefined) updateData.envios_correo_count = body.envios_correo_count;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No hay datos válidos para actualizar' }, { status: 400 });
        }

        // 2. Actualizar la orden en la base de datos (count:exact detecta si realmente se actualizó)
        const { error, count } = await adminSupabase
            .from("ordenes")
            .update(updateData, { count: 'exact' })
            .eq("id", id);

        if (error) throw error;

        if (count === 0) {
            // Esto ocurre cuando RLS bloquea el update silenciosamente (anon key sin permisos)
            // o cuando el ID no existe en la base de datos
            return NextResponse.json({
                error: `No se actualizó ninguna fila. Verifique que SUPABASE_SERVICE_ROLE_KEY esté configurada en Vercel → Settings → Environment Variables.`
            }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error al actualizar orden vía API:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
