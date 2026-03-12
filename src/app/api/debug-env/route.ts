import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// DEBUG temporal: expone qué Supabase URL/proyecto usa el servidor en Vercel
export async function GET() {
    const supabase = createAdminClient();

    // Query via SDK
    const { data: sdkData } = await supabase
        .from('ordenes')
        .select('id, estado_pago')
        .order('creado_en', { ascending: false })
        .limit(4);

    // Query via direct REST using same key
    const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const restRes = await fetch(`${URL}/rest/v1/ordenes?select=id,estado_pago&order=creado_en.desc&limit=4`, {
        headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
    });
    const restData = await restRes.json();

    return NextResponse.json({
        SUPABASE_URL: URL,
        KEY_PRESENT: !!KEY,
        KEY_PREFIX: KEY?.substring(0, 30),
        SDK_RESULT: sdkData?.map(o => ({ id: o.id.split('-')[0], estado_pago: o.estado_pago })),
        REST_RESULT: Array.isArray(restData) ? restData.map((o: any) => ({ id: o.id?.split('-')[0], estado_pago: o.estado_pago })) : restData,
    });
}
