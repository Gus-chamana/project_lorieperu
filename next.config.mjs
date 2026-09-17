/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.readdy.ai',
            },
            {
                protocol: 'https',
                hostname: 'readdy.ai',
            },
            {
                // Supabase Storage – ID específico del proyecto (antes era wildcard *.supabase.co)
                protocol: 'https',
                hostname: 'sfpjbtvoulmxldwfstnr.supabase.co',
            },
        ],
    },
    // Headers de seguridad HTTP
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff', // Previene MIME type sniffing
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY', // Previene clickjacking (no permitir iframes)
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin', // Controla qué info se envía en el header Referer
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

