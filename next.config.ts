import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 prefers `remotePatterns` over the deprecated `domains`.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'f.nooncdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.nooncdn.com',
        pathname: '/**',
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
