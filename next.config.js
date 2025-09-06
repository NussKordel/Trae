/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 14, no experimental flag needed
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Optimize bundle analyzer
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add any custom webpack configuration here
    return config;
  },
};

module.exports = nextConfig;