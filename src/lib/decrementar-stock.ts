import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Decrementa el stock de cada producto asociado a una orden confirmada.
 *
 * - Lee los items de la orden (producto_id + cantidad).
 * - Por cada item, llama a la función RPC atómica `decrementar_stock_producto`
 *   que hace el UPDATE directamente en PostgreSQL, evitando race conditions.
 *
 * IMPORTANTE: Esta función debe llamarse SOLO cuando se confirma el pago
 * y después de verificar que el estado_pago anterior era 'PENDIENTE',
 * para evitar doble decremento si el webhook y el retorno procesan la misma orden.
 */
export async function decrementarStock(
    supabase: SupabaseClient,
    ordenId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Obtener los items de la orden con producto_id y cantidad
        const { data: items, error: errItems } = await supabase
            .from('orden_items')
            .select('producto_id, cantidad')
            .eq('orden_id', ordenId);

        if (errItems) {
            console.error(`Error leyendo orden_items para orden ${ordenId}:`, errItems);
            return { success: false, error: 'Error al leer items de la orden' };
        }

        if (!items || items.length === 0) {
            console.warn(`No se encontraron items para la orden ${ordenId}`);
            return { success: true }; // No hay items que decrementar, no es un error fatal
        }

        // 2. Para cada item, decrementar el stock usando la función RPC atómica
        //    Esto evita race conditions: el UPDATE se hace en una sola operación
        //    directamente en PostgreSQL, sin leer el stock primero.
        for (const item of items) {
            const { producto_id, cantidad } = item;

            const { data: nuevoStock, error: errRpc } = await supabase
                .rpc('decrementar_stock_producto', {
                    p_producto_id: producto_id,
                    p_cantidad: cantidad,
                });

            if (errRpc) {
                console.error(`Error decrementando stock del producto ${producto_id}:`, errRpc);
                continue; // No detener el proceso por un producto individual
            }

            console.log(
                `📦 Stock actualizado (atómico): Producto ${producto_id} → nuevo stock = ${nuevoStock}${nuevoStock <= 0 ? ' (AGOTADO)' : ''}`
            );
        }

        return { success: true };

    } catch (e) {
        console.error(`Error general decrementando stock para orden ${ordenId}:`, e);
        return { success: false, error: 'Error interno al decrementar stock' };
    }
}

