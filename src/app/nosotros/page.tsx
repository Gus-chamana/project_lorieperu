import type { Metadata } from 'next';
import NosotrosClient from '../../views/nosotros/page';

export const metadata: Metadata = {
    title: 'Sobre Nosotros | Historia',
    description: 'Conoce la historia detrás de Lorie Perú, nuestra pasión por el diseño de bolsos artesanales y el compromiso con la elegancia y dedicación peruana.',
    openGraph: {
        title: 'Sobre Nosotros | Lorie Perú',
        description: 'Nuestra pasión por el diseño de bolsos artesanales en el Perú.',
        url: 'https://www.lorieperu.com/nosotros',
    },
};

export default function NosotrosRoute() {
    return <NosotrosClient />;
}
