import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('lorie_admin_session');

    if (!adminSession?.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const adminSupabase = createAdminClient();

        const { error } = await adminSupabase
            .from("configuracion_tienda")
            .upsert({
                llave: "promo_banner",
                valor: body,
                actualizado_en: new Date().toISOString()
            }, { onConflict: "llave" });

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error al actualizar configuración:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
