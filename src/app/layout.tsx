import type { Metadata } from 'next';
import { Cormorant, Montserrat, Cormorant_Garamond, Pinyon_Script, Lora } from 'next/font/google';
import ClientProviders from './ClientProviders';
import CookieBanner from '@/components/feature/CookieBanner';
import '../index.css';

const cormorant = Cormorant({
    subsets: ['latin'],
    weight: ['300', '400', '600', '700'],
    display: 'swap',
    variable: '--font-cormorant'
});
const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-montserrat'
});
const cormorantGaramond = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-cormorant-garamond'
});
const pinyonScript = Pinyon_Script({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-pinyon-script'
});
const lora = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-lora'
});

export const metadata: Metadata = {
    title: {
        default: 'Lorie Perú - Diseño de Bolsos Exclusivos',
        template: '%s | Lorie Perú',
    },
    description: 'Descubre nuestra colección de bolsos exclusivos de Lorie Perú. Diseño elegante, calidad premium y modelos como Masta y Valois. Compra online en Perú.',
    openGraph: {
        title: 'Lorie Perú - Diseño de Bolsos Exclusivos',
        description: 'Descubre nuestra colección de bolsos exclusivos de Lorie Perú. Diseño espectacular y calidad premium.',
        url: 'https://www.lorieperu.com',
        siteName: 'Lorie Perú',
        images: [
            {
                url: 'https://static.readdy.ai/lorie-og-image.jpg', // Placeholder, replace with actual brand hero image
                width: 1200,
                height: 630,
                alt: 'Lorie Perú - Diseños Exclusivos',
            },
        ],
        locale: 'es_PE',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lorie Perú - Diseño de Bolsos Exclusivos',
        description: 'Descubre nuestra colección de bolsos artesanales y elegantes en Perú.',
        images: ['https://static.readdy.ai/lorie-og-image.jpg'], // Placeholder
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="overflow-x-hidden">
            <head>
                {/* Remix Icon */}
                <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet" />
                {/* Favicon */}
                <link rel="icon" href="/logo.ico" type="image/x-icon" />
                <link rel="shortcut icon" href="/logo.ico" />
            </head>
            <body className={`${cormorant.variable} ${montserrat.variable} ${cormorantGaramond.variable} ${pinyonScript.variable} ${lora.variable} font-sans bg-lorie-cream text-lorie-dark antialiased overflow-x-hidden w-full`}>
                {/* Renderizado de las páginas y componentes preservando la estructura actual */}
                <ClientProviders>
                    {children}
                    <CookieBanner />
                </ClientProviders>
            </body>
        </html>
    );
}
