import type { Metadata } from 'next';
import CursoClient from '../../views/curso/page';

export const metadata: Metadata = {
    title: 'Cursos de Bolsos Artesanales | Emprende',
    description: 'Aprende a diseñar y crear tus propios bolsos de tela con nuestro curso especializado presencial. Materiales incluidos. ¡Inicia tu propio negocio!',
    openGraph: {
        title: 'Curso de Diseño de Bolsos | Lorie Perú',
        description: 'Aprende a confeccionar bolsos desde cero y emprende con éxito.',
        url: 'https://www.lorieperu.com/curso',
    },
};

export default function CursoRoute() {
    return <CursoClient />;
}
