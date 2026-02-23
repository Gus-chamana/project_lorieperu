import type { Metadata } from 'next';
import ProductosClient from '../../views/productos/page';

export const metadata: Metadata = {
    title: 'Colección de Bolsos | Productos',
    description: 'Explora nuestra colección de bolsos de tela artesanales Lorie Perú. Diseños únicos como Masta y Valois. Compra con envío a todo el Perú.',
    openGraph: {
        title: 'Colección de Bolsos | Lorie Perú',
        description: 'Explora nuestra colección de bolsos de tela artesanales.',
        url: 'https://www.lorieperu.com/productos',
    },
};

export default function ProductosRoute() {
    return <ProductosClient />;
}
