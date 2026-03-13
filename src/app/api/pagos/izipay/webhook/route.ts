import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
    try {
        // Izipay envia los datos vía application/x-www-form-urlencoded
        // IMPORTANTE: Leemos en crudo (text) para parsearlo manualmente.
        // Si usamos = await req.formData(), Next.js decodifica (decodeURIComponent) 
        // los caracteres especiales automáticamente (ej: acentos, signos, JSON). 
        // Al alterar un solo bit del json original, el hash calculado no coincidirá 
        // y saltará el FAILED_SERVER_403_ERROR.
        const rawBody = await req.text();
        
        // Parsear application/x-www-form-urlencoded manteniendo el string crudo
        const urlParams = new URLSearchParams(rawBody);
        const krHash = urlParams.get('kr-hash');
        
        // NOTA: Para obtener el krAnswer exactamente original tal y cómo llegó (sin decodificar),
        // no usamos urlParams.get() pues internamente hace decodeURIComponent.
        // Lo extraemos de la cadena bruta usando expresiones regulares:
        const krAnswerMatch = rawBody.match(/kr-answer=([^&]*)/);
        const krAnswerEncoded = krAnswerMatch ? krAnswerMatch[1] : null;

        if (!krHash || !krAnswerEncoded) {
            return NextResponse.json({ error: 'Faltan parámetros requeridos por Izipay.' }, { status: 400 });
        }

        // El string original codificado que Izipay usó para calcular su propio hash
        // lo decodificamos solo visualmente si queremos leerlo en JS después, 
        // pero la matematica (Hash) requiere la cadena original NO modificada.
        let krAnswerCrudoParaFirma = decodeURIComponent(krAnswerEncoded);
        
        // Excepción documentada por Izipay en NodeJS: Los espacios '+' a veces no son decodificados a espacio libre.
        krAnswerCrudoParaFirma = krAnswerCrudoParaFirma.replace(/\+/g, ' ');

        const HMAC_KEY = process.env.IZIPAY_HMAC_SHA256;

        if (!HMAC_KEY) {
            console.error("FATAL: Llave HMAC no configurada en el servidor.");
            return NextResponse.json({ error: 'Error interno de configuración de la pasarela.' }, { status: 500 });
        }

        // --- 1. Verificación Criptográfica de la Identidad de Izipay ---
        // Se cifra la respuesta cruda 'kr-answer' usando el HMAC_SHA256 Secret key del Back-Office
        const calculatedHash = crypto.createHmac('sha256', HMAC_KEY)
            .update(krAnswerCrudoParaFirma)
            .digest('hex');

        if (calculatedHash !== krHash) {
            console.error('ALERTA DE SEGURIDAD: Intento de validación Webhook fallido. Hash inválido.');
            console.error(`  - Hash Recibido (Izipay): ${krHash}`);
            console.error(`  - Hash Calculado (Nosotros): ${calculatedHash}`);
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
            const { error: errUpdate } = await supabaseAdmin
                .from('ordenes')
                .update({ estado_pago: 'PAGADO' })
                .eq('id', orderId);

            if (errUpdate) {
                console.error(`Error actualizando el estado de la orden ${orderId} en base de datos:`, errUpdate);
                return NextResponse.json({ error: 'Error interno actualizando Supabase.' }, { status: 500 });
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
