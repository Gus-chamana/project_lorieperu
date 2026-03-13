import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase-admin';

/**
 * POST /api/pagos/izipay/verificar-retorno
 *
 * Verifica los parámetros kr-answer y kr-hash que Izipay incluye en la URL
 * de redirección exitosa (kr-get-url-success). Esto es lo mismo que el IPN
 * pero llega en el redirect del navegador, lo que permite actualizar el
 * estado_pago a PAGADO inmediatamente sin esperar el webhook IPN.
 *
 * Izipay firma el kr-answer con el mismo HMAC SHA256 que usa para el IPN.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { krAnswer, krHash } = body;

        if (!krAnswer || !krHash) {
            return NextResponse.json(
                { error: 'Faltan parámetros kr-answer o kr-hash' },
                { status: 400 }
            );
        }

        const HMAC_KEY = process.env.IZIPAY_HMAC_SHA256;
        if (!HMAC_KEY) {
            console.error('FATAL: IZIPAY_HMAC_SHA256 no configurado');
            return NextResponse.json(
                { error: 'Error de configuración del servidor' },
                { status: 500 }
            );
        }

        // 1. Verificar la firma HMAC SHA256 (igual que en el webhook IPN)
        const calculatedHash = crypto
            .createHmac('sha256', HMAC_KEY)
            .update(krAnswer)
            .digest('hex');

        if (calculatedHash !== krHash) {
            console.error('ALERTA: Firma kr-hash inválida en verificar-retorno');
            return NextResponse.json(
                { error: 'Firma de seguridad inválida' },
                { status: 403 }
            );
        }

        // 2. Parsear la respuesta de Izipay
        let paymentAnswer: {
            orderStatus?: string;
            orderDetails?: { orderId?: string };
        };
        try {
            paymentAnswer = JSON.parse(krAnswer);
        } catch {
            return NextResponse.json({ error: 'kr-answer inválido' }, { status: 400 });
        }

        const orderStatus = paymentAnswer.orderStatus;
        const orderId = paymentAnswer.orderDetails?.orderId;

        if (!orderId) {
            return NextResponse.json({ error: 'orderId no encontrado en kr-answer' }, { status: 400 });
        }

        // 3. Si el pago fue exitoso, actualizar Supabase
        if (orderStatus === 'PAID') {
            const supabase = createAdminClient();
            const { error: errUpdate } = await supabase
                .from('ordenes')
                .update({ estado_pago: 'PAGADO' })
                .eq('id', orderId);

            if (errUpdate) {
                console.error('Error actualizando estado_pago desde retorno Izipay:', errUpdate);
                return NextResponse.json(
                    { error: 'Error al actualizar el estado del pago' },
                    { status: 500 }
                );
            }

            console.log(`✅ Pago verificado por retorno Izipay: Orden ${orderId} marcada como PAGADA`);
            return NextResponse.json({ success: true, orden_id: orderId, estado_pago: 'PAGADO' });
        }

        // 4. Pago no exitoso (rechazado, cancelado, etc.)
        console.warn(`Retorno Izipay - Pago no exitoso. Orden: ${orderId}. Estado: ${orderStatus}`);
        return NextResponse.json(
            { success: false, orden_id: orderId, estado_pago: orderStatus },
            { status: 200 }
        );

    } catch (e) {
        console.error('Error en verificar-retorno Izipay:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
