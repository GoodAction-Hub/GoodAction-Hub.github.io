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
  redirects: async () => [
    {
      source: '/',
      destination: '/zh-CN',
      permanent: false,
    },
    {
      source: '/deadlines',
      destination: '/zh-CN/activities',
      permanent: true,
    },
    {
      source: '/Barrier-Free-Bites',
      destination: '/zh-CN/restaurants',
      permanent: true,
    },
    {
      source: '/activities/:path*',
      destination: '/zh-CN/activities/:path*',
      permanent: true,
    },
    {
      source: '/restaurants/:path*',
      destination: '/zh-CN/restaurants/:path*',
      permanent: true,
    },
    {
      source: '/tutoring/:path*',
      destination: '/zh-CN/tutoring/:path*',
      permanent: true,
    },
    {
      source: '/recommend',
      destination: '/zh-CN/recommend',
      permanent: true,
    },
    {
      source: '/home',
      destination: '/zh-CN/home',
      permanent: true,
    },
    {
      source: '/origin',
      destination: '/zh-CN/origin',
      permanent: true,
    },
  ],
};

export default nextConfig;
