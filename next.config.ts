import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    // !! WARN !!
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Esto ignora TODOS los errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://20.81.178.168:8070/api/:path*', // backend sin HTTPS
      },
    ];
  },
};

export default nextConfig;
