/** @type {import('next').NextConfig} */

const nextConfig = {
    basePath:'/verseify',
    assetPrefix:'/verseify',
    trailingSlash: true,
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com'], // Allow Cloudinary images
    },
}

export default nextConfig;
