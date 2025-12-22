import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },

  // Image optimization
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },

  // API Proxy Rewrites - Forward /api/* to FastAPI backend
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Output configuration for deployment
  output: 'standalone',

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false, // Changed to false for production
  },
};

export default nextConfig;

