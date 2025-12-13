import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local API images with query strings
    localPatterns: [
      {
        pathname: '/api/image',
        search: '**',
      },
    ],
    // Allow images from other sources
    remotePatterns: [
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
