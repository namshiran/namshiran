import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from our own API proxy and other sources
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/image',
      },
      {
        protocol: 'https',
        hostname: 'namshiran.vercel.app',
        pathname: '/api/image',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
