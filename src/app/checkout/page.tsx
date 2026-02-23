import PreCheckout from '@/views/checkout/PreCheckout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Finalizar Pedido – Lorie Perú',
    description: 'Completa tu pedido de carteras artesanales Lorie Perú. Envío a Lima y provincias.',
    robots: 'noindex', // No indexar páginas de checkout
};

export default function CheckoutPage() {
    return <PreCheckout />;
}
