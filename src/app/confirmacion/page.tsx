import type { Metadata } from 'next';
import { Suspense } from 'react';
import ConfirmacionClient from '../../views/confirmacion/page';

export const metadata: Metadata = {
    title: 'Confirmación de Pedido | Lorie Perú',
    description: 'Tu pedido ha sido confirmado exitosamente.',
};

// Suspense es requerido por Next.js App Router cuando el componente cliente
// usa useSearchParams() para leer el query param ?orden=ID de Izipay
export default function ConfirmacionRoute() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-lorie-cream flex items-center justify-center">
                <p className="text-lorie-brown font-sans text-sm">Cargando confirmación...</p>
            </div>
        }>
            <ConfirmacionClient />
        </Suspense>
    );
}
