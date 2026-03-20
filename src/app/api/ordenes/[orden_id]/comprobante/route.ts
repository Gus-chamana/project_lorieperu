import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

/**
 * POST /api/ordenes/[orden_id]/comprobante
 *
 * Recibe la imagen del comprobante de pago (FormData con campo "file"),
 * la sube al bucket "pago" de Supabase Storage y actualiza la orden con:
 *   - comprobante_url → URL pública del archivo
 *   - estado_pago → 'REVISION_QR'
 *
 * Solo funciona si la orden está en estado 'PENDIENTE'.
 */
export async function POST(
    req: Request,
    { params }: { params: { orden_id: string } }
) {
    try {
        const { orden_id } = params;

        if (!orden_id) {
            return NextResponse.json({ error: 'orden_id requerido' }, { status: 400 });
        }

        // 1. Parsear el FormData
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
        }

        // Validar tipo de archivo (solo imágenes)
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!tiposPermitidos.includes(file.type)) {
            return NextResponse.json(
                { error: 'Solo se permiten imágenes (JPG, PNG, WEBP)' },
                { status: 400 }
            );
        }

        // Validar tamaño máximo (5 MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'El archivo no puede superar los 5 MB' },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

        // 2. Verificar que la orden existe y está PENDIENTE
        const { data: orden, error: errOrden } = await supabase
            .from('ordenes')
            .select('id, estado_pago')
            .eq('id', orden_id)
            .single();

        if (errOrden || !orden) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        if (orden.estado_pago !== 'PENDIENTE') {
            return NextResponse.json(
                { error: 'Esta orden ya no acepta comprobantes', estado_actual: orden.estado_pago },
                { status: 409 }
            );
        }

        // 3. Subir archivo a Supabase Storage
        const extension = file.name.split('.').pop() || 'jpg';
        const timestamp = Date.now();
        const filePath = `comprobantes/${orden_id}_${timestamp}.${extension}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: errUpload } = await supabase.storage
            .from('pago')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (errUpload) {
            console.error('Error al subir comprobante a Storage:', errUpload);
            return NextResponse.json(
                { error: 'Error al subir el comprobante. Intenta nuevamente.' },
                { status: 500 }
            );
        }

        // 4. Obtener URL pública
        const { data: urlData } = supabase.storage
            .from('pago')
            .getPublicUrl(filePath);

        const comprobanteUrl = urlData.publicUrl;

        // 5. Actualizar la orden con la URL del comprobante y cambiar estado
        const { error: errUpdate } = await supabase
            .from('ordenes')
            .update({
                comprobante_url: comprobanteUrl,
                estado_pago: 'REVISION_QR',
            })
            .eq('id', orden_id);

        if (errUpdate) {
            console.error('Error al actualizar orden con comprobante:', errUpdate);
            return NextResponse.json(
                { error: 'El archivo se subió pero no se pudo actualizar la orden.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            comprobante_url: comprobanteUrl,
            orden_id,
        });

    } catch (e) {
        console.error('Error en POST /api/ordenes/[orden_id]/comprobante:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
