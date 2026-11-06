/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/deck', destination: '/deck.html' },
      { source: '/preview', destination: '/video-preview.html' },
      { source: '/video', destination: '/video-preview.html' },
      { source: '/demo', destination: '/demo-live.html' },
    ];
  },
}

export default nextConfig
