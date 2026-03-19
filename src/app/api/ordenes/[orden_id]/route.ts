import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

/**
 * GET /api/ordenes/[orden_id]
 *
 * Devuelve los datos completos de una orden SOLO si su estado_pago es 'PAGADO'.
 * Esta ruta es consumida por la página /confirmacion para:
 *   1. Verificar que el pago fue confirmado antes de mostrar la pantalla de éxito.
 *   2. Obtener todos los datos necesarios para armar y enviar el correo de confirmación.
 *
 * Usa el cliente admin (service role) para bypassear RLS y leer desde el servidor.
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

        // 1. Obtener la orden con su estado de pago, totales y relaciones
        const { data: orden, error: errOrden } = await supabase
            .from('ordenes')
            .select(`
                id,
                estado_pago,
                subtotal,
                monto_descuento,
                costo_envio,
                total,
                clientes ( nombre_completo, email, celular ),
                direcciones (
                    direccion,
                    referencia,
                    tipo_envio,
                    nombre_agencia,
                    distritos ( nombre )
                ),
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

        // 2. Solo retornar si el pago está confirmado
        if (orden.estado_pago !== 'PAGADO') {
            return NextResponse.json(
                { error: 'Pago no confirmado aún', estado_pago: orden.estado_pago },
                { status: 402 }
            );
        }

        // 3. Normalizar para evitar errores de tipos anidados (Supabase arrays/objetos)
        const cliente = Array.isArray(orden.clientes) ? orden.clientes[0] : orden.clientes;
        const direccion = Array.isArray(orden.direcciones) ? orden.direcciones[0] : orden.direcciones;
        const districtoNombre = direccion?.distritos
            ? (Array.isArray(direccion.distritos)
                ? (direccion.distritos[0] as { nombre: string })?.nombre
                : (direccion.distritos as { nombre: string })?.nombre)
            : '';

        return NextResponse.json({
            orden_id: orden.id,
            estado_pago: orden.estado_pago,
            subtotal: orden.subtotal,
            monto_descuento: orden.monto_descuento,
            costo_envio: orden.costo_envio,
            total: orden.total,
            cliente: {
                nombre_completo: cliente?.nombre_completo ?? '',
                email: cliente?.email ?? '',
                celular: cliente?.celular ?? '',
            },
            direccion: {
                direccion: direccion?.direccion ?? '',
                referencia: direccion?.referencia ?? null,
                tipo_envio: direccion?.tipo_envio ?? '',
                nombre_agencia: direccion?.nombre_agencia ?? null,
                distrito: districtoNombre ?? '',
            },
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
        console.error('Error en GET /api/ordenes/[orden_id]:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

/**
 * PATCH /api/ordenes/[orden_id]
 *
 * Cancela una orden pendiente actualizando su estado_pago a 'CANCELADO'.
 * Solo permite cancelar órdenes que estén en estado 'PENDIENTE'.
 * Esto se usa cuando el usuario descarta un pago pendiente desde el frontend.
 */
export async function PATCH(
    req: Request,
    { params }: { params: { orden_id: string } }
) {
    try {
        const { orden_id } = params;

        if (!orden_id) {
            return NextResponse.json({ error: 'orden_id requerido' }, { status: 400 });
        }

        const body = await req.json();

        // Solo aceptamos la acción de cancelar
        if (body.accion !== 'cancelar') {
            return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Verificar que la orden existe y está pendiente
        const { data: orden, error: errOrden } = await supabase
            .from('ordenes')
            .select('id, estado_pago')
            .eq('id', orden_id)
            .single();

        if (errOrden || !orden) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        // Solo cancelar si está PENDIENTE — no permitir cancelar una orden ya pagada
        if (orden.estado_pago !== 'PENDIENTE') {
            return NextResponse.json(
                { error: 'Solo se pueden cancelar órdenes pendientes', estado_actual: orden.estado_pago },
                { status: 409 }
            );
        }

        // Actualizar el estado general a CANCELADO y el pago a CANCELADO (ahora soportado por la DB)
        const { error: errUpdate } = await supabase
            .from('ordenes')
            .update({ estado_pago: 'CANCELADO', estado: 'CANCELADO' })
            .eq('id', orden_id);

        if (errUpdate) {
            console.error('Error al cancelar orden:', errUpdate);
            return NextResponse.json({ error: 'Error al cancelar la orden' }, { status: 500 });
        }

        return NextResponse.json({ success: true, orden_id, estado_pago: 'CANCELADO' });

    } catch (e) {
        console.error('Error en PATCH /api/ordenes/[orden_id]:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
