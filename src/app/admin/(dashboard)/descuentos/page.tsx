"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBannerDescuentos() {
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensajeObj, setMensajeObj] = useState("");

    const [formData, setFormData] = useState({
        texto_principal: "CELEBRA EL DÍA DE LA MUJER",
        descuento_porcentaje: "50",
        codigo_cupon: "MUJER50",
        activo: true
    });

    const fetchConfig = async () => {
        try {
            const { data, error } = await supabase
                .from("configuracion_tienda")
                .select("*")
                .eq("llave", "promo_banner")
                .single();

            if (error && error.code !== "PGRST116") throw error; // PGRST116 = NO ROW

            if (data && data.valor) {
                setFormData({
                    texto_principal: data.valor.texto_principal || "",
                    descuento_porcentaje: data.valor.descuento_porcentaje || "",
                    codigo_cupon: data.valor.codigo_cupon || "",
                    activo: data.valor.activo !== false
                });
            }
        } catch (e: any) {
            console.error(e);
            setError("No se pudo cargar la configuración actual. Asegúrate de tener la tabla configuracion_tienda.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        setError("");
        setMensajeObj("");

        try {
            const res = await fetch("/api/admin/descuentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Falló al guardar la configuración");
            }

            setMensajeObj("¡Configuración guardada exitosamente! Los cambios ya son visibles en la tienda.");

        } catch (e: any) {
            console.error(e);
            setError(e.message || "Falló al guardar la configuración.");
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return <div className="p-8">Cargando...</div>;

    return (
        <div className="p-8 w-full max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-serif font-bold text-lorie-dark mb-1">
                    Barra de Promoción Principal
                </h1>
                <p className="font-sans text-lorie-brown/70 text-sm">
                    Edita el mensaje que aparece en la parte superior del sitio web para eventos o feriados.
                </p>
            </header>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
            {mensajeObj && <div className="p-4 bg-green-50 justify-center flex text-green-700 rounded-xl text-sm font-semibold"><i className="ri-check-line mr-2"></i>{mensajeObj}</div>}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-lorie-beige">
                <div className="mb-6 pb-6 border-b border-lorie-beige">
                    <h3 className="text-sm font-semibold text-lorie-brown mb-4 uppercase tracking-wider">Vista Previa Dinámica</h3>

                    {/* Componente visual idéntico al navbar real */}
                    <div className={`w-full py-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg flex items-center justify-center transition-opacity ${formData.activo ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <div className="flex items-center gap-2 text-center">
                            <i className="ri-gift-line text-sm hidden sm:block"></i>
                            <p className="text-xs font-medium tracking-wide">
                                <span className="font-semibold uppercase">{formData.texto_principal || '_____'}</span> con {formData.descuento_porcentaje || '0'}% de descuento usando el código{' '}
                                <span className="inline-block px-2 py-0.5 bg-white/20 rounded font-bold text-yellow-300 mx-1 text-xs uppercase">
                                    {formData.codigo_cupon || 'CUPÓN'}
                                </span>
                            </p>
                            <i className="ri-gift-line text-sm hidden sm:block"></i>
                        </div>
                    </div>
                    {!formData.activo && <p className="text-center text-xs mt-2 text-red-500 font-semibold">El banner actualmente NO es visible en el frontend.</p>}
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Festividad o Anuncio Principal (Mayúsculas recomendadas)</label>
                        <input
                            type="text"
                            name="texto_principal"
                            value={formData.texto_principal}
                            onChange={handleChange}
                            required
                            maxLength={45}
                            className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50"
                            placeholder="Ej. CELEBRA EL DÍA DE LA MADRE"
                        />
                        <p className="text-xs text-lorie-brown/50 mt-1">Máximo 45 caracteres para evitar romper el diseño en móviles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Porcentaje de Descuento (%)</label>
                            <input
                                type="number"
                                name="descuento_porcentaje"
                                value={formData.descuento_porcentaje}
                                onChange={handleChange}
                                min="1" max="100"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-sans font-semibold text-lorie-dark mb-1">Código del Cupón</label>
                            <input
                                type="text"
                                name="codigo_cupon"
                                value={formData.codigo_cupon}
                                onChange={handleChange}
                                required
                                style={{ textTransform: "uppercase" }}
                                className="w-full px-4 py-3 rounded-xl border border-lorie-beige bg-lorie-cream/30 text-lorie-dark font-sans text-sm focus:outline-none focus:ring-2 focus:ring-lorie-brown/50 uppercase"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-lorie-beige">
                        <label className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer w-full md:w-1/2">
                            <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600" />
                            <div>
                                <span className="block font-sans font-medium text-blue-900">Activar y Mostrar en Tienda</span>
                                <span className="text-xs text-blue-700/60">Quita el check para esconderlo temporalmente.</span>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={guardando}
                            className="px-8 py-3 rounded-full font-sans font-bold text-white bg-lorie-dark hover:bg-black transition-all shadow-md disabled:opacity-70 flex items-center gap-2"
                        >
                            {guardando ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-save-line"></i>}
                            Aplicar Cambios Publicamente
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}
