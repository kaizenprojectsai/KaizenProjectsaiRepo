import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['hyxtimymluoogsbaheuu.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
