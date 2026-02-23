import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { PayloadOrden } from '@/types/checkout';

const itemSchema = z.object({
    producto_id: z.string().uuid(),
    nombre_producto_snapshot: z.string().min(1),
    precio_unitario_snapshot: z.number().positive(),
    cantidad: z.number().int().positive(),
    subtotal_linea: z.number().positive(),
});

const ordenSchema = z.object({
    cliente: z.object({
        nombre_completo: z.string().min(3),
        dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
        celular: z.string().regex(/^9\d{8}$/, 'Celular debe tener 9 dígitos y comenzar con 9'),
        email: z.string().email(),
    }),
    direccion: z.object({
        distrito_id: z.string().uuid(),
        direccion: z.string().min(10),
        referencia: z.string().optional(),
        tipo_envio: z.enum(['LIMA_MOTORIZADO', 'PROVINCIA_SHALOM']),
        nombre_agencia: z.string().optional(),
    }),
    metodo_envio_id: z.string().uuid(),
    codigo_descuento_id: z.string().uuid().nullable().optional(),
    items: z.array(itemSchema).min(1),
    subtotal: z.number().nonnegative(),
    monto_descuento: z.number().nonnegative(),
    costo_envio: z.number().nonnegative(),
    total: z.number().positive(),
});

export async function POST(req: Request) {
    try {
        const body: PayloadOrden = await req.json();

        // Validar con Zod
        const parsed = ordenSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: 'Datos inválidos', detalles: parsed.error.flatten() }, { status: 400 });
        }

        const { cliente, direccion, metodo_envio_id, codigo_descuento_id, items, subtotal, monto_descuento, costo_envio, total } = parsed.data;

        // 1. Crear cliente
        const { data: clienteCreado, error: errCliente } = await supabase
            .from('clientes')
            .insert(cliente)
            .select('id')
            .single();

        if (errCliente || !clienteCreado) {
            return NextResponse.json({ error: 'Error al guardar cliente' }, { status: 500 });
        }

        // 2. Crear dirección
        const { data: direccionCreada, error: errDireccion } = await supabase
            .from('direcciones')
            .insert({ ...direccion, cliente_id: clienteCreado.id })
            .select('id')
            .single();

        if (errDireccion || !direccionCreada) {
            return NextResponse.json({ error: 'Error al guardar dirección' }, { status: 500 });
        }

        // 3. Crear orden
        const { data: orden, error: errOrden } = await supabase
            .from('ordenes')
            .insert({
                cliente_id: clienteCreado.id,
                direccion_id: direccionCreada.id,
                metodo_envio_id,
                codigo_descuento_id: codigo_descuento_id ?? null,
                subtotal,
                monto_descuento,
                costo_envio,
                total,
                estado: 'PENDIENTE',
                estado_pago: 'PENDIENTE',
            })
            .select('id')
            .single();

        if (errOrden || !orden) {
            return NextResponse.json({ error: 'Error al crear orden' }, { status: 500 });
        }

        // 4. Insertar items
        const ordenItems = items.map(item => ({ ...item, orden_id: orden.id }));
        const { error: errItems } = await supabase.from('orden_items').insert(ordenItems);

        if (errItems) {
            return NextResponse.json({ error: 'Error al guardar productos del pedido' }, { status: 500 });
        }

        // 5. Incrementar uso del código de descuento si aplica
        if (codigo_descuento_id) {
            await supabase
                .from('codigos_descuento')
                .update({ veces_usado: supabase.rpc('veces_usado') })
                .eq('id', codigo_descuento_id);
            // Forma alternativa sin RPC:
            const { data: codigoActual } = await supabase
                .from('codigos_descuento')
                .select('veces_usado')
                .eq('id', codigo_descuento_id)
                .single();
            if (codigoActual) {
                await supabase
                    .from('codigos_descuento')
                    .update({ veces_usado: codigoActual.veces_usado + 1 })
                    .eq('id', codigo_descuento_id);
            }
        }

        return NextResponse.json({ success: true, orden_id: orden.id }, { status: 201 });

    } catch (e) {
        console.error('Error en POST /api/ordenes:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
