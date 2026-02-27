"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminProductoForm({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === "nuevo";

    const [cargando, setCargando] = useState(!isNew);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        caracteristicas: "",
        precio: "",
        precio_oferta: "",
        stock: "0",
        nuevo: false,
        agotado: false,
        requiere_medida: false,
        activo: true,
    });

    const [imagenesExistentes, setImagenesExistentes] = useState<any[]>([]);
    const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isNew) {
            cargarProducto();
        }
    }, [isNew]);

    const cargarProducto = async () => {
        try {
            const { data: prod, error: errProd } = await supabase
                .from("productos")
                .select("*")
                .eq("id", params.id)
                .single();

            if (errProd) throw errProd;

            setFormData({
                nombre: prod.nombre || "",
                descripcion: prod.descripcion || "",
                caracteristicas: prod.caracteristicas || "",
                precio: prod.precio ? String(prod.precio) : "",
                precio_oferta: prod.precio_oferta ? String(prod.precio_oferta) : "",
                stock: prod.stock ? String(prod.stock) : "0",
                nuevo: prod.nuevo || false,
                agotado: prod.agotado || false,
                requiere_medida: prod.requiere_medida || false,
                activo: prod.activo !== false, // predeterminado true
            });

            const { data: imgs, error: errImgs } = await supabase
                .from("producto_imagenes")
                .select("*")
                .eq("producto_id", params.id)
                .order("orden", { ascending: true });

            if (errImgs) throw errImgs;
            setImagenesExistentes(imgs || []);

        } catch (err: any) {
            console.error(err);
            setError("Error al cargar el producto. Puede que no exista.");
        } finally {
            setCargando(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const comprimirImagen = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resolución máxima de 1200px para e-commerce web
                    const MAX_SIZE = 1200;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Comprimir a webp con 80% de calidad
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                                type: "image/webp",
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            resolve(file); // fallback
                        }
                    }, 'image/webp', 0.8);
                };
            };
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        // Validar que se hayan seleccionado imágenes
        const archivosValidos = files.filter(f => f.type.startsWith("image/"));

        if (archivosValidos.length !== files.length) {
            alert("Algunos archivos fueron ignorados. Solo se permiten imágenes.");
        }

        setCargando(true); // Opcional, para indicar que se están procesando

        // Compresión automática
        const archivosComprimidos = await Promise.all(
            archivosValidos.map(file => comprimirImagen(file))
        );

        setNuevasImagenes((prev) => [...prev, ...archivosComprimidos]);

        // Crear previews
        const nuevosPreviews = archivosComprimidos.map(file => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...nuevosPreviews]);

        if (fileInputRef.current) fileInputRef.current.value = "";
        setCargando(false);
    };

    const removerNuevaImagen = (index: number) => {
        setNuevasImagenes((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const eliminarImagenExistente = async (imgId: string, url: string) => {
        if (!confirm("¿Deseas eliminar esta imagen permanentemente?")) return;
        try {
            const res = await fetch(`/api/admin/productos/imagenes/${imgId}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al eliminar imagen");
            }

            setImagenesExistentes((prev) => prev.filter(img => img.id !== imgId));
        } catch (e: any) {
            console.error("Error al eliminar imagen", e);
            alert(e.message || "Error al eliminar imagen");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        setError("");

        try {
            const formDataPayload = new FormData();
            formDataPayload.append("nombre", formData.nombre);
            formDataPayload.append("descripcion", formData.descripcion || "");
            formDataPayload.append("caracteristicas", formData.caracteristicas || "");
            formDataPayload.append("precio", formData.precio.toString());
            if (formData.precio_oferta) {
                formDataPayload.append("precio_oferta", formData.precio_oferta.toString());
            }
            formDataPayload.append("stock", formData.stock.toString());
            formDataPayload.append("nuevo", formData.nuevo.toString());
            formDataPayload.append("agotado", formData.agotado.toString());
            formDataPayload.append("requiere_medida", formData.requiere_medida.toString());
            formDataPayload.append("activo", formData.activo.toString());

            formDataPayload.append("isNew", isNew.toString());
            formDataPayload.append("id", params.id);
            formDataPayload.append("ordenBase", imagenesExistentes.length.toString());

            // Append images array
            for (let i = 0; i < nuevasImagenes.length; i++) {
                formDataPayload.append("imagenes", nuevasImagenes[i]);
            }

            const res = await fetch("/api/admin/productos", {
                method: "POST",
                body: formDataPayload,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al guardar el producto");
            }

            router.push("/admin/productos");
            router.refresh();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error al guardar el producto");
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return <div className="p-8"><i className="ri-loader-4-line text-2xl animate-spin"></i> Cargando...</div>;
    }

    return (
        <div className="p-8 w-full max-w-4xl mx-auto space-y-6">
            <header className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-lorie-cream transition-colors text-lorie-brown"
                >
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-lorie-dark">
                        {isNew ? "Crear Nuevo Producto" : "Editar Producto"}
                    </h1>
                    <p className="font-sans text-lorie-brown/70 text-sm">
                        Completa los detalles de este producto para tu catálogo.
                    </p>
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-sans text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* GALERÍA */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-lorie-beige">
                    <h2 className="font-serif text-xl font-semibold text-lorie-dark mb-4">Galería de Imágenes</h2>

                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800">
                        <i className="ri-information-line text-xl flex-shrink-0"></i>
                        <div className="text-sm">
                            <p className="font-semibold mb-1">Optimización Automática Activada y Limpieza Activa</p>
                            <p>Las imágenes que subas aquí serán redimensionadas y convertidas a formato WEBP automáticamente para ahorrar el máximo espacio posible antes de enviarse al servidor. Además, cuando eliminas un producto, sus imágenes se borrarán del servidor para no acumular basura.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        {/* Existentes */}
                        {imagenesExistentes.map((img) => (
                            <div key={img.id} className="relative w-32 h-32 rounded-xl border border-lorie-beige overflow-hidden group">
                                <Image src={img.url_imagen} alt="Producto" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => eliminarImagenExistente(img.id, img.url_imagen)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                                >
                                    <i className="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        ))}

                        {/* Nuevas (Preview) */}
                        {previewUrls.map((url, idx) => (
                            <div key={idx} className="relative w-32 h-32 rounded-xl border-2 border-dashed border-lorie-brown/40 overflow-hidden group">
                                <Image src={url} alt="Nuevo" fill className="object-cover opacity-70" />
                                <button
                                    type="button"
                                    onClick={() => removerNuevaImagen(idx)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md"
                                >
                                    <i className="ri-close-line"></i>
                                </button>
                                <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] bg-black/50 text-white py-1">Por subir</span>
                            </div>
                        ))}

                        {/* Botón Agregar */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 rounded-xl border-2 border-dashed border-lorie-beige flex flex-col items-center justify-center text-lorie-brown hover:bg-lorie-cream transition-colors"
                        >
                            <i className="ri-image-add-line text-2xl mb-1"></i>
                            <span className="text-xs font-sans font-medium">Subir foto</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/webp, image/jpeg"
                            onChange={handleFileSelect}
                        />
                    </div>
                    <p className="text-xs font-sans text-lorie-brown/50">Recomendado: Imágenes cuadradas (1:1). Puedes subir casi cualquier imagen, nuestro optimizador hará el resto.</p>
                </div>

                {/* DETALLES PRINCIPALES */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-lorie-beige space-y-5">
                    <h2 className="font-serif text-xl font-semibold text-lorie-dark">Información Básica</h2>

                    <div>
                        <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Nombre del producto *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all font-medium"
                            placeholder="Ej. Cartera Modelo Sofia..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Precio Normal (S/) *</label>
                            <input
                                type="number"
                                name="precio"
                                step="0.01"
                                min="0"
                                value={formData.precio}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Precio Oferta (S/) (Opcional)</label>
                            <input
                                type="number"
                                name="precio_oferta"
                                step="0.01"
                                min="0"
                                value={formData.precio_oferta}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Stock Disponible *</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            rows={3}
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all resize-y"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Características Adicionales</label>
                        <textarea
                            name="caracteristicas"
                            rows={2}
                            value={formData.caracteristicas}
                            onChange={handleInputChange}
                            placeholder="Ej. Medidas: 20x30cm, Material: Cuero vegano..."
                            className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 transition-all resize-y"
                        ></textarea>
                    </div>
                </div>

                {/* ETIQUETAS Y ESTADOS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-lorie-beige">
                    <h2 className="font-serif text-xl font-semibold text-lorie-dark mb-4">Etiquetas y Configuración</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-lorie-beige hover:bg-lorie-cream/30 transition-colors cursor-pointer">
                            <input type="checkbox" name="nuevo" checked={formData.nuevo} onChange={handleInputChange} className="w-5 h-5 text-lorie-brown rounded focus:ring-lorie-brown" />
                            <div>
                                <span className="block font-sans font-medium text-lorie-dark">Marcar como "Nuevo"</span>
                                <span className="text-xs text-lorie-brown/60">Mostrará la etiqueta destacada en tienda.</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 rounded-xl border border-lorie-beige hover:bg-lorie-cream/30 transition-colors cursor-pointer">
                            <input type="checkbox" name="agotado" checked={formData.agotado} onChange={handleInputChange} className="w-5 h-5 text-lorie-brown rounded focus:ring-lorie-brown" />
                            <div>
                                <span className="block font-sans font-medium text-lorie-dark">Forzar Agotado</span>
                                <span className="text-xs text-lorie-brown/60">Bloquea la compra independiente del stock real.</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 rounded-xl border border-lorie-beige hover:bg-lorie-cream/30 transition-colors cursor-pointer">
                            <input type="checkbox" name="requiere_medida" checked={formData.requiere_medida} onChange={handleInputChange} className="w-5 h-5 text-lorie-brown rounded focus:ring-lorie-brown" />
                            <div>
                                <span className="block font-sans font-medium text-lorie-dark">Requiere Medida</span>
                                <span className="text-xs text-lorie-brown/60">Pide al usuario que ingrese pulgadas en el modal.</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 rounded-xl border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors cursor-pointer">
                            <input type="checkbox" name="activo" checked={formData.activo} onChange={handleInputChange} className="w-5 h-5 text-green-600 rounded focus:ring-green-600" />
                            <div>
                                <span className="block font-sans font-medium text-lorie-dark">Público (Activo)</span>
                                <span className="text-xs text-lorie-brown/60">Si se desmarca, el producto desaparece de la tienda.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-full font-sans font-medium text-lorie-brown hover:bg-lorie-cream transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={guardando}
                        className="px-8 py-3 rounded-full font-sans font-bold text-white bg-lorie-dark hover:bg-black transition-all shadow-md disabled:opacity-70 flex items-center gap-2"
                    >
                        {guardando ? (
                            <><i className="ri-loader-4-line animate-spin"></i> Guardando...</>
                        ) : (
                            <><i className="ri-save-line"></i> Guardar Producto</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
