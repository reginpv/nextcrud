import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  // Required to enable the 'use cache' directive and Cache Components (PPR)
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tosysoik0rjt4ojn.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
