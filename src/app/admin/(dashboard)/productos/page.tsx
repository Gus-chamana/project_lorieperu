"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminProductosLista() {
    const [productos, setProductos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const fetchProductos = async () => {
        setCargando(true);
        try {
            // 1. Obtener todos los productos (activos e inactivos)
            const { data: prods, error: errProds } = await supabase
                .from("productos")
                .select("*")
                .order("creado_en", { ascending: false });

            if (errProds) throw errProds;

            // 2. Obtener imágenes
            const { data: imgs, error: errImgs } = await supabase
                .from("producto_imagenes")
                .select("producto_id, url_imagen, orden")
                .order("orden", { ascending: true });

            if (errImgs) {
                console.warn("No se pudo obtener producto_imagenes", errImgs);
            }

            // 3. Mapear imágenes al producto principal (solo la primera imagen como portada)
            const productosConImagen = (prods || []).map((p: any) => {
                const pImgs = (imgs || []).filter((i: any) => i.producto_id === p.id);
                return {
                    ...p,
                    imagenPortada: pImgs.length > 0 ? pImgs[0].url_imagen : null,
                };
            });

            setProductos(productosConImagen);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            alert("Error al cargar los productos. Revisa la consola.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const toggleEstado = async (id: string, estadoActual: boolean) => {
        if (!confirm(`¿Estás seguro de ${estadoActual ? 'desactivar' : 'activar'} este producto?`)) return;

        try {
            const res = await fetch(`/api/admin/productos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activo: !estadoActual })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al actualizar");
            }

            await fetchProductos(); // Recargar
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            alert("No se pudo cambiar el estado.");
        }
    };

    const eliminarProducto = async (id: string) => {
        if (!confirm("🚨 ADVERTENCIA: Esta acción eliminará el producto permanentemente y reciclará el espacio borrando sus imágenes del servidor. ¿Deseas continuar?")) return;

        try {
            const res = await fetch(`/api/admin/productos/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al eliminar");
            }

            await fetchProductos();
        } catch (error: any) {
            console.error("Error al eliminar:", error);
            alert(`No se pudo eliminar el producto. Detalles: ${error.message}`);
        }
    };

    return (
        <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-lorie-dark mb-1">
                        Gestión de Productos
                    </h1>
                    <p className="font-sans text-lorie-brown/70 text-sm">
                        Administra tu inventario, sube fotos y controla el stock.
                    </p>
                </div>
                <Link
                    href="/admin/productos/nuevo"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#BB9B8A] text-white rounded-full font-sans font-medium hover:opacity-90 transition-all shadow-md"
                >
                    <i className="ri-add-line text-lg"></i>
                    Nuevo Producto
                </Link>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-lorie-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-lorie-cream/50 text-lorie-brown font-sans text-sm tracking-wide border-b border-lorie-beige/50">
                                <th className="py-4 px-6 font-medium">Producto</th>
                                <th className="py-4 px-6 font-medium text-center">Precio</th>
                                <th className="py-4 px-6 font-medium text-center">Stock</th>
                                <th className="py-4 px-6 font-medium text-center">Estado</th>
                                <th className="py-4 px-6 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lorie-beige/30">
                            {cargando ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-lorie-brown/50">
                                        <i className="ri-loader-4-line text-2xl animate-spin block mb-2"></i>
                                        Cargando productos...
                                    </td>
                                </tr>
                            ) : productos.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-lorie-brown/50 font-sans">
                                        No tienes ningún producto en el catálogo aún.
                                    </td>
                                </tr>
                            ) : (
                                productos.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-lorie-cream/10 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-lorie-cream relative flex-shrink-0 border border-lorie-beige/50">
                                                    {prod.imagenPortada ? (
                                                        <Image src={prod.imagenPortada} alt={prod.nombre} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-lorie-brown/30">
                                                            <i className="ri-image-line text-2xl"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-serif font-semibold text-lorie-dark line-clamp-1">{prod.nombre}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {prod.nuevo && <span className="px-2 py-0.5 bg-lorie-brown text-white text-[10px] uppercase font-bold rounded-sm tracking-wider">Nuevo</span>}
                                                        {prod.requiere_medida && <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] uppercase font-bold rounded-sm tracking-wider">A Medida</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center font-sans">
                                            {prod.precio_oferta ? (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-lorie-rose font-bold">S/ {prod.precio_oferta}</span>
                                                    <span className="text-xs text-lorie-brown/50 line-through">S/ {prod.precio}</span>
                                                </div>
                                            ) : (
                                                <span className="text-lorie-dark font-medium">S/ {prod.precio}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center font-sans">
                                            <span className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-full text-xs font-semibold ${prod.agotado ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                                                {prod.agotado ? '0' : prod.stock}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => toggleEstado(prod.id, prod.activo)}
                                                className={`px-3 py-1 rounded-full text-xs font-sans font-semibold border transition-colors ${prod.activo ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                            >
                                                {prod.activo ? 'Público' : 'Oculto'}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/productos/${prod.id}`}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-lorie-cream text-lorie-brown hover:bg-[#BB9B8A] hover:text-white transition-colors"
                                                    title="Editar"
                                                >
                                                    <i className="ri-pencil-line"></i>
                                                </Link>
                                                <button
                                                    onClick={() => eliminarProducto(prod.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
