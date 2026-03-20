import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

/**
 * GET /api/ordenes/[orden_id]/resumen
 *
 * Devuelve un resumen ligero de la orden (productos, totales, datos del cliente)
 * SIN importar el estado de pago. Se usa en el sidebar de la página de pago
 * para mostrar al usuario qué está pagando.
 *
 * NO expone datos sensibles — solo lo necesario para el resumen visual.
 */
export async function GET(
    _req: Request,
    { params }: { params: { orden_id: string } }
) {
    try {
        const { orden_id } = params;

        if (!orden_id) {
            return NextResponse.json({ error: 'orden_id requerido' }, { status: 400 });
        }

        const supabase = createAdminClient();

        const { data: orden, error: errOrden } = await supabase
            .from('ordenes')
            .select(`
                id,
                estado_pago,
                comprobante_url,
                subtotal,
                monto_descuento,
                costo_envio,
                total,
                clientes ( nombre_completo ),
                orden_items (
                    nombre_producto_snapshot,
                    cantidad,
                    precio_unitario_snapshot,
                    subtotal_linea
                )
            `)
            .eq('id', orden_id)
            .single();

        if (errOrden || !orden) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        // Normalizar cliente (puede venir como array u objeto según Supabase)
        const cliente = Array.isArray(orden.clientes) ? orden.clientes[0] : orden.clientes;

        return NextResponse.json({
            orden_id: orden.id,
            estado_pago: orden.estado_pago,
            comprobante_url: orden.comprobante_url,
            subtotal: orden.subtotal,
            monto_descuento: orden.monto_descuento,
            costo_envio: orden.costo_envio,
            total: orden.total,
            nombre_cliente: cliente?.nombre_completo ?? '',
            items: (orden.orden_items ?? []).map((item: {
                nombre_producto_snapshot: string;
                cantidad: number;
                precio_unitario_snapshot: number;
                subtotal_linea: number;
            }) => ({
                nombre: item.nombre_producto_snapshot,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario_snapshot,
                subtotal_linea: item.subtotal_linea,
            })),
        });

    } catch (e) {
        console.error('Error en GET /api/ordenes/[orden_id]/resumen:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
