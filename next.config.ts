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
        hostname: 'affari-doro-backend.shubhexchange.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;