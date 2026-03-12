import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orden_id } = body;

        // Admin client: bypasea RLS para leer la orden del servidor
        const supabase = createAdminClient();

        if (!orden_id) {
            return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 });
        }

        // 1. Verificar la orden en Supabase y obtener el Total Fiable (nunca confiar en el monto del frontend)
        const { data: orden, error: errOrden } = await supabase
            .from('ordenes')
            .select('id, total, estado_pago')
            .eq('id', orden_id)
            .single();

        if (errOrden || !orden) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        if (orden.estado_pago === 'VERIFICADO') {
            return NextResponse.json({ error: 'Esta orden ya fue pagada' }, { status: 400 });
        }

        // 2. Preparar credenciales de entorno (Izipay)
        const IZIPAY_CLIENT_ID = process.env.IZIPAY_CLIENT_ID;
        const IZIPAY_CLIENT_SECRET = process.env.IZIPAY_CLIENT_SECRET;
        const IZIPAY_ENDPOINT = process.env.IZIPAY_ENDPOINT || "https://api.micuentaweb.pe";

        if (!IZIPAY_CLIENT_ID || !IZIPAY_CLIENT_SECRET) {
            console.error("FATAL: Credenciales de Izipay no configuradas en el entorno (.env)");
            return NextResponse.json({ error: 'Error de configuración de pasarela' }, { status: 500 });
        }

        // 3. Crear Authorization Header (Basic Auth: base64(client_id:client_secret))
        const authString = Buffer.from(`${IZIPAY_CLIENT_ID}:${IZIPAY_CLIENT_SECRET}`).toString('base64');

        // 4. Formatear la petición a Izipay (Monto enviado en centavos: 100 Soles = 10000)
        const amountInCents = Math.round(orden.total * 100);

        const payloadIzipay = {
            amount: amountInCents,
            currency: "PEN", // Sol peruano
            orderId: orden.id, // ID interno referencial
            customer: {
                reference: "LORIE_CLIENTE",
                email: "soporte@lorieperu.com" // Opcional, Izipay lo permite
            }
        };

        // 5. Contactar a Izipay: Crear Sesión
        const response = await fetch(`${IZIPAY_ENDPOINT}/api-payment/V4/Charge/CreatePayment`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadIzipay)
        });

        const izipayData = await response.json();

        if (izipayData.status === 'ERROR') {
            console.error('Error desde Izipay:', izipayData.answer);
            return NextResponse.json({ error: 'Error al iniciar sesión con Izipay' }, { status: 500 });
        }

        // 6. Retornar el `formToken` al frontend para inyectarlo en el Embedded Form
        return NextResponse.json({
            success: true,
            formToken: izipayData.answer.formToken
        }, { status: 200 });

    } catch (e) {
        console.error('Excepción en generar-sesion Izipay:', e);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
