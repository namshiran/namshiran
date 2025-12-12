import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Turbopack/Next Image can be picky about remote host allow-lists.
    // Keep both `domains` and `remotePatterns` for maximum compatibility.
    domains: [
      'f.nooncdn.com',
      'a.nooncdn.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'plus.unsplash.com',
      'images.pexels.com',
    ],
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
