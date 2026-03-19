"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';

interface PagoPendienteModalProps {
    visible: boolean;
    ordenId: string;
    onClose: () => void;
    onDescartar: () => void;
}

/**
 * Modal reutilizable que avisa al usuario que tiene un pago pendiente.
 * Usa React Portal (createPortal) para renderizarse directamente en document.body,
 * evitando problemas de stacking context con transforms de componentes padres.
 */
export default function PagoPendienteModal({ visible, ordenId, onClose, onDescartar }: PagoPendienteModalProps) {
    const router = useRouter();
    const { clearCart } = useCart();
    const [mounted, setMounted] = useState(false);

    // Solo renderizar el portal en el cliente
    useEffect(() => {
        setMounted(true);
    }, []);

    // Bloquear scroll del body cuando el modal está visible
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [visible]);

    const handleDescartar = async () => {
        // Cancelar la orden en Supabase (marcarla como CANCELADO)
        try {
            await fetch(`/api/ordenes/${ordenId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accion: 'cancelar' }),
            });
        } catch {
            console.error('No se pudo cancelar la orden en el servidor');
        }

        localStorage.removeItem('pago_pendiente_orden_id');
        clearCart();
        onDescartar();
    };

    const handleRetomar = () => {
        router.push(`/pago/${ordenId}`);
    };

    // No renderizar en SSR ni si no está montado
    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    {/* Overlay opaco */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onClick={onClose}
                    />

                    {/* Contenido del modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            backgroundColor: '#ffffff',
                            borderRadius: '1rem',
                            width: '100%',
                            maxWidth: '28rem',
                            padding: '1.5rem',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icono */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center bg-amber-100 rounded-full">
                            <i className="ri-time-line text-2xl sm:text-3xl text-amber-600"></i>
                        </div>

                        {/* Título */}
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-center text-lorie-dark mb-2">
                            Tienes un pago pendiente
                        </h3>

                        {/* Descripción */}
                        <p className="text-xs sm:text-sm text-lorie-brown/70 font-sans text-center leading-relaxed mb-5 sm:mb-6 px-2">
                            Tu pedido <strong className="font-mono text-lorie-dark">#{ordenId.split('-')[0].toUpperCase()}</strong> aún no ha sido pagado.
                            Puedes retomar el pago o descartarlo para hacer un nuevo pedido.
                        </p>

                        {/* Botones */}
                        <div className="flex flex-col gap-2.5 sm:gap-3">
                            <button
                                onClick={handleRetomar}
                                className="w-full px-5 py-3 bg-amber-600 text-white text-sm font-sans font-bold rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="ri-secure-payment-line"></i>
                                Retomar pago
                            </button>
                            <button
                                onClick={handleDescartar}
                                className="w-full px-5 py-3 border border-amber-300 text-amber-700 text-sm font-sans font-semibold rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="ri-close-circle-line"></i>
                                Descartar y hacer nuevo pedido
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-2 text-xs text-lorie-brown/50 font-sans hover:text-lorie-brown transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Renderizar con Portal directamente en document.body
    // Esto evita problemas de stacking context con transforms de componentes padres
    return createPortal(modalContent, document.body);
}
