import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase-admin';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    // 1. Verificar sesión de administrador
    const cookieStore = cookies();
    const adminSession = cookieStore.get('lorie_admin_session');

    if (!adminSession?.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const adminSupabase = createAdminClient();
        const id = params.id;

        // 2. Obtener imágenes asociadas para limpiar Storage
        const { data: images } = await adminSupabase
            .from("producto_imagenes")
            .select("url_imagen")
            .eq("producto_id", id);

        // 3. Borrar imágenes del bucket
        if (images && images.length > 0) {
            const pathsProductos: string[] = [];
            const pathsLegacy: string[] = [];

            images.forEach((img: any) => {
                const url = img.url_imagen;
                if (url.includes("/productos/")) {
                    pathsProductos.push(url.split("/productos/")[1]);
                } else if (url.includes("/productos_imagenes/")) {
                    pathsLegacy.push(url.split("/productos_imagenes/")[1]);
                }
            });

            if (pathsProductos.length > 0) {
                await adminSupabase.storage.from("productos").remove(pathsProductos);
            }
            if (pathsLegacy.length > 0) {
                await adminSupabase.storage.from("productos_imagenes").remove(pathsLegacy);
            }
        }

        // 4. Borrar el producto de la DB (por cascada o directamente)
        const { error } = await adminSupabase
            .from("productos")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error al eliminar producto vía API:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    // 1. Verificar sesión
    const cookieStore = cookies();
    const adminSession = cookieStore.get('lorie_admin_session');

    if (!adminSession?.value) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const adminSupabase = createAdminClient();

        const { error } = await adminSupabase
            .from("productos")
            .update({ activo: body.activo })
            .eq("id", params.id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error al actualizar producto vía API:", error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}
