import type { Metadata } from 'next';
import ConfirmacionClient from '../../views/confirmacion/page';

export const metadata: Metadata = {
    title: 'Confirmación de Pedido | Lorie Perú',
    description: 'Tu pedido ha sido confirmado exitosamente.',
};

export default function ConfirmacionRoute() {
    return <ConfirmacionClient />;
}
