import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.affaredoro.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'test-backend.affaredoro.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '89.116.134.164',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;