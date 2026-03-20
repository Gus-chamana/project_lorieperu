"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface OrdenDetalleModalProps {
    orden: any;
    onClose: () => void;
    onUpdate?: (orden: any) => void;
}

/**
 * Modal de detalle de orden para el panel administrativo.
 * Muestra todos los datos de la orden: cliente, dirección, items con foto, totales, estados.
 * Se renderiza via Portal para evitar problemas de stacking context.
 */
export default function OrdenDetalleModal({ orden, onClose, onUpdate }: OrdenDetalleModalProps) {
    const [estadoLocal, setEstadoLocal] = useState(orden.estado);
    const [estadoPagoLocal, setEstadoPagoLocal] = useState(orden.estado_pago);
    const [actualizando, setActualizando] = useState(false);
    const [actualizandoPago, setActualizandoPago] = useState(false);
    const [enviandoCorreo, setEnviandoCorreo] = useState(false);
    const [enviosCorreoCount, setEnviosCorreoCount] = useState(orden.envios_correo_count || 0);

    // Detectar si la orden fue pagada con QR
    const esQR = orden.estado_pago === 'REVISION_QR' || !!orden.comprobante_url;

    // Bloquear scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Escape para cerrar
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const getFecha = (iso: string) =>
        new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'long',
            timeStyle: 'short',
            timeZone: 'America/Lima',
        }).format(new Date(iso));

    const getEstadoPagoBadge = (estado: string) => {
        const map: Record<string, { bg: string; text: string; icon: string; label: string }> = {
            PAGADO: { bg: 'bg-green-100 border-green-200', text: 'text-green-700', icon: 'ri-checkbox-circle-fill', label: 'Pagado' },
            PENDIENTE: { bg: 'bg-yellow-100 border-yellow-200', text: 'text-yellow-700', icon: 'ri-time-line', label: 'Pendiente' },
            RECHAZADO: { bg: 'bg-red-100 border-red-200', text: 'text-red-700', icon: 'ri-close-circle-fill', label: 'Rechazado' },
            FALLIDO: { bg: 'bg-red-100 border-red-200', text: 'text-red-700', icon: 'ri-error-warning-fill', label: 'Fallido' },
            CANCELADO: { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600', icon: 'ri-forbid-line', label: 'Cancelado' },
            REVISION_QR: { bg: 'bg-orange-100 border-orange-200', text: 'text-orange-700', icon: 'ri-search-eye-line', label: 'En Revisión (QR)' },
        };
        const s = map[estado] || { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600', icon: 'ri-question-line', label: estado };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${s.bg} ${s.text}`}>
                <i className={`${s.icon} text-sm`}></i>{s.label}
            </span>
        );
    };

    // Retorna solo los estilos (sin JSX) para el select del estado de pago
    const getEstadoPagoBadgeStyle = (estado: string) => {
        const map: Record<string, { bg: string; text: string }> = {
            PAGADO: { bg: 'bg-green-100 border-green-200', text: 'text-green-700' },
            PENDIENTE: { bg: 'bg-yellow-100 border-yellow-200', text: 'text-yellow-700' },
            RECHAZADO: { bg: 'bg-red-100 border-red-200', text: 'text-red-700' },
            FALLIDO: { bg: 'bg-red-100 border-red-200', text: 'text-red-700' },
            CANCELADO: { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600' },
            REVISION_QR: { bg: 'bg-orange-100 border-orange-200', text: 'text-orange-700' },
        };
        return map[estado] || { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600' };
    };

    const getEstadoBadge = (estado: string) => {
        const map: Record<string, { bg: string; text: string; label: string }> = {
            PENDIENTE: { bg: 'bg-yellow-100 border-yellow-200', text: 'text-yellow-700', label: 'Pendiente' },
            PAGADO: { bg: 'bg-blue-100 border-blue-200', text: 'text-blue-700', label: 'Pagado' },
            ENVIADO: { bg: 'bg-indigo-100 border-indigo-200', text: 'text-indigo-700', label: 'Enviado' },
            ENTREGADO: { bg: 'bg-green-100 border-green-200', text: 'text-green-700', label: 'Entregado' },
            CANCELADO: { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600', label: 'Cancelado' },
        };
        const s = map[estado] || { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600', label: estado };
        return s;
    };

    const handleEstadoChange = async (nuevoEstado: string) => {
        if (nuevoEstado === estadoLocal || actualizando) return;
        setActualizando(true);
        try {
            const res = await fetch(`/api/admin/ordenes/${orden.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (!res.ok) throw new Error('Error al actualizar estado');
            
            setEstadoLocal(nuevoEstado);
            if (onUpdate) {
                onUpdate({ ...orden, estado: nuevoEstado });
            }
        } catch (error) {
            console.error(error);
            alert('No se pudo actualizar el estado del pedido');
            setEstadoLocal(orden.estado); // Revertir en caso de error
        } finally {
            setActualizando(false);
        }
    };

    // Handler para cambiar estado de pago (solo QR)
    // Si se pasa a PAGADO o CANCELADO, también sincroniza el estado del pedido
    const handleEstadoPagoChange = async (nuevoEstado: string) => {
        if (nuevoEstado === estadoPagoLocal || actualizandoPago) return;
        setActualizandoPago(true);
        try {
            // Determinar si también necesitamos cambiar el estado del pedido
            const updatePayload: Record<string, string> = { estado_pago: nuevoEstado };

            if (nuevoEstado === 'PAGADO') {
                updatePayload.estado = 'PAGADO';
            } else if (nuevoEstado === 'CANCELADO') {
                updatePayload.estado = 'CANCELADO';
            } else if (nuevoEstado === 'REVISION_QR') {
                updatePayload.estado = 'PENDIENTE';
            }

            const res = await fetch(`/api/admin/ordenes/${orden.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });
            if (!res.ok) throw new Error('Error al actualizar estado de pago');

            setEstadoPagoLocal(nuevoEstado);

            // Si también cambió el estado del pedido, sincronizar
            if (updatePayload.estado) {
                setEstadoLocal(updatePayload.estado);
            }

            if (onUpdate) {
                onUpdate({
                    ...orden,
                    estado_pago: nuevoEstado,
                    ...(updatePayload.estado ? { estado: updatePayload.estado } : {}),
                });
            }
        } catch (error) {
            console.error(error);
            alert('No se pudo actualizar el estado de pago');
            setEstadoPagoLocal(orden.estado_pago);
        } finally {
            setActualizandoPago(false);
        }
    };

    // Handler para enviar correo de confirmación QR
    const handleEnviarCorreo = async () => {
        if (enviandoCorreo) return;
        const emailCliente = cliente?.email;
        if (!emailCliente) {
            alert('Esta orden no tiene un email de cliente registrado.');
            return;
        }
        setEnviandoCorreo(true);
        try {
            const items = orden.orden_items || [];
            const payload = {
                email: emailCliente,
                nombre_completo: cliente?.nombre_completo || 'Cliente',
                numero_pedido: orden.id.split('-')[0],
                productos: items.map((item: any) => ({
                    nombre: item.nombre_producto_snapshot,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario_snapshot,
                    subtotal_linea: item.subtotal_linea,
                })),
                subtotal: orden.subtotal,
                monto_descuento: orden.monto_descuento || 0,
                costo_envio: orden.costo_envio,
                total: orden.total,
                direccion: direccion?.direccion || 'N/A',
                distrito: distritoNombre,
                tipo_envio: direccion?.tipo_envio || 'N/A',
                celular: cliente?.celular || 'N/A',
                nombre_agencia: direccion?.nombre_agencia || undefined,
                referencia: direccion?.referencia || undefined,
                metodo_pago: 'QR Izipay',
            };

            const res = await fetch('/api/email/confirmacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Error al enviar correo');

            const nextCount = enviosCorreoCount + 1;
            
            // Actualizar en base de datos globalmente
            await fetch(`/api/admin/ordenes/${orden.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ envios_correo_count: nextCount }),
            });

            setEnviosCorreoCount(nextCount);
            
            // Si hay una función onUpdate, podemos decirle al panel que recargue (opcional)
            if (onUpdate) {
                onUpdate({ ...orden, envios_correo_count: nextCount });
            }

        } catch (error) {
            console.error(error);
            alert('No se pudo enviar el correo de confirmación. Intenta de nuevo.');
        } finally {
            setEnviandoCorreo(false);
        }
    };

    const cliente = orden.cliente;
    const direccion = orden.direccion;
    const distritoNombre = direccion?.distrito?.nombre || 'N/A';
    const metodoEnvioNombre = orden.metodo_envio?.nombre || 'N/A';
    const codigoDescuento = orden.codigo_descuento;
    const items = orden.orden_items || [];

    const modalContent = (
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
            {/* Overlay */}
            <div
                style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                style={{ position: 'relative', zIndex: 1, backgroundColor: '#fff', borderRadius: '1.25rem', width: '100%', maxWidth: '56rem', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-lorie-beige/50 bg-lorie-cream/30">
                    <div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-lorie-dark">
                            Detalle de Orden
                        </h2>
                        <p className="font-mono text-xs text-lorie-brown/60 mt-0.5 uppercase">
                            #{orden.id.split('-')[0]} &middot; {getFecha(orden.creado_en)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-lorie-beige/50 transition-colors"
                    >
                        <i className="ri-close-line text-xl text-lorie-brown"></i>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 sm:px-8 py-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>

                    {/* Estados */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-2 relative">
                            <span className="text-xs font-sans text-lorie-brown/60 font-medium">Estado del pedido:</span>
                            <div className="relative">
                                {actualizando && (
                                    <div className="absolute inset-0 z-10 bg-white/50 rounded-full flex items-center justify-center">
                                        <i className="ri-loader-4-line animate-spin text-lorie-brown"></i>
                                    </div>
                                )}
                                <select
                                    value={estadoLocal}
                                    onChange={(e) => handleEstadoChange(e.target.value)}
                                    disabled={actualizando}
                                    className={`appearance-none outline-none cursor-pointer pr-8 pl-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${getEstadoBadge(estadoLocal).bg} ${getEstadoBadge(estadoLocal).text}`}
                                >
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="PAGADO">Pagado</option>
                                    <option value="ENVIADO">Enviado</option>
                                    <option value="ENTREGADO">Entregado</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </select>
                                <i className={`ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${getEstadoBadge(estadoLocal).text}`}></i>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-sans text-lorie-brown/60 font-medium">Estado de pago:</span>
                            {esQR ? (
                                /* Dropdown editable para pagos QR */
                                <div className="relative">
                                    {actualizandoPago && (
                                        <div className="absolute inset-0 z-10 bg-white/50 rounded-full flex items-center justify-center">
                                            <i className="ri-loader-4-line animate-spin text-lorie-brown"></i>
                                        </div>
                                    )}
                                    <select
                                        value={estadoPagoLocal}
                                        onChange={(e) => handleEstadoPagoChange(e.target.value)}
                                        disabled={actualizandoPago}
                                        className={`appearance-none outline-none cursor-pointer pr-8 pl-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                            getEstadoPagoBadgeStyle(estadoPagoLocal).bg
                                        } ${
                                            getEstadoPagoBadgeStyle(estadoPagoLocal).text
                                        }`}
                                    >
                                        <option value="REVISION_QR">En Revisión (QR)</option>
                                        <option value="PAGADO">Pagado</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                    <i className={`ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${getEstadoPagoBadgeStyle(estadoPagoLocal).text}`}></i>
                                </div>
                            ) : (
                                /* Badge read-only para pagos con tarjeta */
                                getEstadoPagoBadge(orden.estado_pago)
                            )}
                        </div>
                        {/* Badge de método de pago */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-sans text-lorie-brown/60 font-medium">Método:</span>
                            {esQR ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    <i className="ri-qr-code-line text-sm"></i>QR Izipay
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                    <i className="ri-bank-card-line text-sm"></i>Tarjeta
                                </span>
                            )}
                        </div>
                        {orden.proveedor_pago && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-sans text-lorie-brown/60 font-medium">Proveedor:</span>
                                <span className="text-xs font-sans font-semibold text-lorie-dark bg-lorie-beige/30 px-2 py-1 rounded">{orden.proveedor_pago}</span>
                            </div>
                        )}
                    </div>

                    {/* Grid: Cliente + Envío */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                        {/* Datos del cliente */}
                        <div className="bg-lorie-cream/20 rounded-xl border border-lorie-beige/40 p-5">
                            <h3 className="font-serif text-sm font-bold text-lorie-dark mb-3 flex items-center gap-2">
                                <i className="ri-user-3-line text-lorie-brown"></i>
                                Datos del Cliente
                            </h3>
                            <div className="space-y-2 text-sm font-sans">
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">Nombre</span>
                                    <span className="text-lorie-dark font-medium text-right">{cliente?.nombre_completo || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">DNI</span>
                                    <span className="text-lorie-dark font-mono font-medium">{cliente?.dni || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">Celular</span>
                                    <span className="text-lorie-dark font-medium">{cliente?.celular || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">Email</span>
                                    <span className="text-lorie-dark font-medium text-right break-all">{cliente?.email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Datos de envío */}
                        <div className="bg-lorie-cream/20 rounded-xl border border-lorie-beige/40 p-5">
                            <h3 className="font-serif text-sm font-bold text-lorie-dark mb-3 flex items-center gap-2">
                                <i className="ri-truck-line text-lorie-brown"></i>
                                Datos de Envío
                            </h3>
                            <div className="space-y-2 text-sm font-sans">
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">Tipo de envío</span>
                                    <span className="text-lorie-dark font-medium uppercase text-xs tracking-wide">
                                        {direccion?.tipo_envio?.replace('_', ' ') || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">Método</span>
                                    <span className="text-lorie-dark font-medium">{metodoEnvioNombre}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">Distrito</span>
                                    <span className="text-lorie-dark font-medium">{distritoNombre}</span>
                                </div>
                                <div>
                                    <span className="text-lorie-brown/60 block mb-1">Dirección</span>
                                    <span className="text-lorie-dark font-medium text-xs leading-relaxed block">
                                        {direccion?.direccion || 'N/A'}
                                    </span>
                                </div>
                                {direccion?.referencia && (
                                    <div>
                                        <span className="text-lorie-brown/60 block mb-1">Referencia</span>
                                        <span className="text-lorie-dark font-medium text-xs leading-relaxed block">{direccion.referencia}</span>
                                    </div>
                                )}
                                {direccion?.nombre_agencia && (
                                    <div className="flex justify-between">
                                        <span className="text-lorie-brown/60">Agencia</span>
                                        <span className="text-lorie-dark font-medium">{direccion.nombre_agencia}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="mb-6">
                        <h3 className="font-serif text-sm font-bold text-lorie-dark mb-4 flex items-center gap-2">
                            <i className="ri-shopping-bag-3-line text-lorie-brown"></i>
                            Productos ({items.length})
                        </h3>
                        <div className="space-y-3">
                            {items.map((item: any, idx: number) => {
                                // Extraer la URL de la imagen (de la relación producto_imagenes si existe)
                                const imageUrl = item.producto?.producto_imagenes?.[0]?.url_imagen || null;
                                return (
                                    <div
                                        key={item.id || idx}
                                        className="flex items-center gap-4 bg-white rounded-xl border border-lorie-beige/30 p-3 sm:p-4 hover:shadow-sm transition-shadow"
                                    >
                                        {/* Imagen del producto */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-lorie-cream/50 border border-lorie-beige/20">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.nombre_producto_snapshot}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <i className="ri-image-line text-2xl text-lorie-beige"></i>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info del producto */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans font-semibold text-sm text-lorie-dark truncate">
                                                {item.nombre_producto_snapshot}
                                            </p>
                                            <p className="text-xs text-lorie-brown/60 font-sans mt-0.5">
                                                Cantidad: {item.cantidad} &middot; S/ {item.precio_unitario_snapshot.toFixed(2)} c/u
                                            </p>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-sans font-bold text-sm text-lorie-dark">
                                                S/ {item.subtotal_linea.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resumen de totales */}
                    <div className="bg-lorie-cream/30 rounded-xl border border-lorie-beige/40 p-5">
                        <h3 className="font-serif text-sm font-bold text-lorie-dark mb-3 flex items-center gap-2">
                            <i className="ri-file-list-3-line text-lorie-brown"></i>
                            Resumen de Pago
                        </h3>
                        <div className="space-y-2 text-sm font-sans">
                            <div className="flex justify-between">
                                <span className="text-lorie-brown/60">Subtotal</span>
                                <span className="text-lorie-dark font-medium">S/ {orden.subtotal.toFixed(2)}</span>
                            </div>
                            {orden.monto_descuento > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-lorie-brown/60">
                                        Descuento
                                        {codigoDescuento && (
                                            <span className="ml-1 text-xs font-mono bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                                {codigoDescuento.codigo} ({codigoDescuento.tipo_descuento === 'PORCENTAJE' ? `${codigoDescuento.valor}%` : `S/ ${codigoDescuento.valor}`})
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-green-600 font-medium">- S/ {orden.monto_descuento.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-lorie-brown/60">Costo de envío</span>
                                <span className="text-lorie-dark font-medium">
                                    {orden.costo_envio > 0 ? `S/ ${orden.costo_envio.toFixed(2)}` : 'Gratis'}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-lorie-beige/40">
                                <span className="text-lorie-dark font-bold text-base">Total</span>
                                <span className="text-lorie-dark font-bold text-lg">S/ {orden.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Comprobante de pago QR */}
                    {orden.comprobante_url && (
                        <div className="mb-6">
                            <h3 className="font-serif text-sm font-bold text-lorie-dark mb-3 flex items-center gap-2">
                                <i className="ri-image-line text-lorie-brown"></i>
                                Comprobante de Pago (QR)
                            </h3>
                            <div className="bg-lorie-cream/20 rounded-xl border border-lorie-beige/40 p-4">
                                <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden border border-lorie-beige/30">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={orden.comprobante_url}
                                        alt="Comprobante de pago"
                                        className="w-full h-auto"
                                    />
                                </div>
                                <a
                                    href={orden.comprobante_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-sans font-medium transition-colors"
                                >
                                    <i className="ri-external-link-line"></i>
                                    Ver imagen completa
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Botón de enviar correo de confirmación (solo QR con pago confirmado) */}
                    {esQR && (
                        <div className="mb-6">
                            <button
                                onClick={handleEnviarCorreo}
                                disabled={enviandoCorreo}
                                className={`w-full py-3.5 px-6 rounded-xl font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm ${
                                    enviandoCorreo
                                        ? 'bg-lorie-cream text-lorie-brown/50 border border-lorie-beige cursor-wait'
                                        : enviosCorreoCount > 0
                                            ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 hover:shadow-md cursor-pointer'
                                            : 'bg-gradient-to-r from-[#c4a38c] to-[#a67c7c] text-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                                }`}
                            >
                                {enviandoCorreo ? (
                                    <>
                                        <i className="ri-loader-4-line text-base animate-spin"></i>
                                        Enviando correo...
                                    </>
                                ) : enviosCorreoCount > 0 ? (
                                    <>
                                        <i className="ri-checkbox-circle-fill text-base"></i>
                                        {enviosCorreoCount === 1 
                                            ? 'Correo enviado (clic para reenviar)' 
                                            : `Correo enviado ${enviosCorreoCount} veces (clic para reenviar)`}
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-mail-send-line text-base"></i>
                                        Enviar correo de confirmación de pago
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-lorie-brown/40 font-sans mt-2 text-center">
                                Se enviará a: <strong className="text-lorie-brown/60">{cliente?.email || 'Sin email'}</strong>
                            </p>
                        </div>
                    )}

                    {/* ID completo */}
                    <div className="mt-5 pt-4 border-t border-lorie-beige/30">
                        <p className="text-xs text-lorie-brown/40 font-sans font-mono break-all">
                            ID completo: {orden.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
