import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // eslint: {
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['newrelic']
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     // Asegurar que newrelic no sea empaquetado por webpack
  //     config.externals = config.externals || [];
  //     config.externals.push('newrelic');
  //   }
  //   return config;
  // },

};

export default nextConfig;