import type { Metadata } from 'next';
import CarritoClient from '../../views/carrito/page';

export const metadata: Metadata = {
    title: 'Carrito de Compras | Lorie Perú',
    description: 'Revisa los productos en tu carrito de compras antes de realizar el pedido.',
};

export default function CarritoRoute() {
    return <CarritoClient />;
}
