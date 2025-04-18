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
        protocol: 'http',
        hostname: '89.116.134.164',
        port: '8000',
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