/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',            // Service worker will be generated in the public folder
    register: true,            // Automatically registers the service worker
    skipWaiting: true,         // Activate the new SW immediately after install
    disable: process.env.NODE_ENV === 'development',  // Disable in dev mode
    customWorkerDir: 'public'  // Enable custom service worker
});

const nextConfig = withPWA({
    basePath: '/verseify',
    assetPrefix: '/verseify',
    trailingSlash: true,
    reactStrictMode: true,
});

export default nextConfig;
