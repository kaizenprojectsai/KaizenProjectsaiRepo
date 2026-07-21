/** @type {import('next').NextConfig} */
const nextConfig = {
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
