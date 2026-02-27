import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
    // 1. Verificar sesión administrativa
    const cookieStore = cookies();
    const adminSession = cookieStore.get('lorie_admin_session');

    if (!adminSession?.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const adminSupabase = createAdminClient();
        const formData = await req.formData();

        const isNew = formData.get('isNew') === 'true';
        const productoId = formData.get('id') as string | null;

        const payload = {
            nombre: formData.get('nombre') as string,
            descripcion: formData.get('descripcion') as string || null,
            caracteristicas: formData.get('caracteristicas') as string || null,
            precio: parseFloat(formData.get('precio') as string),
            precio_oferta: formData.get('precio_oferta') ? parseFloat(formData.get('precio_oferta') as string) : null,
            stock: parseInt(formData.get('stock') as string),
            nuevo: formData.get('nuevo') === 'true',
            agotado: formData.get('agotado') === 'true',
            requiere_medida: formData.get('requiere_medida') === 'true',
            activo: formData.get('activo') === 'true',
        };

        let currentProductoId = productoId;

        // 2. Insertar o Actualizar Producto a nivel Servidor
        if (isNew) {
            const { data, error: errInsert } = await adminSupabase
                .from("productos")
                .insert([payload])
                .select("id")
                .single();
            if (errInsert) throw errInsert;
            currentProductoId = data.id;
        } else {
            if (!currentProductoId) throw new Error("Falta el ID del producto para actualizar");
            const { error: errUpdate } = await adminSupabase
                .from("productos")
                .update(payload)
                .eq("id", currentProductoId);
            if (errUpdate) throw errUpdate;
        }

        // 3. Procesar subida de Imágenes (si aplica)
        const imagenes = formData.getAll('imagenes'); // Esperado: Array de objetos File
        const ordenBaseStr = formData.get('ordenBase');
        const ordenBase = ordenBaseStr ? parseInt(ordenBaseStr as string) : 0;

        if (imagenes.length > 0) {
            for (let i = 0; i < imagenes.length; i++) {
                const file = imagenes[i] as File;

                // Sanitizar nombre de archivo
                let safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
                if (!safeName) safeName = 'image.webp';

                const fileName = `${currentProductoId}/${Date.now()}-${safeName}`;

                // Convertir File a Buffer para máxima compatibilidad con el entorno Node de Next.js
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const { data: uploadData, error: uploadError } = await adminSupabase.storage
                    .from("productos")
                    .upload(fileName, buffer, {
                        contentType: file.type,
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Error subiendo imagen en el backend:", uploadError);
                    continue; // Intentar con las siguientes en caso de fallo
                }

                // Generar URL pública
                const { data: { publicUrl } } = adminSupabase.storage
                    .from("productos")
                    .getPublicUrl(fileName);

                // Insertar en la tabla relacional
                await adminSupabase.from("producto_imagenes").insert({
                    producto_id: currentProductoId,
                    url_imagen: publicUrl,
                    orden: ordenBase + i
                });
            }
        }

        return NextResponse.json({ success: true, id: currentProductoId });

    } catch (error: any) {
        console.error("Error en POST /api/admin/productos:", error);
        return NextResponse.json({ error: error.message || 'Error interno en el servidor' }, { status: 500 });
    }
}
