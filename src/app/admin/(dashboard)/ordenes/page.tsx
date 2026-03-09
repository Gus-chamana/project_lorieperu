"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminOrdenesLista() {
    const [ordenes, setOrdenes] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const fetchOrdenes = async () => {
        setCargando(true);
        try {
            const { data, error } = await supabase
                .from("ordenes")
                .select(`
          *,
          cliente:clientes!cliente_id (*),
          direccion:direcciones!direccion_id (*)
        `)
                .order("creado_en", { ascending: false });

            if (error) throw error;
            setOrdenes(data || []);
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
            alert("No se pudieron cargar las órdenes. ¿Existen las relaciones en la base de datos?");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchOrdenes();
    }, []);

    // Función auxiliar para humanizar la fecha
    const getFecha = (isoString: string) => {
        return new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'America/Lima'
        }).format(new Date(isoString));
    };

    // Función para manejar el cambio de estado de pago
    const cambiarEstadoPago = async (id: string, nuevoEstado: string) => {
        if (!confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) return;

        try {
            setCargando(true);
            const res = await fetch(`/api/admin/ordenes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado_pago: nuevoEstado })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al actualizar la orden");
            }

            // Recargar órdenes tras el éxito
            await fetchOrdenes();
        } catch (error: any) {
            console.error("Error al cambiar estado de pago:", error);
            alert(`No se pudo cambiar el estado. Detalles: ${error.message}`);
            setCargando(false);
        }
    };

    return (
        <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-lorie-dark mb-1">
                        Órdenes Recibidas
                    </h1>
                    <p className="font-sans text-lorie-brown/70 text-sm">
                        Visualiza las compras verificadas y los datos de envío de los clientes.
                    </p>
                </div>
                <button
                    onClick={fetchOrdenes}
                    className="px-4 py-2 border border-lorie-beige bg-white hover:bg-lorie-cream text-lorie-dark rounded-full font-sans text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                    <i className="ri-refresh-line"></i> Actualizar
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-lorie-beige overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-lorie-cream/50 text-lorie-brown font-sans text-sm tracking-wide border-b border-lorie-beige/50">
                                <th className="py-4 px-6 font-medium whitespace-nowrap">ID / Fecha</th>
                                <th className="py-4 px-6 font-medium">Cliente</th>
                                <th className="py-4 px-6 font-medium">Contacto</th>
                                <th className="py-4 px-6 font-medium">Envío</th>
                                <th className="py-4 px-6 font-medium text-right">Total (S/)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lorie-beige/30">
                            {cargando ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-lorie-brown/50">
                                        <i className="ri-loader-4-line text-2xl animate-spin block mb-2"></i>
                                        Cargando órdenes de la base de datos...
                                    </td>
                                </tr>
                            ) : ordenes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-lorie-brown/50 font-sans">
                                        Aún no hay compras registradas.
                                    </td>
                                </tr>
                            ) : (
                                ordenes.map((orden) => (
                                    <tr key={orden.id} className="hover:bg-lorie-cream/10 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-mono text-xs font-semibold text-lorie-dark uppercase mb-1" title={orden.id}>
                                                #{orden.id.split('-')[0]}
                                            </p>
                                            <p className="text-xs text-lorie-brown/70 font-sans">{getFecha(orden.creado_en)}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-sans font-semibold text-lorie-dark">{orden.cliente?.nombre_completo || 'N/A'}</p>
                                            <p className="text-xs text-lorie-brown/70 font-sans mt-0.5">DNI: {orden.cliente?.dni || 'N/A'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-sans text-sm text-lorie-dark"><i className="ri-phone-line text-lorie-brown mr-1"></i> {orden.cliente?.celular || 'N/A'}</p>
                                            <p className="text-xs text-lorie-brown/70 font-sans mt-0.5"><i className="ri-mail-line text-lorie-brown mr-1"></i> {orden.cliente?.email || 'N/A'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-sans text-sm text-lorie-dark line-clamp-2 max-w-[250px]">{orden.direccion?.direccion || 'N/A'}</p>
                                            <p className="text-xs text-lorie-brown/70 font-sans font-semibold mt-0.5 uppercase tracking-wide">
                                                {orden.direccion?.tipo_envio?.replace('_', ' ') || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-sans font-bold text-lorie-dark text-lg block mb-2">S/ {orden.total.toFixed(2)}</span>

                                            <select
                                                value={orden.estado_pago}
                                                onChange={(e) => cambiarEstadoPago(orden.id, e.target.value)}
                                                className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm cursor-pointer outline-none border border-transparent hover:border-black/10 focus:ring-2 focus:ring-lorie-brown/30 font-sans right-0 ml-auto block appearance-none text-center ${orden.estado_pago === 'CONFIRMADO EL PAGO'
                                                    ? 'bg-green-50 text-green-700'
                                                    : orden.estado_pago === 'RECHAZADO'
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-yellow-50 text-yellow-700'
                                                    }`}
                                            >
                                                <option value="PENDIENTE" className="bg-white text-lorie-dark">Pendiente</option>
                                                <option value="VERIFICADO" className="bg-white text-lorie-dark">Confirmado el pago</option>
                                                <option value="RECHAZADO" className="bg-white text-lorie-dark">Rechazado</option>
                                            </select>
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
