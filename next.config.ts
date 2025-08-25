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
};

export default nextConfig;
