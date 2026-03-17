import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Decrementa el stock de cada producto asociado a una orden confirmada.
 *
 * - Lee los items de la orden (producto_id + cantidad).
 * - Por cada item, resta la cantidad comprada al stock del producto.
 * - Si el stock resultante llega a 0 o menos, marca el producto como agotado.
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

        // 2. Para cada item, decrementar el stock del producto
        for (const item of items) {
            const { producto_id, cantidad } = item;

            // Leer stock actual del producto
            const { data: producto, error: errProducto } = await supabase
                .from('productos')
                .select('stock')
                .eq('id', producto_id)
                .single();

            if (errProducto || !producto) {
                console.error(`Error leyendo producto ${producto_id}:`, errProducto);
                continue; // No detener el proceso por un producto individual
            }

            const nuevoStock = Math.max(0, producto.stock - cantidad);

            // Actualizar stock y marcar como agotado si corresponde
            const updateData: { stock: number; agotado?: boolean } = {
                stock: nuevoStock,
            };

            if (nuevoStock <= 0) {
                updateData.agotado = true;
            }

            const { error: errUpdate } = await supabase
                .from('productos')
                .update(updateData)
                .eq('id', producto_id);

            if (errUpdate) {
                console.error(`Error actualizando stock del producto ${producto_id}:`, errUpdate);
                continue;
            }

            console.log(
                `📦 Stock actualizado: Producto ${producto_id} → ${producto.stock} - ${cantidad} = ${nuevoStock}${nuevoStock <= 0 ? ' (AGOTADO)' : ''}`
            );
        }

        return { success: true };

    } catch (e) {
        console.error(`Error general decrementando stock para orden ${ordenId}:`, e);
        return { success: false, error: 'Error interno al decrementar stock' };
    }
}
