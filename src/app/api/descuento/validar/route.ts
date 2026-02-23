import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { codigo, subtotal } = await req.json();

    if (!codigo || !subtotal) {
        return NextResponse.json({ valido: false, error: 'Datos incompletos' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('codigos_descuento')
        .select('*')
        .eq('codigo', (codigo as string).toUpperCase().trim())
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
