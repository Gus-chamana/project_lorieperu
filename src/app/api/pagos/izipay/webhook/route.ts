import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
    try {
        // Izipay Notification URL (IPN) manda los datos vía application/x-www-form-urlencoded
        const formData = await req.formData();

        // Extraer la firma de autenticidad (Signature) enviada por Izipay en la notificación
        const krHash = formData.get('kr-hash')?.toString();
        const krAnswer = formData.get('kr-answer')?.toString();

        if (!krHash || !krAnswer) {
            return NextResponse.json({ error: 'Faltan parámetros requeridos por Izipay.' }, { status: 400 });
        }

        const HMAC_KEY = process.env.IZIPAY_HMAC_SHA256;

        if (!HMAC_KEY) {
            console.error("FATAL: Llave HMAC no configurada en el servidor.");
            return NextResponse.json({ error: 'Error interno de configuración de la pasarela.' }, { status: 500 });
        }

        // --- 1. Verificación Criptográfica de la Identidad de Izipay ---
        // Se cifra la respuesta cruda 'kr-answer' usando el HMAC_SHA256 Secret key del Back-Office
        const calculatedHash = crypto.createHmac('sha256', HMAC_KEY)
            .update(krAnswer)
            .digest('hex');

        if (calculatedHash !== krHash) {
            console.error('ALERTA DE SEGURIDAD: Intento de validación Webhook fallido. Hash inválido.');
            return NextResponse.json({ error: 'Firma de seguridad no coincide.' }, { status: 403 });
        }

        // --- 2. Procesamiento de la Transacción Verificada ---
        const paymentAnswer = JSON.parse(krAnswer);
        const orderId = paymentAnswer.orderDetails.orderId; // Extraemos el UUID original de Supabase enviado al crear el token
        const orderStatus = paymentAnswer.orderStatus; // Estado oficial dentro de la entidad bancaria

        if (!orderId) {
            return NextResponse.json({ error: 'Falta OrderID para procesar en Supabase.' }, { status: 400 });
        }

        // Usar cliente de administrador para saltar Políticas RLS de base de datos desde el Webhook
        const supabaseAdmin = createAdminClient();

        if (orderStatus === 'PAID') {
            // Actualizar la orden local de 'PENDIENTE' a 'CONFIRMADO EL PAGO' transparentemente para el Panel Administrativo
            const { error: errUpdate } = await supabaseAdmin
                .from('ordenes')
                .update({ estado_pago: 'CONFIRMADO EL PAGO', estado: 'PAGADO' })
                .eq('id', orderId);

            if (errUpdate) {
                console.error(`Error actualizando el estado de la orden ${orderId} en base de datos:`, errUpdate);
                return NextResponse.json({ error: 'Error interno actualizando Supabase.' }, { status: 500 });
            }

            console.log(`✅ Webhook IPN Izipay completado: Orden ${orderId} registrada como PAGADA.`);
            return NextResponse.json({ success: true, message: 'Orden confirmada exitosamente.' }, { status: 200 });
        } else {
            console.warn(`Webhook Izipay - Transacción rechazada/abandonada: Orden ${orderId}. Estado: ${orderStatus}`);
            // Marcar de rechazada si la operación falla, pero como Izipay permite reintentos, comúnmente se ignora
            return NextResponse.json({ success: true, message: 'Transacción notificada sin confirmación pagada.' }, { status: 200 });
        }

    } catch (e) {
        console.error('Error procesando el Webhook Izipay IPN:', e);
        return NextResponse.json({ error: 'Falla interna general del servidor al leer webhook.' }, { status: 500 });
    }
}
