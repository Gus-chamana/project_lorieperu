/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: true,
    images: {
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
                // Supabase Storage – reemplaza TU_PROJECT con tu Project Reference ID
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
    },
};

export default nextConfig;
