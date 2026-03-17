import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase-admin';
import { decrementarStock } from '@/lib/decrementar-stock';

export async function POST(req: Request) {
    try {
        // Izipay envia los datos vía application/x-www-form-urlencoded
        // Usamos formData nativo de Next.js que parsea los datos perfectamente 
        // de acuerdo con el estándar de la W3C, sin romper caracteres especiales.
        const formData = await req.formData();
        
        const krHash = formData.get('kr-hash') as string | null;
        const krAnswerEncoded = formData.get('kr-answer') as string | null;

        if (!krHash || !krAnswerEncoded) {
            return NextResponse.json({ error: 'Faltan parámetros requeridos por Izipay.' }, { status: 400 });
        }

        // Ya que formData() retorna el texto EXACTO decodificado desde la red (incluido JSON válido)
        // No necesitamos hacer ningún decodeURIComponent ni reemplazar "+" manualmente.
        // Ese era el causante de la alteración binaria del documento.
        const krAnswerCrudoParaFirma = krAnswerEncoded;

        const HMAC_KEY = process.env.IZIPAY_HMAC_SHA256;
        const CLIENT_SECRET = process.env.IZIPAY_CLIENT_SECRET;

        if (!HMAC_KEY || !CLIENT_SECRET) {
            console.error("FATAL: Llaves HMAC o Password no configuradas en el servidor.");
            return NextResponse.json({ error: 'Error interno de configuración de la pasarela.' }, { status: 500 });
        }

        // --- 1. Verificación Criptográfica de la Identidad de Izipay ---
        // Izipay usa llave HMAC para los redirects al front-end y la llave Password (API Secret) para los Webhooks (IPN)
        // Calculamos ambos hashes y aceptamos la transacción si coincide con cualquiera de nuestras llaves oficiales.
        const hashObtenidoPorHmac = crypto.createHmac('sha256', HMAC_KEY)
            .update(krAnswerCrudoParaFirma)
            .digest('hex');

        const hashObtenidoPorPassword = crypto.createHmac('sha256', CLIENT_SECRET)
            .update(krAnswerCrudoParaFirma)
            .digest('hex');

        if (hashObtenidoPorHmac !== krHash && hashObtenidoPorPassword !== krHash) {
            console.error('ALERTA DE SEGURIDAD: Intento de validación Webhook fallido. Hash inválido.');
            console.error(`  - Hash Recibido (Izipay): ${krHash}`);
            console.error(`  - Hash Calculado c/ HMAC: ${hashObtenidoPorHmac}`);
            console.error(`  - Hash Calculado c/ Password: ${hashObtenidoPorPassword}`);
            return NextResponse.json({ error: 'Firma de seguridad no coincide.' }, { status: 403 });
        }

        // --- 2. Procesamiento de la Transacción Verificada ---
        const paymentAnswer = JSON.parse(krAnswerCrudoParaFirma);
        const orderId = paymentAnswer.orderDetails.orderId; // UUID original de Supabase
        const orderStatus = paymentAnswer.orderStatus; // Estado oficial dentro de la entidad bancaria

        if (!orderId) {
            return NextResponse.json({ error: 'Falta OrderID para procesar en Supabase.' }, { status: 400 });
        }

        // Usar cliente de administrador para saltar Políticas RLS
        const supabaseAdmin = createAdminClient();

        if (orderStatus === 'PAID') {
            // Verificar estado actual para prevenir doble decremento de stock
            // (tanto el webhook IPN como verificar-retorno pueden procesar la misma orden)
            const { data: ordenActual } = await supabaseAdmin
                .from('ordenes')
                .select('estado_pago')
                .eq('id', orderId)
                .single();

            const yaPagada = ordenActual?.estado_pago === 'PAGADO';

            const { error: errUpdate } = await supabaseAdmin
                .from('ordenes')
                .update({ estado_pago: 'PAGADO' })
                .eq('id', orderId);

            if (errUpdate) {
                console.error(`Error actualizando el estado de la orden ${orderId} en base de datos:`, errUpdate);
                return NextResponse.json({ error: 'Error interno actualizando Supabase.' }, { status: 500 });
            }

            // Solo decrementar stock si la orden NO estaba ya pagada (prevenir doble decremento)
            if (!yaPagada) {
                const resultStock = await decrementarStock(supabaseAdmin, orderId);
                if (!resultStock.success) {
                    console.error(`⚠️ Webhook: Estado de pago actualizado pero hubo error al decrementar stock: ${resultStock.error}`);
                }
            } else {
                console.log(`ℹ️ Webhook: Orden ${orderId} ya estaba PAGADA, stock no decrementado de nuevo.`);
            }

            console.log(`✅ Webhook IPN Izipay completado: Orden ${orderId} registrada como PAGADA.`);
            return NextResponse.json({ success: true, message: 'Orden confirmada exitosamente.' }, { status: 200 });
        } else {
            console.warn(`Webhook Izipay - Transacción rechazada/abandonada: Orden ${orderId}. Estado: ${orderStatus}`);
            return NextResponse.json({ success: true, message: 'Transacción notificada sin confirmación pagada.' }, { status: 200 });
        }

    } catch (e) {
        console.error('Error procesando el Webhook Izipay IPN:', e);
        return NextResponse.json({ error: 'Falla interna general del servidor al leer webhook.' }, { status: 500 });
    }
}
