/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // Increase body size limit to 10MB
        },
    },
    images: {
        domains: ['drive.google.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
