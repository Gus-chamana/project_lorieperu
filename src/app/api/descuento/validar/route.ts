import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { codigo, subtotal } = await req.json();

    if (!codigo || !subtotal) {
        return NextResponse.json({ valido: false, error: 'Datos incompletos' }, { status: 400 });
    }

    const codigoLimpio = (codigo as string).toUpperCase().trim();

    // 1. Primero verificamos si coincide con el cupón temporal del banner (configuracion_tienda)
    const { data: configData, error: configError } = await supabase
        .from('configuracion_tienda')
        .select('*')
        .eq('llave', 'promo_banner')
        .single();

    if (!configError && configData?.valor?.activo) {
        const { codigo_cupon, descuento_porcentaje } = configData.valor;
        if (codigo_cupon === codigoLimpio) {
            // El código coincide con el banner activo
            const descuentoNumeric = Number(descuento_porcentaje);
            const montoCalculado = (subtotal * descuentoNumeric) / 100;

            return NextResponse.json({
                valido: true,
                monto: parseFloat(montoCalculado.toFixed(2)),
                tipo: 'PORCENTAJE',
                valor: descuentoNumeric,
                codigo_id: null, // No hay ID porque viene de configuración, no de la tabla de códigos
            });
        }
    }

    // 2. Si no es el del banner, buscamos en la tabla tradicional de codigos_descuento
    const { data, error } = await supabase
        .from('codigos_descuento')
        .select('*')
        .eq('codigo', codigoLimpio)
        .eq('activo', true)
        .single();

    if (error || !data) {
        return NextResponse.json({ valido: false, error: 'Código no válido' });
    }

    // Validar expiración
    if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date()) {
        return NextResponse.json({ valido: false, error: 'Este código ha expirado' });
    }

    // Validar usos máximos
    if (data.usos_maximos !== null && data.veces_usado >= data.usos_maximos) {
        return NextResponse.json({ valido: false, error: 'Este código ya no tiene usos disponibles' });
    }

    // Calcular monto de descuento
    const monto = data.tipo_descuento === 'PORCENTAJE'
        ? (subtotal * data.valor) / 100
        : data.valor;

    return NextResponse.json({
        valido: true,
        monto: parseFloat(monto.toFixed(2)),
        tipo: data.tipo_descuento,
        valor: data.valor,
        codigo_id: data.id,
    });
}
