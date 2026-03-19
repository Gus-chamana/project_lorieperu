"use client";
import { useEffect, useState } from "react";
import OrdenDetalleModal from "./OrdenDetalleModal";

export default function AdminOrdenesLista() {
    const [ordenes, setOrdenes] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [toast, setToast] = useState<string | null>(null);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState<any | null>(null);

    const fetchOrdenes = async () => {
        setCargando(true);
        try {
            const res = await fetch('/api/admin/ordenes');
            if (!res.ok) throw new Error('Error al cargar órdenes');
            const data = await res.json();
            setOrdenes(Array.isArray(data) ? data : []);
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

    const getFecha = (isoString: string) => {
        return new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'America/Lima'
        }).format(new Date(isoString));
    };

    const LABELS: Record<string, string> = {
        PENDIENTE: 'Pendiente',
        PAGADO: 'Pago Confirmado',
        RECHAZADO: 'Rechazado',
        FALLIDO: 'Cancelado',
        CANCELADO: 'Cancelado',
    };

    const cambiarEstadoPago = async (id: string, nuevoEstado: string) => {
        // Actualizar optimistamente la UI de inmediato (sin confirm ni espera)
        setOrdenes(prev =>
            prev.map(o => o.id === id ? { ...o, estado_pago: nuevoEstado } : o)
        );
        try {
            const res = await fetch(`/api/admin/ordenes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado_pago: nuevoEstado })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al actualizar la orden");
            }
            // Éxito: mostrar toast brevemente
            setToast(`Estado actualizado a "${LABELS[nuevoEstado] ?? nuevoEstado}"`);
            setTimeout(() => setToast(null), 2500);
        } catch (error: any) {
            console.error("Error al cambiar estado de pago:", error);
            // Revertir cambio optimista
            await fetchOrdenes();
            alert(`No se pudo cambiar el estado.\n${error.message}`);
        }
    };

    // Badge visual según el estado de pago
    const PagoBadge = ({ estado, ordenId }: { estado: string; ordenId: string }) => {
        const isConfirmado = estado === 'PAGADO';
        const isRechazado = estado === 'RECHAZADO';
        const isFallido = estado === 'FALLIDO';
        const isCancelado = estado === 'CANCELADO';

        return (
            <div className="flex flex-col items-end gap-2">
                {/* Badge visual destacado */}
                {isConfirmado && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">
                        <i className="ri-checkbox-circle-fill text-sm"></i>
                        Pago Confirmado
                    </span>
                )}
                {isRechazado && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">
                        <i className="ri-close-circle-fill text-sm"></i>
                        Pago Rechazado
                    </span>
                )}
                {isFallido && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">
                        <i className="ri-error-warning-fill text-sm"></i>
                        Fallido
                    </span>
                )}
                {isCancelado && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                        <i className="ri-forbid-line text-sm"></i>
                        Cancelado
                    </span>
                )}
                {!isConfirmado && !isRechazado && !isFallido && !isCancelado && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm">
                        <i className="ri-time-line text-sm"></i>
                        Pago Pendiente
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
            {/* Toast de confirmación */}
            {toast && (
                <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-sans text-sm flex items-center gap-2 animate-fade-in">
                    <i className="ri-checkbox-circle-fill text-lg"></i>
                    {toast}
                </div>
            )}
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
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-lorie-cream/50 text-lorie-brown font-sans text-sm tracking-wide border-b border-lorie-beige/50">
                                <th className="py-4 px-6 font-medium whitespace-nowrap">ID / Fecha</th>
                                <th className="py-4 px-6 font-medium">Cliente</th>
                                <th className="py-4 px-6 font-medium">Contacto</th>
                                <th className="py-4 px-6 font-medium">Envío</th>
                                <th className="py-4 px-6 font-medium text-right">Total (S/)</th>
                                <th className="py-4 px-6 font-medium text-right">Estado de Pago</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lorie-beige/30">
                            {cargando ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-lorie-brown/50">
                                        <i className="ri-loader-4-line text-2xl animate-spin block mb-2"></i>
                                        Cargando órdenes de la base de datos...
                                    </td>
                                </tr>
                            ) : ordenes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-lorie-brown/50 font-sans">
                                        Aún no hay compras registradas.
                                    </td>
                                </tr>
                            ) : (
                                ordenes.map((orden) => (
                                    <tr 
                                        key={orden.id} 
                                        onDoubleClick={() => setOrdenSeleccionada(orden)}
                                        className={`hover:bg-lorie-cream/10 transition-colors cursor-pointer ${orden.estado_pago === 'PAGADO' ? 'border-l-4 border-l-green-400' : orden.estado_pago === 'RECHAZADO' ? 'border-l-4 border-l-red-300' : 'border-l-4 border-l-yellow-300'}`}
                                    >
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
                                            <p className="font-sans text-sm text-lorie-dark"><i className="ri-phone-line text-lorie-brown mr-1"></i>{orden.cliente?.celular || 'N/A'}</p>
                                            <p className="text-xs text-lorie-brown/70 font-sans mt-0.5"><i className="ri-mail-line text-lorie-brown mr-1"></i>{orden.cliente?.email || 'N/A'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-sans text-sm text-lorie-dark line-clamp-2 max-w-[220px]">{orden.direccion?.direccion || 'N/A'}</p>
                                            <p className="text-xs text-lorie-brown/70 font-sans font-semibold mt-0.5 uppercase tracking-wide">
                                                {orden.direccion?.tipo_envio?.replace('_', ' ') || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-sans font-bold text-lorie-dark text-lg">S/ {orden.total.toFixed(2)}</span>
                                        </td>
                                        {/* Columna dedicada de Estado de Pago con badge visual */}
                                        <td className="py-4 px-6 text-right">
                                            <PagoBadge estado={orden.estado_pago} ordenId={orden.id} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Detalle de Orden */}
            {ordenSeleccionada && (
                <OrdenDetalleModal
                    orden={ordenSeleccionada}
                    onClose={() => setOrdenSeleccionada(null)}
                    onUpdate={(updatedOrden) => {
                        setOrdenSeleccionada(updatedOrden);
                        setOrdenes(prev => prev.map(o => o.id === updatedOrden.id ? updatedOrden : o));
                    }}
                />
            )}
        </div>
    );
}
