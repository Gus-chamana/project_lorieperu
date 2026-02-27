import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-admin';

export async function DELETE(req: Request, { params }: { params: { imgId: string } }) {
    // 1. Verificar sesión administrativa
    const cookieStore = cookies();
    const adminSession = cookieStore.get('lorie_admin_session');

    if (!adminSession?.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const adminSupabase = createAdminClient();
        const imgId = params.imgId;

        // Extraer URL de cuerpo (si corresponde) o recuperar la ruta directa primero
        const { data: imgData } = await adminSupabase
            .from("producto_imagenes")
            .select("url_imagen")
            .eq("id", imgId)
            .single();

        if (imgData && imgData.url_imagen) {
            const url = imgData.url_imagen;

            // Borrar de bd
            await adminSupabase.from("producto_imagenes").delete().eq("id", imgId);

            // Borrar de storage
            const urlParts = url.split("/productos/");
            if (urlParts.length === 2) {
                const filePath = urlParts[1];
                await adminSupabase.storage.from("productos").remove([filePath]);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error al eliminar imagen vía API:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
