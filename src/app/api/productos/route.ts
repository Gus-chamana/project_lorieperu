import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const destacados = searchParams.get('destacados') === 'true';
    const filtro = searchParams.get('filtro');

    try {
        // 1️⃣ Traer productos (sin join por flexibilidad)
        let query = supabase
            .from('productos')
            .select('id, nombre, descripcion, caracteristicas, precio, precio_oferta, stock, nuevo, agotado, activo, creado_en')
            .eq('activo', true)
            .order('creado_en', { ascending: false });

        if (filtro === 'nuevas') query = query.eq('nuevo', true);
        if (filtro === 'ofertas') query = query.not('precio_oferta', 'is', null);
        if (destacados) query = query.limit(6);

        const { data: productosData, error: errorProductos } = await query;

        if (errorProductos) {
            console.error('[/api/productos] Error query productos:', errorProductos);
            return NextResponse.json({ error: errorProductos.message }, { status: 500 });
        }

        const listaProductos = productosData ?? [];

        // 2️⃣ Traer imágenes para esos productos (si existen)
        let imagenesMap: Record<string, string[]> = {};

        if (listaProductos.length > 0) {
            const ids = listaProductos.map((p) => p.id);

            // Intentar con la tabla 'producto_imagenes'
            const { data: imagenesData, error: errorImagenes } = await supabase
                .from('producto_imagenes')
                .select('producto_id, url_imagen, orden')
                .in('producto_id', ids)
                .order('orden', { ascending: true });

            if (!errorImagenes && imagenesData) {
                imagenesMap = imagenesData.reduce((acc: Record<string, string[]>, img) => {
                    if (!acc[img.producto_id]) acc[img.producto_id] = [];
                    acc[img.producto_id].push(img.url_imagen);
                    return acc;
                }, {});
            } else if (errorImagenes) {
                // Si la tabla no existe con ese nombre, intentar 'imagenes_producto'
                const { data: imgAlt, error: errorAlt } = await supabase
                    .from('imagenes_producto')
                    .select('producto_id, url_imagen, orden')
                    .in('producto_id', ids)
                    .order('orden', { ascending: true });

                if (!errorAlt && imgAlt) {
                    imagenesMap = imgAlt.reduce((acc: Record<string, string[]>, img) => {
                        if (!acc[img.producto_id]) acc[img.producto_id] = [];
                        acc[img.producto_id].push(img.url_imagen);
                        return acc;
                    }, {});
                }
                // Si no existe ninguna tabla de imágenes, imagenesMap queda vacío → imagenes: []
            }
        }

        // 3️⃣ Normalizar respuesta final
        const productos = listaProductos.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion ?? '',
            caracteristicas: p.caracteristicas ?? '',
            precio: Number(p.precio),
            precioOferta: p.precio_oferta != null ? Number(p.precio_oferta) : null,
            imagenes: imagenesMap[p.id] ?? [],
            stock: p.stock ?? 0,
            nuevo: p.nuevo ?? false,
            agotado: p.agotado ?? false,
        }));

        return NextResponse.json(productos);
    } catch (err) {
        const e = err as Error;
        console.error('[/api/productos] Error:', e.message);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
