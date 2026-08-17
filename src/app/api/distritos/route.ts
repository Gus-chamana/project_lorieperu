import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    const { data, error } = await supabase
        .from('distritos')
        .select('id, nombre, es_lima_metropolitana')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    if (error) {
        return NextResponse.json({ error: 'Error al obtener distritos' }, { status: 500 });
    }

    return NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
