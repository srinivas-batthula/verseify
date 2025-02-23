/** @type {import('next').NextConfig} */
const nextPWA = (config) => {
    const pwaConfig = {
        dest: 'public',
        register: true,
        skipWaiting: true,
        disable: process.env.NODE_ENV === 'development',
        customWorkerDir: 'public'
    };

    // Merge the Next.js config with PWA settings
    return Object.assign({}, config, {
        pwa: pwaConfig
    });
};

const nextConfig = nextPWA({
    basePath: '/verseify',
    assetPrefix: '/verseify',
    trailingSlash: true,
    reactStrictMode: true
});


export default nextConfig
