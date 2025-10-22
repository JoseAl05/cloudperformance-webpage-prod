// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   // eslint: {
//   //   // Dangerously allow production builds to successfully complete even if
//   //   // your project has ESLint errors.
//   //   ignoreDuringBuilds: true,
//   // },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// export default nextConfig;
// next.config.ts
// next.config.ts
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  output: 'standalone',
  // ⚠️ Úsalo solo si tu CI se hace lento por el lint. En local mantenlo encendido.
  eslint: { ignoreDuringBuilds: true },
  modularizeImports: {
    'date-fns': { transform: 'date-fns/{{member}}' },
    lodash: { transform: 'lodash/{{member}}' },
    'lucide-react': { transform: 'lucide-react/icons/{{member}}' },
    echarts: { transform: 'echarts' },
  },
  compiler: {
    removeConsole: { exclude: ['error'] },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128],
    // Si un CDN externo ya optimiza imágenes, puedes desactivar el loader de Next:
    // unoptimized: true,
  },

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Úsalo solo si necesitas transpilar algún paquete ESM problemático:
  // transpilePackages: ['tu-paquete-esm'],
} satisfies NextConfig;

export default withBundleAnalyzer(nextConfig);
