import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    const { data, error } = await supabase
        .from('metodos_envio')
        .select('*')
        .eq('activo', true);

    if (error) {
        return NextResponse.json({ error: 'Error al obtener métodos de envío' }, { status: 500 });
    }

    return NextResponse.json(data);
}
