import type { NextConfig } from 'next';

const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // 仅在显式开启时使用静态导出，避免禁用 API Routes（如 /api/ai/recommend）
  ...(isStaticExport ? { output: 'export' as const } : {}),
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  experimental: {},
  async redirects() {
    return [
      {
        source: '/deadlines',
        destination: '/activities',
        permanent: true,
      },
      {
        source: '/deadlines/:path*',
        destination: '/activities/:path*',
        permanent: true,
      },
      {
        source: '/Barrier-Free-Bites',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/Barrier-Free-Bites/:path*',
        destination: '/restaurants/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
