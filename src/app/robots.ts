import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lorieperu.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout/', '/admin/', '/pago/', '/confirmacion/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
