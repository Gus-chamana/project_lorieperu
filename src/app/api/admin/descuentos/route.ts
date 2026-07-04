import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-admin';
import { verifyAdminSession } from '@/lib/security';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('lorie_admin_session');
    const isValid = await verifyAdminSession(adminSession?.value);
    if (!isValid) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const body = await req.json();
        
        // --- VALIDACIÓN DE SEGURIDAD ---
        const { 
            activo, 
            codigo_cupon, 
            descuento_porcentaje, 
            texto_principal, 
            color_fondo, 
            color_texto_cupon, 
            fecha_inicio, 
            fecha_fin 
        } = body;

        if (typeof activo !== 'boolean') {
            return NextResponse.json({ error: 'Campo "activo" requerido (boolean)' }, { status: 400 });
        }
        if (codigo_cupon && (typeof codigo_cupon !== 'string' || codigo_cupon.length > 50)) {
            return NextResponse.json({ error: 'Código de cupón inválido' }, { status: 400 });
        }
        if (descuento_porcentaje !== undefined && (typeof descuento_porcentaje !== 'number' || descuento_porcentaje < 0 || descuento_porcentaje > 100)) {
            return NextResponse.json({ error: 'Porcentaje de descuento debe estar entre 0 y 100' }, { status: 400 });
        }
        if (texto_principal && (typeof texto_principal !== 'string' || texto_principal.length > 100)) {
            return NextResponse.json({ error: 'Texto principal inválido' }, { status: 400 });
        }
        if (color_fondo && (typeof color_fondo !== 'string' || color_fondo.length > 20)) {
            return NextResponse.json({ error: 'Color de fondo inválido' }, { status: 400 });
        }
        if (color_texto_cupon && (typeof color_texto_cupon !== 'string' || color_texto_cupon.length > 20)) {
            return NextResponse.json({ error: 'Color de letra del cupón inválido' }, { status: 400 });
        }

        // Solo guardamos las propiedades conocidas y validadas
        const valorLimpio = { 
            activo, 
            codigo_cupon, 
            descuento_porcentaje, 
            texto_principal, 
            color_fondo, 
            color_texto_cupon, 
            fecha_inicio, 
            fecha_fin 
        };
        // -------------------------------

        const adminSupabase = createAdminClient();

        const { error } = await adminSupabase
            .from("configuracion_tienda")
            .upsert({
                llave: "promo_banner",
                valor: valorLimpio,
                actualizado_en: new Date().toISOString()
            }, { onConflict: "llave" });

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error al actualizar configuración:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
